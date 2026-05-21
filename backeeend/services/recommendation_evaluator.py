import math
from models.wishlist_model import Wishlist
from models.perfume_model import Perfume
# import model rating Anda di sini, contoh:
# from models.rating_model import EvaluationRating 
from services.recommendation_service import RecommendationService


class RecommendationEvaluator:
    def __init__(self):
        self.recommendation_service = RecommendationService()

    def get_user_wishlist(self, user_id):
        wishlist_items = Wishlist.query.filter_by(user_id=user_id).all()
        perfume_ids = [item.perfume_id for item in wishlist_items if item.perfume_id is not None]
        print(f"DEBUG get_user_wishlist: user_id={user_id}, items={len(wishlist_items)}, valid_ids={perfume_ids}")
        return perfume_ids

    def get_user_ratings(self, user_id, anchor_id):
        """
        FUNGSI BARU: Mengambil data rating skala 0-4 yang diinput user 
        berdasarkan sesi rekomendasi (anchor_id) tertentu.
        """
        # Sesuaikan query ini dengan skema database tempat Anda menyimpan rating dropdown dari frontend
        # contoh: ratings = EvaluationRating.query.filter_by(user_id=user_id, anchor_id=anchor_id).all()
        
        # Pseudosimplifikasi return data: { perfume_id: rating_score }
        # contoh output: { 12: 4, 45: 2, 8: 3 }
        user_ratings = {}
        # for r in ratings:
        #     user_ratings[int(r.perfume_id)] = int(r.rating_score)
        
        return user_ratings

    def get_system_recommendations(self, user_id, top_n=7):
        wishlist_items = Wishlist.query.filter_by(user_id=user_id).all()

        if wishlist_items:
            wishlist_ids = [item.perfume_id for item in wishlist_items if item.perfume_id is not None]
            if wishlist_ids:
                anchor_id = None
                for item in wishlist_items:
                    if hasattr(item, 'anchor_id') and item.anchor_id is not None:
                        anchor_id = item.anchor_id
                        break
                
                if not anchor_id:
                    anchor_id = wishlist_ids[0]

                anchor_perfume = Perfume.query.get(anchor_id)
                
                if anchor_perfume:
                    preferences = {
                        "Accord": getattr(anchor_perfume, 'Accord', getattr(anchor_perfume, 'accord', "")),
                        "situation": getattr(anchor_perfume, 'situation', ""),
                        "Occasion": getattr(anchor_perfume, 'Occasion', getattr(anchor_perfume, 'occasion', "")),
                        "gender": getattr(anchor_perfume, 'gender', ""),
                        "size": int(getattr(anchor_perfume, 'size', 0)) if getattr(anchor_perfume, 'size', 0) else 0,
                        "Range": getattr(anchor_perfume, 'Range', getattr(anchor_perfume, 'range', "")),
                        "selected_id": anchor_id
                    }
                    
                    try:
                        results = self.recommendation_service.recommend(preferences, top_n=top_n)
                        recommended_ids = [int(item["id"]) for item in results if item.get("id") is not None]
                        
                        print(f"✅ DEBUG GET_SYSTEM_RECOMMENDATIONS (ADMIN): user_id={user_id}, recommended_ids={recommended_ids[:top_n]}")
                        return recommended_ids[:top_n], anchor_id
                    except Exception as e:
                        print(f"DEBUG get_system_recommendations error: {e}")
                        pass

        default_perfumes = Perfume.query.limit(top_n).all()
        default_ids = [p.id for p in default_perfumes]
        return default_ids, None

    def calculate_metrics_multilevel(self, predicted_ids, user_ratings):
        """
        FUNGSI BARU: Menghitung AP (Biner via Wishlist) & NDCG (Multi-level via Dropdown Rating)
        predicted_ids: list ID parfum hasil rekomendasi sistem (top_n)
        user_ratings: dictionary rating dari user, contoh: { perfume_id: rating_score }
        """
        predicted_ids = [int(pid) for pid in predicted_ids]
        
        # 1. Ambil list nilai relevansi berdasarkan rating user (jika belum dinilai, default = 0)
        relevansi_scores = [user_ratings.get(pid, 0) for pid in predicted_ids]

        if not predicted_ids or not user_ratings:
            return 0.0, 0.0, relevansi_scores

        # ==========================================
        # HITUNG NDCG (Skala Multi-level 0-4)
        # ==========================================
        # Rumus DCG dengan pembobotan Gain yang lebih sensitif: (2^rel - 1) / log2(i + 2)
        dcg = sum([(2**rel - 1) / math.log2(i + 2) for i, rel in enumerate(relevansi_scores)])
        
        # Ambil semua skor rating yang ada, lalu urutkan secara descending untuk IDCG (Ideal Teratas)
        all_scores = list(user_ratings.values())
        all_scores.sort(reverse=True)
        
        # Batasi ideal sesuai jumlah item yang direkomendasikan (Top-N)
        ideal_scores = all_scores[:len(predicted_ids)]
        # Jika jumlah ideal_scores kurang dari predicted_ids, penuhi sisanya dengan skor 0
        if len(ideal_scores) < len(predicted_ids):
            ideal_scores += [0] * (len(predicted_ids) - len(ideal_scores))
            
        idcg = sum([(2**rel - 1) / math.log2(i + 2) for i, rel in enumerate(ideal_scores)])
        
        ndcg = dcg / idcg if idcg > 0 else 0.0

        # ==========================================
        # HITUNG AP (Sederhana biner: Terhitung hit jika score >= 3 [Sesuai/Sangat Sesuai])
        # ==========================================
        hits = 0
        sum_precision = 0
        
        # Cari tahu berapa banyak item di data user yang dianggap "relevan" (misal minimal skornya 3)
        total_relevan_user = sum(1 for score in user_ratings.values() if score >= 3)
        denom_ap = min(total_relevan_user, len(predicted_ids))

        for i, score in enumerate(relevansi_scores):
            if score >= 3:  # Threshold relevansi biner untuk AP
                hits += 1
                sum_precision += hits / (i + 1)
                
        ap = sum_precision / denom_ap if denom_ap > 0 else 0.0

        return round(ap, 3), round(ndcg, 3), relevansi_scores