#!/usr/bin/env python
import sys
from mumbaihacks.crew import TaskAutomationCrew


def run():
    """
    Run the crew for Requirement to User Story process.
    """
    inputs = {
        'initial_request': '''The client needs a mobile application that allows users to track their fitness activities. Key features include:User Profiles: Users can create and manage personal profiles.
        Activity Tracking: Users should be able to log activities like running, cycling, and swimming.
        Goal Setting: Users can set fitness goals (e.g., distance, time) and receive reminders.
        Progress Reports: The app should generate weekly progress reports with visual charts.
        Social Sharing: Users can share achievements on social media platforms.'''
    }
    TaskAutomationCrew().crew().kickoff(inputs=inputs)
