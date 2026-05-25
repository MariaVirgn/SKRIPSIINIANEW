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
            perfume_id=perfume_id,
            anchor_id=anchor_id
        ).first()
        if not rating_obj:
            print(f"DEBUG: Rating tidak ditemukan untuk user {user_id}, perfume {perfume_id}, anchor {anchor_id}")
        else:
            print(f"DEBUG: Rating ditemukan! ID: {rating_obj.id}, Skor: {rating_obj.rating}")
        return rating_obj.rating if rating_obj else 0

    def get_user_ratings(self, user_id, anchor_id=None):
        """Ambil rating yang diberikan user, difilter berdasarkan anchor_id jika ada."""
        query = Rating.query.filter_by(user_id=user_id)
        if anchor_id:
            query = query.filter_by(anchor_id=anchor_id)
        
        ratings = query.all()
        
        # Buat dictionary: {perfume_id: rating} untuk lookup cepat
        user_ratings_dict = {}
        for r in ratings:
            if r.perfume_id is not None:
                user_ratings_dict[int(r.perfume_id)] = int(r.rating)

        return user_ratings_dict

    def get_system_recommendations(self, user_id, top_n=7):
        """Mencari parfum acuan (anchor) dan menghasilkan rekomendasi."""
        anchor_id = self.get_active_anchor_for_user(user_id)

        if anchor_id:
            features = self.get_features_from_db(anchor_id)
            results = self.recommendation_service.recommend(features, top_n=top_n)
            recommended_ids = [int(item["id"]) for item in results]
            
            # PASTIKAN URUTAN INI SAMA
            relevansi_scores = []
            for p_id in recommended_ids:
                score = self.get_rating_from_db(user_id, p_id, anchor_id)
                relevansi_scores.append(score)
            return recommended_ids, anchor_id

        default_perfumes = Perfume.query.limit(top_n).all()
        return [p.id for p in default_perfumes], None

    def get_active_anchor_for_user(self, user_id):
        """Ambil anchor dari parfum terakhir yang user berikan rating."""
        last_rating = Rating.query.filter_by(user_id=user_id).order_by(Rating.created_at.desc()).first()
        if last_rating and last_rating.anchor_id:
            return last_rating.anchor_id
        
        top_perfume = Rating.query.filter_by(user_id=user_id).filter(Rating.rating >= 4).first()
        return top_perfume.perfume_id if top_perfume else None

    def get_features_from_db(self, anchor_id):
        """Ambil data preferences yang sama persis dengan yang dipakai di halaman User."""
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

    def calculate_metrics_multilevel(self, predicted_ids, user_ratings):
        """
        Menghitung AP (MAP) dan NDCG dengan perbaikan logika relevansi.
        """
        if not predicted_ids or not user_ratings:
            return 0.0, 0.0, []

        predicted_ids = [int(pid) for pid in predicted_ids]
        relevansi_scores = [user_ratings.get(pid, 0) for pid in predicted_ids]

        # NDCG: Hanya gunakan item yang diketahui ratingnya untuk menghindari bias
        known_relevansi = [r for r in relevansi_scores if r > 0]
        if not known_relevansi:
            return 0.0, 0.0, relevansi_scores

        def dcg_at_k(scores):
            # Rumus DCG: sum((2^rel - 1) / log2(i + 2))
            return sum([(2 ** rel - 1) / math.log2(i + 2) for i, rel in enumerate(scores)])

        dcg = dcg_at_k(known_relevansi)
        
        # IDCG: Mengambil rating tertinggi user yang mungkin dicapai
        all_user_ratings = sorted(user_ratings.values(), reverse=True)
        ideal_scores = all_user_ratings[:len(known_relevansi)]
        idcg = dcg_at_k(ideal_scores)
        
        ndcg = dcg / idcg if idcg > 0 else 0.0

        # AP (Average Precision): 
        hits = 0
        sum_precision = 0
        relevant_in_predicted = [r for r in relevansi_scores if r > 0]
        
        for i, score in enumerate(relevant_in_predicted):
            if score >= 3:
                hits += 1
                sum_precision += hits / (i + 1)

        denom = len(relevant_in_predicted) 
        ap = sum_precision / denom if denom > 0 else 0.0

        return round(ap, 4), round(ndcg, 4), relevansi_scores