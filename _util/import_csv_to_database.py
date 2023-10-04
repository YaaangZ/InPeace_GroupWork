import json
import csv
from shapely.geometry import shape, MultiLineString, LineString
from shapely.wkt import loads
import geopandas as gpd
from sqlalchemy import create_engine, Table, MetaData, String, Column, Text
from sqlalchemy.orm import sessionmaker
from geoalchemy2 import Geometry, WKTElement
from tqdm import tqdm

def geojsonToDatabase():
    print("Connecting to postgresql server")
    engine = create_engine('postgresql://postgres:postgres@localhost:5432/ec2-backup')
    Session = sessionmaker(bind=engine)
    session = Session()
    print("Connected to to postgresql server")

    metadata = MetaData()

    table = Table('streets_csv', metadata, autoload_with=engine)


    print("reading geojson file")

    with open('streets_csv\\NYC Street Centerline (CSCL).geojson', 'r') as f:
        data = json.load(f)

        print("Starting to iterate through geojson")
        total_features = len(data['features'])

        # Iterate over features with tqdm progress bar
        for feature in tqdm(data['features'], total=total_features):

            if feature['properties']['borocode'] == '1' and feature['properties']['status'] == '2':
                            
                if 'geometry' in feature and feature['geometry'] is not None:

                    
                    geom = shape(feature['geometry'])
                    street_name = feature['properties']['full_stree']
                    if not isinstance(geom, MultiLineString):
                        geom = MultiLineString([geom])

                    wkt_element = WKTElement(geom.wkt, srid=4326)  # SRID for Latitude and Longitude

                    # Insert data into database
                    insert_stmt = table.insert().values(
                        street_name=street_name, 
                        geometry=wkt_element
                    )
                else:
                    # If no geometry, just insert properties
                    
                    insert_stmt = table.insert().values(
                        street_name=street_name 
                    )

                try:
                    session.execute(insert_stmt)
                    session.commit()
                except Exception as e:
                    print(f"Error occurred: {e}")


def csvToDatabase():
    print("Connecting to postgresql server")
    engine = create_engine('postgresql://postgres:postgres@localhost:5432/ec2-backup')
    Session = sessionmaker(bind=engine)
    session = Session()
    
    print("Connected to postgresql server")

    metadata = MetaData()

    # Define your table
    table = Table('streets_csv', metadata, autoload_with=engine)

    with open('streets_csv\streets_info2.csv', 'r') as file:
        csv_reader = csv.reader(file)

        next(csv_reader)

        for row in tqdm(csv_reader, total=13826):
            
            print(row[0])
            geom = loads(row[0])
            if not isinstance(geom, MultiLineString):
                geom = MultiLineString([geom])
            
            wkt_element = WKTElement(geom.wkt, srid=4326)

            insert_stmt = table.insert().values(
                street_name=row[4],
                status=row[2],
                geometry=wkt_element
            )
            
            try:
                print("inserting...")
                session.execute(insert_stmt)
                session.commit()
            except Exception as e:
                print(f"Error occurred: {e}")

geojsonToDatabase()