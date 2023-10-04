from exceptions.exceptions import PlaceNotFoundError, StreetNotFoundError, ZoneNotFoundError
from sqlalchemy.orm import joinedload
from model.model import Place, FullStreet, StreetSegment, Zone
from config.db import db
from config.logger import logger

class PlaceRepository:
    @staticmethod
    def get_all_places():
        try:
            logger.info("Attempting to get all places")
            places = db.session.query(Place).all()
            if not places:
                raise PlaceNotFoundError("No places found")
            logger.info("Successfully retrieved all places")
            return places
        except Exception as e:
            logger.error("Error occurred while trying to get all places: %s", str(e))
            raise PlaceNotFoundError("No places found")

    @staticmethod
    def get_places_by_zone(zone_id):
        try:
            logger.info("Attempting to get places by zone_id: %s", zone_id)
            places = db.session.query(Place).filter(Place.zone_id == zone_id).all()
            if not places:
                raise PlaceNotFoundError(f"No places found for zone_id {zone_id}")
            logger.info("Successfully retrieved places for zone_id: %s", zone_id)
            return places
        except Exception as e:
            logger.error("Error occurred while trying to get places by zone_id %s: %s", zone_id, str(e))
            raise PlaceNotFoundError(f"No places found for zone_id {zone_id}")

class StreetRepository:
    @staticmethod
    def get_all_streets():
        try:
            logger.info("Attempting to get all streets")
            streets = db.session.query(FullStreet).options(joinedload(FullStreet.zones_crossed)).all()
            if not streets:
                raise StreetNotFoundError("No streets found")
            logger.info("Successfully retrieved all streets")
            return streets
        except Exception as e:
            logger.error("Error occurred while trying to get all streets: %s", str(e))
            raise StreetNotFoundError("No streets found")

    @staticmethod
    def get_streets_by_zone(zone_id):
        try:
            logger.info("Attempting to get streets by zone_id: %s", zone_id)
            street_segment = db.session.query(StreetSegment).filter(StreetSegment.zone_id == zone_id).all()
            if not street_segment:
                raise StreetNotFoundError(f"No streets found for zone_id {zone_id}")
            logger.info("Successfully retrieved streets for zone_id: %s", zone_id)
            return street_segment
        except Exception as e:
            logger.error("Error occurred while trying to get streets by zone_id %s: %s", zone_id, str(e))
            raise StreetNotFoundError(f"No streets found for zone_id {zone_id}")

class ZoneRepository:
    @staticmethod
    def get_all_zones():
        try:
            logger.info("Attempting to get all zones")
            zones = db.session.query(Zone).all()
            if not zones:
                raise ZoneNotFoundError("No zones found")
            logger.info("Successfully retrieved all zones")
            return zones
        except Exception as e:
            logger.error("Error occurred while trying to get all zones: %s", str(e))
            raise ZoneNotFoundError("No zones found")