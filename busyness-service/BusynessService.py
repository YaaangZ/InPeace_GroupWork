from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from tenacity import retry, stop_after_attempt, wait_fixed
from sqlalchemy.exc import OperationalError
from config.config import Config
from config.db import db
from exceptions import exceptions
from controller.ZoneController import bp as bp_zone
from controller.StreetController import bp as bp_street
from controller.PlaceController import bp as bp_place
import os

os.environ


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    retry_count = int(os.getenv('SERVICE_RETRY_COUNT', 3))
    retry_wait = int(os.getenv('SERVICE_RETRY_WAIT', 5000)) / 5

    @retry(stop=stop_after_attempt(retry_count), wait=wait_fixed(retry_wait))
    def connect_to_db():
        try:
            db.init_app(app)
        except OperationalError as e:
            print("Unable to connect to the database. Retrying...")
            raise e
        else:
            print("Connected to the database.")

    connect_to_db()

    app.register_blueprint(bp_zone)
    app.register_blueprint(bp_street)
    app.register_blueprint(bp_place)

    @app.errorhandler(exceptions.StreetBusynessNotFoundError)
    @app.errorhandler(exceptions.PlaceBusynessNotFoundError)
    @app.errorhandler(exceptions.ZoneBusynessNotFoundError)
    def handle_not_found_error(e):
        return {'error': str(e)}, 404

    return app


app = create_app()

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=80)
