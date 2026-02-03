
export interface ValentineDay {
  id: number;
  date: string; // "YYYY-MM-DD"
  title: string;
  theme: string;
  emoji: string;
  musicUrl: string;
  musicMood: string;
  content: string;
  passcode: string; // The secret code to unlock this day early or on the day
}

export type AppView = 'LOGIN' | 'CALENDAR' | 'DAY_DETAIL' | 'GALLERY';

export interface ChocolateItem {
  id: number;
  message: string;
}

export interface MemoryPhoto {
  id: number;
  url: string;
  caption: string;
  rotation: number;
}
