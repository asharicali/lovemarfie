
import React, { useState, useCallback, useRef } from 'react';
import BlossomCanvas from './components/BlossomCanvas';
import { VALENTINE_MESSAGE, VALENTINE_SUBTEXT, HEARTFELT_NOTE } from './constants';

const App: React.FC = () => {
  const [isStarted, setIsStarted] = useState(false);
  const [isBloomComplete, setIsBloomComplete] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const handleStart = () => {
    setIsStarted(true);
    if (audioRef.current) {
      // Soft volume for background ambience
      audioRef.current.volume = 0.4;
      
      // Load the resource explicitly
      audioRef.current.load();
      
      const playPromise = audioRef.current.play();
      
      if (playPromise !== undefined) {
        playPromise.catch(err => {
          console.warn("Audio playback was prevented by the browser or the resource failed to load:", err);
        });
      }
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !audioRef.current.muted;
      setIsMuted(audioRef.current.muted);
    }
  };

  const handleBloomComplete = useCallback(() => {
    setIsBloomComplete(true);
  }, []);

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center bg-slate-950 overflow-hidden text-rose-100 selection:bg-rose-500/30">
      
      {/* Background Ambience */}
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_center,_rgba(225,29,72,0.12)_0%,_transparent_80%)] pointer-events-none"></div>
      
      {/* 
          Romantic Piano track. 
          Removed crossOrigin as it's not needed for simple playback and can cause "not suitable" errors 
          if the server doesn't explicitly support it.
      */}
      <audio 
        ref={audioRef} 
        loop 
        preload="auto"
        src="https://www.dropbox.com/scl/fi/3kj7px37df6bwlgze8cs8/Ezra_Band_-_Walang_Iba_-mp3.pm.mp3?rlkey=qtyiggm3im6wveso3rqnh6z18&st=50ix0uju&raw=1" 
      />

      {/* Mute Toggle */}
      {isStarted && (
        <button 
          onClick={toggleMute}
          aria-label={isMuted ? "Unmute music" : "Mute music"}
          className="fixed bottom-6 right-6 z-50 p-4 rounded-full bg-slate-900/60 backdrop-blur-md border border-rose-500/30 text-rose-400 hover:bg-rose-500/20 hover:text-rose-300 transition-all shadow-2xl group"
        >
          {isMuted ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:scale-110 transition-transform"><line x1="1" y1="1" x2="23" y2="23"></line><path d="M9 18V5l12-2v13"></path><circle cx="6" cy="18" r="3"></circle><circle cx="18" cy="16" r="3"></circle></svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:scale-110 transition-transform"><path d="M9 18V5l12-2v13"></path><circle cx="6" cy="18" r="3"></circle><circle cx="18" cy="16" r="3"></circle></svg>
          )}
        </button>
      )}

      {/* Landing State */}
      {!isStarted && (
        <div className="z-20 animate-in fade-in zoom-in duration-1000 flex flex-col items-center gap-10">
          <div className="relative group">
            <div className="absolute -inset-2 bg-gradient-to-r from-rose-600 via-pink-500 to-rose-600 rounded-full blur-xl opacity-20 group-hover:opacity-60 transition duration-1000 group-hover:duration-200 animate-pulse"></div>
            <button
              onClick={handleStart}
              className="relative px-16 py-8 bg-slate-900/80 backdrop-blur-sm border border-rose-500/40 rounded-full text-2xl font-playfair tracking-[0.3em] uppercase hover:text-rose-400 transition-all hover:scale-105 active:scale-95 flex items-center gap-4 group"
            >
              <span className="group-hover:animate-bounce">❤️</span>
              Click to Open
              <span className="group-hover:animate-bounce">❤️</span>
            </button>
          </div>
          <p className="text-rose-300/60 font-dancing text-2xl animate-pulse tracking-widest italic">A melody of my love for Marfie</p>
        </div>
      )}

      {/* Animation Layer */}
      <BlossomCanvas isStarted={isStarted} onBloomComplete={handleBloomComplete} />

      {/* Message Layer */}
      {isBloomComplete && (
        <div className="z-30 max-w-3xl px-8 text-center animate-in fade-in slide-in-from-bottom-16 duration-[2000ms] delay-700 flex flex-col gap-8 mt-[20vh] mb-20">
          <h1 className="text-6xl md:text-8xl font-calligraphy text-rose-400 drop-shadow-[0_15px_15px_rgba(225,29,72,0.4)]">
            {VALENTINE_MESSAGE}
          </h1>
          
          <p className="text-2xl md:text-4xl font-playfair italic font-light leading-relaxed text-rose-100 tracking-tight">
            "{VALENTINE_SUBTEXT}"
          </p>

          <div className="h-px w-48 bg-gradient-to-r from-transparent via-rose-500/60 to-transparent mx-auto"></div>

          <p className="text-xl md:text-3xl font-dancing leading-relaxed text-rose-100/90 tracking-wide max-w-2xl mx-auto">
            {HEARTFELT_NOTE}
          </p>

          <div className="mt-4">
            <p className="font-calligraphy text-5xl text-rose-500 animate-pulse drop-shadow-sm">Love Always! Ash</p>
          </div>
        </div>
      )}

      {/* Background Floating Hearts */}
      {isStarted && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-25">
          {[...Array(15)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${100 + Math.random() * 50}%`,
                fontSize: `${18 + Math.random() * 25}px`,
                animationDelay: `${Math.random() * 8}s`,
                animationDuration: `${12 + Math.random() * 15}s`,
              }}
            >
              {Math.random() > 0.5 ? '❤️' : '💖'}
            </div>
          ))}
        </div>
      )}

      <style>{`
        @keyframes float {
          0% { transform: translateY(0) rotate(0deg); opacity: 0; }
          10% { opacity: 0.8; }
          90% { opacity: 0.8; }
          100% { transform: translateY(-130vh) rotate(360deg); opacity: 0; }
        }
        .animate-float {
          animation-name: float;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
        }
      `}</style>
    </div>
  );
};

export default App;
