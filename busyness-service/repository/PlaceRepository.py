from typing import List, Tuple

from sqlalchemy import and_

from config.db import db
from config.logger import logger
from exceptions.exceptions import PlaceBusynessNotFoundError
from model.model import Street, ZoneBusynessPrediction, ZoneCounts, Place, StreetCounts, CategoryCustomerBehavior, \
    CategoryBusynessCounts


class PlaceRepository:
    @staticmethod
    def _place_busyness_data_query() -> db.Query:
        query = db.session.query(
            Place, Street, ZoneBusynessPrediction, ZoneCounts, StreetCounts, CategoryCustomerBehavior,
            CategoryBusynessCounts
        ).join(
            Street,
            and_(Place.street_id == Street.street_id, Place.zone_id == Street.zone_id)
        ).join(
            ZoneBusynessPrediction,
            and_(Place.zone_id == ZoneBusynessPrediction.zone_id, Street.zone_id == ZoneBusynessPrediction.zone_id)
        ).join(
            ZoneCounts,
            and_(Place.zone_id == ZoneCounts.zone_id, Street.zone_id == ZoneCounts.zone_id,
                 ZoneBusynessPrediction.zone_id == ZoneCounts.zone_id)
        ).join(
            StreetCounts,
            and_(Place.zone_id == StreetCounts.zone_id, Street.zone_id == StreetCounts.zone_id,
                 ZoneBusynessPrediction.zone_id == StreetCounts.zone_id, ZoneCounts.zone_id == StreetCounts.zone_id,
                 Place.street_id == StreetCounts.street_id, Street.street_id == StreetCounts.street_id)
        ).join(
            CategoryCustomerBehavior,
            and_(Place.category_id == CategoryCustomerBehavior.category_id,
                 ZoneBusynessPrediction.hour_of_day == CategoryCustomerBehavior.hour_of_day)
        ).join(
            CategoryBusynessCounts,
            and_(Place.street_id == CategoryBusynessCounts.street_id,
                 Place.zone_id == CategoryBusynessCounts.zone_id,
                 ZoneBusynessPrediction.hour_of_day == CategoryBusynessCounts.hour)
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
                raise PlaceBusynessNotFoundError
            return result
        except Exception as e:
            logger.error(e)
            return None

    @staticmethod
    def get_busyness_data_for_all_places(hour) -> List[
        Tuple[
            Place, Street, ZoneBusynessPrediction, ZoneCounts, StreetCounts,
            CategoryCustomerBehavior, CategoryBusynessCounts]]:
        query = PlaceRepository._place_busyness_data_query().filter(
            ZoneBusynessPrediction.hour_of_day == hour
        )
        return PlaceRepository._execute_busyness_query(query)

    @staticmethod
    def get_busyness_data_for_all_places_in_zone(zone_id, hour) -> List[Tuple[
            Place, Street, ZoneBusynessPrediction, ZoneCounts, StreetCounts,
            CategoryCustomerBehavior, CategoryBusynessCounts]]:
        query = PlaceRepository._place_busyness_data_query().filter(and_(
            ZoneBusynessPrediction.hour_of_day == hour,
            Place.zone_id == zone_id)
        )
        return PlaceRepository._execute_busyness_query(query)

    @staticmethod
    def get_busyness_data_for_all_places_in_street_in_zone(zone_id, street_id, hour) -> List[Tuple[
            Place, Street, ZoneBusynessPrediction, ZoneCounts, StreetCounts,
            CategoryCustomerBehavior, CategoryBusynessCounts]]:
        query = PlaceRepository._place_busyness_data_query().filter(and_(
            ZoneBusynessPrediction.hour_of_day == hour,
            Place.zone_id == zone_id,
            Place.street_id == street_id)
        )
        return PlaceRepository._execute_busyness_query(query)

    @staticmethod
    def get_busyness_data_for_place(place_id, hour) -> Tuple[
            Place, Street, ZoneBusynessPrediction, ZoneCounts, StreetCounts,
            CategoryCustomerBehavior, CategoryBusynessCounts]:
        query = PlaceRepository._place_busyness_data_query().filter(and_(
            ZoneBusynessPrediction.hour_of_day == hour,
            Place.place_id == place_id)
        )
        return PlaceRepository._execute_busyness_query(query, one=True)

    @staticmethod
    def get_busyness_data_for_places_by_ids(place_ids, hour) -> Tuple[
            Place, Street, ZoneBusynessPrediction, ZoneCounts, StreetCounts,
            CategoryCustomerBehavior, CategoryBusynessCounts]:
        query = PlaceRepository._place_busyness_data_query().filter(and_(
            ZoneBusynessPrediction.hour_of_day == hour,
            Place.place_id.in_(place_ids))
        )
        return PlaceRepository._execute_busyness_query(query)
