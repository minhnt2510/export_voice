# ViVibe Clone (Text-to-Speech SaaS)
- https://export-voice-web.22001075-minh.workers.dev/
## Tên app

- Tên triển khai: `Export Voice`

## Mô tả App

Ứng dụng chuyển văn bản thành giọng nói (Text-to-Speech), có đăng ký/đăng nhập, quản lý project, credit và API key.

Full-stack web app for text-to-speech generation with real auth, projects, credits, history, and API key based public TTS endpoint.

## Tech stack

- Frontend: React + Vite + TailwindCSS + React Router + Axios + Zustand
- Backend: Node.js + Express + MongoDB (Mongoose) + JWT + bcrypt
- TTS providers via service abstraction:
  - `mock` (default, always works for flow testing)
  - `google` (`@google-cloud/text-to-speech`)
  - `edge` (`node-edge-tts`, optional CLI fallback `edge-tts`)

## Main features

- Register / login / logout with JWT
- Protected dashboard routes
- Projects CRUD
- Text editor with sentence split view
- Voice / speed / pause settings
- Generate audio and play/download MP3
- Credit deduction on each generation
- TTS generation history
- Credit history
- API key management (hashed in DB)
- Public endpoint: `POST /api/public/tts` with `x-api-key`

## Project structure

- `server/` backend API
- `client/` frontend web app

## 1) Backend setup

```bash
cd server
npm install
```

Create `.env` (already prepared in this workspace) or copy from `.env.example`:

```env
PORT=5001
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
CLIENT_URLS=http://localhost:5174,http://127.0.0.1:5173,http://127.0.0.1:5174
CLIENT_URL_PATTERNS=
TTS_PROVIDER=mock
GOOGLE_APPLICATION_CREDENTIALS=
TTS_MAX_CHARACTERS=5000
AUDIO_BASE_URL=http://localhost:5001
EDGE_TTS_PYTHON=python
EDGE_TTS_SCRIPT=./scripts/edge_tts_generate.py
SERVER_URL=http://localhost:5001
```

Run backend:

```bash
npm run dev
```

Health check:

- `GET http://localhost:5001/api/health`

## 2) Frontend setup

```bash
cd client
npm install
```

Create `.env` from `.env.example`:

```env
VITE_API_URL=http://localhost:5001/api
```

Run frontend:

```bash
npm run dev
```

Open:

- `http://localhost:5173`

## 3) TTS provider modes

### Mock mode (recommended first run)

```env
TTS_PROVIDER=mock
```

- No external credentials required
- Backend copies `server/uploads/audio/sample.mp3` to each generated output file
- If sample is missing, API returns: `Mock audio sample not found. Please add server/uploads/audio/sample.mp3`

### Google Cloud mode

```env
TTS_PROVIDER=google
GOOGLE_APPLICATION_CREDENTIALS=/absolute/path/to/service-account.json
```

### Edge mode

```env
TTS_PROVIDER=edge
```

- Backend now uses `node-edge-tts` directly (already in `package.json`), so no extra install is required.
- Optional fallback (if you want CLI fallback):

```bash
pip install edge-tts
```

## 4) Postman quick test flow

1. Register
- `POST /api/auth/register`
```json
{
  "name": "Minh",
  "email": "minh@example.com",
  "password": "123456"
}
```

2. Login
- `POST /api/auth/login`
- Copy JWT token

3. Create project
- `POST /api/projects`
- Header: `Authorization: Bearer <token>`

4. Generate audio
- `POST /api/tts/generate`
- Header: `Authorization: Bearer <token>`
```json
{
  "projectId": "<project_id>",
  "text": "Xin chao, day la thu nghiem giong doc AI.",
  "voice": "vi-VN-Neural2-A",
  "speed": 1,
  "pause": 100
}
```

5. Create API key
- `POST /api/api-keys`
- Header: `Authorization: Bearer <token>`

6. Public TTS with API key
- `POST /api/public/tts`
- Header: `x-api-key: <raw_key_returned_once>`
```json
{
  "text": "Xin chao",
  "voice": "vi-VN-Neural2-A",
  "speed": 1,
  "pause": 100
}
```

## 5) Deploy (FE Cloudflare Pages + BE Render)

### Backend on Render

Use `render.yaml` in repo root or configure manually:

- Runtime: `Node`
- Root Directory: `server`
- Build Command: `npm install`
- Start Command: `npm start`
- Health Check Path: `/api/health`

Set environment variables on Render:

```env
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret
JWT_EXPIRES_IN=7d
TTS_PROVIDER=edge
TTS_MAX_CHARACTERS=5000
SERVER_URL=https://your-render-service.onrender.com
AUDIO_BASE_URL=https://your-render-service.onrender.com
CLIENT_URL=https://your-cloudflare-domain.pages.dev
CLIENT_URLS=https://your-cloudflare-domain.pages.dev,https://your-custom-domain.com
CLIENT_URL_PATTERNS=https://*.your-cloudflare-domain.pages.dev
```

Notes:

- `SERVER_URL` / `AUDIO_BASE_URL` must be public Render URL so audio links are playable from frontend.
- Render free services may spin down and have ephemeral local filesystem; audio files in `uploads/` are not permanent.

### Frontend on Cloudflare Pages

- Root Directory: `client`
- Build Command: `npm run build`
- Build Output Directory: `dist`
- Environment variable:

```env
VITE_API_URL=https://your-render-service.onrender.com/api
```

SPA fallback is configured in `client/wrangler.jsonc` via:

- `assets.not_found_handling = "single-page-application"`

## 6) API endpoints

### Auth
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`

### Projects
- `GET /api/projects`
- `POST /api/projects`
- `GET /api/projects/:id`
- `PUT /api/projects/:id`
- `DELETE /api/projects/:id`

### TTS
- `GET /api/tts/voices`
- `POST /api/tts/generate`
- `GET /api/tts/history`
- `GET /api/tts/history/:id`

### Credits
- `GET /api/credits/balance`
- `GET /api/credits/history`

### API Keys
- `GET /api/api-keys`
- `POST /api/api-keys`
- `DELETE /api/api-keys/:id`

### Public API
- `POST /api/public/tts`

## Notes

- Passwords are hashed with bcrypt.
- API keys are hashed with SHA-256 before storing.
- Credits are deducted by character count.
- Text length is validated with max 5000 chars per generation.
- MongoDB credential safety: if a plain credential was shared publicly, rotate password immediately.

