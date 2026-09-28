"""
Safety & Privacy Guard for the Project Opportunity Assistant.
Enforces multi-tier environment access control, password authentication,
detects sensitive data leakage, prompt injection, medical diagnosis requests,
recruitment guarantee claims, and private data leaks.
"""
import re

FALLBACK_MESSAGES = {
    "public_restriction": (
        "I can help with general information about the platform, but I cannot provide private, "
        "internal, administrative, medical, or security-sensitive information."
    ),
    "unrelated": (
        "I am designed to help with this platform and its educational, internship, sports, and recruitment features. "
        "I may not be able to assist with unrelated topics."
    ),
    "uncertainty": (
        "I do not have enough confirmed information to answer that accurately. "
        "Please check the relevant platform page or contact an administrator."
    ),
    "service_unavailable": (
        "The assistant is temporarily unavailable. Please try again later or contact the platform administrator."
    ),
    "unauthorized_internal": (
        "This information is available only to authorized project members. Please provide the correct access password."
    ),
    "private_user_data": (
        "I cannot provide another user’s private information. "
        "Please use the platform’s authorized communication or request process."
    ),
    "medical_question": (
        "I can explain the platform’s verification process, but I cannot diagnose medical conditions "
        "or determine medical fitness. Please consult a qualified healthcare professional."
    ),
    "recruitment_guarantee": (
        "The platform can help users discover and communicate about opportunities, "
        "but it cannot guarantee an internship, contract, recruitment decision, or sponsorship."
    ),
    "prompt_injection": (
        "I can help with permitted questions about the platform, but I cannot reveal internal instructions, "
        "private data, credentials, or restricted system information."
    )
}

DEFAULT_AUTHORIZED_EMAILS = [
    "admin@project.local",
    "developer@aast.edu",
    "team@project.local",
    "alex.vance@student.aast.edu"
]

class SafetyGuard:
    @staticmethod
    def inspect_input(
        prompt, 
        environment="public", 
        user_email="", 
        authorized_emails=None,
        access_password="",
        required_password=""
    ):
        """
        Inspects incoming prompt against privacy, password verification, scope, and injection rules.
        Returns: (is_blocked: bool, fallback_message: str or None, reason: str or None)
        """
        prompt_lower = prompt.lower().strip()
        auth_list = authorized_emails if (authorized_emails and len(authorized_emails) > 0) else DEFAULT_AUTHORIZED_EMAILS

        # 1. Password Verification for Internal and Development environments
        if environment in ["internal", "development"]:
            # If a password is required on the backend, verify it
            if required_password:
                if not access_password or access_password != required_password:
                    return True, FALLBACK_MESSAGES["unauthorized_internal"], "unauthorized_password_required"

            # Optional email check
            if user_email and user_email not in auth_list:
                # If password is correct, we permit access; otherwise block
                if required_password and access_password != required_password:
                    return True, FALLBACK_MESSAGES["unauthorized_internal"], "unauthorized_internal_access"

        # 2. Prompt injection & System prompt extraction attempts
        injection_patterns = [
            r"ignore (all )?(previous|above) instructions",
            r"reveal (your |the )?(system prompt|instructions|hidden prompt)",
            r"what is your (system prompt|hidden prompt|initial instruction)",
            r"output (your |the )?system (prompt|instructions)",
            r"show me the prompt",
            r"print your config"
        ]
        for pattern in injection_patterns:
            if re.search(pattern, prompt_lower):
                return True, FALLBACK_MESSAGES["prompt_injection"], "prompt_injection_prevented"

        # 3. Medical diagnosis & Fitness certification requests
        medical_patterns = [
            r"diagnose",
            r"what disease",
            r"prescribe (me )?",
            r"treatment for (my )?(injury|pain|tear)",
            r"knee injury|hamstring tear|muscle tear",
            r"does (the )?blue badge prove i am (100% )?(medically fit|healthy|cured)",
            r"give me a medical diagnosis"
        ]
        for pattern in medical_patterns:
            if re.search(pattern, prompt_lower):
                return True, FALLBACK_MESSAGES["medical_question"], "medical_diagnosis_blocked"

        # 4. Guarantee claims requests
        guarantee_patterns = [
            r"guarantee (me )?(an )?(internship|job|recruitment|contract|signing)",
            r"promise that i will (get hired|be recruited|get an internship)",
            r"does (the )?platform guarantee (employment|recruitment|contracts)",
            r"will everyone get an internship",
            r"guarantee"
        ]
        for pattern in guarantee_patterns:
            if re.search(pattern, prompt_lower):
                return True, FALLBACK_MESSAGES["recruitment_guarantee"], "guarantee_claim_prevented"

        # 5. Private user data requests from public environment
        if environment == "public":
            private_data_patterns = [
                r"show me (another|other) user'?s? (password|email|phone|contact|address)",
                r"who is user id \d+",
                r"show me student'?s? private cv",
                r"show me (the )?source code",
                r"what is the database (schema|password|credentials)",
                r"show me api keys"
            ]
            for pattern in private_data_patterns:
                if re.search(pattern, prompt_lower):
                    return True, FALLBACK_MESSAGES["public_restriction"], "public_restriction_applied"

        return False, None, None

    @staticmethod
    def sanitize_output(content, environment="public"):
        """
        Post-processes model output to ensure no accidental secret/password/token leak.
        """
        if not content:
            return content

        sanitized = re.sub(r'sk-[a-zA-Z0-9]{20,}', '[REDACTED_API_KEY]', content)
        sanitized = re.sub(r'password\s*=\s*[\'"][^\'"]+[\'"]', 'password="[REDACTED]"', sanitized, flags=re.IGNORECASE)
        sanitized = re.sub(r'SECRET_KEY\s*=\s*[\'"][^\'"]+[\'"]', 'SECRET_KEY="[REDACTED]"', sanitized, flags=re.IGNORECASE)

        if environment == "public":
            sanitized = re.sub(r'\[INTERNAL_PROJECT_NOTE:[^\]]+\]', '', sanitized)

        return sanitized
