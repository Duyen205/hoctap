from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from werkzeug.security import generate_password_hash, check_password_hash

from extensions import db
from models import User, Role

auth_bp = Blueprint("auth", __name__, url_prefix="/api/auth")

@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json(silent=True) or {}
    email = (data.get("email") or "").strip().lower()
    password = data.get("password") or ""

    user = User.query.filter_by(email=email).first()

    if not user or not check_password_hash(user.password_hash, password):
        return jsonify({"message": "Email hoặc mật khẩu không chính xác!"}), 401

    if user.status != "ACTIVE":
        return jsonify({"message": "Tài khoản của bạn đã bị khóa!"}), 403

    # additional_claims chứa role để phân quyền ở decorators.roles_required
    token = create_access_token(identity=str(user.id), additional_claims={"role": user.role})

    return jsonify({
        "message": "Đăng nhập thành công!",
        "token": token,
        "user": user.to_dict(),
    }), 200


@auth_bp.route("/me", methods=["GET"])
@jwt_required()
def me():
    """Frontend gọi endpoint này mỗi khi tải lại trang.

    Nếu token còn lưu trong localStorage và còn hạn (30 ngày), request này
    trả về 200 kèm thông tin user -> frontend tự động coi là đã đăng nhập,
    KHÔNG bắt nhập lại email/mật khẩu. Nếu token hết hạn/không hợp lệ,
    flask-jwt-extended tự trả về 401 và frontend điều hướng về trang login.
    """
    user_id = get_jwt_identity()
    user = User.query.get(int(user_id))
    if not user:
        return jsonify({"message": "Không tìm thấy người dùng!"}), 404
    return jsonify({"user": user.to_dict()}), 200


@auth_bp.route("/logout", methods=["POST"])
@jwt_required()
def logout():
    # JWT ở đây là stateless (không lưu session phía server), nên logout
    # chỉ cần frontend xóa token đã lưu (localStorage) là đủ.
    return jsonify({"message": "Đăng xuất thành công!"}), 200

