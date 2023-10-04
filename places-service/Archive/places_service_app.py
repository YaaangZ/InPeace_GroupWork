from flask import Flask, jsonify, request
import psycopg2
from psycopg2 import IntegrityError
from datetime import datetime
from functions import User, get_user_by_id, Place, get_place_by_id, Rating, get_rating_by_user_and_place
import json

app = Flask(__name__)

db_host = "inpeace-db.cn1hlpnikmwo.eu-west-1.rds.amazonaws.com"
db_name = "postgres"
db_user = "postgres"
db_password = "postgres"

conn = psycopg2.connect(
    host=db_host,
    dbname=db_name,
    user=db_user,
    password=db_password
)

########  RATINGS  ########
# ROUTE1: post / update rating
@app.route('/places/rating/post_rating/<int:user_id>/<string:place_id>', methods=['POST'])
def add_rating(user_id, place_id):
    data = request.get_json()

    rating_value = data.get('rating_value')

    # Check if the user exists
    user = get_user_by_id(user_id)
    if not user:
        return jsonify({'error': 'User does not exist.'}), 404

    # Check if the place exists
    place = get_place_by_id(place_id)
    if not place:
        return jsonify({'error': 'Place does not exist.'}), 404

    # Create a new rating
    date_created = datetime.utcnow()
    date_updated = datetime.utcnow()

    insert_rating_query = """
        INSERT INTO ratings (user_id, place_id, rating_value, date_created, date_updated)
        VALUES (%s, %s, %s, %s, %s)
    """

    try:
        cursor = conn.cursor()
        cursor.execute(insert_rating_query, (user_id, place_id, rating_value, date_created, date_updated))
        conn.commit()
    except IntegrityError:
        # Rating with the same user_id and place_id already exists, treat it as an update
        return update_rating(user_id, place_id, rating_value)

    return jsonify({'rating': 'Rating added successfully.'})

# ROUTE1.5: update rating if rating exists
@app.route('/places/rating/post_rating/<int:user_id>/<string:place_id>', methods=['PUT'])
def update_rating(user_id, place_id):
    data = request.get_json()

    rating_value = data.get('rating_value')

    # Check if the rating exists
    rating = get_rating_by_user_and_place(user_id, place_id)
    if not rating:
        return jsonify({'error': 'Rating does not exist.'}), 404

    # Update the rating value and update the date_updated
    date_updated = datetime.utcnow()

    update_rating_query = """
        UPDATE ratings SET rating_value = %s, date_updated = %s WHERE user_id = %s AND place_id = %s
    """

    cursor = conn.cursor()
    cursor.execute(update_rating_query, (rating_value, date_updated, user_id, place_id))
    conn.commit()

    return jsonify({'message': 'Rating updated successfully.'})

# ROUTE2: get user rating
@app.route('/places/rating/get_rating/<int:user_id>/<string:place_id>', methods=['GET'])
def get_user_rating(user_id, place_id):
    rating = get_rating_by_user_and_place(user_id, place_id)

    if rating:
        return jsonify(rating)
    else:
        return jsonify({'error': 'Rating not found.'}), 404

# ROUTE3: get average rating of a place
@app.route('/places/rating/average_rating/<string:place_id>')
def get_average_rating(place_id):
    # Query the database to calculate the average rating
    query = """
        SELECT AVG(rating_value) AS average_rating
        FROM ratings
        WHERE place_id = %s
        GROUP BY place_id
    """
    cursor = conn.cursor()
    cursor.execute(query, (place_id,))
    result = cursor.fetchone()
    cursor.close()

    average_rating = result[0] if result and result[0] is not None else 'N/A'

    return jsonify({'average_rating': average_rating})

# ----------------------------------------------------------------------------------------------------------------------
# ########  PLACES  ########

# ROUTE4: search places based on coordinate (longitude and latitude)
@app.route('/places/search_places', methods=['GET'])
def search_places():
    try:
        longitude = request.args.get('longitude')
        latitude = request.args.get('latitude')

        if not longitude or not latitude:
            return jsonify({'error': 'Missing longitude or latitude parameter'}), 400
        
        radius = int(request.args.get('radius', 250))
        category = str(request.args.get('category', '%'))

        cur = conn.cursor()

        query = f"SELECT place_id, place_name, image, " \
                f"REPLACE(REPLACE(TRIM(BOTH '[]' FROM address), '''', ''), ', ', ', ') AS full_address, " \
                f"ST_X(location), ST_Y(location), zone_id, category_id " \
                f"FROM places "\
                f"INNER JOIN categories ON category_id = categoryid " \
                f"WHERE ST_Distance(location, ST_SetSRID(ST_MakePoint({longitude}, {latitude}), 4326)) <= {radius} "\
                f"AND categoryname LIKE '{category}';"
        cur.execute(query)

        # Fetch the results
        results = cur.fetchall()

        places = []
        for result in results:
            place_id, place_name, image, address, place_longitude, place_latitude, zone_id, category_id = result

            cur.execute(
                f"SELECT day_0, day_1, day_2, day_3, day_4, day_5, day_6 FROM places_opening_closing WHERE place_id = '{place_id}';")
            opening_closing_hours = cur.fetchone()

            if opening_closing_hours:
                days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
                opening_closing_dict = {}
                for i, hours in enumerate(opening_closing_hours):
                    day = days[i]
                    if hours:
                        opening_closing_dict[day] = hours
                    else:
                        opening_closing_dict[day] = "Closed"

                # Sort the days from Monday to Sunday
                sorted_opening_closing = {day: opening_closing_dict[day] for day in days}
            else:
                sorted_opening_closing = "no opening/closing data available"

            place = {
                'place_id': place_id,
                'name': place_name,
                'image': image,
                'address': address,
                'zone_id': zone_id,
                'category': category_id,
                'longitude': place_longitude,
                'latitude': place_latitude,
                'opening_closing_hours': sorted_opening_closing
            }
            places.append(place)

        response = {'places': places}

        response_json = json.dumps(response, indent=2, sort_keys=True)

        return response_json

    except ValueError as e:
        return jsonify({'error': 'Invalid longitude or latitude parameter'}), 400

# ROUTE5: get place based on place_id [DONE WITH OPENING AND CLOSING HOURS]
@app.route('/places/get_place/<string:place_id>', methods=['GET'])
def get_place(place_id):
    # Create a cursor to interact with the database
    cur = conn.cursor()

    # Execute the query to search for nearby places within the specified radius
    query = f"SELECT place_id, place_name, image, " \
            f"REPLACE(REPLACE(TRIM(BOTH '[]' FROM address), '''', ''), ', ', ', ') AS full_address, " \
            f"ST_X(location), ST_Y(location), zone_id, category_id " \
            f"FROM places " \
            f"INNER JOIN categories ON category_id = categoryid " \
            f"WHERE place_id =  '{place_id}';"
    cur.execute(query)

    # Fetch the results
    results = cur.fetchall()

    places = []
    for result in results:
        place_id, place_name, image, address, place_longitude, place_latitude, zone_id, category_id = result

        # Get the opening and closing hours from the places_opening_closing table
        cur.execute(
            f"SELECT day_0, day_1, day_2, day_3, day_4, day_5, day_6 FROM places_opening_closing WHERE place_id = '{place_id}';")
        opening_closing_hours = cur.fetchone()

        if opening_closing_hours:  # Check if opening_closing_hours is not None
            # Convert the opening and closing hours to a dictionary and handle null values
            days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
            opening_closing_dict = {}
            for i, hours in enumerate(opening_closing_hours):
                day = days[i]
                if hours:
                    opening_closing_dict[day] = hours
                else:
                    opening_closing_dict[day] = "Closed"

            # Sort the days from Monday to Sunday
            sorted_opening_closing = {day: opening_closing_dict[day] for day in days}
        else:
            sorted_opening_closing = "no opening/closing data available"

        place = {
            'place_id': place_id,
            'name': place_name,
            'image': image,
            'address': address,
            'zone_id': zone_id,
            'category': category_id,
            'longitude': place_longitude,
            'latitude': place_latitude,
            'opening_closing_hours': sorted_opening_closing
        }
        places.append(place)

    # Create the response JSON
    response = {'places': places}

    # Convert to JSON and sort keys to have 'places' as the first key
    response_json = json.dumps(response, indent=2, sort_keys=True)

    return response_json

# ROUTE6: search all places in a specific zone
@app.route('/places/places_zone/<string:zone_id>', methods=['GET'])
def get_place_in_zones(zone_id):
    # Create a cursor to interact with the database
    cur = conn.cursor()

    # Execute the query to search for nearby places within the specified radius
    query = f"SELECT place_id, place_name, image, " \
            f"REPLACE(REPLACE(TRIM(BOTH '[]' FROM address), '''', ''), ', ', ', ') AS full_address, " \
            f"ST_X(location), ST_Y(location), zone_id, category_id " \
            f"FROM places " \
            f"INNER JOIN categories ON category_id = categoryid " \
            f"WHERE zone_id =  '{zone_id}';"
    cur.execute(query)

    # Fetch the results
    results = cur.fetchall()

    places = []
    for result in results:
        place_id, place_name, image, address, place_longitude, place_latitude, zone_id, category_id = result

        # Get the opening and closing hours from the places_opening_closing table
        cur.execute(
            f"SELECT day_0, day_1, day_2, day_3, day_4, day_5, day_6 FROM places_opening_closing WHERE place_id = '{place_id}';")
        opening_closing_hours = cur.fetchone()

        if opening_closing_hours:  # Check if opening_closing_hours is not None
            # Convert the opening and closing hours to a dictionary and handle null values
            days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
            opening_closing_dict = {}
            for i, hours in enumerate(opening_closing_hours):
                day = days[i]
                if hours:
                    opening_closing_dict[day] = hours
                else:
                    opening_closing_dict[day] = "Closed"

            # Sort the days from Monday to Sunday
            sorted_opening_closing = {day: opening_closing_dict[day] for day in days}
        else:
            sorted_opening_closing = "no opening/closing data available"

        place = {
            'place_id': place_id,
            'name': place_name,
            'image': image,
            'address': address,
            'zone_id': zone_id,
            'category': category_id,
            'longitude': place_longitude,
            'latitude': place_latitude,
            'opening_closing_hours': sorted_opening_closing
        }
        places.append(place)

    # Create the response JSON
    response = {'places': places}

    # Convert to JSON and sort keys to have 'places' as the first key
    response_json = json.dumps(response, indent=2, sort_keys=True)

    return response_json


# Run the Flask application
if __name__ == "__main__":
    app.run(host='0.0.0.0', port=80)

# postman test parameters
# i. places
# latitude: 40.764266
# longitude: -73.971656
# radius:  250
# category: % for all