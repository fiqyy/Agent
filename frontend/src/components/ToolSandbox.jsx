import React, { useState } from 'react';
import { 
  Cpu, 
  Play, 
  Sparkles, 
  Briefcase, 
  ShieldCheck, 
  FileText, 
  Database, 
  TrendingUp, 
  Layers,
  Terminal, 
  CheckCircle2,
  RefreshCw
} from 'lucide-react';

export default function ToolSandbox({ onRunToolDirect }) {
  const [selectedTool, setSelectedTool] = useState('opportunity_matcher');
  const [paramInput, setParamInput] = useState(JSON.stringify({ 
    skills: ["Python", "React", "Django"], 
    field: "Computer Engineering" 
  }, null, 2));
  const [toolResult, setToolResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const tools = [
    { 
      id: 'opportunity_matcher', 
      name: 'Student & Athlete Opportunity Matcher', 
      icon: Briefcase,
      defaultParams: { skills: ["Python", "React", "Django"], field: "Computer Engineering" },
      desc: 'Matches student skills with internships and athlete profiles with sports scouts.' 
    },
    { 
      id: 'verification_explainer', 
      name: 'Clinic Verification Explainer', 
      icon: ShieldCheck,
      defaultParams: { status: "medical_verified" },
      desc: 'Explains InBody assessment steps, clinic review, and non-guarantee boundaries.' 
    },
    { 
      id: 'academic_report_generator', 
      name: 'Academic Report & Defense Generator', 
      icon: FileText,
      defaultParams: { topic: "objectives" },
      desc: 'Produces copy-ready formal academic sections (SMART objectives, problem statement).' 
    },
    { 
      id: 'technical_architect', 
      name: 'Database Schema & API Architect', 
      icon: Database,
      defaultParams: { component: "database" },
      desc: 'Generates relational ERD structures, REST specifications, and RBAC matrices.' 
    },
    { 
      id: 'business_feasibility_analyzer', 
      name: 'Business Model & Feasibility Analyzer', 
      icon: TrendingUp,
      defaultParams: {},
      desc: 'Evaluates graduation project viability, freemium options, and SWOT analysis.' 
    },
    { 
      id: 'dual_profile_manager', 
      name: 'Dual-Profile Architecture Validator', 
      icon: Layers,
      defaultParams: { user_id: 1, has_student: true, has_athlete: true },
      desc: 'Validates single-account multi-profile coexistence (Student + Athlete).' 
    },
  ];

  const handleSelectTool = (tool) => {
    setSelectedTool(tool.id);
    setParamInput(JSON.stringify(tool.defaultParams, null, 2));
    setToolResult(null);
  };

  const handleExecute = async () => {
    setIsLoading(true);
    try {
      let parsedParams = {};
      try {
        parsedParams = JSON.parse(paramInput);
      } catch (err) {
        alert('Invalid JSON parameters format');
        setIsLoading(false);
        return;
      }
      const data = await onRunToolDirect(selectedTool, parsedParams);
      setToolResult(data?.result || data);
    } catch (err) {
      setToolResult({ error: err.message });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Header */}
      <div className="glass-card" style={{ padding: '24px 32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
          <span className="badge badge-cyan">
            <Cpu size={13} /> Cognitive Tool Diagnostics
          </span>
        </div>
        <h2 style={{ fontSize: '1.6rem', fontWeight: 800 }}>
          Agent Tool Execution & Diagnostics Sandbox
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          Directly execute and inspect individual agent tools with custom payload arguments to verify deterministic behavior and ReAct observations.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.8fr', gap: '24px' }}>
        
        {/* Left Column: Tool Selector & Param Editor */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          <div className="glass-card">
            <h3 className="card-title" style={{ marginBottom: '14px' }}>Registered Agent Tools</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {tools.map(tool => {
                const Icon = tool.icon;
                const isSelected = selectedTool === tool.id;

                return (
                  <div
                    key={tool.id}
                    onClick={() => handleSelectTool(tool)}
                    style={{
                      padding: '12px 16px',
                      borderRadius: 'var(--radius-md)',
                      border: isSelected ? '1px solid var(--primary-cyan)' : '1px solid var(--border-subtle)',
                      background: isSelected ? 'rgba(6, 182, 212, 0.12)' : 'rgba(255, 255, 255, 0.02)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <Icon size={18} color={isSelected ? 'var(--primary-cyan)' : 'var(--text-secondary)'} />
                    <div>
                      <strong style={{ fontSize: '0.88rem', color: isSelected ? '#fff' : 'var(--text-secondary)' }}>
                        {tool.name}
                      </strong>
                      <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{tool.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="glass-card">
            <div className="card-header-row" style={{ marginBottom: '10px' }}>
              <h4 className="card-title" style={{ fontSize: '0.95rem' }}>Input JSON Parameters</h4>
              <button 
                type="button" 
                className="btn-secondary" 
                style={{ padding: '4px 8px', fontSize: '0.72rem' }}
                onClick={() => {
                  const t = tools.find(x => x.id === selectedTool);
                  if (t) setParamInput(JSON.stringify(t.defaultParams, null, 2));
                }}
              >
                Reset Default
              </button>
            </div>

            <textarea
              className="input-control"
              rows={6}
              style={{ fontFamily: 'var(--font-mono)', fontSize: '0.82rem', lineHeight: 1.4 }}
              value={paramInput}
              onChange={(e) => setParamInput(e.target.value)}
            />

            <button
              className="btn-primary"
              style={{ width: '100%', marginTop: '14px', height: '44px' }}
              onClick={handleExecute}
              disabled={isLoading}
            >
              {isLoading ? <RefreshCw size={16} className="spin" /> : <Play size={16} />}
              <span>{isLoading ? 'Executing Tool...' : 'Execute Tool Action'}</span>
            </button>
          </div>

        </div>

        {/* Right Column: Execution Output Console */}
        <div className="glass-card" style={{ minHeight: '500px', display: 'flex', flexDirection: 'column' }}>
          <div className="card-header-row" style={{ marginBottom: '14px' }}>
            <div className="card-title-group">
              <div className="card-icon-badge" style={{ color: 'var(--accent-emerald)' }}>
                <Terminal size={18} />
              </div>
              <div>
                <h3 className="card-title">Tool Observation Stream</h3>
                <p className="card-subtitle">Structured observation JSON payload</p>
              </div>
            </div>
            {toolResult && (
              <span className="badge badge-emerald">
                <CheckCircle2 size={12} /> Status 200 OK
              </span>
            )}
          </div>

          <div 
            style={{ 
              flex: 1, 
              background: '#040711', 
              borderRadius: 'var(--radius-md)', 
              padding: '18px', 
              border: '1px solid var(--border-subtle)',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.82rem',
              color: 'var(--primary-cyan)',
              overflowY: 'auto',
              maxHeight: '520px',
              whiteSpace: 'pre-wrap'
            }}
          >
            {toolResult 
              ? JSON.stringify(toolResult, null, 2)
              : '// Click "Execute Tool Action" to test output payload...'
            }
          </div>
        </div>

      </div>

    </div>
  );
}
