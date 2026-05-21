from flask import Blueprint, request, jsonify, send_from_directory
from flask_jwt_extended import jwt_required, get_jwt_identity
from models.user_model import User
from models.wishlist_model import Wishlist
from models.perfume_model import Perfume
from services.recommendation_service import RecommendationService
from sqlalchemy import func

# Inisialisasi Blueprint
api_bp = Blueprint('/api', __name__)

# Inisialisasi service
service = RecommendationService()

@api_bp.route("/recommend", methods=["POST"])
@jwt_required()
def recommend():
    data = request.get_json()
    result = service.recommend(data)
    return jsonify(result)

@api_bp.route("/profile", methods=["GET"])
@jwt_required()
def profile():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if not user:
        return jsonify({"msg": "User not found"}), 404
    return jsonify(user.to_dict())

@api_bp.route("/dropdowns", methods=["GET"])
def dropdowns():
    return jsonify(service.get_unique_values())

@api_bp.route("/wishlist", methods=["GET"])
@jwt_required()
def get_wishlist():
    user_id = get_jwt_identity()
    items = Wishlist.query.filter_by(user_id=user_id).all()
    return jsonify([i.to_dict() for i in items])

@api_bp.route("/perfume", methods=["GET"])
@jwt_required()
def get_AllPerfumes():
    # Ambil parameter query dari frontend
    page = request.args.get("page", 0, type=int)
    accord = request.args.get("Accord", type=str)
    gender = request.args.get("gender", type=str)
    situation = request.args.get("situation", type=str)
    occasion = request.args.get("Occasion", type=str)
    price_range = request.args.get("price_range", type=str)

    query = Perfume.query
    
    # --- FILTER KRITERIA (Memperhatikan Case Sensitive Atribut) ---
    if accord:
        query = query.filter(Perfume.Accord.ilike(f"%{accord}%"))
    
    if gender:
        query = query.filter(func.lower(Perfume.gender) == gender.lower())
    
    if situation:
        query = query.filter(func.lower(Perfume.situation) == situation.lower())
    
    if occasion:
        query = query.filter(func.lower(Perfume.Occasion) == occasion.lower())
    
    # --- FILTER RENTANG HARGA ---
    # Karena kolom Perfume.price adalah Integer, kita langsung bandingkan angkanya
    if price_range:
        pr = price_range.strip().lower()
        if pr == "basic":
            query = query.filter(Perfume.price <= 155000)
        elif pr == "classic":
            query = query.filter(Perfume.price > 155000, Perfume.price <= 210000)
        elif pr == "premium":
            query = query.filter(Perfume.price > 210000, Perfume.price <= 251100)
        elif pr == "luxury":
            query = query.filter(Perfume.price > 251100, Perfume.price <= 349000)
        elif pr == "elite":
            query = query.filter(Perfume.price > 349000)

    # --- SORTING & PAGINATION ---
    # Urutkan berdasarkan harga termurah
    query = query.order_by(Perfume.price.asc())
    
    # React kirim page 0, SQLAlchemy butuh page 1
    pagination = query.paginate(page=page + 1, per_page=12, error_out=False)

    return jsonify({
        "data": [i.to_dict() for i in pagination.items],
        "total": pagination.total,
        "pages": pagination.pages,
        "current_page": page
    })

@api_bp.route("/perfume/<int:id>", methods=["GET"])
@jwt_required()
def get_perfume_by_id(id):
    perfume = Perfume.query.get(id)
    if not perfume:
        return jsonify({"msg": "Perfume not found"}), 404
    return jsonify(perfume.to_dict())

@api_bp.route('/uploads/<filename>')
def uploaded_file(filename):
    return send_from_directory("uploads", filename)