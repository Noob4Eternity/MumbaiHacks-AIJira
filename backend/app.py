from flask import Flask, request, jsonify
from flask_cors import CORS  # Import CORS
from mumbaihacks.crew import TaskAutomationCrew

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

@app.route('/client-requirements', methods=['POST'])
def process_client_requirements():
    data = request.json
    requirement = data.get("requirement")

    if not requirement:
        return jsonify({"error": "Requirement is missing"}), 400

    # Start the crew process
    inputs = {'initial_request': requirement}
    output = TaskAutomationCrew().crew().kickoff(inputs=inputs)
    
    # Assuming `kickoff` returns a result you can serialize
    return jsonify({"output": output})

if __name__ == '__main__':
    app.run(debug=True)
