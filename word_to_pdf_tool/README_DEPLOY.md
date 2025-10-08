# Word -> PDF Tool (Full package)

This archive contains a frontend static page and a small Node.js backend that uses LibreOffice to convert Word (`.doc`/`.docx`) files to PDF with accurate layout.

Folders:
- `frontend/` : Single `index.html` which posts file to `/convert` on the same origin.
- `backend/` : Node.js server (server.js) and package.json.

Deployment options:
1. **Single server (recommended)**: Host backend and frontend on same VPS or VM. Install Node.js and LibreOffice.
2. **Platform**: Use Render, Railway, or any VPS. Make sure the platform supports installing LibreOffice (some serverless providers do not).
3. **Docker**: You can create a Dockerfile based on an image with libreoffice installed.

Security:
- This is a basic example. For production add authentication, file scanning, rate-limiting, and HTTPS.

