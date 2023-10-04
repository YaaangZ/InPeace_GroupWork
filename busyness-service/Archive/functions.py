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

def get_weather_data(latitude, longitude, pickup_hour):
    endpoint = "https://api.open-meteo.com/v1/forecast?latitude={latitude}&longitude={longitude}&hourly=temperature_2m,relativehumidity_2m,weathercode,visibility,windspeed_80m"

    response = requests.get(endpoint.format(latitude=latitude, longitude=longitude))

    if response.status_code == 200:
        hour = pickup_hour
        data = response.json()
        forecast = data['hourly']

        weather_data = []

        visibility = forecast['visibility'][hour]
        wind_speed = forecast['windspeed_80m'][hour]
        humidity = forecast['relativehumidity_2m'][hour]
        temp = forecast['temperature_2m'][hour]
        weather = forecast['weathercode'][hour]

        weather_code = {'cloudy': [45, 48], 'rain': [51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82, 95],
                        'sunny': [0, 1, 2, 3], 'snow': [71, 73, 75, 77, 85, 86, 96, 99]}

        for category, codes in weather_code.items():
            if weather in codes:
                main_weather = category

        weather_data.extend([temp, visibility, wind_speed, main_weather, humidity])

        return weather_data
    else:
        return None

def make_prediction(model, data):
    # Make the prediction
    prediction = model.predict(data)
    return prediction
