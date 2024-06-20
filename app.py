from flask import Flask, request, jsonify,render_template_string
import folium

app = Flask(__name__)

# Route for the home page
@app.route('/')
def home():
    return "Welcome to COVID Compass!"

# Route to handle GET requests
@app.route('/get_data', methods=['GET'])
def get_data():
    data = {
        "message": "This is a GET request",
        "status": "success"
    }
    return jsonify(data)

# Route to handle POST requests
@app.route('/post_data', methods=['POST'])
def post_data():
    if request.is_json:
        data = request.get_json()
        response = {
            "message": "This is a POST request",
            "received_data": data,
            "status": "success"
        }
        return jsonify(response)
    else:
        return jsonify({"message": "Request must be JSON", "status": "error"}), 400

@app.route('/map', methods=['GET'])
def display_map():
    # Create a map centered around a specific location
    start_coords = (-33.8688, 151.2093)  # Coordinates for San Francisco
    folium_map = folium.Map(location=start_coords, zoom_start=13)

    # Save the map to an HTML string
    map_html = folium_map._repr_html_()

    # Render the map HTML in a simple HTML template
    return render_template_string("""
        <!DOCTYPE html>
        <html>
        <head>
            <title>Map</title>
        </head>
        <body>
            <h1>My Map</h1>
            {{ map_html|safe }}
        </body>
        </html>
    """, map_html=map_html)

if __name__ == '__main__':
    app.run(debug=True)



