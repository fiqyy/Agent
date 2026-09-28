"""
Project Knowledge Base & Domain Truth Repository for the Project Opportunity Platform.
Contains confirmed project requirements, public FAQ definitions, internal architectural specs,
and academic project guidance.
"""

PROJECT_METADATA = {
    "interim_agent_name": "Connecta",
    "project_type": "Digital networking, talent-discovery, internship, and recruitment platform (Graduation Project)",
    "confirmed_name_status": "Undecided - Group refers to it as 'The Platform' or 'Project Opportunity Platform'",
    "primary_stakeholders": ["Students", "Athletes", "Scouts", "Enterprises", "Partnered Clinics", "Administrators"],
    "secondary_stakeholders": ["Universities", "Sports Academies", "Sports Clubs", "Coaches", "Project Supervisors", "Development Team"],
    "public_account_types": ["Student", "Athlete", "Scout", "Enterprise"],
    "internal_roles": ["Administrator", "Moderator", "Verification Reviewer", "Technical Administrator"],
    "multi_profile_rule": "One central User account may have both a StudentProfile and an AthleteProfile without creating two separate accounts.",
    "verification_badge_meaning": "Confirms completion of the platform's clinic examination or InBody assessment. Does NOT guarantee health, fitness, talent, employment, or contracts."
}

PUBLIC_FAQ_KNOWLEDGE = {
    "what_is_platform": (
        "The platform is a digital opportunity system designed as a graduation project. "
        "It connects students with enterprises offering internships, and athletes with scouts searching for sports talent."
    ),
    "account_types": (
        "There are four public account types on the platform:\n"
        "1. **Student:** Build an academic and technical profile, add projects and skills, search and apply for internships.\n"
        "2. **Athlete:** Showcase sports abilities, statistics, achievements, and gameplay videos to receive scout recruitment interest.\n"
        "3. **Scout:** Search and filter athletes by sport and performance, review achievements and videos, and send recruitment offers.\n"
        "4. **Enterprise:** Publish internship opportunities, search student profiles by skills, and review internship applications.\n\n"
        "*Note: Administrators are internal system roles, not public marketplace accounts.*"
    ),
    "dual_profile_explanation": (
        "Yes! A single user account can have both a **Student Profile** and an **Athlete Profile**. "
        "For example, a university student who plays collegiate football can apply for tech internships with their student profile "
        "while simultaneously receiving athletic recruitment opportunities through their athlete profile under one login."
    ),
    "internship_application_process": (
        "To apply for an internship:\n"
        "1. Log in to your account and make sure your Student Profile is complete (education, skills, projects, and CV).\n"
        "2. Navigate to the **Internships** section.\n"
        "3. Filter and browse opportunities based on field of study, required skills, and duration.\n"
        "4. Click on an opportunity to view its requirements and submit your application.\n"
        "5. Track your application status (Pending, Under Review, Shortlisted, Offer Extended) directly from your dashboard."
    ),
    "scouting_and_recruitment": (
        "Scouts use the platform to discover emerging sports talent by filtering athlete profiles by sport, position, statistics, and highlights. "
        "When a scout is interested, they can shortlist the athlete and send a formal **Recruitment Offer** through the platform's secure messaging system."
    ),
    "verification_blue_badge": (
        "The **Blue Verification Badge** indicates that an athlete has completed an identity check or a physical/InBody assessment "
        "at an approved partner physiotherapy clinic. "
        "**Important Limitation:** The badge confirms that the required verification steps were completed; it does *not* guarantee "
        "medical fitness for every sport, athletic talent, or guaranteed recruitment."
    ),
    "privacy_and_security": (
        "The platform follows strict privacy-by-default rules. Sensitive medical or InBody details and private contact information "
        "are restricted and never exposed to the public or scouts without explicit user consent."
    )
}

INTERNAL_PROJECT_DOCS = {
    "problem_statement": (
        "Many talented students and athletes struggle to reach suitable opportunities. "
        "Students lack a centralized system where enterprises can easily discover them based on specific skills and academic majors. "
        "Athletes struggle with fragmented sports visibility, as their videos, statistics, and achievements are dispersed across informal channels. "
        "Enterprises and scouts lack structured filtering, comparison, verification, and recruitment tools. "
        "The platform centralizes both student internship matching and sports talent recruitment into a single unified web platform."
    ),
    "smart_objectives": [
        "S (Specific): Develop a responsive web application connecting students with enterprise internships and athletes with talent scouts.",
        "M (Measurable): Implement 4 public user roles, dual-profile coexistence, a 6-tool AI Assistant, and clinic verification workflows.",
        "A (Achievable): Build a realistic MVP using React, Django REST Framework, SQLite/PostgreSQL, and a local free Ollama AI engine.",
        "R (Relevant): Address dual-career university student-athletes and regional recruitment gaps for the final graduation project defense.",
        "T (Time-bound): Complete development, comprehensive testing, security review, and documentation within the academic semester."
    ],
    "mvp_vs_future_scope": {
        "mvp_scope": [
            "Central user authentication (JWT/Session).",
            "4 public account types (Student, Athlete, Scout, Enterprise) + Admin internal role.",
            "Dual-profile support (User ├── StudentProfile, └── AthleteProfile).",
            "Internship publishing, searching, filtering, and application submission.",
            "Athlete video uploads, statistics, achievements, and scout search/shortlist.",
            "Basic recruitment and internship offer messaging.",
            "Clinic-assisted athlete verification workflow (Pending, In-Review, Approved).",
            "AI Agent supporting 3 environments (Public Chatbot, Internal Assistant, Dev Assistant) running locally with zero API costs."
        ],
        "future_scope": [
            "AI-based automated athlete video computer vision evaluation.",
            "Automated student-internship algorithmic semantic matching.",
            "Mobile applications (iOS / Android).",
            "Direct payment gateway integration for clinic fees.",
            "Voice assistant and multi-language localization."
        ]
    },
    "database_entity_relationships": (
        "Core Relationships:\n"
        "- `UserAccount` (1) ──── (0..1) `StudentProfile`\n"
        "- `UserAccount` (1) ──── (0..1) `AthleteProfile`\n"
        "- `UserAccount` (1) ──── (0..1) `ScoutProfile`\n"
        "- `UserAccount` (1) ──── (0..1) `EnterpriseProfile`\n"
        "- `EnterpriseProfile` (1) ──── (N) `Internship`\n"
        "- `StudentProfile` (1) ──── (N) `InternshipApplication` ──── (1) `Internship`\n"
        "- `ScoutProfile` (1) ──── (N) `RecruitmentOffer` ──── (1) `AthleteProfile`\n"
        "- `AthleteProfile` (1) ──── (N) `VerificationRequest` ──── (1) `Clinic`\n"
        "- `UserAccount` (1) ──── (N) `AgentConversation` ──── (N) `AgentMessage`"
    )
}
