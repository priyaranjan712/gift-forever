
import React, { useState, useEffect, useRef } from 'react';
import { VALENTINE_DAYS, ITI_NICKNAME } from './constants';
import { AppView, ValentineDay } from './types';
import BackgroundEffects from './components/BackgroundEffects';
import DayDetail from './components/DayDetail';
import MemoryGallery from './components/MemoryGallery';

const App: React.FC = () => {
  const [view, setView] = useState<AppView>('LOGIN');
  const [password, setPassword] = useState('');
  const [selectedDay, setSelectedDay] = useState<ValentineDay | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  const [manuallyUnlocked, setManuallyUnlocked] = useState<number[]>([]);

  // Blossom interaction states
  const [blossomHolding, setBlossomHolding] = useState(false);
  const [blossomProgress, setBlossomProgress] = useState(0);
  const blossomTimerRef = useRef<number | null>(null);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 30000);
    return () => clearInterval(timer);
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password.toLowerCase() === ITI_NICKNAME) {
      setView('CALENDAR');
    } else {
      alert("Hmm… this little world knows only one name 💫Try again, Iti.");
    }
  };

  const isUnlockedByDate = (day: ValentineDay) => {
    const now = new Date();
    const dayDate = new Date(day.date + "T00:00:00");
    return now >= dayDate;
  };

  const handleDayClick = (day: ValentineDay) => {
    if (!isUnlockedByDate(day)) return;
    setSelectedDay(day);
    setView('DAY_DETAIL');
  };

  const markAsUnlocked = (id: number) => {
    if (!manuallyUnlocked.includes(id)) {
      setManuallyUnlocked([...manuallyUnlocked, id]);
    }
  };

  // Blossom Interaction Logic
  useEffect(() => {
    if (blossomHolding) {
      blossomTimerRef.current = window.setInterval(() => {
        setBlossomProgress(p => {
          if (p >= 100) {
            clearInterval(blossomTimerRef.current!);
            // if ('vibrate' in navigator) navigator.vibrate([100, 50, 100]);
            setView('GALLERY');
            setBlossomProgress(0);
            setBlossomHolding(false);
            return 100;
          }
          // if ('vibrate' in navigator) navigator.vibrate(10);
          return p + 2;
        });
      }, 30);
    } else {
      if (blossomTimerRef.current) clearInterval(blossomTimerRef.current);
      setBlossomProgress(0);
    }
    return () => { if (blossomTimerRef.current) clearInterval(blossomTimerRef.current); };
  }, [blossomHolding]);

  const renderLogin = () => (
    <div className="min-h-screen flex items-center justify-center p-4 relative z-10">
      <div className="glass p-8 sm:p-14 rounded-[40px] sm:rounded-[60px] border-2 border-rose-200 shadow-[0_40px_100px_rgba(225,29,72,0.15)] w-full max-w-md text-center space-y-8 sm:space-y-12 animate-reveal-up bg-white/70">
        <div className="relative inline-block">
          <div className="text-6xl sm:text-8xl animate-float">💝</div>
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 rounded-full border-2 border-white animate-ping"></div>
        </div>

        <div className="space-y-3 sm:space-y-4">
          <h1 className="text-4xl sm:text-6xl font-romantic text-rose-950">Privately for Iti</h1>
          <p className="text-rose-700 font-medium tracking-wide text-xs sm:text-sm px-4 italic">A journey I built with words, just for you.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4 sm:space-y-6">
          <div className="space-y-2">
            <p className="text-[10px] text-rose-400 font-black uppercase tracking-[0.3em]">Identity Verification</p>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="YOUR NAME..."
              className="w-full px-6 py-4 sm:py-6 rounded-[25px] sm:rounded-[30px] bg-white/80 border-2 border-rose-100 focus:border-rose-400 focus:outline-none transition-all text-rose-950 text-center text-lg sm:text-xl font-bold tracking-widest shadow-inner placeholder:text-rose-200"
            />
          </div>

          <button
            type="submit"
            className="w-full py-4 sm:py-6 bg-rose-600 text-white rounded-[25px] sm:rounded-[30px] font-black tracking-widest text-base sm:text-lg shadow-2xl hover:bg-rose-700 active:scale-95 transition-all overflow-hidden hover-glow uppercase"
          >
            Enter Your World
          </button>
        </form>

        <p className="text-[10px] text-rose-300 tracking-[0.4em] uppercase font-black">Exclusive Experience 💙</p>
      </div>
    </div>
  );

  const renderCalendar = () => (
    <div className="min-h-screen p-4 sm:p-6 relative z-10 flex flex-col items-center">
      <div className="max-w-6xl w-full mx-auto space-y-8 sm:space-y-16 py-8 sm:py-12">
        <header className="text-center space-y-4 sm:space-y-6 animate-reveal-up">
          <div className="inline-block px-4 py-1.5 glass-dark rounded-full border border-rose-200/50 mb-2">
            <span className="text-rose-900 font-black text-[9px] sm:text-[10px] tracking-[0.3em] uppercase">The Valentine Chronicles</span>
          </div>
          <h1 className="text-4xl sm:text-7xl font-romantic text-rose-950">A Little Universe for Iti</h1>
          <p className="text-rose-700 font-elegant italic text-lg sm:text-3xl shimmer-text px-4">"A celebration of us, one heartbeat at a time."</p>
        </header>

        {/* Elegant Cherry Blossom Entry (The Secret) */}
        <div className="flex flex-col items-center justify-center space-y-6 sm:space-y-10 py-10">
          <div className="relative group flex items-center justify-center">
            {/* Pulsing Back Glow */}
            <div className={`absolute inset-[-40px] sm:inset-[-80px] rounded-full bg-rose-300/20 blur-[60px] sm:blur-[100px] transition-all duration-1000 ${blossomHolding ? 'opacity-100 scale-150' : 'opacity-40 animate-pulse'}`}></div>

            {/* Secret Interaction Area */}
            <div
              onMouseDown={() => setBlossomHolding(true)}
              onMouseUp={() => setBlossomHolding(false)}
              onMouseLeave={() => setBlossomHolding(false)}
              onTouchStart={() => setBlossomHolding(true)}
              onTouchEnd={() => setBlossomHolding(false)}
              className="relative z-20 cursor-pointer select-none"
            >
              {/* Progress Ring */}
              <svg className="absolute inset-[-20px] sm:inset-[-30px] w-[calc(100%+40px)] h-[calc(100%+40px)] sm:w-[calc(100%+60px)] h-[calc(100%+60px)] -rotate-90 pointer-events-none">
                <circle
                  cx="50%"
                  cy="50%"
                  r="45%"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="4"
                  className="text-rose-100/30"
                />
                <circle
                  cx="50%"
                  cy="50%"
                  r="45%"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="4"
                  strokeDasharray="1000"
                  strokeDashoffset={1000 - (blossomProgress * 10)}
                  className="text-rose-400 transition-all duration-300 ease-out"
                />
              </svg>

              {/* The Blinking Blossom */}
              <div className={`text-8xl sm:text-[140px] transition-all duration-500 transform ${blossomHolding ? 'scale-125' : 'scale-100 animate-pulse'}`}>
                🌸
              </div>

              {/* Floating Sparkles when holding */}
              {blossomHolding && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="animate-ping absolute w-full h-full bg-rose-400/20 rounded-full"></div>
                  <div className="text-xl absolute -top-4 -right-4 animate-bounce">✨</div>
                  <div className="text-xl absolute -bottom-4 -left-4 animate-bounce delay-75">✨</div>
                </div>
              )}
            </div>
          </div>

          <div className="text-center space-y-2 animate-reveal-up z-30">
            <h2 className="text-2xl sm:text-3xl font-romantic text-rose-950">Our Secret Path</h2>
            <div className="flex flex-col items-center">
              <p className="text-[10px] sm:text-[11px] text-rose-400 font-black uppercase tracking-[0.3em] shimmer-text">Hold the blossom to bloom our memories...</p>
              <div className="w-12 h-0.5 bg-rose-200 mt-2 rounded-full"></div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-10 px-1 sm:px-2">
          {VALENTINE_DAYS.map((day, index) => {
            const dateReached = isUnlockedByDate(day);
            const userUnlocked = manuallyUnlocked.includes(day.id);

            return (
              <div
                key={day.id}
                onClick={() => handleDayClick(day)}
                style={{ animationDelay: `${index * 0.1}s` }}
                className={`group relative overflow-hidden glass p-4 sm:p-10 rounded-[30px] sm:rounded-[50px] border-2 transition-all duration-1000 cursor-pointer text-center space-y-3 sm:space-y-6 animate-reveal-up hover-glow
                  ${dateReached
                    ? 'border-rose-300 shadow-xl sm:shadow-2xl scale-100 hover:scale-105 active:scale-95 bg-white/60'
                    : 'border-rose-50/30 opacity-60 grayscale scale-95 cursor-not-allowed bg-white/20'}`}
              >
                {dateReached && (
                  <div className="absolute inset-0 bg-rose-100/20 blur-xl rounded-full scale-0 group-hover:scale-150 transition-transform duration-1000"></div>
                )}

                <div className={`relative z-10 text-4xl sm:text-7xl transition-all duration-1000 transform ${dateReached ? 'group-hover:scale-125 group-hover:rotate-[15deg] drop-shadow-xl' : 'filter blur-[8px] opacity-40'}`}>
                  {dateReached ? day.emoji : '🔒'}
                </div>

                <div className="relative z-10 space-y-1 sm:space-y-2">
                  <p className={`text-[8px] sm:text-[10px] font-black uppercase tracking-[0.2em] sm:tracking-[0.4em] ${dateReached ? 'text-rose-500' : 'text-rose-300'}`}>Chapter {day.id}</p>
                  <h3 className="text-lg sm:text-2xl font-romantic text-rose-950 truncate px-1">
                    {dateReached ? day.title : 'Coming Soon'}
                  </h3>
                  <div className={`mx-auto h-0.5 w-6 sm:w-8 rounded-full transition-all duration-700 ${dateReached ? 'bg-rose-400 group-hover:w-16' : 'bg-rose-100'}`}></div>
                  <p className="text-[8px] sm:text-[10px] font-bold text-rose-300 uppercase tracking-[0.1em] pt-1">
                    {new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </p>
                </div>

                {userUnlocked && (
                  <div className="absolute top-2 right-2 sm:top-4 sm:right-4 text-rose-500 animate-pulse text-base sm:text-xl">✨</div>
                )}

                {!dateReached && (
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-white/40 backdrop-blur-[2px]">
                    <span className="text-[8px] sm:text-[10px] font-black tracking-[0.3em] text-rose-400 uppercase">Wait 🌙</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <footer className="text-center py-8 sm:py-16 space-y-6 sm:space-y-8">
          <div className="flex justify-center space-x-2 sm:space-x-4">
            {VALENTINE_DAYS.map(d => (
              <div key={d.id} className={`w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full transition-all duration-1000 shadow-sm ${isUnlockedByDate(d) ? 'bg-rose-500 scale-125' : 'bg-rose-100'}`} />
            ))}
          </div>
          <p className="text-rose-400 font-elegant italic tracking-widest text-base sm:text-xl px-6 shimmer-text">"Our story is my favorite story, Iti."</p>
        </footer>
      </div>
    </div>
  );

  return (
    <div className="relative min-h-screen bg-[#fffafa]">
      <BackgroundEffects />
      {view === 'LOGIN' && renderLogin()}
      {view === 'CALENDAR' && renderCalendar()}
      {view === 'GALLERY' && <MemoryGallery onBack={() => setView('CALENDAR')} />}
      {view === 'DAY_DETAIL' && selectedDay && (
        <DayDetail
          day={selectedDay}
          isInitiallyUnlocked={manuallyUnlocked.includes(selectedDay.id)}
          onBack={() => setView('CALENDAR')}
          onUnlocked={markAsUnlocked}
        />
      )}
    </div>
  );
};

export default App;
