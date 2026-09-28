import React, { useState } from 'react';
import { 
  Briefcase, 
  Trophy, 
  Users, 
  Building, 
  Award, 
  ShieldCheck, 
  Video, 
  CheckCircle2, 
  Clock, 
  MapPin,
  ExternalLink
} from 'lucide-react';

export default function MarketplaceExplorer({ platformData }) {
  const [activeTab, setActiveTab] = useState('internships');

  const internships = platformData?.internships || [];
  const sampleStudent = platformData?.sample_student;
  const sampleAthlete = platformData?.sample_athlete;
  const sampleEnterprise = platformData?.sample_enterprise;
  const sampleScout = platformData?.sample_scout;
  const offers = platformData?.recruitment_offers || [];
  const verifications = platformData?.verification_requests || [];

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Header */}
      <div className="glass-card" style={{ padding: '24px 32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
          <span className="badge badge-cyan">
            <Briefcase size={13} /> Live Marketplace Entities & Workflows
          </span>
        </div>
        <h2 style={{ fontSize: '1.6rem', fontWeight: 800 }}>
          Platform Opportunity Marketplace
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          Explore the dual marketplace: Student Internship Applications & Enterprise Listings, alongside Athlete Sports Scouting, Highlights, and Clinic Verification.
        </p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '8px', overflowX: 'auto' }}>
        {[
          { id: 'internships', label: 'Enterprise Internships', icon: Building },
          { id: 'athletes', label: 'Athlete Profiles & Videos', icon: Trophy },
          { id: 'students', label: 'Student Profiles & CVs', icon: Users },
          { id: 'offers', label: 'Scout Recruitment Offers', icon: Award },
          { id: 'verification', label: 'Clinic Verification Requests', icon: ShieldCheck },
        ].map(t => {
          const Icon = t.icon;
          const isActive = activeTab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`nav-tab-btn ${isActive ? 'active' : ''}`}
              style={{ padding: '8px 16px', fontSize: '0.82rem' }}
            >
              <Icon size={14} />
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '20px' }}>
        
        {/* 1. Internships */}
        {activeTab === 'internships' && internships.map(item => (
          <div key={item.id} className="glass-card" style={{ padding: '22px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span className="badge badge-emerald">Active Listing</span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{item.duration_months} Months</span>
            </div>
            <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff', marginBottom: '4px' }}>{item.title}</h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--primary-cyan)', marginBottom: '8px' }}>{item.enterprise_name}</p>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.45, marginBottom: '12px' }}>
              {item.description}
            </p>
            
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '14px' }}>
              {item.required_skills?.map((s, idx) => (
                <span key={idx} style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '2px 8px', borderRadius: '4px', fontSize: '0.72rem', color: '#fff' }}>
                  {s}
                </span>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.78rem', color: 'var(--text-muted)', paddingTop: '10px', borderTop: '1px solid var(--border-subtle)' }}>
              <span><MapPin size={12} style={{ display: 'inline', marginRight: '4px' }} /> {item.location}</span>
              <span style={{ color: 'var(--accent-emerald)', fontWeight: 600 }}>1 Application Shortlisted</span>
            </div>
          </div>
        ))}

        {/* 2. Athlete Profiles */}
        {activeTab === 'athletes' && sampleAthlete && (
          <div className="glass-card" style={{ padding: '24px', gridColumn: '1 / -1' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px', marginBottom: '16px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>{sampleAthlete.user_name}</h3>
                  <span className="badge badge-cyan">
                    <ShieldCheck size={12} /> Blue Verification Badge
                  </span>
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  {sampleAthlete.sport} • {sampleAthlete.position} • Age {sampleAthlete.age}
                </p>
              </div>

              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Verified by Clinic:</span>
                <p style={{ fontSize: '0.85rem', color: 'var(--accent-emerald)', fontWeight: 600 }}>{sampleAthlete.verified_clinic_name}</p>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px', marginBottom: '16px' }}>
              <div style={{ padding: '12px', background: 'rgba(255, 255, 255, 0.03)', borderRadius: 'var(--radius-md)' }}>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Physical Metrics</span>
                <p style={{ fontSize: '0.85rem', color: '#fff', marginTop: '2px' }}>Height: {sampleAthlete.height_cm}cm • Weight: {sampleAthlete.weight_kg}kg</p>
              </div>
              <div style={{ padding: '12px', background: 'rgba(255, 255, 255, 0.03)', borderRadius: 'var(--radius-md)' }}>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Confirmed Personal Record</span>
                <p style={{ fontSize: '0.85rem', color: 'var(--accent-amber)', fontWeight: 700, marginTop: '2px' }}>400m Dash: 46.4s PR (Gold Medal)</p>
              </div>
              <div style={{ padding: '12px', background: 'rgba(255, 255, 255, 0.03)', borderRadius: 'var(--radius-md)' }}>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Teams & Affiliation</span>
                <p style={{ fontSize: '0.85rem', color: '#fff', marginTop: '2px' }}>{sampleAthlete.teams_academies}</p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', background: 'rgba(6, 182, 212, 0.08)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(6, 182, 212, 0.2)' }}>
              <Video size={18} color="var(--primary-cyan)" />
              <div style={{ flex: 1, fontSize: '0.82rem' }}>
                <strong>Official Gameplay Video Highlights Uploaded:</strong> 400m National Championship Finals (Watch Available to Authorized Scouts)
              </div>
            </div>
          </div>
        )}

        {/* 3. Students */}
        {activeTab === 'students' && sampleStudent && (
          <div className="glass-card" style={{ padding: '24px', gridColumn: '1 / -1' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '14px' }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>{sampleStudent.user_name}</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--accent-purple)' }}>
                  {sampleStudent.major} • {sampleStudent.university}
                </p>
              </div>
              <span className="badge badge-purple">GPA {sampleStudent.gpa} / 4.00</span>
            </div>

            <div style={{ marginBottom: '12px' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Technical Skills</span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '4px' }}>
                {sampleStudent.skills?.map((s, idx) => (
                  <span key={idx} style={{ background: 'rgba(139, 92, 246, 0.15)', color: 'var(--accent-purple)', padding: '2px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600 }}>
                    {s}
                  </span>
                ))}
              </div>
            </div>

            <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
              <strong>Projects:</strong> {sampleStudent.projects}
            </div>
          </div>
        )}

        {/* 4. Scout Recruitment Offers */}
        {activeTab === 'offers' && offers.map(off => (
          <div key={off.id} className="glass-card" style={{ padding: '22px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span className="badge badge-amber">Official Offer Sent</span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{new Date(off.created_at).toLocaleDateString()}</span>
            </div>
            <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#fff', marginBottom: '2px' }}>To: {off.athlete_name}</h4>
            <p style={{ fontSize: '0.8rem', color: 'var(--primary-cyan)', marginBottom: '8px' }}>From: {off.scout_name} ({off.scout_org})</p>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.45 }}>
              "{off.opportunity_details}"
            </p>
          </div>
        ))}

        {/* 5. Clinic Verification Requests */}
        {activeTab === 'verification' && verifications.map(v => (
          <div key={v.id} className="glass-card" style={{ padding: '22px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span className="badge badge-emerald">Approved & Badge Issued</span>
            </div>
            <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#fff', marginBottom: '2px' }}>Athlete: {v.athlete_name}</h4>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>Assessment: {v.assessment_type}</p>
            <p style={{ fontSize: '0.8rem', color: 'var(--primary-cyan)', marginBottom: '8px' }}>Clinic: {v.clinic_name}</p>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
              Reviewer Notes: "{v.reviewer_notes}"
            </div>
          </div>
        ))}

      </div>

    </div>
  );
}
