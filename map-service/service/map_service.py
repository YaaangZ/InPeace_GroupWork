from flask import jsonify
from repository.repository import PlaceRepository, StreetRepository, ZoneRepository
from service.dto_conversion_service import PlaceMapper, StreetMapper, ZoneMapper
from exceptions.exceptions import PlaceNotFoundError, StreetNotFoundError, ZoneNotFoundError
from config.logger import logger

def get_all_places():
    try:
        places = PlaceRepository.get_all_places()
        place_dtos = PlaceMapper.to_dtos(places)
        return jsonify([place.json for place in place_dtos])
    except PlaceNotFoundError as e:
        logger.error(e)
        return jsonify({'error': str(e)}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500


def get_places_by_zone(zone_id):
    try:
        places = PlaceRepository.get_places_by_zone(zone_id)
        place_dtos = PlaceMapper.to_dtos(places)
        return jsonify([place.json for place in place_dtos])
    except PlaceNotFoundError as e:
        logger.error(e)
        return jsonify({'error': str(e)}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500


def get_all_streets():
    try:
        streets = StreetRepository.get_all_streets()
        street_dtos = StreetMapper.to_full_street_dtos(streets)
        return jsonify([street.json for street in street_dtos])
    except StreetNotFoundError as e:
        logger.error(e)
        return jsonify({'error': str(e)}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500


def get_streets_by_zone(zone_id):
    try:
        segments = StreetRepository.get_streets_by_zone(zone_id)
        street_dtos = StreetMapper.to_street_segment_dtos(segments)
        return jsonify([street.json for street in street_dtos])
    except StreetNotFoundError as e:
        logger.error(e)
        return jsonify({'error': str(e)}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500


def get_all_zones():
    try:
        zones = ZoneRepository.get_all_zones()
        zone_dtos = ZoneMapper.to_dtos(zones)
        return jsonify([zone.json for zone in zone_dtos])
    except ZoneNotFoundError as e:
        logger.error(e)
        return jsonify({'error': str(e)}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500
