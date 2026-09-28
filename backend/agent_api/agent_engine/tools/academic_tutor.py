"""
Academic Tutor & Study Strategist Tool for APEX Agent.
Deconstructs complex syllabi, creates Active Recall schedules, flashcard prompts,
and balances study loads around competition schedules.
"""

def generate_study_strategy(topic_or_subject, exam_date=None, athlete_profile=None):
    """
    Produces high-efficiency study sprint breakdown using the Feynman technique and Spaced Repetition.
    """
    strategies = {
        "Computer Science / Engineering": [
            {"phase": "Sprint 1: Core Mechanics", "method": "Whiteboard algorithm trace & data structure complexity proof (45 mins)"},
            {"phase": "Sprint 2: Code Implementation", "method": "Build test harness and edge-case benchmark (50 mins)"},
            {"phase": "Sprint 3: Active Recall", "method": "Explain system architecture without notes into voice memo (25 mins)"}
        ],
        "General High-Yield": [
            {"phase": "Sprint 1: Concept Deconstruction", "method": "Identify top 20% core formulas/theories generating 80% exam points"},
            {"phase": "Sprint 2: Timed Problem Sets", "method": "Exam-condition practice sets under strict timer (45 mins)"},
            {"phase": "Sprint 3: Error Log Synthesis", "method": "Catalog every missed question with root cause analysis"}
        ]
    }

    phases = strategies.get("Computer Science / Engineering" if "Engineering" in str(topic_or_subject) or "Computer" in str(topic_or_subject) else "General High-Yield")

    return {
        "status": "success",
        "subject_topic": topic_or_subject or "High-Yield Coursework Mastery",
        "methodology": "Dual-Sprint Ultra Focus Protocol (Pomodoro 50/10 + Active Recall)",
        "phases": phases,
        "pre_competition_rule": (
            "Never do heavy all-nighters before matches or key workouts. Sleep deprivation drops sprint reaction speed by 14% "
            "and reduces working memory retention by 35%."
        ),
        "suggested_flashcard_drills": [
            f"Define key axiomatic principles of {topic_or_subject or 'current unit'}",
            "Contrast worst-case vs average-case algorithmic complexity / physical constraints",
            "Synthesize formula derivation from first principles"
        ]
    }
