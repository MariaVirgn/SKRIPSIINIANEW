import pandas as pd

def preprocess_data(df):
    df = df.copy()

    # 1. Normalisasi Nama Kolom
    df.columns = df.columns.str.strip()

    # 2. Preprocessing Accord (Satu-satunya fitur teks utama)
    df['Accord'] = df['Accord'].fillna('').astype(str).str.strip().str.lower()
    df['Accord'] = df['Accord'].str.replace('.', '', regex=False).str.replace(',', ' ', regex=False)

    # 3. Preprocessing Kategorikal
    cat_cols = ['Occasion', 'situation', 'gender', 'concentrate','Range']
    for col in cat_cols:
        df[col] = df[col].fillna('unknown').astype(str).str.lower().str.strip()

    # 4. Preprocessing Numerik & Harga
    # Size masuk ke similarity, Price TIDAK masuk ke similarity
    df['size'] = pd.to_numeric(df['size'], errors='coerce').fillna(df['size'].median())
    df['price'] = pd.to_numeric(df['price'], errors='coerce').fillna(0)

    # 5. Membuat Fitur Teks Gabungan untuk TF-IDF
    df['combined_text'] = (
        df['Accord'] + ' ' + 
        df['Occasion'] + ' ' + 
        df['situation'] + ' ' + 
        df['gender'] + ' ' + 
        df['concentrate'] + ' ' + 
        df['Range']
    ).str.lower()

    return df