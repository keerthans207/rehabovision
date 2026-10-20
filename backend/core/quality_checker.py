"""
Measurement quality assessment for pose tracking
"""

import numpy as np


def assess_measurement_quality(landmarks, visibility, measurements):
    """
    Assess the quality of pose measurements
    
    Args:
        landmarks: (33, 3) array of pose landmarks
        visibility: (33,) array of visibility scores
        measurements: dict of calculated angles
    
    Returns:
        dict with 'quality' ('good', 'uncertain', 'unavailable') and 'reason'
    """
    # Key joint indices for lower body assessment
    key_joints = [23, 24, 25, 26, 27, 28]  # hips, knees, ankles
    
    # Check visibility of key joints
    key_visibility = visibility[key_joints]
    min_visibility = np.min(key_visibility)
    mean_visibility = np.mean(key_visibility)
    
    # Check if joints are within reasonable frame bounds
    key_landmarks = landmarks[key_joints]
    x_coords = key_landmarks[:, 0]
    y_coords = key_landmarks[:, 1]
    
    # Landmarks are normalized to [0, 1]
    out_of_bounds = (
        np.any(x_coords < 0.05) or np.any(x_coords > 0.95) or
        np.any(y_coords < 0.05) or np.any(y_coords > 0.95)
    )
    
    # Check for None measurements
    none_measurements = sum(1 for v in measurements.values() if v is None)
    total_measurements = len(measurements)
    
    # Determine quality level
    if none_measurements == total_measurements:
        return {
            'quality': 'unavailable',
            'reason': 'Pose cannot be detected. Ensure you are well-lit and fully visible inside the camera frame.'
        }
    
    if min_visibility < 0.3:
        return {
            'quality': 'unavailable',
            'reason': 'Key joints are not visible. Move so your full legs are in frame.'
        }
    
    if out_of_bounds:
        return {
            'quality': 'uncertain',
            'reason': 'Your knee is partially outside the camera frame. Move slightly back so your full leg is visible.'
        }
    
    if mean_visibility < 0.6:
        return {
            'quality': 'uncertain',
            'reason': 'Some joints have low visibility. Adjust lighting or camera position for better tracking.'
        }
    
    if none_measurements > 0:
        return {
            'quality': 'uncertain',
            'reason': 'Some measurements could not be calculated. Ensure all key joints are visible.'
        }
    
    # All checks passed
    return {
        'quality': 'good',
        'reason': 'Full body is visible. Measurements are being recorded.'
    }


def detect_occlusion(visibility, threshold=0.5):
    """
    Detect if any key joints are occluded
    
    Returns:
        dict with occluded joint names and visibility scores
    """
    joint_names = {
        11: 'left_shoulder',
        12: 'right_shoulder',
        23: 'left_hip',
        24: 'right_hip',
        25: 'left_knee',
        26: 'right_knee',
        27: 'left_ankle',
        28: 'right_ankle'
    }
    
    occluded = {}
    for idx, name in joint_names.items():
        if visibility[idx] < threshold:
            occluded[name] = float(visibility[idx])
    
    return occluded


def check_frame_stability(current_landmarks, previous_landmarks, max_movement=0.1):
    """
    Check if the pose is stable between frames
    
    Args:
        current_landmarks: Current frame landmarks
        previous_landmarks: Previous frame landmarks
        max_movement: Maximum acceptable movement between frames (normalized)
    
    Returns:
        bool: True if stable, False if excessive movement detected
    """
    if previous_landmarks is None:
        return True
    
    # Calculate movement of key joints
    key_joints = [23, 24, 25, 26]  # hips and knees
    
    current_key = current_landmarks[key_joints]
    previous_key = previous_landmarks[key_joints]
    
    movement = np.linalg.norm(current_key - previous_key, axis=1)
    max_joint_movement = np.max(movement)
    
    return max_joint_movement < max_movement
