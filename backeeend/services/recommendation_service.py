import pandas as pd
import numpy as np

from models.perfume_model import Perfume

from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.preprocessing import OneHotEncoder, MinMaxScaler
from sklearn.metrics.pairwise import cosine_similarity
from scipy.sparse import hstack

from services.preprocess import preprocess_data

class RecommendationService:

    def __init__(self):
        self.is_initialize = False

    def init_model(self):
        self.df = self.load_from_db()

        if self.df.empty:
            raise ValueError("No perfume data available for recommendations")

        # 1. TF-IDF (Hanya memproses teks Accord)
        self.tfidf = TfidfVectorizer(stop_words='english')
        self.tfidf_matrix = self.tfidf.fit_transform(self.df['combined_text'])

        # 2. OneHot Encoder (Kategorikal: Occasion, situation, gender, Range)
        self.onehot_cols = ['Occasion', 'situation', 'gender', 'Range']
        self.onehot = OneHotEncoder(sparse_output=False, handle_unknown='ignore')
        self.onehot_matrix = self.onehot.fit_transform(self.df[self.onehot_cols])

        # 3. Numeric Scaler (Numerik: size)
        self.num_cols = ['size']
        self.scaler = MinMaxScaler()
        self.num_matrix = self.scaler.fit_transform(self.df[self.num_cols])

        # Gabungkan semua matriks fitur (Hapus ordinal_matrix)
        self.final_matrix = hstack([
            self.tfidf_matrix,
            self.onehot_matrix,
            self.num_matrix
        ])
        self.is_initialize = True

    def load_from_db(self):
        perfumes = Perfume.query.all()
        data = [perfume.to_dict() for perfume in perfumes]
        return pd.DataFrame(data)

    def recommend(self, preferences, top_n=7):
        if not self.is_initialize: 
            self.init_model()

        # Input Teks: Hanya Accord (Mood dihapus)
        text_input = preferences.get('Accord', '').lower().strip()
        text_vec = self.tfidf.transform([text_input])

        # Input Kategorikal: Sesuai atribut yang diminta
        onehot_input = pd.DataFrame([{
            'Occasion': preferences.get('Occasion', ''),
            'situation': preferences.get('situation', ''),
            'gender': preferences.get('gender', ''),
            'Range': preferences.get('Range', '')
        }])
        onehot_vec = self.onehot.transform(onehot_input)

        # Input Numerik: size
        num_input = np.array([[preferences.get('size', 0)]])
        num_vec = self.scaler.transform(num_input)

        # Gabungkan vektor user (Tanpa ordinal_vec)
        user_vector = hstack([
            text_vec,
            onehot_vec,
            num_vec
        ])

        # Hitung Similarity
        similarity = cosine_similarity(user_vector, self.final_matrix).flatten()
        
        # ====================================================================
        # MODIFIKASI LOGIKA: PENYARINGAN ANCHOR ITEM (PREFERENSI ASAL)
        # ====================================================================
        anchor_id = preferences.get('selected_id')
        
        if anchor_id is not None:
            # Cari index baris data yang memiliki id == anchor_id
            exclude_indices = self.df[self.df['id'] == int(anchor_id)].index
            if not exclude_indices.empty:
                # Berikan nilai kemiripan paling rendah (-1.0) khusus untuk parfum asal ini
                similarity[exclude_indices] = -1.0
        # ====================================================================

        # Urutkan index dari similarity terbesar ke terkecil
        top_indices = similarity.argsort()[::-1][:top_n]

        results = self.df.iloc[top_indices].copy()
        results['similarity'] = (similarity[top_indices] * 100).round(2)
        
        print("\n===== RECOMMENDATION RESULTS =====")
        print(results[['id', 'perfume', 'similarity']])

        return results.to_dict(orient='records')
    
    def get_unique_values(self):
        if not self.is_initialize: 
            self.init_model()
            
        def split_unique(series):
            values = set()
            for item in series.dropna():
                parts = str(item).split()
                for p in parts:
                    if p.strip():
                        values.add(p.strip().lower())
            return sorted(values)

        return {
            "Accord": [{"label": v.title(), "value": v} for v in split_unique(self.df["Accord"])],
            "situation": [{"label": v.title(), "value": v} for v in self.df["situation"].unique()],
            "Occasion": [{"label": v.title(), "value": v} for v in self.df["Occasion"].unique()],
            "Range": [{"label": v.title(), "value": v} for v in self.df["Range"].unique()],
            "size": [{"label": str(v), "value": v} for v in sorted(self.df["size"].unique())],
            "gender": [{"label": v.title(), "value": v} for v in self.df["gender"].unique()]
        }

def safe_value(val, default='unknown'):
    if val is None or val == '':
        return default
    return val