import os
import json
import logging
import firebase_admin
from firebase_admin import credentials, auth, firestore
from fastapi import HTTPException, Security
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

logger = logging.getLogger("legallens.auth")

security = HTTPBearer(auto_error=False)

def initialize_firebase():
    """Initialize Firebase Admin SDK with credentials or fallback for dev."""
    if firebase_admin._apps:
        return

    cert_path = os.getenv("FIREBASE_SERVICE_ACCOUNT_JSON")
    
    if cert_path and os.path.exists(cert_path):
        cred = credentials.Certificate(cert_path)
        firebase_admin.initialize_app(cred)
        logger.info("Firebase Admin initialized with service account file.")
    elif cert_path and cert_path.startswith("{"):
        try:
            cert_dict = json.loads(cert_path)
            cred = credentials.Certificate(cert_dict)
            firebase_admin.initialize_app(cred)
            logger.info("Firebase Admin initialized with JSON string.")
        except Exception as e:
            logger.warning(f"Failed to parse FIREBASE_SERVICE_ACCOUNT_JSON string: {e}")
            firebase_admin.initialize_app()
    else:
        logger.warning("FIREBASE_SERVICE_ACCOUNT_JSON not provided/found. Initializing default app.")
        try:
            firebase_admin.initialize_app()
        except Exception as e:
            logger.error(f"Default Firebase Admin init failed: {e}")

# Initialize on import
initialize_firebase()

def get_firestore_db():
    """Get Firestore client instance."""
    return firestore.client()

async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Security(security)
) -> dict:
    """Dependency to verify Firebase ID Token from Authorization header."""
    if not credentials or not credentials.credentials:
        raise HTTPException(
            status_code=401,
            detail="Missing authorization token",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    token = credentials.credentials
    try:
        decoded_token = auth.verify_id_token(token)
        return decoded_token
    except auth.ExpiredIdTokenError:
        raise HTTPException(status_code=401, detail="Token has expired")
    except auth.InvalidIdTokenError:
        raise HTTPException(status_code=401, detail="Invalid auth token")
    except Exception as e:
        logger.error(f"Token verification error: {e}")
        raise HTTPException(status_code=401, detail="Authentication failed")
