import React from 'react';
import { X } from 'lucide-react';

export default function SettingsModal({ 
  onClose, 
  focusDuration, 
  setFocusDuration, 
  breakDuration, 
  setBreakDuration,
  setTimeLeft,
  isRunning,
  mode,
  isSoundEnabled,
  setIsSoundEnabled
}) {
  const presets = [15, 25, 45, 60, 90];

  const handleFocusChange = (val) => {
    setFocusDuration(val);
    if (!isRunning && mode === 'focus') {
      setTimeLeft(val * 60);
    }
  };

  const handleBreakChange = (val) => {
    setBreakDuration(val);
    if (!isRunning && mode === 'break') {
      setTimeLeft(val * 60);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="card modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <span className="mono-label">SETTINGS</span>
          <button className="modal-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        
        <div className="settings-group">
          <label className="settings-label">Focus Duration (minutes)</label>
          <div className="presets">
            {presets.map(p => (
              <button 
                key={p}
                className={`preset-chip ${focusDuration === p ? 'active' : ''}`}
                onClick={() => handleFocusChange(p)}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        <div className="settings-group">
          <label className="settings-label">Break Duration (minutes)</label>
          <div className="presets">
            {[5, 10, 15, 20].map(p => (
              <button 
                key={p}
                className={`preset-chip ${breakDuration === p ? 'active' : ''}`}
                onClick={() => handleBreakChange(p)}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        <div className="settings-group">
          <label className="settings-label">Timer Sound</label>
          <div className="presets">
            <button 
              className={`preset-chip ${isSoundEnabled ? 'active' : ''}`}
              onClick={() => setIsSoundEnabled(true)}
            >
              Soft Bell
            </button>
            <button 
              className={`preset-chip ${!isSoundEnabled ? 'active' : ''}`}
              onClick={() => setIsSoundEnabled(false)}
            >
              Off
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
