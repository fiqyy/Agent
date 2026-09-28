import React, { useState, useEffect, useRef } from 'react';
import {
  Send,
  Bot,
  User,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Cpu,
  Trash2,
  Download,
  Globe,
  Lock,
  Code,
  ShieldAlert,
  CheckCircle2,
  Copy,
  Check
} from 'lucide-react';

export default function AgentChat({
  messages,
  onSendMessage,
  isLoading,
  onResetMemory,
  agentConfig,
  activeEnvironment,
  setActiveEnvironment,
  initialPrompt
}) {
  const [inputText, setInputText] = useState('');
  const [userEmail, setUserEmail] = useState(
    activeEnvironment === 'internal' ? 'admin@project.local' : (activeEnvironment === 'development' ? 'developer@aast.edu' : 'guest@platform.local')
  );
  const [expandedThoughts, setExpandedThoughts] = useState({});
  const [copiedId, setCopiedId] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (initialPrompt) {
      setInputText(initialPrompt);
    }
  }, [initialPrompt]);

  useEffect(() => {
    setUserEmail(
      activeEnvironment === 'internal' ? 'admin@project.local' : (activeEnvironment === 'development' ? 'developer@aast.edu' : 'guest@platform.local')
    );
  }, [activeEnvironment]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputText.trim() || isLoading) return;
    const msg = inputText;
    setInputText('');
    onSendMessage(msg, activeEnvironment, userEmail);
  };

  const toggleThought = (msgId) => {
    setExpandedThoughts(prev => ({
      ...prev,
      [msgId]: !prev[msgId]
    }));
  };

  const handleCopy = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleExportChat = () => {
    const text = messages.map(m => `[${(m.sender_type || m.role || 'USER').toUpperCase()}]:\n${m.content}\n\n`).join('---\n');
    const blob = new Blob([text], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Project-Opportunity-Assistant-Log-${new Date().toISOString().slice(0, 10)}.md`;
    a.click();
  };

  const getPillsForEnvironment = () => {
    if (activeEnvironment === 'public') {
      return [
        "What is the Project Opportunity Platform and who is it for?",
        "How do I apply for an internship as a student?",
        "Can a user have both a student and an athlete profile?",
        "What does the blue verification badge mean for athletes?",
        "Does the platform guarantee that I will get an internship?"
      ];
    } else if (activeEnvironment === 'internal') {
      return [
        "Generate our formal SMART objectives for the graduation project defense",
        "Generate the Problem Statement and Motivation section for our report",
        "What are the top 3 defense examination questions and answers for our platform?",
        "Summarize our MVP scope versus future post-graduation features",
        "Explain the business model and clinic partnership feasibility"
      ];
    } else { // development
      return [
        "Show the relational database ERD schema for User and Profiles",
        "Generate the REST API endpoint specifications for the 3 environments",
        "Show the Role-Based Access Control (RBAC) permissions matrix",
        "How should local Ollama integration be configured for no-cost testing?",
        "Explain the security and input validation checks for file uploads"
      ];
    }
  };

  // Helper to format basic markdown
  const renderFormattedContent = (content) => {
    if (!content) return null;
    const lines = content.split('\n');
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {lines.map((line, idx) => {
          if (line.startsWith('## ')) {
            return <h3 key={idx} style={{ fontSize: '1.2rem', color: 'var(--primary-cyan)', marginTop: '10px', fontWeight: 700 }}>{line.replace('## ', '')}</h3>;
          }
          if (line.startsWith('### ')) {
            return <h4 key={idx} style={{ fontSize: '1.05rem', color: '#ffffff', marginTop: '8px', fontWeight: 700 }}>{line.replace('### ', '')}</h4>;
          }
          if (line.startsWith('#### ')) {
            return <h5 key={idx} style={{ fontSize: '0.95rem', color: 'var(--accent-purple)', marginTop: '6px', fontWeight: 600 }}>{line.replace('#### ', '')}</h5>;
          }
          if (line.startsWith('- **') || line.startsWith('• **')) {
            const clean = line.replace(/^[-•]\s*/, '');
            return (
              <div key={idx} style={{ display: 'flex', gap: '8px', paddingLeft: '4px' }}>
                <span style={{ color: 'var(--primary-cyan)' }}>•</span>
                <span dangerouslySetInnerHTML={{ __html: formatInlineMarkdown(clean) }} />
              </div>
            );
          }
          if (line.startsWith('• ') || line.startsWith('- ')) {
            return (
              <div key={idx} style={{ display: 'flex', gap: '8px', paddingLeft: '4px' }}>
                <span style={{ color: 'var(--primary-cyan)' }}>•</span>
                <span dangerouslySetInnerHTML={{ __html: formatInlineMarkdown(line.slice(2)) }} />
              </div>
            );
          }
          if (line.startsWith('```')) {
            return <div key={idx} style={{ height: '4px' }} />;
          }
          if (line.startsWith('---')) {
            return <hr key={idx} style={{ borderColor: 'var(--border-subtle)', margin: '8px 0' }} />;
          }
          if (!line.trim()) {
            return <div key={idx} style={{ height: '4px' }} />;
          }
          return <p key={idx} dangerouslySetInnerHTML={{ __html: formatInlineMarkdown(line) }} />;
        })}
      </div>
    );
  };

  const formatInlineMarkdown = (text) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong style="color: #ffffff;">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em style="color: var(--text-secondary);">$1</em>')
      .replace(/`([^`]+)`/g, '<code style="background: rgba(6, 182, 212, 0.15); color: var(--primary-cyan); padding: 2px 6px; border-radius: 4px; font-family: var(--font-mono); font-size: 0.85em;">$1</code>');
  };

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 140px)', gap: '16px' }}>

      {/* Top Header & Environment Control Bar */}
      <div className="glass-card" style={{ padding: '14px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div className="card-icon-badge" style={{ color: 'var(--primary-cyan)', background: 'rgba(6, 182, 212, 0.1)' }}>
            <Bot size={22} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
              {agentConfig?.name || 'Project Opportunity Assistant'}
              <span className={`badge ${activeEnvironment === 'public' ? 'badge-cyan' : (activeEnvironment === 'internal' ? 'badge-emerald' : 'badge-purple')}`}>
                {activeEnvironment.toUpperCase()} MODE
              </span>
            </h3>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
              Connected as: <span style={{ color: '#fff' }}>{userEmail}</span> • ReAct Cognitive Engine Active
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <select
            className="input-control"
            style={{ padding: '6px 12px', fontSize: '0.8rem', width: 'auto' }}
            value={activeEnvironment}
            onChange={(e) => setActiveEnvironment(e.target.value)}
          >
            <option value="public">🌐 Public Platform Chatbot</option>
            <option value="internal">🔐 Internal Group Assistant</option>
            <option value="development">💻 Dev Technical Assistant</option>
          </select>

          <button
            className="btn-secondary"
            style={{ padding: '6px 12px', fontSize: '0.8rem' }}
            onClick={handleExportChat}
            title="Export Markdown Log"
          >
            <Download size={14} />
            <span>Export</span>
          </button>
          <button
            className="btn-secondary"
            style={{ padding: '6px 12px', fontSize: '0.8rem' }}
            onClick={onResetMemory}
            title="Clear Chat Session"
          >
            <Trash2 size={14} color="var(--accent-rose)" />
            <span>Clear</span>
          </button>
        </div>
      </div>

      {/* Messages Stream */}
      <div
        className="glass-card"
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
          background: 'rgba(10, 15, 28, 0.88)'
        }}
      >
        {messages.map((msg, index) => {
          const isUser = (msg.sender_type === 'user' || msg.role === 'user');
          const msgId = msg.id || index;
          const hasThoughts = msg.thought_steps && msg.thought_steps.length > 0;
          const isThoughtExpanded = expandedThoughts[msgId];
          const hasViolations = msg.safety_violations_prevented && msg.safety_violations_prevented.length > 0;

          return (
            <div
              key={msgId}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: isUser ? 'flex-end' : 'flex-start',
                gap: '6px',
                maxWidth: '100%'
              }}
            >
              {/* Message Header */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                {isUser ? (
                  <>
                    <span>User ({userEmail})</span>
                    <User size={13} />
                  </>
                ) : (
                  <>
                    <Bot size={13} color="var(--primary-cyan)" />
                    <span style={{ color: 'var(--primary-cyan)', fontWeight: 600 }}>Connecta Agent</span>
                    {hasViolations && (
                      <span className="badge badge-rose" style={{ fontSize: '0.65rem' }}>
                        <ShieldAlert size={10} /> Policy Filtered
                      </span>
                    )}
                  </>
                )}
              </div>

              {/* Thought Steps Accordion */}
              {!isUser && hasThoughts && (
                <div
                  style={{
                    width: '100%',
                    maxWidth: '880px',
                    marginBottom: '4px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid rgba(6, 182, 212, 0.25)',
                    background: 'rgba(6, 182, 212, 0.04)',
                    overflow: 'hidden'
                  }}
                >
                  <button
                    onClick={() => toggleThought(msgId)}
                    style={{
                      width: '100%',
                      padding: '8px 14px',
                      background: 'transparent',
                      border: 'none',
                      color: 'var(--primary-cyan)',
                      fontSize: '0.78rem',
                      fontWeight: 600,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      cursor: 'pointer'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Cpu size={14} />
                      <span>ReAct Reasoning Trace ({msg.thought_steps.length} Steps)</span>
                    </div>
                    {isThoughtExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                  </button>

                  {isThoughtExpanded && (
                    <div style={{ padding: '12px 16px', borderTop: '1px solid rgba(6, 182, 212, 0.15)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {msg.thought_steps.map((step, sIdx) => (
                        <div key={sIdx} style={{ fontSize: '0.8rem', display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                          <span style={{
                            background: 'rgba(6, 182, 212, 0.2)',
                            color: 'var(--primary-cyan)',
                            padding: '1px 6px',
                            borderRadius: '4px',
                            fontFamily: 'var(--font-mono)',
                            fontSize: '0.7rem',
                            fontWeight: 700,
                            flexShrink: 0
                          }}>
                            {step.phase || `Step ${sIdx + 1}`}
                          </span>
                          <span style={{ color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                            {step.thought}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Message Bubble */}
              <div
                style={{
                  maxWidth: isUser ? '75%' : '900px',
                  padding: isUser ? '12px 18px' : '20px 24px',
                  borderRadius: 'var(--radius-lg)',
                  background: isUser
                    ? 'linear-gradient(135deg, #0284c7, #0369a1)'
                    : (hasViolations ? 'rgba(35, 20, 30, 0.95)' : 'rgba(18, 26, 48, 0.95)'),
                  border: isUser
                    ? '1px solid rgba(255, 255, 255, 0.15)'
                    : (hasViolations ? '1px solid rgba(244, 63, 94, 0.3)' : '1px solid var(--border-subtle)'),
                  color: '#ffffff',
                  fontSize: '0.92rem',
                  lineHeight: 1.55,
                  position: 'relative'
                }}
              >
                {!isUser && (
                  <button
                    onClick={() => handleCopy(msg.content, msgId)}
                    style={{
                      position: 'absolute',
                      top: '12px',
                      right: '12px',
                      background: 'rgba(255, 255, 255, 0.06)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: 'var(--radius-sm)',
                      padding: '4px 8px',
                      color: 'var(--text-secondary)',
                      fontSize: '0.72rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      cursor: 'pointer'
                    }}
                    title="Copy Content"
                  >
                    {copiedId === msgId ? <Check size={12} color="var(--accent-emerald)" /> : <Copy size={12} />}
                    <span>{copiedId === msgId ? 'Copied' : 'Copy'}</span>
                  </button>
                )}

                {isUser ? (
                  <p style={{ whiteSpace: 'pre-wrap' }}>{msg.content}</p>
                ) : (
                  renderFormattedContent(msg.content)
                )}
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px 20px', background: 'rgba(18, 26, 48, 0.7)', borderRadius: 'var(--radius-md)', width: 'fit-content' }}>
            <div className="live-pulse" style={{ background: 'var(--primary-cyan)' }} />
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Project Opportunity Assistant is evaluating policy guardrails and project context...
            </span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Dynamic Environment Quick Prompt Pills */}
      <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
        {getPillsForEnvironment().map((pill, pIdx) => (
          <button
            key={pIdx}
            onClick={() => onSendMessage(pill, activeEnvironment, userEmail)}
            style={{
              whiteSpace: 'nowrap',
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-full)',
              padding: '6px 14px',
              fontSize: '0.78rem',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.borderColor = 'var(--primary-cyan)';
              e.currentTarget.style.color = '#fff';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.borderColor = 'var(--border-subtle)';
              e.currentTarget.style.color = 'var(--text-secondary)';
            }}
          >
            <Sparkles size={11} color="var(--primary-cyan)" />
            <span>{pill}</span>
          </button>
        ))}
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
        <input
          type="text"
          className="input-control"
          placeholder={`Ask the Project Opportunity Assistant (${activeEnvironment.toUpperCase()} mode)...`}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          disabled={isLoading}
          style={{ height: '52px', fontSize: '0.95rem' }}
        />
        <button
          type="submit"
          className="btn-primary"
          disabled={isLoading || !inputText.trim()}
          style={{ height: '52px', padding: '0 24px', opacity: (isLoading || !inputText.trim()) ? 0.6 : 1 }}
        >
          <Send size={18} />
          <span>Send</span>
        </button>
      </form>

    </div>
  );
}
