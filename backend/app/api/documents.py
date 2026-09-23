import os
import uuid
from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from app.auth.firebase_auth import get_current_user
from app.utils.file_validator import validate_file_security, temp_document_file
from app.services.document_parser import DocumentParserService
from app.models.firestore_service import FirestoreService

router = APIRouter(prefix="/api/documents", tags=["documents"])

@router.post("/upload")
async def upload_document(
    file: UploadFile = File(...),
    current_user: dict = Depends(get_current_user)
):
    """
    Secure Document Upload & Text Extraction Endpoint
    - Validates file security (extension, MIME, magic bytes, size limit 4MB)
    - Processes via temporary local file
    - Extracts structured text (PyMuPDF / python-docx)
    - Saves document metadata to Firestore under /users/{uid}/documents/{doc_id}
    - Guarantees immediate deletion of temporary binary file
    - Does NOT store binary files in Cloud Storage
    """
    uid = current_user.get("uid")
    if not uid:
        raise HTTPException(status_code=401, detail="Authentication failed: missing user UID")

    # Read binary content
    file_content = await file.read()

    # 1. Security Validation (Size, Extension, MIME, Magic Bytes)
    validate_file_security(file, file_content)

    filename = file.filename or "uploaded_document"
    ext = os.path.splitext(filename.lower())[1]
    doc_id = str(uuid.uuid4())

    # 2. Ephemeral Temporary File Processing
    with temp_document_file(file_content, ext) as temp_path:
        # Extract text based on file format
        if ext == ".pdf":
            extraction_result = DocumentParserService.extract_from_pdf(temp_path)
        else:
            extraction_result = DocumentParserService.extract_from_docx(temp_path)

    # 3. Store ONLY metadata in Firestore (/users/{uid}/documents/{doc_id})
    meta_data = {
        "documentId": doc_id,
        "uid": uid,
        "originalFileName": filename,
        "fileType": ext.lstrip("."),
        "fileSizeBytes": len(file_content),
        "pageCount": extraction_result.get("page_count", 1),
        "totalCharacters": extraction_result.get("total_characters", 0),
        "processingStatus": "complete",
        "extractionStatus": "success"
    }

    FirestoreService.save_document_meta(uid=uid, doc_id=doc_id, meta_data=meta_data)

    # Return structured extracted content for frontend / future AI pipeline
    return {
        "status": "success",
        "documentId": doc_id,
        "meta": meta_data,
        "extraction": {
            "fileType": extraction_result.get("file_type"),
            "pageCount": extraction_result.get("page_count"),
            "totalCharacters": extraction_result.get("total_characters"),
            "fullText": extraction_result.get("full_text"),
            "pages": extraction_result.get("extracted_pages"),
            "sections": extraction_result.get("extracted_sections")
        }
    }

@router.get("")
async def list_user_documents(current_user: dict = Depends(get_current_user)):
    """List metadata of all documents belonging to the authenticated user."""
    uid = current_user.get("uid")
    docs = FirestoreService.list_user_documents(uid)
    return {"status": "success", "documents": docs}
