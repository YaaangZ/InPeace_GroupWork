import time
import psycopg2
from datetime import datetime
import pandas as pd
from oldfx import load_model, make_prediction, is_holiday, get_weather_data

db_config = {
    'host': '35.195.72.126',
    'port': '5432',
    'database': 'postgres',
    'user': 'postgres',
    'password': 'postgres'
}
zones_query = "SELECT zoneid, zonename, geometry FROM zones"
def make_predictions():
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

                    # Make prediction using the loaded model (replace with your prediction logic)
                    prediction = loaded_model.predict(data_df)
                    prediction = prediction.tolist()  # Convert ndarray to list

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

                for pickup_hour in range(24):
                    zone_data = {
                        'zoneid': zoneid,
                        'cur_hour': pickup_hour,
                        'predicted_busyness': None
                    }
                    zones_data.append(zone_data)

        cursor.close()

        # Store predictions in the PostgreSQL database
        store_predictions(zones_data)

    except (psycopg2.Error, Exception) as e:
        # Handle any errors that occur during the process
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

if __name__ == '__main__':
    model_filename = 'old_model.pkl'
    loaded_model = load_model(model_filename)

    # Run the prediction and storage every 5 hours
    while True:
        make_predictions()
        print("Prediction and storage complete. Waiting for 5 hours...")
        time.sleep(5 * 60 * 60)  # Sleep for 5 hours (in seconds)