"""
Technical Architect Tool for Project Opportunity Assistant (Development Mode).
Generates database ERD structures, API endpoint specifications, and security permission models.
"""

def generate_technical_spec(component="database"):
    """
    Generates technical architecture and code patterns for development.
    """
    comp_clean = component.lower()

    if "database" in comp_clean or "erd" in comp_clean or "schema" in comp_clean:
        return {
            "status": "success",
            "component": "Database Architecture & Entity Relationships",
            "spec_markdown": (
                "## Database Architecture (Relational Model)\n\n"
                "### Core Entities:\n"
                "```text\n"
                "UserAccount (id, email, password_hash, role, is_internal_member, created_at)\n"
                "  ├── StudentProfile (id, user_id [FK 1:1], university, major, skills_json, gpa, cv_url, is_public)\n"
                "  ├── AthleteProfile (id, user_id [FK 1:1], sport, position, achievements, videos_json, verification_status, is_public)\n"
                "  ├── ScoutProfile (id, user_id [FK 1:1], organization, specialization, experience_years)\n"
                "  └── EnterpriseProfile (id, user_id [FK 1:1], company_name, industry, location, description)\n\n"
                "Internship (id, enterprise_id [FK N:1], title, field, required_skills_json, duration_months, is_active)\n"
                "InternshipApplication (id, student_id [FK N:1], internship_id [FK N:1], status, cover_note, applied_at)\n"
                "RecruitmentOffer (id, scout_id [FK N:1], athlete_id [FK N:1], opportunity_details, status, created_at)\n"
                "VerificationRequest (id, athlete_id [FK N:1], clinic_name, status, assessment_type, reviewed_at)\n"
                "AgentConversation (id, session_id, environment, user_email, user_role, title, created_at)\n"
                "AgentMessage (id, conversation_id [FK N:1], sender_type, content, model_name, created_at)\n"
                "AuditLog (id, actor_email, action, target_type, environment, result, timestamp)\n"
                "```"
            )
        }

    elif "api" in comp_clean or "endpoints" in comp_clean:
        return {
            "status": "success",
            "component": "REST API Endpoint Specifications",
            "spec_markdown": (
                "## REST API Architecture\n\n"
                "### Public & User Endpoints:\n"
                "- `POST /api/auth/register/` - Central user registration\n"
                "- `POST /api/auth/login/` - JWT token issuance\n"
                "- `GET/PUT /api/profiles/student/` - Student profile CRUD\n"
                "- `GET/PUT /api/profiles/athlete/` - Athlete profile CRUD\n"
                "- `GET /api/internships/` - Public search and filtering for students\n"
                "- `POST /api/internships/<id>/apply/` - Student application submission\n"
                "- `GET /api/athletes/` - Scout filtering and search\n"
                "- `POST /api/recruitment/offers/` - Scout send recruitment offer\n"
                "- `POST /api/verification/request/` - Athlete submit verification request\n\n"
                "### AI Agent Endpoints (3-Environment Architecture):\n"
                "- `POST /api/agent/public/chat/` - Public read-only chatbot with safety filters\n"
                "- `POST /api/agent/internal/chat/` - Authorized group assistant (Requires internal email/role)\n"
                "- `POST /api/agent/development/chat/` - Developer technical assistant (Dummy data only)\n"
                "- `GET/POST /api/agent/config/` - Agent configuration and model parameters"
            )
        }

    else:
        return {
            "status": "success",
            "component": "Role-Based Access Control (RBAC) Matrix",
            "spec_markdown": (
                "## Security & RBAC Permissions Matrix\n\n"
                "| Resource / Action | Public | Student | Athlete | Scout | Enterprise | Administrator |\n"
                "|---|---|---|---|---|---|---|\n"
                "| View Public Internships | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |\n"
                "| Apply for Internships | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ |\n"
                "| Publish Internships | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ |\n"
                "| View Athlete Public Highlights | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |\n"
                "| Send Recruitment Offers | ❌ | ❌ | ❌ | ✅ | ❌ | ✅ |\n"
                "| Request Clinic Verification | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ |\n"
                "| Approve Verification Badges | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |\n"
                "| Access Internal AI Assistant | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ (Authorized Team) |"
            )
        }
