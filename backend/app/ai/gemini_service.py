import json
import logging
from typing import Dict, Any
from google import genai
from google.genai import types
from pydantic import ValidationError
from fastapi import HTTPException

from app.config import settings
from app.ai.prompts import ANALYSIS_SYSTEM_PROMPT
from app.ai.schemas import DocumentAnalysisSchema
from app.ai.qa_prompts import QA_SYSTEM_PROMPT
from app.ai.qa_schemas import AskQuestionResponseSchema
from app.ai.comparison_prompts import COMPARISON_SYSTEM_PROMPT
from app.ai.comparison_schemas import DocumentComparisonResponseSchema
from app.ai.lawyer_prompts import LAWYER_BRIEF_SYSTEM_PROMPT
from app.ai.lawyer_schemas import LawyerBriefResponseSchema

logger = logging.getLogger("legallens.ai")

class GeminiAnalysisService:
    """Service wrapper for Google Gemini API document analysis, Q&A, document comparison, and lawyer preparation brief."""

    @staticmethod
    def _get_client() -> genai.Client:
        api_key = settings.GEMINI_API_KEY
        if not api_key:
            raise HTTPException(
                status_code=503,
                detail="Gemini AI API key is not configured on the server."
            )
        return genai.Client(api_key=api_key)

    @classmethod
    def analyze_document_text(cls, document_text: str) -> DocumentAnalysisSchema:
        """
        Send extracted document text to Gemini with prompt injection protection and schema enforcement.
        """
        if not document_text or not document_text.strip():
            raise HTTPException(
                status_code=400,
                detail="Cannot analyze empty document text."
            )

        client = cls._get_client()

        user_content = f"""
Analyze the following legal document text:

[DOCUMENT_START]
{document_text}
[DOCUMENT_END]
"""

        try:
            response = client.models.generate_content(
                model="gemini-3.8-flash",
                contents=user_content,
                config=types.GenerateContentConfig(
                    system_instruction=ANALYSIS_SYSTEM_PROMPT,
                    response_mime_type="application/json",
                    response_schema=DocumentAnalysisSchema,
                    temperature=0.1,
                )
            )

            raw_text = response.text
            if not raw_text:
                raise HTTPException(status_code=503, detail="Gemini API returned empty response.")

            try:
                json_data = json.loads(raw_text)
                return DocumentAnalysisSchema.model_validate(json_data)
            except (json.JSONDecodeError, ValidationError) as e:
                logger.error(f"Gemini output failed validation: {e}")
                raise HTTPException(
                    status_code=500,
                    detail="AI analysis output failed validation schema. Please try again."
                )

        except Exception as e:
            if isinstance(e, HTTPException):
                raise e
            logger.error(f"Gemini API execution error: {e}")
            raise HTTPException(
                status_code=503,
                detail=f"AI service currently unavailable: {str(e)}"
            )

    @classmethod
    def answer_document_question(cls, document_text: str, question: str) -> AskQuestionResponseSchema:
        """
        Grounded Q&A using Gemini API with strict prompt delimiters and Pydantic validation.
        """
        if not document_text or not document_text.strip():
            raise HTTPException(status_code=400, detail="Cannot answer questions on empty document content.")

        if not question or not question.strip():
            raise HTTPException(status_code=400, detail="Question cannot be empty.")

        client = cls._get_client()

        user_prompt = f"""
Document Content:
[DOCUMENT_START]
{document_text}
[DOCUMENT_END]

User Question:
[USER_QUESTION_START]
{question}
[USER_QUESTION_END]
"""

        try:
            response = client.models.generate_content(
                model="gemini-3.8-flash",
                contents=user_prompt,
                config=types.GenerateContentConfig(
                    system_instruction=QA_SYSTEM_PROMPT,
                    response_mime_type="application/json",
                    response_schema=AskQuestionResponseSchema,
                    temperature=0.1,
                )
            )

            raw_text = response.text
            if not raw_text:
                raise HTTPException(status_code=503, detail="Gemini API returned empty response for Q&A.")

            try:
                json_data = json.loads(raw_text)
                return AskQuestionResponseSchema.model_validate(json_data)
            except (json.JSONDecodeError, ValidationError) as e:
                logger.error(f"Gemini Q&A output failed validation: {e}")
                raise HTTPException(
                    status_code=500,
                    detail="AI Q&A output failed validation schema."
                )

        except Exception as e:
            if isinstance(e, HTTPException):
                raise e
            logger.error(f"Gemini Q&A execution error: {e}")
            raise HTTPException(
                status_code=503,
                detail=f"AI Q&A service currently unavailable: {str(e)}"
            )

    @classmethod
    def compare_documents(
        cls, doc_a_name: str, doc_a_text: str, doc_b_name: str, doc_b_text: str
    ) -> DocumentComparisonResponseSchema:
        """
        Compare two legal documents using Gemini API with strict prompt injection delimiters.
        """
        if not doc_a_text.strip() or not doc_b_text.strip():
            raise HTTPException(status_code=400, detail="Cannot compare documents with empty text content.")

        client = cls._get_client()

        comparison_prompt = f"""
Compare the following two legal documents:

Document A ({doc_a_name}):
[DOCUMENT_A_START]
{doc_a_text}
[DOCUMENT_A_END]

Document B ({doc_b_name}):
[DOCUMENT_B_START]
{doc_b_text}
[DOCUMENT_B_END]
"""

        try:
            response = client.models.generate_content(
                model="gemini-3.8-flash",
                contents=comparison_prompt,
                config=types.GenerateContentConfig(
                    system_instruction=COMPARISON_SYSTEM_PROMPT,
                    response_mime_type="application/json",
                    response_schema=DocumentComparisonResponseSchema,
                    temperature=0.1,
                )
            )

            raw_text = response.text
            if not raw_text:
                raise HTTPException(status_code=503, detail="Gemini API returned empty response for comparison.")

            try:
                json_data = json.loads(raw_text)
                json_data["document_a_name"] = doc_a_name
                json_data["document_b_name"] = doc_b_name
                return DocumentComparisonResponseSchema.model_validate(json_data)
            except (json.JSONDecodeError, ValidationError) as e:
                logger.error(f"Gemini Comparison output failed validation: {e}")
                raise HTTPException(
                    status_code=500,
                    detail="AI document comparison output failed validation schema."
                )

        except Exception as e:
            if isinstance(e, HTTPException):
                raise e
            logger.error(f"Gemini Comparison execution error: {e}")
            raise HTTPException(
                status_code=503,
                detail=f"AI Comparison service currently unavailable: {str(e)}"
            )

    @classmethod
    def generate_lawyer_brief(
        cls, analysis_data: Dict[str, Any], user_concerns: str
    ) -> LawyerBriefResponseSchema:
        """
        Generate a concise, grounded legal consultation brief for lawyer preparation using Gemini API.
        """
        client = cls._get_client()

        analysis_str = json.dumps(analysis_data, indent=2)

        prompt = f"""
Legal Document Analysis & Data:
[ANALYSIS_DATA_START]
{analysis_str}
[ANALYSIS_DATA_END]

User-Provided Concerns & Questions:
[USER_CONCERNS_START]
{user_concerns.strip() if user_concerns else "None provided."}
[USER_CONCERNS_END]
"""

        try:
            response = client.models.generate_content(
                model="gemini-3.8-flash",
                contents=prompt,
                config=types.GenerateContentConfig(
                    system_instruction=LAWYER_BRIEF_SYSTEM_PROMPT,
                    response_mime_type="application/json",
                    response_schema=LawyerBriefResponseSchema,
                    temperature=0.1,
                )
            )

            raw_text = response.text
            if not raw_text:
                raise HTTPException(status_code=503, detail="Gemini API returned empty response for Lawyer Brief.")

            try:
                json_data = json.loads(raw_text)
                return LawyerBriefResponseSchema.model_validate(json_data)
            except (json.JSONDecodeError, ValidationError) as e:
                logger.error(f"Gemini Lawyer Brief output failed validation: {e}")
                raise HTTPException(
                    status_code=500,
                    detail="AI Lawyer Brief output failed validation schema."
                )

        except Exception as e:
            if isinstance(e, HTTPException):
                raise e
            logger.error(f"Gemini Lawyer Brief execution error: {e}")
            raise HTTPException(
                status_code=503,
                detail=f"AI Lawyer Brief service currently unavailable: {str(e)}"
            )

