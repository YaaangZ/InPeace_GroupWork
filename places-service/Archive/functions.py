import psycopg2
from psycopg2 import IntegrityError
from datetime import datetime

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

class User:
    def __init__(self, id, name, email):
        self.id = id
        self.name = name
        self.email = email

def get_user_by_id(user_id):
    # Return the User object or None if not found

    select_user_query = "SELECT userid, username, emailaddress FROM users WHERE userid = %s"

    cursor = conn.cursor()
    cursor.execute(select_user_query, (user_id,))
    user_data = cursor.fetchone()

    if user_data:
        userid, username, emailaddress = user_data
        user = User(id=userid, name=username, email=emailaddress)
        return user

    return None

class Place:
    def __init__(self, id, name):
        self.id = id
        self.name = name

def get_place_by_id(place_id):
    # Return the Place object or None if not found

    select_place_query = "SELECT place_id, place_name FROM places WHERE place_id = %s"

    cursor = conn.cursor()
    cursor.execute(select_place_query, (place_id,))
    place_data = cursor.fetchone()

    if place_data:
        place_id, place_name = place_data
        place = Place(id=place_id, name=place_name)
        return place

    return None

class Rating:
    def __init__(self, rating_id, user_id, place_id, rating_value, date_created, date_updated):
        self.rating_id = rating_id
        self.user_id = user_id
        self.place_id = place_id
        self.rating_value = rating_value
        self.date_created = date_created
        self.date_updated = date_updated

def get_rating_by_user_and_place(user_id, place_id):
    select_rating_query = """
        SELECT rating_value, date_created, date_updated
        FROM ratings
        WHERE user_id = %s AND place_id = %s
    """

    cursor = conn.cursor()
    cursor.execute(select_rating_query, (user_id, place_id))
    rating = cursor.fetchone()

    if rating:
        rating_value, date_created, date_updated = rating
        return {
            'user_id': user_id,
            'place_id': place_id,
            'rating_value': rating_value,
            'date_created': date_created,
            'date_updated': date_updated
        }
    else:
        return None