from typing import Union

from sqlalchemy import and_, Float
from config.db import db
from model.model import Rating

from config.logger import logger


class RatingRepository:
    @staticmethod
    def get_user_rating(place_id: str, user_id: int) -> Union[Rating, None]:
        try:
            user_rating = db.session.query(Rating).filter(
                and_(Rating.place_id == place_id, Rating.user_id == user_id)).first()
            if not user_rating:
                return None
            return user_rating.rating_value
        except Exception as e:
            logger.error(f"Error in get_user_rating: {str(e)}")
            return None

    @staticmethod
    def post_user_rating(rating: Rating) -> None:
        try:
            db.session.add(rating)
            db.session.commit()
            db.session.close()
        except Exception as e:
            db.session.rollback()
            logger.error(f"Error in post_user_rating: {str(e)}")
            raise e

    @staticmethod
    def update_user_rating(rating: Rating) -> None:
        try:
            existing_rating = db.session.query(Rating).get((rating.place_id, rating.user_id))
            if existing_rating is None:
                raise Exception("No existing rating to update.")
            db.session.merge(rating)
            db.session.commit()
            db.session.close()
        except Exception as e:
            db.session.rollback()
            logger.error(f"Error in update_user_rating: {str(e)}")
            raise e

    @staticmethod
    def get_place_average_rating(place_id: str) -> Union[float, None]:
        try:
            avg_rating = db.session.query(db.func.avg(Rating.rating_value)).filter(Rating.place_id == place_id).scalar()
            return avg_rating
        except Exception as e:
            logger.error(f"Error in get_place_average_rating: {str(e)}")
            return None

