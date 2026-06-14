import React from 'react';

export default function DailySummary({ sessionsCompleted, totalFocusTime, tasksCompleted }) {
  return (
    <div className="card summary-card">
      <div className="summary-item">
        <span className="summary-value">{sessionsCompleted}</span>
        <span className="mono-label">SESSIONS</span>
      </div>
      <div className="summary-item">
        <span className="summary-value">{totalFocusTime}m</span>
        <span className="mono-label">FOCUS TIME</span>
      </div>
      <div className="summary-item">
        <span className="summary-value">{tasksCompleted}</span>
        <span className="mono-label">TASKS DONE</span>
      </div>
    </div>
  );
}
