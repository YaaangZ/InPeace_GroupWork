class NotFoundError(Exception):
    """Base class for other exceptions"""
    pass


class PlaceNotFoundError(NotFoundError):
    """Raised when the input place is not found"""

    def __init__(self, message="Requested place was not found"):
        self.message = message
        super().__init__(self.message)


class RatingNotFoundError(NotFoundError):
    """Raised when the input place is not found"""

    def __init__(self, message="Requested rating was not found"):
        self.message = message
        super().__init__(self.message)


class CategoryNotFoundError(NotFoundError):
    """Raised when the input place is not found"""

    def __init__(self, message="Requested rating was not found"):
        self.message = message
        super().__init__(self.message)
