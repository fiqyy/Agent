import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  RefreshCw, 
  AlertTriangle, 
  CheckCircle2, 
  Lock, 
  Globe, 
  Code 
} from 'lucide-react';

export default function AuditSafetyLogs({ onFetchLogs }) {
  const [logs, setLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadLogs = async () => {
    setIsLoading(true);
    try {
      const data = await onFetchLogs();
      setLogs(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadLogs();
  }, []);

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Header */}
      <div className="glass-card" style={{ padding: '24px 32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <span className="badge badge-cyan">
                <ShieldCheck size={13} /> Security & Policy Audit Trail
              </span>
            </div>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800 }}>
              AI Safety & Access Control Logs
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              Real-time audit records tracking multi-tier environment access, privacy guard enforcement, and prevented prompt injection attempts.
            </p>
          </div>

          <button 
            className="btn-secondary" 
            onClick={loadLogs}
            disabled={isLoading}
          >
            <RefreshCw size={15} className={isLoading ? 'spin' : ''} />
            <span>Refresh Audit Logs</span>
          </button>
        </div>
      </div>

      {/* Logs Table / Stream */}
      <div className="glass-card" style={{ padding: '20px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {logs.length === 0 && (
            <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '30px' }}>
              No audit records recorded yet.
            </p>
          )}

          {logs.map((log) => (
            <div
              key={log.id}
              style={{
                padding: '12px 16px',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid var(--border-subtle)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '12px',
                fontSize: '0.82rem'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                {log.result === 'SUCCESS' ? (
                  <CheckCircle2 size={16} color="var(--accent-emerald)" />
                ) : (
                  <AlertTriangle size={16} color="var(--accent-rose)" />
                )}
                <div>
                  <strong style={{ color: '#fff' }}>{log.action}</strong>
                  <p style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
                    Actor: {log.actor_email} • Target: {log.target_type}
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span className={`badge ${log.environment === 'public' ? 'badge-cyan' : (log.environment === 'internal' ? 'badge-emerald' : 'badge-purple')}`} style={{ fontSize: '0.68rem' }}>
                  {log.environment?.toUpperCase()}
                </span>
                <span className={`badge ${log.result === 'SUCCESS' ? 'badge-emerald' : 'badge-rose'}`} style={{ fontSize: '0.68rem' }}>
                  {log.result}
                </span>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                  {new Date(log.timestamp).toLocaleTimeString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
