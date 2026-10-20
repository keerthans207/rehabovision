# RehaboVision AI Backend

Python Flask API for real-time pose detection and biomechanics analysis.

## Setup

### 1. Create Virtual Environment

```bash
cd backend
python -m venv venv
```

### 2. Activate Virtual Environment

**Windows:**
```bash
venv\Scripts\activate
```

**Mac/Linux:**
```bash
source venv/bin/activate
```

### 3. Install Dependencies

```bash
pip install -r requirements.txt
```

### 4. Configure Environment

Copy `.env.example` to `.env` and adjust settings if needed.

### 5. Run Server

```bash
python run.py
```

The API will be available at `http://localhost:5000`

## API Endpoints

### Health Check
```
GET /health
```

### Analyze Frame
```
POST /api/pose/analyze-frame
Content-Type: application/json

{
  "image": "base64_encoded_image_string",
  "exerciseType": "squat"
}
```

**Response:**
```json
{
  "success": true,
  "detected": true,
  "measurements": {
    "leftKneeAngle": 95.3,
    "rightKneeAngle": 94.1,
    "leftHipAngle": 87.2,
    "rightHipAngle": 86.8
  },
  "quality": "good",
  "qualityReason": "Full body is visible. Measurements are being recorded.",
  "movementPhase": "descending"
}
```

### Initialize Stream
```
POST /api/pose/stream-init
Content-Type: application/json

{
  "exerciseType": "squat",
  "prescribedReps": 10
}
```

### Save Session
```
POST /api/session/save
Content-Type: application/json

{
  "patientId": "p1",
  "exerciseType": "squat",
  "completedReps": 10,
  "angles": [...],
  "duration": 18,
  "discomfortReported": false
}
```

## Architecture

- `api/app.py` - Flask application and route handlers
- `core/pose_detector.py` - MediaPipe pose detection wrapper
- `core/angle_calculator.py` - Joint angle calculations
- `core/quality_checker.py` - Measurement quality assessment

## Tech Stack

- **Flask** - Web framework
- **MediaPipe** - Real-time pose estimation
- **OpenCV** - Image processing
- **NumPy** - Numerical computations
- **Flask-CORS** - Cross-origin request handling
