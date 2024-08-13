from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

users_db = {}
candidates_db = {
    "Developer": [
        {"id": 1, "name": "John Doe", "gpa": 3.8, "resume": "link-to-john-resume.jpg"},
        {"id": 2, "name": "Jane Smith", "gpa": 3.6, "resume": "link-to-jane-resume.jpg"},
    ],
    "Support": [
        {"id": 3, "name": "Michael Johnson", "gpa": 3.9, "resume": "link-to-michael-resume.jpg"},
    ]
}

@app.route('/')
def home():
    endpoints = {
        'GET /': 'Displays a welcome message and list of endpoints',
        'POST /signup': 'Registers a new user',
        'POST /login': 'Logs in a user',
        'POST /update-details': 'Updates user details',
    }
    return jsonify({
        'message': 'You have reached the capstone project.',
        'endpoints': endpoints
    })

@app.route('/signup', methods=['POST'])
def signup():
    data = request.json
    username = data['username']
    password = data['password']
    role = data['role']

    if username in users_db:
        return jsonify({'message': 'User already exists'}), 400

    # Initialize user details as empty dict
    users_db[username] = {'password': password, 'role': role, 'details': {}}
    return jsonify({'message': 'User registered successfully'}), 201

@app.route('/login', methods=['POST'])
def login():
    data = request.json
    username = data['username']
    password = data['password']

    if username not in users_db or users_db[username]['password'] != password:
        return jsonify({'message': 'Invalid credentials'}), 401

    role = users_db[username]['role']
    details = users_db[username].get('details', {})
    return jsonify({
        'message': 'Login successful',
        'role': role,
        'username': username,
        'details': details
    }), 200

@app.route('/update-details', methods=['POST'])
def update_details():
    data = request.json
    username = data['username']

    if username not in users_db:
        return jsonify({'message': 'User not found'}), 404

    # Update user details
    users_db[username]['details'] = data['details']
    print(users_db)
    return jsonify({'message': 'User details updated successfully'}), 200

if __name__ == '__main__':
    app.run(debug=True)
