import pytest
from places_service_app import app

@pytest.fixture
def client():
    with app.test_client() as client:
        yield client

# Test cases for "/rating" API endpoints
def test_add_rating_success(client): #duplicate entry, update rating
    # Test for successful addition of a rating
    rating_data = {
        'rating_value': 4
    }
    response = client.put('/01isnBO1rFO2LTOeNfYl9w/rating', json=rating_data, )
    assert response.status_code == 200

def test_add_rating_user_not_found(client):
    # Test for adding a rating where user not in db
    rating_data = {
        'rating_value': 4
    }
    response = client.post('/rating/2/01isnBO1rFO2LTOeNfYl9w', json=rating_data)
    assert response.status_code == 404
    assert response.get_json() == {'error': 'User does not exist.'}

def test_add_rating_place_not_found(client):
    # Test for adding a rating with place_id not in db
    rating_data = {
        'rating_value': 4
    }
    response = client.post('/rating/1/nonexistentplace', json=rating_data)
    assert response.status_code == 404
    assert response.get_json() == {'error': 'Place does not exist.'}

def test_update_rating_success(client):
    # Test for successful rating update
    rating_data = {
        'rating_value': 5
    }
    response = client.put('/rating/1/01isnBO1rFO2LTOeNfYl9w', json=rating_data)
    assert response.status_code == 200

def test_update_rating_not_found(client):
    # Test for updating a non-existent rating
    rating_data = {
        'rating_value': 5
    }
    response = client.put('/rating/2/01isnBO1rFO2LTOeNfYl9w', json=rating_data)
    assert response.status_code == 404
    assert response.get_json() == {'error': 'Rating does not exist.'}

def test_get_user_rating_success(client):
    # Test for getting a user's rating
    response = client.get('/get_rating/1/01isnBO1rFO2LTOeNfYl9w')
    assert response.status_code == 200

def test_get_user_rating_not_found(client):
    # Test for getting a non-existent user's rating
    response = client.get('/get_rating/2/01isnBO1rFO2LTOeNfYl9w')
    assert response.status_code == 404
    assert response.get_json() == {'error': 'Rating not found.'}

# Test case for "/average_rating" API endpoint
def test_get_average_rating_success(client):
    # Test for getting the average rating of a place
    response = client.get('/average_rating/01isnBO1rFO2LTOeNfYl9w')
    assert response.status_code == 200
