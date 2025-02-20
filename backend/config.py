from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_cors import CORS
from flask_migrate import Migrate
from flask_restful import Api

app = Flask(__name__)

# Secret key for JWT (Keep it secret!)
app.config['SECRET_KEY'] = 'supersecretkey'  # Change in production

# Configuration settings
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///app.db'  # Change to PostgreSQL in production
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False


# Initialize extensions
db = SQLAlchemy(app)
CORS(app)  # Allow frontend to talk to backend
migrate = Migrate(app, db)
api = Api(app) 
bcrypt = Bcrypt(app)