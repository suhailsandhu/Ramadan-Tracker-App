import { AllData, DayData, Goal, PRAYER_NAMES, PrayerName } from './types';

// Ramadan 2026 starts on Feb 18, 2026
const RAMADAN_START_DATE = new Date(2026, 1, 18); // Month is 0-indexed: 1 = Feb

export const getLocalStorageKey = () => 'ramadanData';
export const getGoalsStorageKey = () => 'ramadanGoals';

export const DEFAULT_GOALS: Goal[] = [
  { id: 'default-1', text: 'Do not miss a prayer', completed: false },
  { id: 'default-2', text: 'Read some Quran daily', completed: false },
  { id: 'default-3', text: 'Give small charity (Sadaqah)', completed: false },
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
  const current = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const start = new Date(RAMADAN_START_DATE.getFullYear(), RAMADAN_START_DATE.getMonth(), RAMADAN_START_DATE.getDate());
  const diffTime = current.getTime() - start.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  return diffDays + 1;
};

export const calculateDailyScore = (data: DayData): number => {
  let score = 0;
  if (!data) return 0;
  PRAYER_NAMES.forEach(p => { if (data.prayers?.[p]) score += 1; });
  PRAYER_NAMES.forEach(p => { if (data.quran?.[p]) score += 1; });
  if (data.tarawih === 8) score += 1;
  return score;
};

export const calculateCurrentStreak = (allData: AllData): number => {
  const keys = Object.keys(allData).sort().reverse();
  if (keys.length === 0) return 0;
  
  let streak = 0;
  let checkDate = new Date();
  
  // Clean checkDate to midnight
  checkDate.setHours(0, 0, 0, 0);

  // Check if there is data for today or yesterday to maintain streak
  const todayKey = formatDateKey(new Date());
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayKey = formatDateKey(yesterday);

  if (!allData[todayKey] && !allData[yesterdayKey]) return 0;

  while (true) {
    const key = formatDateKey(checkDate);
    const data = allData[key];
    if (data && calculateDailyScore(data) > 0) {
      streak++;
      checkDate.setDate(checkDate.getDate() - 1);
    } else {
      break;
    }
  }
  return streak;
};

export const calculateTotalDeeds = (allData: AllData): number => {
  return Object.values(allData).reduce((acc, curr) => acc + calculateDailyScore(curr), 0);
};

export const loadData = (): AllData => {
  try {
    const raw = localStorage.getItem(getLocalStorageKey());
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    console.error("Failed to load data", e);
    return {};
  }
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
    return raw ? JSON.parse(raw) : DEFAULT_GOALS;
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
    month: 'long',
    day: 'numeric',
  });
};