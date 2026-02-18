import React from 'react';
import { getFormattedDateString, getRamadanDay } from '../utils';

interface HeaderProps {
  currentDate: Date;
  onPrevDay: () => void;
  onNextDay: () => void;
  onJumpToday: () => void;
  onDateChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onOpenGoals: () => void;
  dateKey: string;
}

const Header: React.FC<HeaderProps> = ({ 
  currentDate, 
  onPrevDay, 
  onNextDay, 
  onJumpToday,
  onDateChange,
  onOpenGoals,
  dateKey
}) => {
  const ramadanDay = getRamadanDay(currentDate);
  const isPreRamadan = ramadanDay < 1;

  return (
    <header className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm border-b border-slate-200 shadow-sm pb-3 pt-3 px-4">
      <div className="max-w-md mx-auto">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h1 className="text-xl font-bold text-emerald-900 tracking-tight leading-tight">Ramadan Tracker</h1>
            <p className="text-[10px] font-semibold text-emerald-600 uppercase tracking-widest">1447 AH • 2026</p>
          </div>
          <div className="flex flex-col items-end gap-1.5">
            <button 
              onClick={onJumpToday}
              className="px-2.5 py-0.5 text-[10px] font-medium bg-slate-100 text-slate-600 rounded-full hover:bg-slate-200 active:bg-slate-300 transition-colors"
            >
              Today
            </button>
            <button 
              onClick={onOpenGoals}
              className="px-2.5 py-0.5 text-[10px] font-bold bg-amber-50 text-amber-600 rounded-full border border-amber-100 hover:bg-amber-100 active:bg-amber-200 transition-colors flex items-center"
            >
              <svg className="w-2.5 h-2.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              My Goals
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between bg-slate-50 p-0.5 rounded-lg border border-slate-200">
          <button 
            onClick={onPrevDay}
            className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-white rounded-md transition-all active:scale-95"
            aria-label="Previous Day"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <div className="flex flex-col items-center relative group cursor-pointer">
             <input 
              type="date" 
              value={dateKey}
              onChange={onDateChange}
              className="absolute inset-0 opacity-0 w-full h-full cursor-pointer z-20"
            />
            <span className={`text-[11px] font-bold leading-none ${isPreRamadan ? 'text-slate-400' : 'text-emerald-700'}`}>
              {isPreRamadan ? 'Pre-Ramadan' : `DAY ${ramadanDay}`}
            </span>
            <span className="text-[10px] text-slate-500 font-medium">
              {getFormattedDateString(currentDate)}
            </span>
            <div className="absolute -bottom-0.5 w-6 h-0.5 bg-slate-300 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </div>

          <button 
            onClick={onNextDay}
            className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-white rounded-md transition-all active:scale-95"
            aria-label="Next Day"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;