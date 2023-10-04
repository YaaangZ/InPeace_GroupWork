from typing import Any, Dict, List, Union


class GeometryDTO:
    # Specify that the input parameters must be of type string and list of floats (1 point)
    # or a list of lists of floats (anything with more points)
    def __init__(self, type: str, coordinates: Union[List[float], List[List[float]]]):
        self.type = type
        self.coordinates = coordinates

    @property
    def json(self):
        return {
            'type': self.type,
            'coordinates': self.coordinates
        }


class GeoJSONDTO:
    # Specify that the input parameters must be of type string and GeometryDTO
    def __init__(self, properties: Dict[str, Any], geometry: GeometryDTO, property_type: str = 'Feature'):
        self.type = property_type
        self.properties = properties
        self.geometry = geometry

    @property
    def json(self):
        return {
            'type': self.type,
            'properties': self.properties,
            'geometry': self.geometry.json
        }


class PlaceDTO(GeoJSONDTO):
    def __init__(self, place_id: str, place_name: str, zone_id: int, street_id: int, geometry: GeometryDTO):
        properties = {
            'placeID': place_id,
            'placeName': place_name,
            'zoneID': zone_id,
            'streetID': street_id
        }
        super().__init__(properties, geometry)


class StreetDTO(GeoJSONDTO):
    def __init__(self, street_id: int, street_name: str, zones_crossed: List[int], geometry: GeometryDTO):
        properties = {
            'streetID': street_id,
            'streetName': street_name,
            'zonesCrossed': zones_crossed,
        }
        super().__init__(properties, geometry)


class ZoneDTO(GeoJSONDTO):
    def __init__(self, zone_id: int, zone_name: str, geometry: GeometryDTO):
        properties = {
            'zoneID': zone_id,
            'streetName': zone_name,
        }
        super().__init__(properties, geometry)
