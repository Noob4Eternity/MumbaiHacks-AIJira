from flask import Flask, request, jsonify
from flask_cors import CORS
from mumbaihacks.crew import TaskAutomationCrew
import os
import logging
from functools import wraps

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)

# Updated CORS configuration
CORS(app, resources={
    r"/api/*": {
        "origins": ["http://localhost:3000", "http://127.0.0.1:3000"],
        "methods": ["GET", "POST", "OPTIONS"],
        "allow_headers": ["Content-Type", "X-API-Key"],
        "expose_headers": ["Content-Type"]
    }
})

def validate_api_key(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        api_key = request.headers.get('X-API-Key')
        expected_key = os.getenv('API_KEY', 'your-api-key-here')  # Fallback for development
        
        if not api_key:
            return jsonify({'error': 'Missing API key'}), 401
        if api_key != expected_key:
            return jsonify({'error': 'Invalid API key'}), 401
        return f(*args, **kwargs)
    return decorated_function

@app.route('/api/v1/generate-user-story', methods=['POST'])
@validate_api_key
def generate_user_story():
    """Generate a user story and task breakdown from requirements"""
    try:
        if not request.is_json:
            return jsonify({'error': 'Request must be JSON'}), 400

        data = request.get_json()
        if 'initial_request' not in data:
            return jsonify({'error': 'Missing initial_request field'}), 400

        crew = TaskAutomationCrew()
        result = crew.crew().kickoff(inputs={
            'initial_request': data['initial_request']
        })

        result_dict = {
            'status': 'success',
            'result': {
                'output': str(result),
                'artifacts': result.artifacts if hasattr(result, 'artifacts') else [],
                'raw_output': result.raw_output if hasattr(result, 'raw_output') else None,
            }
        }

        return jsonify(result_dict), 200

    except Exception as e:
        logger.error(f"Error processing request: {str(e)}", exc_info=True)
        return jsonify({
            'status': 'error',
            'error': str(e)
        }), 500

if __name__ == '__main__':
    port = int(os.getenv('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)