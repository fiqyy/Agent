import React from 'react';
import { 
  Bot, 
  LayoutDashboard, 
  MessageSquare, 
  Sliders, 
  FileText, 
  Briefcase, 
  ShieldCheck, 
  Cpu, 
  RotateCcw,
  Lock,
  Code,
  LogOut,
  Shield
} from 'lucide-react';

export default function Navbar({ 
  activeTab, 
  setActiveTab, 
  activeEnvironment, 
  setActiveEnvironment,
  agentConfig, 
  onResetMemory,
  onLogout,
  isAdmin
}) {
  const tabs = [
    { id: 'dashboard', label: 'Opportunity Hub', icon: LayoutDashboard },
    { id: 'chat', label: 'Assistant Console', icon: MessageSquare },
    { id: 'studio', label: 'Agent Configuration', icon: Sliders },
    { id: 'academic', label: 'Academic & Defense Docs', icon: FileText },
    { id: 'marketplace', label: 'Marketplace & Workflows', icon: Briefcase },
    { id: 'audit', label: 'Security & Safety Logs', icon: ShieldCheck },
    { id: 'sandbox', label: 'Tool Sandbox', icon: Cpu },
  ];

  const envs = [
    { id: 'internal', label: 'Internal Group', icon: Lock, color: 'var(--accent-emerald)' },
    { id: 'development', label: 'Dev Assistant', icon: Code, color: 'var(--accent-purple)' },
  ];

  return (
    <header className="navbar">
      {/* Brand Identity */}
      <div className="nav-brand" onClick={() => setActiveTab('dashboard')}>
        <div className="brand-icon-wrapper" style={{ background: 'linear-gradient(135deg, #06b6d4, #6366f1)' }}>
          <Bot size={22} />
        </div>
        <div className="brand-text">
          <h1>
            PROJECT OPPORTUNITY <span className="brand-badge">ADMIN CONSOLE</span>
          </h1>
          <p className="brand-tagline">
            {agentConfig?.name || 'Project Opportunity Assistant'} • Admin Dashboard
          </p>
        </div>
      </div>

      {/* Environment Switcher (Internal & Dev only for admin) */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(15, 23, 42, 0.7)', padding: '4px', borderRadius: 'var(--radius-full)', border: '1px solid var(--border-subtle)' }}>
        {envs.map((env) => {
          const Icon = env.icon;
          const isActive = activeEnvironment === env.id;
          return (
            <button
              key={env.id}
              onClick={() => setActiveEnvironment(env.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 14px',
                borderRadius: 'var(--radius-full)',
                border: isActive ? `1px solid ${env.color}` : '1px solid transparent',
                background: isActive ? 'rgba(255,255,255,0.08)' : 'transparent',
                color: isActive ? '#fff' : 'var(--text-secondary)',
                fontSize: '0.78rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              title={`Switch to ${env.label} mode`}
            >
              <Icon size={13} color={env.color} />
              <span>{env.label}</span>
            </button>
          );
        })}
      </div>

      {/* Navigation Tabs */}
      <nav className="nav-tabs">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              className={`nav-tab-btn ${isActive ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <Icon size={15} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Reset & Logout */}
      <div className="nav-status">
        <button
          className="btn-secondary"
          onClick={onResetMemory}
          style={{ padding: '6px 12px', fontSize: '0.75rem' }}
          title="Reset Active Session Context"
        >
          <RotateCcw size={13} />
          <span>Reset Context</span>
        </button>

        {isAdmin && onLogout && (
          <button
            className="btn-secondary"
            onClick={onLogout}
            style={{ 
              padding: '6px 12px', 
              fontSize: '0.75rem',
              borderColor: 'rgba(244, 63, 94, 0.3)',
              color: 'var(--accent-rose)'
            }}
            title="Lock admin console and return to login"
          >
            <LogOut size={13} />
            <span>Lock</span>
          </button>
        )}
      </div>
    </header>
  );
}
