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

        # ==================================================
        # ORDINAL ENCODING RANGE
        # ==================================================
        self.range_mapping = {
            "Basic": 0,
            "Classic": 1,
            "Premium": 2,
            "Luxury": 3,
            "Elite": 4
            }

        self.df["Range_Ordinal"] = (
            self.df["Range"]
            .astype(str)
            .str.lower()
            .map(self.range_mapping)
            .fillna(0)
        )

        # ==================================================
        # TF-IDF
        # ==================================================
        self.tfidf = TfidfVectorizer(stop_words='english')

        self.tfidf_matrix = self.tfidf.fit_transform(
            self.df['combined_text']
        )

        # ==================================================
        # ONE HOT ENCODER
        # Range dihapus dari sini
        # ==================================================
        self.onehot_cols = [
            'Occasion',
            'situation',
            'gender'
        ]

        self.onehot = OneHotEncoder(
            sparse_output=False,
            handle_unknown='ignore'
        )

        self.onehot_matrix = self.onehot.fit_transform(
            self.df[self.onehot_cols]
        )

        # ==================================================
        # NUMERIC + ORDINAL
        # ==================================================
        self.num_cols = [
            'size',
            'Range_Ordinal'
        ]

        self.scaler = MinMaxScaler()

        self.num_matrix = self.scaler.fit_transform(
            self.df[self.num_cols]
        )

        # ==================================================
        # FINAL MATRIX
        # ==================================================
        self.final_matrix = hstack([
            self.tfidf_matrix,
            self.onehot_matrix,
            self.num_matrix
        ])

        self.is_initialize = True

    def load_from_db(self):
        """
        Fungsi ini memuat data dari database ke dalam DataFrame 
        dan berada di dalam kelas RecommendationService.
        """
        perfumes = Perfume.query.all()
        data = []
        for p in perfumes:
            data.append({
                "id": p.id,
                "perfume": p.perfume,
                "Range": p.Range,
                "price": p.price,
                "Accord": p.Accord,
                "situation": p.situation,
                "Occasion": p.Occasion,
                "gender": p.gender,
                "size": p.size,
                "combined_text": f"{p.Accord} {p.situation} {p.Occasion}"
            })
        
        df = pd.DataFrame(data)
        # Menjadikan ID database sebagai index agar ID tidak tertukar dengan index urutan
        df = df.set_index('id', drop=False)
        
        print("DEBUG: 5 Baris Pertama DataFrame (ID harus sesuai DB):")
        print(df.head())
        
        return df

    def recommend(self, preferences, top_n=7):
    
        if not self.is_initialize:
            self.init_model()

        # ==================================================
        # LOGIKA PERBAIKAN: HARD FILTERING BERDASARKAN RANGE
        # ==================================================
        user_range_raw = preferences.get('Range', '')
        
        # Ambil kata pertama untuk mencocokkan format database (misal "Basic (41.500..." -> "Basic")
        user_range_clean = str(user_range_raw).split()[0].strip().title() if user_range_raw else ""

        # Lakukan filter database hanya pada parfum yang memiliki Range yang sama
        if user_range_clean in self.range_mapping:
            # Saring baris dataframe yang kolom 'Range'-nya mengandung kata preferensi user
            filtered_df = self.df[self.df['Range'].str.title().str.contains(user_range_clean, na=False)].copy()
            
            # Jika hasil filter tidak kosong, gunakan data yang sudah disaring
            if not filtered_df.empty:
                indices_to_use = filtered_df.index
                matrix_to_use = self.final_matrix.tocsr()[indices_to_use] if hasattr(self.final_matrix, 'tocsr') else self.final_matrix[indices_to_use]
            else:
                filtered_df = self.df.copy()
                matrix_to_use = self.final_matrix
        else:
            filtered_df = self.df.copy()
            matrix_to_use = self.final_matrix

        # ==================================================
        # TF-IDF INPUT
        # ==================================================
        text_input = preferences.get('Accord', '').lower().strip()
        text_vec = self.tfidf.transform([text_input])

        # ==================================================
        # ONE HOT INPUT
        # ==================================================
        onehot_input = pd.DataFrame([{
            'Occasion': preferences.get('Occasion', ''),
            'situation': preferences.get('situation', ''),
            'gender': preferences.get('gender', '')
        }])
        onehot_vec = self.onehot.transform(onehot_input)

        # ==================================================
        # ORDINAL RANGE INPUT
        # ==================================================
        range_value = str(preferences.get('Range', '')).split()[0].strip().title() if preferences.get('Range') else ""
        range_ordinal = self.range_mapping.get(range_value, 0)

        # ==================================================
        # NUMERIC INPUT
        # ==================================================
        # Perbaikan agar tidak ada UserWarning dengan menyertakan nama kolom
        num_input_data = pd.DataFrame(
            [[preferences.get('size', 0), range_ordinal]], 
            columns=self.num_cols
        )
        num_vec = self.scaler.transform(num_input_data)

        # ==================================================
        # USER VECTOR
        # ==================================================
        user_vector = hstack([
            text_vec,
            onehot_vec,
            num_vec
        ])

        # ==================================================
        # COSINE SIMILARITY (Gunakan matrix_to_use hasil filter)
        # ==================================================
        similarity = cosine_similarity(
            user_vector,
            matrix_to_use
        ).flatten()

        # ==================================================
        # FILTER ANCHOR ITEM
        # ==================================================
        anchor_id = preferences.get('selected_id')
        if anchor_id is not None:
            exclude_indices = filtered_df[
                filtered_df['id'] == int(anchor_id)
            ].index
            
            # Cari posisi indeks lokal di dalam filtered_df
            local_indices = [filtered_df.index.get_loc(idx) for idx in exclude_indices if idx in filtered_df.index]
            for loc_idx in local_indices:
                similarity[loc_idx] = -1.0

        # ==================================================
        # SORT TOP N (Gunakan filtered_df)
        # ==================================================
        top_indices = similarity.argsort()[::-1][:top_n]

        # Karena ID sudah jadi index, gunakan .iloc untuk mengambil baris berdasarkan urutan,
        # lalu ambil index-nya (yang merupakan ID asli database)
        results_df = filtered_df.iloc[top_indices].copy()
        results_df = results_df.reset_index(drop=True) # Mengembalikan 'id' menjadi kolom biasa
        results_df['similarity'] = (similarity[top_indices] * 100).round(2)
        
        print("\n===== RECOMMENDATION RESULTS =====")
        print(results_df[['id', 'perfume', 'Range', 'price', 'similarity']])

        return results_df.to_dict(orient='records')