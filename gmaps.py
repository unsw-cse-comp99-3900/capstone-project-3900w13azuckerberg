import googlemaps
from flask import jsonify
from datetime import datetime
from db_manager import get_records
from model import VirusData

gmaps = googlemaps.Client(key='AIzaSyD6YJJf3RPjpfYd9_wx8qA8k3xKjaJpT1U')

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
            coord = {
                "latitude": 'Invalid location',
                "longitude": 'Invalid location'
            }
    except Exception as e:
        coord = {
            "latitude": 'Error',
            "longitude": str(e)
        }
    return coord

# Look up an address with reverse geocoding
# reverse_geocode_result = gmaps.reverse_geocode((40.714224, -73.961452))

# Request directions via public transit
# now = datetime.now()
# directions_result = gmaps.directions("Sydney Town Hall",
#                                      "Parramatta, NSW",
#                                      mode="transit",
#                                      departure_time=now)

# Validate an address with address validation
# addressvalidation_result =  gmaps.addressvalidation(['1600 Amphitheatre Pk'], 
#                                                     regionCode='US',
#                                                     locality='Mountain View', 
#                                                     enableUspsCass=True)