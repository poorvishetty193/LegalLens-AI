from fastapi import APIRouter, Depends
from pydantic import BaseModel
from typing import Optional
from app.auth.firebase_auth import get_current_user
from app.models.firestore_service import FirestoreService

router = APIRouter(prefix="/api/auth", tags=["auth"])

class UserSyncRequest(BaseModel):
    displayName: Optional[str] = None
    photoURL: Optional[str] = None

@router.post("/sync-user")
async def sync_user(
    body: UserSyncRequest,
    current_user: dict = Depends(get_current_user)
):
    """Sync user metadata to Firestore upon successful Firebase authentication."""
    uid = current_user.get("uid")
    email = current_user.get("email", "")
    display_name = body.displayName or current_user.get("name", "")
    
    # Write only approved fields to Firestore under /users/{uid}
    FirestoreService.save_user_profile(
        uid=uid,
        email=email,
        display_name=display_name
    )
    
    return {
        "status": "success",
        "uid": uid,
        "email": email,
        "displayName": display_name
    }

@router.get("/me")
async def get_me(current_user: dict = Depends(get_current_user)):
    """Verify auth state and return current user profile."""
    return {
        "uid": current_user.get("uid"),
        "email": current_user.get("email"),
        "name": current_user.get("name")
    }
