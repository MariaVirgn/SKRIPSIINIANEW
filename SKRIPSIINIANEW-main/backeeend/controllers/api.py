from flask import Blueprint, request, jsonify, send_from_directory
from flask_jwt_extended import jwt_required, get_jwt_identity
from sqlalchemy import func
from database.db import db

# Models
from models.user_model import User
from models.wishlist_model import Wishlist
from models.rating_model import Rating 
from models.perfume_model import Perfume

# Services
from services.recommendation_service import RecommendationService

api_bp = Blueprint('api', __name__)
service = RecommendationService()

# =====================================================================
# 1. AUTH & UTILITY ENDPOINTS
# =====================================================================
@api_bp.route("/profile", methods=["GET"])
@jwt_required()
def profile():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    return jsonify(user.to_dict()) if user else (jsonify({"msg": "User not found"}), 404)

@api_bp.route("/dropdowns", methods=["GET"])
def dropdowns():
    return jsonify(service.get_unique_values())

# =====================================================================
# 2. RECOMMENDATION ENDPOINTS
# =====================================================================
@api_bp.route("/recommend", methods=["POST"])
@jwt_required()
def recommend():
    data = request.get_json()
    # Pastikan service.recommend menangani data yang masuk
    result = service.recommend(data)
    return jsonify(result)

# =====================================================================
# 3. WISHLIST ENDPOINTS (Fitur User "Like")
# =====================================================================
@api_bp.route("/wishlist", methods=["GET"])
@jwt_required()
def get_wishlist():
    user_id = get_jwt_identity()
    items = Wishlist.query.filter_by(user_id=user_id).all()
    return jsonify([i.to_dict() for i in items])

@api_bp.route("/wishlist/toggle", methods=["POST"])
@jwt_required()
def toggle_wishlist():
    user_id = get_jwt_identity()
    perfume_id = request.get_json().get("perfume_id")
    
    item = Wishlist.query.filter_by(user_id=user_id, perfume_id=perfume_id).first()
    if item:
        db.session.delete(item)
        msg = "Removed from wishlist"
    else:
        db.session.add(Wishlist(user_id=user_id, perfume_id=perfume_id))
        msg = "Added to wishlist"
    
    db.session.commit()
    return jsonify({"msg": msg})

# =====================================================================
# 4. EVALUASI ENDPOINTS (Data Skripsi/Rating)
# =====================================================================
@api_bp.route("/evaluasi/rating", methods=["POST"])
@jwt_required()
def add_rating():
    user_id = get_jwt_identity()
    data = request.get_json()
    perfume_id = data.get("perfume_id")
    rating_score = data.get("rating_score")
    anchor_id = data.get("anchor_id")

    if not perfume_id or rating_score is None:
        return jsonify({"msg": "Invalid data provided"}), 400
    
    perfume_record = Perfume.query.get(perfume_id)
    perfume_name = perfume_record.perfume if perfume_record else "Unknown"
    
    # Upsert rating: Update jika ada, Create jika baru
    rating_item = Rating.query.filter_by(user_id=user_id, perfume_id=perfume_id).first()
    
    if rating_item:
        rating_item.rating = rating_score
        rating_item.anchor_id = anchor_id
        rating_item.perfume_name = perfume_name
    else:
        new_rating = Rating(user_id=user_id, perfume_id=perfume_id, anchor_id=anchor_id, rating=rating_score, perfume_name=perfume_name)
        db.session.add(new_rating)

    db.session.commit()
    return jsonify({"msg": "Rating saved successfully"}), 200

# =====================================================================
# 5. PERFUME ENDPOINTS
# =====================================================================
@api_bp.route("/perfume", methods=["GET"])
@jwt_required()
def get_all_perfumes():
    # Filter parameter
    page = request.args.get("page", 0, type=int)
    filters = {
        "accord": request.args.get("Accord"),
        "gender": request.args.get("gender"),
        "situation": request.args.get("situation"),
        "occasion": request.args.get("Occasion"),
        "price_range": request.args.get("price_range")
    }

    query = Perfume.query
    if filters["accord"]: query = query.filter(Perfume.Accord.ilike(f"%{filters['accord']}%"))
    if filters["gender"]: query = query.filter(func.lower(Perfume.gender) == filters["gender"].lower())
    if filters["situation"]: query = query.filter(func.lower(Perfume.situation) == filters["situation"].lower())
    if filters["occasion"]: query = query.filter(func.lower(Perfume.Occasion) == filters["occasion"].lower())
    
    # Logic Price Range
    pr = filters["price_range"]
    if pr:
        ranges = {
            "basic": (0, 155000), "classic": (155001, 210000), 
            "premium": (210001, 251100), "luxury": (251101, 349000), "elite": (349001, 9999999)
        }
        if pr.lower() in ranges:
            query = query.filter(Perfume.price.between(*ranges[pr.lower()]))

    pagination = query.order_by(Perfume.price.asc()).paginate(page=page + 1, per_page=12, error_out=False)
    
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
    return jsonify(perfume.to_dict()) if perfume else (jsonify({"msg": "Perfume not found"}), 404)

@api_bp.route('/uploads/<filename>')
def uploaded_file(filename):
    return send_from_directory("uploads", filename)