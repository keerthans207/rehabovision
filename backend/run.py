"""
Run script for RehaboVision AI Backend
Ensures proper Python path setup
"""

import sys
from pathlib import Path

# Add backend directory to Python path
BACKEND_DIR = Path(__file__).parent
sys.path.insert(0, str(BACKEND_DIR))

# Now import and run the app
from api.app import app

if __name__ == '__main__':
    port = 5000
    print(f"Starting RehaboVision AI Backend on http://localhost:{port}")
    print("Press Ctrl+C to stop")
    app.run(host='0.0.0.0', port=port, debug=True)
