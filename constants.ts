
import { ValentineDay, ChocolateItem, MemoryPhoto } from './types';

// =======================
import roseMusic from "./music/shaky.mp3";
import proposeMusic from "./music/jugraafiya.mp3";
import chocolateMusic from "./music/nadaaniyan.mp3";
import teddyMusic from "./music/aisaGeetGaun.mp3";
import promiseMusic from "./music/chaarKadam.mp3";
import hugMusic from "./music/mainHoonNa.mp3";
import kissMusic from "./music/humsafar.mp3";
import valentineMusic from "./music/dooron.mp3";
// -----------------------------------------------
import photo1 from "./photos/memory1.jpeg";
import photo2 from "./photos/iti1.jpeg";
import photo3 from "./photos/memory2.jpeg";
import photo4 from "./photos/memory3.jpeg";
import photo5 from "./photos/iti2.jpeg";
import photo6 from "./photos/memory4.jpeg";

// ---------------------------more photos---
// import photo7 from "./photos/memory7.jpg";
// import photo8 from "./photos/memory8.jpg";
// import photo9 from "./photos/memory9.jpg";
// import photo10 from "./photos/memory10.jpg";
// import photo11 from "./photos/memory11.jpg";
// import photo12 from "./photos/memory12.jpg";
// ---------------------------

// =======================

export const ITI_NICKNAME = "iti"; // Login password
export const GALLERY_PASSWORD = "soul"; // Password for the memory gallery

export const VALENTINE_DAYS: ValentineDay[] = [
  {
    id: 1,
    date: "2025-02-07",
    title: "Rose Day",
    theme: "The First Bloom",
    emoji: "🌹",
    musicUrl: roseMusic,
    musicMood: "Soft instrumental",
    content: "Iti, if feelings were roses, this one would be for how safe you make me feel. You are the grace in my world.",
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
    content: "Every moment with you is like high-quality chocolate—sweet, comforting, and deeply addictive.",
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
  { id: 1, url: photo1, caption: "Sweet Hello", rotation: -3 },
  { id: 2, url: photo2, caption: "True Smile", rotation: 2 },
  { id: 3, url: photo3, caption: "Perfect Day", rotation: -1 },
  { id: 4, url: photo4, caption: "Only Us", rotation: 4 },
  { id: 5, url: photo5, caption: "My Home", rotation: -2 },
  { id: 6, url: photo6, caption: "Forever Us", rotation: 3 },

  // --------------more photos------
  // { id: 7, url: photo7, caption: "A Quiet Moment", rotation: -4 },
  // { id: 8, url: photo8, caption: "Unplanned Smile", rotation: 1 },
  // { id: 9, url: photo9, caption: "Just Like This", rotation: -2 },
  // { id: 10, url: photo10, caption: "Still My Favorite", rotation: 3 },
  // { id: 11, url: photo11, caption: "One More Memory", rotation: -1 },
  // { id: 12, url: photo12, caption: "Still With Me", rotation: 2 }

  // --------------
];
// =====================
