import React from 'react';
import { Play, Square, Trash2, Download, Save } from 'lucide-react';

const Controls = ({ isLogging, toggleLogging, resetLogs, saveLogToServer, logs }) => {
  
  const downloadLogFile = () => {
    if (logs.length === 0) return alert('No logs to download!');
    
    const logText = logs.map(l => `[${l.timestamp}] ${l.key}`).join('\n');
    const blob = new Blob([logText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `keytrack_log_${new Date().toISOString().slice(0, 10)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex gap-2">
      <button
        onClick={toggleLogging}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
          isLogging 
            ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/50' 
            : 'bg-neon-purple/20 text-neon-purple hover:bg-neon-purple/30 border border-neon-purple/50'
        }`}
      >
        {isLogging ? <Square size={16} /> : <Play size={16} />}
        {isLogging ? 'Stop Logging' : 'Start Logging'}
      </button>

      <button
        onClick={resetLogs}
        className="flex items-center gap-2 px-3 py-2 rounded-lg font-medium bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-600 transition-all"
        title="Clear Logs"
      >
        <Trash2 size={16} />
      </button>

      <button
        onClick={downloadLogFile}
        className="flex items-center gap-2 px-3 py-2 rounded-lg font-medium bg-neon-blue/20 text-neon-blue hover:bg-neon-blue/30 border border-neon-blue/50 transition-all"
        title="Download Logs"
      >
        <Download size={16} />
      </button>

      <button
        onClick={saveLogToServer}
        className="flex items-center gap-2 px-3 py-2 rounded-lg font-medium bg-green-500/20 text-green-400 hover:bg-green-500/30 border border-green-500/50 transition-all"
        title="Save to Server"
      >
        <Save size={16} />
      </button>
    </div>
  );
};

export default Controls;
