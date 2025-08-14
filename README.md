# ChatCV — Enhanced

A chat-driven resume generator with a modern UI, live A4 preview, one‑click DOCX export, and printable PDF.

## Features
- ✨ Chat UX that gathers your info with smart branching
- 🖼️ Live resume preview (A4) that updates as you type
- 🧠 Inline `edit field = value` commands to tweak anything
- 🧾 Download JSON of your answers
- 📄 Generate **.docx** via Flask + python‑docx
- 🖨️ Print / Save as **PDF** directly from the preview
- 🚀 Easy deploy: Netlify (frontend), Render (backend)

## Quickstart (local)
```bash
# 1) Backend
cd backend
python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
python server.py   # runs at http://localhost:5050

# 2) Frontend
# Open frontend/index.html in your browser (or serve with any static server)
```

> The frontend calls `/api/generate_docx` on the **same origin**. For local dev, start the backend then from the project root run a simple static server:
```bash
# from project root (ChatCV_Enhanced)
python -m http.server 8080
# visit http://localhost:8080/frontend/
```

## Deploy
- **Frontend (Netlify/Vercel/GitHub Pages)**: Deploy the `frontend/` folder as static site.
- **Backend (Render/Fly/Heroku)**: Deploy `backend/` with Python buildpack. Set the start command to:
  ```
  gunicorn server:app -b 0.0.0.0:$PORT
  ```

## Data entry format cheatsheet
- **Work (multi-line)**: `Company | Role | Dates | bullet one; bullet two; bullet three`
- **Projects (multi-line)**: `Title | Stack | bullet one; bullet two`
- **Education (multi-line)**: `School | Degree | Dates | Note`
- **Edit command**: `edit summary = data analyst with fintech focus`

## Screenshots to use on LinkedIn
1. **Hero UI** — the gradient header + chat & preview side by side.
2. **Chat in action** — bubbles collecting experience.
3. **Live preview** — crisp A4 resume with sections and chips.
4. **Export** — show the buttons (Generate .docx / Print PDF).

Tip: On mac, press `Shift+Cmd+4` to capture regions. For the PDF, click **Print**, save as PDF, and attach it to your post.

## Folder structure
```
ChatCV_Enhanced/
  frontend/
    index.html
    script.js
    style.css
  backend/
    server.py
  data/
  outputs/
  README.md
  requirements.txt
```

## Requirements
See `requirements.txt`. Minimal must‑haves:
- Flask
- flask-cors
- python-docx

## Notes
- Client‑side print produces a clean PDF using print styles.
- The DOCX generator builds sane defaults if a field is empty.
- You can customize the resume HTML in `buildPreviewHTML()` for different templates.
