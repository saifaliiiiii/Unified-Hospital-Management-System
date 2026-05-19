# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

## Run

- Dev server: `npm run dev`
- AI chat API server: `npm run server`
- If you see `EPERM: operation not permitted, lstat 'C:\\Users\\Lenovo'` (sandbox / permissions issue): `npm run dev:subst`
- If build fails with the same error: `npm run build:subst`
- Serve the built `dist/` without Vite: `npm run serve:dist`

## AI Medical Assistant Chatbot

The authenticated app shell includes a floating AI medical support widget at
`src/components/chatbot/AIMedicalChatbot.jsx`. The browser calls `/api/chat`
through `src/services/chatApi.js`; Vite proxies that path to the local Node
server on port `5000` during development.

Backend files:

- `server/index.js` - Express app, CORS, JSON parsing, health check, route mount.
- `server/routes/chat.js` - `POST /api/chat` route.
- `server/controllers/chatController.js` - request validation, safety prompt, emergency keyword handling.
- `server/services/geminiService.js` - Gemini SDK integration with a Flash model.

Environment setup:

1. Copy `.env.example` to `.env`.
2. Add `GEMINI_API_KEY=...` for the backend. Do not prefix this key with `VITE_`.
3. Optionally set `GEMINI_MODEL=gemini-2.0-flash`, `PORT=5000`, and `CLIENT_ORIGIN=http://localhost:5173,http://127.0.0.1:5173`.

Local development:

1. Run `npm run server` in one terminal.
2. Run `npm run dev` in another terminal.
3. Sign in; the floating medical assistant button stays fixed at the bottom-right
   corner across authenticated pages.

Safety behavior:

- The frontend and backend detect emergency terms such as chest pain, breathing
  difficulty, stroke symptoms, suicidal thoughts, seizure, unconsciousness, and
  heavy bleeding.
- Emergency messages get an instant warning advising emergency services or the
  nearest hospital.
- The assistant prompt prevents final diagnoses, prescriptions, and dosage advice.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
