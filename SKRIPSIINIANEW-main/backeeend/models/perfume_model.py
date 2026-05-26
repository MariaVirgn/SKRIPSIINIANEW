from database.db import db

class Perfume(db.Model):
    __tablename__ = "perfumes"

    id = db.Column(db.Integer, primary_key=True)
    perfume = db.Column(db.Text)
    brand = db.Column(db.Text)
    price = db.Column(db.Integer)
    size = db.Column(db.Float)
    concentrate = db.Column(db.Text)
    top_notes = db.Column(db.Text)
    mid_notes = db.Column(db.Text)
    base_notes = db.Column(db.Text)
    Accord = db.Column(db.Text)
    Occasion = db.Column(db.Text)
    Mood = db.Column(db.Text)
    situation = db.Column(db.Text)
    gender = db.Column(db.Text)
    Range = db.Column(db.Text)
    combined_text = db.Column(db.Text)
    image_file = db.Column(db.Text, nullable=True)

    def to_dict(self):
        return {
            "id": self.id,
            "perfume": self.perfume,
            "brand": self.brand,
            "price": self.price,
            "size": self.size,
            "concentrate" : self.concentrate,
            "top_notes" : self.top_notes,
            "mid_notes" : self.mid_notes,
            "base_notes" : self.base_notes,
            "Accord": self.Accord,
            "Occasion" : self.Occasion,
            "Mood" : self.Mood,
            "situation": self.situation,
            "gender" : self.gender,
            "Range": self.Range,
            "combined_text" : self.combined_text,
            "image_file": self.image_file
        }