import os
import sqlite3

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "instance"))
DB_PATH = os.path.join(BASE_DIR, "mydatabase.db")

if not os.path.exists(DB_PATH):
    raise FileNotFoundError(f"Database file not found: {DB_PATH}")

conn = sqlite3.connect(DB_PATH)
conn.row_factory = sqlite3.Row
cursor = conn.cursor()

# Locate the wishlist table name in the current database.
cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND lower(name) LIKE 'wishlist' LIMIT 1")
row = cursor.fetchone()
if not row:
    raise RuntimeError("Wishlist table not found in database.")

wishlist_table = row["name"]

# Check if perfume_id already exists.
cursor.execute(f"PRAGMA table_info({wishlist_table})")
columns = [col[1] for col in cursor.fetchall()]
if "perfume_id" not in columns:
    print(f"Adding perfume_id column to {wishlist_table}...")
    cursor.execute(f"ALTER TABLE {wishlist_table} ADD COLUMN perfume_id INTEGER")
    conn.commit()
else:
    print("perfume_id column already exists.")

# Map existing wishlist rows by perfume name.
print("Mapping existing wishlist rows to perfume IDs...")
cursor.execute(f"SELECT id, perfume FROM {wishlist_table} WHERE perfume IS NOT NULL AND perfume <> ''")
rows = cursor.fetchall()
updated = 0
unmapped = []
for row in rows:
    wishlist_id = row["id"]
    perfume_name = row["perfume"]
    cursor.execute(
        "SELECT id FROM perfumes WHERE lower(perfume) = lower(?) LIMIT 1",
        (perfume_name,)
    )
    match = cursor.fetchone()
    if match:
        cursor.execute(
            f"UPDATE {wishlist_table} SET perfume_id = ? WHERE id = ?",
            (match["id"], wishlist_id)
        )
        updated += 1
    else:
        unmapped.append((wishlist_id, perfume_name))

conn.commit()
print(f"Mapped {updated} wishlist rows to perfume_id.")
if unmapped:
    print(f"{len(unmapped)} wishlist rows could not be mapped. Example names:")
    for wishlist_id, perfume_name in unmapped[:10]:
        print(f"  id={wishlist_id}, perfume='{perfume_name}'")

conn.close()
print("Migration completed.")
