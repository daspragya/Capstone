import json
import os
import time

import jsbeautifier
from langchain.schema import HumanMessage, SystemMessage
from langchain_google_genai import ChatGoogleGenerativeAI
from src.matching.config import matching_config
from src.matching.prompts import fn_matching_analysis, system_prompt_matching
from src.utils import LOGGER
from pymongo import MongoClient

client = MongoClient("mongodb+srv://pragyadas:Test123@capstone.3sv7a.mongodb.net/")  # Update with your MongoDB URI
db = client["capstone_project_db"]

roles_col = db["roles"]
students_col = db["students"]


def output2json(output):
    """GPT Output Object >>> json"""
    opts = jsbeautifier.default_options()
    return json.loads(jsbeautifier.beautify(output["function_call"]["arguments"], opts))



def generate_content(job, candidate):
    content = "\nRequirement:" + str(job) + "\nCandidate:" + str(candidate)
    return content


def analyse_matching(matching_data):
    start = time.time()
    LOGGER.info("Start analyse matching")

    content = generate_content(job=matching_data.job, candidate=matching_data.candidate)

    llm = ChatGoogleGenerativeAI(model='gemini-1.5-flash', temperature=0.5)
    completion = llm.invoke(
        [
            SystemMessage(content=system_prompt_matching),
            HumanMessage(content=content),
        ],
        functions=fn_matching_analysis,
    )
    output_analysis = completion.additional_kwargs

    json_output = output2json(output=output_analysis)

    # Extract scores and calculate final score
    weights = {
        "degree": 0.1,
        "experience": 0.2,
        "technical_skill": 0.3,
        "responsibility": 0.25,
        "certificate": 0.1,
        "soft_skill": 0.05,
    }
    total_weight = 0
    weighted_score = 0

    for section in json_output:
        if section != "summary_comment" and json_output[section]!="unknown":
            weighted_score += int(json_output[section]["score"]) * weights.get(section, 0)
            total_weight += weights.get(section, 0)

    final_score = round(weighted_score / total_weight, 2)

    # Extract the summary comment
    summary_comment = json_output.get("summary_comment", "No summary available")
    print(f"Summary Comment: {summary_comment}")

    LOGGER.info("Done analyse matching")
    LOGGER.info(f"Time analyse matching: {time.time() - start}")

    return {
        "score": final_score,
        "summary_comment": summary_comment,
        "detailed_analysis": json_output
    }
