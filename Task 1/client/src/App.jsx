import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Toaster, toast } from 'react-hot-toast';
import { Copy, RotateCcw, Lock, Unlock, History, Moon, Sun, ArrowDownUp, Fingerprint } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

function App() {
  const [message, setMessage] = useState('');
  const [shift, setShift] = useState(3);
  const [result, setResult] = useState('');
  const [isEncryptMode, setIsEncryptMode] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const [isDarkMode, setIsDarkMode] = useState(true);

  // Load history & theme from local storage
  useEffect(() => {
    const savedHistory = JSON.parse(localStorage.getItem('cipherHistory')) || [];
    setHistory(savedHistory);
    
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
      setIsDarkMode(false);
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    if (newTheme) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  const saveToHistory = (item) => {
    const newHistory = [item, ...history].slice(0, 5); // Keep last 5
    setHistory(newHistory);
    localStorage.setItem('cipherHistory', JSON.stringify(newHistory));
  };

  const handleProcess = async () => {
    if (!message.trim()) {
      toast.error('Please enter a message.');
      return;
    }
    if (shift === '' || isNaN(parseInt(shift))) {
      toast.error('Please enter a valid shift number.');
      return;
    }

    setIsLoading(true);
    try {
      const endpoint = isEncryptMode ? '/encrypt' : '/decrypt';
      const response = await axios.post(`${API_URL}${endpoint}`, {
        message,
        shift: parseInt(shift, 10)
      });
      
      const newResult = response.data.result;
      setResult(newResult);
      toast.success(isEncryptMode ? 'Message Encrypted!' : 'Message Decrypted!');
      
      saveToHistory({
        mode: isEncryptMode ? 'Encrypt' : 'Decrypt',
        original: message,
        result: newResult,
        shift: parseInt(shift, 10),
        id: Date.now()
      });
    } catch (error) {
      toast.error(error.response?.data?.error || 'An error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      handleProcess();
    }
  };

  const handleCopy = () => {
    if (!result) return;
    navigator.clipboard.writeText(result);
    toast.success('Copied to clipboard!');
  };

  const handleReset = () => {
    setMessage('');
    setShift(3);
    setResult('');
    toast('Fields cleared', { icon: '🗑️' });
  };

  const toggleMode = () => {
    setIsEncryptMode(!isEncryptMode);
    if (result && message) {
      setMessage(result);
      setResult(message);
    }
  };

  return (
    <div className={`min-h-screen transition-all duration-500 font-sans selection:bg-orange-500 selection:text-white ${
      isDarkMode 
        ? 'bg-[#110c08] text-orange-50' 
        : 'bg-[#fcfaf8] text-stone-900'
    }`}>
      <Toaster 
        position="bottom-right" 
        toastOptions={{
          className: isDarkMode ? '!bg-stone-900 !text-orange-50 !border-2 !border-stone-800' : '!bg-white !text-stone-900 !border-2 !border-stone-100',
          style: { borderRadius: '12px', padding: '16px', boxShadow: '0 10px 30px -10px rgba(249, 115, 22, 0.3)' }
        }} 
      />
      
      {/* Dynamic Background Patterns */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className={`absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full blur-[120px] opacity-20 ${isDarkMode ? 'bg-orange-600' : 'bg-orange-300'}`}></div>
        <div className={`absolute top-[60%] -right-[10%] w-[40%] h-[60%] rounded-full blur-[150px] opacity-20 ${isDarkMode ? 'bg-rose-600' : 'bg-rose-300'}`}></div>
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Navigation Bar */}
        <nav className={`w-full py-5 px-6 lg:px-12 flex justify-between items-center border-b ${isDarkMode ? 'border-stone-800/50 bg-[#110c08]/80' : 'border-stone-200 bg-white/80'} backdrop-blur-lg sticky top-0 z-50`}>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-tr from-orange-500 to-rose-500 rounded-lg shadow-lg shadow-orange-500/20">
              <Fingerprint className="text-white" size={24} />
            </div>
            <span className="text-2xl font-black tracking-tighter uppercase flex items-center">
              Cipher<span className="text-orange-500 ml-1">X</span>
            </span>
          </div>
          
          <button 
            onClick={toggleTheme}
            className={`p-2.5 rounded-full transition-all duration-300 hover:scale-110 ${
              isDarkMode 
                ? 'bg-stone-800 text-orange-400 hover:bg-stone-700' 
                : 'bg-stone-100 text-orange-500 hover:bg-stone-200'
            }`}
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </nav>

        {/* Main Dashboard Layout */}
        <main className="flex-grow w-full max-w-[1400px] mx-auto p-4 sm:p-6 lg:p-8 flex flex-col lg:flex-row gap-6 lg:gap-8 items-start pt-8 lg:pt-12">
          
          {/* Left Column - Controls & Input */}
          <div className="w-full lg:w-7/12 xl:w-2/3 flex flex-col gap-6">
            
            {/* Action Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2">
              <div>
                <h2 className="text-3xl lg:text-4xl font-black tracking-tight mb-1">
                  {isEncryptMode ? 'Secure Your Data' : 'Reveal Message'}
                </h2>
                <p className={`text-sm ${isDarkMode ? 'text-stone-400' : 'text-stone-500'}`}>
                  Advanced Caesar cipher encryption engine
                </p>
              </div>
              
              {/* Pill Toggle Switch */}
              <div className={`flex p-1.5 rounded-full ${isDarkMode ? 'bg-stone-900 border border-stone-800' : 'bg-stone-100 border border-stone-200'}`}>
                <button
                  onClick={() => setIsEncryptMode(true)}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold transition-all ${
                    isEncryptMode 
                      ? 'bg-orange-500 text-white shadow-md' 
                      : 'text-stone-500 hover:text-stone-700 dark:text-stone-400 dark:hover:text-stone-200'
                  }`}
                >
                  <Lock size={16} /> Encrypt
                </button>
                <button
                  onClick={() => setIsEncryptMode(false)}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold transition-all ${
                    !isEncryptMode 
                      ? 'bg-rose-500 text-white shadow-md' 
                      : 'text-stone-500 hover:text-stone-700 dark:text-stone-400 dark:hover:text-stone-200'
                  }`}
                >
                  <Unlock size={16} /> Decrypt
                </button>
              </div>
            </div>

            {/* Main Interactive Box */}
            <div className={`relative rounded-3xl overflow-hidden border ${isDarkMode ? 'bg-stone-900/40 border-stone-800' : 'bg-white border-stone-200'} shadow-2xl shadow-orange-900/5`}>
              
              {/* Input Area */}
              <div className="p-6 lg:p-8">
                <div className="flex justify-between items-center mb-4">
                  <label className={`text-xs font-bold uppercase tracking-widest ${isDarkMode ? 'text-stone-400' : 'text-stone-500'}`}>
                    Input Text
                  </label>
                  <span className={`text-[10px] font-mono px-2 py-1 rounded ${isDarkMode ? 'bg-stone-800 text-stone-400' : 'bg-stone-100 text-stone-500'}`}>
                    ⌘ + ENTER
                  </span>
                </div>
                
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type your message here..."
                  className={`w-full text-lg lg:text-xl font-medium bg-transparent border-none focus:ring-0 resize-none h-32 placeholder:opacity-30 ${isDarkMode ? 'text-stone-100' : 'text-stone-800'}`}
                />
              </div>

              {/* Middle Action Bar */}
              <div className={`flex items-center justify-between px-6 py-4 border-y ${isDarkMode ? 'border-stone-800 bg-stone-900/80' : 'border-stone-100 bg-stone-50/80'}`}>
                
                <div className="flex items-center gap-4">
                  <div className="flex flex-col">
                    <label className={`text-[10px] font-bold uppercase tracking-widest mb-1 ${isDarkMode ? 'text-stone-400' : 'text-stone-500'}`}>
                      Shift Offset
                    </label>
                    <div className={`flex items-center rounded-lg border overflow-hidden ${isDarkMode ? 'border-stone-700 bg-stone-950' : 'border-stone-200 bg-white'}`}>
                      <button onClick={() => setShift(s => Math.max(1, parseInt(s)-1))} className={`px-3 py-2 hover:bg-orange-500 hover:text-white transition-colors ${isDarkMode ? 'text-stone-400' : 'text-stone-600'}`}>-</button>
                      <input
                        type="number"
                        value={shift}
                        onChange={(e) => setShift(e.target.value)}
                        className="w-12 text-center bg-transparent border-none focus:ring-0 font-bold text-sm p-0 m-0 [-moz-appearance:_textfield] [&::-webkit-inner-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none"
                      />
                      <button onClick={() => setShift(s => parseInt(s)+1)} className={`px-3 py-2 hover:bg-orange-500 hover:text-white transition-colors ${isDarkMode ? 'text-stone-400' : 'text-stone-600'}`}>+</button>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={handleReset}
                    className={`p-2.5 rounded-full transition-colors ${isDarkMode ? 'text-stone-400 hover:bg-stone-800 hover:text-white' : 'text-stone-500 hover:bg-stone-200 hover:text-stone-900'}`}
                    title="Clear All"
                  >
                    <RotateCcw size={18} />
                  </button>
                  <button
                    onClick={toggleMode}
                    className={`p-2.5 rounded-full transition-colors ${isDarkMode ? 'text-stone-400 hover:bg-stone-800 hover:text-white' : 'text-stone-500 hover:bg-stone-200 hover:text-stone-900'}`}
                    title="Swap Content"
                  >
                    <ArrowDownUp size={18} />
                  </button>
                </div>
              </div>

              {/* Output Area */}
              <div className="p-6 lg:p-8 relative min-h-[160px] flex flex-col">
                <div className="flex justify-between items-center mb-4">
                  <label className={`text-xs font-bold uppercase tracking-widest ${isDarkMode ? 'text-stone-400' : 'text-stone-500'}`}>
                    Result Output
                  </label>
                  {result && (
                    <button
                      onClick={handleCopy}
                      className={`flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full transition-colors ${
                        isDarkMode ? 'bg-orange-500/10 text-orange-400 hover:bg-orange-500/20' : 'bg-orange-100 text-orange-600 hover:bg-orange-200'
                      }`}
                    >
                      <Copy size={14} /> Copy
                    </button>
                  )}
                </div>
                
                <div className={`flex-grow text-lg lg:text-xl font-medium break-words ${!result && 'opacity-30'}`}>
                  {result || 'Output will appear here...'}
                </div>
              </div>

              {/* Big Action Button Overlay */}
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none hidden md:block">
                <button
                  onClick={handleProcess}
                  disabled={isLoading}
                  className={`pointer-events-auto flex items-center justify-center w-16 h-16 rounded-full shadow-2xl transition-transform hover:scale-110 active:scale-95 ${
                    isEncryptMode ? 'bg-gradient-to-br from-orange-400 to-orange-600 shadow-orange-500/40' : 'bg-gradient-to-br from-rose-400 to-rose-600 shadow-rose-500/40'
                  } text-white`}
                >
                  {isLoading ? <RotateCcw size={24} className="animate-spin" /> : isEncryptMode ? <Lock size={24} /> : <Unlock size={24} />}
                </button>
              </div>

            </div>
            
            {/* Mobile Action Button */}
            <button
              onClick={handleProcess}
              disabled={isLoading}
              className={`md:hidden w-full py-4 rounded-2xl font-black text-lg text-white shadow-xl transition-transform active:scale-95 flex justify-center items-center gap-2 ${
                isEncryptMode ? 'bg-gradient-to-r from-orange-500 to-orange-600 shadow-orange-500/30' : 'bg-gradient-to-r from-rose-500 to-rose-600 shadow-rose-500/30'
              }`}
            >
              {isLoading ? <RotateCcw size={20} className="animate-spin" /> : isEncryptMode ? <Lock size={20} /> : <Unlock size={20} />}
              {isEncryptMode ? 'ENCRYPT' : 'DECRYPT'}
            </button>

          </div>

          {/* Right Column - History Feed */}
          <div className="w-full lg:w-5/12 xl:w-1/3 flex flex-col h-[600px] lg:h-[calc(100vh-140px)]">
            <div className={`flex-grow flex flex-col rounded-3xl border overflow-hidden ${isDarkMode ? 'bg-[#1a1410] border-stone-800' : 'bg-stone-50 border-stone-200'}`}>
              
              <div className="p-6 border-b flex justify-between items-center border-stone-200 dark:border-stone-800">
                <div className="flex items-center gap-3">
                  <History className={isDarkMode ? 'text-orange-500' : 'text-orange-600'} size={20} />
                  <h3 className="font-bold tracking-wide">Activity Log</h3>
                </div>
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${isDarkMode ? 'bg-stone-800 text-stone-400' : 'bg-stone-200 text-stone-500'}`}>
                  {history.length} / 5
                </span>
              </div>

              <div className="flex-grow overflow-y-auto p-4 custom-scrollbar">
                {history.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center opacity-40">
                    <History size={40} className="mb-3" strokeWidth={1.5} />
                    <p className="text-sm font-medium">No activity yet</p>
                    <p className="text-xs mt-1">Your encrypted messages will appear here</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {history.map((item) => (
                      <div 
                        key={item.id} 
                        className={`p-5 rounded-2xl border transition-all ${
                          isDarkMode 
                            ? 'bg-stone-900 border-stone-800 hover:border-orange-900/50' 
                            : 'bg-white border-stone-100 hover:border-orange-200 shadow-sm'
                        }`}
                      >
                        <div className="flex justify-between items-center mb-4">
                          <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded flex items-center gap-1 ${
                            item.mode === 'Encrypt' 
                              ? (isDarkMode ? 'bg-orange-500/20 text-orange-400' : 'bg-orange-100 text-orange-600')
                              : (isDarkMode ? 'bg-rose-500/20 text-rose-400' : 'bg-rose-100 text-rose-600')
                          }`}>
                            {item.mode === 'Encrypt' ? <Lock size={10} /> : <Unlock size={10} />}
                            {item.mode}
                          </span>
                          <span className={`text-[10px] font-mono font-bold ${isDarkMode ? 'text-stone-500' : 'text-stone-400'}`}>
                            SHIFT: {item.shift}
                          </span>
                        </div>
                        
                        <div className="space-y-3">
                          <div>
                            <p className={`text-[10px] font-bold uppercase tracking-widest mb-1 ${isDarkMode ? 'text-stone-500' : 'text-stone-400'}`}>Input</p>
                            <p className="text-sm font-medium line-clamp-2">{item.original}</p>
                          </div>
                          <div>
                            <p className={`text-[10px] font-bold uppercase tracking-widest mb-1 ${isDarkMode ? 'text-stone-500' : 'text-stone-400'}`}>Output</p>
                            <p className="text-sm font-bold line-clamp-2 text-orange-500">{item.result}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {history.length > 0 && (
                <div className="p-4 border-t border-stone-200 dark:border-stone-800 bg-inherit">
                  <button 
                    onClick={() => setHistory([])}
                    className={`w-full py-3 rounded-xl text-sm font-bold uppercase tracking-wider transition-colors ${
                      isDarkMode 
                        ? 'text-stone-500 hover:bg-stone-900 hover:text-stone-300' 
                        : 'text-stone-400 hover:bg-stone-100 hover:text-stone-600'
                    }`}
                  >
                    Clear History
                  </button>
                </div>
              )}
            </div>
          </div>

        </main>
      </div>
    </div>
  );
}

export default App;
