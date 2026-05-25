import os
import sqlite3

# 1. OTOMATISASI PENCARIAN PATH DATABASE (Agar tidak salah file .db)
BASE_DIR = os.path.abspath(os.path.dirname(__file__))

# Opsi jalur yang mungkin digunakan oleh Flask Anda
paths_to_check = [
    os.path.join(BASE_DIR, "instance", "mydatabase.db"),
    os.path.join(BASE_DIR, "..", "instance", "mydatabase.db"),
    os.path.join(BASE_DIR, "mydatabase.db")
]

DB_PATH = None
for path in paths_to_check:
    if os.path.exists(path):
        DB_PATH = path
        break

if not DB_PATH:
    print("❌ ERROR: File 'mydatabase.db' tidak ditemukan di folder instance manapun!")
    print("Silakan cek di mana file database Anda berada.")
    exit(1)

print(f"🔄 Menghubungkan ke database aktif di: {DB_PATH}")

# 2. PROSES ALTER TABLE (MENAMBAH KOLOM)
conn = sqlite3.connect(DB_PATH)
cursor = conn.cursor()

try:
    # Ambil nama tabel wishlist yang sebenarnya (case-insensitive)
    cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND lower(name) LIKE 'wishlist' LIMIT 1")
    row = cursor.fetchone()
    
    if not row:
        print("❌ ERROR: Tabel 'wishlist' tidak ditemukan di dalam database ini.")
        exit(1)
        
    wishlist_table = row[0]
    
    # Cek daftar kolom yang ada saat ini
    cursor.execute(f"PRAGMA table_info({wishlist_table})")
    columns = [col[1] for col in cursor.fetchall()]
    
    # Eksekusi penambahan kolom jika belum ada
    if "rating" not in columns:
        print(f"⚡ Menambahkan kolom 'rating' ke tabel '{wishlist_table}'...")
        
        # Menggunakan DEFAULT 0 untuk menandakan 'Belum Dinilai'
        cursor.execute(f"ALTER TABLE {wishlist_table} ADD COLUMN rating INTEGER DEFAULT 0")
        conn.commit()
        
        print("🎉 BERHASIL! Kolom 'rating' kini telah ditambahkan ke database fisik.")

    # Tambahkan pengecekan untuk 'perfume_name'
    if "perfume_name" not in columns:
        print(f"⚡ Menambahkan kolom 'perfume_name' ke tabel '{wishlist_table}'...")
        cursor.execute(f"ALTER TABLE {wishlist_table} ADD COLUMN perfume_name TEXT")
        conn.commit()
        print("🎉 BERHASIL! Kolom 'perfume_name' ditambahkan.")
    else:
        print("ℹ️ Kolom 'rating' sudah ada sebelumnya di database Anda.")

except Exception as e:
    print(f"❌ Terjadi kesalahan saat memproses database: {e}")
finally:
    conn.close()
    print("🔌 Koneksi database ditutup. Selesai.")