from typing import List, Union
from datetime import time


class GeometryDTO:
    # Specify that the input parameters must be of type string and list of floats (1 point)
    # or a list of lists of floats (anything with more points)
    def __init__(self, coordinates: Union[List[float], List[List[float]]]):
        self.coordinates = coordinates

    @property
    def json(self):
        return {
            'longitude': self.coordinates[0],
            'latitude': self.coordinates[1]
        }


class OpeningHoursDTO:
    def __init__(self, monday_open: Union[time, None], monday_close: Union[time, None],
                 tuesday_open: Union[time, None], tuesday_close: Union[time, None],
                 wednesday_open: Union[time, None], wednesday_close: Union[time, None],
                 thursday_open: Union[time, None], thursday_close: Union[time, None],
                 friday_open: Union[time, None], friday_close: Union[time, None],
                 saturday_open: Union[time, None], saturday_close: Union[time, None],
                 sunday_open: Union[time, None], sunday_close: Union[time, None]):
        self.monday_open = monday_open
        self.monday_close = monday_close
        self.tuesday_open = tuesday_open
        self.tuesday_close = tuesday_close
        self.wednesday_open = wednesday_open
        self.wednesday_close = wednesday_close
        self.thursday_open = thursday_open
        self.thursday_close = thursday_close
        self.friday_open = friday_open
        self.friday_close = friday_close
        self.saturday_open = saturday_open
        self.saturday_close = saturday_close
        self.sunday_open = sunday_open
        self.sunday_close = sunday_close

    @property
    def json(self):
        return {
            'monday': {
                'open': self.monday_open,
                'close': self.monday_close
            },
            'tuesday': {
                'open': self.tuesday_open,
                'close': self.tuesday_close
            },
            'wednesday': {
                'open': self.wednesday_open,
                'close': self.wednesday_close
            },
            'thursday': {
                'open': self.thursday_open,
                'close': self.thursday_close
            },
            'friday': {
                'open': self.friday_open,
                'close': self.friday_close
            },
            'saturday': {
                'open': self.saturday_open,
                'close': self.saturday_close
            },
            'sunday': {
                'open': self.sunday_open,
                'close': self.sunday_close
            }
        }


class PlaceDTO:
    def __init__(self, place_id: str, name: str, category: str, zone_id: int, street_id: int, image: str,
                 coordinates: GeometryDTO, address: str, opening_hours: OpeningHoursDTO, rating: float):
        self.place_id = place_id
        self.name = name
        self.category = category
        self.zone_id = zone_id
        self.street_id = street_id
        self.image = image
        self.coordinates = coordinates
        self.address = address
        self.opening_hours = opening_hours
        self.rating = rating

    @property
    def json(self):
        return {
            'place_id': self.place_id,
            'name': self.name,
            'category': self.category,
            'zone_id': self.zone_id,
            'street_id': self.street_id,
            'coordinates': self.coordinates,
            'address': self.address,
            'opening_hours': self.opening_hours,
            'rating': self.rating,
            'image': self.image
        }


class TimeDTO:
    def __init__(self, db_time: time):
        self.db_time = db_time

    @property
    def json(self):
        if self.db_time is None:
            return None
        else:
            return self.db_time.strftime("%H:%M")
