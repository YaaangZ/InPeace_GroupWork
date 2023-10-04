import pytest
from flask import Flask
from places_service_app import app

@pytest.fixture
def client():
    with app.test_client() as client:
        yield client

# Test cases for "/search_places" API endpoint
def test_search_places_success(client):
    # Test1: Test for successful search with valid parameters
    response = client.get('/search_places?longitude=10.0&latitude=20.0&radius=100&category=park')
    assert response.status_code == 200

def test_search_places_no_radius(client):
    # Test2: Test for successful search with no radius parameter given
    response = client.get('/search_places?longitude=10.0&latitude=20.0&category=park')
    assert response.status_code == 200 

def test_search_places_no_category(client):
    # Test3: Test for successful search with no category parameter given
    response = client.get('/search_places?longitude=10.0&latitude=20.0&radius=100')
    assert response.status_code == 200

def test_search_places_no_categoryradius(client):
    # Test4: Test for successful search with no radius and category parameter given
    response = client.get('/search_places?longitude=10.0&latitude=20.0')
    assert response.status_code == 200

def test_search_places_no_longitude(client):
    # Test5: Invalid Search for Places (Missing Longitude)
    response = client.get('/search_places?latitude=20.0&radius=100&category=park')
    assert response.status_code == 400

def test_search_places_no_latitude(client):
    # Test6: Invalid Search for Places (Missing Latitude)
    response = client.get('/search_places?longitude=20.0&radius=100&category=park')
    assert response.status_code == 400
