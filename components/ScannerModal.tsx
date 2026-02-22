
import React, { useRef, useState, useEffect } from 'react';

interface ScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCapture: (base64: string) => void;
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
        // Some browsers don't fire loadedmetadata reliably if play() isn't called
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
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      // Ensure we have actual video dimensions
      const vWidth = video.videoWidth;
      const vHeight = video.videoHeight;

      if (vWidth === 0 || vHeight === 0) {
        console.warn("Video dimensions not ready yet");
        return;
      }

      // Visual feedback: Flash
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

  const handleUsePhoto = () => {
    if (capturedImage) {
      const base64 = capturedImage.split(',')[1];
      onCapture(base64);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-0 md:p-4 bg-slate-950/95 backdrop-blur-xl animate-fadeIn" onClick={onClose}>
      <div 
        className="bg-white md:rounded-[2.5rem] shadow-2xl w-full max-w-2xl h-full md:h-auto md:max-h-[90vh] overflow-hidden flex flex-col border border-white/20"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-3 md:p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <button 
            onClick={onClose} 
            className="p-2 md:p-2 bg-white hover:bg-slate-100 rounded-lg md:rounded-xl transition-all border border-slate-200 text-slate-600 flex items-center gap-1.5 md:gap-2 font-bold text-xs md:text-sm"
          >
            <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" /></svg>
            Back
          </button>
          <div className="text-center">
            <h2 className="text-base md:text-lg font-black text-slate-900 leading-tight">AI Note Scanner</h2>
            <p className="text-[9px] md:text-[10px] text-blue-600 font-black uppercase tracking-widest">Image to Quiz</p>
          </div>
          <div className="w-12 md:w-16"></div> {/* Spacer for alignment */}
        </div>

        {/* Viewport */}
        <div className="relative flex-grow bg-slate-900 overflow-hidden flex items-center justify-center min-h-[300px]">
          {isInitializing && (
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-white bg-slate-900/50 backdrop-blur-sm">
              <div className="w-10 h-10 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mb-4"></div>
              <p className="text-xs font-black uppercase tracking-widest text-slate-400">Loading Camera...</p>
            </div>
          )}

          {error ? (
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-8 text-center bg-slate-900">
              <div className="bg-rose-500/20 p-5 rounded-full mb-4">
                <svg className="w-12 h-12 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
              </div>
              <p className="font-bold text-lg text-white mb-2">Camera Unavailable</p>
              <p className="text-slate-400 text-sm mb-6 max-w-xs">{error}</p>
              <button onClick={startCamera} className="px-8 py-3 bg-white text-slate-900 rounded-2xl font-black text-sm hover:bg-slate-100 transition-colors">
                Retry Connection
              </button>
            </div>
          ) : capturedImage ? (
            <div className="w-full h-full flex items-center justify-center bg-slate-800 p-4">
              <img src={capturedImage} className="max-w-full max-h-full object-contain rounded-xl shadow-2xl border border-white/10" alt="Captured Note" />
            </div>
          ) : (
            <div className="w-full h-full relative">
              <video 
                ref={videoRef} 
                autoPlay 
                playsInline 
                muted
                className={`w-full h-full object-cover transition-opacity duration-300 ${isCameraReady ? 'opacity-100' : 'opacity-0'}`} 
              />
              {/* Overlays */}
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                <div className="w-[85%] h-[80%] border-2 border-dashed border-white/20 rounded-3xl relative">
                  <div className="absolute top-0 left-0 w-12 h-12 border-t-4 border-l-4 border-blue-500 rounded-tl-3xl"></div>
                  <div className="absolute top-0 right-0 w-12 h-12 border-t-4 border-r-4 border-blue-500 rounded-tr-3xl"></div>
                  <div className="absolute bottom-0 left-0 w-12 h-12 border-b-4 border-l-4 border-blue-500 rounded-bl-3xl"></div>
                  <div className="absolute bottom-0 right-0 w-12 h-12 border-b-4 border-r-4 border-blue-500 rounded-br-3xl"></div>
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white/10 text-xs font-black uppercase tracking-widest text-center">
                    Align text within frame
                  </div>
                </div>
              </div>
              {isFlashing && <div className="absolute inset-0 bg-white animate-flash z-30"></div>}
            </div>
          )}
        </div>

        {/* Footer / Controls */}
        <div className="p-6 md:p-8 bg-white border-t border-slate-100 safe-area-bottom">
          {!capturedImage ? (
            <div className="flex flex-col items-center gap-4">
              <button 
                onClick={capturePhoto}
                disabled={!isCameraReady || isInitializing}
                className={`group relative flex flex-col items-center gap-3 transition-all ${(!isCameraReady || isInitializing) ? 'opacity-40 grayscale cursor-not-allowed' : 'active:scale-90'}`}
              >
                {/* Visual Button */}
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-full border-4 border-slate-100 flex items-center justify-center p-1.5 md:p-2 group-hover:border-blue-100 transition-colors">
                  <div className="w-full h-full rounded-full bg-blue-600 shadow-xl shadow-blue-600/30 border-4 border-white"></div>
                </div>
                <span className="text-[10px] md:text-xs font-black text-slate-800 uppercase tracking-widest">Tap to Capture</span>
              </button>
            </div>
          ) : (
            <div className="flex w-full gap-3 md:gap-4 max-w-md mx-auto">
              <button 
                onClick={() => setCapturedImage(null)}
                className="flex-1 py-3.5 md:py-4 bg-slate-100 text-slate-700 font-black rounded-xl md:rounded-2xl hover:bg-slate-200 transition-all flex items-center justify-center gap-2 border border-slate-200 shadow-sm text-sm md:text-base"
              >
                <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                Retake
              </button>
              <button 
                onClick={handleUsePhoto}
                className="flex-[2] py-3.5 md:py-4 bg-blue-600 text-white font-black rounded-xl md:rounded-2xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/20 flex items-center justify-center gap-2 md:gap-3 text-sm md:text-base"
              >
                Analyze 🚀
                <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 7l5 5m0 0l-5 5m5-5H6"></path></svg>
              </button>
            </div>
          )}
        </div>
      </div>
      
      {/* Hidden processing canvas */}
      <canvas ref={canvasRef} className="hidden" />

      <style>{`
        @keyframes flash {
          0% { opacity: 0; }
          20% { opacity: 1; }
          100% { opacity: 0; }
        }
        .animate-flash {
          animation: flash 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default ScannerModal;
