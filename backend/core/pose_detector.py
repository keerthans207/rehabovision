"""
Real-time pose detection using MediaPipe
"""

import numpy as np
import mediapipe as mp


class PoseDetector:
    """MediaPipe Pose detector for real-time joint tracking"""
    
    def __init__(
        self,
        model_complexity=1,
        min_detection_confidence=0.5,
        min_tracking_confidence=0.5,
        visibility_threshold=0.5
    ):
        """
        Initialize pose detector
        
        Args:
            model_complexity: 0 (lite), 1 (full), 2 (heavy)
            min_detection_confidence: Minimum confidence for initial detection
            min_tracking_confidence: Minimum confidence for tracking
            visibility_threshold: Minimum visibility score for reliable landmarks
        """
        self.mp_pose = mp.solutions.pose
        self.pose = self.mp_pose.Pose(
            static_image_mode=False,
            model_complexity=model_complexity,
            smooth_landmarks=True,
            min_detection_confidence=min_detection_confidence,
            min_tracking_confidence=min_tracking_confidence
        )
        self.visibility_threshold = visibility_threshold
        
        # MediaPipe landmark indices
        self.LANDMARKS = {
            'left_shoulder': 11,
            'right_shoulder': 12,
            'left_hip': 23,
            'right_hip': 24,
            'left_knee': 25,
            'right_knee': 26,
            'left_ankle': 27,
            'right_ankle': 28,
            'left_heel': 29,
            'right_heel': 30,
            'left_foot': 31,
            'right_foot': 32,
        }
    
    def process_frame(self, frame):
        """
        Process a single frame and extract pose landmarks
        
        Args:
            frame: BGR image (numpy array)
        
        Returns:
            dict with keys:
                - detected: bool
                - landmarks: (33, 3) array [x, y, z]
                - visibility: (33,) array of visibility scores
                - world_landmarks: (33, 3) real-world coordinates
        """
        # Convert BGR to RGB
        rgb_frame = frame[:, :, ::-1]
        
        # Process
        results = self.pose.process(rgb_frame)
        
        if results.pose_landmarks is None:
            return {
                'detected': False,
                'landmarks': np.zeros((33, 3)),
                'visibility': np.zeros(33),
                'world_landmarks': None
            }
        
        # Extract landmarks
        landmarks = np.array([
            [lm.x, lm.y, lm.z]
            for lm in results.pose_landmarks.landmark
        ])
        
        visibility = np.array([
            lm.visibility
            for lm in results.pose_landmarks.landmark
        ])
        
        # Extract world landmarks (3D coordinates in meters)
        world_landmarks = None
        if results.pose_world_landmarks:
            world_landmarks = np.array([
                [lm.x, lm.y, lm.z]
                for lm in results.pose_world_landmarks.landmark
            ])
        
        return {
            'detected': True,
            'landmarks': landmarks,
            'visibility': visibility,
            'world_landmarks': world_landmarks
        }
    
    def get_landmark(self, landmarks, name):
        """Get a specific landmark by name"""
        if name in self.LANDMARKS:
            idx = self.LANDMARKS[name]
            return landmarks[idx]
        return None
    
    def is_landmark_visible(self, visibility, name):
        """Check if a landmark has sufficient visibility"""
        if name in self.LANDMARKS:
            idx = self.LANDMARKS[name]
            return visibility[idx] >= self.visibility_threshold
        return False
    
    def close(self):
        """Release resources"""
        self.pose.close()
