#!/usr/bin/env python
import sys
from mumbaihacks.crew import TaskAutomationCrew


def run():
    """
    Run the crew for Requirement to User Story process.
    """
    inputs = {
        'initial_request': '''The client needs a ecommerce website for this bicycle store'''
    }
    TaskAutomationCrew().crew().kickoff(inputs=inputs)
