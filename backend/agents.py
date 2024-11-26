import os
from dotenv import load_dotenv
load_dotenv()
from crewai import Agent, LLM
from crewai_tools import JSONSearchTool,WebsiteSearchTool, SerperDevTool, FileReadTool  # Updated import path


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
  
web_search_tool = WebsiteSearchTool(
    config=dict(
        llm=dict(
            provider="google", # or google, openai, anthropic, llama2, ...
            config=dict(
                model="gemini/gemini-1.5-flash",
								api_key =  os.environ["GEMINI_API_KEY"]
                # temperature=0.5,
                # top_p=1,
                # stream=true,
            ),
        ),
        embedder=dict(
            provider="google", # or openai, ollama, ...
            config=dict(
                model="models/embedding-001",
                task_type="retrieval_document",
                # title="Embeddings",
            ),
        ),
    )
)

seper_dev_tool = SerperDevTool()
file_read_tool = FileReadTool(
	file_path='job_description_example.md',
	description='A tool to read the job description example file.'
)
class jdAgent():
  def research_agent(self):
    return Agent(
      role='Research Analyst',
      goal='Analyze the company website and provided description to extract insights on culture, values, and specific needs.',
      tools=[web_search_tool, seper_dev_tool],
      backstory="Expert in analyzing company cultures and identifying key values and needs from various sources, including websites and brief descriptions. When looking for information on internet use 'search_query' as input argument for search tools provided",
      verbose=True,
      llm = llm
    )

  def writer_agent(self):
      return Agent(
        role='Job Description Writer',
        goal='Use insights from the Research Analyst to create a detailed, engaging, and enticing job posting.',
        tools=[web_search_tool, seper_dev_tool, file_read_tool],
        backstory="Skilled in crafting compelling job descriptions that resonate with the company\'s values and attract the right candidates. When looking for information on internet use 'search_query' as input argument for search tools provided",
        verbose=True,
        llm = llm
      )

  def review_agent(self):
      return Agent(
        role='Review and Editing Specialist',
        goal='Review the job posting for clarity, engagement, grammatical accuracy, and alignment with company values and refine it to ensure perfection.',
        tools=[web_search_tool, seper_dev_tool, file_read_tool],
        backstory="A meticulous editor with an eye for detail, ensuring every piece of content is clear, engaging, and grammatically perfect. When looking for information on internet use 'search_query' as input argument for search tools provided",
        verbose=True,
        llm = llm
      )
