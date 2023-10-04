from typing import Union

from model.model import User
from config.db import db

from config.logger import logger


class UserRepository:
    @staticmethod
    def find_user_by_email_address(email_address: str) -> Union[User, None]:
        try:
            user = db.session.query(User).filter(User.user_email_address == email_address).first()
            if not user:
                return None
            return user
        except Exception as e:
            logger.error(f"Error in find_user_by_email_address: {str(e)}")
            return None
