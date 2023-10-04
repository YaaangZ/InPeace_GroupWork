import requests
import pickle
from datetime import datetime
import pandas as pd

def load_model(filename):
    with open(filename, 'rb') as file:
        model = pickle.load(file)

    return model

def is_holiday(date):
    endpoint = "https://date.nager.at/Api/v2/IsPublicHoliday/{year}-{month}-{day}"

    year = date.year
    month = date.month
    day = date.day

    response = requests.get(endpoint.format(year=year, month=month, day=day))

    if response.status_code == 200 and response.json() is True:
        return 1  # holiday
    else:
        return 0  # not holiday


# def get_weather_data(latitude, longitude):
#     endpoint = "https://api.open-meteo.com/v1/forecast?latitude={latitude}&longitude={longitude}&hourly=relativehumidity_2m,apparent_temperature,precipitation,snowfall,surface_pressure,visibility,windspeed_10m,uv_index"
#
#     response = requests.get(endpoint.format(latitude=latitude, longitude=longitude))
#
#     if response.status_code == 200:
#         data = response.json()
#         forecast = data['hourly']
#
#         weather_data = []
#         for hour in range(24):
#             app_temp = forecast['apparent_temperature'][hour]
#             precip = forecast['precipitation'][hour]
#             pres = forecast['surface_pressure'][hour]
#             rh = forecast['relativehumidity_2m'][hour]
#             snow = forecast['snowfall'][hour]
#             uv = forecast['uv_index'][hour]
#             vis = forecast['visibility'][hour]
#             wind_spd = forecast['windspeed_10m'][hour]
#
#             weather_data.append([app_temp, precip, pres, rh, snow, uv, vis, wind_spd])
#
#         return weather_data
#     else:
#         return None

def get_weather_data(latitude, longitude):
    endpoint = "https://api.open-meteo.com/v1/forecast?latitude={latitude}&longitude={longitude}&hourly=temperature_2m,relativehumidity_2m,weathercode,visibility,windspeed_80m"

    response = requests.get(endpoint.format(latitude=latitude, longitude=longitude))

    if response.status_code == 200:
        data = response.json()
        forecast = data['hourly']

        weather_data = []
        for hour in range(24):
            visibility = forecast['visibility'][hour]
            wind_speed = forecast['windspeed_80m'][hour]
            humidity = forecast['relativehumidity_2m'][hour]
            temp = forecast['temperature_2m'][hour]
            weather = forecast['weathercode'][hour]

            weather_code = {'cloudy': [45, 48], 'rain': [51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82, 95],
                            'sunny': [0, 1, 2, 3], 'snow': [71, 73, 75, 77, 85, 86, 96, 99]}

            main_weather = None
            for category, codes in weather_code.items():
                if weather in codes:
                    main_weather = category
                    break  # Exit the loop once the main_weather is found

            # Encode 'main_weather' column to one-hot
            cloudy = 1 if main_weather == 'cloudy' else 0
            rain = 1 if main_weather == 'rain' else 0
            snow = 1 if main_weather == 'snow' else 0
            sunny = 1 if main_weather == 'sunny' else 0

            weather_data.append({
                'temp': temp,
                'visibility': visibility,
                'wind_speed': wind_speed,
                'humidity': humidity,
                'cloudy': cloudy,
                'rain': rain,
                'snow': snow,
                'sunny': sunny
            })

        return weather_data
    else:
        return None


def make_prediction(model, data):
    # Make the prediction
    prediction = model.predict(data)
    return prediction

