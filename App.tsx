
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
      audioRef.current.volume = 0.4;
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
    <div className="relative min-h-screen w-full flex flex-col items-center bg-slate-950 overflow-x-hidden text-rose-100 selection:bg-rose-500/30">
      
      {/* Background Ambience - Fixed to stay in place while content scrolls */}
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_center,_rgba(225,29,72,0.12)_0%,_transparent_80%)] pointer-events-none z-0"></div>
      
      <audio 
        ref={audioRef} 
        loop 
        preload="auto"
        src="https://www.dropbox.com/scl/fi/3kj7px37df6bwlgze8cs8/Ezra_Band_-_Walang_Iba_-mp3.pm.mp3?rlkey=qtyiggm3im6wveso3rqnh6z18&st=50ix0uju&raw=1" 
      />

      {/* Mute Toggle - Fixed to bottom corner */}
      {isStarted && (
        <button 
          onClick={toggleMute}
          aria-label={isMuted ? "Unmute music" : "Mute music"}
          className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 p-3 sm:p-4 rounded-full bg-slate-900/60 backdrop-blur-md border border-rose-500/30 text-rose-400 hover:bg-rose-500/20 hover:text-rose-300 transition-all shadow-2xl group"
        >
          {isMuted ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="sm:w-6 sm:h-6 group-hover:scale-110 transition-transform"><line x1="1" y1="1" x2="23" y2="23"></line><path d="M9 18V5l12-2v13"></path><circle cx="6" cy="18" r="3"></circle><circle cx="18" cy="16" r="3"></circle></svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="sm:w-6 sm:h-6 group-hover:scale-110 transition-transform"><path d="M9 18V5l12-2v13"></path><circle cx="6" cy="18" r="3"></circle><circle cx="18" cy="16" r="3"></circle></svg>
          )}
        </button>
      )}

      {/* Landing State - Fixed overlay to ensure perfect centering regardless of other layers */}
      {!isStarted && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center animate-in fade-in zoom-in duration-1000 gap-6 sm:gap-10 px-4 text-center">
          <div className="relative group w-full max-w-xs sm:max-w-none flex justify-center">
            <div className="absolute -inset-2 bg-gradient-to-r from-rose-600 via-pink-500 to-rose-600 rounded-full blur-xl opacity-20 group-hover:opacity-60 transition duration-1000 group-hover:duration-200 animate-pulse"></div>
            <button
              onClick={handleStart}
              className="relative w-full sm:w-auto px-8 py-6 sm:px-16 sm:py-8 bg-slate-900/80 backdrop-blur-sm border border-rose-500/40 rounded-full text-xl sm:text-2xl font-playfair tracking-[0.2em] sm:tracking-[0.3em] uppercase hover:text-rose-400 transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-4 group shadow-2xl"
            >
              <span className="group-hover:animate-bounce">❤️</span>
              Click to Open
              <span className="group-hover:animate-bounce">❤️</span>
            </button>
          </div>
          <p className="text-rose-300/60 font-dancing text-xl sm:text-2xl animate-pulse tracking-widest italic drop-shadow-lg">A melody of my love for Marfie</p>
        </div>
      )}

      {/* Animation Layer - Fixed so it remains the background while text scrolls */}
      <BlossomCanvas isStarted={isStarted} onBloomComplete={handleBloomComplete} />

      {/* Message Layer - Relative content that can scroll */}
      {isBloomComplete && (
        <div className="relative z-30 w-full max-w-3xl px-6 sm:px-8 text-center animate-in fade-in slide-in-from-bottom-16 duration-[2000ms] delay-700 flex flex-col gap-8 sm:gap-12 mt-12 sm:mt-20 pb-32">
          <h1 className="text-4xl sm:text-6xl md:text-8xl font-calligraphy text-rose-400 drop-shadow-[0_10px_10px_rgba(225,29,72,0.4)] leading-tight">
            {VALENTINE_MESSAGE}
          </h1>
          
          <p className="text-lg sm:text-2xl md:text-4xl font-playfair italic font-light leading-relaxed text-rose-100 tracking-tight">
            "{VALENTINE_SUBTEXT}"
          </p>

          <div className="h-px w-24 sm:w-48 bg-gradient-to-r from-transparent via-rose-500/60 to-transparent mx-auto"></div>

          <p className="text-base sm:text-xl md:text-3xl font-dancing leading-relaxed text-rose-100/90 tracking-wide max-w-2xl mx-auto">
            {HEARTFELT_NOTE}
          </p>

          <div className="mt-8">
            <p className="font-calligraphy text-4xl sm:text-6xl text-rose-500 animate-pulse drop-shadow-sm">Love Always! Ash</p>
          </div>
        </div>
      )}

      {/* Background Floating Hearts - Absolute within the root container */}
      {isStarted && (
        <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-25 z-10">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `100%`,
                fontSize: `${14 + Math.random() * 20}px`,
                animationDelay: `${Math.random() * 8}s`,
                animationDuration: `${10 + Math.random() * 15}s`,
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
          100% { transform: translateY(-110vh) rotate(360deg); opacity: 0; }
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
