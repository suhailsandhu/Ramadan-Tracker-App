import React from 'react';
import { DayData, PrayerName } from '../types';

interface PrayerItemProps {
  name: PrayerName;
  dayData: DayData;
  onTogglePrayer: (name: PrayerName) => void;
  onToggleQuran: (name: PrayerName) => void;
}

const PrayerItem: React.FC<PrayerItemProps> = ({ name, dayData, onTogglePrayer, onToggleQuran }) => {
  const isPrayerDone = dayData.prayers[name];
  const isQuranDone = dayData.quran[name];

  return (
    <div className="flex items-center justify-between p-2 bg-white rounded-xl shadow-sm border border-stone-200 mb-2 hover:border-emerald-200 transition-colors">
      <button 
        type="button"
        onClick={() => onTogglePrayer(name)}
        aria-pressed={isPrayerDone}
        aria-label={`Mark ${name} prayer as ${isPrayerDone ? 'completed' : 'incomplete'}`}
        className="flex items-center flex-1 cursor-pointer text-left p-1 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors"
      >
        <div 
          aria-hidden="true"
          className={`w-7 h-7 rounded-full border-2 flex items-center justify-center mr-3 transition-colors ${
            isPrayerDone 
              ? 'bg-emerald-600 border-emerald-600 text-white' 
              : 'border-stone-300 text-transparent'
          }`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <span className={`text-base font-semibold ${isPrayerDone ? 'text-stone-800' : 'text-stone-500'}`}>
          {name}
        </span>
      </button>

      <button 
        type="button"
        onClick={() => onToggleQuran(name)}
        aria-pressed={isQuranDone}
        aria-label={`Mark Quran reading for ${name} as ${isQuranDone ? 'completed' : 'incomplete'}`}
        className="flex flex-col items-center justify-center pl-3 py-1 border-l border-stone-100 cursor-pointer rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 transition-colors"
      >
        <span aria-hidden="true" className="text-[9px] uppercase font-bold text-stone-400 mb-0.5 tracking-wider">Quran</span>
        <div 
          aria-hidden="true"
          className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${
            isQuranDone 
              ? 'bg-amber-400 border-amber-400 text-white' 
              : 'border-stone-300 bg-stone-50'
          }`}
        >
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        </div>
      </button>
    </div>
  );
};

export default PrayerItem;