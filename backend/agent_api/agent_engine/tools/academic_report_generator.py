"""
Academic Report Generator Tool for Project Opportunity Assistant (Internal Group Mode).
Generates formal, copy-ready academic report sections, SMART objectives, and defense Q&A.
"""

def generate_academic_section(topic="objectives", context=None):
    """
    Generates academic project documentation sections for graduation defense.
    """
    topic_clean = topic.lower()

    if "objective" in topic_clean or "smart" in topic_clean:
        return {
            "status": "success",
            "section_title": "Project Aim & SMART Objectives",
            "markdown_content": (
                "## 1. Project Aim and Objectives\n\n"
                "### 1.1 Project Aim\n"
                "The primary aim of this graduation project is to design, develop, and evaluate a comprehensive digital opportunity platform "
                "that bridges the gap between academic education and professional internships for students, while simultaneously enabling sports talent "
                "discovery and scouting for athletes under a centralized, role-governed web architecture.\n\n"
                "### 1.2 SMART Objectives\n"
                "- **Specific:** Implement a web application supporting four public account types (Student, Athlete, Scout, Enterprise), "
                "dual-profile coexistence on a single central account, an athlete clinic verification workflow, and an AI-powered assistant across three distinct operating environments.\n"
                "- **Measurable:** Validate the system using automated API testing, role-based permission matrices, end-to-end user workflows (internship application and scout recruitment offer), and sub-500ms API response latency under standard testing conditions.\n"
                "- **Achievable:** Construct a functional Prototype / MVP utilizing React for the interactive frontend, Django REST Framework for modular API services, and a free local Ollama AI model to ensure cost-free operation.\n"
                "- **Relevant:** Solve real-world visibility barriers faced by dual-career collegiate student-athletes seeking both academic internship placement and athletic recruitment.\n"
                "- **Time-bound:** Execute the project lifecycle across requirements gathering, system design, iterative sprints, integration testing, and final defense preparation within the current academic semester."
            )
        }

    elif "problem" in topic_clean:
        return {
            "status": "success",
            "section_title": "Problem Statement & Motivation",
            "markdown_content": (
                "## 2. Problem Statement and Motivation\n\n"
                "In the contemporary landscape, students and athletes encounter fragmented avenues for career and sports progression:\n"
                "1. **Student Opportunity Gap:** Students possess valuable academic credentials, technical projects, and skills, yet struggle to reach enterprises through decentralized job boards that lack student-centric filtering.\n"
                "2. **Enterprise Recruitment Inefficiency:** Enterprises spend significant resources sorting through unverified candidates without structured skill-based filtering aligned with university curricula.\n"
                "3. **Athletic Visibility Barrier:** Promising athletes distribute highlight reels, competition records, and physical metrics informally across social media, depriving scouts of verified, comparable data.\n"
                "4. **Dual-Career Friction:** Student-athletes are forced to maintain disconnected identities across disparate platforms, complicating simultaneous academic career building and athletic recruitment."
            )
        }

    elif "defense" in topic_clean or "q&a" in topic_clean:
        return {
            "status": "success",
            "section_title": "Graduation Project Defense Q&A Preparation",
            "markdown_content": (
                "## 3. Defense Examination Questions & Strategic Answers\n\n"
                "**Q1: How does the system handle a user who is both a full-time engineering student and a competitive varsity sprinter?**\n"
                "*Answer:* The architecture avoids redundant accounts by binding optional `StudentProfile` and `AthleteProfile` one-to-one models to a single central `UserAccount`. The user logs in once and seamlessly navigates between internship applications and scout recruitment offers with isolated visibility settings.\n\n"
                "**Q2: Does the platform guarantee that an athlete with a blue badge will be recruited or is medically cleared for every sport?**\n"
                "*Answer:* No. The blue badge strictly certifies that the athlete completed an examination or InBody assessment at an approved partner clinic according to platform standards. The platform does not guarantee athletic talent, medical clearance, or contract offers, preserving clear legal and operational boundaries.\n\n"
                "**Q3: How does the AI assistant manage security across public and internal users?**\n"
                "*Answer:* The AI engine operates in three isolated environments (`Public`, `Internal`, `Development`). The public endpoint enforces strict privacy filters and read-only platform guidance, while internal and development endpoints require authorized role verification and never expose production credentials."
            )
        }

    else:
        return {
            "status": "success",
            "section_title": "Project Scope & Methodology",
            "markdown_content": (
                "## 4. System Scope & Engineering Methodology\n\n"
                "- **Methodology:** Agile development with iterative two-week sprint cycles for API, UI, and AI Agent testing.\n"
                "- **MVP Scope:** Authentication, 4 account types, dual-profile coexistence, internship matching, video uploads, scout offers, clinic verification, and free local AI assistance."
            )
        }
