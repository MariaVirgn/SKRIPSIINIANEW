from app import app
from database.db import db
from models.user_model import User, UserRoleEnum
import bcrypt

def seed_Admin():
    with app.app_context():
        existing_admin = User.query.filter_by(email="admin@mail.com").first()

        if existing_admin :
            print("Admin already exist")
            return

        hashed_pw = bcrypt.hashpw("admin123".encode('utf-8'), bcrypt.gensalt())
        role = UserRoleEnum.ADMIN
        admin = User(
            name="Admin",
            email="admin@mail.com",
            password= hashed_pw.decode('utf-8'),
            role=role
        ) 

        db.session.add(admin)
        db.session.commit()

        print("Admin successfully created")
    
if __name__ == "__main__":
    seed_Admin()