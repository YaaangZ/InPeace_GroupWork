from flask import jsonify, request
from geoalchemy2.elements import WKTElement

from config.logger import logger
from exceptions.exceptions import PlaceNotFoundError, RatingNotFoundError
from model.model import Rating
from repository.PlaceRepository import PlaceRepository
from repository.RatingRepository import RatingRepository
from service.dto_conversion_service import PlaceMapper


def get_all_places():
    try:
        places = PlaceRepository.get_all_places()
        if not places:
            raise PlaceNotFoundError("No places found.")
        
        place_dtos = PlaceMapper.to_dtos(places)
        return jsonify([place.json for place in place_dtos]), 200
    except PlaceNotFoundError as e:
        logger.error(str(e))
        return jsonify({'error': str(e)}), 404


def get_place(place_id):
    try:
        place = PlaceRepository.get_place_by_id(place_id)
        if not place:
            raise PlaceNotFoundError(f"No place found with id {place_id}")
        
        place_dto = PlaceMapper.to_dto(place)
        return jsonify(place_dto.json), 200
    except PlaceNotFoundError as e:
        logger.error(str(e))
        return jsonify({'error': str(e)}), 404


def get_places_by_ids(place_ids):
    try:
        places = PlaceRepository.get_places_by_ids(place_ids)
        if not places:
            raise PlaceNotFoundError("No places found for IDs: " + ", ".join(map(str, place_ids)))
        place_dtos = PlaceMapper.to_dtos(places)
        return jsonify([place.json for place in place_dtos]), 200
    except PlaceNotFoundError as e:
        logger.error(str(e))
        return jsonify({'error': str(e)}), 404
    except Exception as e:
        logger.error("An error occurred while processing the request: " + str(e))
        return jsonify({'error': 'An error occurred while processing the request'}), 500


def get_places_in_radius(longitude, latitude, radius, category):
    try:
        point = WKTElement(f'POINT({longitude} {latitude})', srid=4326)
        logger.info(f"Point: {point}, Radius: {radius}, Category: {category}")
        places = PlaceRepository.get_places_in_radius(point, radius, category)
        if not places:
            raise PlaceNotFoundError("No places found in the specified radius and category.")
        place_dtos = PlaceMapper.to_dtos(places)
        return jsonify([place.json for place in place_dtos]), 200
    except PlaceNotFoundError as e:
        logger.error(str(e))
        return jsonify({'error': str(e)}), 404


def get_all_places_by_zone(zone_id):
    try:
        places = PlaceRepository.get_all_places_by_zone(zone_id)
        if not places:
            raise PlaceNotFoundError(f"No places found in zone {zone_id}.")
        
        place_dtos = PlaceMapper.to_dtos(places)
        return jsonify([place.json for place in place_dtos]), 200
    except PlaceNotFoundError as e:
        logger.error(str(e))
        return jsonify({'error': str(e)}), 404


def post_rating(place_id, user_id, rating_value):
    try:
        rating = Rating(place_id, user_id, rating_value)
        RatingRepository.post_user_rating(rating)
        return jsonify({'message': 'Rating posted successfully.'}), 200
    except Exception as e:
        logger.error(f"Failed to post rating. Error: {str(e)}")
        return jsonify({'error': 'Failed to post rating.'}), 500


def get_rating(place_id, user_id):
    try:
        rating = RatingRepository.get_user_rating(place_id, user_id)
        if not rating:
            raise RatingNotFoundError(f"No rating found for user {user_id} on place {place_id}.")
        return jsonify({'place_id': place_id, 'rating': rating}), 200
    except RatingNotFoundError as e:
        logger.error(str(e))
        return jsonify({'error': str(e)}), 404


def update_rating(place_id, user_id, rating_value):
    try:
        rating = Rating(place_id, user_id, rating_value)
        RatingRepository.update_user_rating(rating)
        return jsonify({'message': 'Rating updated successfully.'}), 200
    except Exception as e:
        logger.error(f"Failed to update rating. Error: {str(e)}")
        return jsonify({'error': 'Failed to update rating.'}), 500
