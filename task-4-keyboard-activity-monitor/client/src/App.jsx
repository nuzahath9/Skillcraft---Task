import React, { useState, useEffect, useRef } from 'react';
import VirtualKeyboard from './components/VirtualKeyboard';
import LogPanel from './components/LogPanel';
import Controls from './components/Controls';
import Stats from './components/Stats';
import TypingArea from './components/TypingArea';
import { Keyboard } from 'lucide-react';

function App() {
  const [isLogging, setIsLogging] = useState(false);
  const [logs, setLogs] = useState([]);
  const [activeKeys, setActiveKeys] = useState(new Set());
  const [keyHeatmap, setKeyHeatmap] = useState({});
  const [startTime, setStartTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [wpm, setWpm] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const typingAreaRef = useRef(null);

  // Timer effect
  useEffect(() => {
    let interval;
    if (isLogging && startTime) {
      interval = setInterval(() => {
        const currentElapsed = Math.floor((Date.now() - startTime) / 1000);
        setElapsedTime(currentElapsed);
        
        // Calculate WPM
        if (currentElapsed > 0) {
          const words = charCount / 5; // Standard WPM calculation (5 chars = 1 word)
          const minutes = currentElapsed / 60;
          setWpm(Math.round(words / minutes));
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isLogging, startTime, charCount]);

  const handleKeyDown = (e) => {
    if (!isLogging) return;

    const key = e.key;
    
    // Update active keys for visual feedback
    setActiveKeys(prev => {
      const newSet = new Set(prev);
      newSet.add(e.code);
      return newSet;
    });

    // Update heatmap
    setKeyHeatmap(prev => ({
      ...prev,
      [e.code]: (prev[e.code] || 0) + 1
    }));

    // Add to logs
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [...prev, { key, code: e.code, timestamp }]);
    
    // Update char count for WPM
    if (key.length === 1) { // Only count printable characters
      setCharCount(prev => prev + 1);
    }
  };

  const handleKeyUp = (e) => {
    setActiveKeys(prev => {
      const newSet = new Set(prev);
      newSet.delete(e.code);
      return newSet;
    });
  };

  const toggleLogging = () => {
    if (!isLogging) {
      setStartTime(Date.now());
      setIsLogging(true);
      if (typingAreaRef.current) {
        typingAreaRef.current.focus();
      }
    } else {
      setIsLogging(false);
    }
  };

  const resetLogs = () => {
    setLogs([]);
    setKeyHeatmap({});
    setCharCount(0);
    setWpm(0);
    setElapsedTime(0);
    setStartTime(isLogging ? Date.now() : null);
  };

  const saveLogToServer = async () => {
    if (logs.length === 0) return alert('No logs to save!');
    
    const logText = logs.map(l => `[${l.timestamp}] ${l.key}`).join('\n');
    try {
      const response = await fetch('http://localhost:5000/save-log', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ logs: logText }),
      });
      if (response.ok) {
        alert('Logs saved successfully to the server!');
      } else {
        alert('Failed to save logs to server.');
      }
    } catch (error) {
      console.error('Error saving logs:', error);
      alert('Error connecting to backend server.');
    }
  };

  return (
    <div className="min-h-screen p-6 flex flex-col items-center">
      <header className="w-full max-w-6xl flex justify-between items-center mb-8 glass-panel p-4 rounded-2xl">
        <div className="flex items-center gap-3">
          <Keyboard className="w-8 h-8 text-neon-blue" />
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-neon-purple to-neon-blue">
            KeyTrack ⚡
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${isLogging ? 'bg-red-500 animate-pulse shadow-[0_0_10px_red]' : 'bg-gray-500'}`}></div>
            <span className="text-sm font-medium">{isLogging ? 'Recording...' : 'Stopped'}</span>
          </div>
          <Controls 
            isLogging={isLogging} 
            toggleLogging={toggleLogging} 
            resetLogs={resetLogs} 
            saveLogToServer={saveLogToServer}
            logs={logs}
          />
        </div>
      </header>

      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-panel rounded-2xl p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <span className="text-neon-blue">⌨️</span> Active Typing Area
            </h2>
            <TypingArea 
              isLogging={isLogging}
              handleKeyDown={handleKeyDown}
              handleKeyUp={handleKeyUp}
              ref={typingAreaRef}
            />
            <p className="text-xs text-gray-400 mt-2 text-center">
              ⚠️ Keystrokes are only captured when you type inside the box above.
            </p>
          </div>

          <div className="glass-panel rounded-2xl p-6 overflow-x-auto">
            <VirtualKeyboard activeKeys={activeKeys} heatmap={keyHeatmap} />
          </div>
        </div>

        <div className="space-y-6">
          <Stats wpm={wpm} elapsedTime={elapsedTime} totalKeys={logs.length} />
          <LogPanel logs={logs} />
        </div>
      </div>
    </div>
  );
}

export default App;
