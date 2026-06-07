import React from 'react';

const VirtualKeyboard = ({ activeKeys, heatmap }) => {
  const layout = [
    [
      { label: '`', code: 'Backquote' }, { label: '1', code: 'Digit1' }, { label: '2', code: 'Digit2' },
      { label: '3', code: 'Digit3' }, { label: '4', code: 'Digit4' }, { label: '5', code: 'Digit5' },
      { label: '6', code: 'Digit6' }, { label: '7', code: 'Digit7' }, { label: '8', code: 'Digit8' },
      { label: '9', code: 'Digit9' }, { label: '0', code: 'Digit0' }, { label: '-', code: 'Minus' },
      { label: '=', code: 'Equal' }, { label: 'Backspace', code: 'Backspace', w: 'w-24' }
    ],
    [
      { label: 'Tab', code: 'Tab', w: 'w-16' }, { label: 'Q', code: 'KeyQ' }, { label: 'W', code: 'KeyW' },
      { label: 'E', code: 'KeyE' }, { label: 'R', code: 'KeyR' }, { label: 'T', code: 'KeyT' },
      { label: 'Y', code: 'KeyY' }, { label: 'U', code: 'KeyU' }, { label: 'I', code: 'KeyI' },
      { label: 'O', code: 'KeyO' }, { label: 'P', code: 'KeyP' }, { label: '[', code: 'BracketLeft' },
      { label: ']', code: 'BracketRight' }, { label: '\\', code: 'Backslash', w: 'w-16' }
    ],
    [
      { label: 'Caps Lock', code: 'CapsLock', w: 'w-20' }, { label: 'A', code: 'KeyA' }, { label: 'S', code: 'KeyS' },
      { label: 'D', code: 'KeyD' }, { label: 'F', code: 'KeyF' }, { label: 'G', code: 'KeyG' },
      { label: 'H', code: 'KeyH' }, { label: 'J', code: 'KeyJ' }, { label: 'K', code: 'KeyK' },
      { label: 'L', code: 'KeyL' }, { label: ';', code: 'Semicolon' }, { label: "'", code: 'Quote' },
      { label: 'Enter', code: 'Enter', w: 'w-20' }
    ],
    [
      { label: 'Shift', code: 'ShiftLeft', w: 'w-28' }, { label: 'Z', code: 'KeyZ' }, { label: 'X', code: 'KeyX' },
      { label: 'C', code: 'KeyC' }, { label: 'V', code: 'KeyV' }, { label: 'B', code: 'KeyB' },
      { label: 'N', code: 'KeyN' }, { label: 'M', code: 'KeyM' }, { label: ',', code: 'Comma' },
      { label: '.', code: 'Period' }, { label: '/', code: 'Slash' }, { label: 'Shift', code: 'ShiftRight', w: 'w-28' }
    ],
    [
      { label: 'Ctrl', code: 'ControlLeft', w: 'w-16' }, { label: 'Win', code: 'MetaLeft', w: 'w-16' },
      { label: 'Alt', code: 'AltLeft', w: 'w-16' }, { label: 'Space', code: 'Space', w: 'flex-1' },
      { label: 'Alt', code: 'AltRight', w: 'w-16' }, { label: 'Win', code: 'MetaRight', w: 'w-16' },
      { label: 'Ctrl', code: 'ControlRight', w: 'w-16' }
    ]
  ];

  // Helper to get heatmap color based on count
  const getHeatmapStyle = (count) => {
    if (!count) return {};
    // Simple heatmap logic: more count = redder/brighter background
    const maxCount = Math.max(...Object.values(heatmap), 1);
    const intensity = Math.min(count / maxCount, 1);
    
    // Using an rgba color for heatmap
    return {
      backgroundColor: `rgba(255, 0, 127, ${intensity * 0.8})`,
      borderColor: `rgba(255, 0, 127, ${intensity})`
    };
  };

  return (
    <div className="flex flex-col gap-2 min-w-[700px]">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-sm text-gray-400 font-semibold">Virtual Keyboard & Heatmap</h3>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <span>Cold</span>
          <div className="w-16 h-2 bg-gradient-to-r from-transparent to-neon-pink rounded"></div>
          <span>Hot</span>
        </div>
      </div>
      
      {layout.map((row, rowIndex) => (
        <div key={rowIndex} className="flex gap-2">
          {row.map((key) => {
            const isPressed = activeKeys.has(key.code);
            const count = heatmap[key.code] || 0;
            const heatmapStyle = !isPressed ? getHeatmapStyle(count) : {};
            
            return (
              <div
                key={key.code}
                style={heatmapStyle}
                className={`
                  h-12 flex items-center justify-center rounded-lg text-sm font-medium border border-gray-700
                  transition-all duration-100 bg-[#0b0c10] shadow-sm
                  ${key.w || 'w-12'} 
                  ${isPressed ? 'key-pressed' : 'text-gray-400'}
                `}
              >
                {key.label}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default VirtualKeyboard;
