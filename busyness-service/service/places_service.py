from typing import Tuple

from flask import jsonify

from config.logger import logger
from dto.dto import PlaceBusynessDTO
import traceback
from exceptions.exceptions import PlaceBusynessNotFoundError
from model.model import Street, Place, ZoneBusynessPrediction, ZoneCounts, StreetCounts, CategoryCustomerBehavior, \
    CategoryBusynessCounts
from repository.PlaceRepository import PlaceRepository
from service.busyness_service import calculate_place_busyness, convert_place_busyness


def _get_busyness_dto(busyness_data: Tuple[
    Place, Street, ZoneBusynessPrediction, ZoneCounts, StreetCounts, CategoryCustomerBehavior,
    CategoryBusynessCounts]) -> PlaceBusynessDTO:
    raw_busyness = calculate_place_busyness(busyness_data)
    busyness = convert_place_busyness(raw_busyness)
    busyness_for_place = (PlaceBusynessDTO(busyness_data[2].hour_of_day,
                                           busyness_data[0].place_id,
                                           busyness_data[0].street_id,
                                           busyness_data[0].zone_id,
                                           busyness))
    return busyness_for_place


def get_busyness_for_all_places(hour):
    try:
        busyness_datas = PlaceRepository.get_busyness_data_for_all_places(hour)
        if not busyness_datas:
            raise PlaceBusynessNotFoundError("Cannot retrieve all place busyness for the given hour")
        else:
            busyness_for_places = [
                _get_busyness_dto(busyness_data)
                for busyness_data in busyness_datas
            ]
            return jsonify([busyness_for_place.json for busyness_for_place in busyness_for_places]), 200
    except PlaceBusynessNotFoundError as e:
        logger.error(f"Error calculating busyness for places: {str(e)}")
        raise
    except Exception as e:
        logger.error("An error occurred while calculating busyness for places: " + str(e))
        return jsonify({'error': 'while calculating busyness for places'}), 500


def get_busyness_for_all_places_in_zone(zone_id, hour):
    try:
        busyness_datas = PlaceRepository.get_busyness_data_for_all_places_in_zone(zone_id, hour)
        if not busyness_datas:
            raise PlaceBusynessNotFoundError("Cannot retrieve all place busyness in the zone for the given hour")
        else:
            busyness_for_places = [
                _get_busyness_dto(busyness_data)
                for busyness_data in busyness_datas
            ]
            return jsonify([busyness_for_place.json for busyness_for_place in busyness_for_places]), 200
    except PlaceBusynessNotFoundError as e:
        logger.error(f"Error calculating busyness for places: {str(e)}")
        raise
    except Exception as e:
        logger.error("An error occurred while calculating busyness for places: " + str(e))
        return jsonify({'error': 'while calculating busyness for places'}), 500


def get_busyness_for_all_places_in_street_in_zone(zone_id, street_id, hour):
    try:
        busyness_datas = PlaceRepository.get_busyness_data_for_all_places_in_street_in_zone(zone_id, street_id, hour)
        if not busyness_datas:
            raise PlaceBusynessNotFoundError(
                "Cannot retrieve all place busyness in the zone and street for the given hour")
        else:
            busyness_for_places = [
                _get_busyness_dto(busyness_data)
                for busyness_data in busyness_datas
            ]
            return jsonify([busyness_for_place.json for busyness_for_place in busyness_for_places]), 200
    except PlaceBusynessNotFoundError as e:
        logger.error(f"Error calculating busyness for places: {str(e)}")
        raise
    except Exception as e:
        logger.error("An error occurred while calculating busyness for places: " + str(e))
        return jsonify({'error': 'while calculating busyness for places'}), 500


def get_busyness_for_place(place_id, hour):
    try:
        busyness_data = PlaceRepository.get_busyness_data_for_place(place_id, hour)
        if not busyness_data:
            raise PlaceBusynessNotFoundError("Cannot retrieve all place busyness for the place for the given hour")
        else:
            busyness_for_place = _get_busyness_dto(busyness_data)
            return jsonify(busyness_for_place.json), 200
    except PlaceBusynessNotFoundError as e:
        logger.error(f"Error calculating busyness for places: {str(e)}")
        raise
    except Exception as e:
        logger.error("An error occurred while calculating busyness for places: " + str(e))
        return jsonify({'error': 'while calculating busyness for places'}), 500


def get_busyness_for_places_by_ids(place_ids, hour):
    try:
        busyness_datas = PlaceRepository.get_busyness_data_for_places_by_ids(place_ids, hour)
        if not busyness_datas:
            raise PlaceBusynessNotFoundError("No places found for IDs: " + ", ".join(map(str, place_ids)))
        busyness_for_places = [
            _get_busyness_dto(busyness_data)
            for busyness_data in busyness_datas
        ]
        return jsonify([busyness_for_place.json for busyness_for_place in busyness_for_places]), 200
    except PlaceBusynessNotFoundError as e:
        logger.error(str(e))
        return jsonify({'error': str(e)}), 404
    except Exception as e:
        logger.error("An error occurred while calculating busyness for places: " + str(e))
        return jsonify({'error': 'while calculating busyness for places'}), 500
