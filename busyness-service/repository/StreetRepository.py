from typing import List, Tuple

from sqlalchemy import and_

from config.db import db
from config.logger import logger
from exceptions.exceptions import StreetBusynessNotFoundError
from model.model import Street, ZoneBusynessPrediction, ZoneCounts, StreetCounts


class StreetRepository:
    @staticmethod
    def _street_busyness_data_query() -> db.Query:
        query = db.session.query(
            Street, ZoneBusynessPrediction, ZoneCounts, StreetCounts
        ).join(
            ZoneBusynessPrediction,
            Street.zone_id == ZoneBusynessPrediction.zone_id
        ).join(
            ZoneCounts,
            Street.zone_id == ZoneCounts.zone_id
        ).join(
            StreetCounts, and_(
                Street.zone_id == StreetCounts.zone_id,
                Street.street_id == StreetCounts.street_id)
        )
        return query

    @staticmethod
    def _execute_busyness_query(query, one=False):
        try:
            if one:
                result = query.one()
            else:
                result = query.all()
            if not result:
                raise StreetBusynessNotFoundError
            return result
        except Exception as e:
            logger.error(e)
            return None

    @staticmethod
    def get_busyness_data_for_all_streets(hour) -> List[
            Tuple[Street, ZoneBusynessPrediction, ZoneCounts, StreetCounts]]:
        query = StreetRepository._street_busyness_data_query().filter(
            ZoneBusynessPrediction.hour_of_day == hour
        )
        return StreetRepository._execute_busyness_query(query)

    @staticmethod
    def get_busyness_data_for_streets_in_zone(zone_id, hour) -> List[
            Tuple[Street, ZoneBusynessPrediction, ZoneCounts, StreetCounts]]:
        query = StreetRepository._street_busyness_data_query().filter(and_(
            ZoneBusynessPrediction.hour_of_day == hour,
            Street.zone_id == zone_id)
        )
        return StreetRepository._execute_busyness_query(query)

    @staticmethod
    def get_busyness_for_street_in_zone(street_id, zone_id, hour) -> Tuple[
            Street, ZoneBusynessPrediction, ZoneCounts, StreetCounts]:
        query = StreetRepository._street_busyness_data_query().filter(and_(
            ZoneBusynessPrediction.hour_of_day == hour,
            Street.street_id == street_id,
            Street.zone_id == zone_id)
        )
        return StreetRepository._execute_busyness_query(query, one=True)
