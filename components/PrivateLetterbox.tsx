import React, { useState, useEffect } from 'react';
import emailjs from '@emailjs/browser';

interface PrivateLetterboxProps {
  isDateReached: boolean;
}

const PrivateLetterbox: React.FC<PrivateLetterboxProps> = ({ isDateReached }) => {
  const [itiReview, setItiReview] = useState('');
  const [passkey, setPasskey] = useState('');
  const [step, setStep] = useState<'LOCKED' | 'AUTH' | 'YOUR_LETTER' | 'HER_RESPONSE' | 'SENT'>('LOCKED');
  const [isSending, setIsSending] = useState(false);
  const [tapCount, setTapCount] = useState(0);

  const PRIVATE_KEY = "gudu";

  // Reset taps after 3 seconds of inactivity
  useEffect(() => {
    const timer = setTimeout(() => {
      if (tapCount > 0 && tapCount < 7) setTapCount(0);
    }, 3000);
    return () => clearTimeout(timer);
  }, [tapCount]);

  // Function to return to the Butterfly Orb state
  const returnToOrb = () => {
    setStep('LOCKED');
    setTapCount(0);
    setPasskey('');
    setItiReview('');
  };

  const handleOrbClick = () => {
    if (!isDateReached) return;
    const newCount = tapCount + 1;
    setTapCount(newCount);
    if (newCount >= 7) setStep('AUTH');
  };

  const sendLetter = async () => {
    setIsSending(true);
    try {
      await emailjs.send(
        'service_hhttvtr',
        'template_f1m8weu',
        {
          title: "💌 Iti's Heartfelt Response",
          message: itiReview,
          response_time: new Date().toLocaleString(),
        },
        '66lYwMRciiumrDleL'
      );
      setStep('SENT');
    } catch (error) {
      alert("The message couldn't reach me. Please try once more! 💙");
    } finally {
      setIsSending(false);
    }
  };

  // --- PHASE 1: THE SECRET ORB ENTRY ---
  if (step === 'LOCKED') {
    return (
      <div className="flex flex-col items-center justify-center pt-10 pb-32 animate-reveal-up px-6">
        <div className="w-24 h-px bg-gradient-to-r from-transparent via-rose-200 to-transparent mb-16 opacity-50"></div>
        <div className="relative flex items-center justify-center">
          <div className={`absolute w-32 h-32 sm:w-48 sm:h-48 rounded-full blur-[50px] sm:blur-[80px] transition-all duration-1000 
            ${tapCount > 0 ? 'bg-rose-400/30 scale-125' : 'bg-rose-100/20 scale-100 animate-pulse'}`}>
          </div>
          <div
            onClick={handleOrbClick}
            className={`relative z-10 w-20 h-20 sm:w-28 sm:h-28 rounded-full cursor-pointer flex items-center justify-center
              border border-rose-100/40 glass-dark shadow-2xl transition-all duration-500
              ${tapCount > 0 ? 'scale-110 rotate-[15deg]' : 'hover:scale-105'}
            `}
          >
            <div className="text-4xl sm:text-5xl animate-float pointer-events-none select-none filter drop-shadow-md">
              {isDateReached ? '🦋' : '☁️'}
            </div>
            {tapCount > 0 && (
              <div className="absolute inset-0 rounded-full border-2 border-rose-300 animate-ping opacity-40"></div>
            )}
          </div>
        </div>
        <p className="mt-10 text-[9px] sm:text-[11px] text-rose-300 font-black uppercase tracking-[0.5em] italic opacity-50 text-center leading-loose">
          {isDateReached ? "The story is yours now" : "Resting in the clouds"}
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto w-full px-4 sm:px-6 mt-10 mb-32 animate-reveal-up relative">

      {/* ✕ SUBTLE CLOSE BUTTON (Top Right) */}
      <button
        onClick={returnToOrb}
        className="absolute top-4 right-8 sm:top-10 sm:right-16 z-50 text-rose-300 hover:text-rose-500 transition-colors p-2"
        title="Return to Orb"
      >
        <span className="text-2xl font-light">✕</span>
      </button>

      <div className="glass p-6 sm:p-16 rounded-[40px] sm:rounded-[60px] border-2 border-rose-100 shadow-2xl text-center relative bg-white/50 backdrop-blur-xl overflow-hidden">

        {/* STEP: AUTHENTICATION */}
        {step === 'AUTH' && (
          <div className="space-y-8 py-10 animate-reveal-up">
            <h2 className="text-3xl sm:text-4xl font-romantic text-rose-950 px-2 leading-tight">Identity Key</h2>
            <div className="max-w-[260px] sm:max-w-xs mx-auto space-y-4">
              <input
                type="password"
                value={passkey}
                onChange={(e) => {
                  setPasskey(e.target.value);
                  if (e.target.value.toLowerCase() === PRIVATE_KEY.toLowerCase()) setStep('YOUR_LETTER');
                }}
                placeholder="The Secret Word..."
                className="w-full px-6 py-4 rounded-full bg-white/80 border border-rose-100 outline-none text-center text-rose-900 font-bold placeholder:text-rose-200 text-sm sm:text-base focus:border-rose-400 shadow-sm"
              />
              <button
                onClick={returnToOrb}
                className="block mx-auto text-[9px] text-rose-300 uppercase tracking-widest font-black pt-2 hover:text-rose-500 transition-colors"
              >
                Go Back ↩
              </button>
            </div>
          </div>
        )}

        {/* STEP: YOUR LETTER TO HER */}
        {step === 'YOUR_LETTER' && (
          <div className="space-y-8 animate-reveal-up text-left">
            <h2 className="text-3xl sm:text-5xl font-romantic text-rose-950 text-center mb-6">This World is Yours</h2>

            <div className="space-y-6 text-rose-900 font-elegant italic text-base sm:text-xl leading-relaxed bg-white/40 p-6 sm:p-10 rounded-[30px] shadow-inner border border-white/50">
              <p>"Iti, this application is built for you for a lifetime. It will remain accessible to you for infinity days, always here whenever you need to revisit these moments."</p>
              <p>"I want you to know that your privacy is absolute. I have no control over this once it is in your hands; I cannot see when you open it or how you use it. This world is truly yours."</p>
              <p>"Only this specific section allows a message to reach me—but only if you choose to send it."</p>
              <p>"To ensure this space feels entirely yours, I haven't mentioned my name anywhere outside of our private password sections. This gives you the freedom to share this application with whoever you wish, while our personal gallery and messages stay protected and private"</p>
              <p><b>"Everything I have shared with you over these 8 chapters is 100% real. The words may sound poetic, but they are pure reflections of my emotions for you."</b></p>
              <p className="pt-4 border-t border-rose-200/50 not-italic font-bold text-rose-950">
                "I have shared so much with you throughout this journey; now, I want to give you the space to say anything you wish. 👇"
              </p>

            </div>

            <div className="pt-6 flex flex-col items-center space-y-4">
              <button
                onClick={() => setStep('HER_RESPONSE')}
                className="px-10 py-5 bg-rose-600 text-white rounded-full font-black uppercase tracking-widest text-xs sm:text-sm shadow-xl hover:bg-rose-700 active:scale-95 transition-all"
              >
                Send your words to me
              </button>
              <button onClick={returnToOrb} className="text-rose-300 text-[10px] uppercase font-black tracking-widest hover:text-rose-400">
                Return to Garden ↩
              </button>
            </div>
          </div>
        )}

        {/* STEP: HER RESPONSE */}
        {step === 'HER_RESPONSE' && (
          <div className="space-y-8 animate-reveal-up">
            <div className="space-y-2">
              <h2 className="text-3xl sm:text-5xl font-romantic text-rose-950 leading-tight">How was your journey?</h2>
              <p className="text-rose-600 font-elegant italic text-base sm:text-2xl px-4 italic">
                "If you want to say something, this is your space."
              </p>
            </div>

            <textarea
              value={itiReview}
              onChange={(e) => setItiReview(e.target.value)}
              placeholder="Tell me your thoughts..."
              className="w-full h-56 sm:h-72 p-6 sm:p-10 rounded-[30px] sm:rounded-[45px] bg-white/70 border-2 border-rose-50 outline-none text-rose-950 font-elegant italic text-base sm:text-xl shadow-inner resize-none focus:border-rose-300 transition-all"
            />

            <div className="flex flex-col items-center justify-center gap-6 pt-4">
              <button
                onClick={sendLetter}
                disabled={isSending || !itiReview.trim()}
                className="w-full sm:w-auto px-12 py-5 bg-rose-600 text-white rounded-full font-black uppercase tracking-widest text-xs sm:text-sm shadow-2xl active:scale-95 disabled:opacity-40 transition-all"
              >
                {isSending ? 'Sending Message...' : 'Send to My Heart ✉️'}
              </button>

              <div className="flex space-x-6">
                <button onClick={() => setStep('YOUR_LETTER')} className="text-rose-400 text-[9px] uppercase font-black tracking-widest underline underline-offset-8">
                  Back to Letter
                </button>
                <button onClick={returnToOrb} className="text-rose-300 text-[9px] uppercase font-black tracking-widest underline underline-offset-8">
                  Cancel & Exit ↩
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STEP: SENT SUCCESS */}
        {step === 'SENT' && (
          <div className="py-20 sm:py-24 space-y-6 animate-reveal-up">
            <div className="text-6xl sm:text-8xl animate-float filter drop-shadow-xl">🦋</div>
            <h2 className="text-3xl sm:text-5xl font-romantic text-rose-950">It's with me now.</h2>
            <p className="text-rose-700 font-elegant italic text-lg sm:text-3xl px-6 leading-relaxed mb-8">
              "Thank you for being the most beautiful part of this story, Iti."
            </p>
            <button
              onClick={returnToOrb}
              className="px-8 py-3 border border-rose-200 text-rose-400 rounded-full text-[10px] uppercase font-black tracking-widest hover:bg-rose-50 transition-all"
            >
              Return to Home
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PrivateLetterbox;