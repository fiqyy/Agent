from rest_framework import serializers
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

class AgentConfigurationSerializer(serializers.ModelSerializer):
    class Meta:
        model = AgentConfiguration
        fields = '__all__'


class UserAccountSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserAccount
        fields = '__all__'


class StudentProfileSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source='user.full_name', read_only=True)
    user_email = serializers.CharField(source='user.email', read_only=True)

    class Meta:
        model = StudentProfile
        fields = '__all__'


class AthleteProfileSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source='user.full_name', read_only=True)
    user_email = serializers.CharField(source='user.email', read_only=True)

    class Meta:
        model = AthleteProfile
        fields = '__all__'


class ScoutProfileSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source='user.full_name', read_only=True)
    user_email = serializers.CharField(source='user.email', read_only=True)

    class Meta:
        model = ScoutProfile
        fields = '__all__'


class EnterpriseProfileSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source='user.full_name', read_only=True)
    user_email = serializers.CharField(source='user.email', read_only=True)

    class Meta:
        model = EnterpriseProfile
        fields = '__all__'


class InternshipSerializer(serializers.ModelSerializer):
    enterprise_name = serializers.CharField(source='enterprise.company_name', read_only=True)
    enterprise_industry = serializers.CharField(source='enterprise.industry', read_only=True)

    class Meta:
        model = Internship
        fields = '__all__'


class InternshipApplicationSerializer(serializers.ModelSerializer):
    student_name = serializers.CharField(source='student.user.full_name', read_only=True)
    student_major = serializers.CharField(source='student.major', read_only=True)
    internship_title = serializers.CharField(source='internship.title', read_only=True)
    enterprise_name = serializers.CharField(source='internship.enterprise.company_name', read_only=True)

    class Meta:
        model = InternshipApplication
        fields = '__all__'


class RecruitmentOfferSerializer(serializers.ModelSerializer):
    scout_name = serializers.CharField(source='scout.user.full_name', read_only=True)
    scout_org = serializers.CharField(source='scout.organization', read_only=True)
    athlete_name = serializers.CharField(source='athlete.user.full_name', read_only=True)
    athlete_sport = serializers.CharField(source='athlete.sport', read_only=True)

    class Meta:
        model = RecruitmentOffer
        fields = '__all__'


class VerificationRequestSerializer(serializers.ModelSerializer):
    athlete_name = serializers.CharField(source='athlete.user.full_name', read_only=True)
    athlete_sport = serializers.CharField(source='athlete.sport', read_only=True)

    class Meta:
        model = VerificationRequest
        fields = '__all__'


class AgentMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = AgentMessage
        fields = '__all__'


class AgentConversationSerializer(serializers.ModelSerializer):
    messages = AgentMessageSerializer(many=True, read_only=True)

    class Meta:
        model = AgentConversation
        fields = '__all__'


class AuditLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = AuditLog
        fields = '__all__'
