from database.db import db
from datetime import datetime

class Rating(db.Model):
    __tablename__ = 'rating'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, nullable=False)
    perfume_id = db.Column(db.Integer, db.ForeignKey('perfumes.id'), nullable=False)
    perfume_name = db.Column(db.String(255), nullable=True)
    anchor_id = db.Column(db.Integer, nullable=True)
    rating = db.Column(db.Integer, default=0) # Skor 1-5
    
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Relasi ke tabel Perfume
    perfume_obj = db.relationship('Perfume', backref='ratings', lazy='joined')

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "perfume_id": self.perfume_id,
            "perfume_name": self.perfume_obj.perfume if self.perfume_obj else "Unknown",
            "anchor_id": self.anchor_id,
            "rating": self.rating,
            "created_at": self.created_at
        }