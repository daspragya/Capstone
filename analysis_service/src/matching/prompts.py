system_prompt_matching = """
Scoring Guide:
It's ok to say candidate does not match the requirement.
Degree Section: Prioritize major than degree level. Candidate with degrees more directly relevant to the required degree should receive higher score, even if their degree level is lower.
Experience Section: Candidate with more relevant experience field get higher score.
Technical Skills Section: Candidate with more relevant technical skills get higher score.
Responsibilities Section: Candidate with more relevant responsibilities get higher score.
Certificates Section: Candidate with required certificates get higher score. Candidate without required certificates get no score. Candidate with related certificates to the position get medium score.
Soft Skills Section: Prioritize foreign language and leadership skills. Candidate with more relevant soft skills get higher score.
All comments should use singular pronouns such as "he", "she", "the candidate", or the candidate's name.
"""

fn_matching_analysis = [
    {
        "name": "evaluate",
        "description": "For each requirement, score in 0 - 100 scale if the candidate match with the requirement or not.",
        "parameters": {
            "type": "object",
            "properties": {
                "degree": {
                    "type": "object",
                    "properties": {
                        "score": {
                            "type": "integer",
                            "minimum": 0,
                            "maximum": 100,
                            "description": "Score if the candidate match with the requirement or not",
                        },
                        "comment": {
                            "type": "string",
                            "description": "What match the requirement, what does not match the requirement",
                        },
                    },
                    "required": ["score", "comment"],
                },
                "experience": {
                    "type": "object",
                    "properties": {
                        "score": {
                            "type": "integer",
                            "minimum": 0,
                            "maximum": 100,
                            "description": "Score if the candidate match with the requirement or not. e.g. 75 ",
                        },
                        "comment": {
                            "type": "string",
                            "description": "What match the requirement, what does not match the requirement",
                        },
                    },
                    "required": ["score", "comment"],
                },
                "technical_skill": {
                    "type": "object",
                    "properties": {
                        "score": {
                            "type": "integer",
                            "minimum": 0,
                            "maximum": 100,
                            "description": "Score if the candidate match with the requirement or not. e.g. 75",
                        },
                        "comment": {
                            "type": "string",
                            "description": "What match the requirement, what does not match the requirement.",
                        },
                    },
                    "required": ["score", "comment"],
                },
                "responsibility": {
                    "type": "object",
                    "properties": {
                        "score": {
                            "type": "integer",
                            "minimum": 0,
                            "maximum": 100,
                            "description": "Score if the candidate match with the requirement or not. e.g. 75",
                        },
                        "comment": {
                            "type": "string",
                            "description": "What match the requirement, what does not match the requirement.",
                        },
                    },
                    "required": ["score", "comment"],
                },
                "certificate": {
                    "type": "object",
                    "properties": {
                        "score": {
                            "type": "integer",
                            "minimum": 0,
                            "maximum": 100,
                            "description": "Score if the candidate match with the requirement or not.",
                        },
                        "comment": {
                            "type": "string",
                            "description": "What match the requirement, what does not match the requirement.",
                        },
                    },
                    "required": ["score", "comment"],
                },
                "soft_skill": {
                    "type": "object",
                    "properties": {
                        "score": {
                            "type": "integer",
                            "minimum": 0,
                            "maximum": 100,
                            "description": "Score if the candidate match with the requirement or not. e.g. 75",
                        },
                        "comment": {
                            "type": "string",
                            "description": "What match the requirement, what does not match the requirement, special soft skill in the CV.",
                        },
                    },
                    "required": ["score", "comment"],
                },
                "summary_comment": {
                    "type": "string",
                    "description": "Provide a concise summary for the recruiter about how the candidate matches the job requirements.",
                },
                "candidate_feedback": {
                    "type": "object",
                    "properties": {
                        "pros": {
                            "type": "string",
                            "description": "Strengths of the candidate's resume with respect to the job description.",
                        },
                        "cons": {
                            "type": "string",
                            "description": "Weaknesses or areas of improvement in the candidate's resume with respect to the job description.",
                        },
                        "skills_to_develop": {
                            "type": "string",
                            "description": "Skills or qualifications the candidate should develop to better align with the job description.",
                        },
                    },
                    "required": ["pros", "cons", "skills_to_develop"],
                },
            },
            "required": [
                "degree",
                "experience",
                "technical_skill",
                "responsibility",
                "certificate",
                "soft_skill",
                "summary_comment",
                "candidate_feedback",
            ],
        },
    }
]