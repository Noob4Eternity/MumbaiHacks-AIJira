#!/usr/bin/env python
import sys
from mumbaihacks.crew import TaskAutomationCrew


def run():
    """
    Run the crew for Requirement to User Story process.
    """
    inputs = {
        'initial_request': '''Make me an online clothing Thrift Store, which is super personalized for Users. Give options to sort by gender, age and Trends. Include an option to shop by Generation (for e.g. the 1990s, 2000s etc). It should also have an AI Studio for People to design and view their outfits based on a user's existing wardrobe'''
    }
    TaskAutomationCrew().crew().kickoff(inputs=inputs)
