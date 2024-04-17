import datetime
from flask import Flask, request, jsonify
from model import predict_by_year
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

def is_valid_year(year):
    current_year = datetime.datetime.now().year
    try:
        year = int(year)
        if current_year <= year <= current_year + 50:
            return True
    except ValueError:
        pass
    return False

@app.route('/', methods=['GET'])
def index():
    return "Welcome to Natural Disaster Prediction API"

@app.route('/predict_disasters', methods=['GET'])
def get_predictions():
    year = request.args.get('year', type=int)
    if year is None:
        return jsonify({'error': 'Year parameter is missing'}), 400
    if year < 0 or year > 3000:
        return jsonify({'error': 'Year is out of bounds'}), 400
    predictions = predict_by_year(year)
    return predictions, 200


if __name__ == "__main__":
    from waitress import serve
    serve(app, host="0.0.0.0", port=5000)