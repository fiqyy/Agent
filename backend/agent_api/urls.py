from django.urls import path
from .views import (
    PublicAgentChatView,
    InternalAgentChatView,
    DevelopmentAgentChatView,
    MultiEnvironmentChatRouterView,
    VerifyAccessPasswordView,
    AgentConfigView,
    ConversationHistoryView,
    ResetMemoryView,
    AgentToolsView,
    PlatformOverviewView,
    AuditLogsView
)

urlpatterns = [
    # 3-Environment AI Agent Endpoints
    path('agent/public/chat/', PublicAgentChatView.as_view(), name='agent-public-chat'),
    path('agent/internal/chat/', InternalAgentChatView.as_view(), name='agent-internal-chat'),
    path('agent/development/chat/', DevelopmentAgentChatView.as_view(), name='agent-development-chat'),
    path('agent/chat/', MultiEnvironmentChatRouterView.as_view(), name='agent-multi-chat'),
    path('agent/verify-access/', VerifyAccessPasswordView.as_view(), name='verify-access'),

    # Configuration & Memory
    path('agent/config/', AgentConfigView.as_view(), name='agent-config'),
    path('agent/history/', ConversationHistoryView.as_view(), name='conversation-history'),
    path('agent/reset-memory/', ResetMemoryView.as_view(), name='reset-memory'),
    path('agent/tools/', AgentToolsView.as_view(), name='agent-tools'),
    path('agent/audit-logs/', AuditLogsView.as_view(), name='audit-logs'),

    # Platform Marketplace & Entities Overview
    path('platform/overview/', PlatformOverviewView.as_view(), name='platform-overview'),
]
