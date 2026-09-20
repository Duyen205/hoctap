from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash

app = Flask(__name__)
CORS(app)

# Cấu hình kết nối MySQL
# Định dạng: mysql+pymysql://username:password@host:port/database_name
# (Hãy thay 'root' và 'matkhaucua-ban' bằng tài khoản MySQL thực tế của bạn)
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root:Dien30102005..%40@localhost:3306/cb'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

# Định nghĩa Model User
class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    full_name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)

# Tự động tạo bảng trong MySQL khi chạy app
with app.app_context():
    db.create_all()

@app.route('/api/auth/register', methods=['POST'])
def register():
    data = request.get_json()
    full_name = data.get('fullName')
    email = data.get('email')
    password = data.get('password')

    if not full_name or not email or not password:
        return jsonify({'message': 'Vui lòng điền đầy đủ thông tin!'}), 400

    if User.query.filter_by(email=email).first():
        return jsonify({'message': 'Email này đã được sử dụng!'}), 400

    hashed_password = generate_password_hash(password)
    new_user = User(full_name=full_name, email=email, password_hash=hashed_password)
    
    db.session.add(new_user)
    db.session.commit()

    return jsonify({'message': 'Đăng ký tài khoản thành công!'}), 200

@app.route('/api/auth/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    user = User.query.filter_by(email=email).first()

    if not user or not check_password_hash(user.password_hash, password):
        return jsonify({'message': 'Email hoặc mật khẩu không chính xác!'}), 400

    return jsonify({
        'message': 'Đăng nhập thành công!',
        'user': {
            'id': user.id,
            'fullName': user.full_name,
            'email': user.email
        }
    }), 200
@app.route('/')
def home():
    return "Server Flask đang chạy và kết nối MySQL thành công!"
if __name__ == '__main__':
    app.run(port=5000, debug=True)