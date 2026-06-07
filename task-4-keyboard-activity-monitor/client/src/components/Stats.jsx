import React from 'react';
import { Timer, Activity, Type } from 'lucide-react';

const Stats = ({ wpm, elapsedTime, totalKeys }) => {
  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <div className="glass-panel rounded-2xl p-6">
      <h2 className="text-xl font-semibold mb-4 text-neon-blue flex items-center gap-2">
        <Activity size={20} /> Session Stats
      </h2>
      
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-[#0b0c10] p-3 rounded-xl border border-gray-800 text-center">
          <div className="text-gray-400 text-xs mb-1 flex items-center justify-center gap-1">
            <Timer size={12} /> Time
          </div>
          <div className="text-xl font-mono text-neon-blue">{formatTime(elapsedTime)}</div>
        </div>
        
        <div className="bg-[#0b0c10] p-3 rounded-xl border border-gray-800 text-center">
          <div className="text-gray-400 text-xs mb-1 flex items-center justify-center gap-1">
            <Type size={12} /> WPM
          </div>
          <div className="text-xl font-mono text-neon-purple">{wpm}</div>
        </div>

        <div className="bg-[#0b0c10] p-3 rounded-xl border border-gray-800 text-center">
          <div className="text-gray-400 text-xs mb-1 flex items-center justify-center gap-1">
            <Activity size={12} /> Keys
          </div>
          <div className="text-xl font-mono text-green-400">{totalKeys}</div>
        </div>
      </div>
    </div>
  );
};

export default Stats;
