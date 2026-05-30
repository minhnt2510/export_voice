# Huong Dan Deploy Don Gian (Render + Cloudflare)

Tai lieu nay viet de ban lam theo tung buoc, khong can doan.

## 1) Muc tieu

- Backend: Render
- Frontend: Cloudflare Workers & Pages
- Test duoc tren web: dang ky, dang nhap, tao project, tao audio

## 2) Backend tren Render

Tao `Web Service` voi cau hinh:

- Runtime: `Node`
- Branch: `main`
- Root Directory: `server`
- Build Command: `npm install`
- Start Command: `npm start`
- Health Check Path: `/api/health`

### Environment variables (Render)

Copy block nay vao Render, sua gia tri dung voi project cua ban:

```env
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_new_secret
JWT_EXPIRES_IN=7d
NODE_VERSION=22.13.0

TTS_PROVIDER=mock
TTS_MAX_CHARACTERS=5000

SERVER_URL=https://export-voice-api.onrender.com
AUDIO_BASE_URL=https://export-voice-api.onrender.com

CLIENT_URL=https://export-voice-web.22001075-minh.workers.dev
CLIENT_URLS=https://export-voice-web.22001075-minh.workers.dev
CLIENT_URL_PATTERNS=https://*.workers.dev
```

Luu y:

- `CLIENT_URL` va `CLIENT_URLS` chi de **domain goc**, khong them `/login` hoac `/register`.
- De deploy on dinh lan dau, nen de `TTS_PROVIDER=mock`.
- Sau khi save env, bam `Manual Deploy` -> `Deploy latest commit`.

## 3) Frontend tren Cloudflare

Project `export-voice-web`:

- Root directory: `client`
- Build command: `npm run build`
- Deploy command: `npx wrangler deploy --assets ./dist`
- Version command: `npx wrangler versions upload`

Environment variable:

```env
VITE_API_URL=https://export-voice-api.onrender.com/api
```

Sau khi build thanh cong, bam nut `Visit` de lay URL frontend.

## 4) Thu tu thao tac dung

1. Deploy backend Render.
2. Mo `https://export-voice-api.onrender.com/api/health` den khi thay JSON.
3. Deploy frontend Cloudflare.
4. Lay URL frontend tu nut `Visit`.
5. Quay lai Render sua `CLIENT_URL`, `CLIENT_URLS` bang URL frontend.
6. Deploy backend lai 1 lan nua.
7. Vao web test dang ky/dang nhap/generate.

## 5) Giai thich loi thuong gap

### A. Mo `/api/health` thay man hinh "Service waking up"

- Khong loi.
- Render free bi sleep, doi 30-90 giay roi refresh lai.

### B. Dang ky bao "Khong the ket noi server ..."

Thuong do 1 trong 3 ly do:

- `VITE_API_URL` tren Cloudflare sai.
- `CLIENT_URL` tren Render sai (de `/login` thay vi domain goc).
- Backend chua deploy lai sau khi doi env.

### C. Tao audio ra tieng "beep"

- Ban dang de `TTS_PROVIDER=mock`.
- `mock` luon tra audio mau (co the la beep).

Neu muon giong that:

1. Doi `TTS_PROVIDER=edge` tren Render.
2. Deploy backend lai.
3. Tao audio moi (lich su cu van la beep).

### D. Cloudflare bao loi `_redirects` infinite loop

- Khong dung file `_redirects` cho setup Worker assets nay.
- Repo nay da bo `_redirects` va dung fallback trong `wrangler.jsonc`.

## 6) Env local (`server/.env`) de chay may ban

Khac voi env production tren Render.

```env
PORT=5001
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_local_secret
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
CLIENT_URLS=http://localhost:5174,http://127.0.0.1:5173,http://127.0.0.1:5174
CLIENT_URL_PATTERNS=
TTS_PROVIDER=edge
GOOGLE_APPLICATION_CREDENTIALS=
TTS_MAX_CHARACTERS=5000
AUDIO_BASE_URL=http://localhost:5001
EDGE_TTS_PYTHON=python
EDGE_TTS_SCRIPT=./scripts/edge_tts_generate.py
SERVER_URL=http://localhost:5001
```

## 7) Bao mat (rat quan trong)

- Neu lo `MONGO_URI` hoac `JWT_SECRET`, phai doi ngay.
- Khong commit file `.env` that len GitHub.
