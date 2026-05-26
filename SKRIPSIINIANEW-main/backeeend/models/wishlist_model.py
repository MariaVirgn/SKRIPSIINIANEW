from database.db import db
from datetime import datetime

class Wishlist(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, nullable=False)
    perfume_id = db.Column(db.Integer, db.ForeignKey("perfumes.id"), nullable=True)
    
    # Kolom baru halaman asal
    anchor_id = db.Column(db.Integer, db.ForeignKey("perfumes.id"), nullable=True)

    perfume = db.Column(db.String(200))
    brand = db.Column(db.String(200))
    price = db.Column(db.String(200))
    range = db.Column(db.String(200))
    size = db.Column(db.String(200))
    accord = db.Column(db.String(200))
    situation = db.Column(db.String(200))
    occasion = db.Column(db.String(200))

    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # 👇 PERBAIKAN UTAMA: Menambahkan parameter foreign_keys agar SQLAlchemy tidak bingung 👇
    perfume_detail = db.relationship('Perfume', foreign_keys=[perfume_id], backref='wishlisted_by')
    anchor_detail = db.relationship('Perfume', foreign_keys=[anchor_id], backref='anchored_wishlists')

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "perfume_id": self.perfume_id,
            "anchor_id": self.anchor_id,
            "perfume": self.perfume,
            "brand": self.brand,
            "price": self.price,
            "range": self.range,
            "size": self.size,
            "accord": self.accord,
            "situation": self.situation,
            "occasion": self.occasion,
            "created_at": self.created_at,
            "top_notes": self.perfume_detail.top_notes if self.perfume_detail else None,
            "mid_notes": self.perfume_detail.mid_notes if self.perfume_detail else None,
            "base_notes": self.perfume_detail.base_notes if self.perfume_detail else None,
        }