from functools import wraps
from flask_jwt_extended import get_jwt_identity, verify_jwt_in_request
from flask import jsonify
from models.user_model import User, UserRoleEnum

def admin_required(fn):
    @wraps(fn)
    def wrapper(*args, **kwargs):
        verify_jwt_in_request()

        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        print(user)

        if not user or user.role != UserRoleEnum.ADMIN:
            return jsonify({"message":"Admin access only"}),403
        
        return fn(*args, **kwargs)
    return wrapper