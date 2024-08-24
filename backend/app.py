from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import random

app = Flask(__name__)
CORS(app)

# Folder to save uploaded JD files
UPLOAD_FOLDER = 'uploads'
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

# In-memory "databases" (dictionaries)
users_db = {}
students_db = {}
recruiters_db = {}
roles_db = {}

# Sample Data

# Students Collection
students_db = {
    1: {
        "legalName": "John Doe",
        "gpa": 3.8,
        "gender": "Male",
        "resume": "link-to-john-resume.pdf",
        "application_status": [
            {"role_id": 1, "status": 0, "score": None}
        ]
    },
    2: {
        "legalName": "Jane Smith",
        "gpa": 3.6,
        "gender": "Female",
        "resume": "link-to-jane-resume.pdf",
        "application_status": [
            {"role_id": 1, "status": 0, "score": None}
        ]
    },
    3: {
        "legalName": "Alice Johnson",
        "gpa": 3.9,
        "gender": "Female",
        "resume": "link-to-alice-resume.pdf",
        "application_status": [
            {"role_id": 1, "status": 0, "score": None}
        ]
    },
    4: {
        "legalName": "Bob Brown",
        "gpa": 3.7,
        "gender": "Male",
        "resume": "link-to-bob-resume.pdf",
        "application_status": [
            {"role_id": 1, "status": 0, "score": None}
        ]
    },
    5: {
        "legalName": "Charlie Davis",
        "gpa": 3.5,
        "gender": "Male",
        "resume": "link-to-charlie-resume.pdf",
        "application_status": [
            {"role_id": 1, "status": 0, "score": None}
        ]
    },
    6: {
        "legalName": "Diana Evans",
        "gpa": 3.9,
        "gender": "Female",
        "resume": "link-to-diana-resume.pdf",
        "application_status": [
            {"role_id": 1, "status": 0, "score": None}
        ]
    },
    7: {
        "legalName": "Edward Fisher",
        "gpa": 3.4,
        "gender": "Male",
        "resume": "link-to-edward-resume.pdf",
        "application_status": [
            {"role_id": 1, "status": 0, "score": None}
        ]
    },
    8: {
        "legalName": "Fiona Green",
        "gpa": 3.6,
        "gender": "Female",
        "resume": "link-to-fiona-resume.pdf",
        "application_status": [
            {"role_id": 1, "status": 0, "score": None}
        ]
    },
    9: {
        "legalName": "George Harris",
        "gpa": 3.8,
        "gender": "Male",
        "resume": "link-to-george-resume.pdf",
        "application_status": [
            {"role_id": 1, "status": 0, "score": None}
        ]
    },
    10: {
        "legalName": "Hannah Ivanov",
        "gpa": 4.0,
        "gender": "Female",
        "resume": "link-to-hannah-resume.pdf",
        "application_status": [
            {"role_id": 1, "status": 0, "score": None}
        ]
    },
    11: {
        "legalName": "Ian Jackson",
        "gpa": 3.5,
        "gender": "Male",
        "resume": "link-to-ian-resume.pdf",
        "application_status": [
            {"role_id": 1, "status": 0, "score": None}
        ]
    },
    12: {
        "legalName": "Julia King",
        "gpa": 3.7,
        "gender": "Female",
        "resume": "link-to-julia-resume.pdf",
        "application_status": [
            {"role_id": 1, "status": 0, "score": None}
        ]
    },
    13: {
        "legalName": "Kevin Lewis",
        "gpa": 3.6,
        "gender": "Male",
        "resume": "link-to-kevin-resume.pdf",
        "application_status": [
            {"role_id": 1, "status": 0, "score": None}
        ]
    }
}

# Recruiters Collection
recruiters_db = {
    1: {
        "companyName": "Tech Corp",
        "companyDesc": "A leading tech company",
        "companyWebsite": "www.tech.com",
        "roles": [
            {"role_id": 1, "status": 1},
            {"role_id": 2, "status": 1}
        ]
    },
    2: {
        "companyName": "Innovate Solutions",
        "companyDesc": "A top-tier consulting firm",
        "companyWebsite": "www.link.com",
        "roles": [
            {"role_id": 3, "status": 1},
            {"role_id": 4, "status": 1}
        ]
    }
}

# Roles Collection
roles_db = {
    1: {
        "company_id": 1,
        "roleTitle": "Software Developer",
        "roleDescription": "Responsible for developing software solutions.",
        "jd": "link-to-software-developer-jd.pdf",
        "candidates": [1, 2],
        "deadline": "2024-12-31",
        "status": 1
    },
    2: {
        "company_id": 1,
        "roleTitle": "Data Analyst",
        "roleDescription": "Analyze data and provide actionable insights.",
        "jd": "link-to-data-analyst-jd.pdf",
        "candidates": [3, 4],
        "deadline": "2024-12-31",
        "status": 1
    },
    3: {
        "company_id": 2,
        "roleTitle": "Consultant",
        "roleDescription": "Provide strategic consulting services to clients.",
        "jd": "link-to-consultant-jd.pdf",
        "candidates": [5, 6],
        "deadline": "2024-12-31",
        "status": 1
    },
    4: {
        "company_id": 2,
        "roleTitle": "Project Manager",
        "roleDescription": "Manage projects and ensure timely delivery.",
        "jd": "link-to-project-manager-jd.pdf",
        "candidates": [7, 8],
        "deadline": "2024-12-31",
        "status": 1
    }
}

# Users Collection
users_db = {
    # Students
    "johndoe": {
        "password": "johndoe",
        "role": "student",
        "details_id": 1  # References students_db
    },
    "janesmith": {
        "password": "janesmith",
        "role": "student",
        "details_id": 2  # References students_db
    },
    "alicejohnson": {
        "password": "alicejohnson",
        "role": "student",
        "details_id": 3  # References students_db
    },
    "bobbrown": {
        "password": "bobbrown",
        "role": "student",
        "details_id": 4  # References students_db
    },
    "charliedavis": {
        "password": "charliedavis",
        "role": "student",
        "details_id": 5  # References students_db
    },
    "dianaevans": {
        "password": "dianaevans",
        "role": "student",
        "details_id": 6  # References students_db
    },
    "edwardfisher": {
        "password": "edwardfisher",
        "role": "student",
        "details_id": 7  # References students_db
    },
    "fionagreen": {
        "password": "fionagreen",
        "role": "student",
        "details_id": 8  # References students_db
    },
    "georgeharris": {
        "password": "georgeharris",
        "role": "student",
        "details_id": 9  # References students_db
    },
    "hannahivanov": {
        "password": "hannahivanov",
        "role": "student",
        "details_id": 10  # References students_db
    },
    "ianjackson": {
        "password": "ianjackson",
        "role": "student",
        "details_id": 11  # References students_db
    },
    "juliaking": {
        "password": "juliaking",
        "role": "student",
        "details_id": 12  # References students_db
    },
    "kevinlewis": {
        "password": "kevinlewis",
        "role": "student",
        "details_id": 13  # References students_db
    },

    # Recruiters
    "janerecruiter": {
        "password": "janerecruiter",
        "role": "recruiter",
        "details_id": 1  # References recruiters_db
    },
    "markmanager": {
        "password": "markmanager",
        "role": "recruiter",
        "details_id": 2  # References recruiters_db
    }
}


@app.route('/')
def home():
    endpoints = {
        'GET /': 'Displays a welcome message and list of endpoints',
        'POST /signup': 'Registers a new user',
        'POST /login': 'Logs in a user',
        'POST /update-details': 'Updates user details',
        'GET /companies': 'Get all companies and their roles',
        'GET /candidates/<int:role_id>': 'Get all candidates for a specific role'
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

    # Create a new entry in the relevant database based on role
    if role == "student":
        new_id = max(students_db.keys()) + 1 if students_db else 1
        students_db[new_id] = {
            "legalName": "",
            "gpa": 0,
            "gender": "",
            "resume": "",
            
            "application_status": []
        }
    elif role == "recruiter":
        new_id = max(recruiters_db.keys()) + 1 if recruiters_db else 1
        recruiters_db[new_id] = {
            "companyName": "",
            "companyDesc": "",
            "roles": []
        }
    else:
        return jsonify({'message': 'Invalid role specified'}), 400

    # Add the user to the users_db
    users_db[username] = {
        "password": password,
        "role": role,
        "details_id": new_id
    }
    return jsonify({'message': 'User registered successfully'}), 201

@app.route('/login', methods=['POST'])
def login():
    data = request.json
    username = data['username']
    password = data['password']

    if username not in users_db or users_db[username]['password'] != password:
        return jsonify({'message': 'Invalid credentials'}), 401

    role = users_db[username]['role']
    details_id = users_db[username]['details_id']
    details = students_db[details_id] if role == "student" else recruiters_db[details_id]

    return jsonify({
        'message': 'Login successful',
        'role': role,
        'username': username,
        'details': details
    }), 200

@app.route('/refresh-user-details', methods=['GET'])
def refresh_user_details():
    username = request.args.get('username')

    if not username or username not in users_db:
        return jsonify({'message': 'User not found'}), 404

    role = users_db[username]['role']
    details_id = users_db[username]['details_id']

    # Fetch the latest user details based on the role
    details = students_db[details_id] if role == "student" else recruiters_db[details_id]

    return jsonify({
        'message': 'User details refreshed successfully',
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

    details_id = users_db[username]['details_id']
    role = users_db[username]['role']

    # Update the correct collection based on user role
    if role == "student":
        students_db[details_id].update(data['details'])
    elif role == "recruiter":
        recruiters_db[details_id].update(data['details'])
    else:
        return jsonify({'message': 'Invalid role specified'}), 400

    return jsonify({'message': 'User details updated successfully'}), 200

@app.route('/companies', methods=['GET'])
def get_companies():
    response = []
    for rec_id, rec in recruiters_db.items():
        # Filter roles where status != 0 and include role_id in the response
        visible_roles = [
            {
                "role_id": role_id,
                "roleTitle": role['roleTitle'],
                "roleDescription": role['roleDescription'],
                "jd": role['jd'],
                "deadline": role['deadline']
            }
            for role_id, role in roles_db.items()
            if role['company_id'] == rec_id and role['status'] != 0
        ]
        if visible_roles:  # Only include companies with visible roles
            response.append({
                'id': rec_id,
                'name': rec['companyName'],
                'description': rec['companyDesc'],
                'roles': visible_roles
            })
    return jsonify(response), 200


@app.route('/apply-role', methods=['POST'])
def apply_role():
    data = request.json
    username = data['username']
    role_id = data['role_id']

    if username not in users_db or users_db[username]['role'] != "student":
        return jsonify({'message': 'User not found or not a student'}), 404

    details_id = users_db[username]['details_id']
    student = students_db[details_id]
    score = random.randint(50, 100)
    # Update the student's application status
    student['application_status'].append({
        "role_id": role_id,
        "status": 1,  # Assuming 0 means "applied"
        "score": score
    })

    # Update the role's candidate list
    roles_db[role_id]['candidates'].append(details_id)

    return jsonify({'message': 'Application successful'}), 200

@app.route('/add-role', methods=['POST'])
def add_role():
    data = request.json
    username = data['username']
    role_data = data['role']

    if username not in users_db or users_db[username]['role'] != 'recruiter':
        return jsonify({'message': 'Recruiter not found'}), 404

    details_id = users_db[username]['details_id']
    new_role_id = max(roles_db.keys()) + 1 if roles_db else 1

    new_role = {
        'company_id': details_id,
        'roleTitle': role_data['RoleTitle'],
        'roleDescription': role_data['RoleDescription'],
        'jd': None,
        'candidates': [],
        'deadline': None,
        'status': 0  # Status 0 since no JD is uploaded yet
    }

    # Add the new role to the roles_db
    roles_db[new_role_id] = new_role

    # Also add the new role to the recruiter's roles in recruiters_db
    recruiters_db[details_id]['roles'].append({
        "role_id": new_role_id,
        "status": 0  # Status 0 since no JD is uploaded yet
    })

    return jsonify({'message': 'Role added successfully', 'role': new_role}), 201

@app.route('/get-roles', methods=['GET'])
def get_roles():
    username = request.args.get('username')
    if not username:
        return jsonify({"message": "Username is required"}), 400
    if username not in users_db:
        return jsonify({"message": "User not found"}), 404
    user = users_db[username]
    if user['role'] != 'recruiter':
        return jsonify({"message": "User is not a recruiter"}), 403
    details_id = user['details_id']
    recruiter = recruiters_db.get(details_id)
    if not recruiter:
        return jsonify({"message": "Recruiter details not found"}), 404
    role_ids = [role['role_id'] for role in recruiter['roles']]
    roles = [
        {
            "role_id": role_id,
            "roleTitle": roles_db[role_id]["roleTitle"],
            "roleDescription": roles_db[role_id]["roleDescription"],
            "jd": roles_db[role_id]["jd"],
            "candidates": roles_db[role_id]["candidates"],
            "deadline": roles_db[role_id]["deadline"],
            "status": roles_db[role_id]["status"]
        }
        for role_id in role_ids if role_id in roles_db
    ]
    return jsonify({"roles": roles}), 200

@app.route('/upload-jd', methods=['POST'])
def upload_jd():
    username = request.form['username']
    role_id = int(request.form['role_id'])
    jd_file = request.files['jd']

    if username not in users_db or users_db[username]['role'] != 'recruiter':
        return jsonify({'message': 'Recruiter not found'}), 404

    # Fetch role details from roles_db
    role = roles_db.get(role_id)
    if not role:
        return jsonify({'message': 'Role not found'}), 404

    # Save the JD file to the server
    role_name = role['roleTitle']
    filename = f"{username}_{role_name}.pdf"
    file_path = os.path.join(UPLOAD_FOLDER, filename)
    jd_file.save(file_path)

    # Update the role with the JD file and change status
    roles_db[role_id]['jd'] = file_path
    roles_db[role_id]['status'] = 1  # Status 1 means JD uploaded

    # Randomly select a number of candidates
    num_candidates = random.randint(7, 13)  # Pick a number greater than 7
    candidate_ids = random.sample(list(students_db.keys()), num_candidates)
    roles_db[role_id]['candidates'] = candidate_ids

    # Update students' application status
    for cid in candidate_ids:
        students_db[cid]['application_status'].append({
            "role_id": role_id,
            "status": 1,  # Status 1 means applied
            "score": None
        })

    return jsonify({'message': 'JD uploaded and candidates selected', 'role': roles_db[role_id]}), 200

@app.route('/match_resume', methods=['POST'])
def match_resume():
    username = request.json['username']
    k = int(request.json['numCandidates'])
    role_id = int(request.json['role_id'])
    role = roles_db.get(role_id)
    role_name = role['roleTitle']
    jd = f"{username}_{role_name}.pdf"
    available_candidates = role['candidates']
    if k > len(available_candidates):
        k = len(available_candidates)
    if(k==len(available_candidates)):
        roles_db[role_id]['status'] = 2
        for cid in available_candidates:
            score = random.randint(50, 100)
            students_db[cid]['application_status'] = [
                {
                    "role_id": role_id,
                    "status": 2,
                    "score": score
                }
                for app in students_db[cid]['application_status']
                if app['role_id'] == role_id
            ]
        return jsonify({"message": "Candidates updated after matching resume" }), 200
    selected_candidates = random.sample(available_candidates, k)
    roles_db[role_id]['candidates'] = selected_candidates
    roles_db[role_id]['status'] = 2
    for cid in selected_candidates:
        score = random.randint(50, 100)
        students_db[cid]['application_status'] = [
            {
                "role_id": role_id,
                "status": 2,
                "score": score
            }
            for app in students_db[cid]['application_status']
            if app['role_id'] == role_id
        ]

    # Update the status of the non-selected candidates to 5 (Rejected)
    non_selected_candidates = set(available_candidates) - set(selected_candidates)
    for cid in non_selected_candidates:
        for app in students_db[cid]['application_status']:
            if app['role_id'] == role_id:
                app['status'] = 5
                break
    return jsonify({"message": "Candidates updated after matching resume"}), 200


@app.route('/fetch-candidates', methods=['POST'])
def fetch_candidates():
    role_id = int(request.json['role_id'])
    role = roles_db.get(role_id)
    candidate_ids = role['candidates']

    if not candidate_ids:
        return jsonify({"message": "No candidate IDs provided"}), 400

    # Extract the required fields for each candidate and include interview score if status is 4
    candidates = []
    for cid in candidate_ids:
        if cid in students_db:
            candidate_data = {
                "id": cid,
                "legalName": students_db[cid]["legalName"],
                "gender": students_db[cid]["gender"],
                "gpa": students_db[cid]["gpa"],
                "resume": students_db[cid]["resume"],
                "score": None
            }
            # Check the application status for the role and include the interview score if status is 4
            for app in students_db[cid]['application_status']:
                if app['role_id'] == role_id:
                    candidate_data['score'] = app['score']
                    break
            candidates.append(candidate_data)

    return jsonify(candidates), 200



@app.route('/update-candidates-status', methods=['POST'])
def update_candidates_status():
    role_id = request.json.get('role_id')
    selected_candidates = request.json.get('selected_candidates', [])
    if role_id not in roles_db:
        return jsonify({"message": "Role not found"}), 404
    role = roles_db[role_id]
    available_candidates = role['candidates']
    roles_db[role_id]['candidates'] = selected_candidates
    roles_db[role_id]['status'] = 3
    for cid in selected_candidates:
        for app in students_db[cid]['application_status']:
            if app['role_id'] == role_id:
                students_db[cid]['application_status']["status"] = 3

    # Update the status of the non-selected candidates to 5 (Rejected)
    non_selected_candidates = set(available_candidates) - set(selected_candidates)
    for cid in non_selected_candidates:
        for app in students_db[cid]['application_status']:
            if app['role_id'] == role_id:
                students_db[cid]['application_status']["status"] = 5

    return jsonify({'message': 'Candidates status updated successfully'}), 200

@app.route('/complete-interviews', methods=['POST'])
def complete_interviews():
    role_id = request.json.get('role_id')
    username = request.json.get('username')

    if role_id not in roles_db:
        return jsonify({"message": "Role not found"}), 404
    
    if username not in users_db or users_db[username]['role'] != "student":
        return jsonify({'message': 'User not found or not a student'}), 404

    details_id = users_db[username]['details_id']
    student = students_db[details_id]
    score = random.randint(50, 100)

    # Update the student's application status
    for app in student['application_status']:
        if app['role_id'] == role_id and app['status']==3:
            app['status'] = 4
            app['score'] = score
            break

    return jsonify({'message': 'Interview completed and score assigned'}), 200

@app.route('/finish-interviews', methods=['POST'])
def finish_interviews():
    role_id = request.json.get('role_id')

    if role_id not in roles_db:
        return jsonify({"message": "Role not found"}), 404

    role = roles_db[role_id]
    candidate_ids = role['candidates']
    for cid in candidate_ids:
        for app in students_db[cid]['application_status']:
            if app['role_id'] == role_id and app['status'] == 3:  # Only update those in interview stage
                score = random.randint(50, 100)  # Generate random score as percentage
                app['score'] = score
                app['status'] = 4
                break
    roles_db[role_id]['status'] = 4
    return jsonify({'message': 'Interviews completed and scores assigned'}), 200

if __name__ == '__main__':
    app.run(debug=True)
