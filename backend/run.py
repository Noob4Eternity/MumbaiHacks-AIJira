import sys
from pathlib import Path

# Add the backend directory to Python path
sys.path.append(str(Path(__file__).parent))

from dotenv import load_dotenv
load_dotenv()  # Load environment variables from .env file

from mumbaihacks.api import app

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)