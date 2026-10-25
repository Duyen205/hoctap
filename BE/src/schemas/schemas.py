from pydantic import BaseModel, EmailStr
from typing import Optional

class RegisterIn(BaseModel):
    full_name: str
    email: EmailStr
    password: str
    role: str = "STUDENT"  # STUDENT | LECTURER
    student_code: Optional[str] = None
    department: Optional[str] = None

class LoginIn(BaseModel):
    email: EmailStr
    password: str

class UserOut(BaseModel):
    id: str
    full_name: str
    email: str
    role: str
    is_active: bool
    student_code: Optional[str] = None
    department: Optional[str] = None