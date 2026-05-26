from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from database.db import db
from flask_migrate import Migrate

app = Flask(__name__)
CORS(app, origins=[
    "http://localhost:5173"
])

# Konfigurasi Tunggal
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///mydatabase.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.config["JWT_SECRET_KEY"] = "secret-key"

db.init_app(app)

jwt = JWTManager(app)

migrate = Migrate(app, db)

# Import Blueprint
from controllers.auth_controller import auth_bp
from controllers.api import api_bp # Import Blueprint yang baru kita buat
from controllers.wishlist_controller import wishlist_bp
from controllers.admin_controller import admin_bp

# Registrasi Blueprint
app.register_blueprint(auth_bp, url_prefix="/auth")
app.register_blueprint(admin_bp, url_prefix="/api/admin")
app.register_blueprint(api_bp, url_prefix="/api") # Sekarang rutenya jadi /api/recommend, dll.
app.register_blueprint(wishlist_bp, url_prefix="/api") # Rutenya jadi /api/wishlist, dll.

@app.route("/")
def home():
    return "Backend Jalan (Satu Server)"

with app.app_context():
    db.create_all()

if __name__ == "__main__":
    app.run(debug=True, port=5000)