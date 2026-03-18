
import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, Camera, RefreshCcw, ArrowRight, AlertCircle, Loader2, Sparkles } from 'lucide-react';
import { performOCR } from '../services/groqService';

interface ScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCapture: (text: string) => void;
}

const ScannerModal: React.FC<ScannerModalProps> = ({ isOpen, onClose, onCapture }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isFlashing, setIsFlashing] = useState(false);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [ocrProgress, setOcrProgress] = useState(0);
  const [ocrStatus, setOcrStatus] = useState('');

  useEffect(() => {
    if (isOpen) {
      startCamera();
    } else {
      stopCamera();
    }
    return () => stopCamera();
  }, [isOpen]);

  const startCamera = async () => {
    setIsCameraReady(false);
    setIsInitializing(true);
    setError(null);
    setCapturedImage(null);
    setIsProcessing(false);
    setOcrProgress(0);
    setOcrStatus('');
    try {
      const constraints = {
        video: {
          facingMode: 'environment',
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        }
      };
      
      let s: MediaStream;
      try {
        s = await navigator.mediaDevices.getUserMedia(constraints);
      } catch (e) {
        console.warn("Environment camera failed, trying default camera...");
        s = await navigator.mediaDevices.getUserMedia({ video: true });
      }

      setStream(s);
      if (videoRef.current) {
        videoRef.current.srcObject = s;
        videoRef.current.onloadedmetadata = () => {
          setIsCameraReady(true);
          setIsInitializing(false);
        };
        videoRef.current.play().catch(e => console.error("Video play failed:", e));
      }
    } catch (err: any) {
      console.error("Camera access error:", err);
      setIsInitializing(false);
      if (err.name === 'NotAllowedError') {
        setError("Camera permission denied. Please allow camera access in browser settings.");
      } else if (err.name === 'NotFoundError') {
        setError("No camera found on this device.");
      } else {
        setError("Unable to access camera. Please try pasting text manually.");
      }
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setCapturedImage(null);
    setIsCameraReady(false);
    setIsInitializing(false);
    setIsProcessing(false);
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      const vWidth = video.videoWidth;
      const vHeight = video.videoHeight;

      if (vWidth === 0 || vHeight === 0) return;

      setIsFlashing(true);
      setTimeout(() => setIsFlashing(false), 150);

      canvas.width = vWidth;
      canvas.height = vHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, vWidth, vHeight);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
        setCapturedImage(dataUrl);
      }
    }
  };

  const handleUsePhoto = async () => {
    if (capturedImage) {
      setIsProcessing(true);
      setError(null);
      try {
        const base64 = capturedImage.split(',')[1];
        const text = await performOCR(base64, (progress, status) => {
          setOcrProgress(progress);
          setOcrStatus(status);
        });
        onCapture(text);
      } catch (err: any) {
        console.error("OCR Error:", err);
        setError(err.message || "Failed to extract text from image.");
        setIsProcessing(false);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-0 md:p-6 bg-slate-950/95 backdrop-blur-2xl" onClick={onClose}>
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-white md:rounded-[3rem] shadow-2xl w-full max-w-3xl h-full md:h-auto md:max-h-[90vh] overflow-hidden flex flex-col border border-white/20"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 md:p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <button 
            onClick={onClose} 
            disabled={isProcessing}
            className={`p-2.5 md:p-3 bg-white hover:bg-slate-100 rounded-xl md:rounded-2xl transition-all border border-slate-200 text-slate-600 flex items-center gap-1.5 md:gap-2 font-black text-[10px] md:text-xs uppercase tracking-widest ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <ChevronLeft className="w-4 h-4 md:w-5 md:h-5" />
            Back
          </button>
          <div className="text-center">
            <h2 className="text-lg md:text-xl font-black text-slate-900 leading-tight font-display">AI Note Scanner</h2>
            <p className="text-[8px] md:text-[10px] text-blue-600 font-black uppercase tracking-[0.3em]">Image to Quiz</p>
          </div>
          <div className="w-16 md:w-20"></div>
        </div>

        {/* Viewport */}
        <div className="relative flex-grow bg-slate-900 overflow-hidden flex items-center justify-center min-h-[300px] md:min-h-[400px]">
          <AnimatePresence>
            {isInitializing && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-20 flex flex-col items-center justify-center text-white bg-slate-900/80 backdrop-blur-md"
              >
                <Loader2 className="w-10 h-10 md:w-12 md:h-12 text-blue-500 animate-spin mb-4 md:mb-6" />
                <p className="text-[10px] md:text-xs font-black uppercase tracking-[0.3em] text-slate-400">Initializing Camera...</p>
              </motion.div>
            )}

            {isProcessing && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-30 flex flex-col items-center justify-center text-white bg-slate-900/90 backdrop-blur-xl p-8"
              >
                <div className="relative mb-8">
                  <div className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-white/10 flex items-center justify-center">
                    <Sparkles className="w-10 h-10 md:w-12 md:h-12 text-blue-500 animate-pulse" />
                    <svg className="absolute inset-0 w-full h-full -rotate-90">
                      <circle 
                        cx="50%" cy="50%" r="46%" 
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth="4" 
                        className="text-white/10"
                      />
                      <circle 
                        cx="50%" cy="50%" r="46%" 
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth="4" 
                        strokeDasharray="100"
                        strokeDashoffset={100 - (ocrProgress * 100)}
                        className="text-blue-500 transition-all duration-300"
                        style={{ strokeDasharray: '289', strokeDashoffset: 289 - (289 * ocrProgress) }}
                      />
                    </svg>
                  </div>
                  <div className="absolute -bottom-2 -right-2 bg-blue-600 text-[10px] font-black px-2 py-1 rounded-lg shadow-xl">
                    {Math.round(ocrProgress * 100)}%
                  </div>
                </div>
                
                <h3 className="text-xl md:text-2xl font-black text-white mb-3 font-display">Analyzing Content</h3>
                <p className="text-slate-400 text-xs md:text-sm font-bold uppercase tracking-[0.2em] mb-8 text-center">
                  {ocrStatus || 'Extracting text from image...'}
                </p>

                {/* Linear Progress Bar */}
                <div className="w-full max-w-xs h-2 bg-white/10 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${ocrProgress * 100}%` }}
                    className="h-full bg-gradient-to-r from-blue-600 to-indigo-600"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {error && !isProcessing ? (
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-8 md:p-12 text-center bg-slate-900">
              <div className="bg-rose-500/20 p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] mb-6 md:mb-8">
                <AlertCircle className="w-12 h-12 md:w-16 md:h-16 text-rose-500" />
              </div>
              <p className="font-black text-xl md:text-2xl text-white mb-3 md:mb-4 font-display">Scanner Error</p>
              <p className="text-slate-400 text-base md:text-lg mb-8 md:mb-10 max-w-sm leading-relaxed">{error}</p>
              <button onClick={startCamera} className="px-8 md:px-10 py-3.5 md:py-4 bg-white text-slate-900 rounded-xl md:rounded-2xl font-black text-xs md:text-sm hover:bg-slate-100 transition-all active:scale-95">
                Try Again
              </button>
            </div>
          ) : capturedImage ? (
            <motion.div 
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full h-full flex items-center justify-center bg-slate-800 p-4 md:p-10"
            >
              <img src={capturedImage} className="max-w-full max-h-full object-contain rounded-2xl md:rounded-3xl shadow-2xl border border-white/10" alt="Captured Note" />
            </motion.div>
          ) : (
            <div className="w-full h-full relative">
              <video 
                ref={videoRef} 
                autoPlay 
                playsInline 
                muted
                className={`w-full h-full object-cover transition-opacity duration-500 ${isCameraReady ? 'opacity-100' : 'opacity-0'}`} 
              />
              {/* Overlays */}
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                <div className="w-[85%] h-[80%] border-2 border-dashed border-white/30 rounded-[2rem] md:rounded-[3rem] relative">
                  <div className="absolute top-0 left-0 w-12 h-12 md:w-16 md:h-16 border-t-4 md:border-t-8 border-l-4 md:border-l-8 border-blue-500 rounded-tl-[2rem] md:rounded-tl-[3rem]"></div>
                  <div className="absolute top-0 right-0 w-12 h-12 md:w-16 md:h-16 border-t-4 md:border-t-8 border-r-4 md:border-r-8 border-blue-500 rounded-tr-[2rem] md:rounded-tr-[3rem]"></div>
                  <div className="absolute bottom-0 left-0 w-12 h-12 md:w-16 md:h-16 border-b-4 md:border-b-8 border-l-4 md:border-l-8 border-blue-500 rounded-bl-[2rem] md:rounded-bl-[3rem]"></div>
                  <div className="absolute bottom-0 right-0 w-12 h-12 md:w-16 md:h-16 border-b-4 md:border-b-8 border-r-4 md:border-r-8 border-blue-500 rounded-br-[2rem] md:rounded-br-[3rem]"></div>
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white/20 text-[8px] md:text-[10px] font-black uppercase tracking-[0.4em] text-center w-full">
                    Align text within frame
                  </div>
                </div>
              </div>
              <AnimatePresence>
                {isFlashing && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-white z-30" 
                  />
                )}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* Footer / Controls */}
        <div className="p-6 md:p-12 bg-white border-t border-slate-100">
          {!capturedImage ? (
            <div className="flex flex-col items-center gap-4 md:gap-6">
              <button 
                onClick={capturePhoto}
                disabled={!isCameraReady || isInitializing}
                className={`group relative flex flex-col items-center gap-3 md:gap-4 transition-all ${(!isCameraReady || isInitializing) ? 'opacity-40 grayscale cursor-not-allowed' : 'active:scale-90'}`}
              >
                <div className="w-16 h-16 md:w-24 md:h-24 rounded-full border-4 md:border-8 border-slate-100 flex items-center justify-center p-1.5 md:p-2 group-hover:border-blue-100 transition-colors">
                  <div className="w-full h-full rounded-full bg-blue-600 shadow-2xl shadow-blue-600/40 border-2 md:border-4 border-white flex items-center justify-center">
                    <Camera className="w-6 h-6 md:w-8 md:h-8 text-white" />
                  </div>
                </div>
                <span className="text-[8px] md:text-[10px] font-black text-slate-800 uppercase tracking-[0.3em]">Tap to Capture</span>
              </button>
            </div>
          ) : (
            <div className="flex w-full gap-3 md:gap-4 max-w-lg mx-auto">
              <button 
                onClick={() => setCapturedImage(null)}
                disabled={isProcessing}
                className={`flex-1 py-4 md:py-5 bg-slate-100 text-slate-700 font-black rounded-2xl md:rounded-[2rem] hover:bg-slate-200 transition-all flex items-center justify-center gap-2 md:gap-3 border border-slate-200 shadow-sm text-sm md:text-base ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <RefreshCcw className="w-4 h-4 md:w-5 md:h-5" />
                Retake
              </button>
              <button 
                onClick={handleUsePhoto}
                disabled={isProcessing}
                className={`flex-[2] py-4 md:py-5 bg-blue-600 text-white font-black rounded-2xl md:rounded-[2rem] hover:bg-blue-700 transition-all shadow-2xl shadow-blue-600/20 flex items-center justify-center gap-2 md:gap-3 text-base md:text-lg ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    Analyze Notes
                    <ArrowRight className="w-5 h-5 md:w-6 md:h-6" />
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </motion.div>
      
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

export default ScannerModal;
