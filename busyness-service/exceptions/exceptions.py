class NotFoundError(Exception):
    """Base class for other exceptions"""
    pass


class PlaceNotFoundError(NotFoundError):
    """Raised when the input place is not found"""

    def __init__(self, message="Requested place was not found"):
        self.message = message
        super().__init__(self.message)


class PlaceBusynessNotFoundError(NotFoundError):
    """Raised when the input place is not found"""

    def __init__(self, message="Requested place busyness was not found"):
        self.message = message
        super().__init__(self.message)


class StreetNotFoundError(NotFoundError):
    """Raised when the input place is not found"""

    def __init__(self, message="Requested street was not found"):
        self.message = message
        super().__init__(self.message)


class StreetBusynessNotFoundError(NotFoundError):
    """Raised when the input place is not found"""

    def __init__(self, message="Requested street busyness was not found"):
        self.message = message
        super().__init__(self.message)


class ZoneNotFoundError(NotFoundError):
    """Raised when the input place is not found"""

    def __init__(self, message="Requested zone was not found"):
        self.message = message
        super().__init__(self.message)


class ZoneBusynessNotFoundError(NotFoundError):
    """Raised when the input place is not found"""

    def __init__(self, message="Requested zone busyness was not found"):
        self.message = message
        super().__init__(self.message)


class CategoryNotFoundError(NotFoundError):
    """Raised when the input place is not found"""

    def __init__(self, message="Requested rating was not found"):
        self.message = message
        super().__init__(self.message)
