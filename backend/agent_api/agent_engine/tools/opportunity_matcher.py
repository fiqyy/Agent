"""
Opportunity Matcher Tool for Project Opportunity Assistant.
Filters and connects Students with Internships and Athletes with Scouts.
"""

def match_student_internships(student_skills, field_of_study, available_internships):
    """
    Ranks internships according to student skill overlap and study domain.
    """
    matches = []
    student_skills_set = set([s.lower() for s in student_skills])

    for item in available_internships:
        required = set([s.lower() for s in item.get('required_skills', [])])
        overlap = student_skills_set.intersection(required)
        match_percentage = int((len(overlap) / max(1, len(required))) * 100) if required else 80

        matches.append({
            "internship_id": item.get('id'),
            "title": item.get('title'),
            "enterprise": item.get('enterprise_name', 'NovaTech Systems'),
            "field": item.get('field'),
            "location": item.get('location'),
            "duration": f"{item.get('duration_months', 3)} Months",
            "match_score": min(98, match_percentage + (15 if field_of_study.lower() in item.get('field', '').lower() else 0)),
            "matching_skills": list(overlap),
            "missing_skills": list(required - student_skills_set)
        })

    matches.sort(key=lambda x: x['match_score'], reverse=True)
    return {
        "status": "success",
        "total_matched": len(matches),
        "top_recommendations": matches[:3],
        "guidance": "Review the required skills and submit an application with your updated student profile and CV."
    }

def match_athlete_scouts(sport, position, verification_status, available_scouts):
    """
    Finds interested scouts looking for athlete profiles in the specific sport.
    """
    matched_scouts = []
    for s in available_scouts:
        spec = s.get('sports_specialization', '').lower()
        if sport.lower() in spec or 'all' in spec or 'general' in spec or 'high performance' in spec:
            matched_scouts.append({
                "scout_name": s.get('name'),
                "organization": s.get('organization'),
                "specialization": s.get('sports_specialization'),
                "experience": f"{s.get('experience_years', 5)}+ Years",
                "recommended_action": "Ensure gameplay highlights and verification badge are visible for scout review."
            })

    return {
        "status": "success",
        "sport": sport,
        "position": position,
        "verification_badge_active": verification_status in ['medical_verified', 'basic_verified'],
        "potential_scout_reach": len(matched_scouts),
        "active_scouts": matched_scouts
    }
