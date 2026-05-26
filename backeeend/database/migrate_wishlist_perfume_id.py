import sqlite3
import os

# 1. OTOMATISASI PENCARIAN PATH DATABASE
BASE_DIR = os.path.abspath(os.path.dirname(__file__))
paths_to_check = [
    os.path.join(BASE_DIR, "instance", "mydatabase.db"),
    os.path.join(BASE_DIR, "..", "instance", "mydatabase.db"),
    os.path.join(BASE_DIR, "mydatabase.db")
]

DB_PATH = next((p for p in paths_to_check if os.path.exists(p)), None)

if not DB_PATH:
    print("❌ ERROR: File 'mydatabase.db' tidak ditemukan!")
    exit(1)

print(f"🔄 Menghubungkan ke: {DB_PATH}")
conn = sqlite3.connect(DB_PATH)
cursor = conn.cursor()

# --- MIGRASI WISHLIST ---
cursor.execute("PRAGMA table_info(wishlist)")
columns = [col[1] for col in cursor.fetchall()]
if "perfume_id" not in columns:
    cursor.execute("ALTER TABLE wishlist ADD COLUMN perfume_id INTEGER")

cursor.execute("SELECT id, perfume FROM wishlist WHERE perfume_id IS NULL AND perfume IS NOT NULL")
for row in cursor.fetchall():
    match = cursor.execute("SELECT id FROM perfumes WHERE lower(perfume) = lower(?)", (row[1],)).fetchone()
    if match:
        cursor.execute("UPDATE wishlist SET perfume_id = ? WHERE id = ?", (match[0], row[0]))

# --- MIGRASI RATING (TAMBAH KOLOM & ISI NAMA) ---
# 1. Buat tabel jika belum ada
cursor.execute('''
    CREATE TABLE IF NOT EXISTS rating (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        perfume_id INTEGER NOT NULL,
        anchor_id INTEGER,
        perfume_name TEXT,
        rating INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
''')

# 2. Tambah kolom perfume_name jika belum ada
cursor.execute("PRAGMA table_info(rating)")
rating_columns = [col[1] for col in cursor.fetchall()]
if "perfume_name" not in rating_columns:
    cursor.execute("ALTER TABLE rating ADD COLUMN perfume_name TEXT")
    print("Kolom 'perfume_name' ditambahkan ke tabel 'rating'.")

# 3. LANGSUNG ISI DATA (Update NULL dengan nama parfum yang benar)
print("⚡ Sinkronisasi nama parfum ke tabel 'rating'...")
cursor.execute('''
    UPDATE rating 
    SET perfume_name = (SELECT perfume FROM perfumes WHERE perfumes.id = rating.perfume_id)
    WHERE perfume_name IS NULL OR perfume_name = ''
''')

conn.commit()
conn.close()
print("🎉 Migrasi Selesai! Tabel 'rating' sudah terupdate dengan nama parfum.")