import os
import googlemaps
from dotenv import load_dotenv
from flask import jsonify
from datetime import datetime
import requests

load_dotenv()

# Access the GOOGLE_API_KEY environment variable
google_api_key = os.getenv('GOOGLE_API_KEY')

gmaps = googlemaps.Client(key=google_api_key)

# Extract latitude and longitude
def get_coordinates(location):
    
    if not location:
        return {"latitude": 'Invalid location', "longitude": 'Invalid location'}

    try:
        # Geocoding an address
        geocode_result = gmaps.geocode(location)

        if geocode_result:
            location = geocode_result[0]['geometry']['location']
            # Extract longitude and latitude coordinates
            coord = {
                "latitude": location['lat'],
                "longitude": location['lng']
            }
        else:
            coord = fuzzy_search(location)
    except Exception as e:
        coord = {
            "latitude": 'Error',
            "longitude": str(e)
        }
    return coord

def fuzzy_search(location):
    try:
        url = "https://maps.googleapis.com/maps/api/place/textsearch/json"
        params = {
            'query': location,
            'key': google_api_key,
            'region': 'au',
            'location': '-25.2744,133.7751',  # Central point of Australia
            'radius': 2500000  # Approximate radius to cover most of Australia
        }
        response = requests.get(url, params=params)
        if response.status_code == 200:
            results = response.json().get('results')
            if results:
                first_result = results[0]
                location = first_result.get('geometry').get('location')
                return {
                    "latitude": location.get('lat'),
                    "longitude": location.get('lng')
                }
        return {
            "latitude": 'Invalid location',
            "longitude": 'Invalid location'
        }
    except Exception as e:
        return {
            "latitude": 'Error',
            "longitude": str(e)
        }

# Testing
if __name__ == "__main__":
    print(google_api_key)
    # location = "blue mountains dist hosp"  # Example search query
    # coordinates = fuzzy_search(location)
    # print(f"Latitude: {coordinates['latitude']}, Longitude: {coordinates['longitude']}")