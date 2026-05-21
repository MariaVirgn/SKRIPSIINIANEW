import os
import re
import sys

# Pastikan folder backeeend berada di path agar import app berhasil
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.append(BASE_DIR)

from app import app, db
from sqlalchemy import text


def sanitize_price(raw_price):
    if raw_price is None:
        return None
    if isinstance(raw_price, (int, float)):
        return int(raw_price)

    raw_text = str(raw_price).strip()
    if raw_text == "":
        return None

    raw_text = raw_text.replace("Rp", "").replace("rp", "").strip()
    if "," in raw_text:
        raw_text = raw_text.split(",", 1)[0]
    raw_text = raw_text.replace(".", "").strip()

    digits = re.sub(r"[^\d]", "", raw_text)
    return int(digits) if digits else None


def migrate_price_column():
    with app.app_context():
        engine = db.engine
        conn = engine.connect()
        trans = conn.begin()
        try:
            result = conn.execute(text("SELECT name FROM sqlite_master WHERE type='table' AND name='perfumes'"))
            if result.fetchone() is None:
                raise RuntimeError("Tabel 'perfumes' tidak ditemukan di database.")

            print("Men-sanitize nilai price di tabel perfumes...")
            rows = conn.execute(text("SELECT id, price FROM perfumes")).mappings().all()
            for row in rows:
                sanitized = sanitize_price(row["price"])
                if sanitized is not None:
                    conn.execute(
                        text("UPDATE perfumes SET price = :price WHERE id = :id"),
                        {"price": sanitized, "id": row["id"]}
                    )

            print("Membuat ulang tabel perfumes dengan kolom price bertipe INTEGER...")
            conn.execute(text("PRAGMA foreign_keys=off"))
            conn.execute(text("ALTER TABLE perfumes RENAME TO perfumes_old"))
            conn.execute(text(
                """
                CREATE TABLE perfumes (
                    id INTEGER PRIMARY KEY,
                    perfume TEXT,
                    brand TEXT,
                    price INTEGER,
                    size FLOAT,
                    concentrate TEXT,
                    top_notes TEXT,
                    mid_notes TEXT,
                    base_notes TEXT,
                    Accord TEXT,
                    Occasion TEXT,
                    Mood TEXT,
                    situation TEXT,
                    gender TEXT,
                    Range TEXT,
                    combined_text TEXT,
                    image_file TEXT
                )
                """
            ))
            conn.execute(text(
                """
                INSERT INTO perfumes (id, perfume, brand, price, size, concentrate, top_notes, mid_notes, base_notes,
                                     Accord, Occasion, Mood, situation, gender, Range, combined_text, image_file)
                SELECT id, perfume, brand, CAST(price AS INTEGER), size, concentrate, top_notes, mid_notes, base_notes,
                       Accord, Occasion, Mood, situation, gender, Range, combined_text, image_file
                FROM perfumes_old
                """
            ))
            conn.execute(text("DROP TABLE perfumes_old"))
            conn.execute(text("PRAGMA foreign_keys=on"))
            trans.commit()
            print("Migrasi kolom price selesai. Semua harga sekarang bertipe INTEGER.")
        except Exception:
            trans.rollback()
            raise
        finally:
            conn.close()


if __name__ == "__main__":
    migrate_price_column()
