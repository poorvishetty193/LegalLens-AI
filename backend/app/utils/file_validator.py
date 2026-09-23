import os
import tempfile
from contextlib import contextmanager
from fastapi import HTTPException, UploadFile

# Allowed constants
MAX_FILE_SIZE_BYTES = 4 * 1024 * 1024  # 4 MB limit (Vercel serverless body constraint)
ALLOWED_EXTENSIONS = {".pdf", ".docx"}
ALLOWED_MIME_TYPES = {
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/x-pdf",
    "application/octet-stream" # checked against magic bytes
}

# Magic bytes signatures
PDF_MAGIC = b"%PDF"
DOCX_MAGIC = b"PK\x03\x04"

class FileValidationError(HTTPException):
    def __init__(self, detail: str):
        super().__init__(status_code=400, detail=detail)

def validate_file_security(file: UploadFile, file_content: bytes):
    """Enforce security rules on uploaded file."""
    # 1. Size Check
    if len(file_content) > MAX_FILE_SIZE_BYTES:
        raise FileValidationError(f"File size exceeds maximum limit of 4 MB (got {len(file_content)/(1024*1024):.2f} MB)")
    if len(file_content) == 0:
        raise FileValidationError("File is empty (0 bytes)")

    # 2. Extension Check
    filename = file.filename or ""
    ext = os.path.splitext(filename.lower())[1]
    if ext not in ALLOWED_EXTENSIONS:
        raise FileValidationError(f"Unsupported file extension '{ext}'. Only .pdf and .docx are permitted.")

    # 3. Content-Type Check
    content_type = (file.content_type or "").lower()
    if content_type and content_type not in ALLOWED_MIME_TYPES:
        raise FileValidationError(f"Invalid MIME type '{content_type}'.")

    # 4. Magic Bytes Signature Check
    if ext == ".pdf":
        if not file_content.startswith(PDF_MAGIC):
            raise FileValidationError("File header does not match PDF signature (%PDF). File may be corrupted or disguised.")
    elif ext == ".docx":
        if not file_content.startswith(DOCX_MAGIC):
            raise FileValidationError("File header does not match DOCX signature (PK ZIP format). File may be corrupted or disguised.")

@contextmanager
def temp_document_file(file_content: bytes, extension: str):
    """Context manager that guarantees creation and immediate cleanup of temporary file."""
    temp_file_path = None
    try:
        with tempfile.NamedTemporaryFile(delete=False, suffix=extension) as tmp:
            tmp.write(file_content)
            temp_file_path = tmp.name
        yield temp_file_path
    finally:
        if temp_file_path and os.path.exists(temp_file_path):
            try:
                os.remove(temp_file_path)
            except Exception as e:
                pass
