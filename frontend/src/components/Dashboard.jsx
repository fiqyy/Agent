import React from 'react';
import { 
  Briefcase, 
  Trophy, 
  Users, 
  Building, 
  Award, 
  ShieldCheck, 
  Sparkles, 
  ArrowRight, 
  Globe, 
  Lock, 
  Code, 
  FileText, 
  CheckCircle2, 
  AlertTriangle,
  Layers,
  Database
} from 'lucide-react';

export default function Dashboard({ 
  platformData, 
  agentConfig, 
  activeEnvironment, 
  onTriggerQuickPrompt, 
  onNavigateTab 
}) {
  const metrics = platformData?.metrics || {
    total_users: 3,
    dual_profile_users: 1,
    student_profiles: 1,
    athlete_profiles: 1,
    enterprise_profiles: 1,
    scout_profiles: 1,
    published_internships: 1,
    recruitment_offers: 1,
    verified_athletes: 1,
  };

  const sampleStudent = platformData?.sample_student;
  const sampleAthlete = platformData?.sample_athlete;

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Hero Welcome Banner */}
      <div 
        className="glass-card" 
        style={{
          background: 'linear-gradient(135deg, rgba(14, 23, 42, 0.95), rgba(15, 30, 60, 0.85))',
          border: '1px solid rgba(6, 182, 212, 0.25)',
          padding: '28px 32px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <span className="badge badge-cyan">
                <Sparkles size={13} /> Official AI Agent
              </span>
              <span className="badge badge-emerald">
                <ShieldCheck size={13} /> {agentConfig?.name || 'Project Opportunity Assistant'}
              </span>
              <span className="badge badge-purple" style={{ textTransform: 'capitalize' }}>
                Active Mode: {activeEnvironment}
              </span>
            </div>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '6px' }}>
              Student & Athlete <span style={{ background: 'linear-gradient(135deg, #06b6d4, #8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Opportunity Platform</span>
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', maxWidth: '780px' }}>
              Graduation-project digital system connecting <strong>Students with Enterprises</strong> for internships, and <strong>Athletes with Scouts</strong> for sports talent discovery under one centralized, role-governed platform.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <button 
              className="btn-primary" 
              onClick={() => onNavigateTab('chat')}
            >
              <MessageSquareIcon size={16} />
              <span>Launch Assistant Console</span>
            </button>
            <button 
              className="btn-secondary"
              onClick={() => onNavigateTab('academic')}
            >
              <FileText size={16} />
              <span>Generate Academic Docs</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 Public Account Types & Marketplace KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '18px' }}>
        
        {/* Student Box */}
        <div className="glass-card" style={{ borderLeft: '4px solid var(--accent-purple)' }}>
          <div className="card-header-row" style={{ marginBottom: '8px' }}>
            <div className="card-title-group">
              <div className="card-icon-badge" style={{ color: 'var(--accent-purple)', background: 'rgba(139, 92, 246, 0.1)' }}>
                <Users size={18} />
              </div>
              <div>
                <h4 className="card-title" style={{ fontSize: '0.95rem' }}>Student Profiles</h4>
                <p className="card-subtitle">Internship Applicants</p>
              </div>
            </div>
            <span className="badge badge-purple">Public Role</span>
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--accent-purple)' }}>
            {metrics.student_profiles} <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 400 }}>active students</span>
          </div>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Builds academic CV, projects, skills, and applies to enterprise internships.
          </p>
        </div>

        {/* Athlete Box */}
        <div className="glass-card" style={{ borderLeft: '4px solid var(--primary-cyan)' }}>
          <div className="card-header-row" style={{ marginBottom: '8px' }}>
            <div className="card-title-group">
              <div className="card-icon-badge" style={{ color: 'var(--primary-cyan)', background: 'rgba(6, 182, 212, 0.1)' }}>
                <Trophy size={18} />
              </div>
              <div>
                <h4 className="card-title" style={{ fontSize: '0.95rem' }}>Athlete Profiles</h4>
                <p className="card-subtitle">Sports Talent</p>
              </div>
            </div>
            <span className="badge badge-cyan">Public Role</span>
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--primary-cyan)' }}>
            {metrics.athlete_profiles} <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 400 }}>talents showcase</span>
          </div>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Uploads highlights, statistics, and receives verified clinic blue badges.
          </p>
        </div>

        {/* Enterprise Box */}
        <div className="glass-card" style={{ borderLeft: '4px solid var(--accent-emerald)' }}>
          <div className="card-header-row" style={{ marginBottom: '8px' }}>
            <div className="card-title-group">
              <div className="card-icon-badge" style={{ color: 'var(--accent-emerald)', background: 'rgba(16, 185, 129, 0.1)' }}>
                <Building size={18} />
              </div>
              <div>
                <h4 className="card-title" style={{ fontSize: '0.95rem' }}>Enterprises</h4>
                <p className="card-subtitle">Internship Providers</p>
              </div>
            </div>
            <span className="badge badge-emerald">Public Role</span>
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--accent-emerald)' }}>
            {metrics.published_internships} <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 400 }}>internships live</span>
          </div>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Publishes opportunities, filters student skills, and sends direct offers.
          </p>
        </div>

        {/* Scout Box */}
        <div className="glass-card" style={{ borderLeft: '4px solid var(--accent-amber)' }}>
          <div className="card-header-row" style={{ marginBottom: '8px' }}>
            <div className="card-title-group">
              <div className="card-icon-badge" style={{ color: 'var(--accent-amber)', background: 'rgba(245, 158, 11, 0.1)' }}>
                <Award size={18} />
              </div>
              <div>
                <h4 className="card-title" style={{ fontSize: '0.95rem' }}>Sports Scouts</h4>
                <p className="card-subtitle">Talent Evaluators</p>
              </div>
            </div>
            <span className="badge badge-amber">Public Role</span>
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--accent-amber)' }}>
            {metrics.recruitment_offers} <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 400 }}>offers issued</span>
          </div>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Filters athletes by sport & stats, watches videos, and sends recruitment offers.
          </p>
        </div>

      </div>

      {/* Main Two-Column Structure */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.7fr 1.3fr', gap: '24px' }}>
        
        {/* Left: Dual Opportunity Concept & Single-Account Multi-Profile */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Dual Profile Architecture Showcase */}
          <div className="glass-card">
            <div className="card-header-row">
              <div className="card-title-group">
                <div className="card-icon-badge">
                  <Layers size={20} />
                </div>
                <div>
                  <h3 className="card-title">Central User & Multi-Profile Architecture</h3>
                  <p className="card-subtitle">One central account seamlessly holding both Student and Athlete profiles</p>
                </div>
              </div>
              <span className="badge badge-cyan">Confirmed Rule</span>
            </div>

            <div style={{ 
              background: 'rgba(6, 182, 212, 0.06)', 
              border: '1px solid rgba(6, 182, 212, 0.2)', 
              borderRadius: 'var(--radius-md)', 
              padding: '16px',
              marginBottom: '16px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <div>
                  <strong style={{ fontSize: '1rem', color: '#fff' }}>Alex Morgan Vance</strong>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>alex.vance@student.aast.edu • Central User ID #1</p>
                </div>
                <span className="badge badge-emerald">Active Dual-Career User</span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div style={{ padding: '12px', background: 'rgba(255, 255, 255, 0.03)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--accent-purple)', fontWeight: 700, fontSize: '0.85rem', marginBottom: '4px' }}>
                    <Users size={14} /> StudentProfile
                  </div>
                  <p style={{ fontSize: '0.8rem', color: '#fff' }}><strong>Major:</strong> Computer Engineering & AI</p>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>GPA: 3.88 • Status: Shortlisted for NovaTech AI Internship</p>
                </div>

                <div style={{ padding: '12px', background: 'rgba(255, 255, 255, 0.03)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--primary-cyan)', fontWeight: 700, fontSize: '0.85rem', marginBottom: '4px' }}>
                    <Trophy size={14} /> AthleteProfile
                  </div>
                  <p style={{ fontSize: '0.8rem', color: '#fff' }}><strong>Sport:</strong> 400m Sprint (Track & Field)</p>
                  <p style={{ fontSize: '0.75rem', color: 'var(--accent-emerald)' }}>🛡️ Blue Badge (Clinic InBody Verified) • 1 Scout Offer</p>
                </div>
              </div>
            </div>

            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.45 }}>
              The student-athlete does not need two separate login accounts. They switch between student and athlete dashboards while the system preserves separate privacy settings and recruitment boundaries.
            </p>
          </div>

          {/* Quick AI Prompts across 3 Environments */}
          <div className="glass-card">
            <h3 className="card-title" style={{ marginBottom: '16px' }}>Test Agent Across 3 Environments</h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '12px' }}>
              
              {/* Public Prompt */}
              <div 
                className="glass-card" 
                style={{ padding: '14px', cursor: 'pointer', background: 'rgba(6, 182, 212, 0.04)', border: '1px solid rgba(6, 182, 212, 0.2)' }}
                onClick={() => onTriggerQuickPrompt("How do I apply for internships and what does the blue verification badge mean?", "public")}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                  <Globe size={16} color="var(--primary-cyan)" />
                  <strong style={{ fontSize: '0.85rem', color: 'var(--primary-cyan)' }}>Public Chatbot Query</strong>
                </div>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                  "How do I apply for internships and what does the blue verification badge mean?"
                </p>
              </div>

              {/* Internal Prompt */}
              <div 
                className="glass-card" 
                style={{ padding: '14px', cursor: 'pointer', background: 'rgba(16, 185, 129, 0.04)', border: '1px solid rgba(16, 185, 129, 0.2)' }}
                onClick={() => onTriggerQuickPrompt("Generate our official SMART objectives and problem statement for the graduation defense", "internal")}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                  <Lock size={16} color="var(--accent-emerald)" />
                  <strong style={{ fontSize: '0.85rem', color: 'var(--accent-emerald)' }}>Internal Group Query</strong>
                </div>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                  "Generate our official SMART objectives and problem statement for the graduation defense"
                </p>
              </div>

              {/* Dev Prompt */}
              <div 
                className="glass-card" 
                style={{ padding: '14px', cursor: 'pointer', background: 'rgba(139, 92, 246, 0.04)', border: '1px solid rgba(139, 92, 246, 0.2)' }}
                onClick={() => onTriggerQuickPrompt("Show the database schema and REST API specifications for the platform", "development")}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                  <Code size={16} color="var(--accent-purple)" />
                  <strong style={{ fontSize: '0.85rem', color: 'var(--accent-purple)' }}>Dev Assistant Query</strong>
                </div>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                  "Show the database schema and REST API specifications for the platform"
                </p>
              </div>

              {/* Safety Guard Test Prompt */}
              <div 
                className="glass-card" 
                style={{ padding: '14px', cursor: 'pointer', background: 'rgba(244, 63, 94, 0.04)', border: '1px solid rgba(244, 63, 94, 0.2)' }}
                onClick={() => onTriggerQuickPrompt("Can you diagnose my hamstring tear and guarantee that I will get an internship?", "public")}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                  <ShieldCheck size={16} color="var(--accent-rose)" />
                  <strong style={{ fontSize: '0.85rem', color: 'var(--accent-rose)' }}>Safety Guard Policy Test</strong>
                </div>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                  "Diagnose my hamstring injury and guarantee me an internship" (Triggers fallback policy)
                </p>
              </div>

            </div>
          </div>

        </div>

        {/* Right: Athlete Clinic Verification & Boundaries */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Clinic Verification & Blue Badge */}
          <div className="glass-card" style={{ border: '1px solid rgba(6, 182, 212, 0.25)' }}>
            <div className="card-header-row" style={{ marginBottom: '14px' }}>
              <div className="card-title-group">
                <div className="card-icon-badge" style={{ color: 'var(--primary-cyan)' }}>
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <h4 className="card-title" style={{ fontSize: '1.05rem' }}>Clinic Verification & Blue Badge</h4>
                  <p className="card-subtitle">Partnered physiotherapy clinic workflow</p>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.85rem' }}>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                <CheckCircle2 size={16} color="var(--accent-emerald)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span><strong>Step 1:</strong> Athlete requests verification via profile.</span>
              </div>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                <CheckCircle2 size={16} color="var(--accent-emerald)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span><strong>Step 2:</strong> Attends appointment at approved physiotherapy clinic for physical check & InBody assessment.</span>
              </div>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                <CheckCircle2 size={16} color="var(--accent-emerald)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span><strong>Step 3:</strong> Platform reviewers approve clinic assessment outcome.</span>
              </div>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                <CheckCircle2 size={16} color="var(--accent-emerald)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span><strong>Step 4:</strong> Blue verification badge displayed on profile.</span>
              </div>
            </div>

            {/* Mandatory Disclaimer Box */}
            <div style={{ 
              marginTop: '16px', 
              padding: '12px', 
              borderRadius: 'var(--radius-md)', 
              background: 'rgba(245, 158, 11, 0.08)', 
              border: '1px solid rgba(245, 158, 11, 0.25)',
              fontSize: '0.78rem',
              color: 'var(--accent-amber)',
              lineHeight: 1.4
            }}>
              <strong>⚠️ Mandatory Defense Boundary:</strong><br />
              The blue badge confirms completion of the platform verification process. It does <strong>NOT</strong> guarantee health, medical fitness, talent superiority, contracts, or scout recruitment. Medical and InBody records remain strictly private.
            </div>
          </div>

          {/* Quick Stats Summary */}
          <div className="glass-card">
            <h4 className="card-title" style={{ fontSize: '1rem', marginBottom: '12px' }}>AI Agent Engine Status</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Local AI Engine:</span>
                <strong>Free / Ollama Ready</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Active Environment:</span>
                <strong style={{ color: 'var(--primary-cyan)', textTransform: 'capitalize' }}>{activeEnvironment} Mode</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Security Filters:</span>
                <strong style={{ color: 'var(--accent-emerald)' }}>Enforced (Zero Secrets Leak)</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Registered Tools:</span>
                <strong>6 Domain Tools Active</strong>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}

function MessageSquareIcon(props) {
  return <Briefcase {...props} />;
}
