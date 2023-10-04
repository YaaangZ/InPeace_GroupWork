from config.db import db
from config.logger import logger
from model.model import ZoneBusynessRange, StreetBusynessRange, PlaceBusynessRange


class BaseBusynessRepository:
    cache = []
    model = None

    @classmethod
    def get_busyness_ranges(cls):
        if not cls.cache:
            try:
                busyness_range = db.session.query(cls.model).first()
                logger.info(f"Retrieved {cls.model.__name__}: {busyness_range}")

                if not busyness_range:
                    logger.warning(f"No {cls.model.__name__} found in the database.")
                    return None

                cls.cache = [
                    busyness_range.q1,
                    busyness_range.q2,
                    busyness_range.q3,
                    busyness_range.q4
                ]
            except Exception as e:
                logger.error(f"Error fetching {cls.model.__name__}: {e}")
                return None

        return cls.cache


class ZoneBusynessRepository(BaseBusynessRepository):
    model = ZoneBusynessRange


class StreetBusynessRepository(BaseBusynessRepository):
    model = StreetBusynessRange


class PlaceBusynessRepository(BaseBusynessRepository):
    model = PlaceBusynessRange
