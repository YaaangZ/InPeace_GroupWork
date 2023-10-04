from typing import Union, List, Tuple

from sqlalchemy import and_

from config.db import db
from config.logger import logger
from exceptions.exceptions import ZoneBusynessNotFoundError
from model.model import Zone, ZoneBusynessPrediction, ZoneCounts


class ZoneRepository:

    @staticmethod
    def _zone_busyness_data_query() -> db.Query:
        query = db.session.query(
            Zone, ZoneBusynessPrediction, ZoneCounts
        ).join(
            ZoneBusynessPrediction,
            Zone.zone_id == ZoneBusynessPrediction.zone_id
        ).join(
            ZoneCounts,
            Zone.zone_id == ZoneCounts.zone_id
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
                raise ZoneBusynessNotFoundError
            return result
        except Exception as e:
            logger.error(e)
            return None

    @staticmethod
    def get_busyness_for_all_zones(hour: int) -> Union[List[Tuple[Zone, ZoneBusynessPrediction, ZoneCounts]], None]:
        query = ZoneRepository._zone_busyness_data_query().filter(
            ZoneBusynessPrediction.hour_of_day == hour
        )
        return ZoneRepository._execute_busyness_query(query)

    @staticmethod
    def get_busyness_for_zone(zone_id: int, hour: int) -> Union[Tuple[Zone, ZoneBusynessPrediction, ZoneCounts], None]:
        query = ZoneRepository._zone_busyness_data_query().filter(and_(
            ZoneBusynessPrediction.hour_of_day == hour,
            Zone.zone_id == zone_id)
        )
        return ZoneRepository._execute_busyness_query(query, one=True)
