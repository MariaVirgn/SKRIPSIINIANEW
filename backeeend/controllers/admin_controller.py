from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models.user_model import User
from models.wishlist_model import Wishlist
from models.perfume_model import Perfume
from models.rating_model import Rating
# PENTING: Import RecommendationEvaluator ditambahkan di sini
from services.recommendation_service import RecommendationService
from services.recommendation_evaluator import RecommendationEvaluator
from middleware.admin_middleware import admin_required
from database.db import db
from werkzeug.utils import secure_filename
import os
import uuid

admin_bp = Blueprint("/api/admin", __name__)

UPLOAD_FOLDER = "uploads"

@admin_bp.route("/perfume", methods=["POST"])
@admin_required
def create_perfume():
    combinedText = request.form.get("top_notes") + request.form.get("mid_notes") + request.form.get("base_notes") + request.form.get("Accord") + request.form.get("Occasion") 

    perfume = Perfume(
        perfume=request.form.get("perfume"),
        brand=request.form.get("brand"),
        price=request.form.get("price"),
        size=request.form.get("size"),
        concentrate=request.form.get("concentrate"),
        top_notes=request.form.get("top_notes"),
        mid_notes=request.form.get("mid_notes"),
        base_notes=request.form.get("base_notes"),
        Accord=request.form.get("Accord"),
        Occasion=request.form.get("Occasion"),
        Mood=request.form.get("Mood"),
        situation=request.form.get("situation"),
        gender=request.form.get("gender"),
        Range=request.form.get("Range"),
        combined_text= combinedText
    )

    file = request.files.get("image")
    
    if file:
        filename = f"{uuid.uuid4()}_{secure_filename(file.filename)}"
        filepath = os.path.join(UPLOAD_FOLDER, filename)

        if not os.path.exists(UPLOAD_FOLDER):
            os.makedirs(UPLOAD_FOLDER)

        file.save(filepath)
        
        perfume.image_file = filename

    db.session.add(perfume)
    db.session.commit()

    return jsonify({
        "message":"Perfume Created",
        "data": perfume.to_dict()
    }),201


@admin_bp.route("/perfume/<int:id>", methods=["PUT"])
@admin_required
def update_perfume(id):
    perfume = Perfume.query.get(id)
    print("data: ", perfume)

    if not perfume:
        return {"error":"product not found"}, 404

    file = request.files.get("image")

    if file:
        filename = f"{uuid.uuid4()}_{secure_filename(file.filename)}"
        filepath = os.path.join(UPLOAD_FOLDER, filename)

        if not os.path.exists(UPLOAD_FOLDER):
            os.makedirs(UPLOAD_FOLDER)

        file.save(filepath)

        if perfume.image_file and os.path.exists(perfume.image_file):
            os.remove(perfume.image_file)
        
        perfume.image_file = filename

    perfume.perfume = request.form.get("perfume", perfume.perfume)
    perfume.brand = request.form.get("brand", perfume.brand)
    perfume.price = request.form.get("price", perfume.price)
    perfume.size = request.form.get("size", perfume.size)
    perfume.concentrate = request.form.get("concentrate", perfume.concentrate)
    perfume.top_notes = request.form.get("top_notes", perfume.top_notes)
    perfume.mid_notes = request.form.get("mid_notes", perfume.mid_notes)
    perfume.base_notes = request.form.get("base_notes", perfume.base_notes)
    perfume.Accord = request.form.get("Accord", perfume.Accord)
    perfume.Occasion = request.form.get("Occasion", perfume.Occasion)
    perfume.Mood = request.form.get("Mood", perfume.Mood)
    perfume.situation = request.form.get("situation", perfume.situation)
    perfume.gender = request.form.get("gender", perfume.gender)
    perfume.Range = request.form.get("Range", perfume.Range)

    db.session.commit()

    return {
        "message":"perfume updated successfully"
    }, 200


@admin_bp.route("/perfume/<int:id>", methods=["DELETE"])
@admin_required
def delete_perfume(id):
    perfume = Perfume.query.get(id)

    if not perfume:
        return jsonify({"message": "Perfume not found"}), 404

    db.session.delete(perfume)
    db.session.commit()

    return jsonify({
        "message": "Perfume deleted"
    })

@admin_bp.route("/users", methods=["GET"])
@admin_required
def get_all_users():
    page = int(request.args.get("page", 1))

    pagination = User.query.paginate(page=page, per_page=10, error_out=False)

    return jsonify({
        "data":[i.to_dict() for i in pagination.items],
        "total": pagination.total,
        "pages":pagination.pages,
        "currrent_page":pagination.page
    })

@admin_bp.route("/users/<int:id>", methods=["DELETE"])
@admin_required
def delete_user(id):
    user = User.query.get(id)

    if not user:
        return jsonify({"message":"User doesn't exist"}), 404
    
    Wishlist.query.filter_by(user_id = id).delete()
    Rating.query.filter_by(user_id=id).delete()
    
    db.session.delete(user)
    db.session.commit()

    return jsonify({
        "message":"User deleted"
    })

# =========================================================================
# ENDPOINT (ROUTE) TAMBAHAN AGAR FRONTEND TIDAK "FAILED TO FETCH"
# =========================================================================

@admin_bp.route("/perfumes", methods=["GET"])
@admin_required
def get_all_perfumes_list():
    try:
        perfumes = Perfume.query.all()
        return jsonify([p.to_dict() for p in perfumes]), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@admin_bp.route("/evaluation", methods=["GET"])
@admin_required
def get_evaluation():
    try:
        users = User.query.all()
        details = []
        evaluator = RecommendationEvaluator()
        
        for user in users:
            # Cek apakah user memiliki rating
            user_ratings = evaluator.get_user_ratings(user.id)
            
            # KUNCI: Skip jika user tidak punya rating
            if not user_ratings:
                continue

            recommended_ids, anchor_id, relevansi_scores = evaluator.get_system_recommendations(user.id, top_n=7)
            
            # Skip jika tidak punya anchor
            if not anchor_id: continue
            
            # 3. Hitung metrik menggunakan skor yang sudah sinkron
            ap, ndcg = evaluator.calculate_metrics_multilevel(relevansi_scores)
            
            details.append({
                "user_name": getattr(user, 'name', f"User {user.id}"),
                "anchor_id": anchor_id,
                "ap": float(ap),
                "ndcg": float(ndcg),
                # Kirim data yang sudah berpasangan (id dan skor)
                "items": [{"id": p_id, "score": score} for p_id, score in zip(recommended_ids, relevansi_scores)]
            })
            
        return jsonify({"details": details}), 200
        
    except Exception as e:
        print(f"Error: {str(e)}")
        return jsonify({"error": "Terjadi kesalahan internal"}), 500