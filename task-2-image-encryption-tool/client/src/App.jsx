import React, { useState, useCallback, useRef } from 'react';
import axios from 'axios';
import { useDropzone } from 'react-dropzone';
import { Toaster, toast } from 'react-hot-toast';
import { Lock, Unlock, Upload, Download, RefreshCw, Copy, Shield, Terminal, Image as ImageIcon } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

function App() {
  const [file, setFile] = useState(null);
  const [originalUrl, setOriginalUrl] = useState('');
  const [processedUrl, setProcessedUrl] = useState('');
  
  const [key, setKey] = useState('');
  const [method, setMethod] = useState('math'); // 'math' or 'swap'
  const [action, setAction] = useState('encrypt'); // 'encrypt' or 'decrypt'
  
  const [isLoading, setIsLoading] = useState(false);
  const [sliderPosition, setSliderPosition] = useState(50);
  
  const sliderRef = useRef(null);

  const onDrop = useCallback((acceptedFiles) => {
    const selectedFile = acceptedFiles[0];
    if (selectedFile) {
      setFile(selectedFile);
      setOriginalUrl(URL.createObjectURL(selectedFile));
      setProcessedUrl(''); 
      setSliderPosition(50);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png']
    },
    maxFiles: 1
  });

  const handleProcess = async () => {
    if (!file) {
      toast.error('SYS_ERR: NO_IMAGE_FOUND');
      return;
    }
    if (!key) {
      toast.error('SYS_ERR: MISSING_ENCRYPTION_KEY');
      return;
    }

    setIsLoading(true);
    const formData = new FormData();
    formData.append('image', file);
    formData.append('key', key);
    formData.append('method', method);
    formData.append('action', action);

    try {
      const response = await axios.post(`${API_URL}/process-image`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      setProcessedUrl(response.data.resultImage);
      toast.success(`SYS_MSG: ${action.toUpperCase()}ION_COMPLETE`);
    } catch (error) {
      toast.error('SYS_ERR: PROCESSING_FAILED');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    if (!processedUrl) return;
    const link = document.createElement('a');
    link.href = processedUrl;
    link.download = `SECURE_${action.toUpperCase()}_${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('SYS_MSG: DATA_DOWNLOADED');
  };

  const handleReset = () => {
    setFile(null);
    setOriginalUrl('');
    setProcessedUrl('');
    setKey('');
    setSliderPosition(50);
    toast('SYS_MSG: SYSTEM_RESET', { icon: '🔄' });
  };

  const handleSliderMove = (e) => {
    if (!sliderRef.current) return;
    const rect = sliderRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    const percentage = (x / rect.width) * 100;
    setSliderPosition(percentage);
  };

  const copyKey = () => {
    if (!key) return;
    navigator.clipboard.writeText(key);
    toast.success('SYS_MSG: KEY_COPIED');
  };

  return (
    <div className="min-h-screen relative bg-cyber-dark text-slate-200 overflow-hidden font-mono">
      <Toaster 
        position="bottom-left" 
        toastOptions={{
          className: '!bg-[#0a192f] !text-[#00f0ff] !border !border-[#00f0ff]/50 !font-mono !text-xs !tracking-wider',
          style: { borderRadius: '0', boxShadow: '0 0 10px rgba(0, 240, 255, 0.2)' }
        }} 
      />

      <div className="relative z-10 container mx-auto px-4 py-8 max-w-[1400px]">
        
        {/* Cyberpunk Header */}
        <header className="flex flex-col md:flex-row justify-between items-end md:items-center mb-8 pb-4 border-b border-cyber-blue/30">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <Shield className="text-cyber-green w-8 h-8" />
              <h1 className="text-4xl font-black tracking-tighter uppercase cyber-glitch-text text-white">
                PixelCrypt<span className="text-cyber-blue">_OS</span>
              </h1>
            </div>
            <p className="text-xs text-cyber-blue/70 tracking-[0.2em] uppercase ml-11">
              v2.0 // Visual Data Encryption Protocol
            </p>
          </div>
          
          <div className="mt-4 md:mt-0 flex items-center gap-2 text-xs font-bold bg-cyber-panel border border-cyber-blue/30 px-4 py-2 text-cyber-blue">
            <span className="animate-pulse w-2 h-2 bg-cyber-green rounded-full"></span>
            SYSTEM: ONLINE
          </div>
        </header>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          
          {/* Left Column - Controls */}
          <div className="xl:col-span-4 flex flex-col gap-6">
            
            {/* Control Panel */}
            <div className="cyber-panel p-6 flex flex-col gap-6">
              <div className="flex items-center gap-2 mb-2 border-b border-cyber-blue/20 pb-2">
                <Terminal size={16} className="text-cyber-blue" />
                <h2 className="text-sm font-bold uppercase tracking-widest text-cyber-blue">Control Module</h2>
              </div>

              {/* Upload Dropzone */}
              <div 
                {...getRootProps()} 
                className={`border-2 border-dashed p-6 text-center cursor-pointer transition-all duration-300 bg-cyber-dark/50 hover:bg-[#00f0ff]/5 ${
                  isDragActive ? 'border-cyber-green text-cyber-green shadow-[0_0_15px_rgba(57,255,20,0.2)]' : 'border-cyber-blue/40 text-cyber-blue/70 hover:border-cyber-blue'
                }`}
              >
                <input {...getInputProps()} />
                <div className="flex flex-col items-center justify-center space-y-3">
                  <Upload size={28} className={isDragActive ? 'text-cyber-green' : 'text-cyber-blue'} />
                  <div>
                    <p className="text-sm font-bold uppercase tracking-widest">
                      {isDragActive ? 'INITIATE_TRANSFER' : 'SELECT_TARGET_DATA'}
                    </p>
                    <p className="text-[10px] mt-2 opacity-60">[JPG/PNG MAX_15MB]</p>
                  </div>
                </div>
              </div>

              {/* Action Toggle (Encrypt / Decrypt) */}
              <div className="flex border border-cyber-blue/30 bg-cyber-dark p-1">
                <button
                  onClick={() => setAction('encrypt')}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-bold uppercase tracking-widest transition-all ${
                    action === 'encrypt' ? 'bg-cyber-blue text-cyber-dark shadow-[0_0_10px_rgba(0,240,255,0.5)]' : 'text-cyber-blue/50 hover:text-cyber-blue'
                  }`}
                >
                  <Lock size={14} /> Encrypt
                </button>
                <button
                  onClick={() => setAction('decrypt')}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-bold uppercase tracking-widest transition-all ${
                    action === 'decrypt' ? 'bg-cyber-green text-cyber-dark shadow-[0_0_10px_rgba(57,255,20,0.5)]' : 'text-cyber-green/50 hover:text-cyber-green'
                  }`}
                >
                  <Unlock size={14} /> Decrypt
                </button>
              </div>

              {/* Method Selection */}
              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-cyber-blue/60 mb-2 block">Algorithm Protocol</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setMethod('math')}
                    className={`py-2 px-3 text-[11px] font-bold uppercase tracking-wider border transition-all ${
                      method === 'math' 
                        ? 'bg-[#ff003c]/20 border-[#ff003c] text-[#ff003c] shadow-[inset_0_0_10px_rgba(255,0,60,0.3)]' 
                        : 'bg-cyber-dark border-cyber-blue/20 text-cyber-blue/50 hover:border-cyber-blue/50'
                    }`}
                  >
                    Math_Shift
                  </button>
                  <button
                    onClick={() => setMethod('swap')}
                    className={`py-2 px-3 text-[11px] font-bold uppercase tracking-wider border transition-all ${
                      method === 'swap' 
                        ? 'bg-[#ff003c]/20 border-[#ff003c] text-[#ff003c] shadow-[inset_0_0_10px_rgba(255,0,60,0.3)]' 
                        : 'bg-cyber-dark border-cyber-blue/20 text-cyber-blue/50 hover:border-cyber-blue/50'
                    }`}
                  >
                    Pixel_Swap
                  </button>
                </div>
              </div>

              {/* Key Input */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-cyber-blue/60">Encryption Key</label>
                  {key && (
                    <button onClick={copyKey} className="text-[10px] text-cyber-green hover:text-white flex items-center gap-1">
                      <Copy size={10} /> COPY
                    </button>
                  )}
                </div>
                <input
                  type="password"
                  value={key}
                  onChange={(e) => setKey(e.target.value)}
                  placeholder="ENTER_KEY_PHRASE..."
                  className="w-full bg-cyber-dark border border-cyber-blue/50 px-4 py-2.5 text-cyber-blue placeholder-cyber-blue/30 focus:outline-none focus:border-cyber-green focus:shadow-[0_0_10px_rgba(57,255,20,0.2)] text-sm font-bold tracking-widest"
                />
              </div>

              {/* Execution Buttons */}
              <div className="flex gap-2 mt-2">
                <button
                  onClick={handleReset}
                  className="p-3 border border-cyber-blue/30 bg-cyber-dark text-cyber-blue/60 hover:text-cyber-blue hover:border-cyber-blue transition-colors"
                  title="SYSTEM_RESET"
                >
                  <RefreshCw size={18} />
                </button>
                <button
                  onClick={handleProcess}
                  disabled={isLoading || !file}
                  className={`cyber-button flex-1 flex justify-center items-center gap-2 py-3 font-black text-sm uppercase tracking-widest transition-all ${
                    isLoading || !file 
                      ? 'bg-cyber-dark border border-slate-700 text-slate-600 cursor-not-allowed' 
                      : action === 'encrypt'
                        ? 'bg-cyber-blue text-cyber-dark hover:bg-white hover:shadow-[0_0_15px_rgba(0,240,255,0.8)]'
                        : 'bg-cyber-green text-cyber-dark hover:bg-white hover:shadow-[0_0_15px_rgba(57,255,20,0.8)]'
                  }`}
                >
                  {isLoading ? (
                    <>PROCESSING <RefreshCw size={16} className="animate-spin" /></>
                  ) : (
                    <>EXECUTE {action} <Terminal size={16} /></>
                  )}
                </button>
              </div>

            </div>
          </div>

          {/* Right Column - Image Display */}
          <div className="xl:col-span-8 flex flex-col h-[600px] xl:h-[calc(100vh-160px)]">
            <div className="cyber-panel flex-grow flex flex-col p-1">
              
              {/* Display Header */}
              <div className="px-4 py-3 border-b border-cyber-blue/20 flex justify-between items-center bg-cyber-dark/80">
                <div className="flex items-center gap-2 text-cyber-blue text-xs font-bold tracking-widest uppercase">
                  <ImageIcon size={14} />
                  <span>Visual_Output_Feed</span>
                </div>
                {processedUrl && (
                  <button
                    onClick={handleDownload}
                    className="flex items-center gap-2 px-3 py-1.5 bg-cyber-dark border border-cyber-green text-cyber-green hover:bg-cyber-green hover:text-cyber-dark text-[10px] font-bold uppercase tracking-widest transition-all"
                  >
                    <Download size={12} /> EXTRACT_DATA
                  </button>
                )}
              </div>

              {/* Image Viewport */}
              <div className="flex-grow relative flex items-center justify-center p-2 bg-[#02050a] overflow-hidden">
                
                {/* Grid Overlay inside image area */}
                <div className="absolute inset-0 pointer-events-none opacity-20" 
                     style={{ backgroundImage: 'linear-gradient(#00f0ff 1px, transparent 1px), linear-gradient(90deg, #00f0ff 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
                </div>

                {!originalUrl ? (
                  <div className="text-center text-cyber-blue/30 relative z-10">
                    <ImageIcon size={48} className="mx-auto mb-3 opacity-50" />
                    <p className="text-xs font-bold uppercase tracking-widest">AWAITING_INPUT_STREAM</p>
                  </div>
                ) : (
                  <div className="relative max-w-full max-h-full border border-cyber-blue/30 z-10 bg-black">
                    
                    {/* Only Original Image */}
                    {!processedUrl && (
                      <img src={originalUrl} alt="Original Data" className="max-w-full max-h-[65vh] xl:max-h-[75vh] object-contain block" />
                    )}

                    {/* Interactive Slider (Before/After) */}
                    {processedUrl && (
                      <div 
                        ref={sliderRef}
                        className="relative max-w-full max-h-[65vh] xl:max-h-[75vh] select-none cursor-crosshair"
                        onMouseMove={handleSliderMove}
                        onTouchMove={(e) => handleSliderMove(e.touches[0])}
                      >
                        {/* Processed Image (Background) */}
                        <img 
                          src={processedUrl} 
                          alt="Processed Data" 
                          className="max-w-full max-h-[65vh] xl:max-h-[75vh] object-contain block pointer-events-none" 
                        />
                        
                        {/* Original Image (Foreground overlay) */}
                        <div 
                          className="absolute top-0 left-0 bottom-0 overflow-hidden border-r border-cyber-green"
                          style={{ width: `${sliderPosition}%` }}
                        >
                          <img 
                            src={originalUrl} 
                            alt="Original Data" 
                            className="max-w-none h-full object-cover block pointer-events-none opacity-80 mix-blend-screen"
                            style={{ 
                              width: sliderRef.current ? sliderRef.current.offsetWidth : 'auto'
                            }}
                          />
                        </div>

                        {/* Slider Custom Thumb */}
                        <div 
                          className="slider-thumb"
                          style={{ left: `${sliderPosition}%` }}
                        ></div>
                        
                        {/* UI Tags on Image */}
                        <div className="absolute top-3 left-3 bg-cyber-dark/80 border border-cyber-blue px-2 py-0.5 text-[9px] font-bold text-cyber-blue tracking-widest pointer-events-none">
                          SRC: ORIGINAL
                        </div>
                        <div className="absolute top-3 right-3 bg-cyber-dark/80 border border-[#ff003c] px-2 py-0.5 text-[9px] font-bold text-[#ff003c] tracking-widest pointer-events-none">
                          SRC: PROCESSED
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
              
              {/* Footer Status Bar */}
              <div className="px-4 py-2 border-t border-cyber-blue/20 bg-cyber-dark flex justify-between text-[10px] font-bold uppercase tracking-widest text-cyber-blue/50">
                <span className="flex items-center gap-2">
                  <span className={`w-1.5 h-1.5 rounded-full ${file ? 'bg-cyber-green' : 'bg-red-500'}`}></span>
                  {file ? `FILE_LOADED: ${file.name.substring(0,20)}...` : 'IDLE'}
                </span>
                <span>{processedUrl ? 'STATUS: TASK_COMPLETE' : 'STATUS: WAITING'}</span>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default App;
