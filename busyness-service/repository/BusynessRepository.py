from typing import Optional

from model.model import Busyness
from config.db import db
from config.logger import logger


class BusynessRepository:
    # In-memory cache of busyness names to IDs.
    _cache = {}

    @staticmethod
    def get_busyness_name(busyness_id: int) -> Optional[str]:
        if busyness_id in BusynessRepository._cache:
            return BusynessRepository._cache[busyness_id]
        try:
            busyness_level: Busyness = db.session.query(Busyness).filter(Busyness.busyness_id == busyness_id).first()
            if busyness_level:
                BusynessRepository._cache[busyness_id] = busyness_level.busyness_name
                return BusynessRepository._cache[busyness_id]
            else:
                raise ValueError('No busyness level found with this ID.')
        except Exception as e:
            logger.error(e)
            return None

