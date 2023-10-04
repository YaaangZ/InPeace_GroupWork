from flask import Blueprint
from service import map_service

bp = Blueprint('controller', __name__)


@bp.route("/places/basic", methods=["GET"])
def places():
    return map_service.get_all_places()


@bp.route("/places/basic/<zone_id>", methods=["GET"])
def places_by_zone(zone_id):
    return map_service.get_places_by_zone(zone_id)


@bp.route("/streets", methods=["GET"])
def streets():
    return map_service.get_all_streets()


@bp.route("/streets/<zone_id>", methods=["GET"])
def streets_by_zone(zone_id):
    return map_service.get_streets_by_zone(zone_id)


@bp.route("/zones", methods=["GET"])
def zones():
    return map_service.get_all_zones()
