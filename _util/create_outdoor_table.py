import psycopg2
import csv
import pandas as pd

def create_connection():
    conn = None
    try:
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
    
conn = create_connection()

cursor = conn.cursor()

df = pd.read_csv('_util/places_csv_tables/outdoor_businesses.csv')

cursor.execute("CREATE TEMP TABLE temp_outdoor_table (place_id VARCHAR, place_name TEXT)")

for row in df.itertuples(index=False):
    cursor.execute("INSERT INTO temp_outdoor_table (place_id, place_name) VALUES (%s, %s)", row)

cursor.execute("CREATE TABLE places_outdoor_seating (place_id VARCHAR, place_name TEXT, outdoor INTEGER)")

cursor.execute("""
    INSERT INTO places_outdoor_seating (place_id, place_name, outdoor)
    SELECT p.place_id, p.place_name, CASE WHEN o.place_id IS NOT NULL THEN 1 ELSE 0 END AS outdoor
    FROM places p
    LEFT JOIN temp_outdoor_table o ON p.place_id = o.place_id
""")

cursor.execute("DROP TABLE IF EXISTS temp_outdoor_table")

conn.commit()
cursor.close()
conn.close()