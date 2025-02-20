from config import db, bcrypt
from sqlalchemy_serializer import SerializerMixin

# User model for authentication
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(120), nullable=False)  # (For now, storing plaintext passwords)

    def __repr__(self):
        return f'<User {self.email}>'

