
import React, { useState, useEffect, useRef } from 'react';
import { CHOCOLATE_MESSAGES } from '../constants';
import { ValentineDay } from '../types';
import MusicPlayer from './MusicPlayer';

interface DayDetailProps {
  day: ValentineDay;
  isInitiallyUnlocked: boolean;
  onBack: () => void;
  onUnlocked: (id: number) => void;
}

const MagicalText: React.FC<{ text: string }> = ({ text }) => {
  const words = text.split(' ');
  return (
    <p className="text-lg sm:text-3xl font-elegant italic text-rose-950 leading-relaxed px-2 sm:px-4 magical-text">
      {words.map((word, i) => (
        <span key={i} style={{ animationDelay: `${i * 0.08}s`, marginRight: '0.25em' }}>
          {word}
        </span>
      ))}
    </p>
  );
};

// Heart Burst Effect Component
const HeartBurst: React.FC<{ active: boolean }> = ({ active }) => {
  const [burstHearts, setBurstHearts] = useState<{ id: number; left: number; top: number; size: number; delay: number; angle: number }[]>([]);

  useEffect(() => {
    if (active) {
      const newHearts = Array.from({ length: 20 }).map((_, i) => ({
        id: Date.now() + i,
        left: 50,
        top: 50,
        size: Math.random() * 20 + 10,
        delay: Math.random() * 0.5,
        angle: Math.random() * 360,
      }));
      setBurstHearts(newHearts);
    }
  }, [active]);

  if (!active) return null;

  return (
    <div className="absolute inset-0 pointer-events-none z-50">
      {burstHearts.map((h) => (
        <div
          key={h.id}
          className="absolute text-rose-500 animate-float"
          style={{
            left: `${h.left}%`,
            top: `${h.top}%`,
            fontSize: `${h.size}px`,
            transform: `rotate(${h.angle}deg)`,
            animation: `heart-burst-anim 1s ease-out forwards ${h.delay}s`,
          }}
        >
          ❤️
        </div>
      ))}
      <style>{`
        @keyframes heart-burst-anim {
          0% { transform: translate(-50%, -50%) scale(0); opacity: 1; }
          100% { transform: translate(calc(-50% + (Math.cos(var(--angle)) * 200px)), calc(-50% + (Math.sin(var(--angle)) * 200px))) scale(1.5); opacity: 0; }
        }
      `}</style>
    </div>
  );
};

const DayDetail: React.FC<DayDetailProps> = ({ day, isInitiallyUnlocked, onBack, onUnlocked }) => {
  const [unlocked, setUnlocked] = useState(isInitiallyUnlocked);
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState(false);
  const [interactionState, setInteractionState] = useState<any>(null);
  const [revealStage, setRevealStage] = useState(0);
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>([]);

  // States for various interactions
  const [isHolding, setIsHolding] = useState(false);
  const [holdProgress, setHoldProgress] = useState(0);
  const [multiTouch, setMultiTouch] = useState<{ p1: boolean; p2: boolean }>({ p1: false, p2: false });
  const [vDayStage, setVDayStage] = useState<'START' | 'LIGHTING' | 'UNSEALING' | 'READING' | 'REQUEST'>('START');
  const [litHearts, setLitHearts] = useState<number[]>([]);
  const [showHeartBurst, setShowHeartBurst] = useState(false);

  // Rose Day Match Game States
  const [matchGrid, setMatchGrid] = useState<{ id: number; type: number; matched: boolean; flipped: boolean }[]>([]);
  const [selectedCards, setSelectedCards] = useState<number[]>([]);

  // Teddy Day
  const [teddyState, setTeddyState] = useState<'IDLE' | 'HAPPY' | 'SHY'>('IDLE');
  const [feedbackMsg, setFeedbackMsg] = useState('');

  const holdTimerRef = useRef<number | null>(null);

  useEffect(() => {
    if (unlocked) {
      const timer = setTimeout(() => setRevealStage(1), 500);
      return () => clearTimeout(timer);
    }
  }, [unlocked]);

  // Initialize Rose Matching Game
  useEffect(() => {
    if (day.id === 1 && unlocked) {
      const types = [1, 2, 3, 4]; // 4 pairs
      const grid = [...types, ...types]
        .sort(() => Math.random() - 0.5)
        .map((type, id) => ({ id, type, matched: false, flipped: false }));
      setMatchGrid(grid);
    }
  }, [day.id, unlocked]);

  // const triggerHaptic = (pattern: number | number[]) => {
  //   if ('vibrate' in navigator) {
  //     navigator.vibrate(pattern);
  //   }
  // };

  // ============remove vibration==========
  const ENABLE_HAPTIC = false;

  const triggerHaptic = (pattern: number | number[]) => {
    if (!ENABLE_HAPTIC) return;
    if ('vibrate' in navigator) {
      navigator.vibrate(pattern);
    }
  };

  // ======================================

  const addRipple = (e: React.MouseEvent | React.TouchEvent) => {
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;

    const id = Date.now();
    setRipples((prev) => [...prev, { id, x: clientX, y: clientY }]);
    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== id));
    }, 800);
  };

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode.toUpperCase() === day.passcode.toUpperCase()) {
      triggerHaptic([50, 30, 50]);
      setUnlocked(true);
      onUnlocked(day.id);
    } else {
      setError(true);
      // triggerHaptic(200);
      setTimeout(() => setError(false), 500);
    }
  };

  const handleMatchClick = (id: number) => {
    if (selectedCards.length === 2 || matchGrid[id].matched || matchGrid[id].flipped) return;

    triggerHaptic(20);
    const newGrid = [...matchGrid];
    newGrid[id].flipped = true;
    setMatchGrid(newGrid);

    const newSelected = [...selectedCards, id];
    setSelectedCards(newSelected);

    if (newSelected.length === 2) {
      const [first, second] = newSelected;
      if (matchGrid[first].type === matchGrid[second].type) {
        setTimeout(() => {
          const matchedGrid = matchGrid.map(card =>
            card.id === first || card.id === second ? { ...card, matched: true } : card
          );
          setMatchGrid(matchedGrid);
          setSelectedCards([]);
          triggerHaptic([30, 50, 30]);
          if (matchedGrid.every(c => c.matched)) {
            setInteractionState('MATCH_DONE');
          }
        }, 500);
      } else {
        setTimeout(() => {
          setMatchGrid(matchGrid.map(card =>
            card.id === first || card.id === second ? { ...card, flipped: false } : card
          ));
          setSelectedCards([]);
        }, 800);
      }
    }
  };

  const renderInteraction = () => {
    const InteractiveButton = ({ onClick, children, className = "", onMouseDown, onMouseUp, onTouchStart, onTouchEnd }: any) => (
      <button
        onClick={(e) => { addRipple(e); onClick?.(e); }}
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        className={`relative overflow-hidden group transition-all duration-300 active:scale-95 hover-glow ${className}`}
      >
        {ripples.map((ripple) => (
          <span
            key={ripple.id}
            className="ripple-effect"
            style={{
              position: 'fixed',
              left: ripple.x,
              top: ripple.y,
              width: '100px',
              height: '100px',
              marginLeft: '-50px',
              marginTop: '-50px'
            }}
          />
        ))}
        {children}
      </button>
    );

    switch (day.id) {
      case 1:
        return (
          <div className="space-y-8 text-center py-4 px-2">
            {interactionState !== 'MATCH_DONE' ? (
              <div className="max-w-xs sm:max-w-md mx-auto space-y-6 sm:space-y-8">
                <p className="font-romantic text-2xl sm:text-3xl text-rose-800 italic">"Match the petals to see how unique you are....."</p>
                <div className="grid grid-cols-4 gap-2 sm:gap-3">
                  {matchGrid.map((card) => (
                    <div
                      key={card.id}
                      onClick={() => handleMatchClick(card.id)}
                      className={`aspect-square rounded-xl sm:rounded-2xl glass border-2 transition-all duration-500 cursor-pointer flex items-center justify-center text-2xl sm:text-3xl
                        ${card.flipped || card.matched ? 'bg-white border-rose-300 rotate-0' : 'bg-rose-50 border-white/50 rotate-y-180'}`}
                    >
                      {(card.flipped || card.matched) ? (['🌻', '🌺', '🌼', '🏵️'][card.type - 1]) : '🌹'}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="animate-reveal-up flex flex-col items-center">
                <div className="text-7xl sm:text-9xl animate-float drop-shadow-2xl">🌹</div>
                <div className="mt-8 p-6 sm:p-10 glass rounded-[35px] sm:rounded-[60px] border-2 border-rose-200 shadow-xl bg-white/70">
                  <p className="font-romantic text-2xl sm:text-4xl text-rose-900 leading-relaxed px-2">
                    "Just like these petals, every detail about you is beautiful, Fulei."
                  </p>
                </div>
              </div>
            )}
          </div>
        );

      case 2:
        return (
          // <div className="flex flex-col items-center space-y-8 sm:space-y-12">
          //   <div className="text-center space-y-3 sm:space-y-4 px-4">
          //     <p className="font-romantic text-2xl sm:text-4xl text-rose-800 italic">"Feel my digital pulse, Iti..."</p>
          //     <div className="w-48 sm:w-64 h-2 bg-rose-100 mx-auto rounded-full overflow-hidden">
          //       <div className="h-full bg-rose-500 transition-all duration-100" style={{ width: `${holdProgress}%` }}></div>
          //     </div>
          //   </div>
          //   <InteractiveButton
          //     onMouseDown={() => { setIsHolding(true); triggerHaptic([10, 100, 10]); }}
          //     onMouseUp={() => { setIsHolding(false); setHoldProgress(0); }}
          //     onTouchStart={() => { setIsHolding(true); triggerHaptic([10, 100, 10]); }}
          //     onTouchEnd={() => { setIsHolding(false); setHoldProgress(0); }}
          //     className={`w-32 h-32 sm:w-40 sm:h-40 rounded-full border-4 sm:border-8 border-rose-100 flex items-center justify-center text-4xl sm:text-6xl transition-all duration-500 ${isHolding ? 'scale-110 sm:scale-125 bg-rose-500 text-white shadow-2xl animate-pulse' : 'bg-white text-rose-500'}`}
          //   >
          //     ❤️
          //   </InteractiveButton>
          //   {holdProgress >= 100 && (
          //     <div className="glass p-8 sm:p-12 rounded-[35px] sm:rounded-[60px] border-2 border-rose-300 animate-reveal-up text-center bg-white/80 shadow-xl max-w-sm sm:max-w-lg mx-4">
          //       <p className="font-romantic text-2xl sm:text-4xl text-rose-950 italic leading-relaxed shimmer-text">
          //         "It beats like a drum for you, Iti. Every day."
          //       </p>
          //     </div>
          //   )}
          // </div>

          //edit  from V4===================

          <div className="flex flex-col items-center space-y-10">
            <div className="text-center space-y-4">
              <p className="font-romantic text-3xl text-rose-800">"Hold your thumb here to feel my heart..."</p>
              <div className="w-48 h-1 bg-rose-100 mx-auto rounded-full overflow-hidden">
                <div className="h-full bg-rose-500 transition-all duration-100" style={{ width: `${holdProgress}%` }}></div>
              </div>
            </div>

            <InteractiveButton
              onMouseDown={() => { setIsHolding(true); triggerHaptic([10, 100, 10]); }}
              onMouseUp={() => { setIsHolding(false); setHoldProgress(0); }}
              onTouchStart={() => { setIsHolding(true); triggerHaptic([10, 100, 10]); }}
              onTouchEnd={() => { setIsHolding(false); setHoldProgress(0); }}
              className={`w-32 h-32 rounded-full border-4 border-rose-200 flex items-center justify-center text-5xl transition-all duration-500 ${isHolding ? 'scale-125 bg-rose-500 text-white shadow-[0_0_50px_rgba(225,29,72,0.5)] animate-ping' : 'bg-white text-rose-500'}`}
            >
              ❤️
            </InteractiveButton>

            {holdProgress >= 100 && (
              <div className="glass p-8 rounded-[40px] border-2 border-rose-300 animate-reveal-up text-center">
                <p className="font-romantic text-3xl text-rose-950 italic leading-relaxed">
                  "It beats like this every time I see your name on my screen, Iti."
                </p>
              </div>
            )}
          </div>
          // =========================
        );

      case 3:
        return (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-10 max-w-xs sm:max-w-sm mx-auto p-4">
            {CHOCOLATE_MESSAGES.map((c, i) => (
              <InteractiveButton
                key={c.id}
                onClick={() => { setInteractionState(c.message); triggerHaptic(30); }}
                className="aspect-square glass rounded-[30px] sm:rounded-[40px] flex items-center justify-center text-4xl sm:text-5xl border border-rose-100/30 hover:border-rose-300 group shadow-lg bg-white/40"
              >
                <span className="group-hover:scale-125 group-hover:rotate-12 transition-transform duration-700">
                  {['🍫', '🍩', '🍪', '🍬', '🧁', '🍰'][i]}
                </span>
              </InteractiveButton>
            ))}
            {interactionState && typeof interactionState === 'string' && (
              <div className="col-span-full mt-8 p-6 sm:p-10 glass rounded-[35px] sm:rounded-[60px] border border-rose-200 text-center animate-reveal-up bg-white/70 shadow-lg mx-2">
                <MagicalText text={interactionState} />
              </div>
            )}
          </div>
        );

      case 4:
        return (
          <div className="flex flex-col items-center space-y-8 sm:space-y-12">
            <div className="relative group cursor-pointer" onClick={() => {
              setTeddyState('HAPPY');
              triggerHaptic(50);
              setTimeout(() => setTeddyState('IDLE'), 2000);
            }}>
              <div className={`text-[120px] sm:text-[180px] select-none transition-all duration-500 transform ${teddyState === 'HAPPY' ? 'scale-110' : teddyState === 'SHY' ? 'rotate-12' : ''}`}>
                {teddyState === 'HAPPY' ? '🧸✨' : teddyState === 'SHY' ? '🧸😳' : '🧸'}
              </div>
            </div>
            <div className="flex space-x-3 sm:space-x-4 px-4">
              <InteractiveButton onClick={() => { setTeddyState('SHY'); setFeedbackMsg("Touched me! 🙈"); triggerHaptic(20); }} className="px-4 py-2 sm:px-6 sm:py-3 glass rounded-full text-rose-800 font-bold uppercase tracking-widest text-[10px]">Pinch</InteractiveButton>
              <InteractiveButton onClick={() => { setTeddyState('HAPPY'); setFeedbackMsg("Yay! Head scratches! 🥰"); triggerHaptic(10); }} className="px-4 py-2 sm:px-6 sm:py-3 glass rounded-full text-rose-800 font-bold uppercase tracking-widest text-[10px]">Pat</InteractiveButton>
            </div>
            <div className="h-10 text-center px-4">
              <p className="text-rose-600 font-romantic text-xl sm:text-3xl animate-bounce">{feedbackMsg || "Spend time with Iti's Teddy..."}</p>
            </div>
          </div>
        );

      case 5:
        {
          const promises = ["Honesty", "Respect", "Safety", "Kindness", "Patience"];
          return (
            <div className="flex flex-col items-center space-y-8 sm:space-y-12 py-6 px-4">
              <p className="font-romantic text-2xl sm:text-3xl text-rose-800 text-center italic">"Connect the stars of my promises, Iti."</p>
              <div className="relative w-full max-w-sm h-48 sm:h-64 glass rounded-[30px] sm:rounded-[50px] overflow-hidden bg-rose-950/20 border-2 border-rose-100 flex items-center justify-center">
                <div className="grid grid-cols-3 gap-6 sm:gap-8">
                  {promises.map((p, i) => (
                    <div
                      key={p}
                      onClick={() => {
                        if (!litHearts.includes(i)) {
                          setLitHearts([...litHearts, i]);
                          triggerHaptic(30);
                        }
                      }}
                      className={`w-10 h-10 sm:w-14 sm:h-14 rounded-full flex items-center justify-center transition-all duration-1000 cursor-pointer
                          ${litHearts.includes(i) ? 'bg-yellow-200 text-rose-900 scale-125 shadow-[0_0_15px_#fef08a]' : 'bg-rose-100/20 text-white/40 grayscale'}`}
                    >
                      ✨
                    </div>
                  ))}
                </div>
              </div>
              {litHearts.length >= promises.length && (
                <div className="animate-reveal-up p-6 sm:p-10 glass rounded-[35px] sm:rounded-[60px] border-2 border-rose-400 bg-white/95 shadow-xl text-center">
                  <p className="text-rose-950 font-romantic text-2xl sm:text-4xl italic leading-relaxed px-2">
                    "I'll keep your heart safe in my constellations, Iti."
                  </p>
                </div>
              )}
            </div>
          );
        }

      // upgrade from chatgpt =============================================================
      // {
      //   const promises = ["Honesty", "Respect", "Safety", "Kindness", "Patience"];

      //   return (
      //     <div className="flex flex-col items-center space-y-10 py-6 px-4">
      //       <p className="font-romantic text-2xl sm:text-3xl text-rose-800 text-center italic">
      //         "Connect the stars of my promises, Iti."
      //       </p>

      //       {/* Sky */}
      //       <div
      //         className="relative w-full max-w-xs sm:max-w-sm h-80 glass rounded-[40px]
      //            bg-gradient-to-b from-rose-900/30 to-rose-950/40
      //            border border-rose-200 flex items-center justify-center"
      //       >
      //         {/* Vertical guide line */}
      //         <div className="absolute w-[2px] h-[75%] bg-rose-200/30" />

      //         {/* Stars column */}
      //         <div className="relative flex flex-col items-center gap-8 sm:gap-10">
      //           {promises.map((p, i) => {
      //             const active = litHearts.includes(i);
      //             const canActivate = i === litHearts.length;

      //             return (
      //               <div
      //                 key={p}
      //                 onClick={() => {
      //                   if (canActivate) {
      //                     setLitHearts((prev) => [...prev, i]);
      //                     triggerHaptic(40);
      //                   }
      //                 }}
      //                 className={`relative cursor-pointer transition-all duration-700
      //           ${active ? "scale-125" : "opacity-50"}
      //           ${canActivate ? "opacity-100" : "pointer-events-none"}`}
      //               >
      //                 {/* Star */}
      //                 <div
      //                   className={`w-12 h-12 sm:w-16 sm:h-16 rounded-full
      //             flex items-center justify-center
      //             animate-[float_4s_ease-in-out_infinite]
      //             ${active
      //                       ? "bg-yellow-200 text-rose-900 shadow-[0_0_20px_#fef08a]"
      //                       : "bg-white/10 text-white/40"
      //                     }`}
      //                 >
      //                   ✨
      //                 </div>

      //                 {/* Promise label */}
      //                 {active && (
      //                   <span
      //                     className="absolute left-16 sm:left-20 top-1/2 -translate-y-1/2
      //                        text-xs sm:text-sm italic text-yellow-100
      //                        animate-fade-in whitespace-nowrap"
      //                   >
      //                     {p}
      //                   </span>
      //                 )}
      //               </div>
      //             );
      //           })}
      //         </div>
      //       </div>

      //       {/* Final Reveal */}
      //       {litHearts.length === promises.length && (
      //         <div className="animate-reveal-up p-8 sm:p-12 glass rounded-[50px]
      //                 bg-white/95 border border-rose-400 shadow-2xl text-center">
      //           <p className="font-romantic text-2xl sm:text-4xl italic text-rose-900 leading-relaxed">
      //             "I'll keep your heart safe<br />in my constellations, Iti."
      //           </p>
      //         </div>
      //       )}
      //     </div>
      //   );
      // }
      // ==================================================================================

      case 6:
        return (
          <div className="relative h-[400px] sm:h-[480px] w-full max-w-xs sm:max-w-sm mx-auto flex flex-col items-center justify-center overflow-hidden rounded-[40px] sm:rounded-[80px] glass border-2 border-rose-200 shadow-xl">
            {!interactionState ? (
              <div className="text-center space-y-8 sm:space-y-12 px-6">
                <p className="font-romantic text-2xl sm:text-4xl text-rose-800 leading-tight italic">"Place both palms to close the gap, Iti..."</p>
                <div className="flex flex-col space-y-6 sm:space-y-10">
                  <div
                    onPointerDown={() => { setMultiTouch(p => ({ ...p, p1: true })); triggerHaptic(10); }}
                    onPointerUp={() => setMultiTouch(p => ({ ...p, p1: false }))}
                    className={`w-24 h-24 sm:w-32 h-32 rounded-full glass border-2 sm:border-4 flex items-center justify-center text-4xl sm:text-5xl transition-all duration-500 ${multiTouch.p1 ? 'bg-rose-500 border-rose-300 scale-110 sm:scale-125 shadow-xl' : 'border-rose-100 opacity-60'}`}
                  >
                    👋
                  </div>
                  <div
                    onPointerDown={() => { setMultiTouch(p => ({ ...p, p2: true })); triggerHaptic(10); }}
                    onPointerUp={() => setMultiTouch(p => ({ ...p, p2: false }))}
                    className={`w-24 h-24 sm:w-32 h-32 rounded-full glass border-2 sm:border-4 flex items-center justify-center text-4xl sm:text-5xl transition-all duration-500 ${multiTouch.p2 ? 'bg-rose-500 border-rose-300 scale-110 sm:scale-125 shadow-xl' : 'border-rose-100 opacity-60'}`}
                  >
                    👋
                  </div>
                </div>
                {(multiTouch.p1 && multiTouch.p2) && (
                  <button
                    onClick={() => { setInteractionState(true); triggerHaptic([200, 300, 500, 800, 1500]); }}
                    className="mt-4 px-8 py-4 bg-rose-600 text-white rounded-full font-black tracking-widest animate-bounce shadow-xl text-sm"
                  >
                    HUG ME, ITI
                  </button>
                )}
              </div>
            ) : (
              <div className="absolute inset-0 bg-rose-600 flex flex-col items-center justify-center animate-pulse p-6 text-center space-y-6">
                <div className="text-7xl sm:text-9xl mb-2 scale-125 sm:scale-150 drop-shadow-xl">🤗</div>
                <p className="text-white font-romantic text-4xl sm:text-6xl leading-tight">Hold Tight.</p>
                <p className="text-white/90 font-elegant italic text-lg sm:text-2xl leading-relaxed px-2">
                  "Can you feel it, Iti? The way the world stops?"
                </p>
                <InteractiveButton
                  onClick={() => setInteractionState(false)}
                  className="mt-8 text-white/50 text-[8px] uppercase tracking-[0.4em] font-black border-b border-white/30 pb-1"
                >
                  (Pause the Embrace)
                </InteractiveButton>
              </div>
            )}
          </div>
        );

      case 7:
        return (
          // <div className="flex flex-col items-center space-y-8 sm:space-y-12 py-10 px-4">
          //   <p className="font-romantic text-2xl sm:text-3xl text-rose-800 text-center italic">"Blow a kiss to the heart, Iti..."</p>
          //   <InteractiveButton onMouseDown={() => { setIsHolding(true); triggerHaptic(50); }} onMouseUp={() => setIsHolding(false)} onTouchStart={() => { setIsHolding(true); triggerHaptic(50); }} onTouchEnd={() => setIsHolding(false)} className={`w-32 h-32 sm:w-40 sm:h-40 rounded-full glass border-2 sm:border-4 flex items-center justify-center transition-all duration-1000 ${isHolding ? 'border-rose-500 scale-125 sm:scale-150 shadow-2xl' : 'border-rose-100 shadow-lg'}`}>
          //     <div className={`text-4xl sm:text-6xl transition-transform duration-1000 ${isHolding ? 'scale-125 sm:scale-150 animate-pulse' : 'scale-100'}`}>😘</div>
          //   </InteractiveButton>
          //   {isHolding && <div className="fixed inset-0 pointer-events-none bg-rose-400/10 backdrop-blur-[1px] animate-pulse z-0"></div>}
          // </div>

          // edit from v4 =====================================================
          <div className="flex flex-col items-center space-y-12">
            <p className="font-romantic text-3xl text-rose-800 text-center px-4 leading-relaxed">
              "Place your finger on the heart and blow a kiss to the screen..."
            </p>
            <InteractiveButton
              onMouseDown={() => { setIsHolding(true); triggerHaptic(50); }}
              onMouseUp={() => setIsHolding(false)}
              onTouchStart={() => { setIsHolding(true); triggerHaptic(50); }}
              onTouchEnd={() => setIsHolding(false)}
              className={`w-40 h-40 rounded-full glass border-4 flex items-center justify-center transition-all duration-1000 ${isHolding ? 'border-rose-500 scale-150 shadow-[0_0_100px_rgba(225,29,72,0.6)]' : 'border-rose-100 shadow-xl'}`}
            >
              <div className={`text-6xl transition-transform duration-1000 ${isHolding ? 'scale-150 animate-pulse' : 'scale-100'}`}>😘</div>
            </InteractiveButton>
            {isHolding && (
              <div className="fixed inset-0 pointer-events-none bg-rose-400/10 backdrop-blur-[2px] animate-pulse"></div>
            )}
            <div className={`transition-all duration-1000 text-center ${holdProgress >= 100 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <p className="font-romantic text-4xl text-rose-950 shimmer-text">"That one reached my soul, Iti."</p>
            </div>
          </div>
          //===================================================================
        );

      case 8:
        const handleHeartLight = (id: number) => {
          if (!litHearts.includes(id)) {
            setLitHearts([...litHearts, id]);
            triggerHaptic(30);
            if (litHearts.length + 1 === 5) {
              setTimeout(() => {
                setVDayStage('UNSEALING');
                triggerHaptic([100, 50, 100]);
              }, 1000);
            }
          }
        };

        if (vDayStage === 'START') {
          return (
            <div className="text-center py-10 sm:py-20 space-y-8 sm:space-y-10 animate-reveal-up px-6">
              <h2 className="text-4xl sm:text-6xl font-romantic text-rose-950 glow-effect">Happy Valentine's Day, Iti.</h2>
              <p className="text-rose-700 italic font-elegant text-xl sm:text-2xl">"A special final path waiting for you..."</p>
              <InteractiveButton
                onClick={() => setVDayStage('LIGHTING')}
                className="px-10 py-5 sm:px-14 sm:py-7 bg-rose-600 text-white rounded-full font-black tracking-widest shadow-2xl text-base sm:text-xl uppercase"
              >
                ENTER OUR FINAL CHAPTER
              </InteractiveButton>
            </div>
          );
        }

        if (vDayStage === 'LIGHTING') {
          return (
            <div className="relative h-72 sm:h-96 w-full flex flex-col items-center justify-center px-4">
              <p className="font-romantic text-2xl sm:text-4xl text-rose-900 mb-10 sm:mb-16 text-center italic">"Light 5 hearts for Iti..."</p>
              <div className="flex space-x-3 sm:space-x-6">
                {[1, 2, 3, 4, 5].map(i => (
                  <div
                    key={i}
                    onClick={() => handleHeartLight(i)}
                    className={`text-4xl sm:text-6xl cursor-pointer transition-all duration-1000 transform hover:scale-110 ${litHearts.includes(i) ? 'drop-shadow-xl grayscale-0 scale-110' : 'grayscale opacity-20 scale-100'}`}
                  >
                    ❤️
                  </div>
                ))}
              </div>
            </div>
          );
        }

        if (vDayStage === 'UNSEALING') {
          const sealScale = 1 + (holdProgress / 200);
          return (
            <div className="flex flex-col items-center justify-center h-[400px] sm:h-[500px] py-6 animate-reveal-up px-4 relative">
              <div
                className="absolute inset-0 pointer-events-none transition-all duration-100 rounded-full blur-[80px] sm:blur-[120px]"
                style={{
                  backgroundColor: `rgba(225, 29, 72, ${holdProgress / 250})`,
                  transform: `scale(${1 + holdProgress / 50})`
                }}
              />

              <p className="font-romantic text-3xl sm:text-5xl text-rose-950 text-center mb-8 sm:mb-12 z-10 italic">A Secret Letter for Iti</p>

              <div className="relative z-10">
                <InteractiveButton
                  onMouseDown={() => setIsHolding(true)}
                  onMouseUp={() => { setIsHolding(false); setHoldProgress(0); }}
                  onTouchStart={() => setIsHolding(true)}
                  onTouchEnd={() => { setIsHolding(false); setHoldProgress(0); }}
                  className={`relative z-10 w-48 h-64 sm:w-64 sm:h-80 glass rounded-[30px] sm:rounded-[40px] border-2 sm:border-4 border-rose-100 flex flex-col items-center justify-center shadow-2xl transition-all duration-300 ${isHolding ? 'border-rose-400' : 'scale-100'}`}
                >
                  <div className="w-16 sm:w-24 h-1.5 sm:h-2 bg-rose-50 mb-12 sm:mb-20 rounded-full"></div>
                  <div
                    className={`w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-rose-900 border-4 sm:border-8 border-rose-50 flex items-center justify-center text-white font-black text-2xl sm:text-4xl shadow-xl transition-all duration-100`}
                    style={{ transform: `scale(${sealScale})` }}
                  >
                    ITI
                  </div>
                  <p className="mt-8 sm:mt-12 text-[10px] sm:text-[14px] font-black uppercase tracking-[0.3em] text-rose-400">Hold to Open</p>
                  <div className="absolute bottom-6 sm:bottom-10 left-6 right-6 sm:left-10 sm:right-10 h-2 bg-rose-50/50 rounded-full overflow-hidden">
                    <div className="h-full bg-rose-600 transition-all duration-100" style={{ width: `${holdProgress}%` }}></div>
                  </div>
                </InteractiveButton>
              </div>
            </div>
          );
        }

        if (vDayStage === 'READING') {
          return (
            <div className="animate-reveal-up space-y-12 sm:space-y-20 py-6 px-4 max-w-2xl mx-auto">
              <div className="glass p-8 sm:p-20 rounded-[40px] sm:rounded-[80px] border-2 border-rose-100 shadow-2xl space-y-8 sm:space-y-12 bg-white/95">
                <div className="flex justify-center mb-6">
                  <span className="text-6xl sm:text-8xl animate-float">💌</span>
                </div>
                <h2 className="text-3xl sm:text-5xl font-romantic text-rose-950 text-center border-b border-rose-100 pb-6 sm:pb-8">Dearest Iti,</h2>
                <div className="space-y-6 sm:space-y-10 text-rose-900 font-elegant italic text-lg sm:text-3xl leading-relaxed text-center px-2">
                  <p>"This was more than just words. It was my heart reaching yours across the miles."</p>
                  <p>"Every petal, every promise, every hug was for you: you are truly, deeply important to me."</p>
                  <p>"Thank you for being Iti. You've turned this week into magic."</p>
                </div>
                <div className="pt-8 sm:pt-16 flex flex-col items-center">
                  <div className="w-12 h-0.5 bg-rose-200 mb-6"></div>
                  <p className="font-romantic text-3xl sm:text-5xl text-rose-600">Forever yours. ❤️</p>
                </div>
              </div>
              <div className="flex justify-center">
                <InteractiveButton
                  onClick={() => setVDayStage('REQUEST')}
                  className="px-8 py-4 sm:px-14 sm:py-6 glass-dark rounded-full border border-rose-200 text-rose-950 font-black tracking-widest uppercase italic shadow-lg text-xs sm:text-base"
                >
                  The Last Question...
                </InteractiveButton>
              </div>
            </div>
          );
        }

        return (
          <div className="space-y-12 sm:space-y-16 text-center py-6 px-4 animate-reveal-up">
            <div className="relative group">
              <div className="absolute inset-[-60px] bg-rose-400/10 blur-[100px] rounded-full animate-pulse"></div>
              <h3 className="relative z-10 text-3xl sm:text-8xl font-romantic text-rose-950 px-4 leading-tight italic">
                "Iti, would you make this digital world real and meet me someday?"
              </h3>
            </div>
            <div className="flex flex-col space-y-4 sm:space-y-8 max-w-[320px] sm:max-w-[400px] mx-auto pt-6">
              <div className="relative">
                <HeartBurst active={showHeartBurst} />
                <InteractiveButton
                  onClick={() => {
                    setInteractionState('YES');
                    setShowHeartBurst(true);
                    triggerHaptic([50, 100, 150, 200]);
                  }}
                  className="w-full px-8 py-5 sm:px-14 sm:py-7 bg-rose-600 text-white rounded-[30px] sm:rounded-[40px] shadow-2xl font-black tracking-[0.2em] text-lg sm:text-2xl hover:-translate-y-1 uppercase"
                >
                  YES, I'D LOVE THAT! ✨
                </InteractiveButton>
              </div>
              <InteractiveButton
                onClick={() => { setInteractionState('SOON'); triggerHaptic(100); }}
                className="px-8 py-4 sm:px-14 sm:py-6 glass rounded-[30px] sm:rounded-[40px] text-rose-950 font-black border border-rose-200 tracking-widest text-xs sm:text-base uppercase"
              >
                Give me time...
              </InteractiveButton>
            </div>
            {interactionState && typeof interactionState === 'string' && (
              <div className="mt-12 p-8 sm:p-16 glass rounded-[35px] sm:rounded-[80px] border-2 border-rose-300 shadow-2xl animate-reveal-up bg-white/95 mx-2">
                <p className="text-rose-950 font-romantic text-2xl sm:text-6xl leading-snug shimmer-text">
                  {interactionState === 'YES'
                    ? "You just made my entire world, Iti. 💙"
                    : "No pressure, Iti. I'll be waiting. 🌸"}
                </p>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  useEffect(() => {
    if (isHolding) {
      holdTimerRef.current = window.setInterval(() => {
        setHoldProgress(p => {
          if (p >= 100) {
            clearInterval(holdTimerRef.current!);
            if (day.id === 8) {
              setVDayStage('READING');
              triggerHaptic([50, 100, 150]);
            }
            return 100;
          }
          return p + 2;
        });
        triggerHaptic(15);
      }, 50);
    } else {
      if (holdTimerRef.current) clearInterval(holdTimerRef.current);
    }
    return () => { if (holdTimerRef.current) clearInterval(holdTimerRef.current); };
  }, [isHolding, day.id]);

  if (!unlocked) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-rose-50/95 backdrop-blur-[30px] animate-fade-in overflow-hidden">
        <button onClick={onBack} className="absolute top-6 left-6 p-4 text-rose-400 glass rounded-full shadow-lg active:scale-90 bg-white/40">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
        </button>

        <div className={`w-full max-w-sm glass p-8 sm:p-16 rounded-[40px] sm:rounded-[70px] border-2 shadow-xl transition-all duration-700 ${error ? 'border-red-400 animate-shake bg-red-50/20' : 'border-rose-200 bg-white/70'}`}>
          <div className="relative mb-6 sm:mb-10 flex justify-center">
            <div className="text-7xl sm:text-9xl drop-shadow-xl animate-bounce">{day.emoji}</div>
          </div>

          <div className="space-y-3 sm:space-y-4 text-center mb-8">
            <h2 className="text-3xl sm:text-4xl font-romantic text-rose-950">Unlock {day.title}</h2>
            <div className="inline-block px-3 py-1 bg-rose-100/50 rounded-full">
              <p className="text-[9px] text-rose-700 uppercase font-black tracking-widest">A secret key for Iti</p>
            </div>
          </div>

          <form onSubmit={handleUnlock} className="space-y-6 sm:space-y-8">
            <div className="space-y-2">
              <input
                type="text"
                value={passcode}
                onChange={(e) => { setPasscode(e.target.value); setError(false); }}
                placeholder="CODE..."
                className={`w-full px-6 py-4 sm:py-6 rounded-[25px] sm:rounded-[35px] bg-white border-2 ${error ? 'border-red-300 text-red-500 ring-2 ring-red-100' : 'border-rose-100 text-rose-950'} text-center text-xl sm:text-2xl font-black uppercase tracking-[0.4em] outline-none shadow-inner focus:border-rose-500 transition-all placeholder:text-rose-100`}
                autoFocus
              />
              {error && (
                <p className="text-red-500 text-[10px] font-bold text-center mt-2 animate-pulse uppercase tracking-widest">Incorrect Key. Try again?</p>
              )}
            </div>
            <button type="submit" className="w-full py-4 sm:py-6 bg-rose-600 text-white rounded-[25px] sm:rounded-[35px] font-black tracking-widest shadow-xl hover:bg-rose-700 active:scale-95 transition-all uppercase text-base">Reveal Chapter</button>
          </form>
          <p className="text-center mt-12 text-[10px] uppercase font-black text-rose-300 tracking-[0.4em] italic">Hint: Try "{day.passcode.toLowerCase()}"</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#fffafa] overflow-y-auto overflow-x-hidden">
      <div className="sticky top-0 z-50 w-full glass px-4 sm:px-12 py-4 sm:py-6 flex items-center justify-between border-b border-rose-100/30">
        <button onClick={onBack} className="p-3 sm:p-4 text-rose-900 glass rounded-[15px] sm:rounded-[25px] bg-white/40 shadow-sm border border-white/60">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 sm:h-7 sm:w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" /></svg>
        </button>
        <div className="text-center">
          <h4 className="text-[9px] sm:text-[11px] font-black text-rose-400 uppercase tracking-[0.3em]">{day.theme}</h4>
          <h3 className="text-xl sm:text-4xl font-romantic text-rose-950 truncate max-w-[150px] sm:max-w-none">Chapter {day.id}: {day.title}</h3>
        </div>
        <div className="w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center text-2xl sm:text-4xl glass-dark rounded-[15px] sm:rounded-[25px] shadow-inner border border-rose-200/50">
          {day.emoji}
        </div>
      </div>

      <main className="flex-1 w-full max-w-4xl mx-auto px-4 sm:px-8 py-12 sm:py-20 space-y-12 sm:space-y-24">
        <section className={`transition-all duration-1000 ease-out transform ${revealStage >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}>
          <div className="text-center space-y-8 sm:space-y-12">
            <div className="inline-flex items-center space-x-3 px-6 py-2 glass-dark rounded-full border border-rose-200/50">
              <div className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></div>
              <span className="text-rose-900 font-black text-[9px] sm:text-[12px] tracking-[0.2em] uppercase italic">Designed with care for Iti</span>
            </div>

            <h1 className="text-5xl sm:text-9xl font-romantic text-rose-900 drop-shadow-xl animate-float px-4">{day.emoji} {day.title}</h1>

            <div className="relative p-8 sm:p-20 glass rounded-[40px] sm:rounded-[80px] border border-rose-100/50 shadow-xl bg-white/50 backdrop-blur-3xl overflow-hidden mx-2">
              <MagicalText text={day.content} />
            </div>
          </div>
        </section>

        <section className={`transition-all duration-1000 delay-500 transform ${revealStage >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'} pb-40`}>
          {renderInteraction()}
        </section>
      </main>

      <MusicPlayer url={day.musicUrl} />

      <footer className="fixed bottom-0 w-full glass-dark py-4 px-6 sm:px-12 flex justify-between items-center border-t border-rose-200/20 backdrop-blur-[20px]">
        <p className="text-[9px] font-black tracking-[0.3em] text-rose-400 uppercase italic">Your Sanctuary 💙</p>
        <div className="flex space-x-1.5 sm:space-x-3">
          {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
            <div key={i} className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full transition-all duration-1000 ${day.id === i ? 'bg-rose-500 scale-125 sm:scale-150' : 'bg-rose-200'}`} />
          ))}
        </div>
      </footer>
    </div>
  );
};

export default DayDetail;
