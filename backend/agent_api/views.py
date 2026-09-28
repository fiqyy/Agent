from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.utils import timezone
from .models import (
    AgentConfiguration,
    UserAccount,
    StudentProfile,
    AthleteProfile,
    ScoutProfile,
    EnterpriseProfile,
    Internship,
    InternshipApplication,
    RecruitmentOffer,
    VerificationRequest,
    AgentConversation,
    AgentMessage,
    AuditLog
)
from .serializers import (
    AgentConfigurationSerializer,
    UserAccountSerializer,
    StudentProfileSerializer,
    AthleteProfileSerializer,
    ScoutProfileSerializer,
    EnterpriseProfileSerializer,
    InternshipSerializer,
    InternshipApplicationSerializer,
    RecruitmentOfferSerializer,
    VerificationRequestSerializer,
    AgentConversationSerializer,
    AgentMessageSerializer,
    AuditLogSerializer
)
from .agent_engine import ProjectOpportunityAgentEngine

def get_or_create_config():
    config = AgentConfiguration.objects.first()
    if not config:
        config = AgentConfiguration.objects.create()
    return config

def seed_sample_marketplace_if_empty():
    if UserAccount.objects.count() == 0:
        # 1. Dual-Career User (Student + Athlete)
        u1 = UserAccount.objects.create(email="alex.vance@student.aast.edu", full_name="Alex Morgan Vance", role="user", is_internal_member=True)
        StudentProfile.objects.create(
            user=u1,
            university="AAST Elite Institute of Tech",
            faculty="Faculty of Engineering & Technology",
            major="Computer Engineering & Applied AI",
            field_of_study="Software Architecture & Machine Learning",
            gpa=3.88,
            skills=["Python", "React", "Django REST", "Docker", "Machine Learning"],
            experience="Research Assistant in Distributed Intelligence; Top 5% Dean's Honor Roll",
            projects="1. APEX Project Opportunity Agent\n2. Real-time Multi-Agent Telemetry Stream",
            interests=["AI Systems", "Cloud Computing", "Sports Analytics"]
        )
        AthleteProfile.objects.create(
            user=u1,
            sport="Track & Field / Sprinting",
            position="400m Dash & Anchor Relay",
            age=21,
            height_cm=182.0,
            weight_kg=74.5,
            location="Alexandria / Cairo",
            teams_academies="AAST Varsity Sprint Team, National Youth Athletics Club",
            achievements="National University Games 400m Gold (46.4s PR), 200m Silver (21.1s)",
            performance_statistics={"400m_PR": "46.4s", "200m_PR": "21.1s", "Reaction_Time": "0.142s"},
            gameplay_videos=["https://storage.platform.local/videos/alex_400m_finals.mp4"],
            verification_status="medical_verified",
            verified_clinic_name="Elite Sports Physiotherapy & InBody Center",
            verification_date=timezone.now().date()
        )

        # 2. Enterprise User
        u_ent = UserAccount.objects.create(email="recruiter@novatech.global", full_name="NovaTech Systems Talent Ops", role="enterprise")
        ent_prof = EnterpriseProfile.objects.create(
            user=u_ent,
            company_name="NovaTech Systems Global",
            industry="Artificial Intelligence & Cloud Enterprise Solutions",
            location="Smart Village, Cairo",
            description="Global tech enterprise providing AI platforms, cloud architectures, and edge computing.",
            contact_email="careers@novatech.global"
        )
        internship = Internship.objects.create(
            enterprise=ent_prof,
            title="AI Systems & Full Stack Software Engineering Intern",
            field="Computer Engineering & Software Systems",
            required_skills=["Python", "Django", "React", "API Architecture"],
            duration_months=3,
            location="Hybrid (Cairo / Remote)",
            description="Collaborate with senior engineers building production-grade AI microservices, React frontends, and Django REST APIs."
        )

        # 3. Scout User
        u_scout = UserAccount.objects.create(email="scout.davis@olympic-talents.org", full_name="Marcus Davis", role="scout")
        scout_prof = ScoutProfile.objects.create(
            user=u_scout,
            organization="National Olympic & Varsity Athletics Scouting Network",
            sports_specialization="Track & Field, Sprinting, High Performance",
            experience_years=10
        )
        RecruitmentOffer.objects.create(
            scout=scout_prof,
            athlete=u1.athlete_profile,
            opportunity_details="Official Invitation to National Championship Elite Sprint Trials with full collegiate athletic sponsorship package.",
            status="sent"
        )

        # 4. Verification Request
        VerificationRequest.objects.create(
            athlete=u1.athlete_profile,
            clinic_name="Elite Sports Physiotherapy & InBody Center",
            assessment_type="InBody Body Composition & Physiotherapy Assessment",
            status="approved",
            reviewer_notes="InBody assessment and physical mobility verified. Blue verification badge issued according to platform policy."
        )


class PublicAgentChatView(APIView):
    """
    Public Chatbot Endpoint:
    Available to all platform visitors and registered users.
    Enforces strict privacy and read-only non-guarantee disclosures.
    """
    def post(self, request):
        seed_sample_marketplace_if_empty()
        session_id = request.data.get('session_id', 'public-session')
        user_prompt = request.data.get('message', '').strip()
        user_email = request.data.get('user_email', 'guest@platform.local')

        if not user_prompt:
            return Response({"error": "Message cannot be empty."}, status=status.HTTP_400_BAD_REQUEST)

        config = get_or_create_config()
        conv, _ = AgentConversation.objects.get_or_create(
            session_id=session_id,
            defaults={
                'environment': 'public',
                'user_email': user_email,
                'user_role': 'public_user',
                'title': f"Public Inquiry: {user_prompt[:30]}"
            }
        )

        # Save user message
        AgentMessage.objects.create(
            conversation=conv,
            sender_type='user',
            content=user_prompt,
            model_name=config.model_name
        )

        # Process with Public Engine
        engine = ProjectOpportunityAgentEngine(config=AgentConfigurationSerializer(config).data)
        history = [{'role': m.sender_type, 'content': m.content} for m in conv.messages.order_by('id')[:config.memory_limit]]

        agent_result = engine.process_message(
            user_prompt=user_prompt,
            environment='public',
            user_email=user_email,
            conversation_history=history
        )

        # Save agent response
        agent_msg = AgentMessage.objects.create(
            conversation=conv,
            sender_type='agent',
            content=agent_result['content'],
            model_name=config.model_name,
            thought_steps=agent_result.get('thought_steps', []),
            tool_invocations=agent_result.get('executed_tools', []),
            safety_violations_prevented=agent_result.get('safety_violations', [])
        )

        # Audit Log
        AuditLog.objects.create(
            actor_email=user_email,
            action="PUBLIC_CHAT_QUERY",
            target_type="AgentConversation",
            target_id=str(conv.id),
            environment="public",
            result="BLOCKED" if agent_result.get('safety_violations') else "SUCCESS"
        )

        return Response({
            "session_id": session_id,
            "environment": "public",
            "assistant_message": AgentMessageSerializer(agent_msg).data,
            "thought_steps": agent_result.get('thought_steps', []),
            "executed_tools": agent_result.get('executed_tools', []),
            "safety_violations": agent_result.get('safety_violations', [])
        })


class VerifyAccessPasswordView(APIView):
    """
    Validates access code/password for Internal Group Assistant or Development Assistant.
    """
    def post(self, request):
        env = request.data.get('environment', 'internal')
        password = request.data.get('password', '').strip()
        config = get_or_create_config()

        if env == 'internal':
            required = config.internal_access_password or 'grad2026'
        elif env == 'development':
            required = config.development_access_password or 'dev2026'
        else:
            return Response({"status": "authorized", "environment": "public"})

        if password == required:
            return Response({
                "status": "authorized",
                "environment": env,
                "message": f"Access granted to {env.upper()} mode."
            })
        else:
            return Response({
                "status": "unauthorized",
                "error": f"Invalid password for {env.upper()} mode. Please check with the project administrator."
            }, status=status.HTTP_401_UNAUTHORIZED)


class InternalAgentChatView(APIView):
    """
    Internal Group Assistant Endpoint:
    For authorized graduation project team members.
    Helps with documentation, architecture, SMART objectives, feasibility, and defense Q&A.
    """
    def post(self, request):
        seed_sample_marketplace_if_empty()
        session_id = request.data.get('session_id', 'internal-session')
        user_prompt = request.data.get('message', '').strip()
        user_email = request.data.get('user_email', 'admin@project.local')
        access_password = request.data.get('access_password', '')

        if not user_prompt:
            return Response({"error": "Message cannot be empty."}, status=status.HTTP_400_BAD_REQUEST)

        config = get_or_create_config()
        conv, _ = AgentConversation.objects.get_or_create(
            session_id=session_id,
            defaults={
                'environment': 'internal',
                'user_email': user_email,
                'user_role': 'group_member',
                'title': f"Internal Consultation: {user_prompt[:30]}"
            }
        )

        AgentMessage.objects.create(
            conversation=conv,
            sender_type='user',
            content=user_prompt,
            model_name=config.model_name
        )

        engine = ProjectOpportunityAgentEngine(config=AgentConfigurationSerializer(config).data)
        history = [{'role': m.sender_type, 'content': m.content} for m in conv.messages.order_by('id')[:config.memory_limit]]

        agent_result = engine.process_message(
            user_prompt=user_prompt,
            environment='internal',
            user_email=user_email,
            conversation_history=history,
            access_password=access_password
        )

        agent_msg = AgentMessage.objects.create(
            conversation=conv,
            sender_type='agent',
            content=agent_result['content'],
            model_name=config.model_name,
            thought_steps=agent_result.get('thought_steps', []),
            tool_invocations=agent_result.get('executed_tools', []),
            safety_violations_prevented=agent_result.get('safety_violations', [])
        )

        AuditLog.objects.create(
            actor_email=user_email,
            action="INTERNAL_PROJECT_QUERY",
            target_type="AgentConversation",
            target_id=str(conv.id),
            environment="internal",
            result="BLOCKED" if agent_result.get('safety_violations') else "SUCCESS"
        )

        return Response({
            "session_id": session_id,
            "environment": "internal",
            "assistant_message": AgentMessageSerializer(agent_msg).data,
            "thought_steps": agent_result.get('thought_steps', []),
            "executed_tools": agent_result.get('executed_tools', []),
            "safety_violations": agent_result.get('safety_violations', [])
        })


class DevelopmentAgentChatView(APIView):
    """
    Project Development Assistant Endpoint:
    For developers and technical reviews.
    Helps with code, database modeling, REST APIs, and testing.
    """
    def post(self, request):
        seed_sample_marketplace_if_empty()
        session_id = request.data.get('session_id', 'dev-session')
        user_prompt = request.data.get('message', '').strip()
        user_email = request.data.get('user_email', 'developer@aast.edu')
        access_password = request.data.get('access_password', '')

        if not user_prompt:
            return Response({"error": "Message cannot be empty."}, status=status.HTTP_400_BAD_REQUEST)

        config = get_or_create_config()
        conv, _ = AgentConversation.objects.get_or_create(
            session_id=session_id,
            defaults={
                'environment': 'development',
                'user_email': user_email,
                'user_role': 'developer',
                'title': f"Dev Task: {user_prompt[:30]}"
            }
        )

        AgentMessage.objects.create(
            conversation=conv,
            sender_type='user',
            content=user_prompt,
            model_name=config.model_name
        )

        engine = ProjectOpportunityAgentEngine(config=AgentConfigurationSerializer(config).data)
        history = [{'role': m.sender_type, 'content': m.content} for m in conv.messages.order_by('id')[:config.memory_limit]]

        agent_result = engine.process_message(
            user_prompt=user_prompt,
            environment='development',
            user_email=user_email,
            conversation_history=history,
            access_password=access_password
        )

        agent_msg = AgentMessage.objects.create(
            conversation=conv,
            sender_type='agent',
            content=agent_result['content'],
            model_name=config.model_name,
            thought_steps=agent_result.get('thought_steps', []),
            tool_invocations=agent_result.get('executed_tools', []),
            safety_violations_prevented=agent_result.get('safety_violations', [])
        )

        return Response({
            "session_id": session_id,
            "environment": "development",
            "assistant_message": AgentMessageSerializer(agent_msg).data,
            "thought_steps": agent_result.get('thought_steps', []),
            "executed_tools": agent_result.get('executed_tools', []),
            "safety_violations": agent_result.get('safety_violations', [])
        })


class MultiEnvironmentChatRouterView(APIView):
    """
    Unified router that accepts environment parameter ('public', 'internal', 'development').
    """
    def post(self, request):
        env = request.data.get('environment', 'internal')
        if env == 'public':
            return PublicAgentChatView().post(request)
        elif env == 'development':
            return DevelopmentAgentChatView().post(request)
        else:
            return InternalAgentChatView().post(request)


class AgentConfigView(APIView):
    def get(self, request):
        config = get_or_create_config()
        serializer = AgentConfigurationSerializer(config)
        return Response(serializer.data)

    def post(self, request):
        config = get_or_create_config()
        serializer = AgentConfigurationSerializer(config, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request):
        return self.post(request)


class ConversationHistoryView(APIView):
    def get(self, request):
        seed_sample_marketplace_if_empty()
        session_id = request.query_params.get('session_id', 'internal-session')
        env = request.query_params.get('environment', 'internal')
        user_email = request.query_params.get('user_email', 'admin@project.local')

        conversation = AgentConversation.objects.filter(session_id=session_id).first()
        if not conversation:
            conversation = AgentConversation.objects.create(
                session_id=session_id,
                environment=env,
                user_email=user_email,
                user_role='group_member' if env == 'internal' else ('developer' if env == 'development' else 'student'),
                title=f"{env.capitalize()} Session"
            )
            config = get_or_create_config()
            greeting = (
                f"### 🤝 {config.name} Initialized ({env.upper()} Mode)\n\n"
                f"Official AI assistant for the graduation-project platform connecting **Students with Enterprises** (Internships) "
                f"and **Athletes with Scouts** (Talent Discovery).\n\n"
                f"How may I assist you with project documentation, technical architecture, scouting workflows, or internships today?"
            )
            AgentMessage.objects.create(
                conversation=conversation,
                sender_type='agent',
                content=greeting,
                thought_steps=[{"phase": "Initialization", "thought": f"Agent initialized in {env} mode with verified policy guardrails."}]
            )

        serializer = AgentConversationSerializer(conversation)
        return Response(serializer.data)


class ResetMemoryView(APIView):
    def post(self, request):
        session_id = request.data.get('session_id')
        if session_id:
            AgentConversation.objects.filter(session_id=session_id).delete()
            return Response({"status": "success", "message": f"Memory cleared for session {session_id}."})
        return Response({"status": "error", "message": "session_id required"}, status=status.HTTP_400_BAD_REQUEST)


class AgentToolsView(APIView):
    def get(self, request):
        config = get_or_create_config()
        engine = ProjectOpportunityAgentEngine(config=AgentConfigurationSerializer(config).data)
        return Response(engine.get_registered_tools())

    def post(self, request):
        tool_id = request.data.get('tool_id')
        params = request.data.get('params', {})
        config = get_or_create_config()
        engine = ProjectOpportunityAgentEngine(config=AgentConfigurationSerializer(config).data)
        result = engine.execute_tool_direct(tool_id, params)
        return Response({"tool_id": tool_id, "result": result})


class PlatformOverviewView(APIView):
    """
    Returns live marketplace data: Dual-Profile Users, Students, Athletes, Enterprises, Scouts, Internships, Offers, and Verifications.
    """
    def get(self, request):
        seed_sample_marketplace_if_empty()
        users = UserAccount.objects.all()
        students = StudentProfile.objects.all()
        athletes = AthleteProfile.objects.all()
        enterprises = EnterpriseProfile.objects.all()
        scouts = ScoutProfile.objects.all()
        internships = Internship.objects.all()
        offers = RecruitmentOffer.objects.all()
        verifications = VerificationRequest.objects.all()

        dual_users = 0
        for u in users:
            if hasattr(u, 'student_profile') and hasattr(u, 'athlete_profile'):
                dual_users += 1

        return Response({
            "metrics": {
                "total_users": users.count(),
                "dual_profile_users": dual_users,
                "student_profiles": students.count(),
                "athlete_profiles": athletes.count(),
                "enterprise_profiles": enterprises.count(),
                "scout_profiles": scouts.count(),
                "published_internships": internships.count(),
                "recruitment_offers": offers.count(),
                "verified_athletes": athletes.filter(verification_status__in=['medical_verified', 'basic_verified']).count(),
            },
            "sample_student": StudentProfileSerializer(students.first()).data if students.exists() else None,
            "sample_athlete": AthleteProfileSerializer(athletes.first()).data if athletes.exists() else None,
            "sample_enterprise": EnterpriseProfileSerializer(enterprises.first()).data if enterprises.exists() else None,
            "sample_scout": ScoutProfileSerializer(scouts.first()).data if scouts.exists() else None,
            "internships": InternshipSerializer(internships[:5], many=True).data,
            "recruitment_offers": RecruitmentOfferSerializer(offers[:5], many=True).data,
            "verification_requests": VerificationRequestSerializer(verifications[:5], many=True).data,
        })


class AuditLogsView(APIView):
    def get(self, request):
        logs = AuditLog.objects.order_by('-id')[:20]
        return Response(AuditLogSerializer(logs, many=True).data)
