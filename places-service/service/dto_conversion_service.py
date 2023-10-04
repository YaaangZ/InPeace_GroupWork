from geoalchemy2 import Geometry

from model.model import Place, OpeningHours
from dto.dto import PlaceDTO, GeometryDTO, OpeningHoursDTO, TimeDTO
from typing import List, Tuple
from shapely.geometry import mapping
from shapely.wkb import loads


class PlaceMapper:
    @staticmethod
    def to_dto(place: Place, ) -> PlaceDTO:
        category: str = place.category.name
        location: GeometryDTO = GeometryMapper.to_dto(place.location)
        average_rating: float = place.average_rating.average_rating if place.average_rating else None
        opening_hours: OpeningHoursDTO = OpeningHoursMapper.to_dto(place.opening_hours)
        return PlaceDTO(place.place_id, place.place_name, category, place.zone_id, place.street_id, place.image,
                        location.json, place.address, opening_hours.json, average_rating)

    @staticmethod
    def to_dtos(places: List[Place]) -> List[PlaceDTO]:
        place_dtos = []
        for place in places:
            place_dtos.append(PlaceMapper.to_dto(place))
        return place_dtos


class OpeningHoursMapper:
    @staticmethod
    def to_dto(opening_hours: OpeningHours) -> OpeningHoursDTO:
        if opening_hours is None:
            return OpeningHoursDTO(None, None, None, None, None, None, None, None, None, None, None, None, None, None)
        else:
            return OpeningHoursDTO(TimeDTO(opening_hours.monday_open).json, TimeDTO(opening_hours.monday_close).json,
                                   TimeDTO(opening_hours.tuesday_open).json, TimeDTO(opening_hours.tuesday_close).json,
                                   TimeDTO(opening_hours.wednesday_open).json, TimeDTO(opening_hours.wednesday_close).json,
                                   TimeDTO(opening_hours.thursday_open).json, TimeDTO(opening_hours.thursday_close).json,
                                   TimeDTO(opening_hours.friday_open).json, TimeDTO(opening_hours.friday_close).json,
                                   TimeDTO(opening_hours.saturday_open).json, TimeDTO(opening_hours.saturday_close).json,
                                   TimeDTO(opening_hours.sunday_open).json, TimeDTO(opening_hours.sunday_close).json)


class GeometryMapper:
    @staticmethod
    def to_dto(geometry: Geometry):
        shapely_geometry = loads(bytes(geometry.data))
        coordinates = mapping(shapely_geometry)["coordinates"]
        return GeometryDTO(coordinates)


