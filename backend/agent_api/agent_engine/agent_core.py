"""
APEX & Project Opportunity Assistant Agent Core Engine.
Supports 3 operating environments: Public Platform Chatbot, Internal Group Assistant, and Project Development Assistant.
Integrated with Local Ollama API (http://localhost:11434), Built-in Domain Engine, and Cloud LLM providers.
"""
import os
import json
import requests
from .safety_guard import SafetyGuard, FALLBACK_MESSAGES
from .knowledge_base import PROJECT_METADATA, PUBLIC_FAQ_KNOWLEDGE, INTERNAL_PROJECT_DOCS
from .tools.opportunity_matcher import match_student_internships, match_athlete_scouts
from .tools.verification_explainer import explain_verification_protocol
from .tools.academic_report_generator import generate_academic_section
from .tools.technical_architect import generate_technical_spec
from .tools.business_feasibility_analyzer import analyze_business_feasibility, validate_dual_profile_state

class ProjectOpportunityAgentEngine:
    def __init__(self, config=None, user_context=None):
        self.config = config or {}
        self.user_context = user_context or {}
        self.agent_name = self.config.get('name', 'Connecta Assistant')
        self.active_environment = self.config.get('active_environment', 'internal')
        self.active_tools = self.config.get('active_tools', [
            'opportunity_matcher', 'verification_explainer', 'academic_report_generator',
            'technical_architect', 'business_feasibility_analyzer', 'dual_profile_manager'
        ])
        self.authorized_emails = self.config.get('authorized_group_emails', [
            'admin@project.local', 'developer@aast.edu', 'team@project.local'
        ])

    def get_registered_tools(self):
        """Returns metadata for all available tools."""
        return [
            {
                "id": "opportunity_matcher",
                "name": "Student Internship & Athlete Scouting Matcher",
                "description": "Matches student skills with active internships and athlete profiles with sports scouts.",
                "category": "Marketplace & Recruitment",
                "enabled": "opportunity_matcher" in self.active_tools
            },
            {
                "id": "verification_explainer",
                "name": "Clinic Verification & Blue Badge Explainer",
                "description": "Explains clinic evaluation workflows and non-guarantee safety boundaries.",
                "category": "Verification & Safety",
                "enabled": "verification_explainer" in self.active_tools
            },
            {
                "id": "academic_report_generator",
                "name": "Academic Report & Defense Generator",
                "description": "Produces copy-ready formal academic sections (SMART objectives, problem statement, defense Q&A).",
                "category": "Academic Documentation",
                "enabled": "academic_report_generator" in self.active_tools
            },
            {
                "id": "technical_architect",
                "name": "Database Schema & API Architect",
                "description": "Generates ERD relational structures, REST API specifications, and RBAC permissions.",
                "category": "Engineering & Development",
                "enabled": "technical_architect" in self.active_tools
            },
            {
                "id": "business_feasibility_analyzer",
                "name": "Business Model & Feasibility Analyzer",
                "description": "Evaluates graduation project viability, freemium monetization options, and SWOT analysis.",
                "category": "Business & Strategy",
                "enabled": "business_feasibility_analyzer" in self.active_tools
            },
            {
                "id": "dual_profile_manager",
                "name": "Dual-Profile Architecture Validator",
                "description": "Validates single-account multi-profile coexistence (Student + Athlete).",
                "category": "Identity & Architecture",
                "enabled": "dual_profile_manager" in self.active_tools
            }
        ]

    def execute_tool_direct(self, tool_id, params=None):
        """Executes a tool directly for inspection or debugging."""
        params = params or {}
        if tool_id == "opportunity_matcher":
            skills = params.get('skills', ['Python', 'React', 'Django'])
            field = params.get('field', 'Computer Engineering')
            internships = params.get('internships', [
                {'id': 1, 'title': 'AI Engineering Intern', 'enterprise_name': 'NovaTech Systems', 'field': 'Computer Engineering', 'required_skills': ['Python', 'Django', 'React'], 'duration_months': 3, 'location': 'Cairo / Remote'}
            ])
            return match_student_internships(skills, field, internships)
        elif tool_id == "verification_explainer":
            status = params.get('status', 'medical_verified')
            return explain_verification_protocol(status)
        elif tool_id == "academic_report_generator":
            topic = params.get('topic', 'objectives')
            return generate_academic_section(topic)
        elif tool_id == "technical_architect":
            comp = params.get('component', 'database')
            return generate_technical_spec(comp)
        elif tool_id == "business_feasibility_analyzer":
            return analyze_business_feasibility()
        elif tool_id == "dual_profile_manager":
            user_id = params.get('user_id', 1)
            has_s = params.get('has_student', True)
            has_a = params.get('has_athlete', True)
            return validate_dual_profile_state(user_id, has_s, has_a)
        else:
            return {"status": "error", "message": f"Unknown tool: {tool_id}"}

    def process_message(self, user_prompt, environment="internal", user_email="guest@platform.local", conversation_history=None, access_password=""):
        """
        Main ReAct Reasoning & Execution Pipeline across 3 environments.
        """
        conversation_history = conversation_history or []
        thought_steps = []
        executed_tools = []
        tool_results = []
        safety_violations = []

        # Determine required password for environment
        required_password = ""
        if environment == "internal":
            required_password = self.config.get('internal_access_password', 'grad2027')
        elif environment == "development":
            required_password = self.config.get('development_access_password', 'dev2027')

        # Step 1: Safety & Access Control Pre-check
        is_blocked, fallback_msg, reason = SafetyGuard.inspect_input(
            prompt=user_prompt,
            environment=environment,
            user_email=user_email,
            authorized_emails=self.authorized_emails,
            access_password=access_password,
            required_password=required_password
        )

        if is_blocked:
            thought_steps.append({
                "phase": "Safety & Policy Verification",
                "thought": f"Security Guard blocked request. Reason: '{reason}'. Triggering official fallback response."
            })
            safety_violations.append(reason)
            return {
                "role": "assistant",
                "content": fallback_msg,
                "thought_steps": thought_steps,
                "executed_tools": [],
                "tool_results": [],
                "safety_violations": safety_violations,
                "environment": environment
            }

        thought_steps.append({
            "phase": "Environment & Role Verification",
            "thought": f"Request verified for environment: '{environment}' (User: {user_email}). Initializing domain reasoning."
        })

        # Step 2: Check for Local Ollama or External LLM Provider
        provider = self.config.get('model_provider', 'local_simulation')
        ollama_endpoint = self.config.get('ollama_endpoint', 'http://localhost:11434')
        api_key = self.config.get('api_key', '')

        # Try Local Ollama if configured
        if provider == 'ollama':
            ollama_res = self._call_ollama(user_prompt, environment, ollama_endpoint, conversation_history)
            if ollama_res:
                return ollama_res

        # Try Cloud LLM if keys provided
        if provider == 'openai' and api_key:
            llm_res = self._call_openai(user_prompt, environment, api_key, conversation_history)
            if llm_res:
                return llm_res
        elif provider == 'gemini' and api_key:
            llm_res = self._call_gemini(user_prompt, environment, api_key, conversation_history)
            if llm_res:
                return llm_res

        # Step 3: High-Performance Built-in Domain Engine (100% Free & Deterministic)
        return self._run_domain_reasoning(user_prompt, environment, user_email, conversation_history)

    def _run_domain_reasoning(self, user_prompt, environment, user_email, history):
        """
        Executes domain ReAct loop with environment-specific knowledge bases and tool routing.
        """
        prompt_lower = user_prompt.lower()
        thought_steps = [
            {
                "phase": "Intent & Scope Classification",
                "thought": f"Classifying user intent for {environment} mode: '{user_prompt[:50]}...'"
            }
        ]
        executed_tools = []
        tool_results = []

        # --- Tool Invocations based on Intent ---
        if any(w in prompt_lower for w in ["objective", "smart", "problem", "defense", "aim", "academic", "report", "methodology"]):
            if environment in ["internal", "development"]:
                thought_steps.append({
                    "phase": "Tool Selection",
                    "thought": "Academic documentation query detected. Invoking 'academic_report_generator'."
                })
                res = generate_academic_section(user_prompt)
                executed_tools.append("academic_report_generator")
                tool_results.append({"tool": "academic_report_generator", "output": res})
            else:
                thought_steps.append({
                    "phase": "Public Knowledge Retrieval",
                    "thought": "Providing high-level public project description."
                })

        if any(w in prompt_lower for w in ["database", "erd", "schema", "api", "endpoint", "rbac", "permission", "architecture", "code"]):
            if environment in ["internal", "development"]:
                thought_steps.append({
                    "phase": "Tool Selection",
                    "thought": "Technical architecture query detected. Invoking 'technical_architect'."
                })
                res = generate_technical_spec(user_prompt)
                executed_tools.append("technical_architect")
                tool_results.append({"tool": "technical_architect", "output": res})
            else:
                thought_steps.append({
                    "phase": "Safety Filter",
                    "thought": "Public user queried internal architecture. Applying public scope boundary."
                })

        if any(w in prompt_lower for w in ["internship", "apply", "enterprise", "scout", "athlete", "match", "opportunity", "find"]):
            thought_steps.append({
                "phase": "Tool Selection",
                "thought": "Opportunity and recruitment query detected. Invoking 'opportunity_matcher'."
            })
            res = match_student_internships(['Python', 'React', 'Django'], 'Computer Engineering', [
                {'id': 1, 'title': 'AI Engineering & Full Stack Intern', 'enterprise_name': 'NovaTech Systems', 'field': 'Computer Engineering', 'required_skills': ['Python', 'Django', 'React'], 'duration_months': 3, 'location': 'Cairo / Remote'}
            ])
            executed_tools.append("opportunity_matcher")
            tool_results.append({"tool": "opportunity_matcher", "output": res})

        if any(w in prompt_lower for w in ["verify", "verification", "clinic", "inbody", "blue badge", "badge"]):
            thought_steps.append({
                "phase": "Tool Selection",
                "thought": "Clinic verification query. Invoking 'verification_explainer' to outline pipeline and non-guarantee disclosures."
            })
            res = explain_verification_protocol()
            executed_tools.append("verification_explainer")
            tool_results.append({"tool": "verification_explainer", "output": res})

        if any(w in prompt_lower for w in ["dual profile", "both student and athlete", "two accounts", "multi profile"]):
            thought_steps.append({
                "phase": "Tool Selection",
                "thought": "Dual-profile rule query. Invoking 'dual_profile_manager'."
            })
            res = validate_dual_profile_state(1, True, True)
            executed_tools.append("dual_profile_manager")
            tool_results.append({"tool": "dual_profile_manager", "output": res})

        if any(w in prompt_lower for w in ["business", "feasibility", "monetization", "revenue", "swot", "mvp"]):
            if environment in ["internal", "development"]:
                thought_steps.append({
                    "phase": "Tool Selection",
                    "thought": "Business analysis query. Invoking 'business_feasibility_analyzer'."
                })
                res = analyze_business_feasibility()
                executed_tools.append("business_feasibility_analyzer")
                tool_results.append({"tool": "business_feasibility_analyzer", "output": res})

        # Step 4: Synthesize Response according to environment
        thought_steps.append({
            "phase": "Response Synthesis & Formatting",
            "thought": f"Formatting response adhering to {environment.upper()} guidelines."
        })

        content = self._format_environment_response(user_prompt, environment, tool_results)
        sanitized_content = SafetyGuard.sanitize_output(content, environment)

        return {
            "role": "assistant",
            "content": sanitized_content,
            "thought_steps": thought_steps,
            "executed_tools": executed_tools,
            "tool_results": tool_results,
            "environment": environment
        }

    def _format_environment_response(self, user_prompt, environment, tool_results):
        """Formats response adhering strictly to Environment rules."""
        prompt_lower = user_prompt.lower()

        # 1. Public Platform Chatbot Responses
        if environment == "public":
            if any(w in prompt_lower for w in ["what is", "about", "Connecta", "help"]):
                return (
                    f"### 🌐 Welcome to the Connecta Assistant\n\n"
                    f"{PUBLIC_FAQ_KNOWLEDGE['what_is_platform']}\n\n"
                    f"#### 👥 Public Account Types:\n"
                    f"{PUBLIC_FAQ_KNOWLEDGE['account_types']}\n\n"
                    f"#### 💡 Dual-Profile Support:\n"
                    f"{PUBLIC_FAQ_KNOWLEDGE['dual_profile_explanation']}"
                )
            elif any(w in prompt_lower for w in ["internship", "apply"]):
                return (
                    f"### 💼 How to Apply for Internships\n\n"
                    f"{PUBLIC_FAQ_KNOWLEDGE['internship_application_process']}"
                )
            elif any(w in prompt_lower for w in ["scout", "recruit"]):
                return (
                    f"### 🏅 Sports Talent Discovery & Scouting\n\n"
                    f"{PUBLIC_FAQ_KNOWLEDGE['scouting_and_recruitment']}"
                )
            elif any(w in prompt_lower for w in ["verify", "badge", "clinic", "inbody"]):
                return (
                    f"### 🛡️ Athlete Verification & Blue Badge\n\n"
                    f"{PUBLIC_FAQ_KNOWLEDGE['verification_blue_badge']}\n\n"
                    f"🔒 *{PUBLIC_FAQ_KNOWLEDGE['privacy_and_security']}*"
                )
            else:
                return (
                    f"### 🤝 Connecta Assistant\n\n"
                    f"I can guide you through using the platform, creating student or athlete profiles, "
                    f"browsing internships, scouting sports talent, and understanding our clinic verification process.\n\n"
                    f"How can I assist you with your opportunities today?"
                )

        # 2. Internal Group Assistant Responses (Academic, Defense & Architecture)
        elif environment == "internal":
            sections = [f"### 📋 Internal Project Consultation (Authorized Group Mode)\n"]
            
            if tool_results:
                for t in tool_results:
                    out = t['output']
                    if t['tool'] == "academic_report_generator":
                        sections.append(out.get('markdown_content', ''))
                    elif t['tool'] == "technical_architect":
                        sections.append(out.get('spec_markdown', ''))
                    elif t['tool'] == "business_feasibility_analyzer":
                        sections.append(
                            f"## Business Model & Graduation Feasibility Analysis\n\n"
                            f"**Monetization Options (Proposed for Future):**\n"
                            + "\n".join([f"- **{m['model']}:** {m['detail']}" for m in out['business_model_options']])
                            + f"\n\n**Graduation Project Recommendation:**\n{out['graduation_recommendation']}"
                        )
                    elif t['tool'] == "dual_profile_manager":
                        sections.append(
                            f"## Dual-Profile Architecture Rule\n"
                            f"- **Single Account Constraint:** {out['separation_rule']}\n"
                            f"- **Data Structure:** `User (1)` ─── `StudentProfile (0..1)` & `AthleteProfile (0..1)`"
                        )
                    elif t['tool'] == "verification_explainer":
                        sections.append(
                            f"## Clinic Verification Pipeline & Boundaries\n"
                            + "\n".join([f"{s['step']}. **{s['name']}:** {s['description']}" for s in out['verification_stages']])
                            + f"\n\n**Mandatory Defense Disclosures:**\n"
                            + "\n".join([f"- {d}" for d in out['mandatory_disclaimers']])
                        )
            else:
                sections.append(
                    f"**Project Summary & Status:**\n"
                    f"- **Project Type:** {PROJECT_METADATA['project_type']}\n"
                    f"- **Confirmed Public Roles:** {', '.join(PROJECT_METADATA['public_account_types'])}\n"
                    f"- **Core Architecture:** Central User entity supporting concurrent Student & Athlete profiles.\n"
                    f"- **Verification Protocol:** Partnered clinic InBody/physical check resulting in blue badge (non-guarantee status).\n\n"
                    f"Ask me to generate SMART objectives, ERD schemas, REST endpoint designs, defense Q&A scripts, or feasibility models."
                )

            sections.append(
                f"\n---\n*🔒 Confirmed internal project context for graduation defense preparation.*"
            )
            return "\n\n".join(sections)

        # 3. Project Development Assistant Responses
        else: # development
            sections = [f"### 💻 Project Development & Technical Assistant\n"]
            if tool_results:
                for t in tool_results:
                    out = t['output']
                    if 'spec_markdown' in out:
                        sections.append(out['spec_markdown'])
                    elif 'markdown_content' in out:
                        sections.append(out['markdown_content'])
            else:
                sections.append(
                    f"Ready to assist with React components, Django REST Framework views, SQLite/PostgreSQL schema modeling, "
                    f"JWT auth workflows, and local Ollama model integration (`{self.config.get('ollama_endpoint', 'http://localhost:11434')}`).\n\n"
                    f"All examples will follow least privilege RBAC and dummy credentials."
                )
            return "\n\n".join(sections)

    def _call_ollama(self, prompt, environment, endpoint, history):
        """Calls local Ollama API without any API keys or internet dependencies."""
        try:
            url = f"{endpoint}/api/generate"
            system_prompt = self.config.get(f"{environment}_system_prompt", "")
            full_prompt = f"{system_prompt}\nUser Request: {prompt}"
            payload = {
                "model": self.config.get("model_name", "llama3.2"),
                "prompt": full_prompt,
                "stream": False,
                "options": {"temperature": self.config.get("temperature", 0.7)}
            }
            resp = requests.post(url, json=payload, timeout=12)
            if resp.status_code == 200:
                data = resp.json()
                content = data.get('response', '')
                sanitized = SafetyGuard.sanitize_output(content, environment)
                return {
                    "role": "assistant",
                    "content": sanitized,
                    "thought_steps": [{"phase": "Local Ollama Engine", "thought": f"Generated via local Ollama ({self.config.get('model_name', 'llama3.2')}) on {endpoint}."}],
                    "executed_tools": ["local_ollama_engine"],
                    "tool_results": [],
                    "environment": environment
                }
        except Exception:
            pass
        return None

    def _call_openai(self, prompt, environment, api_key, history):
        try:
            url = "https://api.openai.com/v1/chat/completions"
            headers = {"Authorization": f"Bearer {api_key}", "Content-Type": "application/json"}
            system_prompt = self.config.get(f"{environment}_system_prompt", "")
            messages = [{"role": "system", "content": system_prompt}]
            for h in history[-6:]:
                messages.append({"role": h.get('role', 'user'), "content": h.get('content', '')})
            messages.append({"role": "user", "content": prompt})

            payload = {
                "model": self.config.get("model_name", "gpt-4o-mini"),
                "messages": messages,
                "temperature": self.config.get("temperature", 0.7)
            }
            resp = requests.post(url, headers=headers, json=payload, timeout=15)
            if resp.status_code == 200:
                data = resp.json()
                content = data['choices'][0]['message']['content']
                sanitized = SafetyGuard.sanitize_output(content, environment)
                return {
                    "role": "assistant",
                    "content": sanitized,
                    "thought_steps": [{"phase": "Cloud LLM Provider", "thought": "Processed via OpenAI API with environment persona."}],
                    "executed_tools": ["openai_api"],
                    "tool_results": [],
                    "environment": environment
                }
        except Exception:
            pass
        return None

    def _call_gemini(self, prompt, environment, api_key, history):
        try:
            model = self.config.get('model_name', 'gemini-2.5-flash')
            url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={api_key}"
            headers = {"Content-Type": "application/json"}
            system_prompt = self.config.get(f"{environment}_system_prompt", "")
            payload = {
                "contents": [{"role": "user", "parts": [{"text": f"{system_prompt}\n\nUser request: {prompt}"}]}],
                "generationConfig": {"temperature": self.config.get('temperature', 0.7)}
            }
            resp = requests.post(url, headers=headers, json=payload, timeout=15)
            if resp.status_code == 200:
                data = resp.json()
                content = data['candidates'][0]['content']['parts'][0]['text']
                sanitized = SafetyGuard.sanitize_output(content, environment)
                return {
                    "role": "assistant",
                    "content": sanitized,
                    "thought_steps": [{"phase": "Cloud Gemini Provider", "thought": f"Generated via {model}."}],
                    "executed_tools": ["gemini_api"],
                    "tool_results": [],
                    "environment": environment
                }
        except Exception:
            pass
        return None

# Alias for backwards compatibility
ApexAgentEngine = ProjectOpportunityAgentEngine
