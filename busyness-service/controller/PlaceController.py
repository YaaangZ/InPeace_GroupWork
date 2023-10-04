from flask import Blueprint, jsonify, request
from service import places_service
import traceback
from service.busyness_service import get_current_hour_in_manhattan, validate_hour_input
from config.logger import logger

bp = Blueprint('place_controller', __name__)


class PlaceController:
    @staticmethod
    @bp.route('/current/places', methods=["GET"])
    def get_current_busyness_for_all_places():
        try:
            hour = get_current_hour_in_manhattan()
            return places_service.get_busyness_for_all_places(hour)
        except Exception as e:
            logger.error(e)
            traceback.print_exc()
            return jsonify({'error': 'Not able to calculate busyness'}), 400

    @staticmethod
    @bp.route('/current/places/zones/<int:zone_id>', methods=["GET"])
    def get_current_busyness_for_all_places_in_zone(zone_id: int):
        try:
            hour = get_current_hour_in_manhattan()
            return places_service.get_busyness_for_all_places_in_zone(zone_id, hour)
        except Exception as e:
            logger.error(e)
            traceback.print_exc()
            return jsonify({'error': 'Not able to calculate busyness'}), 400

    @staticmethod
    @bp.route('/current/places/zones/<int:zone_id>/<int:street_id>', methods=["GET"])
    def get_current_busyness_for_all_places_in_street_in_zone(zone_id: int, street_id: int):
        try:
            hour = get_current_hour_in_manhattan()
            return places_service.get_busyness_for_all_places_in_street_in_zone(zone_id, street_id, hour)
        except Exception as e:
            logger.error(e)
            traceback.print_exc()
            return jsonify({'error': 'Not able to calculate busyness'}), 400

    @staticmethod
    @bp.route('/current/places/<place_id>', methods=["GET"])
    def get_current_busyness_for_place(place_id: str):
        try:
            hour = get_current_hour_in_manhattan()
            return places_service.get_busyness_for_place(place_id, hour)
        except Exception as e:
            logger.error(e)
            traceback.print_exc()
            return jsonify({'error': 'Not able to calculate busyness'}), 400

    @staticmethod
    @bp.route('/current/places', methods=['POST'])
    def get_current_busyness_for_place_by_id():
        try:
            hour = get_current_hour_in_manhattan()
            place_ids = request.get_json()
            return places_service.get_busyness_for_places_by_ids(place_ids, hour)
        except Exception as e:
            print(e)
            traceback.print_exc()
            return jsonify({'error': 'Not able to calculate busyness'})

    @staticmethod
    @bp.route('/forcast/places/<int:hour>', methods=["GET"])
    def get_forecast_busyness_for_all_places(hour: int):
        try:
            validate_hour_input(hour)
            return places_service.get_busyness_for_all_places(hour)
        except Exception as e:
            logger.error(e)
            traceback.print_exc()
            return jsonify({'error': 'Not able to calculate busyness'}), 400

    @staticmethod
    @bp.route('/forecast/places/zones/<int:zone_id>/<int:hour>', methods=["GET"])
    def get_forecast_busyness_for_all_places_in_zone(zone_id: int, hour: int):
        try:
            validate_hour_input(hour)
            return places_service.get_busyness_for_all_places_in_zone(zone_id, hour)
        except Exception as e:
            logger.error(e)
            traceback.print_exc()
            return jsonify({'error': 'Not able to calculate busyness'}), 400

    @staticmethod
    @bp.route('/forecast/places/zones/<int:zone_id>/<int:street_id>/<int:hour>', methods=["GET"])
    def get_forecast_busyness_for_all_places_in_street_in_zone(zone_id: int, street_id: int, hour: int):
        try:
            validate_hour_input(hour)
            return places_service.get_busyness_for_all_places_in_street_in_zone(zone_id, street_id, hour)
        except Exception as e:
            logger.error(e)
            traceback.print_exc()
            return jsonify({'error': 'Not able to calculate busyness'}), 400

    @staticmethod
    @bp.route('/forecast/places/<place_id>/<int:hour>', methods=["GET"])
    def get_forecast_busyness_for_place(place_id: str, hour: int):
        try:
            validate_hour_input(hour)
            return places_service.get_busyness_for_place(place_id, hour)
        except Exception as e:
            logger.error(e)
            traceback.print_exc()
            return jsonify({'error': 'Not able to calculate busyness'}), 400

    @staticmethod
    @bp.route('/forecast/places/<int:hour>', methods=['POST'])
    def get_forecast_busyness_for_place_by_id(hour: int):
        try:
            validate_hour_input(hour)
            place_ids = request.get_json()
            return places_service.get_busyness_for_places_by_ids(place_ids, hour)
        except Exception as e:
            print(e)
            traceback.print_exc()
            return jsonify({'error': 'Not able to calculate busyness'})
