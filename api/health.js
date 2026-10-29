module.exports = (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "GET") return res.status(405).json({ ok: false, error: "Use GET." });
  return res.status(200).json({ ok: true, service: "NM PDF Tools API", message: "Backend is online. PDF-to-Excel is a basic text-PDF prototype." });
};

const pdf = require("pdf-parse");
const XLSX = require("xlsx");

module.exports = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "POST") return res.status(405).json({ ok: false, error: "Use POST with JSON." });
  try {
    const pdfBase64 = (req.body || {}).pdfBase64;
    if (!pdfBase64 || typeof pdfBase64 !== "string") return res.status(400).json({ ok: false, error: "Send JSON with a pdfBase64 field containing the PDF file encoded as base64." });
    if (pdfBase64.length > 3000000) return res.status(413).json({ ok: false, error: "This starter version accepts only small PDFs. Large files need a different processing setup." });
    const parsed = await pdf(Buffer.from(pdfBase64, "base64"));
    const text = (parsed.text || "").replace(/\r/g, "");
    if (!text.trim()) return res.status(422).json({ ok: false, error: "No selectable text was found. Scanned/image PDFs need OCR, which is not included in this starter version." });
    const lines = text.split("\n").map(line => line.trim()).filter(Boolean);
    const worksheet = XLSX.utils.aoa_to_sheet([["Extracted PDF Text"], ...lines.map(line => [line])]);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "PDF Text");
    return res.status(200).json({ ok: true, filename: "nm-pdf-converted.xlsx", mimeType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", xlsxBase64: XLSX.write(workbook, { type: "base64", bookType: "xlsx" }), warning: "Basic text extraction only. Original tables, columns, fonts, and page layout may not be preserved." });
  } catch (error) {
    return res.status(500).json({ ok: false, error: "Could not process this PDF. Try a small, text-based PDF." });
  }
};
