# Backend: Word -> PDF converter (Node + LibreOffice)

## What this does
This small Express server accepts a `POST /convert` with `multipart/form-data` (field `file`) and converts the uploaded Word document (.doc/.docx) to PDF using `libreoffice --headless --convert-to pdf`.

## Requirements
- Node.js 16+
- LibreOffice installed (soffice command must be available in PATH)
- Enough disk space for temporary files

## Install & Run
```bash
cd backend
npm install
# make sure libreoffice (soffice) is installed:
# Ubuntu/Debian: sudo apt install libreoffice
node server.js
```

The server listens on port 3000 by default. Update frontend to point to your deployed server (or run frontend with same origin).

## Notes
- Uploaded files are saved under `uploads/` and removed after conversion.
- Increase file size limits in `server.js` if needed.
