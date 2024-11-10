import os
from dotenv import load_dotenv
from tasks import CurriculumTasks
from agents import Agents
from crewai import Crew
from crewai_tools import JSONSearchTool  # Updated import path

# Load environment variables
load_dotenv()

def generate_syllabus(course,username,modules=4, topics=12):
    print(f"Course name: {course}")

    # Specify the path to your JSON file
    json_path = f"{course
                   }.json"

    try:
        # Initialize JSONSearchTool with the specified JSON file and LLM configuration
        json_rag_tool = JSONSearchTool(
            config={
                "llm": {
                    "provider": "google",
                    "config": {
                        "model": "gemini/gemini-1.5-flash",
                        "api_key": os.getenv("GEMINI_API_KEY")
                    },
                },
                "embedder": {
                    "provider": "google",
                    "config": {
                        "model": "models/embedding-001",
                        "task_type": "retrieval_document",
                    },
                },
            },
            json_path=json_path
        )

        # Initialize task and agent classes
        tasks = CurriculumTasks()
        agents = Agents()

        # Initialize agents
        designer_agent = agents.curriculum_designer_agent(json_rag_tool)
        builder_agent = agents.curriculum_builder_agent(json_rag_tool)

        # Create tasks
        designer_task = tasks.analyze_course_data_task(designer_agent, json_path, json_rag_tool)
        consolidate_task = tasks.consolidate_topics_task(builder_agent, modules, topics, json_rag_tool)
        review_task = tasks.format_curriculum_task(builder_agent, modules, topics, json_rag_tool)

        # Initialize Crew with agents and tasks
        crew = Crew(
            agents=[designer_agent, builder_agent],
            tasks=[designer_task, consolidate_task, review_task]
        )

        # Run the Crew process
        print("Starting Crew process...")
        result = crew.kickoff()
        print("Crew process completed successfully.")

        # Save the result to a Markdown file
        file_path = os.path.join("syllabus", f"{(username + '_' + course).lower().replace(' ', '_')}_syllabus.md")
        with open(file_path, "w") as f:
            f.write(str(result))

        return file_path

    except Exception as e:
        print(f"An error occurred: {e}")
        return None
