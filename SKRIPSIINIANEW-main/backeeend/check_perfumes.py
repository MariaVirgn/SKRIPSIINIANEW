from models.perfume_model import Perfume
from database.db import db
from app import app

with app.app_context():
    count = Perfume.query.count()
    print(f'Total perfumes: {count}')
    if count > 0:
        sample = Perfume.query.first()
        print(f'Sample perfume: {sample.to_dict()}')
    else:
        print('No perfumes found')