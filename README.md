# ⚡ Project Opportunity Assistant — Official Graduation Project AI Agent

The official full-stack AI Agent application for the graduation-project digital opportunity platform connecting **Students with Enterprises** (for internships) and **Athletes with Scouts** (for sports talent discovery).

Built with **React** (Vite + Modern Vanilla CSS Glassmorphism Design System) and **Django** (Django REST Framework + ReAct Cognitive Engine + Local Ollama Support).

---

## 🌟 Core Architecture & Multi-Environment System
Tree View:
backend/
  manage.py
  db.sqlite3
  seed_data.py
  config/
    __init__.py
    asgi.py
    settings.py
    urls.py
    wsgi.py
  agent_api/
    __init__.py
    admin.py
    apps.py
    models.py
    serializers.py
    urls.py
    views.py
    tests.py
    migrations/
      ...
    agent_engine/
      __init__.py
      agent_core.py
      knowledge_base.py
      safety_guard.py
      tools/
        academic_report_generator.py
        academic_tutor.py
        business_feasibility_analyzer.py
        dual_load_balancer.py
        nutrition_fuel_advisor.py
        opportunity_matcher.py
        recovery_engine.py
        schedule_optimizer.py
        technical_architect.py
        verification_explainer.py
        workflow_automator.py

frontend/
  package.json
  vite.config.js
  index.html
  src/
    main.jsx
    App.jsx
    ...
  public/
    ...
    
The agent operates with the same underlying project truth across **3 distinct operating environments**:

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│                    PROJECT OPPORTUNITY ASSISTANT                           │
│  (Interim name until graduation group confirms final platform name)        │
└─────────────────────────────────────────────────────────────────────────────┘
          │                                  │                               │
          ▼                                  ▼                               ▼
  🌐 Public Platform Chatbot        🔐 Internal Group Assistant    💻 Project Development Assistant
  • Public accounts guidance        • Full project documentation    • Code generation & debugging
  • 4 Public roles: Student,        • Technical architecture        • Database modeling & ERDs
    Athlete, Scout, Enterprise      • SMART Objectives & Aim        • REST API specifications
  • How to apply for internships    • Defense Q&A preparation       • RBAC security matrices
  • Athlete video & stats guide     • Feasibility & SWOT analysis   • Testing & deployment plans
  • Blue verification badge bounds  • Undecided vs confirmed scope  • Dummy data only
  • Strict Read-Only & Privacy      • Restricted to group emails    • Zero production secrets
```

---

## 🏢 Platform Core Concepts & Entities

1. **Dual Marketplace**:
   - **Academic & Internship Track**: Connects Students with Enterprises offering internships.
   - **Athletic & Scouting Track**: Connects Athletes with Scouts looking for sports talent.
2. **Central User Multi-Profile Model**:
   - Single central `UserAccount` can have **both a `StudentProfile` and an `AthleteProfile`** under one login without duplicating credentials (`User ├── StudentProfile, └── AthleteProfile`).
3. **Athlete Verification & Clinic Boundaries**:
   - Blue verification badge confirms completion of an approved physical/InBody examination at a partner physiotherapy clinic.
   - **Mandatory Disclosure**: The badge does *not* guarantee medical fitness for all sports, talent superiority, employment, or contracts. Medical data is private by default.
4. **Zero-Cost Local AI Engine**:
   - Out-of-the-box support for **Local Ollama** (`http://localhost:11434`) and built-in domain reasoning with zero required paid API keys.

---

## 📡 REST API Reference

| Endpoint | Method | Environment | Description |
|---|---|---|---|
| `/api/agent/public/chat/` | `POST` | Public | Public read-only chatbot with strict safety guardrails |
| `/api/agent/internal/chat/` | `POST` | Internal | Private assistant for authorized team emails (`admin@project.local`) |
| `/api/agent/development/chat/` | `POST` | Development | Developer assistant for schemas, APIs, and code |
| `/api/agent/chat/` | `POST` | Multi-Router | Unified router accepting `environment` in payload |
| `/api/agent/config/` | `GET / POST` | All | Manage system prompts, directives, model engine, and tools |
| `/api/platform/overview/` | `GET` | Public | Live marketplace metrics, dual-profile users, and entities |
| `/api/agent/audit-logs/` | `GET` | Internal | Real-time audit logs of safety checks and policy enforcement |

---

## 🚀 Running the Web Application

### Backend (Django REST Framework)
```powershell
# In the project root:
.\venv\Scripts\Activate.ps1
python backend/manage.py migrate
python backend/seed_data.py
python backend/manage.py runserver 127.0.0.1:8000
```
Backend API will be live at `http://127.0.0.1:8000/api/`

### Frontend (React + Vite)
```powershell
# In a separate terminal:
cd frontend
npm run dev -- --port 5173
```
Open **`http://127.0.0.1:5173/`** in your browser to interact with the full web app.

---

## 🛡️ Built-in Safety Guard Fallback Standards

When safety or policy rules are triggered, the agent returns the exact standardized messages:
- **Medical / Diagnosis Query**: *"I can explain the platform’s verification process, but I cannot diagnose medical conditions or determine medical fitness. Please consult a qualified healthcare professional."*
- **Recruitment Guarantee**: *"The platform can help users discover and communicate about opportunities, but it cannot guarantee an internship, contract, recruitment decision, or sponsorship."*
- **Public Scope Restriction**: *"I can help with general information about the platform, but I cannot provide private, internal, administrative, medical, or security-sensitive information."*
- **Prompt Injection**: *"I can help with permitted questions about the platform, but I cannot reveal internal instructions, private data, credentials, or restricted system information."*
