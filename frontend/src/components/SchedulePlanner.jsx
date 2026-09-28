import React, { useState } from 'react';
import { 
  Calendar as CalendarIcon, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  BookOpen, 
  Dumbbell, 
  HeartPulse, 
  Zap, 
  Sparkles,
  Filter,
  Check,
  Award
} from 'lucide-react';

export default function SchedulePlanner({ 
  scheduleItems, 
  onCreateItem, 
  onDeleteItem, 
  onToggleComplete, 
  onTriggerOptimization,
  isOptimizing 
}) {
  const [selectedDay, setSelectedDay] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newItem, setNewItem] = useState({
    title: '',
    category: 'academic_class',
    day_of_week: 'Monday',
    start_time: '10:00',
    end_time: '11:30',
    location: '',
    priority: 'medium',
    notes: '',
    ai_suggested: false
  });

  const days = ['All', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const categories = [
    { id: 'All', label: 'All Events' },
    { id: 'academic_class', label: 'Lectures / Labs', icon: BookOpen },
    { id: 'academic_study', label: 'Deep Study', icon: Zap },
    { id: 'athletic_training', label: 'Athletic Training', icon: Dumbbell },
    { id: 'athletic_game', label: 'Competitions', icon: Award },
    { id: 'recovery_nutrition', label: 'Recovery & Nutrition', icon: HeartPulse },
  ];

  const filteredItems = (scheduleItems || []).filter(item => {
    const dayMatch = selectedDay === 'All' || item.day_of_week === selectedDay;
    const catMatch = selectedCategory === 'All' || item.category === selectedCategory;
    return dayMatch && catMatch;
  });

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    if (!newItem.title.trim()) return;
    onCreateItem(newItem);
    setNewItem({
      title: '',
      category: 'academic_class',
      day_of_week: 'Monday',
      start_time: '10:00',
      end_time: '11:30',
      location: '',
      priority: 'medium',
      notes: '',
      ai_suggested: false
    });
    setShowAddModal(false);
  };

  const getCategoryBadge = (cat) => {
    switch (cat) {
      case 'academic_class':
      case 'academic_study':
        return <span className="badge badge-purple"><BookOpen size={11} /> Academic</span>;
      case 'athletic_training':
      case 'athletic_game':
        return <span className="badge badge-amber"><Dumbbell size={11} /> Athletic</span>;
      case 'recovery_nutrition':
        return <span className="badge badge-emerald"><HeartPulse size={11} /> Recovery</span>;
      default:
        return <span className="badge badge-cyan">General</span>;
    }
  };

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Header Bar */}
      <div className="glass-card" style={{ padding: '24px 32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <span className="badge badge-cyan">
                <CalendarIcon size={13} /> Dual-Schedule Harmonizer
              </span>
            </div>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800 }}>
              Academic & Athletic Synchronized Schedule
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              Seamlessly integrates coursework deadlines, team training, sprint interval blocks, and recovery windows.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <button 
              className="btn-secondary" 
              onClick={onTriggerOptimization}
              disabled={isOptimizing}
            >
              <Sparkles size={16} color="var(--primary-cyan)" />
              <span>{isOptimizing ? 'Optimizing...' : 'AI Schedule Deconfliction'}</span>
            </button>
            <button 
              className="btn-primary" 
              onClick={() => setShowAddModal(true)}
            >
              <Plus size={16} />
              <span>Add Calendar Block</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {/* Day of Week Selector */}
        <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '4px' }}>
          {days.map(d => (
            <button
              key={d}
              onClick={() => setSelectedDay(d)}
              style={{
                padding: '8px 16px',
                borderRadius: 'var(--radius-full)',
                border: selectedDay === d ? '1px solid var(--primary-cyan)' : '1px solid var(--border-subtle)',
                background: selectedDay === d ? 'rgba(6, 182, 212, 0.15)' : 'rgba(255, 255, 255, 0.03)',
                color: selectedDay === d ? '#fff' : 'var(--text-secondary)',
                fontSize: '0.85rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              {d}
            </button>
          ))}
        </div>

        {/* Category Pills */}
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto' }}>
          {categories.map(c => (
            <button
              key={c.id}
              onClick={() => setSelectedCategory(c.id)}
              style={{
                padding: '6px 14px',
                borderRadius: 'var(--radius-md)',
                border: selectedCategory === c.id ? '1px solid var(--border-light)' : '1px solid transparent',
                background: selectedCategory === c.id ? 'rgba(255, 255, 255, 0.08)' : 'transparent',
                color: selectedCategory === c.id ? '#fff' : 'var(--text-muted)',
                fontSize: '0.8rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <span>{c.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Schedule Items Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '16px' }}>
        {filteredItems.length === 0 && (
          <div className="glass-card" style={{ gridColumn: '1 / -1', padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>
            <CalendarIcon size={36} color="var(--primary-cyan)" style={{ marginBottom: '12px' }} />
            <p>No calendar blocks found matching the active filter.</p>
          </div>
        )}

        {filteredItems.map(item => (
          <div
            key={item.id}
            className="glass-card"
            style={{
              padding: '20px',
              borderLeft: item.ai_suggested ? '4px solid var(--primary-cyan)' : undefined,
              opacity: item.is_completed ? 0.6 : 1,
              transition: 'all 0.2s ease'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '10px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  {getCategoryBadge(item.category)}
                  {item.ai_suggested && (
                    <span className="badge badge-cyan" style={{ fontSize: '0.65rem' }}>
                      <Sparkles size={10} /> AI Injected
                    </span>
                  )}
                </div>
                <h4 style={{ fontSize: '1.05rem', fontWeight: 700, textDecoration: item.is_completed ? 'line-through' : 'none' }}>
                  {item.title}
                </h4>
              </div>

              <button
                style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                onClick={() => onDeleteItem(item.id)}
                title="Delete Event"
              >
                <Trash2 size={15} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Clock size={14} color="var(--primary-cyan)" />
                <span>{item.day_of_week} • <strong>{item.start_time} - {item.end_time}</strong></span>
              </div>
              {item.location && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <MapPin size={14} color="var(--accent-amber)" />
                  <span>{item.location}</span>
                </div>
              )}
              {item.notes && (
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px', fontStyle: 'italic' }}>
                  "{item.notes}"
                </p>
              )}
            </div>

            <div style={{ marginTop: '14px', paddingTop: '12px', borderTop: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Priority: <strong style={{ color: item.priority === 'high' ? 'var(--accent-rose)' : '#fff' }}>{item.priority}</strong>
              </span>

              <button
                onClick={() => onToggleComplete(item.id, !item.is_completed)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '4px 10px',
                  borderRadius: 'var(--radius-sm)',
                  border: item.is_completed ? '1px solid var(--accent-emerald)' : '1px solid var(--border-light)',
                  background: item.is_completed ? 'rgba(16, 185, 129, 0.15)' : 'transparent',
                  color: item.is_completed ? 'var(--accent-emerald)' : 'var(--text-secondary)',
                  fontSize: '0.75rem',
                  cursor: 'pointer'
                }}
              >
                <Check size={12} />
                <span>{item.is_completed ? 'Completed' : 'Mark Done'}</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Event Modal */}
      {showAddModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.75)',
          backdropFilter: 'blur(8px)',
          zIndex: 100,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}>
          <div className="glass-card" style={{ width: '100%', maxWidth: '520px', padding: '28px', background: 'rgba(15, 23, 42, 0.98)' }}>
            <h3 className="card-title" style={{ marginBottom: '18px' }}>Add Schedule Block</h3>
            
            <form onSubmit={handleCreateSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label className="input-label">Event Title</label>
                <input
                  type="text"
                  required
                  className="input-control"
                  placeholder="e.g. Advanced Operating Systems Lecture or 400m Track Intervals"
                  value={newItem.title}
                  onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label className="input-label">Category</label>
                  <select
                    className="input-control"
                    value={newItem.category}
                    onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                  >
                    <option value="academic_class">Academic Lecture / Lab</option>
                    <option value="academic_study">Deep Study Block</option>
                    <option value="athletic_training">Athletic Training / Gym</option>
                    <option value="athletic_game">Competition / Match</option>
                    <option value="recovery_nutrition">Recovery & Nutrition</option>
                  </select>
                </div>

                <div>
                  <label className="input-label">Day of Week</label>
                  <select
                    className="input-control"
                    value={newItem.day_of_week}
                    onChange={(e) => setNewItem({ ...newItem, day_of_week: e.target.value })}
                  >
                    {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label className="input-label">Start Time</label>
                  <input
                    type="time"
                    className="input-control"
                    value={newItem.start_time}
                    onChange={(e) => setNewItem({ ...newItem, start_time: e.target.value })}
                  />
                </div>
                <div>
                  <label className="input-label">End Time</label>
                  <input
                    type="time"
                    className="input-control"
                    value={newItem.end_time}
                    onChange={(e) => setNewItem({ ...newItem, end_time: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '12px' }}>
                <div>
                  <label className="input-label">Location</label>
                  <input
                    type="text"
                    className="input-control"
                    placeholder="e.g. Engineering Hall 301 or Track Stadium"
                    value={newItem.location}
                    onChange={(e) => setNewItem({ ...newItem, location: e.target.value })}
                  />
                </div>
                <div>
                  <label className="input-label">Priority</label>
                  <select
                    className="input-control"
                    value={newItem.priority}
                    onChange={(e) => setNewItem({ ...newItem, priority: e.target.value })}
                  >
                    <option value="high">High Priority</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="input-label">Notes / Instructions</label>
                <input
                  type="text"
                  className="input-control"
                  placeholder="e.g. Midterm quiz or speed endurance rep focus"
                  value={newItem.notes}
                  onChange={(e) => setNewItem({ ...newItem, notes: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '12px' }}>
                <button
                  type="button"
                  className="btn-secondary"
                  style={{ flex: 1 }}
                  onClick={() => setShowAddModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  style={{ flex: 1.5 }}
                >
                  Save Calendar Block
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
