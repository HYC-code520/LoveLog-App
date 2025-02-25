from flask import request, jsonify
from config import app, db
from models import User
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
import secrets


# 🔹 Simulated database for reset tokens (in-memory storage for now)
reset_tokens = {}

@app.post('/api/forgot-password')
def forgot_password():
    data = request.get_json() or {}

    if not data.get('email'):
        return jsonify({"error": "Email is required"}), 400

    user = User.query.filter_by(email=data['email']).first()
    if not user:
        return jsonify({"error": "User not found"}), 404

    # 🔥 Generate a reset token (temporary and in-memory for now)
    reset_token = secrets.token_hex(16)
    reset_tokens[reset_token] = user.id  # Store token with user ID

    # Simulate email sending (In real app, you'd send an email)
    print(f"🔹 RESET TOKEN: {reset_token} (This would be sent via email)")

    return jsonify({"message": "Password reset email sent!", "reset_token": reset_token}), 200

@app.post('/api/reset-password')
def reset_password():
    data = request.get_json() or {}

    if not data.get('token') or not data.get('new_password'):
        return jsonify({"error": "Token and new password are required"}), 400

    user_id = reset_tokens.get(data['token'])
    if not user_id:
        return jsonify({"error": "Invalid or expired token"}), 400

    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    # 🔹 Update the user's password
    user.password = data['new_password']  # Uses password setter
    db.session.commit()

    # Remove token after use
    del reset_tokens[data['token']]

    return jsonify({"message": "Password reset successful!"}), 200

# Test route to check if backend is running
@app.route('/api', methods=['GET'])
def index():
    return jsonify({"message": "Backend is running!"})

@app.route('/')
def home():
    return jsonify({"message": "Welcome to MyLoveLog API!"})

@app.get('/api/user')  # 🔹 Change the route to singular /api/user
@jwt_required()  # ✅ Require JWT to access this route
def get_logged_in_user():
    current_user_id = get_jwt_identity()  # ✅ Get the logged-in user ID
    user = User.query.get(current_user_id)  # 🔍 Fetch that user from the DB
    if user:
        return jsonify({"id": user.id, "email": user.email}), 200
    return jsonify({"error": "User not found"}), 404


# Get a specific user by ID (✅ PROTECTED)
@app.get('/api/users/<int:id>')
@jwt_required()  # ✅ Require JWT to access this route
def get_user_by_id(id):
    user = User.query.get(id)
    if user:
        return jsonify({"id": user.id, "email": user.email}), 200
    return jsonify({"error": "User not found"}), 404

# User Signup 
@app.post('/api/signup')
def signup():
    data = request.get_json() or {}  

    if not data.get('email') or not data.get('password'):
        return jsonify({"error": "Email and password are required"}), 400

    if User.query.filter_by(email=data['email']).first():
        return jsonify({"error": "User already exists"}), 400

    new_user = User(email=data['email'])
    new_user.password = data['password']  # ✅ Uses password setter to hash password
    db.session.add(new_user)
    db.session.commit()

    # ✅ Automatically generate JWT after successful sign-up
    access_token = create_access_token(identity=new_user.id)

    return jsonify({
        "message": "User created successfully",
        "id": new_user.id,
        "access_token": access_token  # ✅ Return JWT to auto-login
    }), 201


# User Login (POST /api/login)
@app.post('/api/login')
def login():
    data = request.get_json() or {}  # ✅ Prevents crashing if no JSON is sent
    
    if not data.get('email') or not data.get('password'):
        return jsonify({"error": "Email and password are required"}), 400

    user = User.query.filter_by(email=data['email']).first()
    
    if user and user.check_password(data['password']):  # ✅ Ensure check_password is used
        access_token = create_access_token(identity=user.id)  # ✅ Generate JWT token
        return jsonify({
            "message": "Login successful!",
            "access_token": access_token
        }), 200
    
    return jsonify({"error": "Invalid credentials"}), 401

# Run Flask Server
if __name__ == '__main__':
    app.run(debug=True)
