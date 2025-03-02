from config import db, bcrypt
from sqlalchemy_serializer import SerializerMixin
from datetime import datetime, timedelta

# User model for authentication
class User(db.Model, SerializerMixin):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(256), nullable=False)  # 🔹 Increased hash length

    # Relationship to events
    events = db.relationship("Event", back_populates="user")  # Explicitly defined here

    # 🔹 Serialization rules to prevent exposing passwords & recursive loops
    serialize_rules = ("-password_hash", "-events.user")


    # Property to prevent direct access to password hash
    @property
    def password(self):
        raise AttributeError('Password is not readable')

    # Setter to hash the password before storing it in the database
    @password.setter
    def password(self, new_password):
        self.password_hash = bcrypt.generate_password_hash(new_password).decode('utf-8')

    # Method to authenticate user by checking password hash
    def check_password(self, password):
        return bcrypt.check_password_hash(self.password_hash, password)

    def __repr__(self):
        return f'<User {self.email}>'


# Password Reset Token Model
class PasswordResetToken(db.Model, SerializerMixin):
    __tablename__ = 'password_reset_tokens'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)  # 🔹 Fixed foreign key
    token = db.Column(db.String(128), unique=True, nullable=False)  # 🔹 Increased token length
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Token expires in 15 minutes
    def is_expired(self):
        return datetime.utcnow() > self.created_at + timedelta(minutes=15)

class Event(db.Model, SerializerMixin):
    __tablename__ = 'events'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)  # Linking event to a user
    title = db.Column(db.String(255), nullable=False)
    details = db.Column(db.Text, nullable=True)
    address = db.Column(db.String(255), nullable=True)  # 🏠 Still keep address for user readability
    latitude = db.Column(db.Float, nullable=True)  # 🌍 Add latitude
    longitude = db.Column(db.Float, nullable=True)  # 📍 Add longitude
    start_time = db.Column(db.String(10), nullable=True)
    end_time = db.Column(db.String(10), nullable=True)
    date = db.Column(db.String(10), nullable=False)  # YYYY-MM-DD format
    range_start = db.Column(db.String(10), nullable=True)
    range_end = db.Column(db.String(10), nullable=True)
    photo = db.Column(db.String(500), nullable=True)  # ✅ Add this if needed

    user = db.relationship("User", back_populates="events")  # Explicitly defined here

    # 🔹 Serialization rules to prevent recursive loops
    serialize_rules = ("-user.events", "-user.password_hash")

    def __repr__(self):
        return f"<Event {self.title} @ {self.address} ({self.latitude}, {self.longitude})>"

    
# class Favorite(db.Model, SerializerMixin):
#     __tablename__ = 'favorites'



