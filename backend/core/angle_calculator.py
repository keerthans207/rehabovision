"""
Joint angle calculation from pose landmarks
"""

import numpy as np


def calculate_angle_3points(p1, p2, p3):
    """
    Calculate angle at p2 formed by p1-p2-p3
    
    Args:
        p1, p2, p3: (x, y, z) coordinates
    
    Returns:
        Angle in degrees (0-180)
    """
    v1 = p1 - p2
    v2 = p3 - p2
    
    # Normalize vectors
    v1_norm = np.linalg.norm(v1)
    v2_norm = np.linalg.norm(v2)
    
    if v1_norm < 1e-6 or v2_norm < 1e-6:
        return 180.0  # Default extended angle
    
    v1 = v1 / v1_norm
    v2 = v2 / v2_norm
    
    # Calculate angle
    cos_angle = np.clip(np.dot(v1, v2), -1.0, 1.0)
    angle_rad = np.arccos(cos_angle)
    angle_deg = np.degrees(angle_rad)
    
    return float(angle_deg)


def calculate_knee_angle(landmarks, side='left'):
    """
    Calculate knee flexion angle
    
    Args:
        landmarks: (33, 3) array of pose landmarks
        side: 'left' or 'right'
    
    Returns:
        dict with 'angle' (degrees) and 'valid' (bool)
    """
    # Define indices
    indices = {
        'left': {'hip': 23, 'knee': 25, 'ankle': 27},
        'right': {'hip': 24, 'knee': 26, 'ankle': 28}
    }
    
    idx = indices[side]
    
    hip = landmarks[idx['hip']]
    knee = landmarks[idx['knee']]
    ankle = landmarks[idx['ankle']]
    
    # Check if points are valid (not all zeros)
    if np.allclose(hip, 0) or np.allclose(knee, 0) or np.allclose(ankle, 0):
        return {'angle': None, 'valid': False}
    
    angle = calculate_angle_3points(hip, knee, ankle)
    
    return {
        'angle': angle,
        'valid': True,
        'hip': hip.tolist(),
        'knee': knee.tolist(),
        'ankle': ankle.tolist()
    }


def calculate_hip_angle(landmarks, side='left'):
    """
    Calculate hip flexion angle
    
    Args:
        landmarks: (33, 3) array of pose landmarks
        side: 'left' or 'right'
    
    Returns:
        dict with 'angle' (degrees) and 'valid' (bool)
    """
    indices = {
        'left': {'shoulder': 11, 'hip': 23, 'knee': 25},
        'right': {'shoulder': 12, 'hip': 24, 'knee': 26}
    }
    
    idx = indices[side]
    
    shoulder = landmarks[idx['shoulder']]
    hip = landmarks[idx['hip']]
    knee = landmarks[idx['knee']]
    
    if np.allclose(shoulder, 0) or np.allclose(hip, 0) or np.allclose(knee, 0):
        return {'angle': None, 'valid': False}
    
    angle = calculate_angle_3points(shoulder, hip, knee)
    
    return {
        'angle': angle,
        'valid': True,
        'shoulder': shoulder.tolist(),
        'hip': hip.tolist(),
        'knee': knee.tolist()
    }


def calculate_trunk_lean(landmarks):
    """
    Calculate trunk inclination angle relative to vertical
    
    Returns angle in degrees (0 = vertical, 90 = horizontal)
    """
    # Use shoulder midpoint and hip midpoint
    left_shoulder = landmarks[11]
    right_shoulder = landmarks[12]
    left_hip = landmarks[23]
    right_hip = landmarks[24]
    
    shoulder_mid = (left_shoulder + right_shoulder) / 2
    hip_mid = (left_hip + right_hip) / 2
    
    # Calculate trunk vector
    trunk_vector = shoulder_mid - hip_mid
    
    # Project to 2D (ignore z for camera-based measurement)
    trunk_2d = trunk_vector[:2]
    
    # Calculate angle from vertical
    vertical = np.array([0, -1])  # y increases downward in image coords
    
    trunk_norm = np.linalg.norm(trunk_2d)
    if trunk_norm < 1e-6:
        return 0.0
    
    trunk_2d = trunk_2d / trunk_norm
    
    cos_angle = np.clip(np.dot(trunk_2d, vertical), -1.0, 1.0)
    angle_rad = np.arccos(cos_angle)
    angle_deg = np.degrees(angle_rad)
    
    return float(angle_deg)


def calculate_bilateral_difference(left_angle, right_angle):
    """
    Calculate difference between left and right joint angles
    
    Returns:
        Absolute difference in degrees
    """
    if left_angle is None or right_angle is None:
        return None
    
    return abs(left_angle - right_angle)
