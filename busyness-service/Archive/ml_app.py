from flask import Flask, request, jsonify
from datetime import datetime
from functions import load_model, make_prediction, is_holiday, get_weather_data
import requests
import psycopg2

app = Flask(__name__)

db_host = "inpeace-db.cn1hlpnikmwo.eu-west-1.rds.amazonaws.com"
db_name = "postgres"
db_user = "postgres"
db_password = "postgres"

# Connect to the database
conn = psycopg2.connect(
    host=db_host,
    dbname=db_name,
    user=db_user,
    password=db_password
)
#ROUTE1: get the current busyness for all zones
@app.route('/busyness/all_zones', methods=['GET'])
def get_all_now():
    # Get the current hour as an integer
    cur_hour = datetime.now().hour

    # Get the weather forecast data from the database
    query = "SELECT * FROM predicted_busyness where cur_hour = %s"
    cursor = conn.cursor()
    cursor.execute(query, (cur_hour, ))
    rows = cursor.fetchall()

    busyness_data = []
    for row in rows:
        zone_id = row[0]
        predicted_busyness = row[2]

        busyness_data.append({
            'zone_id': zone_id,
            'predicted_busyness': predicted_busyness,
        })

    cursor.close()

    return jsonify(busyness_data)

#ROUTE2: get the current busyness for one specific zones
@app.route('/busyness/<int:zone_id>', methods=['GET'])
def get_now(zone_id):
    # Get the current hour as an integer
    cur_hour = datetime.now().hour

    # Get the weather forecast data from the database
    query = "SELECT * FROM predicted_busyness where cur_hour = %s AND zoneid = %s"
    cursor = conn.cursor()
    cursor.execute(query, (cur_hour, zone_id, ))
    rows = cursor.fetchall()

    busyness_data = []
    for row in rows:
        zone_id = row[0]
        cur_hour = row[1]
        predicted_busyness = row[2]

        busyness_data.append({
            'zone_id': zone_id,
            'cur_hour': cur_hour,
            'predicted_busyness': predicted_busyness,
        })

    cursor.close()

    return jsonify(busyness_data)

#ROUTE3: get the predicted busyness for all zones (specific hour)
@app.route('/busyness/all_zones/<int:cur_hour>', methods=['GET'])
def predict_all(cur_hour):
    # Get the weather forecast data from the database
    query = f"SELECT * FROM predicted_busyness where cur_hour = %s"
    cursor = conn.cursor()
    cursor.execute(query, (cur_hour, ))
    rows = cursor.fetchall()

    busyness_data = []
    for row in rows:
        zone_id = row[0]
        cur_hour = row[1]
        predicted_busyness = row[2]

        busyness_data.append({
            'zone_id': zone_id,
            'cur_hour': cur_hour,
            'predicted_busyness': predicted_busyness,
        })

    cursor.close()

    return jsonify(busyness_data)

#ROUTE4: get the predicted busyness for specific zones (specific hour)
@app.route('/busyness/<int:zone_id>/<int:cur_hour>', methods=['GET'])
def predict(cur_hour, zone_id):
    # Get the weather forecast data from the database
    query = f"SELECT * FROM predicted_busyness where cur_hour = %s AND zoneid = %s"
    cursor = conn.cursor()
    cursor.execute(query, (cur_hour, zone_id,))
    rows = cursor.fetchall()

    busyness_data = []
    for row in rows:
        zone_id = row[0]
        cur_hour = row[1]
        predicted_busyness = row[2]

        busyness_data.append({
            'zone_id': zone_id,
            'cur_hour': cur_hour,
            'predicted_busyness': predicted_busyness,
        })

    cursor.close()

    return jsonify(busyness_data)

#ROUTE5: get the change in busyness for whole day specific zone
@app.route('/busyness/change/zone/<int:zone_id>', methods=['GET'])
def get_zones_busyness(zone_id):
    # Get the weather forecast data from the database
    query = f"SELECT * FROM predicted_busyness where zoneid = %s"
    cursor = conn.cursor()
    cursor.execute(query, (zone_id,))
    rows = cursor.fetchall()

    busyness_data = []
    for row in rows:
        zone_id = row[0]
        cur_hour = row[1]
        predicted_busyness = row[2]

        busyness_data.append({
            'zone_id': zone_id,
            'cur_hour': cur_hour,
            'predicted_busyness': predicted_busyness,
        })

    cursor.close()

    return jsonify(busyness_data)

#ROUTE6: get current busyness of all streets (current hour)
@app.route('/busyness/streets', methods=['GET'])
def get_streets_now():
    # Get the current hour as an integer
    cur_hour = datetime.now().hour

    # Get the weather forecast data from the database
    query = "SELECT * FROM street_predicted_busyness where cur_hour = %s"
    cursor = conn.cursor()
    cursor.execute(query, (cur_hour,))
    rows = cursor.fetchall()

    busyness_data = []
    for row in rows:
        street_id = row[0]
        street_predicted_busyness = row[2]

        busyness_data.append({
            'street_id': street_id,
            'street_busyness': street_predicted_busyness,
        })

    cursor.close()

    return jsonify(busyness_data)

#ROUTE7: get current busyness of all streets in a specific zone
@app.route('/busyness/zone/<int:zone_id>/streets', methods=['GET'])
def get_streets_in_zone(zone_id):
    # Get the current hour as an integer
    cur_hour = datetime.now().hour

    # Get the weather forecast data from the database
    query = """SELECT spb.*
                FROM street_predicted_busyness AS spb
                JOIN _updated_streets AS us ON spb.street_id = us.street_id
                JOIN zones AS z ON us.zone_id = z.zoneid
                WHERE spb.cur_hour = %s AND z.zoneid = %s;"""
    cursor = conn.cursor()
    cursor.execute(query, (cur_hour, zone_id, ))
    rows = cursor.fetchall()

    busyness_data = []
    for row in rows:
        street_id = row[0]
        cur_hour = row[1]
        street_predicted_busyness = row[2]

        busyness_data.append({
            'street_id': street_id,
            'hour' : cur_hour,
            'street_busyness': street_predicted_busyness,
        })

    cursor.close()

    return jsonify(busyness_data)

#ROUTE8: forecasted busyness of all streets (specific hour)
@app.route('/busyness/streets/<int: cur_hour>', methods=['GET'])
def foreast_busyness_streets(cur_hour):

    # Get the weather forecast data from the database
    query = "SELECT * FROM street_predicted_busyness where cur_hour = %s"
    cursor = conn.cursor()
    cursor.execute(query, (cur_hour,))
    rows = cursor.fetchall()

    busyness_data = []
    for row in rows:
        street_id = row[0]
        cur_hour = row[1]
        street_predicted_busyness = row[2]

        busyness_data.append({
            'street_id': street_id,
            'hour' : cur_hour,
            'street_busyness': street_predicted_busyness,
        })

    cursor.close()

    return jsonify(busyness_data)

if __name__ == '__main__':
    app.debug = True

    app.run()

# longitude, latitude = 40.7128° N, -74.0060° W