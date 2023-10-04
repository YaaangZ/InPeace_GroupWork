from flask import request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from functools import wraps
from repository.UserRepository import UserRepository


# This is our decorator function.
def verify_user_return_user_id(func):
    # This 'wraps' decorator helps to make our decorator behave like the function it's decorating
    # It preserves the function name, docstring, etc.
    @wraps(func)
    @jwt_required()
    # Our decorator is a function that takes another function...
    def wrapper(*args, **kwargs):
        current_user_email = get_jwt_identity()
        user = UserRepository.find_user_by_email_address(current_user_email)
        if not user:
            return jsonify({'error': 'Unauthorized access'}), 403
        else:
            # If everything is fine, it calls the original function (the one it's decorating).
            # Here, we're returning the user object back to the decorated function
            return func(*args, user_id=user.user_id, **kwargs)
    return wrapper
