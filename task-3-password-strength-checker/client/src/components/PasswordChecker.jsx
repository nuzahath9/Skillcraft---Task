import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, Copy, RefreshCw, CheckCircle2, XCircle, Shield, History } from 'lucide-react';
import axios from 'axios';

const playSound = (type) => {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    if (type === 'type') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(400, ctx.currentTime);
      gain.gain.setValueAtTime(0.05, ctx.currentTime);
      osc.start();
      gain.gain.exponentialRampToValueAtTime(0.00001, ctx.currentTime + 0.05);
      osc.stop(ctx.currentTime + 0.05);
    } else if (type === 'generate') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(600, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.1);
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      osc.start();
      gain.gain.exponentialRampToValueAtTime(0.00001, ctx.currentTime + 0.2);
      osc.stop(ctx.currentTime + 0.2);
    }
  } catch (e) {
    // Ignore audio errors
  }
};

const PasswordChecker = () => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    const checkStrength = async () => {
      if (password === '') {
        setResult(null);
        return;
      }

      setLoading(true);
      try {
        const response = await axios.post('http://localhost:5000/api/check-password', { password });
        setResult(response.data);
      } catch (error) {
        console.error('Error checking password:', error);
        // Fallback to client-side checking if server is down
        const criteria = {
          length: password.length >= 8,
          uppercase: /[A-Z]/.test(password),
          lowercase: /[a-z]/.test(password),
          numbers: /[0-9]/.test(password),
          specialChars: /[!@#$%^&*(),.?":{}|<>]/.test(password)
        };
        let score = 0;
        if (criteria.length) score++;
        if (criteria.uppercase) score++;
        if (criteria.lowercase) score++;
        if (criteria.numbers) score++;
        if (criteria.specialChars) score++;
        
        let strength = 'Very Weak';
        let color = 'bg-red-500';
        let emoji = '🔴';
        
        if (score === 1 || (score === 2 && !criteria.length)) { strength = 'Weak'; color = 'bg-orange-500'; emoji = '🟠'; }
        else if (score === 3 || (score === 2 && criteria.length)) { strength = 'Medium'; color = 'bg-yellow-500'; emoji = '🟡'; }
        else if (score === 4) { strength = 'Strong'; color = 'bg-green-500'; emoji = '🟢'; }
        else if (score === 5) { strength = 'Very Strong'; color = 'bg-emerald-500'; emoji = '🔥'; }

        setResult({ score, strength, color, emoji, criteria, suggestions: [] });
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(() => {
      checkStrength();
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [password]);

  const generatePassword = () => {
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+~`|}{[]:;?><,./-=";
    let generatedPassword = "";
    for (let i = 0; i <= 16; i++) {
      const randomNumber = Math.floor(Math.random() * chars.length);
      generatedPassword += chars.substring(randomNumber, randomNumber + 1);
    }
    setPassword(generatedPassword);
    
    // Play sound effect
    playSound('generate');
  };

  const copyToClipboard = () => {
    if (!password) return;
    navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const addToHistory = () => {
    if (!password || !result) return;
    
    const newEntry = {
      pwd: '*'.repeat(password.length),
      strength: result.strength,
      emoji: result.emoji,
      time: new Date().toLocaleTimeString()
    };
    
    setHistory(prev => {
      const newHistory = [newEntry, ...prev];
      return newHistory.slice(0, 5); // Keep only last 5
    });
    
    setPassword('');
  };

  const criteriaList = [
    { key: 'length', label: '8+ Characters' },
    { key: 'uppercase', label: 'Uppercase Letter' },
    { key: 'lowercase', label: 'Lowercase Letter' },
    { key: 'numbers', label: 'Number' },
    { key: 'specialChars', label: 'Special Character' }
  ];

  return (
    <div className="w-full max-w-md mx-auto">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="glass-card p-8 relative overflow-hidden"
      >
        {/* Background glow effects */}
        <div className="absolute -top-20 -left-20 w-40 h-40 bg-purple-500/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-blue-500/20 rounded-full blur-3xl"></div>

        <div className="relative z-10">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold flex items-center gap-2 neon-text text-white">
              <Shield className="w-8 h-8 text-purple-400" />
              SecurePass
            </h1>
            <button 
              onClick={() => setShowHistory(!showHistory)}
              className="p-2 rounded-full hover:bg-white/10 transition-colors"
              title="History"
            >
              <History className="w-5 h-5 text-gray-400" />
            </button>
          </div>

          <div className="relative mb-6">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                // Optional: Typing sound
                playSound('type');
              }}
              placeholder="Enter your password..."
              className="w-full bg-black/30 border border-white/20 rounded-xl py-4 pl-4 pr-24 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all font-mono text-lg"
            />
            
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
              <button
                onClick={() => setShowPassword(!showPassword)}
                className="p-1.5 text-gray-400 hover:text-white transition-colors rounded-md hover:bg-white/10"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
              <button
                onClick={copyToClipboard}
                className="p-1.5 text-gray-400 hover:text-white transition-colors rounded-md hover:bg-white/10 relative group"
              >
                {copied ? <CheckCircle2 className="w-5 h-5 text-green-400" /> : <Copy className="w-5 h-5" />}
                
                {/* Tooltip */}
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                  {copied ? 'Copied!' : 'Copy'}
                </div>
              </button>
            </div>
          </div>

          {/* Controls */}
          <div className="flex gap-3 mb-6">
            <button
              onClick={generatePassword}
              className="flex-1 flex items-center justify-center gap-2 bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/50 text-purple-300 py-2.5 rounded-lg transition-all text-sm font-medium"
            >
              <RefreshCw className="w-4 h-4" />
              Generate Strong
            </button>
            <button
              onClick={() => {
                addToHistory();
              }}
              disabled={!password}
              className="flex-1 bg-white/5 hover:bg-white/10 border border-white/10 text-white py-2.5 rounded-lg transition-all text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Reset / Save
            </button>
          </div>

          {/* Strength Meter */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-400 font-medium">Strength</span>
              {result && (
                <motion.span 
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  key={result.strength}
                  className={`text-sm font-bold flex items-center gap-1 ${
                    result.score <= 2 ? 'text-red-400' : 
                    result.score === 3 ? 'text-yellow-400' : 
                    'text-green-400'
                  }`}
                >
                  {result.strength} {result.emoji}
                </motion.span>
              )}
            </div>
            
            <div className="h-2 w-full bg-gray-800 rounded-full overflow-hidden flex gap-1">
              {[1, 2, 3, 4, 5].map((level) => {
                // Determine the background color class based on the result score
                let bgClass = 'bg-gray-800'; // Default empty color
                if (result && level <= result.score) {
                  if (result.score <= 2) bgClass = 'bg-red-500';
                  else if (result.score === 3) bgClass = 'bg-yellow-500';
                  else if (result.score === 4) bgClass = 'bg-green-500';
                  else if (result.score === 5) bgClass = 'bg-emerald-500';
                }

                return (
                  <motion.div
                    key={level}
                    className={`h-full flex-1 rounded-full ${bgClass}`}
                    initial={{ opacity: 0 }}
                    animate={{ 
                      opacity: result && level <= result.score ? 1 : 0.2,
                    }}
                    transition={{ duration: 0.3, delay: level * 0.05 }}
                  />
                );
              })}
            </div>
          </div>

          {/* Criteria Checklist */}
          <div className="space-y-3 mb-6 bg-black/20 p-4 rounded-xl border border-white/5">
            <h3 className="text-sm font-medium text-gray-400 mb-3">Requirements</h3>
            <div className="grid grid-cols-2 gap-3">
              {criteriaList.map((item) => {
                const isMet = result?.criteria?.[item.key];
                return (
                  <div key={item.key} className="flex items-center gap-2 text-sm">
                    {isMet ? (
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                    ) : (
                      <XCircle className="w-4 h-4 text-gray-600" />
                    )}
                    <span className={isMet ? 'text-gray-200' : 'text-gray-500'}>
                      {item.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Suggestions */}
          <AnimatePresence>
            {result?.suggestions?.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="bg-orange-500/10 border border-orange-500/20 rounded-xl p-4 mb-4">
                  <h4 className="text-orange-400 text-sm font-semibold mb-2">Suggestions to improve:</h4>
                  <ul className="list-disc list-inside text-xs text-orange-200/70 space-y-1">
                    {result.suggestions.map((sug, i) => (
                      <li key={i}>{sug}</li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* History Panel */}
          <AnimatePresence>
            {showHistory && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden mt-4"
              >
                <div className="bg-black/30 border border-white/10 rounded-xl p-4">
                  <h4 className="text-gray-300 text-sm font-semibold mb-3">Recent Checks</h4>
                  {history.length === 0 ? (
                    <p className="text-xs text-gray-500 italic">No history yet.</p>
                  ) : (
                    <div className="space-y-2">
                      {history.map((item, i) => (
                        <div key={i} className="flex justify-between items-center text-xs bg-white/5 p-2 rounded">
                          <span className="font-mono text-gray-400">{item.pwd}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-gray-300">{item.strength} {item.emoji}</span>
                            <span className="text-gray-600 text-[10px]">{item.time}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </motion.div>
    </div>
  );
};

export default PasswordChecker;
