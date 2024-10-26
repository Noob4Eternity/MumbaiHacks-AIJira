# src/latest_ai_development/crew.py
from crewai import Agent, Crew, Process, Task
from crewai.project import CrewBase, agent, crew, task
from crewai import LLM
import os
import yaml
from dotenv import load_dotenv

load_dotenv()

# Set up API key and model
os.environ['GEMINI_API_KEY'] = os.getenv("GEMINI_API_KEY")
model = LLM(
    model=os.getenv("GEMINI_LLM_MODEL"),
    verbose=True,
    google_api_key=os.getenv("GEMINI_API_KEY"),
)


@CrewBase
class TaskAutomationCrew:
    """Crew to create a user story and break it down from requirements"""

    def __init__(self):
        # Load agents and tasks from YAML files
        self.agents_config = self.load_yaml(
            'mumbaihacks/config/agents.yaml')
        self.tasks_config = self.load_yaml(
            'mumbaihacks/config/tasks.yaml')

    def load_yaml(self, filepath):
        """Load YAML file and return its content."""
        with open(filepath, 'r') as file:
            return yaml.safe_load(file)

    @agent
    def requirement_collector(self) -> Agent:
        return Agent(config=self.agents_config['requirement_collector'], verbose=True, llm=model)

    @agent
    def user_persona_identifier(self) -> Agent:
        return Agent(config=self.agents_config['user_persona_identifier'], verbose=True, llm=model)

    @agent
    def user_goal_definer(self) -> Agent:
        return Agent(config=self.agents_config['user_goal_definer'], verbose=True, llm=model)

    @agent
    def user_benefit_outliner(self) -> Agent:
        return Agent(config=self.agents_config['user_benefit_outliner'], verbose=True, llm=model)

    @agent
    def user_story_creator(self) -> Agent:
        return Agent(config=self.agents_config['user_story_creator'], verbose=True, llm=model)

    @agent
    def story_validator(self) -> Agent:
        return Agent(config=self.agents_config['story_validator'], verbose=True, llm=model)

    @agent
    def task_breakdown(self) -> Agent:
        return Agent(config=self.agents_config['task_breakdown'], verbose=True, llm=model)

    @agent
    def effort_estimator(self) -> Agent:
        return Agent(config=self.agents_config['effort_estimator'], verbose=True, llm=model)

    @agent
    def priority_assigner(self) -> Agent:
        return Agent(config=self.agents_config['priority_assigner'], verbose=True, llm=model)

    @task
    def gather_requirements_task(self) -> Task:
        return Task(config=self.tasks_config['gather_requirements_task'],
                    agent=self.requirement_collector(),)

    @task
    def identify_user_persona_task(self) -> Task:
        return Task(config=self.tasks_config['identify_user_persona_task'],
                    agent=self.user_persona_identifier(),)

    @task
    def define_user_goal_task(self) -> Task:
        return Task(config=self.tasks_config['define_user_goal_task'],
                    agent=self.user_goal_definer(),)

    @task
    def outline_user_benefit_task(self) -> Task:
        return Task(config=self.tasks_config['outline_user_benefit_task'],
                    agent=self.user_benefit_outliner(),)

    @task
    def create_user_story_task(self) -> Task:
        return Task(config=self.tasks_config['create_user_story_task'],
                    agent=self.user_story_creator(),)

    @task
    def validate_user_story_task(self) -> Task:
        return Task(config=self.tasks_config['validate_user_story_task'],
                    agent=self.story_validator(),)

    @task
    def breakdown_user_story_task(self) -> Task:
        return Task(config=self.tasks_config['breakdown_user_story_task'],
                    agent=self.task_breakdown(),)

    @task
    def estimate_effort_task(self) -> Task:
        return Task(config=self.tasks_config['estimate_effort_task'],
                    agent=self.effort_estimator(),)

    @task
    def assign_priority_task(self) -> Task:
        return Task(config=self.tasks_config['assign_priority_task'],
                    agent=self.priority_assigner(),)

    @crew
    def crew(self) -> Crew:
        """Creates the RequirementToUserStory crew"""
        return Crew(
            agents=self.agents,
            tasks=self.tasks,
            process=Process.sequential,
            verbose=True,
        )
