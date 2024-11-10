from textwrap import dedent
from crewai import Task
import os
class CurriculumTasks():
    def analyze_course_data_task(self, agent, json_path,json_tool):
        return Task(
            description=dedent(f"""\ 
                Analyze the JSON file containing various course structures located at "{json_path}". 
                Identify major themes, common topics, and unique content across different courses. 
                Extract essential information that will contribute to creating a unified curriculum.
                """),
            expected_output=dedent("""\
                A summary report detailing the major themes, common topics, and unique content across courses.
                Insights should include a list of potential modules and topics based on the data analysis.
                """),
            tools = [json_tool],
            agent=agent
        )

    def consolidate_topics_task(self, agent,modules,topics,json_tool):
        return Task(
            description=dedent(f"""\
                Based on the analyzed data, consolidate topics into {modules} main modules, each containing {topics} topics.
                Ensure that each module represents a distinct theme (e.g., supervised learning, advanced algorithms).
                Each topic should be unique, representative, and align with the intended learning path.
                """),
            expected_output=dedent(f"""\
                A structured outline with {modules} modules, each containing {topics} well-defined topics. 
                The outline should clearly indicate the theme of each module and the progression of topics within it.
                """),
            tools = [json_tool],
            agent=agent
        )
    
    def format_curriculum_task(self,agent,modules,topics,json_tool):
        return Task(
            description=dedent(f"""\
                Format the finalized curriculum into a structured, readable document, with the {modules} modules 
                and their respective topics and give modules wise description also in the end provide outcome of the enitre course. Ensure that the document layout is clear and 
                well-organized, suitable for presentation or publication. Use markdown formatting for headers, 
                lists, and any other structure needed to enhance readability.
                """),
            expected_output=dedent(f"""\
                A well-formatted markdown document containing the complete curriculum with {modules} modules, 
                each having {topics} topics and a module wise description, outcome of the entire course. The document should be polished and 
                ready for review or publication.
                """),
            tool = [json_tool],
            agent = agent,
            output_file="output.md"
        )


