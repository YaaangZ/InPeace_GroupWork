import pandas as pd
import psycopg2
import json

data = pd.read_csv('places_csv_tables/cafe_opening.csv')

conn = psycopg2.connect(
    host="inpeace-db.cn1hlpnikmwo.eu-west-1.rds.amazonaws.com",
    database="postgres",
    user="postgres",
    password="postgres",
    port="5432",
)
cursor = conn.cursor()

cursor.execute('''
    CREATE TABLE IF NOT EXISTS places_opening_closing (
        place_id TEXT PRIMARY KEY,
        day_0 TEXT,
        day_1 TEXT,
        day_2 TEXT,
        day_3 TEXT,
        day_4 TEXT,
        day_5 TEXT,
        day_6 TEXT
    )
''')

for index, row in data.iterrows():
    place_id = row['id']
    all_days_json = row['all_days']


    if isinstance(all_days_json, float) or all_days_json is None:
        all_days = {} 
    else:
        try:
            all_days = json.loads(all_days_json)
        except json.JSONDecodeError:
            all_days = {}

    # Extract the opening and closing times for each day
    opening_closing_times = {}
    for day, times in all_days.items():
        opening_closing_times[f'day_{day}'] = times if times else None

    cursor.execute('''
            INSERT INTO places_opening_closing (place_id, day_0, day_1, day_2, day_3, day_4, day_5, day_6)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
            ON CONFLICT (place_id) DO UPDATE
            SET
                day_0 = EXCLUDED.day_0,
                day_1 = EXCLUDED.day_1,
                day_2 = EXCLUDED.day_2,
                day_3 = EXCLUDED.day_3,
                day_4 = EXCLUDED.day_4,
                day_5 = EXCLUDED.day_5,
                day_6 = EXCLUDED.day_6
        ''', (place_id, opening_closing_times.get('day_0'), opening_closing_times.get('day_1'),
              opening_closing_times.get('day_2'), opening_closing_times.get('day_3'),
              opening_closing_times.get('day_4'), opening_closing_times.get('day_5'),
              opening_closing_times.get('day_6')))

conn.commit()
conn.close()