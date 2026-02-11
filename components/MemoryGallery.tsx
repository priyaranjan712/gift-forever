
import React, { useState } from 'react';
import { MEMORY_PHOTOS, GALLERY_PASSWORD } from '../constants';
import MusicPlayer from './MusicPlayer';
// ==============================
import memoryGalleryMusic from '../music/ishqBulaava.mp3';
// ===============================
interface MemoryGalleryProps {
  onBack: () => void;
}

const MemoryGallery: React.FC<MemoryGalleryProps> = ({ onBack }) => {
  const [unlocked, setUnlocked] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState(false);

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode.toLowerCase() === GALLERY_PASSWORD.toLowerCase()) {
      setUnlocked(true);
      if ('vibrate' in navigator) navigator.vibrate([50, 30, 50]);
    } else {
      setError(true);
      if ('vibrate' in navigator) navigator.vibrate(200);
      setTimeout(() => setError(false), 500);
    }
  };

  if (!unlocked) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-rose-50/95 backdrop-blur-[30px] animate-fade-in">
        <div className={`w-full max-w-sm glass p-8 sm:p-12 rounded-[40px] sm:rounded-[70px] border-2 shadow-2xl text-center space-y-8 transition-all duration-500 ${error ? 'border-red-400 animate-shake bg-red-50/20' : 'border-rose-200 bg-white'}`}>
          <div className="text-6xl sm:text-8xl animate-bounce">📸</div>
          <div className="space-y-3">
            <h2 className="text-3xl sm:text-4xl font-romantic text-rose-950">Memory Vault</h2>
            <p className="text-[10px] text-rose-400 font-black uppercase tracking-[0.3em]">For Iti's Eyes Only</p>
          </div>
          <form onSubmit={handleUnlock} className="space-y-6">
            <div className="space-y-2">
              <input
                type="password"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="SECRET KEY..."
                className={`w-full px-6 py-4 rounded-[25px] bg-white border-2 ${error ? 'border-red-300' : 'border-rose-100'} text-center text-lg font-bold tracking-widest outline-none focus:border-rose-400 transition-all`}
              />
              {error && (
                <p className="text-red-500 text-[10px] font-bold mt-2 animate-pulse uppercase tracking-widest">Incorrect Key. Try again?</p>
              )}
            </div>
            <button type="submit" className="w-full py-4 bg-rose-600 text-white rounded-[25px] font-black tracking-widest uppercase shadow-xl hover:bg-rose-700 transition-all text-sm">
              Unlock Memories
            </button>
          </form>
          <button onClick={onBack} className="text-rose-400 font-bold uppercase tracking-widest text-[9px] hover:text-rose-600 transition-colors">
            ← Return to Chapters
          </button>
          <p className="text-[9px] text-rose-200 uppercase tracking-widest italic pt-2">Hint:🤫</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-[#fffafa] overflow-y-auto px-4 py-12 sm:px-6 sm:py-20 animate-fade-in selection:bg-rose-100">
      <div className="max-w-6xl mx-auto space-y-12 sm:space-y-20">
        <header className="text-center space-y-4 sm:space-y-6">
          <div className="inline-block px-4 py-1.5 glass-dark rounded-full border border-rose-200/50">
            <span className="text-rose-900 font-black text-[9px] sm:text-[10px] tracking-[0.3em] uppercase">Private Collection</span>
          </div>
          <h1 className="text-4xl sm:text-8xl font-romantic text-rose-950">Our Moments</h1>
          <p className="text-rose-700 font-elegant italic text-lg sm:text-3xl px-6 shimmer-text italic">"Captured in time, for you Iti."</p>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-12 px-4 sm:px-4">
          {MEMORY_PHOTOS.map((photo, idx) => (
            <div
              key={photo.id}
              className="group relative"
              style={{ animationDelay: `${idx * 0.1}s` }}
            >
              <div
                className="bg-[#fdfbf7] p-3 pb-8 sm:p-4 sm:pb-12 shadow-lg sm:shadow-[0_20px_50px_rgba(0,0,0,0.1)] transition-all duration-700 group-hover:rotate-0 group-hover:scale-105 group-hover:-translate-y-2 rounded-sm border border-black/5"
                style={{ transform: `rotate(${photo.rotation}deg)` }}
              >
                <div className="aspect-[4/5] overflow-hidden bg-gray-100 mb-4 sm:mb-6">
                  <img
                    src={photo.url}
                    alt={photo.caption}
                    className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-110"
                  />
                </div>
                <p className="font-romantic text-2xl sm:text-3xl text-rose-950 text-center tracking-wide">{photo.caption}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-center pb-16 sm:pb-20">
          <button
            onClick={onBack}
            className="px-10 py-4 sm:px-12 sm:py-5 bg-rose-600 text-white rounded-full font-black tracking-widest shadow-xl hover:bg-rose-700 active:scale-95 transition-all uppercase text-sm"
          >
            ← Back to Chapters
          </button>
        </div>
      </div>
      <MusicPlayer url={memoryGalleryMusic} />
    </div>
  );
};

export default MemoryGallery;
