from flask import request, jsonify
from config import app, db, bcrypt
from models import User, PasswordResetToken, Event
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
import secrets
from datetime import datetime


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


@app.patch('/api/user/update')
@jwt_required()
def update_user():
    """Update user email or password"""
    try:
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)

        if not user:
            return jsonify({"error": "User not found"}), 404

        data = request.get_json() or {}

        # Update email if provided
        if "email" in data:
            new_email = data["email"].strip()
            if not new_email or "@" not in new_email:
                return jsonify({"error": "Invalid email format"}), 400
            # Check if email is already in use
            if User.query.filter(User.email == new_email, User.id != current_user_id).first():
                return jsonify({"error": "Email already taken"}), 400
            user.email = new_email

        # Update password if provided
        if "password" in data:
            new_password = data["password"].strip()
            if len(new_password) < 6:
                return jsonify({"error": "Password must be at least 6 characters"}), 400
            user.password = bcrypt.generate_password_hash(new_password).decode("utf-8")

        db.session.commit()
        return jsonify({"message": "User updated successfully"}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.delete('/api/user/delete')
@jwt_required()
def delete_user():
    """Delete the logged-in user account"""
    try:
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)

        if not user:
            return jsonify({"error": "User not found"}), 404

        db.session.delete(user)
        db.session.commit()
        return jsonify({"message": "User deleted successfully"}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


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


@app.get('/api/events')
@jwt_required()
def get_user_events():
    """Get all events for the logged-in user."""
    try:
        current_user_id = get_jwt_identity()  # Get user ID from JWT
        events = Event.query.filter_by(user_id=current_user_id).all()  # Fetch all events
        print("Fetched events:", events)  # Debugging log


        if not events:
            return jsonify({"message": "No events found"}), 200

        # ✅ Manually format event objects into dictionaries
        events_list = []
        for event in events:
            events_list.append({
                "id": event.id,
                "title": event.title,
                "date": event.date,
                "start_time": event.start_time,
                "end_time": event.end_time,
                "range_start": event.range_start,
                "range_end": event.range_end,
                "address": event.address,
                "latitude": event.latitude,
                "longitude": event.longitude,
                "photo": event.photo
            })

        return jsonify({"events": events_list}), 200

    except Exception as e:
        print("Error fetching events:", str(e))  # Debugging log
        return jsonify({"error": str(e)}), 500


@app.post('/api/events')
@jwt_required()
def add_event():
    """Add a new event for the logged-in user."""
    try:
        current_user_id = get_jwt_identity()
        data = request.get_json() or {}

        # 🔥 Validation: Ensure required fields are present
        required_fields = ["title", "date"]
        for field in required_fields:
            if not data.get(field) or not isinstance(data[field], str) or not data[field].strip():
                return jsonify({"error": f"'{field}' is required and must be a non-empty string"}), 400

        # ✅ Handle optional fields to prevent `.strip()` errors
        title = data.get("title", "").strip()
        date = data.get("date", "").strip()
        start_time = data.get("start_time", "").strip() if data.get("start_time") else None
        end_time = data.get("end_time", "").strip() if data.get("end_time") else None
        address = data.get("address", "").strip() if data.get("address") else None
        photo = data.get("photo", "").strip() if data.get("photo") else None
        range_start = data.get("range_start", "").strip() if data.get("range_start") else None
        range_end = data.get("range_end", "").strip() if data.get("range_end") else None

        # ✅ Ensure latitude and longitude are numbers or None
        latitude = data.get("latitude")
        longitude = data.get("longitude")

        if latitude is not None:
            try:
                latitude = float(latitude)
            except ValueError:
                return jsonify({"error": "Latitude must be a valid number"}), 400

        if longitude is not None:
            try:
                longitude = float(longitude)
            except ValueError:
                return jsonify({"error": "Longitude must be a valid number"}), 400

        # ✅ Create new event
        new_event = Event(
            user_id=current_user_id,
            title=title,
            date=date,
            start_time=start_time,
            end_time=end_time,
            address=address,
            latitude=latitude,
            longitude=longitude,
            range_start=range_start,
            range_end=range_end,
            photo=photo
        )

        db.session.add(new_event)
        db.session.commit()

        return jsonify({"message": "Event added successfully", "event": new_event.to_dict()}), 201

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# @app.patch('/api/events/<int:event_id>')
# @jwt_required()
# def update_event(event_id):
#     """Update an existing event for the logged-in user."""
#     try:
#         user_id = get_jwt_identity()
#         event = Event.query.get(event_id)

#         if not event:
#             return jsonify({"error": "Event not found"}), 404

#         if event.user_id != user_id:
#             return jsonify({"error": "Unauthorized: You can only update your own events."}), 403

#         data = request.get_json() or {}

#         # Only update fields that are present in the request body
#         if "title" in data:
#             event.title = data["title"].strip()
#         if "date" in data:
#             event.date = data["date"].strip()
#         if "start_time" in data:
#             event.start_time = data["start_time"].strip()
#         if "end_time" in data:
#             event.end_time = data["end_time"].strip() if data.get("end_time") else None
#         if "address" in data:
#             event.address = data["address"].strip() if data.get("address") else None
#         if "latitude" in data:
#             try:
#                 event.latitude = float(data["latitude"])
#             except ValueError:
#                 return jsonify({"error": "Latitude must be a valid number"}), 400
#         if "longitude" in data:
#             try:
#                 event.longitude = float(data["longitude"])
#             except ValueError:
#                 return jsonify({"error": "Longitude must be a valid number"}), 400
#         if "range_start" in data:
#             event.range_start = data["range_start"].strip() if data.get("range_start") else None
#         if "range_end" in data:
#             event.range_end = data["range_end"].strip() if data.get("range_end") else None
#         if "photo" in data:
#             event.photo = data["photo"].strip() if data.get("photo") else None

#         db.session.commit()
#         return jsonify({"message": "Event updated successfully", "event": event.to_dict()}), 200

#     except Exception as e:
#         return jsonify({"error": str(e)}), 500


@app.put('/api/events/<int:event_id>')
@jwt_required()
def update_event(event_id):
    """Update an existing event for the logged-in user (Full Replacement)."""
    try:
        user_id = get_jwt_identity()
        event = Event.query.get(event_id)

        if not event:
            return jsonify({"error": "Event not found"}), 404

        if event.user_id != user_id:
            return jsonify({"error": "Unauthorized: You can only update your own events."}), 403

        data = request.get_json() or {}

        # ✅ Required fields (MUST be provided)
        required_fields = ["title", "date"]
        for field in required_fields:
            if field not in data or not isinstance(data[field], str) or not data[field].strip():
                return jsonify({"error": f"'{field}' is required and must be a non-empty string"}), 400

        # ✅ Optional fields (Only update if provided)
        event.title = data["title"].strip()
        event.date = data["date"].strip()
        
        event.start_time = data.get("start_time", None)  # ✅ Now Optional
        event.end_time = data.get("end_time", None)  # ✅ Now Optional
        event.details = data.get("details", None)  # ✅ Now Optional
        event.address = data.get("address", None)  # ✅ Now Optional
        event.photo = data.get("photo", None)  # ✅ Now Optional
        event.range_start = data.get("range_start", None)  # ✅ Now Optional
        event.range_end = data.get("range_end", None)  # ✅ Now Optional

        # ✅ Optional Numeric Fields (Convert only if provided)
        event.latitude = float(data["latitude"]) if "latitude" in data and isinstance(data["latitude"], (int, float)) else None
        event.longitude = float(data["longitude"]) if "longitude" in data and isinstance(data["longitude"], (int, float)) else None

        db.session.commit()
        return jsonify({"message": "Event updated successfully", "event": event.to_dict()}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500




@app.delete('/api/events/<int:event_id>')
@jwt_required()
def delete_event(event_id):
    user_id = get_jwt_identity()

    # Fetch event by ID
    event = Event.query.get(event_id)

    if not event:
        return jsonify({"error": "Event not found"}), 404

    # Check if the event belongs to the logged-in user
    if event.user_id != user_id:
        return jsonify({"error": "Unauthorized: You can only delete your own events."}), 403

    # Delete event
    db.session.delete(event)
    db.session.commit()
    return jsonify({"message": "Event deleted successfully!"}), 200



# ✅ Run Flask Server
if __name__ == '__main__':
    app.run(debug=True)

