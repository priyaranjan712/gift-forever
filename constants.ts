
import { ValentineDay, ChocolateItem, MemoryPhoto } from './types';

// =======================
import roseMusic from "./music/shaky.mp3";
import proposeMusic from "./music/chaarKadam.mp3";
import chocolateMusic from "./music/nadaaniyan.mp3";
import teddyMusic from "./music/mainHoonNa.mp3";
import promiseMusic from "./music/nazm.mp3";
import hugMusic from "./music/maheroo.mp3";
import kissMusic from "./music/humsafar.mp3";
import valentineMusic from "./music/dooron.mp3";
// -----------------------------------------------
import photo1 from "./photos/iti1.jpeg";
import photo2 from "./photos/memory1.jpeg";
import photo3 from "./photos/gi6.jpeg";
import photo4 from "./photos/ig1.jpeg";
import photo5 from "./photos/gi1.jpeg";
import photo6 from "./photos/ig4.jpeg";

// ---------------------------more photos----------------
import photo7 from "./photos/gi8.jpeg";
import photo8 from "./photos/gi10.jpeg";
import photo9 from "./photos/memory2.jpeg";
import photo10 from "./photos/gi7.jpeg";
import photo11 from "./photos/iti2.jpeg";
import photo12 from "./photos/gi9.jpeg";
import photo13 from "./photos/gi5.jpeg";
import photo14 from "./photos/memory3.jpeg";
import photo15 from "./photos/gi4.jpeg";
import photo16 from "./photos/gi3.jpeg";
import photo17 from "./photos/gi11.jpeg";
import photo18 from "./photos/memory4.jpeg";
// import photo19 from "./photos/memory19.jpg";
// import photo20 from "./photos/memory20.jpg";
// import photo21 from "./photos/memory21.jpg";
// import photo22 from "./photos/memory22.jpg";
// ---------------------------

// =======================

export const ITI_NICKNAME = "iti"; // Login password
export const GALLERY_PASSWORD = "gudu"; // Password for the memory gallery

export const VALENTINE_DAYS: ValentineDay[] = [
  {
    id: 1,
    date: "2025-02-07",
    title: "Rose Day",
    theme: "Warm Affection",
    emoji: "🌹",
    musicUrl: roseMusic,
    musicMood: "Soft instrumental",
    content: "Iti, if feelings were roses, this one would be for how safe you make me feel. Just like a rose, your presence adds beauty and a gentle fragrance to my life.",
    passcode: "ROSE"
  },
  {
    id: 2,
    date: "2025-02-08",
    title: "Propose Day",
    theme: "Heartfelt Words",
    emoji: "💍",
    musicUrl: proposeMusic,
    musicMood: "Piano + strings",
    content: "Iti, I don't want to rush or label anything... I just want you to know you truly matter to me. Stay as you are.",
    passcode: "PROPOSE"
  },
  {
    id: 3,
    date: "2025-02-09",
    title: "Chocolate Day",
    theme: "Sweetest Soul",
    emoji: "🍫",
    musicUrl: chocolateMusic,
    musicMood: "Light acoustic",
    content: "Every moment with you is a bit like high-quality chocolate—sweet, comforting, and something I always crave.",
    passcode: "CHOCOLATE"
  },
  {
    id: 4,
    date: "2025-02-10",
    title: "Teddy Day",
    theme: "Warm Hugs",
    emoji: "🧸",
    musicUrl: teddyMusic,
    musicMood: "Calm lo-fi",
    content: "A digital teddy for the most precious person. Whenever you feel small, remember I'm a message away.",
    passcode: "TEDDY"
  },
  {
    id: 5,
    date: "2025-02-11",
    title: "Promise Day",
    theme: "Silent Vows",
    emoji: "🤝",
    musicUrl: promiseMusic,
    musicMood: "Ambient",
    content: "I promise to be your calm in the storm, your listener in the silence, and your friend above all else.",
    passcode: "PROMISE"
  },
  {
    id: 6,
    date: "2025-02-12",
    title: "Hug Day",
    theme: "Distance Apart",
    emoji: "🤗",
    musicUrl: hugMusic,
    musicMood: "Warm ambient",
    content: "If I could, Iti, I'd hold you gently and let the world pause for a moment. Digital hugs for now.",
    passcode: "HUG"
  },
  {
    id: 7,
    date: "2025-02-13",
    title: "Kiss Day",
    theme: "Pure Connection",
    emoji: "😘",
    musicUrl: kissMusic,
    musicMood: "Slow romantic",
    content: "Some connections go beyond touch. They live in the words we share and the silence we understand.",
    passcode: "KISS"
  },
  {
    id: 8,
    date: "2025-02-14",
    title: "Valentine's Day",
    theme: "The Grand Gesture",
    emoji: "❤️",
    musicUrl: valentineMusic,
    musicMood: "Uplifting romantic",
    content: "This journey was made just for you, Iti. You're the best thing that's happened to me this year.",
    passcode: "VALENTINE"
  }
];

export const CHOCOLATE_MESSAGES: ChocolateItem[] = [
  { id: 1, message: "Your laugh is my favorite notification." },
  { id: 2, message: "I love how you always listen to my random stories." },
  { id: 3, message: "You have a heart of pure gold, Iti." },
  { id: 4, message: "Meeting you was the best part of my year." },
  { id: 5, message: "Your kindness makes me want to be a better person." },
  { id: 6, message: "I appreciate the way you respect my space too." }
];



// =====================
export const MEMORY_PHOTOS: MemoryPhoto[] = [
  { id: 1, url: photo1, caption: "True Smile", rotation: -3 },
  { id: 2, url: photo2, caption: "Sweet Hello", rotation: 2 },
  { id: 3, url: photo3, caption: "Perfect Day", rotation: -1 },
  { id: 4, url: photo4, caption: "One More Memory", rotation: 4 },
  { id: 5, url: photo5, caption: "My Home", rotation: -2 },
  { id: 6, url: photo6, caption: "Between Seconds", rotation: 3 },

  // --------------more photos------
  { id: 7, url: photo7, caption: "A Quiet Moment", rotation: -4 },
  { id: 8, url: photo8, caption: "Unplanned Smile", rotation: 1 },
  { id: 9, url: photo9, caption: "Just Like This", rotation: -2 },
  { id: 10, url: photo10, caption: "Still My Favorite", rotation: 3 },
  { id: 11, url: photo11, caption: "Only Us", rotation: -1 },
  { id: 12, url: photo12, caption: "Still With Me", rotation: 2 },
  { id: 13, url: photo13, caption: "A Soft Look", rotation: -2 },
  { id: 14, url: photo14, caption: "That Moment", rotation: 3 },
  { id: 15, url: photo15, caption: "Unsaid Things", rotation: -1 },
  { id: 16, url: photo16, caption: "Still Smiling", rotation: 2 },
  { id: 17, url: photo17, caption: "Just Like This", rotation: -3 },
  { id: 18, url: photo18, caption: "Forever Us !!", rotation: 1 },
  // { id: 19, url: photo19, caption: "A Memory Kept", rotation: -2 },
  // { id: 20, url: photo20, caption: "Quietly Yours", rotation: 3 },
  // { id: 21, url: photo21, caption: "Felt, Not Said", rotation: -1 },
  // { id: 22, url: photo22, caption: "Still Here", rotation: 2 }


  // --------------
];
// =====================
