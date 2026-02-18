import { AllData, DayData, Goal, PRAYER_NAMES, PrayerName } from './types';

// Ramadan 2026 starts on Feb 18, 2026
const RAMADAN_START_DATE = new Date(2026, 1, 18); // Month is 0-indexed: 1 = Feb

export const getLocalStorageKey = () => 'ramadan_tracker_v1';
export const getGoalsStorageKey = () => 'ramadan_tracker_goals_v1';

export const DEFAULT_GOALS: Goal[] = [
  { id: 'default-1', text: 'Do not miss a prayer', completed: false },
  { id: 'default-2', text: 'Pray five times a day', completed: false },
  { id: 'default-3', text: 'Read five pages of the Quran after each prayer', completed: false },
];

export const getInitialDayData = (): DayData => ({
  prayers: {
    Fajr: false,
    Dhuhr: false,
    Asr: false,
    Maghrib: false,
    Isha: false,
  },
  quran: {
    Fajr: false,
    Dhuhr: false,
    Asr: false,
    Maghrib: false,
    Isha: false,
  },
  tarawih: 0,
  note: '',
});

export const formatDateKey = (date: Date): string => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

export const parseDateKey = (dateStr: string): Date => {
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(y, m - 1, d);
};

export const getRamadanDay = (date: Date): number => {
  // Normalize to midnight to avoid time diff issues
  const current = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const start = new Date(RAMADAN_START_DATE.getFullYear(), RAMADAN_START_DATE.getMonth(), RAMADAN_START_DATE.getDate());
  
  const diffTime = current.getTime() - start.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays + 1;
};

export const calculateDailyScore = (data: DayData): number => {
  let score = 0;
  
  // Prayers (5 points)
  PRAYER_NAMES.forEach(p => {
    if (data.prayers[p]) score += 1;
  });
  
  // Quran (5 points)
  PRAYER_NAMES.forEach(p => {
    if (data.quran[p]) score += 1;
  });
  
  // Tarawih (1 point only if 8)
  if (data.tarawih === 8) score += 1;
  
  return score;
};

export const loadData = (): AllData => {
  try {
    const raw = localStorage.getItem(getLocalStorageKey());
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error("Failed to load data", e);
  }
  return {};
};

export const saveData = (data: AllData) => {
  try {
    localStorage.setItem(getLocalStorageKey(), JSON.stringify(data));
  } catch (e) {
    console.error("Failed to save data", e);
  }
};

export const loadGoals = (): Goal[] => {
  try {
    const raw = localStorage.getItem(getGoalsStorageKey());
    if (raw) {
      const parsed = JSON.parse(raw);
      // If parsed is empty array (user deleted all), return it. 
      // Only return default if it's the very first load (null) or empty state logic if preferred.
      // Here we only return default if storage is null to respect user deletions.
      return parsed; 
    }
    // If no data exists yet, return defaults
    return DEFAULT_GOALS;
  } catch (e) {
    console.error("Failed to load goals", e);
    return DEFAULT_GOALS;
  }
};

export const saveGoals = (goals: Goal[]) => {
  try {
    localStorage.setItem(getGoalsStorageKey(), JSON.stringify(goals));
  } catch (e) {
    console.error("Failed to save goals", e);
  }
};

export const getFormattedDateString = (date: Date): string => {
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};