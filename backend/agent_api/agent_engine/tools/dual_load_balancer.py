"""
Dual Load Balancer Tool for APEX Agent.
Calculates the harmonic equilibrium between Athletic Strain and Academic Stress.
"""

def balance_dual_load(profile_data, metrics_data, upcoming_events=None):
    """
    Computes real-time Academic Load Index vs Athletic Strain Index and gives unified equilibrium rating.
    """
    gpa = float(profile_data.get('current_gpa', 3.88))
    train_hrs = float(profile_data.get('weekly_training_hours', 16.5))
    readiness = int(metrics_data.get('readiness_score', 91))
    
    # Athletic index (0-100)
    athletic_index = min(100, int((train_hrs / 20.0) * 85 + (100 - readiness) * 0.15))
    # Academic index (0-100)
    academic_index = min(100, int(gpa * 22.0 + 10))
    
    # Equilibrium delta
    delta = abs(athletic_index - academic_index)
    harmony_status = "Optimal Dual-Drive Harmony" if delta <= 15 else ("Slight Imbalance" if delta <= 30 else "Critical Divergence")

    return {
        "status": "success",
        "athletic_strain_index": athletic_index,
        "academic_load_index": academic_index,
        "dual_harmony_score": max(50, 100 - delta),
        "harmony_status": harmony_status,
        "recommended_pivot": (
            "Maintain current training intensity in the morning while locking in a 90-minute evening deep study block. "
            "Hydration and pre-study carb reload will prevent cognitive fatigue."
        )
    }
