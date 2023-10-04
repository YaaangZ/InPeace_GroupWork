from typing import List, Tuple

import pytz
from datetime import datetime

from config.logger import logger
from model.model import Place, Street, ZoneBusynessPrediction, ZoneCounts, StreetCounts, CategoryCustomerBehavior, \
    CategoryBusynessCounts
from repository.BusynessRepository import BusynessRepository
from repository.BusynessStatsRepositories import ZoneBusynessRepository, StreetBusynessRepository, \
    PlaceBusynessRepository


def get_current_hour_in_manhattan():
    eastern_tz = pytz.timezone('America/New_York')
    current_time = datetime.now(eastern_tz)
    hour = current_time.hour
    logger.debug(f"Current hour in Manhattan: {hour}")
    return hour


def validate_hour_input(hour: int):
    logger.debug(f"Validating hour input: {hour}")
    if hour > 23 or hour < 0:
        logger.error(f"Invalid hour input: {hour}")
        raise ValueError("Hour must be between 0 and 23")


def convert_zone_busyness(busyness: float) -> str:
    logger.debug(f"Converting zone busyness for busyness: {busyness}")
    zone_busyness_bins = ZoneBusynessRepository.get_busyness_ranges()
    mapped_busyness = map_busyness(busyness, zone_busyness_bins)
    busyness_level = BusynessRepository.get_busyness_name(mapped_busyness)
    logger.debug(f"Converted zone busyness: {busyness_level}")
    return busyness_level


def convert_street_busyness(busyness: float) -> str:
    logger.debug(f"Converting street busyness for busyness: {busyness}")
    street_busyness_bins = StreetBusynessRepository.get_busyness_ranges()
    mapped_busyness = map_busyness(busyness, street_busyness_bins)
    busyness_level = BusynessRepository.get_busyness_name(mapped_busyness)
    logger.debug(f"Converted street busyness: {busyness_level}")
    return busyness_level


def calculate_street_busyness(
        busyness_data: Tuple[Street, ZoneBusynessPrediction, ZoneCounts, StreetCounts]) -> float:
    logger.debug(f"Calculating street busyness with data: {busyness_data}")
    zone_busyness_prediction = busyness_data[1]
    zone_counts = busyness_data[2]
    street_counts = busyness_data[3]

    street_score: float = 0.5 * (street_counts.place_count / zone_counts.place_count) + \
                          0.5 * (street_counts.length_m / zone_counts.total_length_m)

    busyness: float = zone_busyness_prediction.busyness * street_score
    logger.debug(f"Calculated street busyness: {busyness}")
    return busyness


def convert_place_busyness(busyness: float) -> str:
    logger.debug(f"Converting place busyness for busyness: {busyness}")
    place_busyness_bins = PlaceBusynessRepository.get_busyness_ranges()
    mapped_busyness = map_busyness(busyness, place_busyness_bins)
    busyness_level = BusynessRepository.get_busyness_name(mapped_busyness)
    logger.debug(f"Converted place busyness: {busyness_level}")
    return busyness_level


def calculate_place_busyness(busyness_data: Tuple[Place, Street, ZoneBusynessPrediction, ZoneCounts,
StreetCounts, CategoryCustomerBehavior, CategoryBusynessCounts]) -> float:
    logger.debug(f"Calculating place busyness with data: {busyness_data}")
    street = busyness_data[1]
    zone_busyness_prediction = busyness_data[2]
    zone_counts = busyness_data[3]
    street_counts = busyness_data[4]
    category_customer_behavior = busyness_data[5]
    category_busyness_counts = busyness_data[6]

    street_busyness: float = calculate_street_busyness(
        (street, zone_busyness_prediction, zone_counts, street_counts))

    place_score: float = category_customer_behavior.busyness_multiplier / \
                         category_busyness_counts.total_category_busyness_by_street_and_hour

    busyness: float = float(street_busyness) * float(place_score)
    logger.debug(f"Calculated place busyness: {busyness}")
    return busyness

def map_busyness(busyness: float, busyness_bins: List[float]) -> int:
    logger.debug(f"Mapping busyness value: {busyness} using bins: {busyness_bins}")
    mapped_value = None
    if busyness <= busyness_bins[0]:
        mapped_value = 1
    elif busyness <= busyness_bins[1]:
        mapped_value = 2
    elif busyness <= busyness_bins[2]:
        mapped_value = 3
    elif busyness < busyness_bins[3]:
        mapped_value = 4
    else:
        mapped_value = 5
    logger.debug(f"Mapped busyness: {busyness} to {mapped_value}")
    return mapped_value
