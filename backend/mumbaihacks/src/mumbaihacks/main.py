#!/usr/bin/env python
import sys
from mumbaihacks.crew import TaskAutomationCrew


def run():
    """
    Run the crew for Requirement to User Story process.
    """
    inputs = {
        'initial_request': 'Create a web application to deploy a virtual barter system for users to exchange goods and services'
    }
    TaskAutomationCrew().crew().kickoff(inputs=inputs)
