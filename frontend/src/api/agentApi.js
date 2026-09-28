/**
 * API Service for communicating with Project Opportunity Platform Django Backend.
 */

const API_BASE = 'http://127.0.0.1:8000/api';

export const agentApi = {
  // Agent Config
  async getConfig() {
    const res = await fetch(`${API_BASE}/agent/config/`);
    if (!res.ok) throw new Error('Failed to fetch agent config');
    return res.json();
  },

  async updateConfig(data) {
    const res = await fetch(`${API_BASE}/agent/config/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update agent config');
    return res.json();
  },

  // Password Verification for Internal / Dev environments
  async verifyAccessPassword(environment, password) {
    const res = await fetch(`${API_BASE}/agent/verify-access/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ environment, password }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Invalid password for this environment');
    }
    return res.json();
  },

  // Multi-Environment Chat
  async sendChatMessage(message, environment = 'internal', userEmail = 'admin@project.local', sessionId = 'default-session', accessPassword = '') {
    const res = await fetch(`${API_BASE}/agent/chat/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        message, 
        environment, 
        user_email: userEmail,
        session_id: sessionId,
        access_password: accessPassword
      }),
    });
    if (!res.ok) throw new Error('Failed to send message to agent');
    return res.json();
  },

  async getConversationHistory(sessionId = 'internal-session', environment = 'internal', userEmail = 'admin@project.local') {
    const res = await fetch(`${API_BASE}/agent/history/?session_id=${sessionId}&environment=${environment}&user_email=${encodeURIComponent(userEmail)}`);
    if (!res.ok) throw new Error('Failed to fetch conversation history');
    return res.json();
  },

  async resetMemory(sessionId = 'internal-session') {
    const res = await fetch(`${API_BASE}/agent/reset-memory/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ session_id: sessionId }),
    });
    if (!res.ok) throw new Error('Failed to reset agent memory');
    return res.json();
  },

  // Tools & Diagnostics
  async getTools() {
    const res = await fetch(`${API_BASE}/agent/tools/`);
    if (!res.ok) throw new Error('Failed to fetch agent tools');
    return res.json();
  },

  async runToolDirect(toolId, params = {}) {
    const res = await fetch(`${API_BASE}/agent/tools/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tool_id: toolId, params }),
    });
    if (!res.ok) throw new Error('Failed to execute tool');
    return res.json();
  },

  // Platform Overview & Marketplace Entities
  async getPlatformOverview() {
    const res = await fetch(`${API_BASE}/platform/overview/`);
    if (!res.ok) throw new Error('Failed to fetch platform overview');
    return res.json();
  },

  // Audit Logs
  async getAuditLogs() {
    const res = await fetch(`${API_BASE}/agent/audit-logs/`);
    if (!res.ok) throw new Error('Failed to fetch audit logs');
    return res.json();
  }
};
