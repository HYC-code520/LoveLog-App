import os
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import MetaData
from flask_bcrypt import Bcrypt
from dotenv import load_dotenv
from flask_jwt_extended import JWTManager

# Load environment variables from .env file
load_dotenv()

# APP CONFIGURATION
app = Flask(__name__)

# SECURITY SETTINGS (IMPORTANT: Keep this secret & use .env)
app.config['SECRET_KEY'] = os.environ.get('FLASK_SECRET', 'your_default_secret_key')

# JWT CONFIGURATION
app.config['JWT_SECRET_KEY'] = os.environ.get('JWT_SECRET', 'your_jwt_secret_key')  # Secret for JWT tokens
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = 3600  # Token expires in 1 hour (adjust as needed)
app.config['JWT_REFRESH_TOKEN_EXPIRES'] = 86400  # Refresh token expires in 1 day

# Initialize JWT Manager
jwt = JWTManager(app)

# DATABASE CONFIGURATION
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///app.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.json.compact = False

CORS(app)

# DATABASE & MIGRATIONS
metadata = MetaData(naming_convention={
    "fk": "fk_%(table_name)s_%(column_0_name)s_%(referred_table_name)s",
})

db = SQLAlchemy(metadata=metadata)
migrate = Migrate(app, db)
db.init_app(app)

# BCRYPT (for hashing passwords)
bcrypt = Bcrypt(app)
