from flask import Blueprint, jsonify

from service import zones_service
from service.busyness_service import get_current_hour_in_manhattan, validate_hour_input
from config.logger import logger

# from service import places_service.py
bp = Blueprint('zone_controller', __name__)


class ZoneController:
    @staticmethod
    @bp.route('/current/zones', methods=["GET"])
    def get_current_busyness_for_all_zones():
        try:
            hour = get_current_hour_in_manhattan()
            return zones_service.get_busyness_for_all_zones(hour)
        except Exception as e:
            logger.error(e)
            return jsonify({'error': 'Not able to calculate busyness'}), 400

    @staticmethod
    @bp.route('/current/zones/<int:zone_id>', methods=["GET"])
    def get_current_busyness_for_zone(zone_id: int):
        try:
            hour = get_current_hour_in_manhattan()
            return zones_service.get_busyness_for_zone(zone_id, hour)
        except Exception as e:
            logger.error(e)
            return jsonify({'error': 'Not able to calculate busyness'}), 400

    @staticmethod
    @bp.route('/forecast/zones/<int:hour>', methods=["GET"])
    def get_forecast_busyness_for_all_zones(hour: int):
        try:
            validate_hour_input(hour)
            return zones_service.get_busyness_for_all_zones(hour)
        except Exception as e:
            logger.error(e)
            return jsonify({'error': 'Not able to calculate busyness'}), 400

    @staticmethod
    @bp.route('/forecast/zones/<int:zone_id>/<int:hour>', methods=["GET"])
    def get_forecast_busyness_for_zone(zone_id: int, hour: int):
        try:
            validate_hour_input(hour)
            return zones_service.get_busyness_for_zone(zone_id, hour)
        except Exception as e:
            logger.error(e)
            return jsonify({'error': 'Not able to calculate busyness'}), 400

