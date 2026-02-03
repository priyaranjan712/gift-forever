
import React, { useState, useEffect, useRef } from 'react';

interface MusicPlayerProps {
  url: string;
  onAutoStop?: () => void;
}

const MusicPlayer: React.FC<MusicPlayerProps> = ({ url, onAutoStop }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    audioRef.current = new Audio(url);
    audioRef.current.loop = true;
    audioRef.current.onended = () => {
      setIsPlaying(false);
      if (onAutoStop) onAutoStop();
    };

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [url]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(e => console.error("Audio play failed:", e));
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="fixed bottom-8 right-6 sm:bottom-10 sm:right-10 z-[100] flex flex-col items-center space-y-4 pointer-events-none">
      
      {/* Soundwave Visualizer - Elegant Pill */}
      {isPlaying && (
        <div className="flex items-end justify-center space-x-1 h-10 px-4 py-2 bg-white/40 backdrop-blur-2xl rounded-full border border-white/40 shadow-xl pointer-events-auto transition-all animate-reveal-up group/pill">
          {[0.5, 0.8, 0.4, 0.9, 0.6, 1, 0.7, 0.5, 0.8].map((h, i) => (
            <div 
              key={i} 
              className="w-1 bg-rose-500 rounded-full animate-soundwave" 
              style={{ 
                height: `${h * 100}%`, 
                animationDelay: `${i * 0.12}s`,
                animationDuration: `${0.8 + Math.random() * 0.4}s`
              }}
            />
          ))}
        </div>
      )}

      <div className="flex items-center space-x-3">
        {/* Now Playing Label */}
        <div className={`transition-all duration-700 transform ${isPlaying ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'} bg-white/40 backdrop-blur-xl border border-white/40 px-4 py-2 rounded-2xl shadow-sm hidden sm:block pointer-events-auto`}>
          <p className="text-rose-900 font-romantic text-sm whitespace-nowrap">Iti's Melody ✨</p>
        </div>

        <div className="relative group pointer-events-auto">
          {/* Glow / Pulse Rings */}
          <div className={`absolute -inset-4 rounded-full bg-rose-400/20 blur-2xl transition-all duration-1000 ${isPlaying ? 'opacity-100 scale-150 animate-pulse' : 'opacity-0 scale-50'}`}></div>
          <div className={`absolute -inset-1 rounded-full bg-gradient-to-tr from-rose-500 to-rose-300 opacity-0 group-hover:opacity-100 blur-md transition-opacity duration-500`}></div>

          <button
            onClick={togglePlay}
            title={isPlaying ? "Pause Music" : "Play Music"}
            className={`relative z-10 w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center rounded-full transition-all duration-500 shadow-[0_8px_32px_rgba(225,29,72,0.3)] active:scale-90
              ${isPlaying 
                ? 'bg-rose-500 text-white shadow-[0_0_30px_rgba(225,29,72,0.6)]' 
                : 'bg-white/80 backdrop-blur-md text-rose-500 border border-rose-100 hover:border-rose-400 hover:text-rose-600'
              } group-hover:scale-110 group-hover:rotate-12`}
          >
            {isPlaying ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 sm:h-8 sm:w-8" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 sm:h-8 sm:w-8 translate-x-0.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z"/>
              </svg>
            )}
          </button>

          {/* Sparkles floating around button when playing */}
          {isPlaying && (
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute -top-4 -right-2 text-rose-400 text-xs animate-bounce delay-75">✨</div>
              <div className="absolute -bottom-4 -left-2 text-rose-300 text-[10px] animate-pulse">💖</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MusicPlayer;
