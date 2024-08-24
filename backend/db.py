from pymongo import MongoClient

client = MongoClient("mongodb+srv://pragyadas:Test123@capstone.3sv7a.mongodb.net/")  # Replace with your MongoDB connection string
db = client["capstone_project_db"]  # Database name
users_col = db["users"]  # Users collection
students_col = db["students"]  # Students collection
recruiters_col = db["recruiters"]  # Recruiters collection
roles_col = db["roles"]  # Roles collection



'''

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
        "details_id": 1
    },
    "janesmith": {
        "password": "janesmith",
        "role": "student",
        "details_id": 2
    },
    "alicejohnson": {
        "password": "alicejohnson",
        "role": "student",
        "details_id": 3
    },
    "bobbrown": {
        "password": "bobbrown",
        "role": "student",
        "details_id": 4
    },
    "charliedavis": {
        "password": "charliedavis",
        "role": "student",
        "details_id": 5
    },
    "dianaevans": {
        "password": "dianaevans",
        "role": "student",
        "details_id": 6
    },
    "edwardfisher": {
        "password": "edwardfisher",
        "role": "student",
        "details_id": 7
    },
    "fionagreen": {
        "password": "fionagreen",
        "role": "student",
        "details_id": 8
    },
    "georgeharris": {
        "password": "georgeharris",
        "role": "student",
        "details_id": 9
    },
    "hannahivanov": {
        "password": "hannahivanov",
        "role": "student",
        "details_id": 10
    },
    "ianjackson": {
        "password": "ianjackson",
        "role": "student",
        "details_id": 11
    },
    "juliaking": {
        "password": "juliaking",
        "role": "student",
        "details_id": 12
    },
    "kevinlewis": {
        "password": "kevinlewis",
        "role": "student",
        "details_id": 13
    },

    # Recruiters
    "janerecruiter": {
        "password": "janerecruiter",
        "role": "recruiter",
        "details_id": 1
    },
    "markmanager": {
        "password": "markmanager",
        "role": "recruiter",
        "details_id": 2
    }
}

'''