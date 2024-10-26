from flask import Flask, request, jsonify
from mumbaihacks.crew import TaskAutomationCrew  # Changed import
import os
import logging
from functools import wraps

#Configure logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)

def validate_api_key(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        api_key = request.headers.get('X-API-Key')
        if not api_key or api_key != os.getenv('API_KEY'):
            return jsonify({'error': 'Invalid or missing API key'}), 401
        return f(*args, **kwargs)
    return decorated_function

def validate_request(required_fields):
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            if not request.is_json:
                return jsonify({'error': 'Request must be JSON'}), 400
            
            data = request.get_json()
            missing_fields = [field for field in required_fields if field not in data]
            
            if missing_fields:
                return jsonify({
                    'error': 'Missing required fields',
                    'missing_fields': missing_fields
                }), 400
                
            return f(*args, **kwargs)
        return decorated_function
    return decorator

@app.route('/health', methods=['GET'])
def health_check():
    """Basic health check endpoint"""
    return jsonify({'status': 'healthy', 'service': 'task-automation-api'}), 200

@app.route('/api/v1/generate-user-story', methods=['POST'])
@validate_api_key
@validate_request(['initial_request'])
def generate_user_story():
    """
    Generate a user story and task breakdown from requirements
    
    Expected JSON body:
    {
        "initial_request": "Detailed project requirements..."
    }
    """
    try:
        data = request.get_json()
        crew = TaskAutomationCrew()
        
        # Execute the crew workflow
        result = crew.crew().kickoff(inputs={
            'initial_request': data['initial_request']
        })
        
        # Convert CrewOutput to dictionary
        result_dict = {
            'output': str(result),  # Convert the main output to string
            'artifacts': result.artifacts if hasattr(result, 'artifacts') else [],
            'raw_output': result.raw_output if hasattr(result, 'raw_output') else None,
        }
        
        return jsonify({
            'status': 'success',
            'result': result_dict
        }), 200
        
    except Exception as e:
        logger.error(f"Error processing request: {str(e)}", exc_info=True)
        return jsonify({
            'status': 'error',
            'error': str(e)
        }), 500

@app.route('/api/v1/agents', methods=['GET'])
@validate_api_key
def list_agents():
    """List all available agents in the system"""
    try:
        crew = TaskAutomationCrew()
        agents = [
            {
                'name': agent_name,
                'role': agent_config['role'],
                'goal': agent_config['goal'],
                'backstory': agent_config['backstory']
            }
            for agent_name, agent_config in crew.agents_config.items()
        ]
        
        return jsonify({
            'status': 'success',
            'agents': agents
        }), 200
        
    except Exception as e:
        logger.error(f"Error listing agents: {str(e)}", exc_info=True)
        return jsonify({
            'status': 'error',
            'error': str(e)
        }), 500

@app.route('/api/v1/tasks', methods=['GET'])
@validate_api_key
def list_tasks():
    """List all available tasks and their dependencies"""
    try:
        crew = TaskAutomationCrew()
        tasks = [
            {
                'name': task_name,
                'description': task_config['description'],
                'expected_output': task_config['expected_output'],
                'dependencies': task_config.get('dependencies', [])
            }
            for task_name, task_config in crew.tasks_config.items()
        ]
        
        return jsonify({
            'status': 'success',
            'tasks': tasks
        }), 200
        
    except Exception as e:
        logger.error(f"Error listing tasks: {str(e)}", exc_info=True)
        return jsonify({
            'status': 'error',
            'error': str(e)
        }), 500

if __name__ == '__main__':
    # Load environment variables
    if not os.getenv('API_KEY'):
        logger.warning("API_KEY environment variable not set!")
    
    if not os.getenv('GEMINI_API_KEY'):
        logger.warning("GEMINI_API_KEY environment variable not set!")
    
    # Run the Flask application
    port = int(os.getenv('PORT', 5000))
    app.run(host='0.0.0.0', port=port)