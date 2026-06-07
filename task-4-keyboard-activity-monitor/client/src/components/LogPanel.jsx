import React, { useEffect, useRef } from 'react';
import { Terminal, Copy } from 'lucide-react';

const LogPanel = ({ logs }) => {
  const endRef = useRef(null);

  // Auto-scroll to bottom
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const copyLogs = () => {
    const text = logs.map(l => `[${l.timestamp}] ${l.key}`).join('\n');
    navigator.clipboard.writeText(text);
    alert('Logs copied to clipboard!');
  };

  return (
    <div className="glass-panel rounded-2xl p-6 flex flex-col h-[400px]">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-neon-purple flex items-center gap-2">
          <Terminal size={20} /> Live Log
        </h2>
        <button 
          onClick={copyLogs}
          className="text-gray-400 hover:text-white transition-colors"
          title="Copy Logs"
        >
          <Copy size={16} />
        </button>
      </div>
      
      <div className="flex-1 bg-[#0b0c10] rounded-xl p-4 overflow-y-auto border border-gray-800 font-mono text-sm">
        {logs.length === 0 ? (
          <div className="text-gray-600 h-full flex items-center justify-center italic">
            Waiting for keystrokes...
          </div>
        ) : (
          <ul className="space-y-1">
            {logs.map((log, index) => (
              <li key={index} className="flex gap-4">
                <span className="text-gray-500">[{log.timestamp}]</span>
                <span className="text-neon-blue font-bold w-24">Key: {log.key === ' ' ? 'Space' : log.key}</span>
                <span className="text-gray-400 text-xs mt-0.5">Code: {log.code}</span>
              </li>
            ))}
            <div ref={endRef} />
          </ul>
        )}
      </div>
    </div>
  );
};

export default LogPanel;
