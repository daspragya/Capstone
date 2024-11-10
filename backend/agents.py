import os
from dotenv import load_dotenv
load_dotenv()
from crewai import Agent, LLM
from crewai_tools import JSONSearchTool  # Updated import path


llm = LLM(
    model="gemini/gemini-1.5-flash",
    temperature=0.5,
    gemini_api_key = "AIzaSyBqLUxA_K3H2w3PIJsJ1qm26I7ZDo39XEA"
)

class Agents():
  def curriculum_designer_agent(self,json_rag_tool):
    return Agent(
      role = 'Curriculum Designer',
      goal = "Analyse the JSON data which consists of course syllabus of the from top institues, we need to create a curriculum by considering syllabus of different institues, the new curriculum consists of modules, each with topics and labSessions in the given json File Modules array consists of syllabus from various insititues you have to go through each of syllabus and internal syllabus and analyze them",
      tools = [json_rag_tool],
      backstory= (
        "The agent is skilled at organizing educational content and can read through JSON data to identify topics. "
        "It will categorize topics into main themes, aiming to consolidate content into different modules with "
        "exactly distinct topics each."
        "and also provide labSessions for each module"
      ),
      verbose=True,
      llm=llm
    )
  
  def curriculum_builder_agent(self,json_rag_tool):
    return Agent(
      role = "Curriculum Builder",
      goal = (
        "Analyze the JSON data file containing multiple course structures to extract, organize, and consolidate content "
        "into a single unified curriculum. The curriculum will consist of diffetent modules, each containing exactly topics and labSession for each module."
      ),
      tools = [json_rag_tool],
      backstory = (
         "Expert in curriculum design and educational content structuring, with the ability to analyze multiple course structures, "
          "identify key topics, and create a cohesive curriculum organized into modules. Uses insights from JSON data to construct "
          "a structured and comprehensive learning path tailored for a unified curriculum."
      ),
      verbose = True,
      llm = llm
    )