from typing import Optional

from model.model import Category
from config.db import db


class CategoryRepository:
    # In-memory cache of category names to IDs.
    _cache = {}

    @staticmethod
    def get_id_by_name(name: str) -> Optional[int]:
        if name in CategoryRepository._cache:
            return CategoryRepository._cache[name]
        try:
            category = db.session.query(Category).filter(Category.name.like(name)).one()
            CategoryRepository._cache[name] = category.id
            if not category:
                return None
            else:
                return CategoryRepository._cache[name]
        except Exception as e:
            print(e)
            return None
