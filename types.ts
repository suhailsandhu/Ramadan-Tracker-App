export type PrayerName = 'Fajr' | 'Dhuhr' | 'Asr' | 'Maghrib' | 'Isha';

export const PRAYER_NAMES: PrayerName[] = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];

export interface DayData {
  prayers: Record<PrayerName, boolean>;
  quran: Record<PrayerName, boolean>;
  tarawih: number; // 0 to 8
  note: string;
}

export type AllData = Record<string, DayData>; // Key is YYYY-MM-DD

export interface DailyStats {
  date: string;
  totalScore: number;
  prayerScore: number;
  quranScore: number;
  tarawihScore: number;
  isRamadan: boolean;
  dayNumber: number;
}

export interface Goal {
  id: string;
  text: string;
  completed: boolean;
}