
import React, { useState, useEffect, useRef } from 'react';
import { CHOCOLATE_MESSAGES } from '../constants';
import { ValentineDay } from '../types';
import MusicPlayer from './MusicPlayer';
// ================ framer add ===================
// import { motion } from "framer-motion";
import { motion, AnimatePresence } from "framer-motion";
// =====================emailJs===============================
import emailjs from '@emailjs/browser';
// ==============================================================


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

  // ++++++++++++++++++++++++++++++ new add +++++++++++++++++++++++++
  // ----teddy----
  const [teddyAction, setTeddyAction] = useState("IDLE");
  const [feedbackMsg, setFeedbackMsg] = useState("");
  //  ----hug ----------
  // Use local states within the component:
  const [isHugActive, setIsHugActive] = useState(false);
  const [hugComplete, setHugComplete] = useState(false);
  const [progress, setProgress] = useState(0);
  // ------ valentine ---------
  //............................ emailJs ..............................................
  const getFormattedTime = () => {
    return new Date().toLocaleString('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
      day: 'numeric',
      month: 'short'
    });
  };
  const sendItiResponse = (choice: 'YES' | 'SOON') => {
    // These keys match the {{title}} and {{message}} in your screenshot
    const templateParams = {
      title: choice === 'YES' ? "SHE SAID YES! 💖" : "She needs more time 🌸",
      message: choice === 'YES'
        ? "Iti would love to meet you someday! The digital world is becoming real."
        : "Iti clicked 'Give me a little time'. No pressure, keep waiting! 🌸",
      response_time: getFormattedTime(), // <--- THIS ADDS THE TIME
    };

    emailjs.send(
      'service_hhttvtr',   // Found in "Email Services"
      'template_f1m8weu',  // Found in "Email Templates"
      templateParams,
      '66lYwMRciiumrDleL'    // Found in "Account > API Keys"
    )
      .then(() => console.log('Response sent!'))
      .catch((err) => console.error('Failed to send:', err));
  };
  // ......................................................................................

  // ++++++++++++++++++++++++++++++
  // const [teddyState, setTeddyState] = useState<'IDLE' | 'HAPPY' | 'SHY'>('IDLE');
  // const [feedbackMsg, setFeedbackMsg] = useState('');

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
                  "It beats like this every time I am thinking about you, Iti."
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
                  {['🍫', '🍩', '🍪', '🍬', '🧁', '🍭'][i]}
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

      // ================== new update teddy =========================================
      case 4:
        return (
          <div className="relative h-[70vh] w-full flex flex-col items-center justify-center overflow-hidden touch-none">

            {/* 1. HUD / STATUS BARS */}
            <div className="absolute top-0 left-0 w-full p-6 flex justify-between items-start z-50">
              <div className="glass p-3 rounded-2xl flex flex-col gap-2 border border-white/40">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-rose-600">LOVE</span>
                  <div className="w-24 h-2 bg-pink-100 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-rose-500"
                      animate={{ width: teddyAction === "HUG" ? "100%" : "60%" }}
                    />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-yellow-600">JOY</span>
                  <div className="w-24 h-2 bg-yellow-100 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-yellow-500"
                      animate={{ width: teddyAction === "SPIN" || teddyAction === "DANCE" ? "100%" : "40%" }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* 2. THE FLOATING TEDDY (Hug Pulse + Spin + Tickle Logic) */}
            <motion.div
              drag
              dragConstraints={{ left: -50, right: 50, top: -50, bottom: 50 }}
              dragElastic={0.2}
              animate={{
                // HUG: Gentle Pulse + Sway | SPIN: Linear Loop | TICKLE: Jitter
                rotate: teddyAction === "SPIN" ? 360 :
                  teddyAction === "DANCE" ? [0, -8, 8, -8, 8, 0] :
                    teddyAction === "HUG" ? [0, -3, 3, 0] : 0,

                scale: teddyAction === "HUG" ? [1, 1.15, 1.05] : 1,

                x: teddyAction === "DANCE" ? [0, -3, 3, -3, 3, 0] : 0,
              }}
              transition={{
                rotate: teddyAction === "SPIN"
                  ? { repeat: Infinity, duration: 3, ease: "linear" }
                  : teddyAction === "HUG"
                    ? { repeat: Infinity, duration: 2, ease: "easeInOut" }
                    : { duration: 0.2 },

                scale: teddyAction === "HUG"
                  ? { repeat: Infinity, duration: 1.5, ease: "easeInOut" }
                  : { duration: 0.3 }
              }}
              className="relative z-10"
            >
              {/* Glow Aura - intensifies during hug */}
              <motion.div
                animate={{ opacity: teddyAction === "HUG" ? 0.6 : 0.2, scale: teddyAction === "HUG" ? 1.2 : 1 }}
                className="absolute inset-0 bg-rose-400 blur-[80px] rounded-full"
              />

              <div className="text-[180px] sm:text-[220px] select-none filter drop-shadow-2xl">
                {teddyAction === "SPIN" ? "🧸" :
                  teddyAction === "DANCE" ? "🧸" :
                    teddyAction === "HUG" ? "🧸" : "🧸"}
              </div>
            </motion.div>

            {/* 3. CONTROL PADS */}
            <div className="absolute bottom-6 flex gap-3 w-full px-6 justify-center z-50">
              {/* HUG BUTTON (With Pulse Movement) */}
              <motion.button
                onTapStart={() => {
                  setTeddyAction("HUG");
                  setFeedbackMsg("Teddy feels the love! 💖🥰");
                  triggerHaptic([20, 10, 20]);
                }}
                onTap={() => setTeddyAction("IDLE")}
                className="flex-1 py-4 glass rounded-2xl border border-white/50 shadow-lg flex flex-col items-center justify-center active:bg-pink-100/50 transition-colors"
              >
                <span className="text-xl">🤗</span>
                <span className="text-[9px] font-black opacity-60 uppercase">Hold Hug</span>
              </motion.button>

              {/* SPIN BUTTON */}
              <motion.button
                onClick={() => {
                  if (teddyAction === "SPIN") {
                    setTeddyAction("IDLE");
                    setFeedbackMsg("Stopping for a rest... 🛑");
                  } else {
                    setTeddyAction("SPIN");
                    setFeedbackMsg("Wheee! Spinning! 🌀");
                    triggerHaptic(30);
                  }
                }}
                className={`flex-1 py-4 glass rounded-2xl border border-white/50 shadow-lg flex flex-col items-center justify-center transition-colors ${teddyAction === "SPIN" ? "bg-purple-200/50" : ""}`}
              >
                <span className={`text-xl ${teddyAction === "SPIN" ? "animate-spin" : ""}`}>🌀</span>
                <span className="text-[9px] font-black opacity-60 uppercase">{teddyAction === "SPIN" ? "Stop" : "Spin"}</span>
              </motion.button>

              {/* TICKLE BUTTON */}
              <motion.button
                onClick={() => {
                  setTeddyAction("DANCE");
                  setFeedbackMsg("Hehe! Tickles! 😂");
                  triggerHaptic([10, 10, 10, 10]);
                  setTimeout(() => setTeddyAction("IDLE"), 1000);
                }}
                className="flex-1 py-4 glass rounded-2xl border border-white/50 shadow-lg flex flex-col items-center justify-center active:bg-yellow-100/50 transition-colors"
              >
                <span className="text-xl">⚡</span>
                <span className="text-[9px] font-black opacity-60 uppercase">Tickle</span>
              </motion.button>
            </div>

            {/* Feedback Message */}
            <div className="absolute bottom-36 w-full text-center pointer-events-none">
              <motion.p
                key={feedbackMsg}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="font-romantic text-2xl text-rose-600 px-10 leading-tight"
              >
                {feedbackMsg}
              </motion.p>
            </div>
          </div>
        );
      // ================================================= teddy end ============================

      // ========================= update promise ============================
      case 5: {
        const promises = [
          { text: "Honesty", icon: "💎" },
          { text: "Respect", icon: "🛡️" },
          { text: "Safety", icon: "🏡" },
          { text: "Kindness", icon: "🕊️" },
          { text: "Patience", icon: "⏳" }
        ];

        return (
          <div className="relative h-full w-full flex flex-col items-center bg-transparent touch-none overflow-hidden">

            {/* 1. TOP HEADER SECTION */}
            <div className="pt-6 pb-2 text-center z-20 shrink-0">
              <h2 className="text-rose-800 font-romantic text-3xl sm:text-4xl px-4">
                Celestial Vows
              </h2>
              <p className="text-rose-500/60 text-[10px] font-black uppercase tracking-[0.3em] mt-1">
                Seal each promise to light our path
              </p>
            </div>

            {/* 2. THE INTERACTIVE SCROLLABLE GALAXY */}
            <div className="relative w-full flex-1 overflow-y-auto overflow-x-hidden px-6 py-10 scrollbar-hide">

              {/* DYNAMIC SVG CONNECTOR */}
              {/* We use a simplified vertical connector for guaranteed mobile alignment */}
              <svg className="absolute left-1/2 top-0 h-full w-1 -translate-x-1/2 pointer-events-none">
                <line x1="50%" y1="0" x2="50%" y2="100%" stroke="#ffe4e6" strokeWidth="2" strokeDasharray="8 4" />
                <motion.line
                  initial={{ height: 0 }}
                  animate={{ height: `${(litHearts.length / promises.length) * 100}%` }}
                  x1="50%" y1="0" x2="50%" y2="100%"
                  stroke="#fb7185" strokeWidth="3"
                  style={{ filter: 'drop-shadow(0 0 8px #fb7185)' }}
                />
              </svg>

              <div className="relative flex flex-col items-center gap-16 z-10">
                {promises.map((p, i) => {
                  const isLit = litHearts.includes(i);
                  const canLit = i === 0 || litHearts.includes(i - 1);

                  return (
                    <motion.div
                      key={p.text}
                      initial={{ opacity: 0, x: i % 2 === 0 ? -50 : 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      className={`relative flex items-center ${i % 2 === 0 ? 'self-start' : 'self-end'}`}
                    >
                      <motion.button
                        onClick={() => {
                          if (!isLit && canLit) {
                            setLitHearts([...litHearts, i]);
                            triggerHaptic(50);
                          }
                        }}
                        whileTap={{ scale: 0.9 }}
                        className={`group flex items-center gap-3 p-2 rounded-2xl transition-all duration-700 border-2
                          ${isLit
                            ? 'bg-white border-rose-300 shadow-xl'
                            : canLit ? 'bg-white/60 border-rose-100 animate-pulse' : 'bg-rose-50/30 border-transparent opacity-40'}`}
                      >
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl transition-all duration-1000
                          ${isLit ? 'bg-rose-500 text-white rotate-[360deg]' : 'bg-rose-100 text-rose-300'}`}>
                          {isLit ? "✨" : p.icon}
                        </div>

                        <div className="flex flex-col items-start pr-4">
                          <span className={`text-[10px] font-black uppercase tracking-widest ${isLit ? 'text-rose-400' : 'text-gray-400'}`}>
                            {isLit ? 'Promise Sealed' : `Step ${i + 1}`}
                          </span>
                          <span className={`font-bold text-sm ${isLit ? 'text-rose-900' : 'text-rose-300'}`}>
                            {p.text}
                          </span>
                        </div>
                      </motion.button>
                    </motion.div>
                  );
                })}
              </div>

              {/* Padding at the bottom to ensure the last star isn't covered by the card */}
              <div className="h-64" />
            </div>

            {/* 3. THE FINAL VOW CARD (Fixed at bottom with Slide-In) */}
            <AnimatePresence>
              {litHearts.length === promises.length && (
                <motion.div
                  initial={{ y: 200 }}
                  animate={{ y: 0 }}
                  className="absolute bottom-0 left-0 right-0 z-50 p-6 bg-gradient-to-t from-rose-100 via-rose-50 to-transparent"
                >
                  <div className="glass w-full max-w-md mx-auto p-6 rounded-[35px] border-2 border-rose-300 bg-white/95 shadow-[0_-20px_50px_rgba(0,0,0,0.1)] text-center">
                    <div className="flex justify-center gap-3 mb-2 text-4xl animate-bounce">🤙💖</div>
                    <h3 className="font-romantic text-2xl text-rose-900">My Eternal Vow</h3>
                    <p className="text-rose-800/80 text-xs sm:text-sm mt-2 leading-relaxed italic px-4">
                      "Iti, these aren't just words; they are the gravity that keeps my world orbiting around you."
                    </p>
                    <div className="mt-4 pt-4 border-t border-rose-100 font-black text-rose-400 text-[10px] uppercase tracking-[0.4em]">
                      Pinky Promise Sealed
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      }

      // ++++++++++++++++++
      // case 5: {
      //   const promises = [
      //     { text: "Honesty", icon: "💎", color: "from-rose-100 to-rose-200" },
      //     { text: "Respect", icon: "🛡️", color: "from-pink-100 to-rose-100" },
      //     { text: "Safety", icon: "🏡", color: "from-orange-50 to-rose-100" },
      //     { text: "Kindness", icon: "🕊️", color: "from-rose-50 to-pink-100" },
      //     { text: "Patience", icon: "⏳", color: "from-yellow-50 to-rose-100" }
      //   ];

      //   return (
      //     <div className="relative h-full w-full flex flex-col bg-[#fff5f6] overflow-hidden">

      //       {/* 1. SOFT MESH BACKGROUND (Animated Blobs) */}
      //       <div className="absolute inset-0 z-0 overflow-hidden">
      //         <motion.div
      //           animate={{
      //             scale: [1, 1.2, 1],
      //             rotate: [0, 45, 0],
      //             x: [0, 50, 0]
      //           }}
      //           transition={{ duration: 20, repeat: Infinity }}
      //           className="absolute -top-20 -left-20 w-96 h-96 bg-rose-200/30 blur-[100px] rounded-full"
      //         />
      //         <motion.div
      //           animate={{
      //             scale: [1.2, 1, 1.2],
      //             x: [0, -30, 0],
      //             y: [0, 50, 0]
      //           }}
      //           transition={{ duration: 15, repeat: Infinity }}
      //           className="absolute top-1/2 -right-20 w-80 h-80 bg-orange-100/40 blur-[100px] rounded-full"
      //         />
      //       </div>

      //       {/* 2. HEADER */}
      //       <div className="relative z-20 pt-8 pb-4 text-center shrink-0">
      //         <motion.h2
      //           initial={{ y: -20, opacity: 0 }}
      //           animate={{ y: 0, opacity: 1 }}
      //           className="text-rose-800 font-romantic text-3xl sm:text-4xl italic"
      //         >
      //           The Vows of Us
      //         </motion.h2>
      //         <p className="text-rose-400 text-[10px] font-black uppercase tracking-[0.4em] mt-2">
      //           Tap each heart to bloom our promise
      //         </p>
      //       </div>

      //       {/* 3. THE INTERACTIVE VERTICAL PATH */}
      //       <div className="relative flex-1 overflow-y-auto overflow-x-hidden px-6 py-10 scrollbar-hide z-10">

      //         {/* CENTER FLOW LINE (Soft Rose Gold) */}
      //         <div className="absolute left-1/2 top-0 h-full w-[1.5px] -translate-x-1/2 bg-rose-200/50">
      //           <motion.div
      //             className="w-full bg-gradient-to-b from-rose-400 to-rose-600 shadow-[0_0_10px_rgba(225,29,72,0.3)]"
      //             initial={{ height: 0 }}
      //             animate={{ height: `${(litHearts.length / promises.length) * 100}%` }}
      //           />
      //         </div>

      //         <div className="relative flex flex-col items-center gap-24">
      //           {promises.map((p, i) => {
      //             const isLit = litHearts.includes(i);
      //             const canLit = i === 0 || litHearts.includes(i - 1);

      //             return (
      //               <motion.div
      //                 key={p.text}
      //                 initial={{ opacity: 0, y: 30 }}
      //                 whileInView={{ opacity: 1, y: 0 }}
      //                 viewport={{ once: true, margin: "-50px" }}
      //                 className="relative w-full flex justify-center"
      //               >
      //                 {/* Node Junction */}
      //                 <div className={`absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full z-20 border-4 border-[#fff5f6] transition-all duration-500
      //             ${isLit ? 'bg-rose-500 scale-125' : 'bg-rose-100'}`}
      //                 />

      //                 <motion.button
      //                   onClick={() => {
      //                     if (!isLit && canLit) {
      //                       setLitHearts([...litHearts, i]);
      //                       triggerHaptic([30, 20, 30]);
      //                     }
      //                   }}
      //                   whileTap={canLit ? { scale: 0.9 } : {}}
      //                   className={`relative flex flex-col items-center p-6 rounded-[2.5rem] transition-all duration-1000 w-full max-w-[220px] border
      //               ${isLit
      //                       ? 'bg-white/80 backdrop-blur-md border-rose-200 shadow-[0_15px_30px_rgba(251,113,133,0.15)]'
      //                       : canLit ? 'bg-white/40 border-white animate-pulse shadow-sm' : 'bg-transparent border-transparent opacity-20'}`}
      //                 >
      //                   <div className={`w-16 h-16 rounded-3xl flex items-center justify-center text-3xl mb-3 shadow-inner transition-all duration-1000
      //               ${isLit ? `bg-gradient-to-br ${p.color} text-rose-600 rotate-[360deg]` : 'bg-rose-50 text-rose-200'}`}>
      //                     {isLit ? p.icon : "🔒"}
      //                   </div>

      //                   <div className="text-center">
      //                     <span className={`text-[9px] font-black uppercase tracking-[0.2em] block mb-1 ${isLit ? 'text-rose-400' : 'text-gray-300'}`}>
      //                       {isLit ? 'Sealed With Love' : `Vow 0${i + 1}`}
      //                     </span>
      //                     <span className={`font-bold text-lg tracking-tight ${isLit ? 'text-rose-900' : 'text-rose-200'}`}>
      //                       {p.text}
      //                     </span>
      //                   </div>

      //                   {/* Floating Heart Particles (Only when lit) */}
      //                   {isLit && (
      //                     <motion.div
      //                       initial={{ opacity: 0, y: 0 }}
      //                       animate={{ opacity: [0, 1, 0], y: -50 }}
      //                       transition={{ repeat: Infinity, duration: 2 }}
      //                       className="absolute top-0 text-rose-400"
      //                     >
      //                       ❤️
      //                     </motion.div>
      //                   )}
      //                 </motion.button>
      //               </motion.div>
      //             );
      //           })}
      //         </div>
      //         <div className="h-80" />
      //       </div>

      //       {/* 4. THE ROMANTIC REVEAL CARD */}
      //       <AnimatePresence>
      //         {litHearts.length === promises.length && (
      //           <motion.div
      //             initial={{ y: 300, opacity: 0 }}
      //             animate={{ y: 0, opacity: 1 }}
      //             className="absolute bottom-0 left-0 right-0 z-50 p-6"
      //           >
      //             <div className="bg-white/95 backdrop-blur-xl rounded-[3rem] p-8 shadow-[0_-15px_50px_rgba(251,113,133,0.2)] text-center border border-rose-100">
      //               <motion.div
      //                 animate={{ scale: [1, 1.2, 1] }}
      //                 transition={{ repeat: Infinity, duration: 1.5 }}
      //                 className="text-5xl mb-4"
      //               >
      //                 🤙💕
      //               </motion.div>
      //               <h3 className="font-romantic text-3xl text-rose-950 mb-2 italic">Iti, My Promise</h3>
      //               <p className="text-rose-800/70 text-sm sm:text-base leading-relaxed italic px-2">
      //                 "A thousand words may fade, but these promises are written in the stars of our journey. I'm yours, forever."
      //               </p>
      //               <p className="text-rose-800/80 text-xs sm:text-sm mt-2 leading-relaxed italic px-4">
      //                 "Iti, these aren't just words; they are the gravity that keeps my world orbiting around you."
      //               </p>

      //               <div className="mt-8 flex justify-center gap-3">
      //                 {[...Array(3)].map((_, i) => (
      //                   <motion.div
      //                     key={i}
      //                     animate={{ y: [0, -10, 0], opacity: [0.4, 1, 0.4] }}
      //                     transition={{ repeat: Infinity, delay: i * 0.3 }}
      //                     className="text-rose-300 text-xs"
      //                   >
      //                     🌸
      //                   </motion.div>
      //                 ))}
      //               </div>
      //             </div>
      //           </motion.div>
      //         )}
      //       </AnimatePresence>
      //     </div>
      //   );
      // }
      // ++++++++++++++++++
      // ========================= end promise ===============================


      // =========================== update hug ===================================
      case 6: {
        return (
          <div className="relative h-full w-full flex flex-col items-center bg-[#fffcfc] overflow-hidden touch-none">

            {/* 1. THE RADIATING HEAT (Visual background) */}
            <motion.div
              animate={{
                scale: isHugActive ? [1, 1.2, 1] : 1,
                opacity: isHugActive ? 0.6 : 0.2,
                backgroundColor: isHugActive ? "#fda4af" : "#fff1f2"
              }}
              transition={{ repeat: Infinity, duration: 4 }}
              className="absolute inset-0 z-0 blur-[100px] rounded-full"
            />

            {/* 2. HEADER */}
            <div className="relative z-20 pt-12 text-center px-8">
              <h2 className="text-rose-800 font-romantic text-3xl italic">
                {hugComplete ? "The Warmest Embrace" : "Feel the Warmth"}
              </h2>
              <p className="text-rose-400 text-[9px] font-black uppercase tracking-[0.4em] mt-2">
                {hugComplete ? "Connection Established" : "Press here to bridge the distance"}
              </p>
            </div>

            {/* 3. THE INTERACTIVE CORE */}
            <div className="relative flex-1 w-full flex items-center justify-center z-10">
              {!hugComplete ? (
                <div className="relative">
                  {/* Ripple Effect */}
                  {isHugActive && (
                    <motion.div
                      initial={{ scale: 0, opacity: 1 }}
                      animate={{ scale: 4, opacity: 0 }}
                      transition={{ repeat: Infinity, duration: 1.5 }}
                      className="absolute inset-0 bg-rose-400 rounded-full"
                    />
                  )}

                  {/* THE SCANNER BUTTON */}
                  <motion.button
                    onPointerDown={() => {
                      setIsHugActive(true);
                      triggerHaptic([20, 10, 20]);
                    }}
                    onPointerUp={() => {
                      setIsHugActive(false);
                      setProgress(0);
                    }}
                    className="relative w-32 h-32 bg-white rounded-full shadow-2xl border-4 border-rose-100 flex items-center justify-center overflow-hidden"
                  >
                    {/* Filling progress inside the button */}
                    <motion.div
                      animate={{ height: `${progress}%` }}
                      className="absolute bottom-0 w-full bg-rose-500/20"
                    />

                    <div className="relative flex flex-col items-center">
                      <span className="text-4xl mb-1">{isHugActive ? "🫂" : "✋"}</span>
                      <span className="text-[8px] font-bold text-rose-500 uppercase">Hold</span>
                    </div>

                    {/* Progress logic hidden timer */}
                    {isHugActive && (
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 7, ease: "linear" }}
                        onUpdate={(latest) => {
                          // Update the local progress for visual feedback
                          const p = parseFloat(latest.width);
                          setProgress(p);
                          if (p >= 99) {
                            setHugComplete(true);
                            triggerHaptic([50, 100, 50, 100]);
                          }
                        }}
                      />
                    )}
                  </motion.button>
                </div>
              ) : (
                /* SUCCESS STATE - THE REVEAL */
                <motion.div
                  initial={{ scale: 0, rotate: -10 }}
                  animate={{ scale: 1, rotate: 0 }}
                  className="w-[85%] max-w-sm"
                >
                  <div className="glass p-8 rounded-[3rem] border-2 border-white bg-white/90 shadow-[0_20px_50px_rgba(251,113,133,0.3)] text-center relative overflow-hidden">
                    {/* Floating Hearts inside the card */}
                    <div className="absolute -top-4 -right-4 text-4xl animate-bounce">💖</div>
                    <div className="absolute -bottom-4 -left-4 text-4xl animate-bounce delay-150">🌸</div>

                    <h3 className="font-romantic text-3xl text-rose-950 mb-4 italic">Iti, You're Home.</h3>
                    <p className="text-rose-800 text-sm leading-relaxed italic mb-4 px-2">
                      "A hug is a handshake from the heart. Every time you press that button, know that I'm holding you tight on the other side."
                    </p>

                    <div className="flex justify-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <motion.div
                          key={i}
                          animate={{ scale: [1, 1.5, 1] }}
                          transition={{ repeat: Infinity, delay: i * 0.2 }}
                          className="w-1.5 h-1.5 rounded-full bg-rose-400"
                        />
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            {/* 4. ACTIVITY FEEDBACK */}
            <div className="pb-20 z-20 h-10">
              <AnimatePresence>
                {isHugActive && !hugComplete && (
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="text-rose-600 font-bold text-xs italic"
                  >
                    Syncing our warmth... {Math.round(progress)}%
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            {/* FOOTER DECOR */}
            <div className="absolute bottom-6 flex gap-8 opacity-20">
              <span className="text-2xl">☁️</span>
              <span className="text-2xl">✨</span>
              <span className="text-2xl">☁️</span>
            </div>
          </div>
        );
      }
      // =========================== end Hug ======================================

      // case 7:
      //   return (
      //     // edit from v4 =====================================================
      //     <div className="flex flex-col items-center space-y-12">
      //       <p className="font-romantic text-3xl text-rose-800 text-center px-4 leading-relaxed">
      //         "Place your finger on the heart and blow a kiss to the screen..."
      //       </p>
      //       <InteractiveButton
      //         onMouseDown={() => { setIsHolding(true); triggerHaptic(50); }}
      //         onMouseUp={() => setIsHolding(false)}
      //         onTouchStart={() => { setIsHolding(true); triggerHaptic(50); }}
      //         onTouchEnd={() => setIsHolding(false)}
      //         className={`w-40 h-40 rounded-full glass border-4 flex items-center justify-center transition-all duration-1000 ${isHolding ? 'border-rose-500 scale-150 shadow-[0_0_100px_rgba(225,29,72,0.6)]' : 'border-rose-100 shadow-xl'}`}
      //       >
      //         <div className={`text-6xl transition-transform duration-1000 ${isHolding ? 'scale-150 animate-pulse' : 'scale-100'}`}>😘</div>
      //       </InteractiveButton>
      //       {isHolding && (
      //         <div className="fixed inset-0 pointer-events-none bg-rose-400/10 backdrop-blur-[2px] animate-pulse"></div>
      //       )}
      //       <div className={`transition-all duration-1000 text-center ${holdProgress >= 100 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
      //         <p className="font-romantic text-4xl text-rose-950 shimmer-text">"That one reached my soul, Iti."</p>
      //       </div>
      //     </div>
      //   );
      //===========================start kiss========================================
      case 7:
        return (
          <div className="relative h-[100dvh] w-full flex flex-col items-center bg-[#fffafa] overflow-hidden touch-none select-none">

            {/* 1. BACKGROUND BLUSH (Mobile Optimized) */}
            <motion.div
              animate={{
                opacity: isHolding ? 0.5 : 0,
              }}
              className="absolute inset-0 bg-rose-200 blur-[80px] pointer-events-none z-0"
            />

            {/* 2. TOP SECTION (Instruction) */}
            <div className="relative z-20 pt-16 pb-8 text-center px-6 h-1/4 flex items-end">
              <motion.p
                animate={{ opacity: isHolding ? 0.3 : 1 }}
                className="font-romantic text-2xl sm:text-3xl text-rose-800 leading-tight italic"
              >
                "Close your eyes and press your lips right here... <br />
                <span className="text-[10px] font-sans uppercase tracking-[0.2em] font-black text-rose-400 not-italic block mt-3">
                  I'm waiting on the other side
                </span>
              </motion.p>
            </div>

            {/* 3. CENTER SECTION (The Interactive Spot) */}
            <div className="relative flex-1 w-full flex items-center justify-center z-10">
              <div className="relative">
                {/* Pulsing Aura */}
                <AnimatePresence>
                  {isHolding && (
                    [...Array(2)].map((_, i) => (
                      <motion.div
                        key={i}
                        initial={{ scale: 0.8, opacity: 0.6 }}
                        animate={{ scale: 2.2, opacity: 0 }}
                        transition={{ repeat: Infinity, duration: 2, delay: i * 1 }}
                        className="absolute inset-0 bg-rose-300 rounded-full"
                      />
                    ))
                  )}
                </AnimatePresence>

                {/* THE KISS TARGET - Size adjusted for mobile lips/thumbs */}
                <motion.div
                  onPointerDown={() => {
                    setIsHolding(true);
                    triggerHaptic([40, 80, 40]);
                  }}
                  onPointerUp={() => setIsHolding(false)}
                  onPointerLeave={() => setIsHolding(false)}
                  className={`relative w-40 h-40 sm:w-48 sm:h-48 rounded-full flex items-center justify-center border-2 transition-all duration-500
              ${isHolding ? 'bg-white/90 border-rose-400 shadow-2xl scale-110' : 'bg-white/40 border-rose-100 shadow-lg'}`}
                >
                  <motion.div
                    animate={{ scale: isHolding ? [1, 1.1, 1] : 1 }}
                    transition={{ repeat: Infinity, duration: 1 }}
                    className="text-6xl sm:text-7xl"
                  >
                    {isHolding ? "💋" : "😘"}
                  </motion.div>

                  {/* Hidden Logic for Progress */}
                  {isHolding && (
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 4, ease: "linear" }}
                      onUpdate={(latest) => {
                        const p = parseFloat(latest.width);
                        setHoldProgress(p);
                        if (p >= 99) {
                          triggerHaptic([100, 50, 100]);
                        }
                      }}
                    />
                  )}
                </motion.div>
              </div>
            </div>

            {/* 4. BOTTOM SECTION (Success Message) */}
            <div className="relative z-20 h-1/3 w-full px-8 flex flex-col items-center">
              <AnimatePresence>
                {holdProgress >= 100 ? (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center"
                  >
                    <h3 className="font-romantic text-3xl text-rose-950 italic">
                      "That one reached my soul, Iti."
                    </h3>
                    <div className="flex justify-center mt-3 gap-2">
                      <span className="animate-bounce">💖</span>
                      <span className="animate-bounce delay-75">✨</span>
                      <span className="animate-bounce delay-150">💖</span>
                    </div>
                  </motion.div>
                ) : (
                  /* Progress percentage shown only when holding */
                  isHolding && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-rose-400 font-black text-[10px] tracking-widest uppercase"
                    >
                      Catching your kiss... {Math.round(holdProgress)}%
                    </motion.p>
                  )
                )}
              </AnimatePresence>
            </div>

            {/* Small padding for bottom gesture bars on modern iPhones */}
            <div className="h-8 w-full" />
          </div>
        );
      // ==========================end kiss==========================================

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
              <p className="font-romantic text-2xl sm:text-4xl text-rose-900 mb-10 sm:mb-16 text-center italic">"Light them slowly. Each one is a thank you...."</p>
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
                  <p>"This journey was more than just pixels on a screen. It was my way of reaching out to you, across every mile that separates us."</p>

                  <p>"Every petal matched, every promise made, and every digital hug was a reminder: you are truly, deeply important to me."</p>
                  <p>
                    "You are my peace in the chaos, my light in the dark, and the person I want to tell everything to, first thing in the morning and last thing at night."
                  </p>
                  <p>"Thank you for being in my life. And today, I wanted to say it clearly You are my favorite person, Fulei."</p>




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

                    // --- ADD THIS LINE ---
                    sendItiResponse('YES');
                  }}
                  className="w-full px-8 py-5 sm:px-14 sm:py-7 bg-rose-600 text-white rounded-[30px] sm:rounded-[40px] shadow-2xl font-black tracking-[0.2em] text-lg sm:text-2xl hover:-translate-y-1 uppercase"
                >
                  YES, I'D LOVE THAT! ✨
                </InteractiveButton>
              </div>
              <InteractiveButton
                onClick={() => {
                  setInteractionState('SOON');
                  triggerHaptic(100);

                  // --- ADD THIS LINE ---
                  sendItiResponse('SOON');
                }}
                className="px-8 py-4 sm:px-14 sm:py-6 glass rounded-[30px] sm:rounded-[40px] text-rose-950 font-black border border-rose-200 tracking-widest text-xs sm:text-base uppercase"
              >
                Give me a little time...
              </InteractiveButton>
            </div>
            {interactionState && typeof interactionState === 'string' && (
              <div className="mt-12 p-8 sm:p-16 glass rounded-[35px] sm:rounded-[80px] border-2 border-rose-300 shadow-2xl animate-reveal-up bg-white/95 mx-2">
                <p className="text-rose-950 font-romantic text-2xl sm:text-6xl leading-snug shimmer-text">
                  {interactionState === 'YES'
                    ? "You just made my heart dance 💙"
                    : "No pressure, I'll be waiting. 🌸"}
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
