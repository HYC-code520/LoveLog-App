from flask import request, jsonify
from config import app, db
from models import User

# ✅ Test route to check if backend is running
@app.route('/api', methods=['GET'])
def index():
    return jsonify({"message": "Backend is running!"})

# ✅ Get all users
@app.get('/api/users')
def get_all_users():
    users = User.query.all()
    return jsonify([{"id": user.id, "email": user.email} for user in users]), 200

# ✅ Get a specific user by ID
@app.get('/api/users/<int:id>')
def get_user_by_id(id):
    user = User.query.get(id)
    if user:
        return jsonify({"id": user.id, "email": user.email}), 200
    return jsonify({"error": "User not found"}), 404

# ✅ User Signup (POST /api/users)
@app.post('/api/users')
def signup():
    data = request.json
    if User.query.filter_by(email=data['email']).first():
        return jsonify({"error": "User already exists"}), 400

    new_user = User(email=data['email'], password=data['password'])  # Plaintext for now
    db.session.add(new_user)
    db.session.commit()
    return jsonify({"message": "User created successfully", "id": new_user.id}), 201

# ✅ Run Flask Server
if __name__ == '__main__':
    app.run(debug=True)