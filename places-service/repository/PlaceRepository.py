from typing import List, Union, Tuple

from sqlalchemy.dialects import postgresql
from sqlalchemy import func
from sqlalchemy.orm import joinedload

from model.model import Place, OpeningHours
from config.db import db
from config.logger import logger
from repository.CategoryRepository import CategoryRepository


class PlaceRepository:
    @staticmethod
    def get_all_places() -> Union[List[Place], None]:
        try:
            places_with_hours = db.session.query(Place).options(joinedload(Place.average_rating)).all()
            if not places_with_hours:
                return None
            else:
                return places_with_hours
        except Exception as e:
            logger.error(e)
            return None

    @staticmethod
    def get_places_by_ids(place_ids: List[str]) -> Union[List[Place], None]:
        try:
            places_with_hours = db.session.query(Place).options(
                joinedload(Place.average_rating)).filter(
                Place.place_id.in_(place_ids)).all()
            if not places_with_hours:
                return None
            else:
                return places_with_hours
        except Exception as e:
            logger.error(e)
            return None

    @staticmethod
    def get_all_places_by_zone(zone_id: int) -> Union[List[Place], None]:
        try:
            places_with_hours = db.session.query(Place).options(
                joinedload(Place.average_rating)).filter(Place.zone_id == zone_id).all()
            if not places_with_hours:
                return None
            else:
                return places_with_hours
        except Exception as e:
            logger.error(e)
            return None

    @staticmethod
    def get_places_in_radius(point, radius_m: float, category_name: str = None) -> Union[List[Place], None]:
        radius_ft = radius_m * 3.28054
        try:
            query = db.session.query(Place).filter(
                func.ST_Distance(
                    func.ST_Transform(Place.location, 2263),
                    func.ST_Transform(point, 2263)) <= radius_ft) \
                .options(joinedload(Place.average_rating))
            if category_name != 'all':
                category_id = CategoryRepository.get_id_by_name(category_name)
                if category_id is not None:
                    query = query.filter(Place.category_id == category_id)
                else:
                    logger.warning(f"Category '{category_name}' not found.")
                    return None
            logger.info(str(query.statement.compile(dialect=postgresql.dialect())))
            places = query.all()
            if not places:
                return None
            else:
                return places
        except Exception as e:
            logger.error(e)
            return None

    @staticmethod
    def get_place_by_id(place_id: str) -> Union[List[Place], None]:
        try:
            place = db.session.query(Place).filter(Place.place_id == place_id).\
                options(joinedload(Place.average_rating)).first()
            if not place:
                return None
            else:
                return place
        except Exception as e:
            logger.error(e)
            return None
