import React, { useState, useEffect } from 'react';
import { agentApi } from '../api/agentApi';
import Navbar from '../components/Navbar';
import Dashboard from '../components/Dashboard';
import AgentChat from '../components/AgentChat';
import AgentStudio from '../components/AgentStudio';
import AcademicDocumentation from '../components/AcademicDocumentation';
import MarketplaceExplorer from '../components/MarketplaceExplorer';
import AuditSafetyLogs from '../components/AuditSafetyLogs';
import ToolSandbox from '../components/ToolSandbox';
import Toast from '../components/Toast';
import confetti from 'canvas-confetti';
import { LogOut } from 'lucide-react';

export default function AdminApp({ accessPassword, onLogout }) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [activeEnvironment, setActiveEnvironment] = useState('internal');
  const [agentConfig, setAgentConfig] = useState(null);
  const [platformData, setPlatformData] = useState(null);
  const [messages, setMessages] = useState([]);
  const [initialPrompt, setInitialPrompt] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'info') => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4500);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const fetchAllData = async () => {
    try {
      const [config, overview, history] = await Promise.all([
        agentApi.getConfig().catch(() => null),
        agentApi.getPlatformOverview().catch(() => null),
        agentApi.getConversationHistory('internal-session', activeEnvironment).catch(() => null),
      ]);

      if (config) {
        setAgentConfig(config);
        if (config.active_environment) setActiveEnvironment(config.active_environment);
      }
      if (overview) setPlatformData(overview);
      if (history?.messages) setMessages(history.messages);
    } catch (err) {
      console.error('Data load error:', err);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  useEffect(() => {
    const sessionId = `${activeEnvironment}-session`;
    const userEmail = activeEnvironment === 'internal' ? 'admin@project.local' : (activeEnvironment === 'development' ? 'developer@aast.edu' : 'guest@platform.local');
    agentApi.getConversationHistory(sessionId, activeEnvironment, userEmail)
      .then(hist => {
        if (hist?.messages) setMessages(hist.messages);
      })
      .catch(() => {});
  }, [activeEnvironment]);

  const handleSendMessage = async (userText, env = activeEnvironment, email = 'admin@project.local') => {
    if (!userText.trim()) return;

    const tempUserMsg = {
      id: Date.now(),
      sender_type: 'user',
      content: userText,
      created_at: new Date().toISOString()
    };
    setMessages(prev => [...prev, tempUserMsg]);
    setIsChatLoading(true);

    try {
      const sessionId = `${env}-session`;
      const res = await agentApi.sendChatMessage(userText, env, email, sessionId, accessPassword);
      if (res.assistant_message) {
        setMessages(prev => [...prev, res.assistant_message]);
        if (res.safety_violations && res.safety_violations.length > 0) {
          addToast(`Safety Policy Guard Enforced: ${res.safety_violations.join(', ')}`, 'error');
        } else {
          addToast(`Project Opportunity Assistant responded (${env.toUpperCase()} mode)`, 'success');
        }
      }
    } catch (err) {
      addToast('Failed to reach backend assistant API. Check server connection.', 'error');
    } finally {
      setIsChatLoading(false);
    }
  };

  const handleTriggerQuickPrompt = (promptText, env = activeEnvironment) => {
    setActiveEnvironment(env);
    setInitialPrompt(promptText);
    setActiveTab('chat');
    handleSendMessage(promptText, env, env === 'internal' ? 'admin@project.local' : (env === 'development' ? 'developer@aast.edu' : 'guest@platform.local'));
  };

  const handleResetMemory = async () => {
    const sessionId = `${activeEnvironment}-session`;
    if (window.confirm(`Reset conversation context for ${activeEnvironment.toUpperCase()} mode?`)) {
      try {
        await agentApi.resetMemory(sessionId);
        const hist = await agentApi.getConversationHistory(sessionId, activeEnvironment);
        setMessages(hist.messages || []);
        addToast(`Conversation context cleared for ${activeEnvironment.toUpperCase()} mode.`, 'info');
      } catch (err) {
        addToast('Failed to reset memory.', 'error');
      }
    }
  };

  const handleSaveConfig = async (newConfigData) => {
    try {
      const saved = await agentApi.updateConfig(newConfigData);
      setAgentConfig(saved);
      addToast('Agent configuration and environment directives deployed!', 'success');
      try {
        confetti({ particleCount: 35, spread: 60, origin: { y: 0.7 } });
      } catch (e) {}
    } catch (err) {
      addToast('Error saving agent configuration.', 'error');
    }
  };

  return (
    <div className="app-container">
      {/* Top Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        activeEnvironment={activeEnvironment}
        setActiveEnvironment={setActiveEnvironment}
        agentConfig={agentConfig}
        onResetMemory={handleResetMemory}
        onLogout={onLogout}
        isAdmin={true}
      />

      {/* Main Content Area */}
      <main className="main-content">
        {activeTab === 'dashboard' && (
          <Dashboard
            platformData={platformData}
            agentConfig={agentConfig}
            activeEnvironment={activeEnvironment}
            onTriggerQuickPrompt={handleTriggerQuickPrompt}
            onNavigateTab={setActiveTab}
          />
        )}

        {activeTab === 'chat' && (
          <AgentChat
            messages={messages}
            onSendMessage={handleSendMessage}
            isLoading={isChatLoading}
            onResetMemory={handleResetMemory}
            agentConfig={agentConfig}
            activeEnvironment={activeEnvironment}
            setActiveEnvironment={setActiveEnvironment}
            initialPrompt={initialPrompt}
          />
        )}

        {activeTab === 'studio' && (
          <AgentStudio
            agentConfig={agentConfig}
            onSaveConfig={handleSaveConfig}
            onNavigateTab={setActiveTab}
          />
        )}

        {activeTab === 'academic' && (
          <AcademicDocumentation
            onRunToolDirect={agentApi.runToolDirect}
          />
        )}

        {activeTab === 'marketplace' && (
          <MarketplaceExplorer
            platformData={platformData}
          />
        )}

        {activeTab === 'audit' && (
          <AuditSafetyLogs
            onFetchLogs={agentApi.getAuditLogs}
          />
        )}

        {activeTab === 'sandbox' && (
          <ToolSandbox
            onRunToolDirect={agentApi.runToolDirect}
          />
        )}
      </main>

      <Toast toasts={toasts} onDismiss={removeToast} />
    </div>
  );
}
