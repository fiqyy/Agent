"""
Schedule Optimizer Tool for APEX Agent.
Analyzes student-athlete schedules, detects time crunches, prevents academic/athletic burnout,
and inserts dedicated high-focus study sprints and active recovery periods.
"""

def optimize_schedule(current_schedule, athlete_profile, preferences=None):
    """
    Optimizes weekly routine by balancing training sessions, academic lectures, and recovery.
    """
    days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
    recommendations = []
    conflicts_detected = []
    
    # Calculate load distribution
    day_counts = {day: {'academic': 0, 'athletic': 0, 'recovery': 0} for day in days}
    for item in current_schedule:
        day = item.get('day_of_week', 'Monday')
        cat = item.get('category', 'academic_class')
        if day in day_counts:
            if 'academic' in cat:
                day_counts[day]['academic'] += 1
            elif 'athletic' in cat:
                day_counts[day]['athletic'] += 1
            elif 'recovery' in cat:
                day_counts[day]['recovery'] += 1

    # Heuristics for athletic-academic balance
    for day, counts in day_counts.items():
        if counts['academic'] >= 3 and counts['athletic'] >= 2:
            conflicts_detected.append({
                "day": day,
                "severity": "HIGH",
                "issue": f"Overload Alert: {counts['academic']} academic blocks + {counts['athletic']} intense training sessions on {day}."
            })
            recommendations.append({
                "day": day,
                "type": "schedule_adjustment",
                "action": f"Shift one study sprint to Sunday or insert a 30-min active neuro-cognitive reset between 16:00 and 17:00."
            })

    # Suggestions for high-performance student-athletes
    best_study_slots = [
        {"day": "Tuesday", "start_time": "14:00", "end_time": "15:30", "title": "⚡ AI-Optimized Deep Study Sprint (Pre-Workout Focus)"},
        {"day": "Thursday", "start_time": "19:30", "end_time": "21:00", "title": "📖 Active Recall & Exam Prep Block"},
        {"day": "Sunday", "start_time": "10:00", "end_time": "12:00", "title": "🎯 Weekly Academic Blueprint & Taper Review"}
    ]

    return {
        "status": "success",
        "analysis": {
            "total_items_analyzed": len(current_schedule),
            "weekly_strain_distribution": day_counts,
            "conflicts_count": len(conflicts_detected),
            "conflicts": conflicts_detected,
        },
        "recommendations": recommendations if recommendations else [
            {"day": "All", "type": "balance", "action": "Schedule has harmonious pacing. Ensure 20g whey + complex carb 45m post-practice."}
        ],
        "suggested_new_slots": best_study_slots,
        "peak_performance_score": 94 if len(conflicts_detected) == 0 else 82 - (len(conflicts_detected) * 6)
    }
