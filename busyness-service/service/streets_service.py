from typing import List, Tuple

from flask import jsonify

from config.logger import logger
from dto.dto import StreetBusynessDTO
from exceptions.exceptions import StreetBusynessNotFoundError
from model.model import Street, ZoneBusynessPrediction, ZoneCounts, StreetCounts
from repository.StreetRepository import StreetRepository
from service.busyness_service import calculate_street_busyness, convert_street_busyness


def _get_busyness_dto(
        busyness_data: Tuple[Street, ZoneBusynessPrediction, ZoneCounts, StreetCounts]) -> StreetBusynessDTO:
    raw_busyness = calculate_street_busyness(busyness_data)
    busyness = convert_street_busyness(raw_busyness)
    busyness_for_street = (StreetBusynessDTO(busyness_data[1].hour_of_day,
                                             busyness_data[0].street_id,
                                             busyness_data[0].zone_id,
                                             busyness))
    return busyness_for_street


def get_busyness_for_all_streets(hour):
    try:
        busyness_datas = StreetRepository.get_busyness_data_for_all_streets(hour)
        if not busyness_datas:
            raise StreetBusynessNotFoundError("Cannot retrieve all street busyness for the given hour")
        else:
            busyness_for_streets = [
                _get_busyness_dto(busyness_data)
                for busyness_data in busyness_datas
            ]
            return jsonify([busyness_for_street.json for busyness_for_street in busyness_for_streets]), 200
    except StreetBusynessNotFoundError as e:
        logger.error(f"Error calculating busyness for streets: {str(e)}")
        raise


def get_busyness_for_streets_in_zone(zone_id, hour):
    try:
        busyness_datas = StreetRepository.get_busyness_data_for_streets_in_zone(zone_id, hour)
        if not busyness_datas:
            raise StreetBusynessNotFoundError("Cannot retrieve all street busyness for the given hour and zone")
        else:
            busyness_for_streets = [
                _get_busyness_dto(busyness_data)
                for busyness_data in busyness_datas
            ]
            return jsonify([busyness_for_street.json for busyness_for_street in busyness_for_streets]), 200
    except StreetBusynessNotFoundError as e:
        logger.error(f"Error calculating busyness for streets: {str(e)}")
        raise


def get_busyness_for_street_in_zone(street_id, zone_id, hour):
    try:
        busyness_data = StreetRepository.get_busyness_for_street_in_zone(street_id, zone_id, hour)
        if not busyness_data:
            raise StreetBusynessNotFoundError("Cannot retrieve all street busyness for the given hour")
        else:
            busyness_for_street = _get_busyness_dto(busyness_data)
            return jsonify(busyness_for_street.json), 200
    except StreetBusynessNotFoundError as e:
        logger.error(f"Error calculating busyness for streets: {str(e)}")
        raise
