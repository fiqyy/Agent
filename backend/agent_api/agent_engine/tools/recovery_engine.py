"""
Recovery and Biometrics Engine Tool for APEX Agent.
Analyzes heart rate variability (HRV), sleep duration, muscle soreness, and central nervous system (CNS) fatigue.
"""

def analyze_recovery_state(metrics_data, athlete_profile=None):
    """
    Computes unified Readiness Score (0-100) and provides dynamic strain recommendations.
    """
    sleep_hrs = float(metrics_data.get('sleep_hours', 8.0))
    sleep_qual = int(metrics_data.get('sleep_quality', 85))
    fatigue = int(metrics_data.get('fatigue_level', 25))
    soreness = int(metrics_data.get('muscle_soreness', 30))
    
    # Calculate weighted readiness score
    sleep_score = min(100, (sleep_hrs / 8.5) * 100) * 0.35 + (sleep_qual * 0.15)
    fatigue_penalty = (fatigue * 0.25) + (soreness * 0.25)
    raw_readiness = max(10, min(99, int(sleep_score + 50 - fatigue_penalty)))

    zone = "Optimal Peak (Green Zone)"
    actionable_advice = "Your CNS is primed. Target maximum intensity in today's high-speed intervals or heavy lifts."
    
    if raw_readiness < 65:
        zone = "Recovery Alert (Red Zone)"
        actionable_advice = "Elevated nervous system fatigue detected. Dial back peak velocity sprinting to technique drills and foam rolling."
    elif raw_readiness < 80:
        zone = "Moderate Adaptation (Yellow Zone)"
        actionable_advice = "Good baseline readiness. Proceed with structured training, prioritize 20m post-lunch power nap."

    recovery_prescriptions = [
        {"modality": "Cold Plunge / Contrast Shower", "duration": "10-12 mins (10°C / 38°C intervals)", "timing": "Post-training"},
        {"modality": "Percussive Therapy (Theragun)", "duration": "5 mins per major muscle group", "timing": "Pre-bed"},
        {"modality": "Targeted Sleep Hygiene", "duration": "Dark room at 18.5°C, 0 blue light 45m before bed", "timing": "Nightly"}
    ]

    return {
        "status": "success",
        "readiness_score": raw_readiness,
        "zone": zone,
        "cns_status": "Primed" if raw_readiness >= 80 else ("Recovering" if raw_readiness >= 65 else "Fatigued"),
        "actionable_advice": actionable_advice,
        "recovery_prescriptions": recovery_prescriptions,
        "recommended_max_training_strain": 16.5 if raw_readiness >= 80 else (12.0 if raw_readiness >= 65 else 8.5)
    }
