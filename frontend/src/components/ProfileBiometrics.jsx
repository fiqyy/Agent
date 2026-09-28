import React, { useState, useEffect } from 'react';
import { 
  User, 
  HeartPulse, 
  Save, 
  Award, 
  BookOpen, 
  Dumbbell, 
  Activity, 
  Flame, 
  Moon, 
  Smile, 
  CheckCircle2,
  TrendingUp
} from 'lucide-react';

export default function ProfileBiometrics({ 
  athleteProfile, 
  onSaveProfile, 
  onLogMetrics, 
  latestMetrics 
}) {
  const [profileForm, setProfileForm] = useState({
    full_name: '',
    university: '',
    academic_major: '',
    sport: '',
    position_event: '',
    current_gpa: 3.88,
    target_gpa: 4.00,
    weekly_training_hours: 17.0,
    sleep_target_hours: 8.5,
    daily_calorie_target: 3150,
    daily_protein_target: 165,
    nutrition_preference: '',
    primary_goals: ''
  });

  const [metricsForm, setMetricsForm] = useState({
    sleep_hours: 8.2,
    sleep_quality: 88,
    fatigue_level: 22,
    muscle_soreness: 28,
    training_strain: 15.0,
    study_focus_hours: 5.0,
    readiness_score: 91
  });

  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isLoggingMetrics, setIsLoggingMetrics] = useState(false);

  useEffect(() => {
    if (athleteProfile) {
      setProfileForm({
        full_name: athleteProfile.full_name || '',
        university: athleteProfile.university || '',
        academic_major: athleteProfile.academic_major || '',
        sport: athleteProfile.sport || '',
        position_event: athleteProfile.position_event || '',
        current_gpa: athleteProfile.current_gpa || 3.88,
        target_gpa: athleteProfile.target_gpa || 4.00,
        weekly_training_hours: athleteProfile.weekly_training_hours || 17.0,
        sleep_target_hours: athleteProfile.sleep_target_hours || 8.5,
        daily_calorie_target: athleteProfile.daily_calorie_target || 3150,
        daily_protein_target: athleteProfile.daily_protein_target || 165,
        nutrition_preference: athleteProfile.nutrition_preference || '',
        primary_goals: athleteProfile.primary_goals || ''
      });
    }
  }, [athleteProfile]);

  useEffect(() => {
    if (latestMetrics) {
      setMetricsForm({
        sleep_hours: latestMetrics.sleep_hours || 8.2,
        sleep_quality: latestMetrics.sleep_quality || 88,
        fatigue_level: latestMetrics.fatigue_level || 22,
        muscle_soreness: latestMetrics.muscle_soreness || 28,
        training_strain: latestMetrics.training_strain || 15.0,
        study_focus_hours: latestMetrics.study_focus_hours || 5.0,
        readiness_score: latestMetrics.readiness_score || 91
      });
    }
  }, [latestMetrics]);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setIsSavingProfile(true);
    try {
      await onSaveProfile(profileForm);
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleMetricsSubmit = async (e) => {
    e.preventDefault();
    setIsLoggingMetrics(true);
    try {
      // Calculate dynamic readiness score
      const sleepScore = Math.min(100, (metricsForm.sleep_hours / 8.5) * 100) * 0.35 + (metricsForm.sleep_quality * 0.15);
      const fatiguePenalty = (metricsForm.fatigue_level * 0.25) + (metricsForm.muscle_soreness * 0.25);
      const calculatedReadiness = Math.max(10, Math.min(99, Math.round(sleepScore + 50 - fatiguePenalty)));

      await onLogMetrics({
        ...metricsForm,
        readiness_score: calculatedReadiness
      });
    } finally {
      setIsLoggingMetrics(false);
    }
  };

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Header */}
      <div className="glass-card" style={{ padding: '24px 32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
          <span className="badge badge-cyan">
            <User size={13} /> Student-Athlete Identity & Biometric Telemetry
          </span>
        </div>
        <h2 style={{ fontSize: '1.6rem', fontWeight: 800 }}>
          Athlete Profile & Biometrics Hub
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          Keep your academic discipline, sporting event, macro targets, and daily sleep/strain metrics updated so the AI Agent continuously personalizes your strategy.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1.2fr', gap: '24px' }}>
        
        {/* Left: Athlete Profile Form */}
        <div className="glass-card">
          <h3 className="card-title" style={{ marginBottom: '18px' }}>Dual-Career Athlete Profile</h3>

          <form onSubmit={handleProfileSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div>
                <label className="input-label">Full Name</label>
                <input
                  type="text"
                  required
                  className="input-control"
                  value={profileForm.full_name}
                  onChange={(e) => setProfileForm({ ...profileForm, full_name: e.target.value })}
                />
              </div>

              <div>
                <label className="input-label">University / Institution</label>
                <input
                  type="text"
                  className="input-control"
                  value={profileForm.university}
                  onChange={(e) => setProfileForm({ ...profileForm, university: e.target.value })}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div>
                <label className="input-label">Sport / Discipline</label>
                <input
                  type="text"
                  className="input-control"
                  placeholder="e.g. Track & Field (Sprinting)"
                  value={profileForm.sport}
                  onChange={(e) => setProfileForm({ ...profileForm, sport: e.target.value })}
                />
              </div>

              <div>
                <label className="input-label">Position / Event</label>
                <input
                  type="text"
                  className="input-control"
                  placeholder="e.g. 400m Dash & Anchor Relay"
                  value={profileForm.position_event}
                  onChange={(e) => setProfileForm({ ...profileForm, position_event: e.target.value })}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr 1fr', gap: '14px' }}>
              <div>
                <label className="input-label">Academic Major</label>
                <input
                  type="text"
                  className="input-control"
                  placeholder="e.g. Computer Engineering"
                  value={profileForm.academic_major}
                  onChange={(e) => setProfileForm({ ...profileForm, academic_major: e.target.value })}
                />
              </div>

              <div>
                <label className="input-label">Current GPA</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="4.0"
                  className="input-control"
                  value={profileForm.current_gpa}
                  onChange={(e) => setProfileForm({ ...profileForm, current_gpa: parseFloat(e.target.value) })}
                />
              </div>

              <div>
                <label className="input-label">Target GPA</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="4.0"
                  className="input-control"
                  value={profileForm.target_gpa}
                  onChange={(e) => setProfileForm({ ...profileForm, target_gpa: parseFloat(e.target.value) })}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '14px' }}>
              <div>
                <label className="input-label">Training Hours/Week</label>
                <input
                  type="number"
                  step="0.5"
                  className="input-control"
                  value={profileForm.weekly_training_hours}
                  onChange={(e) => setProfileForm({ ...profileForm, weekly_training_hours: parseFloat(e.target.value) })}
                />
              </div>

              <div>
                <label className="input-label">Daily Calories (kcal)</label>
                <input
                  type="number"
                  className="input-control"
                  value={profileForm.daily_calorie_target}
                  onChange={(e) => setProfileForm({ ...profileForm, daily_calorie_target: parseInt(e.target.value) })}
                />
              </div>

              <div>
                <label className="input-label">Protein Target (g)</label>
                <input
                  type="number"
                  className="input-control"
                  value={profileForm.daily_protein_target}
                  onChange={(e) => setProfileForm({ ...profileForm, daily_protein_target: parseInt(e.target.value) })}
                />
              </div>
            </div>

            <div>
              <label className="input-label">Championship & Academic Goals</label>
              <textarea
                className="input-control"
                rows={3}
                value={profileForm.primary_goals}
                onChange={(e) => setProfileForm({ ...profileForm, primary_goals: e.target.value })}
                placeholder="1. Break personal best in 400m sprint&#10;2. Score straight A's in Distributed Systems"
              />
            </div>

            <button
              type="submit"
              className="btn-primary"
              disabled={isSavingProfile}
              style={{ alignSelf: 'flex-start', minWidth: '180px' }}
            >
              <Save size={16} />
              <span>{isSavingProfile ? 'Saving Profile...' : 'Update Athlete Profile'}</span>
            </button>
          </form>
        </div>

        {/* Right: Daily Biometric Telemetry Logger */}
        <div className="glass-card">
          <div className="card-header-row" style={{ marginBottom: '14px' }}>
            <div>
              <h3 className="card-title">Daily Biometric Log</h3>
              <p className="card-subtitle">Feeds real-time CNS status to the agent</p>
            </div>
            <div className="card-icon-badge" style={{ color: 'var(--accent-emerald)' }}>
              <HeartPulse size={20} />
            </div>
          </div>

          <form onSubmit={handleMetricsSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            
            {/* Sleep Hours Slider */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '6px' }}>
                <label className="input-label" style={{ marginBottom: 0 }}>
                  <Moon size={13} style={{ display: 'inline', marginRight: '4px' }} /> Sleep Duration
                </label>
                <strong style={{ color: 'var(--primary-cyan)' }}>{metricsForm.sleep_hours} hrs</strong>
              </div>
              <input
                type="range"
                min="4.0"
                max="12.0"
                step="0.2"
                value={metricsForm.sleep_hours}
                onChange={(e) => setMetricsForm({ ...metricsForm, sleep_hours: parseFloat(e.target.value) })}
                style={{ width: '100%', accentColor: 'var(--primary-cyan)' }}
              />
            </div>

            {/* Sleep Quality Slider */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '6px' }}>
                <label className="input-label" style={{ marginBottom: 0 }}>Sleep Quality Score</label>
                <strong style={{ color: 'var(--accent-emerald)' }}>{metricsForm.sleep_quality}%</strong>
              </div>
              <input
                type="range"
                min="10"
                max="100"
                step="5"
                value={metricsForm.sleep_quality}
                onChange={(e) => setMetricsForm({ ...metricsForm, sleep_quality: parseInt(e.target.value) })}
                style={{ width: '100%', accentColor: 'var(--accent-emerald)' }}
              />
            </div>

            {/* Muscle Soreness */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '6px' }}>
                <label className="input-label" style={{ marginBottom: 0 }}>Muscle Soreness Index</label>
                <strong style={{ color: metricsForm.muscle_soreness > 50 ? 'var(--accent-rose)' : 'var(--accent-amber)' }}>
                  {metricsForm.muscle_soreness}%
                </strong>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={metricsForm.muscle_soreness}
                onChange={(e) => setMetricsForm({ ...metricsForm, muscle_soreness: parseInt(e.target.value) })}
                style={{ width: '100%', accentColor: 'var(--accent-amber)' }}
              />
            </div>

            {/* Fatigue Level */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '6px' }}>
                <label className="input-label" style={{ marginBottom: 0 }}>CNS Fatigue Level</label>
                <strong style={{ color: metricsForm.fatigue_level > 50 ? 'var(--accent-rose)' : 'var(--accent-cyan)' }}>
                  {metricsForm.fatigue_level}%
                </strong>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={metricsForm.fatigue_level}
                onChange={(e) => setMetricsForm({ ...metricsForm, fatigue_level: parseInt(e.target.value) })}
                style={{ width: '100%', accentColor: 'var(--primary-cyan)' }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label className="input-label">Training Strain (0-21)</label>
                <input
                  type="number"
                  step="0.5"
                  min="0"
                  max="21"
                  className="input-control"
                  value={metricsForm.training_strain}
                  onChange={(e) => setMetricsForm({ ...metricsForm, training_strain: parseFloat(e.target.value) })}
                />
              </div>

              <div>
                <label className="input-label">Study Focus Hours</label>
                <input
                  type="number"
                  step="0.5"
                  min="0"
                  max="16"
                  className="input-control"
                  value={metricsForm.study_focus_hours}
                  onChange={(e) => setMetricsForm({ ...metricsForm, study_focus_hours: parseFloat(e.target.value) })}
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn-emerald"
              disabled={isLoggingMetrics}
              style={{ width: '100%', height: '46px', marginTop: '10px' }}
            >
              <Activity size={16} />
              <span>{isLoggingMetrics ? 'Recalculating...' : 'Log Biometrics & Recalculate Readiness'}</span>
            </button>
          </form>
        </div>

      </div>

    </div>
  );
}
