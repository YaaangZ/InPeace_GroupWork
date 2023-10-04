class NotFoundError(Exception):
    """Base class for other exceptions"""
    pass


class ZoneNotFoundError(NotFoundError):
    """Raised when the input zone is not found"""

    def __init__(self, message="Requested zone was not found"):
        self.message = message
        super().__init__(self.message)


class PlaceNotFoundError(NotFoundError):
    """Raised when the input place is not found"""

    def __init__(self, message="Requested place was not found"):
        self.message = message
        super().__init__(self.message)


class StreetNotFoundError(NotFoundError):
    """Raised when the input street is not found"""

    def __init__(self, message="Requested street was not found"):
        self.message = message
        super().__init__(self.message)
