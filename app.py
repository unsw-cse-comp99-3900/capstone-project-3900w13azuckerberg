from flask import Flask, request, jsonify

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

if __name__ == '__main__':
    app.run(debug=True)
