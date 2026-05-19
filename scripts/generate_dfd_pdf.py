from pathlib import Path
import textwrap


ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "docs" / "current-project-dfd.pdf"

PAGE_W = 595
PAGE_H = 842
MARGIN = 42


def pdf_escape(value: str) -> str:
    return value.replace("\\", "\\\\").replace("(", "\\(").replace(")", "\\)")


class PdfBuilder:
    def __init__(self):
        self.objects = []
        self.pages = []

    def add_object(self, data):
        self.objects.append(data)
        return len(self.objects)

    def add_page(self, content: str):
        stream = f"<< /Length {len(content.encode('utf-8'))} >>\nstream\n{content}\nendstream"
        content_id = self.add_object(stream)
        page_id = self.add_object(
            f"<< /Type /Page /Parent 0 0 R /MediaBox [0 0 {PAGE_W} {PAGE_H}] "
            f"/Resources << /Font << /F1 0 0 R /F2 0 0 R >> >> "
            f"/Contents {content_id} 0 R >>"
        )
        self.pages.append(page_id)
        return page_id

    def build(self) -> bytes:
        font_regular = self.add_object("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>")
        font_bold = self.add_object("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>")

        kids = " ".join(f"{page_id} 0 R" for page_id in self.pages)
        pages_id = self.add_object(
            f"<< /Type /Pages /Kids [{kids}] /Count {len(self.pages)} >>"
        )

        for page_id in self.pages:
            self.objects[page_id - 1] = self.objects[page_id - 1].replace(
                "/Parent 0 0 R", f"/Parent {pages_id} 0 R"
            ).replace("/F1 0 0 R", f"/F1 {font_regular} 0 R").replace(
                "/F2 0 0 R", f"/F2 {font_bold} 0 R"
            )

        catalog_id = self.add_object(f"<< /Type /Catalog /Pages {pages_id} 0 R >>")

        out = [b"%PDF-1.4\n%\xe2\xe3\xcf\xd3\n"]
        offsets = [0]
        current = len(out[0])

        for index, obj in enumerate(self.objects, start=1):
            offsets.append(current)
            chunk = f"{index} 0 obj\n{obj}\nendobj\n".encode("utf-8")
            out.append(chunk)
            current += len(chunk)

        xref_offset = current
        xref = [f"xref\n0 {len(self.objects) + 1}\n", "0000000000 65535 f \n"]
        for offset in offsets[1:]:
            xref.append(f"{offset:010d} 00000 n \n")
        trailer = (
            f"trailer\n<< /Size {len(self.objects) + 1} /Root {catalog_id} 0 R >>\n"
            f"startxref\n{xref_offset}\n%%EOF\n"
        )

        out.append("".join(xref).encode("utf-8"))
        out.append(trailer.encode("utf-8"))
        return b"".join(out)


class Canvas:
    def __init__(self):
        self.ops = []

    def rect(self, x, y, w, h, stroke=0.6, fill_rgb=None, stroke_rgb=(0.24, 0.3, 0.42), radius=0):
        if fill_rgb is not None:
            self.ops.append(f"{fill_rgb[0]} {fill_rgb[1]} {fill_rgb[2]} rg")
        self.ops.append(f"{stroke_rgb[0]} {stroke_rgb[1]} {stroke_rgb[2]} RG")
        self.ops.append(f"{stroke} w")
        self.ops.append(f"{x} {y} {w} {h} re B")

    def line(self, x1, y1, x2, y2, stroke=0.8, stroke_rgb=(0.32, 0.44, 0.69)):
        self.ops.append(f"{stroke_rgb[0]} {stroke_rgb[1]} {stroke_rgb[2]} RG")
        self.ops.append(f"{stroke} w")
        self.ops.append(f"{x1} {y1} m {x2} {y2} l S")

    def arrow(self, x1, y1, x2, y2, label=None, label_x=None, label_y=None):
        self.line(x1, y1, x2, y2)
        dx = x2 - x1
        dy = y2 - y1
        length = max((dx * dx + dy * dy) ** 0.5, 0.001)
        ux = dx / length
        uy = dy / length
        size = 7
        left_x = x2 - ux * size - uy * 3
        left_y = y2 - uy * size + ux * 3
        right_x = x2 - ux * size + uy * 3
        right_y = y2 - uy * size - ux * 3
        self.line(x2, y2, left_x, left_y)
        self.line(x2, y2, right_x, right_y)
        if label:
            self.text(label_x if label_x is not None else (x1 + x2) / 2,
                      label_y if label_y is not None else (y1 + y2) / 2 + 4,
                      label, size=8, font="F1", align="center", color=(0.17, 0.23, 0.35))

    def text(self, x, y, value, size=11, font="F1", align="left", color=(0.06, 0.09, 0.16)):
        safe = pdf_escape(value)
        width = len(value) * size * 0.48
        tx = x
        if align == "center":
            tx = x - width / 2
        elif align == "right":
            tx = x - width
        self.ops.append("BT")
        self.ops.append(f"/{font} {size} Tf")
        self.ops.append(f"{color[0]} {color[1]} {color[2]} rg")
        self.ops.append(f"1 0 0 1 {tx} {y} Tm")
        self.ops.append(f"({safe}) Tj")
        self.ops.append("ET")

    def multiline(self, x, y, text, width_chars=92, size=10, leading=14, font="F1", color=(0.16, 0.2, 0.28)):
        cursor = y
        for paragraph in text.split("\n"):
            lines = textwrap.wrap(paragraph, width=width_chars) if paragraph else [""]
            for line in lines:
                self.text(x, cursor, line, size=size, font=font, color=color)
                cursor -= leading
            cursor -= 2
        return cursor

    def box(self, x, y, w, h, title, lines, fill=(0.95, 0.97, 1.0), title_fill=(0.85, 0.91, 1.0)):
        self.rect(x, y, w, h, fill_rgb=fill)
        self.rect(x, y + h - 22, w, 22, fill_rgb=title_fill)
        self.text(x + 8, y + h - 15, title, size=10, font="F2", color=(0.08, 0.12, 0.19))
        text_y = y + h - 38
        for line in lines:
            self.text(x + 8, text_y, line, size=8.5, font="F1", color=(0.18, 0.23, 0.33))
            text_y -= 11

    def render(self):
        return "\n".join(self.ops)


def add_header(canvas: Canvas, title: str, subtitle: str = ""):
    canvas.text(MARGIN, PAGE_H - 52, title, size=20, font="F2", color=(0.04, 0.08, 0.15))
    if subtitle:
        canvas.text(MARGIN, PAGE_H - 72, subtitle, size=10, font="F1", color=(0.29, 0.35, 0.45))
    canvas.line(MARGIN, PAGE_H - 82, PAGE_W - MARGIN, PAGE_H - 82, stroke=1.0, stroke_rgb=(0.72, 0.8, 0.92))


def page_overview() -> str:
    c = Canvas()
    add_header(c, "Current Project Data Flow Diagram", "Based strictly on the active Vite/React codebase in src/")
    y = PAGE_H - 118
    c.text(MARGIN, y, "System Flow Summary", size=13, font="F2")
    y -= 20
    y = c.multiline(
        MARGIN,
        y,
        "The portal routes users through authentication, healthcare discovery, support, dashboard, "
        "notifications, and content pages. Hospitals and doctors are served from local datasets inside "
        "the repository, while user profiles, favorites, support tickets, and notifications are persisted "
        "in Firebase. CuraNex is stored only in browser localStorage and does not currently sync to Firestore.",
        width_chars=88,
    )
    y -= 6
    c.text(MARGIN, y, "Entities", size=12, font="F2")
    c.text(220, y, "Processes", size=12, font="F2")
    c.text(410, y, "Data Stores", size=12, font="F2")
    y -= 18
    entities = [
        "User / Visitor",
        "Authenticated User",
        "Firebase Authentication",
        "Identity Providers",
        "Phone Verification / reCAPTCHA",
        "Firestore Database",
        "Support Team",
    ]
    processes = [
        "P1 Session Initialization",
        "P2 Authentication",
        "P3 Hospital Search",
        "P4 Doctor Search",
        "P5 Favorites",
        "P6 Support Requests",
        "P7 Notifications",
        "P8 Dashboard",
        "P9 CuraNex Feed",
        "P10 Static Content",
        "P11 Dataset Enrichment",
    ]
    stores = [
        "D1 Auth Session Persistence",
        "D2 users",
        "D3 userFavorites",
        "D4 support_requests",
        "D5 notifications",
        "D6 Local Datasets",
        "D7 localStorage",
    ]
    for idx, item in enumerate(entities):
        c.text(MARGIN, y - idx * 14, f"- {item}", size=9)
    for idx, item in enumerate(processes):
        c.text(220, y - idx * 14, f"- {item}", size=9)
    for idx, item in enumerate(stores):
        c.text(410, y - idx * 14, f"- {item}", size=9)

    lower_y = 278
    c.text(MARGIN, lower_y, "Mermaid Source Included In docs/dfd-report.md", size=12, font="F2")
    lower_y -= 18
    key_flows = [
        "User Input -> Auth, Search, Filters, Support Form, Feed Actions",
        "Processed Data -> Filtered doctor and hospital results",
        "Favorite Toggle -> Firestore userFavorites collection",
        "Support Ticket -> support_requests with notification side-write",
        "Alert -> Navbar notifications snapshot and toast updates",
        "Local Social State -> CuraNex posts and theme in localStorage",
    ]
    for idx, item in enumerate(key_flows):
        c.text(MARGIN, lower_y - idx * 14, f"- {item}", size=9)

    c.text(MARGIN, 56, "Pages 2 and 3 contain the labeled Level 0 and Level 1 diagrams.", size=9, color=(0.35, 0.4, 0.49))
    return c.render()


def page_level0() -> str:
    c = Canvas()
    add_header(c, "Level 0 DFD", "Context diagram for the Punjab Unified Health Portal")

    c.box(40, 560, 120, 78, "External Entity", ["User / Visitor", "Search, auth,", "support, feed input"], fill=(0.96, 0.98, 1.0))
    c.box(220, 525, 160, 130, "System", ["Punjab Unified", "Health Portal"], fill=(0.93, 0.98, 0.95), title_fill=(0.79, 0.93, 0.84))
    c.box(430, 600, 120, 62, "External System", ["Firebase Auth"], fill=(0.98, 0.97, 1.0), title_fill=(0.9, 0.87, 0.98))
    c.box(430, 520, 120, 62, "External System", ["Firestore"], fill=(0.98, 0.97, 1.0), title_fill=(0.9, 0.87, 0.98))
    c.box(430, 440, 120, 62, "External Entity", ["Support Team"], fill=(1.0, 0.98, 0.95), title_fill=(0.99, 0.9, 0.78))
    c.box(40, 430, 120, 62, "External System", ["Identity Providers", "and OTP Services"], fill=(0.98, 0.97, 1.0), title_fill=(0.9, 0.87, 0.98))

    c.arrow(160, 599, 220, 599, "User Input")
    c.arrow(220, 575, 160, 575, "Pages, Results, Alerts", label_y=584)
    c.arrow(380, 625, 430, 625, "Auth Request")
    c.arrow(430, 610, 380, 610, "Auth State")
    c.arrow(380, 551, 430, 551, "Profiles, Favorites,\nTickets, Notifications".replace("\n", " "), label_y=560)
    c.arrow(430, 536, 380, 536, "Stored Data", label_y=545)
    c.arrow(380, 466, 430, 466, "Support Issue Record")
    c.arrow(160, 462, 220, 540, "OAuth / OTP")
    c.arrow(430, 625, 160, 462, "Provider / Verification Response", label_x=300, label_y=655)

    c.text(MARGIN, 376, "Flow Labels", size=12, font="F2")
    legend = [
        "User Input: search queries, credentials, OTP, support form, post content",
        "Pages, Results, Alerts: rendered UI, ticket IDs, filtered data, favorites, notifications",
        "Auth Request / Auth State: Firebase session lifecycle and identity verification",
        "Profiles, Favorites, Tickets, Notifications: all Firestore read/write traffic",
        "Support Issue Record: operational ticket data for follow-up",
    ]
    y = 356
    for item in legend:
        c.text(MARGIN, y, f"- {item}", size=9)
        y -= 14
    return c.render()


def page_level1() -> str:
    c = Canvas()
    add_header(c, "Level 1 DFD", "Detailed processes, stores, and data movement in the current app")

    # Top row
    c.box(20, 706, 92, 54, "Entity", ["User"], fill=(0.96, 0.98, 1.0))
    c.box(130, 706, 110, 54, "P1", ["Route & Session", "Initialization"], fill=(0.93, 0.98, 0.95), title_fill=(0.79, 0.93, 0.84))
    c.box(260, 706, 110, 54, "P2", ["Authentication", "& Provisioning"], fill=(0.93, 0.98, 0.95), title_fill=(0.79, 0.93, 0.84))
    c.box(392, 706, 92, 54, "D1", ["Auth Session"], fill=(1.0, 0.99, 0.93), title_fill=(0.98, 0.92, 0.75))
    c.box(500, 706, 74, 54, "D2", ["users"], fill=(1.0, 0.99, 0.93), title_fill=(0.98, 0.92, 0.75))

    # Middle rows
    c.box(20, 606, 110, 54, "P3", ["Hospital Search", "& Filtering"], fill=(0.93, 0.98, 0.95), title_fill=(0.79, 0.93, 0.84))
    c.box(150, 606, 110, 54, "P4", ["Doctor Search", "& Filtering"], fill=(0.93, 0.98, 0.95), title_fill=(0.79, 0.93, 0.84))
    c.box(280, 606, 110, 54, "P5", ["Favorites", "Management"], fill=(0.93, 0.98, 0.95), title_fill=(0.79, 0.93, 0.84))
    c.box(410, 606, 74, 54, "D3", ["userFavorites"], fill=(1.0, 0.99, 0.93), title_fill=(0.98, 0.92, 0.75))
    c.box(500, 606, 74, 54, "D6", ["Local", "Datasets"], fill=(1.0, 0.99, 0.93), title_fill=(0.98, 0.92, 0.75))

    c.box(20, 506, 110, 54, "P6", ["Support Request", "Submission"], fill=(0.93, 0.98, 0.95), title_fill=(0.79, 0.93, 0.84))
    c.box(150, 506, 110, 54, "P7", ["Notification", "Sync"], fill=(0.93, 0.98, 0.95), title_fill=(0.79, 0.93, 0.84))
    c.box(280, 506, 110, 54, "P8", ["Dashboard", "Aggregation"], fill=(0.93, 0.98, 0.95), title_fill=(0.79, 0.93, 0.84))
    c.box(410, 506, 74, 54, "D4", ["support_", "requests"], fill=(1.0, 0.99, 0.93), title_fill=(0.98, 0.92, 0.75))
    c.box(500, 506, 74, 54, "D5", ["notifications"], fill=(1.0, 0.99, 0.93), title_fill=(0.98, 0.92, 0.75))

    c.box(20, 406, 110, 54, "P9", ["CuraNex Feed", "Management"], fill=(0.93, 0.98, 0.95), title_fill=(0.79, 0.93, 0.84))
    c.box(150, 406, 110, 54, "P10", ["Static Content", "Delivery"], fill=(0.93, 0.98, 0.95), title_fill=(0.79, 0.93, 0.84))
    c.box(280, 406, 110, 54, "P11", ["Dataset Parsing", "& Enrichment"], fill=(0.93, 0.98, 0.95), title_fill=(0.79, 0.93, 0.84))
    c.box(410, 406, 74, 54, "D7", ["localStorage"], fill=(1.0, 0.99, 0.93), title_fill=(0.98, 0.92, 0.75))
    c.box(500, 406, 74, 54, "Entity", ["Support Team"], fill=(1.0, 0.98, 0.95), title_fill=(0.99, 0.9, 0.78))

    # arrows
    c.arrow(112, 733, 130, 733, "App Open")
    c.arrow(240, 733, 260, 733, "Auth Request")
    c.arrow(370, 733, 392, 733, "Persist Session")
    c.arrow(370, 718, 500, 718, "User Profile Data", label_x=435)
    c.arrow(260, 706, 220, 660, "Auth Session", label_x=240, label_y=685)

    c.arrow(70, 706, 70, 660, "Search / Filters", label_x=35, label_y=682)
    c.arrow(70, 660, 75, 606, "Hospital Query", label_x=32, label_y=635)
    c.arrow(70, 660, 205, 606, "Doctor Query", label_x=130, label_y=645)
    c.arrow(500, 633, 390, 633, "Prepared Hospital Data", label_x=445)
    c.arrow(500, 620, 260, 620, "Prepared Doctor Data", label_x=390, label_y=611)
    c.arrow(130, 633, 280, 633, "Favorite Toggle", label_x=205)
    c.arrow(260, 620, 280, 620, "Favorite Toggle", label_x=270, label_y=611)
    c.arrow(390, 633, 410, 633, "Load / Save")
    c.arrow(410, 620, 390, 620, "Favorite Snapshot", label_x=450)
    c.arrow(390, 593, 335, 560, "Favorite Summary", label_x=362, label_y=580)
    c.arrow(112, 533, 20, 533, "Ticket Confirmation", label_x=65, label_y=542)
    c.arrow(70, 706, 70, 560, "Support Form Data", label_x=36, label_y=595)
    c.arrow(130, 533, 150, 533, "Create Notification", label_x=140)
    c.arrow(130, 520, 410, 533, "Validated Ticket", label_x=270, label_y=548)
    c.arrow(484, 533, 500, 533, "Notification Write", label_x=490)
    c.arrow(500, 520, 260, 533, "Notification Snapshot", label_x=380, label_y=522)
    c.arrow(260, 520, 112, 520, "Alert / Read Status", label_x=180, label_y=509)
    c.arrow(390, 433, 410, 433, "Read / Write Feed")
    c.arrow(484, 433, 500, 433, "Support Issue Record", label_x=492)
    c.arrow(500, 420, 280, 433, "Raw CSV / JSON / Leads", label_x=392, label_y=419)
    c.arrow(390, 420, 500, 620, "Normalized Directories", label_x=448, label_y=520)
    c.arrow(260, 433, 112, 433, "Content Pages", label_x=175, label_y=422)
    c.arrow(130, 433, 112, 433, "Updated Feed UI", label_x=119, label_y=446)

    # legend
    c.text(MARGIN, 328, "Highlighted Flows", size=12, font="F2")
    lines = [
        "User Input: credentials, OTP, search query, filters, support form, post actions",
        "Processed Data: filtered directory results, dashboard favorites, rendered content pages",
        "Alert: ticket confirmation, notification toast, dropdown items, auth errors",
        "Prepared Dataset: doctors and hospitals derived from CSV, leads, and raw JSON files",
        "Server-side Persistence: Firestore users, userFavorites, support_requests, notifications",
        "Browser-only Persistence: Firebase auth persistence and CuraNex localStorage",
    ]
    y = 308
    for line in lines:
        c.text(MARGIN, y, f"- {line}", size=9)
        y -= 14

    return c.render()


def main():
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    pdf = PdfBuilder()
    pdf.add_page(page_overview())
    pdf.add_page(page_level0())
    pdf.add_page(page_level1())
    OUTPUT.write_bytes(pdf.build())
    print(f"Generated {OUTPUT}")


if __name__ == "__main__":
    main()
