from __future__ import annotations

import re
from dataclasses import dataclass
from pathlib import Path


A4_W = 595.28
A4_H = 841.89


def _escape_pdf_text(text: str) -> str:
    return (
        text.replace("\\", "\\\\")
        .replace("(", "\\(")
        .replace(")", "\\)")
        .replace("\r", "")
    )


def _approx_text_width(text: str, font_size: float) -> float:
    # Approximate width in points for Helvetica-like fonts.
    # This is intentionally simple to avoid external dependencies.
    # It works well enough for report-style wrapping.
    weight = 0.52
    wide = sum(1 for c in text if c in "MW@#%&")
    narrow = sum(1 for c in text if c in "il.,:;'|!")
    adjusted = len(text) + wide * 0.25 - narrow * 0.20
    return max(0.0, adjusted) * font_size * weight


def _wrap_text(text: str, font_size: float, max_width: float) -> list[str]:
    text = re.sub(r"\s+", " ", text.strip())
    if not text:
        return [""]
    words = text.split(" ")
    lines: list[str] = []
    current: list[str] = []
    for w in words:
        candidate = (" ".join(current + [w])).strip()
        if _approx_text_width(candidate, font_size) <= max_width or not current:
            current.append(w)
            continue
        lines.append(" ".join(current))
        current = [w]
    if current:
        lines.append(" ".join(current))
    return lines


@dataclass
class RenderLine:
    text: str
    font: str  # "F1" or "F2"
    size: float
    x: float
    y: float


@dataclass
class RenderStroke:
    x1: float
    y1: float
    x2: float
    y2: float
    width: float = 0.6


@dataclass
class PageContent:
    lines: list[RenderLine]
    strokes: list[RenderStroke]


def _parse_markdown(md: str) -> list[tuple[str, str]]:
    """
    Convert Markdown into a sequence of (block_type, content) tokens.
    Minimal parser for:
      - headings (#/##/###)
      - paragraphs
      - bullet items (- ...)
      - numbered items (1. ...)
      - tables (pipe style)
    """
    lines = md.splitlines()
    tokens: list[tuple[str, str]] = []

    i = 0
    while i < len(lines):
        line = lines[i].rstrip()
        if not line.strip():
            i += 1
            continue

        if line.startswith("#"):
            level = len(line) - len(line.lstrip("#"))
            text = line[level:].strip()
            tokens.append((f"h{level}", text))
            i += 1
            continue

        if re.match(r"^\s*[-*]\s+", line):
            tokens.append(("li", re.sub(r"^\s*[-*]\s+", "", line).strip()))
            i += 1
            continue

        if re.match(r"^\s*\d+\.\s+", line):
            tokens.append(("oli", re.sub(r"^\s*\d+\.\s+", "", line).strip()))
            i += 1
            continue

        if line.strip().startswith("|") and "|" in line.strip()[1:]:
            table_lines = [line]
            i += 1
            while i < len(lines) and lines[i].strip().startswith("|"):
                table_lines.append(lines[i].rstrip())
                i += 1
            tokens.append(("table", "\n".join(table_lines)))
            continue

        # paragraph (consume until blank)
        para = [line.strip()]
        i += 1
        while i < len(lines) and lines[i].strip():
            if lines[i].startswith("#") or lines[i].strip().startswith("|"):
                break
            if re.match(r"^\s*[-*]\s+", lines[i]) or re.match(r"^\s*\d+\.\s+", lines[i]):
                break
            para.append(lines[i].strip())
            i += 1
        tokens.append(("p", " ".join(para).strip()))

    return tokens


def _render_tokens_to_pages(tokens: list[tuple[str, str]]) -> list[PageContent]:
    margin_l = 56
    margin_r = 56
    margin_t = 62
    margin_b = 62

    max_width = A4_W - margin_l - margin_r

    pages: list[PageContent] = []
    current = PageContent(lines=[], strokes=[])

    def new_page():
        nonlocal current
        if current.lines or current.strokes:
            pages.append(current)
        current = PageContent(lines=[], strokes=[])

    y = A4_H - margin_t

    def ensure_space(required: float):
        nonlocal y
        if y - required < margin_b:
            new_page()
            y = A4_H - margin_t

    def add_blank(space: float):
        nonlocal y
        ensure_space(space)
        y -= space

    def add_wrapped(text: str, font: str, size: float, indent: float = 0.0, spacing_after: float = 0.0):
        nonlocal y
        wrapped = _wrap_text(text, size, max_width - indent)
        lh = size * 1.35
        ensure_space(lh * len(wrapped) + spacing_after)
        for w in wrapped:
            current.lines.append(RenderLine(text=w, font=font, size=size, x=margin_l + indent, y=y))
            y -= lh
        if spacing_after:
            y -= spacing_after

    # Title
    ensure_space(28)
    current.lines.append(RenderLine(text="Testing", font="F2", size=20, x=margin_l, y=y))
    y -= 32

    for kind, content in tokens:
        if kind in {"h1", "h2", "h3", "h4"}:
            level = int(kind[1:])
            if level == 1:
                size = 16
            elif level == 2:
                size = 13.5
            else:
                size = 11.5
            add_blank(6)
            add_wrapped(content, font="F2", size=size, spacing_after=4)
            continue

        if kind == "p":
            add_wrapped(content, font="F1", size=10.8, spacing_after=6)
            continue

        if kind == "li":
            add_wrapped(f"• {content}", font="F1", size=10.8, indent=10, spacing_after=2)
            continue

        if kind == "oli":
            add_wrapped(f"- {content}", font="F1", size=10.8, indent=10, spacing_after=2)
            continue

        if kind == "table":
            add_blank(2)
            y = _render_table(current, content, margin_l, y, max_width, ensure_space)
            continue

    new_page()
    return pages


def _render_table(
    page: PageContent,
    table_text: str,
    x0: float,
    y0: float,
    width: float,
    ensure_space_fn,
):

    raw_rows = []
    for ln in table_text.splitlines():
        ln = ln.strip()
        if not ln.startswith("|"):
            continue
        cols = [c.strip() for c in ln.strip("|").split("|")]
        raw_rows.append(cols)

    if len(raw_rows) < 2:
        return y0

    header = raw_rows[0]
    body = [r for r in raw_rows[2:] if r and not all(set(c) <= {"-"} for c in r)]

    # Column widths tuned for report readability.
    # ID, Description, Expected, Actual, Status
    col_w = [
        width * 0.14,
        width * 0.28,
        width * 0.23,
        width * 0.23,
        width * 0.12,
    ]
    col_x = [x0]
    for w in col_w[:-1]:
        col_x.append(col_x[-1] + w)

    font_size = 9.3
    pad_x = 4
    pad_y = 3
    line_h = font_size * 1.35

    def row_height(row: list[str]) -> float:
        max_lines = 1
        for i, cell in enumerate(row):
            lines = _wrap_text(cell, font_size, col_w[i] - 2 * pad_x)
            max_lines = max(max_lines, len(lines))
        return max_lines * line_h + 2 * pad_y

    y = y0

    def draw_row(row: list[str], is_header: bool):
        nonlocal y
        h = row_height(row)
        ensure_space_fn(h + 8)

        # horizontal line (top)
        page.strokes.append(RenderStroke(x1=x0, y1=y, x2=x0 + width, y2=y, width=0.7))

        # vertical lines
        x = x0
        page.strokes.append(RenderStroke(x1=x, y1=y, x2=x, y2=y - h, width=0.6))
        for w in col_w:
            x += w
            page.strokes.append(RenderStroke(x1=x, y1=y, x2=x, y2=y - h, width=0.6))

        # text
        font = "F2" if is_header else "F1"
        for i, cell in enumerate(row):
            cell_lines = _wrap_text(cell, font_size, col_w[i] - 2 * pad_x)
            text_y = y - pad_y - font_size
            for ln in cell_lines:
                page.lines.append(
                    RenderLine(
                        text=ln,
                        font=font,
                        size=font_size,
                        x=col_x[i] + pad_x,
                        y=text_y,
                    )
                )
                text_y -= line_h

        y -= h

        # horizontal line (bottom)
        page.strokes.append(RenderStroke(x1=x0, y1=y, x2=x0 + width, y2=y, width=0.7))
        y -= 10

    draw_row(header, is_header=True)
    for r in body:
        # Normalize columns count
        r = (r + [""] * len(header))[: len(header)]
        draw_row(r, is_header=False)

    return y


def _pages_to_pdf_bytes(pages: list[PageContent]) -> bytes:
    objects: list[bytes] = []

    def add_object(data: str | bytes) -> int:
        if isinstance(data, str):
            data_b = data.encode("latin-1", "replace")
        else:
            data_b = data
        objects.append(data_b)
        return len(objects)

    # Fonts
    font_f1 = add_object("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>")
    font_f2 = add_object("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>")

    page_ids: list[int] = []
    content_ids: list[int] = []

    # Placeholder for Pages object id (will be created after pages)
    pages_obj_id = None

    for page in pages:
        content_stream = _build_page_content_stream(page)
        content_id = add_object(
            f"<< /Length {len(content_stream)} >>\nstream\n".encode("latin-1")
            + content_stream
            + b"\nendstream"
        )
        content_ids.append(content_id)

        # Page object (parent to be filled later)
        # We'll patch parent reference after we know pages object id.
        page_id = add_object(
            f"<< /Type /Page /Parent 0 0 R /MediaBox [0 0 {A4_W:.2f} {A4_H:.2f}] "
            f"/Resources << /Font << /F1 {font_f1} 0 R /F2 {font_f2} 0 R >> >> "
            f"/Contents {content_id} 0 R >>"
        )
        page_ids.append(page_id)

    kids = " ".join(f"{pid} 0 R" for pid in page_ids)
    pages_obj_id = add_object(f"<< /Type /Pages /Kids [ {kids} ] /Count {len(page_ids)} >>")

    # Patch each page object with correct parent reference (replace "0 0 R")
    for idx, pid in enumerate(page_ids):
        raw = objects[pid - 1].decode("latin-1", "replace")
        objects[pid - 1] = raw.replace("/Parent 0 0 R", f"/Parent {pages_obj_id} 0 R").encode(
            "latin-1", "replace"
        )

    catalog_id = add_object(f"<< /Type /Catalog /Pages {pages_obj_id} 0 R >>")

    # Build xref
    header = b"%PDF-1.4\n%\xe2\xe3\xcf\xd3\n"
    offsets = [0]
    body = b""
    for i, obj in enumerate(objects, start=1):
        offsets.append(len(header) + len(body))
        body += f"{i} 0 obj\n".encode("latin-1") + obj + b"\nendobj\n"

    xref_offset = len(header) + len(body)
    xref = [b"xref\n", f"0 {len(objects)+1}\n".encode("latin-1")]
    xref.append(b"0000000000 65535 f \n")
    for off in offsets[1:]:
        xref.append(f"{off:010d} 00000 n \n".encode("latin-1"))

    trailer = (
        b"trailer\n"
        + f"<< /Size {len(objects)+1} /Root {catalog_id} 0 R >>\n".encode("latin-1")
        + b"startxref\n"
        + f"{xref_offset}\n".encode("latin-1")
        + b"%%EOF\n"
    )

    return header + body + b"".join(xref) + trailer


def _build_page_content_stream(page: PageContent) -> bytes:
    parts: list[str] = []
    parts.append("q")

    # strokes (lines)
    for s in page.strokes:
        parts.append(f"{s.width:.2f} w")
        parts.append(f"{s.x1:.2f} {s.y1:.2f} m {s.x2:.2f} {s.y2:.2f} l S")

    # text lines
    for ln in page.lines:
        text = _escape_pdf_text(ln.text)
        parts.append("BT")
        parts.append(f"/{ln.font} {ln.size:.2f} Tf")
        parts.append(f"1 0 0 1 {ln.x:.2f} {ln.y:.2f} Tm")
        parts.append(f"({text}) Tj")
        parts.append("ET")

    parts.append("Q")
    return ("\n".join(parts)).encode("latin-1", "replace")


def main() -> int:
    repo_root = Path(__file__).resolve().parents[1]
    md_path = repo_root / "docs" / "testing-section.md"
    out_pdf = repo_root / "docs" / "testing-section.pdf"

    md = md_path.read_text(encoding="utf-8")
    tokens = _parse_markdown(md)
    pages = _render_tokens_to_pages(tokens)
    pdf_bytes = _pages_to_pdf_bytes(pages)
    out_pdf.write_bytes(pdf_bytes)
    print(f"Wrote: {out_pdf}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
