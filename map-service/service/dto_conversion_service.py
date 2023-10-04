from model.model import Place, FullStreet, StreetSegment, Zone
from dto.dto import GeometryDTO, PlaceDTO, StreetDTO, ZoneDTO
from typing import List
from geoalchemy2 import Geometry
from shapely.geometry import mapping
from shapely.wkb import loads


class PlaceMapper:
    @staticmethod
    def to_dto(place: Place) -> PlaceDTO:
        geometry = GeometryMapper.to_dto(place.geometry)
        return PlaceDTO(place.place_id, place.place_name, place.zone_id, place.street_id, geometry)

    @staticmethod
    def to_dtos(places: List[Place]) -> List[PlaceDTO]:
        place_dtos = []
        for place in places:
            place_dtos.append(PlaceMapper.to_dto(place))
        return place_dtos


class StreetMapper:
    @staticmethod
    def to_full_street_dto(street: FullStreet) -> StreetDTO:
        zones = street.zones_crossed.zone_ids if street.zones_crossed else []
        geometry = GeometryMapper.to_dto(street.geometry)
        return StreetDTO(street.street_id, street.street_name, zones, geometry)

    @staticmethod
    def to_full_street_dtos(streets: List[FullStreet]) -> List[StreetDTO]:
        street_dtos = []
        for street in streets:
            street_dtos.append(StreetMapper.to_full_street_dto(street))
        return street_dtos

    @staticmethod
    def to_street_segment_dto(segment: StreetSegment) -> StreetDTO:
        geometry = GeometryMapper.to_dto(segment.geometry)
        return StreetDTO(segment.street_id, segment.street.street_name, [segment.zone_id], geometry)

    @staticmethod
    def to_street_segment_dtos(segments: List[StreetSegment]) -> List[StreetDTO]:
        street_dtos = []
        for segment in segments:
            street_dtos.append(StreetMapper.to_street_segment_dto(segment))
        return street_dtos


class ZoneMapper:
    @staticmethod
    def to_dto(zone: Zone) -> ZoneDTO:
        geometry = GeometryMapper.to_dto(zone.geometry)
        return ZoneDTO(zone.zone_id, zone.zone_name, geometry)

    @staticmethod
    def to_dtos(zones: List[Zone]) -> List[ZoneDTO]:
        zone_dtos = []
        for zone in zones:
            zone_dtos.append(ZoneMapper.to_dto(zone))
        return zone_dtos


class GeometryMapper:
    @staticmethod
    def to_dto(geometry: Geometry):
        shapely_geometry = loads(bytes(geometry.data))
        gtype = mapping(shapely_geometry)["type"]
        coordinates = mapping(shapely_geometry)["coordinates"]
        return GeometryDTO(gtype, coordinates)
