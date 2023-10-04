from flask import Blueprint, jsonify, request
from service import places_service
from service.authorization_service import verify_user_return_user_id

bp = Blueprint('controller', __name__)


@bp.route('/', methods=["GET"])
def get_all_places():
    try:
        return places_service.get_all_places()
    except Exception as e:
        print(e)
        return jsonify({'error': 'Not able to retrieve places'})


@bp.route('/<place_id>', methods=['GET'])
def get_place(place_id: str):
    try:
        return places_service.get_place(place_id)
    except Exception as e:
        print(e)
        return jsonify({'error': 'Not able to retrieve place'})


@bp.route('/places', methods=['POST'])
def get_places():
    try:
        place_ids = request.get_json()
        return places_service.get_places_by_ids(place_ids)
    except Exception as e:
        print(e)
        return jsonify({'error': 'Not able to retrieve places'})


@bp.route('/search', methods=['GET'])
def search_places():
    try:
        longitude = float(request.args.get('longitude'))
        latitude = float(request.args.get('latitude'))
        radius = float(request.args.get('radius', 250))
        category = request.args.get('category', 'all').lower()
        return places_service.get_places_in_radius(longitude, latitude, radius, category)
    except ValueError:
        return jsonify({'error': 'Invalid longitude, latitude, or radius parameter'}), 400


@bp.route('/zone/<zone_id>', methods=['GET'])
def get_places_by_zone(zone_id: int):
    return places_service.get_all_places_by_zone(zone_id)


@bp.route('/<place_id>/rating', methods=['POST'])
@verify_user_return_user_id  # Decorator to enforce authorization
def post_rating(place_id: str, user_id: int):
    try:
        rating: int = request.get_json()['rating']
        places_service.post_rating(place_id, user_id, rating)
        return jsonify({'message': 'Rating added successfully'}), 200
    except Exception as e:
        print(e)
        return jsonify({'error': 'Not able to retrieve places'}), 400


@bp.route('/<place_id>/rating', methods=['PUT'])
@verify_user_return_user_id  # Decorator to enforce authorization
def put_rating(place_id: str, user_id: int):
    try:
        rating: int = request.get_json()['rating']
        places_service.update_rating(place_id, user_id, rating)
        return jsonify({'message': 'Rating updated successfully'}), 200
    except Exception as e:
        print(e)
        return jsonify({'error': 'Not able to update rating'}), 400


@bp.route('/<place_id>/rating', methods=['GET'])
@verify_user_return_user_id  # Decorator to enforce authorization
def get_user_rating(place_id: str, user_id: int):
    try:
        return places_service.get_rating(place_id, user_id)
    except Exception as e:
        print(e)
        return jsonify({'error': 'Not able to get rating'}), 400
