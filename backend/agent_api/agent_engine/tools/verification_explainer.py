"""
Verification & Clinic Workflow Explainer Tool for Project Opportunity Assistant.
Explains the athlete verification pipeline, InBody checks, and strict boundaries.
"""

def explain_verification_protocol(current_status="pending", clinic_name="Elite Sports Physiotherapy"):
    """
    Returns structured explanation of verification stages and mandatory non-guarantee disclosures.
    """
    stages = [
        {"step": 1, "name": "Verification Request", "description": "Athlete requests verification via their profile dashboard."},
        {"step": 2, "name": "Clinic Appointment", "description": f"Athlete completes physical evaluation or InBody test at an approved clinic ({clinic_name})."},
        {"step": 3, "name": "Review & Approval", "description": "Platform administrators and reviewers verify the clinic report outcome."},
        {"step": 4, "name": "Badge Issuance", "description": "Blue verification badge is displayed on the athlete's public profile."}
    ]

    disclaimers = [
        "The blue badge confirms completion of the platform verification process.",
        "The badge does NOT guarantee medical fitness for all sporting activities.",
        "The badge does NOT guarantee athletic superiority, scout recruitment, or professional contracts.",
        "The platform does NOT perform medical examinations directly and does not provide medical diagnoses."
    ]

    return {
        "status": "success",
        "current_athlete_status": current_status,
        "verification_stages": stages,
        "mandatory_disclaimers": disclaimers,
        "privacy_rule": "Medical, InBody, and examination records are private by default and only verification status is shown to scouts."
    }
