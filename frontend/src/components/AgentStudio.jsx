import React, { useState, useEffect } from 'react';
import { 
  Sliders, 
  Save, 
  Sparkles, 
  Cpu, 
  Check, 
  Plus, 
  Trash2, 
  ShieldCheck, 
  Globe, 
  Lock, 
  Code, 
  Eye, 
  EyeOff, 
  Server,
  FileText
} from 'lucide-react';

export default function AgentStudio({ 
  agentConfig, 
  onSaveConfig, 
  onNavigateTab 
}) {
  const [formData, setFormData] = useState({
    name: 'Project Opportunity Assistant',
    active_environment: 'internal',
    public_system_prompt: '',
    internal_system_prompt: '',
    development_system_prompt: '',
    custom_directives: '',
    model_provider: 'local_simulation',
    model_name: 'llama3.2',
    ollama_endpoint: 'http://localhost:11434',
    api_key: '',
    temperature: 0.7,
    memory_limit: 25,
    active_tools: [],
    enforce_safety_filters: true,
    authorized_group_emails: []
  });

  const [activePromptTab, setActivePromptTab] = useState('internal');
  const [showApiKey, setShowApiKey] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [directiveList, setDirectiveList] = useState([]);
  const [newDirective, setNewDirective] = useState('');
  const [newEmail, setNewEmail] = useState('');

  useEffect(() => {
    if (agentConfig) {
      setFormData({
        name: agentConfig.name || 'Project Opportunity Assistant',
        active_environment: agentConfig.active_environment || 'internal',
        public_system_prompt: agentConfig.public_system_prompt || '',
        internal_system_prompt: agentConfig.internal_system_prompt || '',
        development_system_prompt: agentConfig.development_system_prompt || '',
        custom_directives: agentConfig.custom_directives || '',
        model_provider: agentConfig.model_provider || 'local_simulation',
        model_name: agentConfig.model_name || 'llama3.2',
        ollama_endpoint: agentConfig.ollama_endpoint || 'http://localhost:11434',
        api_key: agentConfig.api_key || '',
        temperature: agentConfig.temperature !== undefined ? agentConfig.temperature : 0.7,
        memory_limit: agentConfig.memory_limit || 25,
        active_tools: agentConfig.active_tools || [
          'opportunity_matcher', 'verification_explainer', 'academic_report_generator',
          'technical_architect', 'business_feasibility_analyzer', 'dual_profile_manager'
        ],
        enforce_safety_filters: agentConfig.enforce_safety_filters !== undefined ? agentConfig.enforce_safety_filters : true,
        authorized_group_emails: agentConfig.authorized_group_emails || [
          'admin@project.local', 'developer@aast.edu', 'team@project.local'
        ]
      });

      if (agentConfig.custom_directives) {
        setDirectiveList(agentConfig.custom_directives.split('\n').filter(l => l.trim().length > 0));
      }
    }
  }, [agentConfig]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleToggleTool = (toolId) => {
    setFormData(prev => {
      const current = prev.active_tools || [];
      const updated = current.includes(toolId)
        ? current.filter(t => t !== toolId)
        : [...current, toolId];
      return { ...prev, active_tools: updated };
    });
  };

  const handleAddDirective = () => {
    if (!newDirective.trim()) return;
    const updated = [...directiveList, newDirective.trim()];
    setDirectiveList(updated);
    setFormData(prev => ({ ...prev, custom_directives: updated.join('\n') }));
    setNewDirective('');
  };

  const handleRemoveDirective = (index) => {
    const updated = directiveList.filter((_, idx) => idx !== index);
    setDirectiveList(updated);
    setFormData(prev => ({ ...prev, custom_directives: updated.join('\n') }));
  };

  const handleAddEmail = () => {
    if (!newEmail.trim()) return;
    const updated = [...formData.authorized_group_emails, newEmail.trim()];
    setFormData(prev => ({ ...prev, authorized_group_emails: updated }));
    setNewEmail('');
  };

  const handleRemoveEmail = (emailToRemove) => {
    const updated = formData.authorized_group_emails.filter(e => e !== emailToRemove);
    setFormData(prev => ({ ...prev, authorized_group_emails: updated }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await onSaveConfig(formData);
    } finally {
      setIsSaving(false);
    }
  };

  const tools = [
    { id: 'opportunity_matcher', name: 'Student Internship & Athlete Scouting Matcher', desc: 'Matches student skills with internships & athlete profiles with scouts' },
    { id: 'verification_explainer', name: 'Clinic Verification & Blue Badge Explainer', desc: 'Explains InBody checks and mandatory non-guarantee safety boundaries' },
    { id: 'academic_report_generator', name: 'Academic Report & Defense Generator', desc: 'Produces copy-ready formal academic documentation sections' },
    { id: 'technical_architect', name: 'Database Schema & API Architect', desc: 'Generates ERD relational structures and REST endpoint specifications' },
    { id: 'business_feasibility_analyzer', name: 'Business Model & Feasibility Analyzer', desc: 'Evaluates project viability, freemium options, and SWOT analysis' },
    { id: 'dual_profile_manager', name: 'Dual-Profile Architecture Validator', desc: 'Validates single-account multi-profile coexistence (Student + Athlete)' },
  ];

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Header Banner */}
      <div className="glass-card" style={{ padding: '24px 32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <span className="badge badge-cyan">
                <Sliders size={13} /> Official AI Agent Configuration Studio
              </span>
            </div>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800 }}>
              AI Agent Identity & Multi-Environment Rules
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', maxWidth: '780px' }}>
              Configure the Project Opportunity Assistant's system prompts across Public, Internal, and Development environments, manage authorization emails, and toggle local Ollama integration.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button 
              type="button" 
              className="btn-primary" 
              onClick={handleSubmit} 
              disabled={isSaving}
              style={{ minWidth: '160px' }}
            >
              {isSaving ? <span className="live-pulse" /> : <Save size={16} />}
              <span>{isSaving ? 'Deploying...' : 'Save & Deploy'}</span>
            </button>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1.8fr 1.2fr', gap: '24px' }}>
        
        {/* Left Column: Prompts, Custom Rules & Directives */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Identity & Active Environment */}
          <div className="glass-card">
            <h3 className="card-title" style={{ marginBottom: '16px' }}>1. Agent Identity & Scope</h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div>
                <label className="input-label">Agent Name (Interim)</label>
                <input
                  type="text"
                  className="input-control"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  placeholder="Project Opportunity Assistant"
                />
                <p className="input-helper">Use final platform name once confirmed by graduation group.</p>
              </div>

              <div>
                <label className="input-label">Default Operating Environment</label>
                <select
                  className="input-control"
                  value={formData.active_environment}
                  onChange={(e) => handleChange('active_environment', e.target.value)}
                >
                  <option value="internal">🔐 Internal Group Assistant</option>
                  <option value="public">🌐 Public Platform Chatbot</option>
                  <option value="development">💻 Project Development Assistant</option>
                </select>
              </div>
            </div>
          </div>

          {/* 3-Environment System Prompts Tabbed Editor */}
          <div className="glass-card">
            <div className="card-header-row" style={{ marginBottom: '12px' }}>
              <div>
                <h3 className="card-title">2. System Instructions by Environment</h3>
                <p className="card-subtitle">Isolated system prompts tailored to access privileges</p>
              </div>
              
              <div style={{ display: 'flex', gap: '6px' }}>
                <button
                  type="button"
                  onClick={() => setActivePromptTab('internal')}
                  className={`nav-tab-btn ${activePromptTab === 'internal' ? 'active' : ''}`}
                  style={{ padding: '4px 10px', fontSize: '0.75rem' }}
                >
                  <Lock size={12} /> Internal
                </button>
                <button
                  type="button"
                  onClick={() => setActivePromptTab('public')}
                  className={`nav-tab-btn ${activePromptTab === 'public' ? 'active' : ''}`}
                  style={{ padding: '4px 10px', fontSize: '0.75rem' }}
                >
                  <Globe size={12} /> Public
                </button>
                <button
                  type="button"
                  onClick={() => setActivePromptTab('development')}
                  className={`nav-tab-btn ${activePromptTab === 'development' ? 'active' : ''}`}
                  style={{ padding: '4px 10px', fontSize: '0.75rem' }}
                >
                  <Code size={12} /> Dev
                </button>
              </div>
            </div>

            {activePromptTab === 'internal' && (
              <div>
                <label className="input-label" style={{ color: 'var(--accent-emerald)' }}>
                  🔐 Internal Group Assistant System Prompt
                </label>
                <textarea
                  className="input-control"
                  rows={7}
                  style={{ fontFamily: 'var(--font-mono)', fontSize: '0.82rem', lineHeight: 1.45 }}
                  value={formData.internal_system_prompt}
                  onChange={(e) => handleChange('internal_system_prompt', e.target.value)}
                />
              </div>
            )}

            {activePromptTab === 'public' && (
              <div>
                <label className="input-label" style={{ color: 'var(--primary-cyan)' }}>
                  🌐 Public Platform Chatbot System Prompt (Strict Privacy & Read-Only)
                </label>
                <textarea
                  className="input-control"
                  rows={7}
                  style={{ fontFamily: 'var(--font-mono)', fontSize: '0.82rem', lineHeight: 1.45 }}
                  value={formData.public_system_prompt}
                  onChange={(e) => handleChange('public_system_prompt', e.target.value)}
                />
              </div>
            )}

            {activePromptTab === 'development' && (
              <div>
                <label className="input-label" style={{ color: 'var(--accent-purple)' }}>
                  💻 Development Assistant System Prompt (Technical & Code Guidance)
                </label>
                <textarea
                  className="input-control"
                  rows={7}
                  style={{ fontFamily: 'var(--font-mono)', fontSize: '0.82rem', lineHeight: 1.45 }}
                  value={formData.development_system_prompt}
                  onChange={(e) => handleChange('development_system_prompt', e.target.value)}
                />
              </div>
            )}
          </div>

          {/* Custom Directives & Constraints */}
          <div className="glass-card">
            <div className="card-header-row" style={{ marginBottom: '12px' }}>
              <div>
                <h3 className="card-title">3. Confirmed Business Rules & Constraints</h3>
                <p className="card-subtitle">Mandatory directives enforced across all ReAct reasoning loops</p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', marginBottom: '14px' }}>
              <input
                type="text"
                className="input-control"
                placeholder="Add custom rule (e.g., 'Never guarantee recruitment or internships')..."
                value={newDirective}
                onChange={(e) => setNewDirective(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddDirective(); } }}
              />
              <button 
                type="button" 
                className="btn-primary" 
                onClick={handleAddDirective}
                style={{ padding: '0 16px', whiteSpace: 'nowrap' }}
              >
                <Plus size={16} />
                <span>Add Rule</span>
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {directiveList.map((dir, idx) => (
                <div 
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 14px',
                    borderRadius: 'var(--radius-md)',
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid var(--border-subtle)',
                    fontSize: '0.85rem'
                  }}
                >
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <span style={{ color: 'var(--primary-cyan)', fontWeight: 700 }}>#{idx + 1}</span>
                    <span>{dir}</span>
                  </div>
                  <button
                    type="button"
                    style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                    onClick={() => handleRemoveDirective(idx)}
                    title="Delete Rule"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column: Engine, Access Control & Tool Suite */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Engine & Local Ollama Config */}
          <div className="glass-card">
            <h3 className="card-title" style={{ marginBottom: '16px' }}>4. AI Engine & Local Ollama (No Cost)</h3>

            <div style={{ marginBottom: '14px' }}>
              <label className="input-label">Model Provider</label>
              <select
                className="input-control"
                value={formData.model_provider}
                onChange={(e) => handleChange('model_provider', e.target.value)}
              >
                <option value="local_simulation">⚡ Built-in Domain Simulation Engine (Instant, Offline, 100% Free)</option>
                <option value="ollama">🦙 Local Ollama Engine (e.g. Llama 3.2, Mistral on localhost:11434)</option>
                <option value="gemini">Google Gemini (Gemini 2.5 Flash / Pro)</option>
                <option value="openai">OpenAI (GPT-4o / GPT-4o-mini)</option>
                <option value="claude">Anthropic Claude (Claude 3.7 Sonnet)</option>
              </select>
            </div>

            {formData.model_provider === 'ollama' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '14px' }}>
                <div>
                  <label className="input-label">Ollama API Endpoint</label>
                  <input
                    type="text"
                    className="input-control"
                    value={formData.ollama_endpoint}
                    onChange={(e) => handleChange('ollama_endpoint', e.target.value)}
                    placeholder="http://localhost:11434"
                  />
                </div>
                <div>
                  <label className="input-label">Ollama Model Name</label>
                  <input
                    type="text"
                    className="input-control"
                    value={formData.model_name}
                    onChange={(e) => handleChange('model_name', e.target.value)}
                    placeholder="llama3.2 or mistral"
                  />
                </div>
              </div>
            )}

            {(formData.model_provider === 'openai' || formData.model_provider === 'gemini' || formData.model_provider === 'claude') && (
              <div style={{ marginBottom: '14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <label className="input-label" style={{ marginBottom: 0 }}>API Key</label>
                  <button
                    type="button"
                    onClick={() => setShowApiKey(!showApiKey)}
                    style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem' }}
                  >
                    {showApiKey ? <EyeOff size={13} /> : <Eye size={13} />}
                    <span>{showApiKey ? 'Hide' : 'Show'}</span>
                  </button>
                </div>
                <input
                  type={showApiKey ? 'text' : 'password'}
                  className="input-control"
                  value={formData.api_key}
                  onChange={(e) => handleChange('api_key', e.target.value)}
                  placeholder="Paste API Key here..."
                />
              </div>
            )}

            {/* Safety Filter Toggle */}
            <div style={{ padding: '12px', background: 'rgba(16, 185, 129, 0.08)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(16, 185, 129, 0.25)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ShieldCheck size={18} color="var(--accent-emerald)" />
                <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Enforce Official Safety Guard</span>
              </div>
              <input
                type="checkbox"
                checked={formData.enforce_safety_filters}
                onChange={(e) => handleChange('enforce_safety_filters', e.target.checked)}
                style={{ width: '18px', height: '18px', accentColor: 'var(--accent-emerald)' }}
              />
            </div>
          </div>

          {/* Authorized Group Member Access List */}
          <div className="glass-card">
            <h3 className="card-title" style={{ marginBottom: '12px' }}>5. Authorized Group Member Emails</h3>
            <p className="card-subtitle" style={{ marginBottom: '14px' }}>Only these emails can access Internal Group Assistant mode</p>

            <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
              <input
                type="email"
                className="input-control"
                placeholder="member@aast.edu"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
              />
              <button 
                type="button" 
                className="btn-secondary" 
                onClick={handleAddEmail}
                style={{ padding: '0 14px' }}
              >
                Add
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {formData.authorized_group_emails.map((email, eIdx) => (
                <div 
                  key={eIdx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 12px',
                    borderRadius: 'var(--radius-md)',
                    background: 'rgba(255, 255, 255, 0.02)',
                    border: '1px solid var(--border-subtle)',
                    fontSize: '0.82rem'
                  }}
                >
                  <span>{email}</span>
                  <button
                    type="button"
                    style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                    onClick={() => handleRemoveEmail(email)}
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Registered Tools Suite */}
          <div className="glass-card">
            <div className="card-header-row" style={{ marginBottom: '12px' }}>
              <h3 className="card-title">6. Cognitive Tool Suite</h3>
              <span className="badge badge-cyan">{formData.active_tools.length} / {tools.length} Active</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {tools.map(tool => {
                const isEnabled = formData.active_tools.includes(tool.id);
                return (
                  <div
                    key={tool.id}
                    onClick={() => handleToggleTool(tool.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '10px 12px',
                      borderRadius: 'var(--radius-md)',
                      background: isEnabled ? 'rgba(6, 182, 212, 0.08)' : 'rgba(255, 255, 255, 0.02)',
                      border: isEnabled ? '1px solid rgba(6, 182, 212, 0.3)' : '1px solid var(--border-subtle)',
                      cursor: 'pointer',
                      fontSize: '0.82rem'
                    }}
                  >
                    <div>
                      <strong style={{ color: isEnabled ? '#fff' : 'var(--text-secondary)' }}>{tool.name}</strong>
                      <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{tool.desc}</p>
                    </div>

                    <div style={{
                      width: '18px',
                      height: '18px',
                      borderRadius: '4px',
                      border: isEnabled ? '1px solid var(--primary-cyan)' : '1px solid var(--border-light)',
                      background: isEnabled ? 'var(--primary-cyan)' : 'transparent',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#000'
                    }}>
                      {isEnabled && <Check size={12} />}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Submit Footer */}
          <button
            type="submit"
            className="btn-primary"
            style={{ width: '100%', height: '48px', fontSize: '0.95rem' }}
            disabled={isSaving}
          >
            <Save size={18} />
            <span>{isSaving ? 'Deploying Configuration...' : 'Save & Deploy Configuration'}</span>
          </button>

        </div>

      </form>

    </div>
  );
}
