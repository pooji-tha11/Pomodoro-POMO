import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Timer from './components/Timer';
import TodoList from './components/TodoList';
import DailySummary from './components/DailySummary';
import SettingsModal from './components/SettingsModal';
import './App.css';

function useLocalStorageState(key, defaultValue) {
  const [state, setState] = useState(() => {
    try {
      const saved = localStorage.getItem(key);
      if (saved !== null) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Error reading localStorage', e);
    }
    return defaultValue;
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(state));
    } catch (e) {
      console.warn('Error setting localStorage', e);
    }
  }, [key, state]);

  return [state, setState];
}

function App() {
  const [theme, setTheme] = useLocalStorageState('pomoTheme', 'light');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false); // don't persist UI modal state
  const [isSoundEnabled, setIsSoundEnabled] = useLocalStorageState('pomoSound', true);
  
  // Timer State
  const [focusDuration, setFocusDuration] = useLocalStorageState('pomoFocus', 25);
  const [breakDuration, setBreakDuration] = useLocalStorageState('pomoBreak', 5);
  const [mode, setMode] = useLocalStorageState('pomoMode', 'focus'); // 'focus' or 'break'
  
  // We initialize timeLeft from localStorage, but default to focusDuration
  const [timeLeft, setTimeLeft] = useLocalStorageState('pomoTimeLeft', focusDuration * 60);
  const [isRunning, setIsRunning] = useState(false); // never persist running state

  // Tasks State
  const [tasks, setTasks] = useLocalStorageState('pomoTasks', [
    { id: 1, text: 'React learning', completed: false },
    { id: 2, text: 'DSA practice', completed: false },
    { id: 3, text: 'Revise DBMS', completed: true },
  ]);

  // Summary State
  const [sessionsCompleted, setSessionsCompleted] = useLocalStorageState('pomoSessionsCompleted', 0);
  const [totalFocusTime, setTotalFocusTime] = useLocalStorageState('pomoTotalFocusTime', 0);
  const [recentSessions, setRecentSessions] = useLocalStorageState('pomoHistory', []);

  // Daily Reset State
  const [lastOpenedDate, setLastOpenedDate] = useLocalStorageState('pomoLastOpenedDate', new Date().toDateString());
  const [carriedOverCount, setCarriedOverCount] = useState(0);

  useEffect(() => {
    const today = new Date().toDateString();
    if (lastOpenedDate !== today) {
      const incompleteTasks = tasks.filter(t => !t.completed);
      setCarriedOverCount(incompleteTasks.length);
      setTasks(incompleteTasks);
      setSessionsCompleted(0);
      setTotalFocusTime(0);
      setRecentSessions([]);
      setLastOpenedDate(today);
    }
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName.toLowerCase() === 'input') return;
      
      if (e.code === 'Space') {
        e.preventDefault();
        setIsRunning(prev => !prev);
      } else if (e.key === 'r' || e.key === 'R') {
        e.preventDefault();
        setIsRunning(false);
        if (mode === 'break') {
          setMode('focus');
        }
        setTimeLeft(focusDuration * 60);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isRunning, mode, focusDuration, breakDuration]);

  const toggleTheme = () => {
    setTheme(t => (t === 'light' ? 'dark' : 'light'));
  };

  const playBell = () => {
    if (!isSoundEnabled) return;
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const t = ctx.currentTime;
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      const gain2 = ctx.createGain();

      osc1.type = 'sine'; osc1.frequency.value = 432;
      osc2.type = 'sine'; osc2.frequency.value = 864;

      gain1.gain.setValueAtTime(0, t);
      gain1.gain.linearRampToValueAtTime(0.15, t + 0.05);
      gain1.gain.exponentialRampToValueAtTime(0.001, t + 3);

      gain2.gain.setValueAtTime(0, t);
      gain2.gain.linearRampToValueAtTime(0.05, t + 0.05);
      gain2.gain.exponentialRampToValueAtTime(0.001, t + 2);

      osc1.connect(gain1); gain1.connect(ctx.destination);
      osc2.connect(gain2); gain2.connect(ctx.destination);

      osc1.start(t); osc1.stop(t + 3);
      osc2.start(t); osc2.stop(t + 2);
    } catch (e) {
      console.error("Audio playback failed", e);
    }
  };

  return (
    <div className="app-container">
      <Header theme={theme} toggleTheme={toggleTheme} />
      
      <div className="main-content">
        <div className="left-panel">
          <Timer 
            timeLeft={timeLeft}
            setTimeLeft={setTimeLeft}
            isRunning={isRunning}
            setIsRunning={setIsRunning}
            mode={mode}
            setMode={setMode}
            focusDuration={focusDuration}
            breakDuration={breakDuration}
            onSessionComplete={() => {
               playBell();
               if (mode === 'focus') {
                 setSessionsCompleted(s => s + 1);
                 setTotalFocusTime(t => t + focusDuration);
                 
                 const newSession = {
                   id: Date.now(),
                   duration: focusDuration,
                   time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
                 };
                 setRecentSessions(prev => [newSession, ...prev].slice(0, 3));
               }
            }}
            onOpenSettings={() => setIsSettingsOpen(true)}
          />
          
          <div className="card momentum-card">
            <span className="mono-label" style={{ marginBottom: '0.75rem', display: 'block' }}>TODAY’S MOMENTUM</span>
            <div className="momentum-dots">
              {[...Array(5)].map((_, i) => (
                <span key={i} className={`dot ${i < sessionsCompleted ? 'filled' : ''}`}>
                  {i < sessionsCompleted ? '●' : '○'}
                </span>
              ))}
              {sessionsCompleted > 5 && (
                <span className="momentum-extra">+{sessionsCompleted - 5} more</span>
              )}
            </div>
          </div>

          <DailySummary 
            sessionsCompleted={sessionsCompleted} 
            totalFocusTime={totalFocusTime} 
            tasksCompleted={tasks.filter(t => t.completed).length} 
          />
        </div>
        
        <div className="right-panel">
          <TodoList tasks={tasks} setTasks={setTasks} carriedOverCount={carriedOverCount} />
          
          {recentSessions.length > 0 && (
            <div className="card history-card">
              <div className="history-header">
                <span className="mono-label">RECENT SESSIONS</span>
              </div>
              <div className="history-list">
                {recentSessions.map(session => (
                  <div key={session.id} className="history-item">
                    <span>{session.duration} min</span>
                    <span className="history-time">• {session.time}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      
      {isSettingsOpen && (
        <SettingsModal 
          onClose={() => setIsSettingsOpen(false)}
          focusDuration={focusDuration}
          setFocusDuration={setFocusDuration}
          breakDuration={breakDuration}
          setBreakDuration={setBreakDuration}
          setTimeLeft={setTimeLeft}
          isRunning={isRunning}
          mode={mode}
          isSoundEnabled={isSoundEnabled}
          setIsSoundEnabled={setIsSoundEnabled}
        />
      )}
    </div>
  );
}

export default App;
