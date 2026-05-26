from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models.wishlist_model import Wishlist
from models.perfume_model import Perfume
from database.db import db

wishlist_bp = Blueprint("wishlist", __name__)

# ADD WISHLIST
@wishlist_bp.route("/wishlist", methods=["POST"])
@jwt_required()
def add_wishlist():
    user_id = get_jwt_identity()
    data = request.get_json()

    # 👇 TANGKAP ID LANGSUNG DARI FRONTEND 👇
    perfume_id = data.get("perfume_id")
    perfume_name = data.get("perfume")

    # Fallback pencarian nama hanya jika frontend tidak mengirimkan ID
    if not perfume_id and perfume_name:
        perfume_record = Perfume.query.filter(Perfume.perfume.ilike(perfume_name)).first()
        if perfume_record:
            perfume_id = perfume_record.id

    # 👇 PROTEKSI DUPLIKAT MUTLAK: Jika parfum ini sudah ada di wishlist user, stop! 👇
    existing_wishlist = Wishlist.query.filter_by(
        user_id=user_id, 
        perfume_id=perfume_id
    ).first()
    
    if existing_wishlist:
        return jsonify({"msg": "Already in wishlist", "perfume_id": perfume_id}), 200

    anchor_id = data.get("anchor_id")

    item = Wishlist(
        user_id=user_id,
        perfume_id=perfume_id,
        anchor_id=anchor_id,
        perfume=perfume_name,
        brand=data.get("brand"),
        price=data.get("price"),
        range=data.get("range"),
        size=data.get("size"),
        accord=data.get("accord"),
        situation=data.get("situation"),
        occasion=data.get("occasion")
    )

    db.session.add(item)
    db.session.commit()
    return jsonify({"msg": "Added to wishlist", "perfume_id": perfume_id}), 200


# DELETE WISHLIST
@wishlist_bp.route("/wishlist/<int:id>", methods=["DELETE"])
@jwt_required()
def delete_wishlist(id):
    user_id = get_jwt_identity()

    if not user_id:
        return jsonify({"error":"User not authenticated"}, 401);

    wishlist = Wishlist.query.get(id)

    if not wishlist :
        return jsonify({"error":"item not found"}, 404)
    
    db.session.delete(wishlist)
    db.session.commit()
    return jsonify({
        "message":"item berhasil dihapus dari wishlist"
    }, 201)