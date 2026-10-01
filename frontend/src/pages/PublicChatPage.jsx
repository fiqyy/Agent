import React, { useState, useEffect, useRef } from 'react';
import {
  Send,
  Bot,
  User,
  Sparkles,
  Copy,
  Check,
  Cpu,
  ChevronDown,
  ChevronUp,
  ShieldAlert,
  MessageCircle,
  ArrowRight,
  Zap
} from 'lucide-react';
import { agentApi } from '../api/agentApi';

export default function PublicChatPage() {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const [expandedThoughts, setExpandedThoughts] = useState({});
  const [hasStarted, setHasStarted] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // No conversation history loading - chat starts fresh every launch

  const handleSend = async (text) => {
    const userText = text || inputText;
    if (!userText.trim() || isLoading) return;

    setHasStarted(true);
    const tempUserMsg = {
      id: Date.now(),
      sender_type: 'user',
      content: userText,
      created_at: new Date().toISOString()
    };
    setMessages(prev => [...prev, tempUserMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      const res = await agentApi.sendChatMessage(userText, 'public', 'guest@platform.local', 'public-session');
      if (res.assistant_message) {
        setMessages(prev => [...prev, res.assistant_message]);
      }
    } catch (err) {
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        sender_type: 'agent',
        content: '⚠️ Could not reach the assistant server. Please check that the backend is running and try again.',
        created_at: new Date().toISOString()
      }]);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSend();
  };

  const handleCopy = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const toggleThought = (msgId) => {
    setExpandedThoughts(prev => ({ ...prev, [msgId]: !prev[msgId] }));
  };

  const formatInlineMarkdown = (text) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong style="color: #ffffff;">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em style="color: var(--text-secondary);">$1</em>')
      .replace(/`([^`]+)`/g, '<code style="background: rgba(6, 182, 212, 0.15); color: var(--primary-cyan); padding: 2px 6px; border-radius: 4px; font-family: var(--font-mono); font-size: 0.85em;">$1</code>');
  };

  const renderFormattedContent = (content) => {
    if (!content) return null;
    const lines = content.split('\n');
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {lines.map((line, idx) => {
          if (line.startsWith('## ')) return <h3 key={idx} style={{ fontSize: '1.15rem', color: 'var(--primary-cyan)', marginTop: '10px', fontWeight: 700 }}>{line.replace('## ', '')}</h3>;
          if (line.startsWith('### ')) return <h4 key={idx} style={{ fontSize: '1rem', color: '#ffffff', marginTop: '8px', fontWeight: 700 }}>{line.replace('### ', '')}</h4>;
          if (line.startsWith('#### ')) return <h5 key={idx} style={{ fontSize: '0.95rem', color: 'var(--accent-purple)', marginTop: '6px', fontWeight: 600 }}>{line.replace('#### ', '')}</h5>;
          if (line.startsWith('- **') || line.startsWith('• **')) {
            const clean = line.replace(/^[-•]\s*/, '');
            return (<div key={idx} style={{ display: 'flex', gap: '8px', paddingLeft: '4px' }}><span style={{ color: 'var(--primary-cyan)' }}>•</span><span dangerouslySetInnerHTML={{ __html: formatInlineMarkdown(clean) }} /></div>);
          }
          if (line.startsWith('• ') || line.startsWith('- ')) return (<div key={idx} style={{ display: 'flex', gap: '8px', paddingLeft: '4px' }}><span style={{ color: 'var(--primary-cyan)' }}>•</span><span dangerouslySetInnerHTML={{ __html: formatInlineMarkdown(line.slice(2)) }} /></div>);
          if (line.startsWith('```')) return <div key={idx} style={{ height: '4px' }} />;
          if (line.startsWith('---')) return <hr key={idx} style={{ borderColor: 'var(--border-subtle)', margin: '8px 0' }} />;
          if (!line.trim()) return <div key={idx} style={{ height: '4px' }} />;
          return <p key={idx} dangerouslySetInnerHTML={{ __html: formatInlineMarkdown(line) }} />;
        })}
      </div>
    );
  };

  const quickPrompts = [
    "What is the Connecta Assistant?",
    "How do I apply for an internship?",
    "Can I have both Student and Athlete profiles?",
    "What does the blue verification badge mean?",
    "Does the platform guarantee me an internship?"
  ];

  return (
    <div className="public-chat-page">
      {/* Ambient Background Orbs */}
      <div className="public-bg-orb public-bg-orb-1" />
      <div className="public-bg-orb public-bg-orb-2" />
      <div className="public-bg-orb public-bg-orb-3" />

      {/* Top Header Bar */}
      <header className="public-header">
        <div className="public-header-brand">
          <div className="public-brand-icon">
            <Bot size={24} />
          </div>
          <div>
            <h1 className="public-brand-title">
              Connecta Assitant - 3shan yesa3ed Fiqy
            </h1>
            <p className="public-brand-subtitle">
              FIQY AI-powered guidance for Students, Athletes, Enterprises & Scouts
            </p>
          </div>
        </div>
        <div className="public-header-status">
          <div className="public-live-dot" />
          <span>Online</span>
        </div>
      </header>

      {/* Chat Area */}
      <div className="public-chat-container">
        {!hasStarted ? (
          /* Welcome / Landing State */
          <div className="public-welcome">
            <div className="public-welcome-icon">
              <MessageCircle size={48} strokeWidth={1.5} />
            </div>
            <h2 className="public-welcome-title">
              Welcome to the<br />
              <span className="public-gradient-text">Connecta Assistant</span>
            </h2>
            <p className="public-welcome-desc">
              Ask me anything about internship applications, athlete scouting,
              profile verification, or how the platform works.
            </p>

            {/* Quick Start Prompts */}
            <div className="public-quick-grid">
              {quickPrompts.map((prompt, idx) => (
                <button
                  key={idx}
                  className="public-quick-card"
                  onClick={() => handleSend(prompt)}
                >
                  <Sparkles size={14} className="public-quick-icon" />
                  <span>{prompt}</span>
                  <ArrowRight size={14} className="public-quick-arrow" />
                </button>
              ))}
            </div>

            <div className="public-disclaimer">
              <ShieldAlert size={14} />
              <span>
                This assistant provides general guidance only. It does not guarantee employment, contracts, or medical diagnoses.
              </span>
            </div>
          </div>
        ) : (
          /* Active Chat Messages */
          <div className="public-messages-stream">
            {messages.map((msg, index) => {
              const isUser = (msg.sender_type === 'user' || msg.role === 'user');
              const msgId = msg.id || index;
              const hasThoughts = msg.thought_steps && msg.thought_steps.length > 0;
              const isThoughtExpanded = expandedThoughts[msgId];
              const hasViolations = msg.safety_violations_prevented && msg.safety_violations_prevented.length > 0;

              return (
                <div
                  key={msgId}
                  className={`public-msg-row ${isUser ? 'public-msg-user' : 'public-msg-agent'}`}
                >
                  {/* Avatar */}
                  <div className={`public-msg-avatar ${isUser ? 'public-avatar-user' : 'public-avatar-agent'}`}>
                    {isUser ? <User size={16} /> : <Bot size={16} />}
                  </div>

                  <div className="public-msg-content-wrap">
                    {/* Agent label */}
                    {!isUser && (
                      <div className="public-msg-label">
                        <span style={{ color: 'var(--primary-cyan)', fontWeight: 600 }}>Connecta Assistant</span>
                        {hasViolations && (
                          <span className="badge badge-rose" style={{ fontSize: '0.65rem', marginLeft: '8px' }}>
                            <ShieldAlert size={10} /> Policy Filtered
                          </span>
                        )}
                      </div>
                    )}
                    {isUser && (
                      <div className="public-msg-label">
                        <span style={{ fontWeight: 600 }}>You</span>
                      </div>
                    )}

                    {/* Thought Accordion */}
                    {!isUser && hasThoughts && (
                      <div className="public-thought-accordion">
                        <button className="public-thought-toggle" onClick={() => toggleThought(msgId)}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <Cpu size={13} />
                            <span>Reasoning Trace ({msg.thought_steps.length} steps)</span>
                          </div>
                          {isThoughtExpanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                        </button>
                        {isThoughtExpanded && (
                          <div className="public-thought-body">
                            {msg.thought_steps.map((step, sIdx) => (
                              <div key={sIdx} className="public-thought-step">
                                <span className="public-thought-phase">{step.phase || `Step ${sIdx + 1}`}</span>
                                <span>{step.thought}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Bubble */}
                    <div className={`public-msg-bubble ${isUser ? 'public-bubble-user' : 'public-bubble-agent'} ${hasViolations ? 'public-bubble-violation' : ''}`}>
                      {!isUser && (
                        <button
                          className="public-copy-btn"
                          onClick={() => handleCopy(msg.content, msgId)}
                          title="Copy"
                        >
                          {copiedId === msgId ? <Check size={12} color="var(--accent-emerald)" /> : <Copy size={12} />}
                        </button>
                      )}
                      {isUser ? (
                        <p style={{ whiteSpace: 'pre-wrap' }}>{msg.content}</p>
                      ) : (
                        renderFormattedContent(msg.content)
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            {isLoading && (
              <div className="public-msg-row public-msg-agent">
                <div className="public-msg-avatar public-avatar-agent">
                  <Bot size={16} />
                </div>
                <div className="public-msg-content-wrap">
                  <div className="public-typing-indicator">
                    <div className="public-typing-dot" />
                    <div className="public-typing-dot" />
                    <div className="public-typing-dot" />
                    <span>Analyzing your question...</span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Suggestion Pills (shown when chat is active) */}
      {hasStarted && (
        <div className="public-pills-bar">
          {quickPrompts.slice(0, 3).map((pill, idx) => (
            <button
              key={idx}
              className="public-pill-btn"
              onClick={() => handleSend(pill)}
            >
              <Sparkles size={11} />
              <span>{pill}</span>
            </button>
          ))}
        </div>
      )}

      {/* Input Bar */}
      <div className="public-input-bar">
        <form onSubmit={handleSubmit} className="public-input-form">
          <div className="public-input-wrapper">
            <MessageCircle size={18} className="public-input-icon" />
            <input
              ref={inputRef}
              type="text"
              className="public-input-field"
              placeholder="Ask about internships, athlete scouting, profiles, and more..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              disabled={isLoading}
            />
          </div>
          <button
            type="submit"
            className="public-send-btn"
            disabled={isLoading || !inputText.trim()}
          >
            <Send size={18} />
          </button>
        </form>
        <p className="public-footer-note">
          <Zap size={11} /> Powered by Fiqy • Responses are for guidance only
        </p>
      </div>
    </div>
  );
}
