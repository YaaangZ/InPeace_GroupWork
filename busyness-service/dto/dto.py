class PlaceBusynessDTO:
    def __init__(self, hour: int, place_id: str, street_id: int, zone_id: int, predicted_busyness: str):
        self.hour = hour
        self.place_id = place_id
        self.street_id = street_id
        self.zone_id = zone_id
        self.predicted_busyness = predicted_busyness

    @property
    def json(self):
        return {
            'hour': self.hour,
            'placeID': self.place_id,
            'streetID': self.street_id,
            'zoneID': self.zone_id,
            'predictedBusyness': self.predicted_busyness
        }


class StreetBusynessDTO:
    def __init__(self, hour: int, street_id: int, zone_id: int, predicted_busyness: str):
        self.hour = hour
        self.street_id = street_id
        self.zone_id = zone_id
        self.predicted_busyness = predicted_busyness

    @property
    def json(self):
        return {
            'hour': self.hour,
            'streetID': self.street_id,
            'zoneID': self.zone_id,
            'predictedBusyness': self.predicted_busyness
        }


class ZoneBusynessDTO:
    def __init__(self, hour: int, zone_id: int, predicted_busyness: str):
        self.hour = hour
        self.zone_id = zone_id
        self.predicted_busyness = predicted_busyness

    @property
    def json(self):
        return {
            'hour': self.hour,
            'zoneID': self.zone_id,
            'predictedBusyness': self.predicted_busyness
        }
