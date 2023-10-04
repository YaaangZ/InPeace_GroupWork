import requests
import pickle
from datetime import datetime

def load_model(filename):
    with open(filename, 'rb') as file:
        model = pickle.load(file)

    return model

def is_holiday(date):
    # API endpoint for the Holiday API
    endpoint = "https://date.nager.at/Api/v2/IsPublicHoliday/{year}-{month}-{day}"

    year = date.year
    month = date.month
    day = date.day

    # Make the API request
    response = requests.get(endpoint.format(year=year, month=month, day=day))

    # Check if the response indicates a holiday
    if response.status_code == 200 and response.json() is True:
        return 1  # It's a holiday
    else:
        return 0  # It's not a holiday


def get_weather_data(latitude, longitude):
    endpoint = "https://api.open-meteo.com/v1/forecast?latitude={latitude}&longitude={longitude}&hourly=relativehumidity_2m,apparent_temperature,precipitation,snowfall,surface_pressure,visibility,windspeed_10m,uv_index"

    response = requests.get(endpoint.format(latitude=latitude, longitude=longitude))

    if response.status_code == 200:
        data = response.json()
        forecast = data['hourly']

        weather_data = []
        for hour in range(24):
            app_temp = forecast['apparent_temperature'][hour]
            precip = forecast['precipitation'][hour]
            pres = forecast['surface_pressure'][hour]
            rh = forecast['relativehumidity_2m'][hour]
            snow = forecast['snowfall'][hour]
            uv = forecast['uv_index'][hour]
            vis = forecast['visibility'][hour]
            wind_spd = forecast['windspeed_10m'][hour]

            weather_data.append([app_temp, precip, pres, rh, snow, uv, vis, wind_spd])

        return weather_data
    else:
        return None

def make_prediction(model, data):
    # Make the prediction
    prediction = model.predict(data)
    return prediction