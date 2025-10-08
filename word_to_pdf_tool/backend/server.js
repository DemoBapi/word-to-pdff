// Simple Express server that converts uploaded Word files to PDF using LibreOffice (soffice).
// Requirements:
// - Node.js 16+
// - libreoffice (soffice) installed on the machine
//
// The server accepts multipart/form-data POST /convert with field 'file' and returns application/pdf.

import express from "express";
import fileUpload from "express-fileupload";
import { exec } from "child_process";
import path from "path";
import fs from "fs";
import os from "os";

const app = express();
app.use(fileUpload({
  limits: { fileSize: 200 * 1024 * 1024 }, // 200MB
  abortOnLimit: true,
}));

const UPLOAD_DIR = path.join(process.cwd(), "uploads");
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR);

function runCommand(cmd) {
  return new Promise((resolve, reject) => {
    exec(cmd, { maxBuffer: 1024 * 1024 * 50 }, (err, stdout, stderr) => {
      if (err) return reject({ err, stdout, stderr });
      resolve({ stdout, stderr });
    });
  });
}

app.post("/convert", async (req, res) => {
  try {
    if (!req.files || !req.files.file) return res.status(400).send("No file uploaded.");
    const uploaded = req.files.file;
    const safeName = uploaded.name.replace(/[^a-zA-Z0-9_.-]/g, "_");
    const inputPath = path.join(UPLOAD_DIR, Date.now() + "_" + safeName);
    await uploaded.mv(inputPath);
    // Use LibreOffice to convert to PDF
    // Note: soffice must be in PATH
    const cmd = `soffice --headless --convert-to pdf "${inputPath}" --outdir "${UPLOAD_DIR}"`;
    await runCommand(cmd);
    const outputPath = inputPath.replace(/\.(docx|doc|DOCX|DOC)$/i, ".pdf");
    if (!fs.existsSync(outputPath)) {
      // try alternate filename (libreoffice may change case)
      const alt = inputPath + ".pdf";
      if (fs.existsSync(alt)) {
        fs.renameSync(alt, outputPath);
      }
    }
    if (!fs.existsSync(outputPath)) {
      throw new Error("Conversion did not produce PDF.");
    }
    const stat = fs.statSync(outputPath);
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Length", stat.size);
    const stream = fs.createReadStream(outputPath);
    stream.pipe(res);
    // cleanup after streaming finished
    stream.on("close", () => {
      try { fs.unlinkSync(inputPath); } catch(e){ }
      try { fs.unlinkSync(outputPath); } catch(e){ }
    });
  } catch (e) {
    console.error("Conversion error:", e);
    res.status(500).send("Conversion failed: " + (e && e.err ? e.err.message : (e && e.message) || e));
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
