import time
import psycopg2
from datetime import datetime
import pandas as pd
from functions import load_model, make_prediction, is_holiday, get_weather_data

db_config = {
    'host': 'inpeace-db.cn1hlpnikmwo.eu-west-1.rds.amazonaws.com',
    'port': '5432',
    'database': 'postgres',
    'user': 'postgres',
    'password': 'postgres'
}
zones_query = "SELECT zoneid FROM zones"
def make_predictions_two():
    conn = None
    try:
        conn = psycopg2.connect(**db_config)
        cursor = conn.cursor()
        cursor.execute(zones_query)
        rows = cursor.fetchall()

        weather_data = get_weather_data(40.7128, -74.0060)

        if weather_data is not None:
            zones_data = []
            for row in rows:
                zoneid = row[0]
                zonename = row[1]
                geometry = row[2]

                current_datetime = datetime.now()
                pickup_month = current_datetime.month
                pickup_day = current_datetime.day
                day_of_week = current_datetime.weekday()

                for pickup_hour in range(24):
                    pickup_date = datetime(
                        year=current_datetime.year,
                        month=pickup_month,
                        day=pickup_day,
                        hour=pickup_hour
                    )
                    is_current_date_holiday = is_holiday(pickup_date)

                    app_temp, precip, pres, rh, snow, uv, vis, wind_spd = weather_data[pickup_hour]

                    data = [[
                        pickup_month, pickup_day, pickup_hour, day_of_week, is_current_date_holiday,
                        zoneid, app_temp, precip, pres, rh, snow, uv, vis, wind_spd
                    ]]

                    data_columns = [
                        'pickup_month', 'pickup_day', 'pickup_hour', 'day_of_week', 'is_holiday',
                        'PULocationID', 'app_temp', 'precip', 'pres', 'rh', 'snow', 'uv', 'vis', 'wind_spd'
                    ]

                    data_df = pd.DataFrame(data, columns=data_columns)

                    prediction = loaded_model.predict(data_df)
                    prediction = prediction.tolist()

                    zone_data = {
                        'zoneid': zoneid,
                        'zonename': zonename,
                        'geometry': geometry,
                        'cur_hour': pickup_hour,
                        'predicted_busyness': prediction
                    }
                    zones_data.append(zone_data)
        else:
            zones_data = []
            for row in rows:
                zoneid = row[0]
                zonename = row[1]
                geometry = row[2]

                for pickup_hour in range(24):
                    zone_data = {
                        'zoneid': zoneid,
                        'zonename': zonename,
                        'geometry': geometry,
                        'cur_hour': pickup_hour,
                        'predicted_busyness': None
                    }
                    zones_data.append(zone_data)

        cursor.close()

        store_predictions(zones_data)

    except (psycopg2.Error, Exception) as e:
        print(f"Error: {e}")

    finally:
        if conn is not None:
            conn.close()

def make_predictions():

    conn = None
    try:
        conn = psycopg2.connect(**db_config)
        cursor = conn.cursor()
        cursor.execute(zones_query)
        rows = cursor.fetchall()


        weather_data = get_weather_data(40.7128, -74.0060)

        if weather_data is not None:
            zones_data = [] #this will give us all the zone data from the sql query
            for row in rows:
                zoneid = row[0]

                current_datetime = datetime.now()
                pickup_month = current_datetime.month
                pickup_day = current_datetime.day
                day_of_week = current_datetime.weekday()

                for pickup_hour in range(24):
                    pickup_date = datetime(
                        year=current_datetime.year,
                        month=pickup_month,
                        day=pickup_day,
                        hour=pickup_hour
                    )
                    is_current_date_holiday = is_holiday(pickup_date)

                    temp = int(weather_data[pickup_hour]['temp'])
                    visibility = int(weather_data[pickup_hour]['visibility'])
                    wind_speed = int(weather_data[pickup_hour]['wind_speed'])
                    humidity = int(weather_data[pickup_hour]['humidity'])
                    cloudy = int(weather_data[pickup_hour]['cloudy'])
                    rain = int(weather_data[pickup_hour]['rain'])
                    snow = int(weather_data[pickup_hour]['snow'])
                    sunny = int(weather_data[pickup_hour]['sunny'])

                    data = [[
                        zoneid, visibility, wind_speed, humidity, temp, day_of_week, pickup_hour, pickup_month,
                        is_current_date_holiday, cloudy, rain, snow, sunny
                    ]]

                    data_columns = [
                        "location_id", "visibility", "wind_speed", "humidity", "temp", "day_of_week", "hour_of_day",
                        "month", "is_holiday", "cloudy", "rain", "snow", "sunny"
                    ]

                    data_df = pd.DataFrame(data, columns=data_columns)

                    prediction = loaded_model.predict(data_df)
                    prediction = prediction.tolist()

                    zone_data = {
                        'zoneid': zoneid,
                        'cur_hour': pickup_hour,
                        'predicted_busyness': prediction
                    }
                    print(zone_data)
                    zones_data.append(zone_data)

        else:
            zones_data = []
            for row in rows:
                zoneid = row[0]

                for pickup_hour in range(24):
                    zone_data = {
                        'zoneid': zoneid,
                        'cur_hour': pickup_hour,
                        'predicted_busyness': None
                    }
                    zones_data.append(zone_data)

        cursor.close()

        store_predictions(zones_data)

    except (psycopg2.Error, Exception) as e:
        print(f"Error: {e}")

    finally:
        if conn is not None:
            conn.close()
def store_predictions(zones_data):
    conn = None
    try:
        conn = psycopg2.connect(**db_config)
        cursor = conn.cursor()

        for zone_data in zones_data:
            zoneid = zone_data['zoneid']
            cur_hour = zone_data['cur_hour']
            prediction = zone_data['predicted_busyness']

            # Convert the prediction list to a single value
            prediction_value = prediction[0] if prediction else None

            # Insert or update the prediction in the "predicted_busyness" table
            insert_query = """
                            INSERT INTO predicted_busyness (zoneid, cur_hour, predicted_busyness)
                            VALUES (%s, %s, %s)
                            ON CONFLICT (zoneid, cur_hour)
                            DO UPDATE SET predicted_busyness = EXCLUDED.predicted_busyness
                        """
            cursor.execute(insert_query, (zoneid, cur_hour, prediction_value))

        conn.commit()
        cursor.close()

    except (psycopg2.Error, Exception) as e:
        # Handle any errors that occur during the process
        print(f"Error: {e}")

    finally:
        if conn is not None:
            conn.close()

def update_predicted_busyness():
    conn = psycopg2.connect(**db_config)
    cursor = conn.cursor()

    try:
        # Query to update the predicted busyness
        update_query = """
                UPDATE street_predicted_busyness AS spb
                SET street_predicted_busyness = us.normalized_score * (us.intersection_length / us.total_zone_length) * pb.predicted_busyness
                FROM _updated_streets AS us
                JOIN predicted_busyness AS pb ON us.zone_id = pb.zoneid
                WHERE spb.street_id = us.street_id;
            """

        # Execute the update query
        cursor.execute(update_query)

        # Commit the changes to the database
        conn.commit()

        print("Predicted busyness updated successfully!")

    except (Exception, psycopg2.Error) as error:
        print(f"Error updating predicted busyness: {error}")

    finally:
        # Close the database cursor and connection
        if cursor:
            cursor.close()
        if conn:
            conn.close()


if __name__ == '__main__':
    model_filename = 'zonePredictionModel5.pkl'
    loaded_model = load_model(model_filename)
    make_predictions()
    update_predicted_busyness()

    # every 5 hours
    while True:
        make_predictions()
        update_predicted_busyness()
        print("Prediction and storage complete. Waiting for next hours...")

        time.sleep(60 * 60)  # Sleep for 1hr
