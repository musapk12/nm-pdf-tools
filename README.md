# NM PDF Tools — Vercel Backend Starter

Starter backend for the NM PDF Tools Blogger website.

## Included
- `GET /api/health` — checks whether the backend is online.
- `POST /api/pdf-to-excel` — prototype conversion for small PDFs with selectable text.

## Important limitations
- This is **not** a complete 40-tool backend.
- PDF-to-Excel extracts text lines into a single Excel column. It does **not** preserve tables, columns, fonts, or page layout.
- Scanned/image-only PDFs need OCR; OCR is not included.
- Vercel serverless request/runtime limits apply. This starter is for small test files.
- Blogger buttons will not automatically connect; the Blogger page JavaScript must be updated to call the deployed API.

## Deploy
1. Upload these files to the GitHub repository `nm-pdf-tools` (keep the `api` folder).
2. Import the repository in Vercel.
3. Use default settings and deploy.
4. Test `https://YOUR-PROJECT.vercel.app/api/health`.

## Test PDF-to-Excel
Send a `POST` request to `/api/pdf-to-excel` with JSON:
```json
{
  "pdfBase64": "BASE64_ENCODED_PDF_FILE"
}
```
The response contains `xlsxBase64`. A frontend must decode it and download it as an `.xlsx` file.
