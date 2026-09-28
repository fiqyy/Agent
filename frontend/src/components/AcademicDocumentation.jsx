import React, { useState } from 'react';
import { 
  FileText, 
  Copy, 
  Check, 
  Download, 
  Sparkles, 
  BookOpen, 
  Database, 
  ShieldCheck, 
  Award, 
  TrendingUp,
  Layers
} from 'lucide-react';

export default function AcademicDocumentation({ onRunToolDirect }) {
  const [selectedTopic, setSelectedTopic] = useState('objectives');
  const [docContent, setDocContent] = useState('');
  const [docTitle, setDocTitle] = useState('Project Aim & SMART Objectives');
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const sections = [
    { id: 'objectives', title: 'Project Aim & SMART Objectives', icon: BookOpen, tool: 'academic_report_generator', param: { topic: 'objectives' } },
    { id: 'problem', title: 'Problem Statement & Motivation', icon: FileText, tool: 'academic_report_generator', param: { topic: 'problem' } },
    { id: 'defense', title: 'Defense Q&A Preparation Scripts', icon: Award, tool: 'academic_report_generator', param: { topic: 'defense' } },
    { id: 'database', title: 'Database Relational Model & ERD', icon: Database, tool: 'technical_architect', param: { component: 'database' } },
    { id: 'api_rbac', title: 'REST API & RBAC Permissions Matrix', icon: ShieldCheck, tool: 'technical_architect', param: { component: 'rbac' } },
    { id: 'feasibility', title: 'Business Model & Feasibility Study', icon: TrendingUp, tool: 'business_feasibility_analyzer', param: {} },
    { id: 'dual_profile', title: 'Dual-Profile Architecture Rule', icon: Layers, tool: 'dual_profile_manager', param: { has_student: true, has_athlete: true } },
  ];

  const handleGenerate = async (sec) => {
    setSelectedTopic(sec.id);
    setDocTitle(sec.title);
    setIsLoading(true);
    try {
      const res = await onRunToolDirect(sec.tool, sec.param);
      const out = res?.result || res;
      if (out.markdown_content) {
        setDocContent(out.markdown_content);
      } else if (out.spec_markdown) {
        setDocContent(out.spec_markdown);
      } else if (sec.id === 'feasibility') {
        const text = (
          "## Business Model & Graduation Feasibility Analysis\n\n" +
          "### 1. Monetization Models (Proposed for Future Rollout)\n" +
          out.business_model_options.map(m => `- **${m.model}:** ${m.detail}`).join('\n') +
          "\n\n### 2. SWOT Matrix\n" +
          `- **Strengths:** ${out.swot_analysis.strengths}\n` +
          `- **Weaknesses:** ${out.swot_analysis.weaknesses}\n` +
          `- **Opportunities:** ${out.swot_analysis.opportunities}\n` +
          `- **Threats:** ${out.swot_analysis.threats}\n\n` +
          `### 3. Graduation Defense Recommendation\n${out.graduation_recommendation}`
        );
        setDocContent(text);
      } else if (sec.id === 'dual_profile') {
        const text = (
          "## Dual-Profile Single Account Architectural Rule\n\n" +
          "### Core Constraint:\n" +
          `One central User account may have zero, one, or both a StudentProfile and an AthleteProfile.\n\n` +
          `**Current Status:** ${out.dual_career_status}\n` +
          `**Separation Principle:** ${out.separation_rule}`
        );
        setDocContent(text);
      } else {
        setDocContent(JSON.stringify(out, null, 2));
      }
    } catch (err) {
      setDocContent('Error generating documentation: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(docContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([docContent], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedTopic}-documentation.md`;
    a.click();
  };

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Header */}
      <div className="glass-card" style={{ padding: '24px 32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
          <span className="badge badge-emerald">
            <FileText size={13} /> Graduation Defense & Academic Suite
          </span>
        </div>
        <h2 style={{ fontSize: '1.6rem', fontWeight: 800 }}>
          Academic Documentation & Defense Preparation
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', maxWidth: '780px' }}>
          Generate copy-ready, formal academic report sections, entity relationship schemas, SMART objectives, and defense examination responses formatted according to graduation project standards.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.8fr', gap: '24px' }}>
        
        {/* Left: Section Selector */}
        <div className="glass-card">
          <h3 className="card-title" style={{ marginBottom: '14px' }}>Report & Thesis Sections</h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {sections.map(sec => {
              const Icon = sec.icon;
              const isSelected = selectedTopic === sec.id;
              return (
                <div
                  key={sec.id}
                  onClick={() => handleGenerate(sec)}
                  style={{
                    padding: '14px 16px',
                    borderRadius: 'var(--radius-md)',
                    border: isSelected ? '1px solid var(--accent-emerald)' : '1px solid var(--border-subtle)',
                    background: isSelected ? 'rgba(16, 185, 129, 0.12)' : 'rgba(255, 255, 255, 0.02)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <Icon size={18} color={isSelected ? 'var(--accent-emerald)' : 'var(--text-secondary)'} />
                  <strong style={{ fontSize: '0.88rem', color: isSelected ? '#fff' : 'var(--text-secondary)' }}>
                    {sec.title}
                  </strong>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Generated Output Viewer */}
        <div className="glass-card" style={{ minHeight: '520px', display: 'flex', flexDirection: 'column' }}>
          <div className="card-header-row" style={{ marginBottom: '14px' }}>
            <div>
              <h3 className="card-title">{docTitle}</h3>
              <p className="card-subtitle">Formal Copy-Ready Markdown</p>
            </div>

            {docContent && (
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  className="btn-secondary"
                  style={{ padding: '6px 12px', fontSize: '0.8rem' }}
                  onClick={handleCopy}
                >
                  {copied ? <Check size={14} color="var(--accent-emerald)" /> : <Copy size={14} />}
                  <span>{copied ? 'Copied' : 'Copy Content'}</span>
                </button>
                <button
                  className="btn-secondary"
                  style={{ padding: '6px 12px', fontSize: '0.8rem' }}
                  onClick={handleDownload}
                >
                  <Download size={14} />
                  <span>Download .md</span>
                </button>
              </div>
            )}
          </div>

          <div
            style={{
              flex: 1,
              background: '#040711',
              borderRadius: 'var(--radius-md)',
              padding: '20px',
              border: '1px solid var(--border-subtle)',
              fontFamily: 'var(--font-primary)',
              fontSize: '0.88rem',
              lineHeight: 1.55,
              color: '#ffffff',
              overflowY: 'auto',
              maxHeight: '540px',
              whiteSpace: 'pre-wrap'
            }}
          >
            {isLoading && (
              <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
                <div className="live-pulse" style={{ margin: '0 auto 12px', background: 'var(--accent-emerald)' }} />
                <span>Generating formal academic section...</span>
              </div>
            )}

            {!isLoading && !docContent && (
              <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-muted)' }}>
                <Sparkles size={36} color="var(--accent-emerald)" style={{ marginBottom: '12px' }} />
                <p>Select any section on the left to generate copy-ready thesis content.</p>
              </div>
            )}

            {!isLoading && docContent}
          </div>
        </div>

      </div>

    </div>
  );
}
