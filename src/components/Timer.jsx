import React, { useState, useEffect, useRef } from 'react';
import { Settings, RotateCcw, Maximize, Minimize } from 'lucide-react';

export default function Timer({ 
  timeLeft, 
  setTimeLeft, 
  isRunning, 
  setIsRunning, 
  mode, 
  setMode, 
  focusDuration, 
  breakDuration, 
  onSessionComplete,
  onOpenSettings 
}) {
  const intervalRef = useRef(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement || !!document.webkitFullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('msfullscreenchange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('msfullscreenchange', handleFullscreenChange);
    };
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement && !document.webkitFullscreenElement) {
      const elem = document.documentElement;
      if (elem.requestFullscreen) {
        elem.requestFullscreen();
      } else if (elem.webkitRequestFullscreen) {
        elem.webkitRequestFullscreen();
      } else if (elem.msRequestFullscreen) {
        elem.msRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
    }
  };

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(t => t - 1);
      }, 1000);
    } else if (isRunning && timeLeft === 0) {
      clearInterval(intervalRef.current);
      onSessionComplete();
      
      // Toggle mode
      if (mode === 'focus') {
        setMode('break');
        setTimeLeft(breakDuration * 60);
      } else {
        setMode('focus');
        setTimeLeft(focusDuration * 60);
      }
      setIsRunning(false);
    }
    
    return () => clearInterval(intervalRef.current);
  }, [isRunning, timeLeft, mode, focusDuration, breakDuration, onSessionComplete, setMode, setTimeLeft, setIsRunning]);

  const toggleTimer = () => setIsRunning(!isRunning);
  
  const resetTimer = () => {
    setIsRunning(false);
    if (mode === 'break') {
      setMode('focus');
    }
    setTimeLeft(focusDuration * 60);
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const getStatusMessage = () => {
    if (isRunning) {
      return mode === 'focus' ? "Stay with it." : "Take a short pause.";
    }
    if (timeLeft === focusDuration * 60 && mode === 'focus') {
      return "Ready for another round?";
    }
    if (timeLeft === breakDuration * 60 && mode === 'break') {
      return "Nice work.";
    }
    return "Timer paused.";
  };

  return (
    <div className="card timer-card">
      <div className="timer-header">
        <span className="mono-label">
          {mode === 'focus' ? 'FOCUS SESSION' : 'BREAK TIME'}
        </span>
        <div className="timer-actions">
          <button 
            className="settings-btn" 
            onClick={toggleFullscreen}
            title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
            aria-label={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
          >
            {isFullscreen ? <Minimize size={18} /> : <Maximize size={18} />}
          </button>
          <button className="settings-btn" onClick={onOpenSettings} title="Settings">
            <Settings size={20} />
          </button>
        </div>
      </div>
      
      <div className="timer-display">
        {formatTime(timeLeft)}
      </div>

      <div className="timer-status">
        {getStatusMessage()}
      </div>
      
      <div className="timer-controls">
        <button className="btn-primary" onClick={toggleTimer}>
          {isRunning ? 'Pause' : 'Start'}
        </button>
        <button className="btn-secondary" onClick={resetTimer} aria-label="Reset timer">
          <RotateCcw size={20} />
        </button>
      </div>

      <div className="timer-shortcuts">
        Space → Start/Pause &nbsp;•&nbsp; R → Reset
      </div>
    </div>
  );
}
