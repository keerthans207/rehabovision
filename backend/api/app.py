"""
RehaboVision AI Backend API
Flask server for real-time pose detection and biomechanics analysis
"""

import os
import sys
import json
import base64
from io import BytesIO
from pathlib import Path

# Add parent directory to path so we can import core modules
BACKEND_DIR = Path(__file__).parent.parent
sys.path.insert(0, str(BACKEND_DIR))

from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
import cv2
from PIL import Image

from core.pose_detector import PoseDetector
from core.angle_calculator import calculate_knee_angle, calculate_hip_angle
from core.quality_checker import assess_measurement_quality

app = Flask(__name__)
CORS(app)  # Enable CORS for React frontend

# Initialize pose detector
pose_detector = PoseDetector()

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'service': 'RehaboVision AI Backend',
        'version': '1.0.0'
    })

@app.route('/api/pose/analyze-frame', methods=['POST'])
def analyze_frame():
    """
    Analyze a single frame for pose landmarks and joint angles.
    
    Expected request body:
    {
        "image": "base64_encoded_image_string",
        "exerciseType": "squat" | "knee_extension" | etc.
    }
    
    Returns:
    {
        "success": true,
        "landmarks": [...],
        "measurements": {
            "leftKneeAngle": 95.3,
            "rightKneeAngle": 94.1,
            "leftHipAngle": 87.2,
            "rightHipAngle": 86.8
        },
        "quality": "good" | "uncertain" | "unavailable",
        "qualityReason": "string",
        "movementPhase": "descending" | "ascending" | "standing"
    }
    """
    try:
        data = request.get_json()
        
        if 'image' not in data:
            return jsonify({'success': False, 'error': 'No image provided'}), 400
        
        # Decode base64 image
        image_data = base64.b64decode(data['image'].split(',')[1] if ',' in data['image'] else data['image'])
        image = Image.open(BytesIO(image_data))
        frame = cv2.cvtColor(np.array(image), cv2.COLOR_RGB2BGR)
        
        # Detect pose
        pose_result = pose_detector.process_frame(frame)
        
        if not pose_result['detected']:
            return jsonify({
                'success': True,
                'detected': False,
                'quality': 'unavailable',
                'qualityReason': 'No person detected in frame. Ensure full body is visible.',
                'measurements': None
            })
        
        landmarks = pose_result['landmarks']
        visibility = pose_result['visibility']
        
        # Calculate joint angles
        left_knee = calculate_knee_angle(landmarks, side='left')
        right_knee = calculate_knee_angle(landmarks, side='right')
        left_hip = calculate_hip_angle(landmarks, side='left')
        right_hip = calculate_hip_angle(landmarks, side='right')
        
        measurements = {
            'leftKneeAngle': round(left_knee['angle'], 1) if left_knee['valid'] else None,
            'rightKneeAngle': round(right_knee['angle'], 1) if right_knee['valid'] else None,
            'leftHipAngle': round(left_hip['angle'], 1) if left_hip['valid'] else None,
            'rightHipAngle': round(right_hip['angle'], 1) if right_hip['valid'] else None,
        }
        
        # Assess quality
        quality_result = assess_measurement_quality(
            landmarks,
            visibility,
            measurements
        )
        
        # Determine movement phase (for squat)
        movement_phase = determine_movement_phase(
            measurements.get('leftKneeAngle', 180),
            data.get('exerciseType', 'squat')
        )
        
        return jsonify({
            'success': True,
            'detected': True,
            'landmarks': landmarks.tolist(),
            'visibility': visibility.tolist(),
            'measurements': measurements,
            'quality': quality_result['quality'],
            'qualityReason': quality_result['reason'],
            'movementPhase': movement_phase,
            'timestamp': data.get('timestamp', 0)
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/pose/stream-init', methods=['POST'])
def init_stream():
    """
    Initialize a pose tracking session.
    Returns session configuration.
    """
    try:
        data = request.get_json()
        
        session_config = {
            'sessionId': generate_session_id(),
            'exerciseType': data.get('exerciseType', 'squat'),
            'prescribedReps': data.get('prescribedReps', 10),
            'targetAngle': data.get('targetAngle', None),
            'initialized': True
        }
        
        return jsonify({
            'success': True,
            'config': session_config
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/session/save', methods=['POST'])
def save_session():
    """
    Save completed session data.
    
    Expected request body:
    {
        "patientId": "string",
        "exerciseType": "string",
        "completedReps": number,
        "angles": [...],
        "duration": number,
        "discomfortReported": boolean
    }
    """
    try:
        data = request.get_json()
        
        # In production, save to database
        # For now, return success with generated session ID
        
        session_id = generate_session_id()
        
        return jsonify({
            'success': True,
            'sessionId': session_id,
            'message': 'Session saved successfully'
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

def determine_movement_phase(knee_angle, exercise_type):
    """Determine current movement phase based on angle"""
    if exercise_type == 'squat':
        if knee_angle is None:
            return 'standing'
        if knee_angle > 150:
            return 'standing'
        elif knee_angle < 100:
            return 'bottom'
        else:
            return 'descending'
    return 'unknown'

def generate_session_id():
    """Generate unique session ID"""
    import time
    return f"session_{int(time.time() * 1000)}"

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)
