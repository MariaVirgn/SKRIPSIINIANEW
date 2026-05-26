from flask import Blueprint, request, jsonify
from models.user_model import User
from database.db import db
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required
import bcrypt
from models.user_model import UserRoleEnum

auth_bp = Blueprint("auth", __name__)

# REGISTER
@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.get_json()
    if not data or not data.get("email") or not data.get("password"):
        return jsonify({"msg": "Missing fields"}), 400

    name = data.get("name")
    email = data.get("email")
    password = data.get("password")
    role = UserRoleEnum.CUSTOMER

    if User.query.filter_by(email=email).first():
        return jsonify({"msg": "Email already exists"}), 400

    hashed_pw = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())

    user = User(
        name=name,
        email=email,
        password=hashed_pw.decode('utf-8'),
        role=role
    )

    db.session.add(user)
    db.session.commit()

    return jsonify({"msg": "User registered successfully"})

@auth_bp.route("/verify-token", methods=["GET"])
@jwt_required()
def verifyToken() :
    user_id = get_jwt_identity()

    user = User.query.get(user_id)

    if not user :
        return jsonify({
            "valid":False,
            "message":"user tidak ditemukan"
        })

    return jsonify({
        "valid":True,
        "user":user.to_dict()
    })

# LOGIN
@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    user = User.query.filter_by(email=data.get("email")).first()

    if not user:
        return jsonify({"msg": "User not found"}), 404

    # Cek password
    if not bcrypt.checkpw(data.get("password").encode('utf-8'), user.password.encode('utf-8')):
        return jsonify({"msg": "Wrong password"}), 401

    # PERBAIKAN DI SINI: Ubah user.id menjadi string
    token = create_access_token(identity=str(user.id)) 

    return jsonify({
        "token": token,
        "user": user.to_dict()
    })