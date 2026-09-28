import React, { useState, useEffect } from 'react';
import { 
  GitBranch, 
  Play, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Zap, 
  Trophy, 
  BookOpen, 
  ShieldAlert, 
  Cpu, 
  FileText,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function WorkflowsRunner({ 
  workflowsData, 
  onRunWorkflow, 
  isRunningWorkflow, 
  latestWorkflowRun 
}) {
  const [selectedWorkflow, setSelectedWorkflow] = useState('daily_synergy_sync');
  const [customInstructions, setCustomInstructions] = useState('');
  const [activeRunResult, setActiveRunResult] = useState(null);

  const definitions = workflowsData?.definitions || [
    { id: 'daily_synergy_sync', name: 'Daily Athletic-Academic Synergy Sync', description: 'Multi-agent autonomous daily pipeline: scans recovery readiness, evaluates schedule load, generates nutrition timing, and locks in study sprints.', icon: 'Zap' },
    { id: 'pre_competition_peak', name: 'Pre-Competition Peak & Taper Pipeline', description: '48-hour championship preparation protocol balancing glycogen loading, nervous system tapering, and academic deadline mitigation.', icon: 'Trophy' },
    { id: 'exam_week_survival', name: 'Midterm & Finals Academic Dominance Mode', description: 'Re-calibrates training volume to maintain aerobic fitness while liberating maximum cognitive bandwidth for exams.', icon: 'BookOpen' },
    { id: 'injury_fatigue_mitigation', name: 'Fatigue & CNS Overreach Recovery Protocol', description: 'Emergency recovery pipeline triggered when readiness drops or soreness spikes.', icon: 'ShieldAlert' }
  ];

  const recentRuns = workflowsData?.recent_runs || [];

  useEffect(() => {
    if (latestWorkflowRun) {
      setActiveRunResult(latestWorkflowRun);
      try {
        confetti({ particleCount: 40, spread: 60, origin: { y: 0.8 } });
      } catch (e) {}
    }
  }, [latestWorkflowRun]);

  const handleTrigger = async () => {
    const res = await onRunWorkflow(selectedWorkflow, customInstructions);
    if (res) {
      setActiveRunResult(res);
    }
  };

  const getWorkflowIcon = (iconName) => {
    switch (iconName) {
      case 'Trophy': return <Trophy size={20} color="var(--accent-amber)" />;
      case 'BookOpen': return <BookOpen size={20} color="var(--accent-purple)" />;
      case 'ShieldAlert': return <ShieldAlert size={20} color="var(--accent-rose)" />;
      default: return <Zap size={20} color="var(--primary-cyan)" />;
    }
  };

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Header */}
      <div className="glass-card" style={{ padding: '24px 32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
          <span className="badge badge-cyan">
            <GitBranch size={13} /> Multi-Step Autonomous Pipelines
          </span>
        </div>
        <h2 style={{ fontSize: '1.6rem', fontWeight: 800 }}>
          Autonomous Agent Execution Engine
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', maxWidth: '700px' }}>
          Execute multi-stage autonomous workflows that orchestrate biometrics, scheduling, active recall study blocks, and athletic nutrition protocols without manual intervention.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1.6fr', gap: '24px' }}>
        
        {/* Left Column: Workflow Catalog & Trigger */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          <div className="glass-card">
            <h3 className="card-title" style={{ marginBottom: '16px' }}>Select Autonomous Pipeline</h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
              {definitions.map((wf) => {
                const isSelected = selectedWorkflow === wf.id;
                return (
                  <div
                    key={wf.id}
                    onClick={() => setSelectedWorkflow(wf.id)}
                    style={{
                      padding: '16px',
                      borderRadius: 'var(--radius-md)',
                      border: isSelected ? '1px solid var(--primary-cyan)' : '1px solid var(--border-subtle)',
                      background: isSelected ? 'rgba(6, 182, 212, 0.1)' : 'rgba(255, 255, 255, 0.02)',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '14px'
                    }}
                  >
                    <div style={{ marginTop: '2px' }}>
                      {getWorkflowIcon(wf.icon)}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <strong style={{ fontSize: '0.95rem', color: isSelected ? '#fff' : 'var(--text-secondary)' }}>
                          {wf.name}
                        </strong>
                        {isSelected && <span className="badge badge-cyan" style={{ fontSize: '0.65rem' }}>Selected</span>}
                      </div>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px', lineHeight: 1.4 }}>
                        {wf.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label className="input-label">Optional Pipeline Instructions / Modifiers</label>
              <textarea
                className="input-control"
                rows={3}
                placeholder="e.g. 'I have a sore hamstring today, adjust the track workout to low-impact tempo drills'..."
                value={customInstructions}
                onChange={(e) => setCustomInstructions(e.target.value)}
              />
            </div>

            <button
              className="btn-primary"
              style={{ width: '100%', height: '48px', fontSize: '0.95rem' }}
              onClick={handleTrigger}
              disabled={isRunningWorkflow}
            >
              {isRunningWorkflow ? <span className="live-pulse" /> : <Play size={18} />}
              <span>{isRunningWorkflow ? 'Executing Autonomous Pipeline...' : 'Launch Pipeline Execution'}</span>
            </button>
          </div>

          {/* Historical Runs Log */}
          <div className="glass-card">
            <h3 className="card-title" style={{ marginBottom: '14px', fontSize: '1.05rem' }}>Recent Pipeline Executions</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {recentRuns.length === 0 && (
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>No previous workflow executions recorded.</p>
              )}
              {recentRuns.map((run, rIdx) => (
                <div
                  key={run.id || rIdx}
                  onClick={() => setActiveRunResult(run)}
                  style={{
                    padding: '10px 14px',
                    borderRadius: 'var(--radius-md)',
                    background: 'rgba(255, 255, 255, 0.02)',
                    border: '1px solid var(--border-subtle)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    fontSize: '0.82rem'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <CheckCircle2 size={16} color="var(--accent-emerald)" />
                    <div>
                      <strong>{run.workflow_name}</strong>
                      <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                        {new Date(run.created_at || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {run.steps?.length || 4} Steps Executed
                      </p>
                    </div>
                  </div>
                  <ChevronRight size={14} color="var(--text-muted)" />
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column: Live Visual Execution Flow & Report */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Active Execution State */}
          <div className="glass-card" style={{ minHeight: '520px', display: 'flex', flexDirection: 'column' }}>
            <div className="card-header-row" style={{ marginBottom: '16px' }}>
              <div className="card-title-group">
                <div className="card-icon-badge" style={{ color: 'var(--primary-cyan)' }}>
                  <Cpu size={20} />
                </div>
                <div>
                  <h3 className="card-title">Live Execution Trace</h3>
                  <p className="card-subtitle">
                    {activeRunResult?.workflow_name || 'Standby for pipeline trigger'}
                  </p>
                </div>
              </div>
              {activeRunResult && (
                <span className="badge badge-emerald">
                  <CheckCircle2 size={12} /> Completed
                </span>
              )}
            </div>

            {isRunningWorkflow && (
              <div style={{ padding: '32px', textAlign: 'center', margin: 'auto' }}>
                <div className="live-pulse" style={{ width: '20px', height: '20px', margin: '0 auto 16px', background: 'var(--primary-cyan)' }} />
                <h4 style={{ color: '#fff', marginBottom: '6px' }}>Autonomous Agent in Progress</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  Evaluating biometric models, resolving schedule dependencies, and synthesizing optimal parameters...
                </p>
              </div>
            )}

            {!isRunningWorkflow && !activeRunResult && (
              <div style={{ padding: '48px 24px', textAlign: 'center', margin: 'auto', color: 'var(--text-secondary)' }}>
                <Sparkles size={40} color="var(--primary-cyan)" style={{ marginBottom: '14px' }} />
                <h4 style={{ color: '#fff', marginBottom: '6px' }}>No Active Execution</h4>
                <p style={{ fontSize: '0.85rem', maxWidth: '360px' }}>
                  Select a workflow on the left and click <strong>Launch Pipeline Execution</strong> to watch the AI Agent chain actions and generate executive reports.
                </p>
              </div>
            )}

            {!isRunningWorkflow && activeRunResult && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                
                {/* Step Trace Timeline */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <h4 style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Orchestration Steps ({activeRunResult.steps?.length || 0})
                  </h4>

                  {activeRunResult.steps?.map((step, sIdx) => (
                    <div 
                      key={sIdx}
                      style={{
                        padding: '14px 16px',
                        borderRadius: 'var(--radius-md)',
                        background: 'rgba(255, 255, 255, 0.03)',
                        border: '1px solid rgba(6, 182, 212, 0.2)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '6px'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ 
                            background: 'rgba(6, 182, 212, 0.2)', 
                            color: 'var(--primary-cyan)', 
                            padding: '2px 8px', 
                            borderRadius: '4px',
                            fontFamily: 'var(--font-mono)',
                            fontSize: '0.72rem',
                            fontWeight: 700
                          }}>
                            STEP {step.step_number || sIdx + 1}
                          </span>
                          <code style={{ fontSize: '0.8rem', color: 'var(--text-primary)' }}>
                            {step.tool_called}
                          </code>
                        </div>
                        <span className="badge badge-emerald" style={{ fontSize: '0.65rem' }}>Executed</span>
                      </div>
                      
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontStyle: 'italic' }}>
                        "{step.agent_thought}"
                      </p>

                      <div style={{ fontSize: '0.78rem', color: 'var(--accent-emerald)', marginTop: '2px' }}>
                        👉 {step.result_summary}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Formatted Output Report */}
                {activeRunResult.summary_output && (
                  <div 
                    style={{
                      padding: '20px',
                      borderRadius: 'var(--radius-md)',
                      background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.08), rgba(99, 102, 241, 0.08))',
                      border: '1px solid rgba(6, 182, 212, 0.3)',
                      fontSize: '0.88rem',
                      lineHeight: 1.5,
                      color: '#ffffff',
                      whiteSpace: 'pre-wrap'
                    }}
                  >
                    {activeRunResult.summary_output}
                  </div>
                )}

              </div>
            )}

          </div>

        </div>

      </div>

    </div>
  );
}
