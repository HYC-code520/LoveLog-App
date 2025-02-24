from config import db, bcrypt
from sqlalchemy_serializer import SerializerMixin

# User model for authentication
class User(db.Model, SerializerMixin):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(120), nullable=False) 

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

