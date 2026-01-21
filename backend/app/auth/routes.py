from fastapi import APIRouter, Depends
from auth.deps import get_current_user
from app.models.user import User

router = APIRouter(prefix="/auth", tags=["auth"])

@router.get("/me")
def auth_me(current_user: User = Depends(get_current_user)):
    return current_user
