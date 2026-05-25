import math
from models.rating_model import Rating
from models.perfume_model import Perfume
from services.recommendation_service import RecommendationService

class RecommendationEvaluator:
    def __init__(self):
        self.recommendation_service = RecommendationService()

    def get_rating_from_db(self, user_id, perfume_id, anchor_id):
        rating_obj = Rating.query.filter_by(
            user_id=user_id,
            perfume_id=int(perfume_id),
            anchor_id=int(anchor_id)
        ).first()
        return rating_obj.rating if rating_obj else 0

    def get_user_ratings(self, user_id, anchor_id=None):
        query = Rating.query.filter_by(user_id=user_id)
        if anchor_id:
            query = query.filter_by(anchor_id=anchor_id)
        
        ratings = query.all()
        user_ratings_dict = {}
        for r in ratings:
            if r.perfume_id is not None:
                user_ratings_dict[int(r.perfume_id)] = int(r.rating)
        return user_ratings_dict

    def get_system_recommendations(self, user_id, top_n=7):
        anchor_id = self.get_active_anchor_for_user(user_id)

        if anchor_id:
            features = self.get_features_from_db(anchor_id)
            results = self.recommendation_service.recommend(features, top_n=top_n)
            recommended_ids = [int(item["id"]) for item in results]
            
            relevansi_scores = []
            for p_id in recommended_ids:
                score = self.get_rating_from_db(user_id, p_id, anchor_id)
                relevansi_scores.append(score)
            
            return recommended_ids, anchor_id, relevansi_scores

        default_perfumes = Perfume.query.limit(top_n).all()
        return [p.id for p in default_perfumes], None, [0] * top_n

    def get_active_anchor_for_user(self, user_id):
        last_rating = Rating.query.filter_by(user_id=user_id).order_by(Rating.created_at.desc()).first()
        if last_rating and last_rating.anchor_id:
            return last_rating.anchor_id
        
        top_perfume = Rating.query.filter_by(user_id=user_id).filter(Rating.rating >= 4).first()
        return top_perfume.perfume_id if top_perfume else None

    def get_features_from_db(self, anchor_id):
        p = Perfume.query.get(anchor_id)
        if not p:
            return {}
        return {
            "Accord": p.Accord,
            "situation": p.situation,
            "Occasion": p.Occasion,
            "gender": p.gender,
            "Range": p.Range,
            "size": p.size,
            "selected_id": p.id
        }

    def calculate_metrics_multilevel(self, relevansi_scores):
        """
        Menghitung NDCG (Linear) dan AP (Average Precision).
        """
        if not relevansi_scores or all(r == 0 for r in relevansi_scores):
            return 0.0, 0.0

        # DCG menggunakan rumus linear: rel / log2(i + 2)
        def dcg_at_k(scores):
            # Penyesuaian: i + 2 karena index dimulai dari 0
            return sum([rel / math.log2(i + 2) for i, rel in enumerate(scores)])

        # 1. DCG dari hasil sistem
        dcg = dcg_at_k(relevansi_scores)
        
        # 2. IDCG (Ideal): Menggunakan semua skor yang ada, diurutkan dari tertinggi ke terendah
        # Menggunakan list penuh agar panjang IDCG sama dengan DCG (adil)
        ideal_scores = sorted(relevansi_scores, reverse=True)
        idcg = dcg_at_k(ideal_scores)
        
        # 3. NDCG: Normalisasi
        ndcg = dcg / idcg if idcg > 0 else 0.0

        # 4. AP (Average Precision): 
        # Hit jika skor >= 3 (Sesuai skala 1-5)
        relevant_indices = [i for i, r in enumerate(relevansi_scores) if r >= 3]
        
        if not relevant_indices:
            return round(0.0, 3), round(ndcg, 3)

        sum_precision = 0
        for i, idx in enumerate(relevant_indices):
            sum_precision += (i + 1) / (idx + 1)
        
        ap = sum_precision / len(relevant_indices)

        return round(ap, 3), round(ndcg, 3)