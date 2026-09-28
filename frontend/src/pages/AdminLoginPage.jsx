import React, { useState } from 'react';
import { Shield, Lock, Eye, EyeOff, ArrowRight, Bot, AlertTriangle, Sparkles } from 'lucide-react';
import { agentApi } from '../api/agentApi';

export default function AdminLoginPage({ onLoginSuccess }) {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [shake, setShake] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!password.trim()) {
      setError('Please enter the access password.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Try internal first — if it works, the user gets full admin access
      const internalRes = await agentApi.verifyAccessPassword('internal', password);
      if (internalRes.status === 'authorized') {
        onLoginSuccess(password);
        return;
      }
    } catch (e1) {
      // Internal failed, try development
      try {
        const devRes = await agentApi.verifyAccessPassword('development', password);
        if (devRes.status === 'authorized') {
          onLoginSuccess(password);
          return;
        }
      } catch (e2) {
        // Both failed
      }
    }

    setError('Invalid access password. Contact the project administrator.');
    setShake(true);
    setTimeout(() => setShake(false), 600);
    setIsLoading(false);
  };

  return (
    <div className="admin-login-page">
      {/* Ambient Background */}
      <div className="admin-login-orb admin-login-orb-1" />
      <div className="admin-login-orb admin-login-orb-2" />
      <div className="admin-login-orb admin-login-orb-3" />

      {/* Grid Pattern Overlay */}
      <div className="admin-login-grid-overlay" />

      <div className={`admin-login-card ${shake ? 'admin-login-shake' : ''}`}>
        {/* Top Glow Line */}
        <div className="admin-login-glow-line" />

        {/* Icon */}
        <div className="admin-login-icon-wrapper">
          <div className="admin-login-icon-ring">
            <Shield size={32} />
          </div>
        </div>

        {/* Branding */}
        <div className="admin-login-brand">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', justifyContent: 'center' }}>
            <Bot size={20} color="var(--primary-cyan)" />
            <span className="admin-login-brand-badge">ADMIN CONSOLE</span>
          </div>
          <h1 className="admin-login-title">
            Project Opportunity
            <span className="admin-login-gradient-text"> AI Agent</span>
          </h1>
          <p className="admin-login-subtitle">
            Enter the admin access password to unlock the Internal Group Assistant,
            Development Assistant, Dashboard, and all project tools.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="admin-login-form">
          <div className="admin-login-field-group">
            <label className="admin-login-label">
              <Lock size={14} />
              <span>Access Password</span>
            </label>
            <div className="admin-login-input-row">
              <input
                type={showPassword ? 'text' : 'password'}
                className="admin-login-input"
                placeholder="Enter admin password..."
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(''); }}
                autoFocus
                autoComplete="off"
              />
              <button
                type="button"
                className="admin-login-eye-btn"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {error && (
            <div className="admin-login-error">
              <AlertTriangle size={14} />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            className="admin-login-submit"
            disabled={isLoading || !password.trim()}
          >
            {isLoading ? (
              <>
                <div className="admin-login-spinner" />
                <span>Verifying...</span>
              </>
            ) : (
              <>
                <Shield size={16} />
                <span>Unlock Admin Console</span>
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        {/* Footer Note */}
        <div className="admin-login-footer">
          <Sparkles size={12} color="var(--primary-cyan)" />
          <span>
            Internal Group & Dev Assistant access requires authorization.
            <br />
            Default passwords: <code>grad2026</code> (Internal) / <code>dev2026</code> (Dev)
          </span>
        </div>
      </div>
    </div>
  );
}
