from flask import Blueprint, jsonify, request


from service import streets_service
from service.busyness_service import get_current_hour_in_manhattan
from config.logger import logger

# from service import places_service.py
bp = Blueprint('street_controller', __name__)


class StreetController:
    @staticmethod
    @bp.route('/current/streets', methods=["GET"])
    def get_current_busyness_for_all_streets():
        try:
            hour = get_current_hour_in_manhattan()
            return streets_service.get_busyness_for_all_streets(hour)
        except Exception as e:
            logger.error(e)
            return jsonify({'error': 'Not able to calculate busyness'}), 400

    @staticmethod
    @bp.route('/current/streets/<int:zone_id>', methods=["GET"])
    def get_current_busyness_for_streets_in_zone(zone_id: int):
        try:
            hour = get_current_hour_in_manhattan()
            return streets_service.get_busyness_for_streets_in_zone(zone_id, hour)
        except Exception as e:
            logger.error(e)
            return jsonify({'error': 'Not able to calculate busyness'}), 400

    @staticmethod
    @bp.route('/current/streets/<int:zone_id>/<int:street_id>', methods=["GET"])
    def get_current_busyness_for_street_in_zone(street_id: int, zone_id: int):
        try:
            hour = get_current_hour_in_manhattan()
            return streets_service.get_busyness_for_street_in_zone(street_id, zone_id, hour)
        except Exception as e:
            logger.error(e)
            return jsonify({'error': 'Not able to calculate busyness'}), 400

    @staticmethod
    @bp.route('/forecast/streets/<int:hour>', methods=["GET"])
    def get_forecast_busyness_for_all_streets(hour: int):
        try:
            return streets_service.get_busyness_for_all_streets(hour)
        except Exception as e:
            logger.error(e)
            return jsonify({'error': 'Not able to calculate busyness'}), 400

    @staticmethod
    @bp.route('/forecast/streets/<int:zone_id>/<int:hour>', methods=["GET"])
    def get_forecast_busyness_for_streets_in_zone(zone_id: int, hour: int):
        try:
            return streets_service.get_busyness_for_streets_in_zone(zone_id, hour)
        except Exception as e:
            logger.error(e)
            return jsonify({'error': 'Not able to calculate busyness'}), 400

    @staticmethod
    @bp.route('/forecast/streets/<int:zone_id>/<int:street_id>/<int:hour>', methods=["GET"])
    def get_forecast_busyness_for_street_in_zone(street_id: int, zone_id: int, hour: int):
        try:
            return streets_service.get_busyness_for_street_in_zone(street_id, zone_id, hour)
        except Exception as e:
            logger.error(e)
            return jsonify({'error': 'Not able to calculate busyness'}), 400

