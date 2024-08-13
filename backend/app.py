from flask import Flask, request, jsonify

app = Flask(__name__)

# Simulate a database with a dictionary
users_db = {}

@app.route('/signup', methods=['POST'])
def signup():
    data = request.json
    username = data['username']
    password = data['password']
    role = data['role']

    if username in users_db:
        return jsonify({'message': 'User already exists'}), 400

    users_db[username] = {'password': password, 'role': role}
    return jsonify({'message': 'User registered successfully'}), 201

@app.route('/login', methods=['POST'])
def login():
    data = request.json
    username = data['username']
    password = data['password']

    if username not in users_db or users_db[username]['password'] != password:
        return jsonify({'message': 'Invalid credentials'}), 401

    role = users_db[username]['role']
    return jsonify({'message': 'Login successful', 'role': role, 'username': username}), 200

if __name__ == '__main__':
    app.run(debug=True)
