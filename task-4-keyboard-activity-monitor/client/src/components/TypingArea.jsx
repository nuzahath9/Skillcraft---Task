import React, { forwardRef, useState } from 'react';

const TypingArea = forwardRef(({ isLogging, handleKeyDown, handleKeyUp }, ref) => {
  const [text, setText] = useState('');

  return (
    <textarea
      ref={ref}
      value={text}
      onChange={(e) => setText(e.target.value)}
      onKeyDown={handleKeyDown}
      onKeyUp={handleKeyUp}
      disabled={!isLogging}
      placeholder={isLogging ? "Start typing here to monitor keystrokes..." : "Click 'Start Logging' to enable typing..."}
      className={`w-full h-32 p-4 rounded-xl bg-[#0b0c10] border-2 transition-all duration-300 resize-none font-mono focus:outline-none
        ${isLogging 
          ? 'border-neon-purple shadow-[0_0_15px_rgba(176,38,255,0.3)] text-gray-200' 
          : 'border-gray-700 text-gray-500 cursor-not-allowed'
        }`}
    />
  );
});

TypingArea.displayName = 'TypingArea';

export default TypingArea;
