from typing import List, Tuple

from flask import jsonify

from config.logger import logger
from dto.dto import ZoneBusynessDTO
from exceptions.exceptions import ZoneBusynessNotFoundError
from model.model import ZoneBusynessPrediction, Zone, ZoneCounts
from repository.ZoneRepository import ZoneRepository
from service.busyness_service import convert_zone_busyness

def get_busyness_for_all_zones(hour: int):
    try:
        zones_busyness: List[Tuple[Zone, ZoneBusynessPrediction]] = ZoneRepository.get_busyness_for_all_zones(hour)
        if not zones_busyness:
            raise ZoneBusynessNotFoundError("No busyness data available for the given hour")
        else:
            busyness_for_zones = [
                ZoneBusynessDTO(hour, zone_busyness[1].zone_id,
                                convert_zone_busyness(abs(zone_busyness[1].busyness)  / zone_busyness[2].area_m2))
                for zone_busyness in zones_busyness
            ]
            return jsonify([busyness.json for busyness in busyness_for_zones]), 200
    except ZoneBusynessNotFoundError as e:
        logger.error(f"Error calculating busyness for zone: {str(e)}")
        raise


def get_busyness_for_zone(zone_id: int, hour: int):
    try:
        zone_busyness: Tuple[Zone, ZoneBusynessPrediction, ZoneCounts] = ZoneRepository.get_busyness_for_zone(zone_id, hour)
        if not zone_busyness:
            raise ZoneBusynessNotFoundError
        else:
            busyness = ZoneBusynessDTO(hour, zone_busyness[1].zone_id,
                                       convert_zone_busyness(abs(zone_busyness[1].busyness) / zone_busyness[2].area_m2))
            return jsonify(busyness.json), 200
    except ZoneBusynessNotFoundError as e:
        logger.error(f"Error calculating busyness for zone: {str(e)}")
        raise

