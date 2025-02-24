from flask import request, jsonify
from config import app, db
from models import User
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity

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

# User Signup (POST /api/users)
@app.post('/api/users')
def signup():
    data = request.get_json() or {}  # ✅ Prevents crashing if no JSON is sent
    
    if not data.get('email') or not data.get('password'):
        return jsonify({"error": "Email and password are required"}), 400

    if User.query.filter_by(email=data['email']).first():
        return jsonify({"error": "User already exists"}), 400

    new_user = User(email=data['email'])
    new_user.password = data['password']  # Uses password setter to hash password
    db.session.add(new_user)
    db.session.commit()

    return jsonify({"message": "User created successfully", "id": new_user.id}), 201

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
