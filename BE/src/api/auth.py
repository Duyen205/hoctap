from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
import uuid

from src.core.database import get_db
from src.core.security import hash_password, verify_password, create_access_token, decode_token
from src.models.models import Admin, Lecturer, Student
from src.schemas.schemas import RegisterIn, LoginIn

router = APIRouter(prefix="/api/auth", tags=["Auth"])
security = HTTPBearer()


async def find_user_by_email(db: AsyncSession, email: str):
    for model, role, id_field in [
        (Admin, "ADMIN", "admin_id"),
        (Lecturer, "LECTURER", "lecturer_id"),
        (Student, "STUDENT", "student_id"),
    ]:
        result = await db.execute(select(model).where(model.email == email))
        user = result.scalar_one_or_none()
        if user:
            return user, role, id_field
    return None, None, None


def user_to_dict(user, role: str) -> dict:
    data = {
        "full_name": user.full_name,
        "email": user.email,
        "role": role,
        "is_active": user.is_active,
    }
    if role == "ADMIN":
        data["id"] = str(user.admin_id)
    elif role == "LECTURER":
        data["id"] = str(user.lecturer_id)
        data["department"] = user.department
    else:
        data["id"] = str(user.student_id)
        data["student_code"] = user.student_code
    return data


@router.post("/register")
async def register(body: RegisterIn, db: AsyncSession = Depends(get_db)):
    email = body.email.lower().strip()
    role = body.role.upper()

    if role not in ("STUDENT", "LECTURER"):
        raise HTTPException(400, detail="Role chỉ chấp nhận STUDENT hoặc LECTURER")
    if len(body.password) < 6:
        raise HTTPException(400, detail="Mật khẩu tối thiểu 6 ký tự")

    existing, _, _ = await find_user_by_email(db, email)
    if existing:
        raise HTTPException(409, detail="Email đã được đăng ký")

    pwd = hash_password(body.password)

    if role == "STUDENT":
        if not body.student_code:
            raise HTTPException(400, detail="Mã sinh viên bắt buộc")
        r = await db.execute(select(Student).where(Student.student_code == body.student_code))
        if r.scalar_one_or_none():
            raise HTTPException(409, detail="Mã sinh viên đã tồn tại")
        user = Student(
            student_id=uuid.uuid4(),
            student_code=body.student_code.strip(),
            full_name=body.full_name.strip(),
            email=email,
            password_hash=pwd,
        )
    else:
        user = Lecturer(
            lecturer_id=uuid.uuid4(),
            full_name=body.full_name.strip(),
            email=email,
            password_hash=pwd,
            department=body.department,
        )

    db.add(user)
    await db.flush()
    return {"message": "Đăng ký thành công! Vui lòng đăng nhập.", "user": user_to_dict(user, role)}


@router.post("/login")
async def login(body: LoginIn, db: AsyncSession = Depends(get_db)):
    email = body.email.lower().strip()
    user, role, id_field = await find_user_by_email(db, email)

    if not user or not verify_password(body.password, user.password_hash):
        raise HTTPException(401, detail="Email hoặc mật khẩu không chính xác!")
    if not user.is_active:
        raise HTTPException(403, detail="Tài khoản đã bị khóa!")

    user_id = str(getattr(user, id_field))
    token = create_access_token(subject=f"{role}:{user_id}", role=role)

    return {
        "message": "Đăng nhập thành công!",
        "token": token,
        "user": user_to_dict(user, role),
    }


@router.get("/me")
async def me(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: AsyncSession = Depends(get_db),
):
    try:
        payload = decode_token(credentials.credentials)
        sub = payload.get("sub", "")
        role, user_id = sub.split(":", 1)
    except Exception:
        raise HTTPException(401, detail="Token không hợp lệ")

    mapping = {
        "ADMIN": (Admin, Admin.admin_id),
        "LECTURER": (Lecturer, Lecturer.lecturer_id),
        "STUDENT": (Student, Student.student_id),
    }
    if role not in mapping:
        raise HTTPException(401, detail="Token không hợp lệ")

    model, id_col = mapping[role]
    result = await db.execute(select(model).where(id_col == uuid.UUID(user_id)))
    user = result.scalar_one_or_none()
    if not user:
        raise HTTPException(404, detail="Không tìm thấy người dùng")
    return {"user": user_to_dict(user, role)}