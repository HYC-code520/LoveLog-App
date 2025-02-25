from flask import request, jsonify
from config import app, db, bcrypt
from models import User, PasswordResetToken
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
import secrets


@app.post('/api/forgot-password')
def forgot_password():
    data = request.get_json() or {}

    if not data.get('email'):
        return jsonify({"error": "Email is required"}), 400

    user = User.query.filter_by(email=data['email']).first()
    if not user:
        return jsonify({"error": "User not found"}), 404

    # 🔥 Generate a secure reset token
    reset_token = secrets.token_hex(16)
    reset_entry = PasswordResetToken(user_id=user.id, token=reset_token)
    db.session.add(reset_entry)
    db.session.commit()

    
    # ✅ Instead of returning the token, pretend we are sending an email
    print(f"📧 Sending email to {user.email} with reset link: https://your-app.com/reset-password?token={reset_token}")

    return jsonify({"message": "If your email exists, a password reset link has been sent!"}), 200

@app.post('/api/reset-password')
def reset_password():
    data = request.get_json() or {}

    if not data.get('token') or not data.get('new_password'):
        return jsonify({"error": "Token and new password are required"}), 400

    reset_entry = PasswordResetToken.query.filter_by(token=data['token']).first()

    if not reset_entry or reset_entry.is_expired():  # ✅ Check if token expired
        return jsonify({"error": "Invalid or expired token"}), 400

    user = User.query.get(reset_entry.user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    # 🔹 Hash the new password before storing it (SECURITY FIX)
    hashed_password = bcrypt.generate_password_hash(data['new_password']).decode('utf-8')
    user.password = hashed_password  

    db.session.delete(reset_entry)  # ✅ Remove the used token
    db.session.commit()

    return jsonify({"message": "Password reset successful!"}), 200


# ✅ Protected route to get logged-in user
@app.get('/api/user')  
@jwt_required()  
def get_logged_in_user():
    current_user_id = get_jwt_identity()
    user = db.session.get(User, current_user_id)
    if user:
        return jsonify({"id": user.id, "email": user.email}), 200
    return jsonify({"error": "User not found"}), 404


# ✅ Signup Route
@app.post('/api/signup')
def signup():
    data = request.get_json() or {}

    if not data.get('email') or not data.get('password'):
        return jsonify({"error": "Email and password are required"}), 400

    if User.query.filter_by(email=data['email']).first():
        return jsonify({"error": "User already exists"}), 400

    new_user = User(email=data['email'])
    new_user.password = bcrypt.generate_password_hash(data['password']).decode('utf-8')  # ✅ Hash password

    db.session.add(new_user)
    db.session.commit()

    access_token = create_access_token(identity=new_user.id)

    return jsonify({
        "message": "User created successfully",
        "id": new_user.id,
        "access_token": access_token
    }), 201


# ✅ Login Route
@app.post('/api/login')
def login():
    data = request.get_json() or {}

    if not data.get('email') or not data.get('password'):
        return jsonify({"error": "Email and password are required"}), 400

    user = User.query.filter_by(email=data['email']).first()

    if user and user.check_password(data['password']):  # ✅ Use the check_password method
        access_token = create_access_token(identity=user.id)  
        return jsonify({
            "message": "Login successful!",
            "access_token": access_token
        }), 200

    return jsonify({"error": "Invalid credentials"}), 401


# ✅ Run Flask Server
if __name__ == '__main__':
    app.run(debug=True)
