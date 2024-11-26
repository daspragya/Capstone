import os
from dotenv import load_dotenv
from tasks import CurriculumTasks
from agents import Agents
from crewai import Crew
from crewai_tools import JSONSearchTool  # Updated import path

# Load environment variables
load_dotenv()

import json
from bs4 import BeautifulSoup
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
import time
import warnings

# Initialize Selenium WebDriver
def initialize_driver():
    service = Service(executable_path="chromedriver.exe")
    driver = webdriver.Chrome(service=service)
    return driver

# Function to scrape the syllabus from a module URL or course page
def scrape_internal_syllabus(driver, url=None, internal_soup=None):
    if internal_soup is None:
        # If internal_soup is not provided, navigate to the URL and parse the page
        if url:
            print(f"Navigating to URL: {url}")
            driver.get(url)
            time.sleep(3)  # Wait for page to load
            internal_soup = BeautifulSoup(driver.page_source, 'html.parser')
        else:
            print("Error: Either 'url' or 'internal_soup' must be provided.")
            return "No syllabus found."
    
    syllabus_section = internal_soup.find('div', {'class': 'css-m9zcdt'})  # Adjust this selector if needed

    syllabus_content = []
    processed_sections = set()  # To track processed content and avoid duplicates

    if syllabus_section:
        module_sections = syllabus_section.find_all('div', {'class': 'css-1pi3g2x'})
        module_sections.extend(syllabus_section.find_all('div', {'class': 'css-1pe5kh6'}))
        for section in module_sections:
            module_title_element = section.find('h3')
            if not module_title_element:
                continue
            
            module_title = module_title_element.get_text(strip=True)
            if module_title in processed_sections:
                # Skip if this module title is already processed
                continue
            processed_sections.add(module_title)  # Mark this title as processed

            module_info = {'Module Title': module_title, 'Internal Syllabus': []}
            print("Module Title:", module_title)

            # Collect all items within the section's ul tags
            list_type_elements = section.find_all('span', {'class': 'css-1gn6gmm'})
            uls = section.find_all('ul', {'class': 'css-1xgnkn7'})
            for list_type_element, ul in zip(list_type_elements, uls):
                list_type = list_type_element.get_text(strip=True) if list_type_element else "Unknown List Type"
                items = [li.get_text(strip=True).split('•')[0] for li in ul.find_all('li')]
                module_info['Internal Syllabus'].append({list_type: items})

            syllabus_content.append(module_info)
            print("Extracted Module Content:", module_info)

    print("Final syllabus content:", syllabus_content)
    return syllabus_content if syllabus_content else "No syllabus found."


# Function to scrape the offered and syllabus of the first 5 courses
def scrape_course_details(course_name, fileName):
    search_query = course_name.replace(" ", "%20")
    url = f'https://www.coursera.org/search?query={search_query}'
    print(f"Searching for courses with query: {search_query}")

    driver = initialize_driver()
    driver.get(url)
    time.sleep(5)  # Wait for page to load

    # Parse search results with BeautifulSoup
    soup = BeautifulSoup(driver.page_source, 'html.parser')
    course_links = [
        f"https://www.coursera.org{a['href']}" if a['href'].startswith('/') else a['href']
        for a in soup.find_all('a', class_="cds-119 cds-113 cds-115 cds-CommonCard-titleLink css-si869u cds-142")
    ][:3]
    print("Found course links:", course_links)
    driver.quit()

    courses = []
    for link in course_links:
        print(f"Processing course link: {link}")
        driver = initialize_driver()
        driver.get(link)
        time.sleep(3)  # Wait for page to load

        course_soup = BeautifulSoup(driver.page_source, 'html.parser')
        title_element = course_soup.find('h1', {'class': 'css-1xy8ceb'})
        title = title_element.get_text(strip=True) if title_element else "N/A"
        print("Course Title:", title)
        
        offered_element = course_soup.find('span', {'class': 'css-6ecy9b'})
        offered = offered_element.get_text(strip=True) if offered_element else "N/A"
        print("Course Offered By:", offered)

        syllabus_section = course_soup.find('div', {'class': 'css-fndret'})
        modules = []
        
        # Iterate through each subsection and get module details
        if syllabus_section:
            subsection_divs = syllabus_section.find_all('div', {'class': 'css-1pi3g2x'})
            subsection_divs.extend(syllabus_section.find_all('div', {'class': 'css-1pe5kh6'}))
            module_info = []
            print(f"Found {len(subsection_divs)} subsections for modules.")
            if syllabus_section.find('a',{'class':'cds-119 cds-113 cds-115 css-1jglcdr cds-142'}):
                for subsection in subsection_divs:
                    module_title_element = subsection.find('h3')
                    module_title = module_title_element.get_text(strip=True) if module_title_element else "N/A"
                    module_info_curr = {'Module Title': module_title, 'Internal Syllabus': []}
                    print("Module Title:", module_title)

                    # Collect all links in the module title and scrape each link
                    link_tags = module_title_element.find_all('a')
                    print(f"Found {len(link_tags)} links in module title.")
                    for link_tag in link_tags:
                        if 'href' in link_tag.attrs:
                            module_url = f"https://www.coursera.org{link_tag['href']}"
                            print(f"Following module URL: {module_url}")
                            internal_syllabus = scrape_internal_syllabus(driver, url=module_url)
                            module_info_curr['Internal Syllabus'].append({'Redirected URL': module_url, 'Syllabus': internal_syllabus})
                    module_info.append(module_info_curr)
            else:
                print("No links found, scraping syllabus directly from current page.")
                module_info = scrape_internal_syllabus(driver, internal_soup=course_soup)

            modules.append(module_info)
            print("Module info:", module_info)

        courses.append({
            'Course Name': title,
            'Offered': offered,
            'Modules': modules
        })
        driver.quit()
        print("Course info added:", courses[-1])

    print("Final scraped data for all courses:", courses)
    data = {course_name: courses}
    json_filename = f"{fileName}.json"
    with open(json_filename, 'w') as json_file:
        json.dump(data, json_file, indent=4)
    print(f"Data saved to {json_filename}.")

def generate_syllabus(course,username,modules=4, topics=12):
    print(f"Course name: {course}")

    # Specify the path to your JSON file
    json_path = f"{course}.json"

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
