# Starting RehaboVision AI - Full System

## Quick Start - Two Terminals

### Terminal 1: Python Backend

```bash
cd "c:\Users\USER\Desktop\DL project\rehabovision-ai\backend"

# First time only - setup venv
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt

# Every time - start backend
venv\Scripts\activate
python run.py
```

Backend will run at: **http://localhost:5000**

### Terminal 2: React Frontend

```bash
cd "c:\Users\USER\Desktop\DL project\rehabovision-ai"

# First time only
npm install

# Every time - start frontend
npm run dev
```

Frontend will run at: **http://localhost:5173**

---

## Testing the Integration

1. Open http://localhost:5173
2. Click "Continue as Patient"
3. Go to "My Exercises"
4. Click "Start Exercise Session"
5. Allow camera access when prompted
6. You should see:
   - Your live camera feed
   - Real pose skeleton overlay
   - Real-time knee angle measurements
   - Quality feedback based on visibility

---

## Troubleshooting

### Backend issues

**"No module named 'core'"**
```bash
# Use run.py instead of api/app.py directly
python run.py
```

**"mediapipe not found"**
```bash
pip install mediapipe
```

**"Port 5000 already in use"**
- Stop other Flask apps
- Or change port in `backend/api/app.py`

### Frontend issues

**"Backend offline" warning**
- Make sure backend is running on port 5000
- Check http://localhost:5000/health in browser

**Camera not working**
- Allow camera permissions in browser
- Camera only works over HTTPS or localhost
- Check browser console for errors

### CORS errors

- Backend has CORS enabled by default
- If still seeing errors, check Flask-CORS is installed:
  ```bash
  pip install flask-cors
  ```

---

## What You'll See

✅ **Real webcam feed** (mirrored)  
✅ **MediaPipe 33-point skeleton** overlaid in teal  
✅ **Live knee angle** in yellow badge  
✅ **Quality assessment** with specific feedback  
✅ **Automatic rep counting** when you squat  
✅ **Movement phase detection** (Standing/Descending/Bottom/Ascending)  

---

## Development Notes

- Backend processes frames every 300ms
- Pose detection runs in Python (MediaPipe)
- Frontend handles camera and UI only
- Rep counting uses simple peak detection
- All measurements are 2D projections from single camera

---

## Production Checklist

For production deployment:

- [ ] Add HTTPS for frontend (required for camera)
- [ ] Add authentication (JWT tokens)
- [ ] Add database for session storage
- [ ] Add rate limiting on API
- [ ] Encrypt patient data
- [ ] Add session replay capability
- [ ] Implement proper error logging
- [ ] Add unit tests
- [ ] Deploy backend and frontend separately
- [ ] Configure production CORS origins
