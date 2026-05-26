from models.wishlist_model import Wishlist
from models.user_model import User
from database.db import db
from app import app

with app.app_context():
    users = User.query.all()
    for user in users:
        wishlists = Wishlist.query.filter_by(user_id=user.id).all()
        if wishlists:
            print(f'User {user.id} ({user.name}): {len(wishlists)} wishlists')
            for w in wishlists[:3]:  # Show first 3
                print(f'  - perfume_id: {w.perfume_id}, perfume: {w.perfume}')
        else:
            print(f'User {user.id} ({user.name}): No wishlists')