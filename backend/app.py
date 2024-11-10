from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import os
import random
from pymongo import MongoClient
from bson.objectid import ObjectId
import requests
from main import generate_syllabus

app = Flask(__name__)
CORS(app)

# Folder to save uploaded JD files
RESUME_FOLDER = 'resume'
JD_FOLDER = 'jd'

# Create folders if they don't exist
if not os.path.exists(RESUME_FOLDER):
    os.makedirs(RESUME_FOLDER)
if not os.path.exists(JD_FOLDER):
    os.makedirs(JD_FOLDER)

# MongoDB Connection
client = MongoClient("mongodb+srv://pragyadas:Test123@capstone.3sv7a.mongodb.net/")  # Replace with your MongoDB connection string
db = client["capstone_project_db"]  # Database name
users_col = db["users"]  # Users collection
students_col = db["students"]  # Students collection
recruiters_col = db["recruiters"]  # Recruiters collection
teachers_col = db["teachers"]  # Recruiters collection
roles_col = db["roles"]  # Roles collection

def convert_objectid_to_str(doc):
    """Recursively converts ObjectId fields in a document to strings."""
    if isinstance(doc, list):
        return [convert_objectid_to_str(i) for i in doc]
    elif isinstance(doc, dict):
        return {k: convert_objectid_to_str(v) for k, v in doc.items()}
    elif isinstance(doc, ObjectId):
        return str(doc)
    else:
        return doc


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

    if users_col.find_one({"username": username}):
        return jsonify({'message': 'User already exists'}), 400
    
    # Create a new entry in the relevant collection based on role
    if role == "student":
        student_id = students_col.insert_one({
            "legalName": "",
            "gpa": 0,
            "gender": "",
            "resume": "",
            "application_status": []
        }).inserted_id
        details_id = student_id
    elif role == "recruiter":
        recruiter_id = recruiters_col.insert_one({
            "companyName": "",
            "companyDesc": "",
            "roles": []
        }).inserted_id
        details_id = recruiter_id
    elif role == "teacher":
        teacher_id = teachers_col.insert_one({
            "syllabi": []
        }).inserted_id
        details_id = teacher_id
    else:
        return jsonify({'message': 'Invalid role specified'}), 400

    # Add the user to the users collection
    users_col.insert_one({
        "username": username,
        "password": password,
        "role": role,
        "details_id": details_id
    })
    return jsonify({'message': 'User registered successfully'}), 201

@app.route('/login', methods=['POST'])
def login():
    data = request.json
    username = data['username']
    password = data['password']
    user = users_col.find_one({"username": username, "password": password})
    if not user:
        return jsonify({'message': 'Invalid credentials'}), 401

    role = user['role']
    details_id = user['details_id']
    if role == "student":
        details = students_col.find_one({"_id": details_id}) 
    elif role == "teacher":
        details = teachers_col.find_one({"_id": details_id})
    else:
        details = recruiters_col.find_one({"_id": details_id})

    return jsonify({
        'message': 'Login successful',
        'role': role,
        'username': username,
        'details': convert_objectid_to_str(details)
    }), 200

@app.route('/refresh-user-details', methods=['GET'])
def refresh_user_details():
    username = request.args.get('username')

    if not username:
        return jsonify({'message': 'Username is required'}), 400

    user = users_col.find_one({"username": username})
    if not user:
        return jsonify({'message': 'User not found'}), 404

    role = user['role']
    details_id = user['details_id']

    # Fetch the latest user details based on the role
    if role == "student":
        details = students_col.find_one({"_id": ObjectId(details_id)})
    elif role == "recruiter":
        details = recruiters_col.find_one({"_id": ObjectId(details_id)})
    elif role == "teacher":
        details = teachers_col.find_one({"_id": ObjectId(details_id)})
    else:
        return jsonify({'message': 'Invalid role specified'}), 400

    return jsonify({
        'message': 'User details refreshed successfully',
        'role': role,
        'username': username,
        'details': convert_objectid_to_str(details)

    }), 200

@app.route('/update-details', methods=['POST'])
def update_details():
    # First, try to retrieve the username from the JSON payload
    try:
        username = request.json['username']
    except:
        username = request.form.get('username')
    
    # Fetch the user from the database
    user = users_col.find_one({"username": username})
    if not user:
        return jsonify({'message': 'User not found'}), 404

    details_id = user['details_id']
    role = user['role']
    
    # Initialize the details dictionary
    details = {}

    if role == 'student':
        # For students, handle form data and file upload
        try:
            resume_file = request.files.get('resume')
            details.update({
                "legalName": request.form.get('legalName'),
                "gender": request.form.get('gender'),
                "gpa": request.form.get('gpa'),
            })

            if resume_file:
                # Define the filename and file path
                filename = f"{username}.pdf"
                file_path = os.path.join(RESUME_FOLDER, filename)
                
                # Save the resume file to the server
                resume_file.save(file_path)
                
                # Add the file path to the details dictionary
                details['resume'] = file_path
                resume_file.stream.seek(0)

                # Send the resume for analysis
                analysis_endpoint = "http://127.0.0.1:7000/candidate/analyse"
                files = {"file": (resume_file.filename, resume_file.stream, resume_file.mimetype)}
                try:
                    response = requests.post(analysis_endpoint, files=files)
                    response.raise_for_status()  # Raise an error for bad status codes
                    
                    # Get the content of the response
                    response_content = response.json()
                    
                    # Update the details with analysis results
                    details["resume_extract"] = response_content
                except requests.exceptions.RequestException as e:
                    print(f"Error communicating with analysis service: {e}")
                    return jsonify({'message': 'Failed to analyze resume', 'error': str(e)}), 500
        except KeyError as e:
            return jsonify({'message': f'Missing required data: {str(e)}'}), 400

    elif role == "recruiter":
        # For recruiters, handle the JSON payload
        try:
            details.update({
                "companyName": request.json['details']['companyName'],
                "companyDesc": request.json['details']['companyDesc'],
                "companyWebsite": request.json['details']['companyWebsite'],
            })
        except KeyError as e:
            return jsonify({'message': f'Missing required data: {str(e)}'}), 400
    else:
        return jsonify({'message': 'Invalid role specified'}), 400

    # Update the correct collection based on user role
    if role == "student":
        students_col.update_one({"_id": ObjectId(details_id)}, {"$set": details})
    elif role == "recruiter":
        recruiters_col.update_one({"_id": ObjectId(details_id)}, {"$set": details})

    return jsonify({'message': 'User details updated successfully'}), 200

@app.route('/create-syllabus', methods=['POST'])
def create_syllabus():
    data = request.json
    course_name = data.get('courseName')
    course = data.get('courseName').replace(" ","").lower()
    course_description = data.get('courseDescription')
    username = data.get('username')
    role = data.get('role')

    # Validate user
    user = users_col.find_one({"username": username, "role": role})
    if not user:
        return jsonify({'message': 'Teacher not found'}), 404

    details_id = user['details_id']
    try:
        file_maybe = generate_syllabus(course,username)
        print(file_maybe)
    except Exception as e:
        print(e)

    file_name = f"{(username + '_' + course_name).lower().replace(' ', '_')}_syllabus.md"
    file_path = os.path.join("syllabus", file_name)

    # Write the syllabus file with course name and description
    
    ## HIT YOUR ENDPOINT HERE
   

    # Update the syllabus list in the database
    teachers_col.update_one(
        {"_id": details_id},
        {"$push": {"syllabi": {"courseName": course_name, "courseDescription":course_description, "filePath": file_maybe}}}
    )

    # Read the file content to return to the frontend
    with open(file_maybe, "r") as f:
        syllabus_content = f.read()

    return jsonify({
        'message': 'Syllabus created successfully',
        'syllabusContent': syllabus_content
    }), 201


@app.route('/get-syllabi', methods=['GET'])
def get_syllabi():
    username = request.args.get('username')
    role = request.args.get('role')

    # Find user based on username and role
    user = users_col.find_one({"username": username, "role": role})
    if not user:
        return jsonify({'message': 'Teacher not found'}), 404

    # Get the details_id associated with the user
    details_id = user['details_id']
    # Retrieve all syllabi for this user from the teachers collection
    teacher_data = teachers_col.find_one(
        {"_id": details_id},
        {"syllabi": 1}  # Only fetch the syllabi field
    )

    if not teacher_data or "syllabi" not in teacher_data:
        return jsonify({'message': 'No syllabi found for this user'}), 404

    # Format the syllabus data
    syllabi_list = []
    for syllabus in teacher_data['syllabi']:
        course_name = syllabus.get('courseName')
        description = syllabus.get('courseDescription')
        syllabi_list.append({
            "courseName": course_name,
            "description": description
        })

    return jsonify({'syllabi': syllabi_list}), 200



@app.route('/get-syllabus', methods=['GET'])
def get_syllabus():
    username = request.args.get('username')
    role = request.args.get('role')
    course_name = request.args.get('courseName')

    user = users_col.find_one({"username": username, "role": role})
    if not user:
        return jsonify({'message': 'Teacher not found'}), 404

    details_id = user['details_id']
    syllabus = teachers_col.find_one(
        {"_id": details_id, "syllabi.courseName": course_name},
        {"syllabi.$": 1}
    )

    if not syllabus or "syllabi" not in syllabus:
        return jsonify({'message': 'Syllabus not found'}), 404

    file_path = syllabus['syllabi'][0]['filePath']

    try:
        with open(file_path, "r") as f:
            syllabus_content = f.read()
    except FileNotFoundError:
        return jsonify({'message': 'File not found on server'}), 500

    return jsonify({'syllabusContent': syllabus_content}), 200

# @app.route('/get-syllabus-pdf', methods=['GET'])
# def get_syllabus_pdf():
#     try:
#         username = request.args.get('username')
#         role = request.args.get('role')
#         course_name = request.args.get('courseName')
#         user = users_col.find_one({"username": username, "role": role})
#         if not user:
#             return jsonify({'message': 'Teacher not found'}), 404

#         details_id = user['details_id']
#         syllabus = teachers_col.find_one(
#             {"_id": details_id, "syllabi.courseName": course_name},
#             {"syllabi.$": 1}
#         )

#         if not syllabus or "syllabi" not in syllabus:
#             return jsonify({'message': 'Syllabus not found'}), 404

#         file_path = syllabus['syllabi'][0]['filePath'].split('.')[0]+'.pdf'
#         if not os.path.exists(file_path):
#             print("Not found")
#             return jsonify({"message": "Syllabus file does not exist on the server"}), 404

#         return send_file(file_path, as_attachment=False)

#     except Exception as e:
#         print(e)
#         return jsonify({"message": f"Error fetching Syllabus: {str(e)}"}), 500


from spire.doc import *
from spire.doc.common import *

@app.route('/get-syllabus-pdf', methods=['GET'])
def get_syllabus_pdf():
    try:
        username = request.args.get('username')
        role = request.args.get('role')
        course_name = request.args.get('courseName')
        user = users_col.find_one({"username": username, "role": role})
        if not user:
            return jsonify({'message': 'Teacher not found'}), 404

        details_id = user['details_id']
        syllabus = teachers_col.find_one(
            {"_id": details_id, "syllabi.courseName": course_name},
            {"syllabi.$": 1}
        )

        if not syllabus or "syllabi" not in syllabus:
            return jsonify({'message': 'Syllabus not found'}), 404

        file_path = syllabus['syllabi'][0]['filePath']
        document = Document()
        document.LoadFromFile(file_path)
        document.SaveToFile(os.path.join("syllabus", "new.pdf"), FileFormat.PDF)
        document.Dispose()
        file_path = os.path.join("syllabus", "new.pdf")

        if not os.path.exists(file_path):
            print("Not found")
            return jsonify({"message": "Syllabus file does not exist on the server"}), 404

        return send_file(file_path, as_attachment=False)

    except Exception as e:
        print(e)
        return jsonify({"message": f"Error fetching Syllabus: {str(e)}"}), 500

@app.route('/modify-syllabus', methods=['POST'])
def modify_syllabus():
    data = request.json
    course_name = data.get('courseName')
    username = data.get('username')
    role = data.get('role')
    new_content = data.get('content')  # New syllabus content from the editor

    # Authenticate user
    user = users_col.find_one({"username": username, "role": role})
    if not user:
        return jsonify({'message': 'Teacher not found'}), 404

    # Get the path to the existing syllabus file
    file_name = f"{(username+'_'+course_name).lower().replace(' ', '_')}_syllabus.md"
    file_path = os.path.join("syllabus", file_name)

    # Check if the file exists
    if not os.path.exists(file_path):
        return jsonify({'message': 'Syllabus file not found'}), 404

    # Update the syllabus file with new content
    with open(file_path, "w") as f:
        f.write(new_content)

    return jsonify({
        'message': 'Syllabus modified successfully',
        'syllabusContent': new_content
    }), 200


@app.route('/companies', methods=['GET'])
def get_companies():
    response = []
    recruiters = recruiters_col.find()
    for rec in recruiters:
        visible_roles = []
        for role in roles_col.find({"company_id": rec["_id"], "status": {"$ne": 0}}):
            visible_roles.append({
                "role_id": str(role["_id"]),  # Convert ObjectId to string
                "roleTitle": role['roleTitle'],
                "location": role['location'],
                "totalCTC": role['totalCTC'],
                "roleDescription": role['roleDescription'],
                "jd": role['jd'],
                "deadline": role['deadline'],
                "status": 1 if role['status'] == 1 else 0
            })
        if visible_roles:
            response.append({
                'id': str(rec["_id"]),  # Convert ObjectId to string
                'name': rec['companyName'],
                'description': rec['companyDesc'],
                'website': rec['companyWebsite'],
                'roles': visible_roles
            })
    return jsonify(response), 200

@app.route('/apply-role', methods=['POST'])
def apply_role():
    data = request.json
    username = data['username']
    role_id = ObjectId(data['role_id'])

    user = users_col.find_one({"username": username, "role": "student"})
    if not user:
        return jsonify({'message': 'User not found or not a student'}), 404

    details_id = user['details_id']

    # Retrieve the role and candidate information
    role = roles_col.find_one({"_id": role_id})
    if not role:
        return jsonify({'message': 'Role not found'}), 404

    candidate = students_col.find_one({"_id": ObjectId(details_id)})
    if not candidate:
        return jsonify({'message': 'Candidate not found'}), 404

    # Prepare the references for analysis
    matching_data = {
        "job": role['jd_extract'],  # Assuming 'jd_extract' contains the job requirements
        "candidate": candidate['resume_extract']  # Assuming 'resume_extract' contains the candidate's qualifications
    }

    # Send the data to the FastAPI analysis service
    analysis_endpoint = "http://127.0.0.1:7000/matching/analyse"
    response = requests.post(analysis_endpoint, json=matching_data)

    if response.status_code == 200:
        response_content = response.json()
        score = response_content.get("score", 0)
        summary_comment = response_content.get("summary_comment", "No summary available")

        # Update the candidate's application status with the analysis result
        students_col.update_one(
            {"_id": details_id},
            {
                "$push": {
                    "application_status": {
                        "role_id": role_id,
                        "status": 1,
                        "score": score,
                        "summary_comment": summary_comment
                    }
                }
            }
        )

        # Update the role document with the candidate
        roles_col.update_one(
            {"_id": role_id},
            {"$push": {"candidates": ObjectId(details_id)}}
        )

        return jsonify({'message': 'Application successful', 'score': score, 'summary_comment': summary_comment}), 200

    else:
        return jsonify({'message': 'Failed to analyze candidate', 'error': response.text}), 500


@app.route('/add-role', methods=['POST'])
def add_role():
    data = request.json
    username = data['username']
    role_data = data['role']

    user = users_col.find_one({"username": username, "role": "recruiter"})
    if not user:
        return jsonify({'message': 'Recruiter not found'}), 404

    details_id = user['details_id']
    new_role = {
        'company_id': ObjectId(details_id),
        'roleTitle': role_data['RoleTitle'],
        'roleDescription': role_data['RoleDescription'],
        'location': role_data['Location'],
        'totalCTC': role_data['CTC'],
        'jd': None,
        'candidates': [],
        'deadline': None,
        'status': 0  # Status 0 since no JD is uploaded yet
    }

    # Insert the new role into the roles collection
    new_role_id = roles_col.insert_one(new_role).inserted_id

    # Update the recruiter's roles with the new role
    recruiters_col.update_one(
        {"_id": ObjectId(details_id)},
        {"$push": {"roles": {"role_id": new_role_id, "status": 0}}}
    )

    # Convert the ObjectId to string before returning the role
    new_role['_id'] = str(new_role_id)
    new_role['company_id'] = str(new_role['company_id'])

    return jsonify({'message': 'Role added successfully', 'role': new_role}), 201

@app.route('/get-roles', methods=['GET'])
def get_roles():
    username = request.args.get('username')
    if not username:
        return jsonify({"message": "Username is required"}), 400
    user = users_col.find_one({"username": username})
    if not user:
        return jsonify({"message": "User not found"}), 404
    if user['role'] != 'recruiter':
        return jsonify({"message": "User is not a recruiter"}), 403
    details_id = user['details_id']
    recruiter = recruiters_col.find_one({"_id": ObjectId(details_id)})
    if not recruiter:
        return jsonify({"message": "Recruiter details not found"}), 404
    
    roles = []
    for role_info in recruiter['roles']:
        role_id = role_info['role_id']
        role = roles_col.find_one({"_id": ObjectId(role_id)})
        if role:
            roles.append({
                "role_id": str(role["_id"]),  # Convert ObjectId to string
                "roleTitle": role["roleTitle"],
                "roleDescription": role["roleDescription"],
                "jd": role["jd"],
                "candidates": [str(candidate_id) for candidate_id in role["candidates"]],  # Convert candidate ObjectIds to strings
                "deadline": role["deadline"],
                "status": role["status"]
            })
    
    return jsonify({"roles": roles}), 200

@app.route('/upload-jd', methods=['POST'])
def upload_jd():
    username = request.form['username']
    role_id = request.form['role_id']
    jd_file = request.files['jd']
    #print(username,role_id)
    user = users_col.find_one({"username": username, "role": "recruiter"})
    if not user:
        return jsonify({'message': 'Recruiter not found'}), 404

    role = roles_col.find_one({"_id": ObjectId(role_id)})
    if not role:
        return jsonify({'message': 'Role not found'}), 404

    # Save the JD file to the server
    role_name = role['roleTitle']
    #print(role_name)
    filename = f"{username}_{role_name}.pdf"
    file_path = os.path.join(JD_FOLDER, filename)
    jd_file.save(file_path)

    jd_file.stream.seek(0)
    analysis_endpoint = "http://127.0.0.1:7000/job/analyse"
    files = {"file": (jd_file.filename, jd_file.stream, jd_file.mimetype)}
    
    try:
        response = requests.post(analysis_endpoint, files=files)
        response.raise_for_status()  # Raise an error for bad status codes
        
        # Get the content of the response
        response_content = response.json()
        #print("Response Content:", response_content)
        
        # Update the details with analysis results
        roles_col.update_one(
            {"_id": ObjectId(role_id)},
            {"$set": {"jd": file_path, "status": 1, "jd_extract": response_content}}
        )

        updated_role = roles_col.find_one({"_id": ObjectId(role_id)})
        updated_role['_id'] = str(updated_role['_id'])
        updated_role['company_id'] = str(updated_role['company_id'])

        return jsonify({'message': 'JD uploaded and analyzed', 'role': updated_role}), 200

    except requests.exceptions.RequestException as e:
        print(f"Error communicating with analysis service: {e}")
        return jsonify({'message': 'Failed to analyze JD', 'error': str(e)}), 500

@app.route('/view-jd/<role_id>', methods=['GET'])
def view_jd(role_id):
    try:
        # Find the role in the database using the role_id
        role = roles_col.find_one({"_id": ObjectId(role_id)})
        if not role or not role.get("jd"):
            return jsonify({"message": "JD file not found"}), 404

        # Get the file path from the role document
        file_path = role["jd"]
        if not os.path.exists(file_path):
            return jsonify({"message": "JD file does not exist on the server"}), 404

        # Serve the JD file
        return send_file(file_path, as_attachment=False)

    except Exception as e:
        return jsonify({"message": f"Error fetching JD: {str(e)}"}), 500
    
@app.route('/view-resume/<candidate_id>', methods=['GET'])
def view_resume(candidate_id):
    try:
        # Find the role in the database using the role_id
        student = students_col.find_one({"_id": ObjectId(candidate_id)})
        if not student or not student.get("resume"):
            return jsonify({"message": "JD file not found"}), 404

        # Get the file path from the role document
        file_path = student["resume"]
        if not os.path.exists(file_path):
            return jsonify({"message": "Resume file does not exist on the server"}), 404

        # Serve the JD file
        return send_file(file_path, as_attachment=False)

    except Exception as e:
        return jsonify({"message": f"Error fetching Resume: {str(e)}"}), 500
    
@app.route('/match_resume', methods=['POST'])
def match_resume():
    username = request.json['username']
    k = int(request.json['numCandidates'])
    role_id = ObjectId(request.json['role_id'])
    
    role = roles_col.find_one({"_id": role_id})
    if not role:
        return jsonify({"message": "Role not found"}), 404

    available_candidates = role['candidates']
    if not available_candidates:
        return jsonify({"message": "No candidates found"}), 404

    candidate_scores = []
    for cid in available_candidates:
        candidate = students_col.find_one({"_id": ObjectId(cid)}, {"application_status": 1})
        if candidate:
            for app_status in candidate['application_status']:
                if app_status['role_id'] == role_id:
                    candidate_scores.append({
                        "candidate_id": cid,
                        "score": app_status.get("score", 0)
                    })
                    break

    candidate_scores.sort(key=lambda x: x["score"], reverse=True)
    selected_candidates = [candidate['candidate_id'] for candidate in candidate_scores[:k]]

    roles_col.update_one(
        {"_id": role_id},
        {"$set": {"candidates": selected_candidates, "status": 2}}
    )

    for candidate in candidate_scores[:k]:
        students_col.update_one(
            {"_id": ObjectId(candidate['candidate_id']), "application_status.role_id": role_id},
            {"$set": {"application_status.$.status": 2, "application_status.$.score": candidate['score']}}
        )

    non_selected_candidates = set(available_candidates) - set(selected_candidates)
    for cid in non_selected_candidates:
        students_col.update_one(
            {"_id": ObjectId(cid), "application_status.role_id": role_id},
            {"$set": {"application_status.$.status": 5}}
        )

    selected_candidates_str = convert_objectid_to_str(selected_candidates)

    return jsonify({
        "message": "Candidates updated after matching resume",
        "selected_candidates": selected_candidates_str
    }), 200


@app.route('/fetch-candidates', methods=['POST'])
def fetch_candidates():
    role_id = request.json['role_id']  # Expecting role_id to be a string
    role = roles_col.find_one({"_id": ObjectId(role_id)})
    
    if not role or 'candidates' not in role:
        return jsonify({"message": "Role not found or no candidates found"}), 400

    candidate_ids = role['candidates']

    candidates = []
    for cid in candidate_ids:
        candidate = students_col.find_one({"_id": ObjectId(cid)})
        if candidate:
            for app in candidate['application_status']:
                if app['role_id'] == ObjectId(role_id):
                    candidate_data = {
                        "id": str(cid),
                        "legalName": candidate["legalName"],
                        "gender": candidate["gender"],
                        "gpa": candidate["gpa"],
                        "resume": candidate["resume"],
                        "score": app['score']
                    }
                    candidates.append(candidate_data)
                    break
    return jsonify(candidates), 200


@app.route('/update-candidates-status', methods=['POST'])
def update_candidates_status():
    role_id = request.json.get('role_id')
    selected_candidates = [ObjectId(cid) for cid in request.json.get('selected_candidates', [])]
    role = roles_col.find_one({"_id": ObjectId(role_id)})
    available_candidates = role['candidates']
    roles_col.update_one(
        {"_id": ObjectId(role_id)},
        {"$set": {"candidates": selected_candidates, "status": 3}}
    )
    for cid in selected_candidates:
        students_col.update_one(
            {"_id": ObjectId(cid), "application_status.role_id": ObjectId(role_id)},
            {"$set": {"application_status.$.status": 3}}
        )
    # Update the status of the non-selected candidates to 5 (Rejected)
    non_selected_candidates = set(available_candidates) - set(selected_candidates)
    for cid in non_selected_candidates:
        students_col.update_one(
            {"_id": ObjectId(cid), "application_status.role_id": ObjectId(role_id)},
            {"$set": {"application_status.$.status": 5}}
        )
    print(available_candidates,selected_candidates, non_selected_candidates)
    return jsonify({'message': 'Candidates status updated successfully'}), 200

@app.route('/complete-interviews', methods=['POST'])
def complete_interviews():
    role_id = request.json.get('role_id')
    username = request.json.get('username')

    user = users_col.find_one({"username": username, "role": "student"})
    if not user:
        return jsonify({'message': 'User not found or not a student'}), 404

    details_id = user['details_id']
    score = random.randint(50, 100)

    students_col.update_one(
        {"_id": ObjectId(details_id), "application_status.role_id": ObjectId(role_id), "application_status.status": 3},
        {"$set": {"application_status.$.status": 4, "application_status.$.score": score}}
    )

    return jsonify({'message': 'Interview completed and score assigned'}), 200

@app.route('/finish-interviews', methods=['POST'])
def finish_interviews():
    role_id = request.json.get('role_id')

    role = roles_col.find_one({"_id": ObjectId(role_id)})
    candidate_ids = role['candidates']
    for cid in candidate_ids:
        students_col.update_one(
            {"_id": ObjectId(cid), "application_status.role_id": ObjectId(role_id), "application_status.status": 3},
            {"$set": {"application_status.$.status": 4, "application_status.$.score": random.randint(50, 100)}}
        )

    roles_col.update_one(
        {"_id": ObjectId(role_id)},
        {"$set": {"status": 4}}
    )

    return jsonify({'message': 'Interviews completed and scores assigned'}), 200


if __name__ == '__main__':
    app.run(debug=True)
