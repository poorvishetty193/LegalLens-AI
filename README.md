# LegalLens AI — AI-Powered Legal Assistance & Access

**Challenge Vertical**: AI for Legal Assistance & Access

---

## 1. Problem
Understanding legal contracts, agreements, and terms of service is notoriously difficult for individuals and small businesses. Complex legalese, hidden obligations, obscure indemnity clauses, and tight expiration windows often put non-lawyers at a severe disadvantage. Furthermore, traditional legal consultation is expensive and inaccessible for preliminary document reviews.

---

## 2. Solution
**LegalLens AI** is an intelligent document analysis and preparation assistant that empowers non-lawyers to understand, evaluate, compare, and prepare for legal discussions. LegalLens AI transforms complex legal documents into plain-English summaries, structured risk assessments, key obligation trackers, and actionable lawyer consultation briefs—all while strictly maintaining evidence grounding and legal disclaimers.

---

## 3. Key Capabilities

- **Google Authentication**: Seamless and secure user authentication via Firebase Auth with Google Sign-In.
- **Secure Ephemeral File Processing**: Supports PDF and DOCX uploads up to 4 MB with zero permanent binary storage.
- **Document Summarization**: Instant executive plain-English summary of contract terms.
- **Important Clause Identification**: Categorizes clauses (e.g., Non-Compete, Termination, IP Assignment) with suggested redlines.
- **Risk & Attention Analysis**: Computes an objective Attention Score (0–100) and categorizes overall risk severity (Low, Moderate, High, Critical).
- **Obligations & Deadline Tracking**: Extracts party-specific responsibilities, payment schedules, and critical dates.
- **Missing Information & Inconsistencies**: Highlights missing protections, unattached exhibits, and contradictory language.
- **Ask Your Document**: Grounded interactive Q&A that answers questions strictly from contract text with exact page/section citations.
- **Side-by-Side Document Comparison**: Identifies modified clauses, added/removed liabilities, and risk deltas between two contract versions.
- **Lawyer Consultation Preparation**: Generates structured briefs containing priority concerns, strategic questions for legal counsel, required documents to bring, and discussion agendas.
- **Legal Safety & Disclaimers**: Integrated disclaimers on every screen emphasizing that LegalLens AI provides legal information, not legal advice.

---

## 4. Smart Assistant / Decision Logic

LegalLens AI does not merely summarize text using generic prompts. It applies dedicated AI analysis models to evaluate contract data dynamically:

- **Attention & Risk Gauge**: Calculates an attention score based on the frequency and severity of indemnities, unlimited liability, non-competes, and termination penalties.
- **Risk & Liability Categorization**: Maps clauses to severity levels (`critical`, `high`, `moderate`, `low`).
- **Party Obligations & Deadlines**: Identifies which party bears responsibility and maps time-bound performance triggers.
- **Omissions & Gap Detection**: Detects missing standard clauses such as dispute resolution, governing law, or IP ownership.
- **Document-Grounded Q&A**: Uses prompt boundary defense to refuse answering questions outside the contract text, eliminating hallucinations.
- **Diff & Delta Engine**: Analyzes structural and wording changes across documents to pinpoint shifts in risk or obligation.

---

## 5. How It Works

```
User
  │
  ├─► Google Authentication (Firebase Auth)
  │
  ├─► Upload Contract (.pdf / .docx, ≤ 4 MB)
  │      │
  │      ▼
  ├─► Backend Validation (Extension, MIME Type, Magic Bytes)
  │      │
  │      ▼
  ├─► Ephemeral Local Parsing (PyMuPDF / python-docx) ──► Immediate Binary File Cleanup
  │      │
  │      ▼
  ├─► Gemini AI Analysis (gemini-3.8-flash with JSON Schema Validation)
  │      │
  │      ▼
  ├─► Structured Output Storage (Cloud Firestore under /users/{uid}/...)
  │      │
  │      ▼
  └─► Interactive Features:
         ├── Executive Breakdown & Risk Gauge
         ├── Grounded Ask Document Q&A with Citations
         ├── Side-by-Side Contract Comparison
         └── Printable Lawyer Consultation Brief
```

---

## 6. Architecture

- **Frontend**: React + Vite + TypeScript, styled with TailwindCSS following the Stitch dark-mode design system.
- **Backend**: Python + FastAPI web framework.
- **Authentication**: Firebase Authentication (ID Token verification via `firebase-admin`).
- **Database**: Cloud Firestore (User-isolated document metadata, analysis results, Q&A sessions, comparisons, and lawyer briefs).
- **AI Engine**: Google Gemini API (`gemini-3.8-flash` via `google-genai` SDK with strict Pydantic JSON response schemas).
- **File Parsing**: PyMuPDF (`fitz`) for PDF text & page extraction; `python-docx` for DOCX structure parsing.
- **Deployment**: Optimized for Vercel Serverless Functions.

---

## 7. Security & Privacy

- **Firebase ID Token Verification**: All `/api/*` endpoints strictly verify incoming Bearer tokens using `firebase-admin`. Verified user UIDs are derived solely from token payloads.
- **Data Isolation**: User document metadata and analyses are stored in isolated Firestore collections (`/users/{uid}/...`). Cross-user document access returns HTTP 403.
- **Backend-Only Secrets**: `GEMINI_API_KEY` and Firebase Admin credentials reside exclusively on the server and are never exposed to the client.
- **Prompt Injection Defense**: All user inputs and extracted text are wrapped in strict prompt delimiters (e.g., `[DOCUMENT_START]`, `[USER_CONCERNS_START]`).
- **Strict Upload Security**: Three-layer validation enforces file extension, declared MIME type, and binary magic bytes (`%PDF-`, `PK\x03\x04`). Maximum request size is capped at 4 MB.
- **Zero-Retention Ephemeral Storage**: Uploaded files are processed in temporary containers (`/tmp`) wrapped in `try/finally` blocks that delete the binary file immediately after text extraction. No files are saved to cloud storage.
- **Legal Safety**: The system is designed to provide document assistance and information only; it explicitly disclaims providing legal advice.

---

## 8. Automated Testing & Verification

The application includes a complete backend test suite verified against mock Gemini responses:

- **Total Backend Tests**: 49 passed (`python -m unittest discover -s tests`).
- **Frontend Build**: Verified clean TypeScript & Vite production build (`npm run build`).
- **Tested Modules**:
  - Authentication (401 unauthenticated rejection, valid token extraction)
  - Document Upload Security (extension, MIME, magic bytes, >4 MB rejection, <=4 MB acceptance, temporary file deletion)
  - Document Analysis (Gemini schema validation, model assignment, Firestore persistence)
  - Ask Document Q&A (Question length validation, citation formatting, zero-hallucination guardrails)
  - Document Comparison (Same-document rejection, multi-document ownership, delta calculations)
  - Lawyer Preparation (Oversized input handling, empty concern default, structured brief generation)

---

## 9. Free-Tier Deployment & Environment Variables

LegalLens AI is built to run 100% on free-tier serverless infrastructure without paid cloud database or storage requirements.

### Required Environment Variables

#### Frontend Environment Variables (`legallens-ai/.env`)
```env
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_API_BASE_URL=https://your-backend-api.vercel.app
```

#### Backend Environment Variables (`backend/.env`)
```env
ENV=production
FRONTEND_URL=https://your-frontend-app.vercel.app
GEMINI_API_KEY=your_gemini_api_key
FIREBASE_SERVICE_ACCOUNT_JSON={"type":"service_account","project_id":"..."}
MAX_UPLOAD_SIZE_MB=4
```

---

## 10. Assumptions & Limitations

- **Informational Assistance Only**: LegalLens AI provides legal information and preparation support. It does not provide legal advice or replace a qualified attorney.
- **AI Capabilities**: Summaries and extraction rely on Gemini AI. Users should independently verify critical terms with legal counsel.
- **Document Constraints**: The system supports PDF and DOCX files up to 4 MB per upload, matching Vercel serverless request body constraints.

---

## 11. Future Improvements

- Support for additional document types (e.g., scanned PDF OCR via Tesseract).
- Multi-document folder indexing for enterprise vendor agreements.
- Jurisdiction-specific legal term glossaries.
- Enhanced WCAG 2.1 AA accessibility features.
