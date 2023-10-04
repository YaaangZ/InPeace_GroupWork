import csv
import psycopg2
from psycopg2 import OperationalError
from psycopg2 import sql
import ast

# Function to establish a connection to the PostgreSQL database
def create_connection():
    conn = None
    try:
        # Replace the placeholders with your actual connection details
        conn = psycopg2.connect(
            host="inpeace-db.cn1hlpnikmwo.eu-west-1.rds.amazonaws.com",
            port="5432",
            database="postgres",
            user="postgres",
            password="postgres"
        )
        print("Connection to PostgreSQL successful")
        return conn
    
    except OperationalError as e:
        print(f"The error '{e}' occurred while connecting to PostgreSQL")
        return None
    
# Create a connection
conn = create_connection()

# Create a cursor object
cursor = conn.cursor()

# 1. zones table
# # Open the CSV file
# with open('manhattan_taxi_zone.csv', 'r') as file:
#     # Create a CSV reader object
#     csv_reader = csv.reader(file)
    
#     # Skip the header row if needed
#     next(csv_reader)
    
#     # Iterate over each row in the CSV file
#     for row in csv_reader:
#         zone_id = int(row[2])  # zone id
#         zone_name = row[5]  # zone name
#         polygon = row[7]  # Assuming polygon is in the third column of the CSV
        
#         # Define the INSERT statement and data
#         insert_query = sql.SQL("INSERT INTO zones (zone_id, zone_name, polygon) VALUES (%s, %s, ST_GeomFromText(%s))")
#         data = (zone_id, zone_name, polygon)
        
#         # Execute the SQL statement
#         cursor.execute(insert_query, data)

# 2. places table (for restaurants, cafe and parks csv files)
# Open the CSV file
# with open('places_csv_tables/cafes_in_manhattan.csv', 'r') as file:
#     # Create a CSV reader object
#     csv_reader = csv.reader(file)
#
#     # Skip the header row if needed
#     next(csv_reader)
#
#     # Iterate over each row in the CSV file
#     for row in csv_reader:
#         place_id = row[0]  # zone id
#         place_name = row[2]
#         image = row[3]  # zone name
#         rating = row[8]
#         longitude = row[15] #park and restaurant/cafe dif
#         latitude = row[14]
#         temp_address = row[23]
#         address = ''.join(temp_address)
#         category = "cafe"
#         location = row[24]
#         point = f"POINT({longitude} {latitude})"
#
#         # Check if the place ID already exists in the database
#         check_query = sql.SQL("SELECT COUNT(*) FROM places WHERE place_id = %s")
#         cursor.execute(check_query, (place_id,))
#         count = cursor.fetchone()[0]
#
#         if count == 0:
#             # Execute a SQL query to find the zone_id based on the point's location
#             query = f"SELECT zone_id FROM zones WHERE ST_Contains(polygon, ST_SetSRID(ST_GeomFromText('{point}'), 4326))"
#             cursor.execute(query)
#             result = cursor.fetchone()
#             zone_id = result[0] if result else None
#
#             # Define the INSERT statement and data
#             insert_query = sql.SQL("INSERT INTO places (place_id, place_name, image, rating, address, location, zone_id, category) VALUES (%s, %s, %s, %s, %s, ST_SetSRID(ST_MakePoint(%s, %s), 4326), %s, %s)")
#             data = (place_id, place_name, image, rating, address, longitude, latitude, zone_id, category)
#
#             # Execute the SQL statement
#             cursor.execute(insert_query, data)
#         else:
#             print(f"Skipping duplicate place ID: {place_id}")

# 3. street table
# with open('places_csv_tables/staticStreetData.csv', 'r') as file:
#     # Create a CSV reader object
#     csv_reader = csv.reader(file)

#     # Skip the header row if needed
#     next(csv_reader)

#     # Iterate over each row in the CSV file
#     for row in csv_reader:
#         street_id = row[0]
#         street_name = row[1]
#         location_zone = row[2]
#         business_counts = row[3]
#         park_counts = row[4]
#         street_zone = row[5]
#         street_zone_id = row[6]

#         # Define the INSERT statement and data
#         insert_query = sql.SQL("INSERT INTO streets (street_id, street_name, location_zone, business_count, park_count, street_zone, street_zone_id) VALUES (%s, %s, %s, %s, %s, %s, %s)")
#         data = (street_id, street_name, location_zone, business_counts, park_counts, street_zone, street_zone_id)

#         # Execute the SQL statement
#         cursor.execute(insert_query, data)

# updated street table
# Read the CSV file and insert the data into the database
with open('_util/places_csv_tables/streetInfoInDetails.csv', 'r') as file:
    csv_reader = csv.reader(file)
    next(csv_reader)  # Skip the header row if needed

    # Iterate over each row in the CSV file
    for row in csv_reader:
        street_id = int(row[0])
        street_name = row[1]
        zone_id = int(row[2])
        intersection_length = float(row[3])
        original_length = float(row[4])
        percentage = float(row[5])
        geometry = row[6]
        business_counts = int(row[7])
        park_counts = int(row[8])
        street_count = int(row[9])
        total_businesses_in_zone = int(row[10])
        total_parks_in_zone = int(row[11])
        raw_score = float(row[12])
        normalized_score = float(row[13])
        total_zone_length = float(row[14])
        street_zone = row[15]
        street_zone_id = int(row[16])

# Handle NULL or empty geometry values
        if not geometry or geometry.strip().lower() == 'null':
            geometry = None
        else:
            try:
                # Check if the geometry value is a valid MULTILINESTRING format
                cursor.execute(sql.SQL("SELECT ST_Multi(ST_GeomFromText(%s, 4326))"), [geometry])
                result = cursor.fetchone()
                geometry = result[0]
            except psycopg2.Error as e:
                print(f"Error occurred for row: {row}")
                print(e)
                continue

        # Define the INSERT statement and data
        insert_query = sql.SQL("INSERT INTO _updated_streets (street_id, street_name, zone_id, intersection_length, original_length, percentage, geometry, business_counts, park_counts, street_count, total_businesses_in_zone, total_parks_in_zone, raw_score, normalized_score, total_zone_length, street_zone, street_zone_id) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)")
        data = (street_id, street_name, zone_id, intersection_length, original_length, percentage, geometry, business_counts, park_counts, street_count, total_businesses_in_zone, total_parks_in_zone, raw_score, normalized_score, total_zone_length, street_zone, street_zone_id)

        try:
            # Execute the INSERT statement
            cursor.execute(insert_query, data)
            conn.commit()
        except psycopg2.Error as e:
            print(f"Error occurred for row: {row}")
            print(e)


# Commit the changes to the database
conn.commit()

# Close the cursor and database connection
cursor.close()
conn.close()