import React from 'react';
import { getFormattedDateString, getRamadanDay } from '../utils';

interface HeaderProps {
  currentDate: Date;
  onPrevDay: () => void;
  onNextDay: () => void;
  onJumpToday: () => void;
  onDateChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onOpenGoals: () => void;
  onSave: () => void;
  isSaving: boolean;
  dateKey: string;
}

const Header: React.FC<HeaderProps> = ({ 
  currentDate, 
  onPrevDay, 
  onNextDay, 
  onJumpToday,
  onDateChange,
  onOpenGoals,
  onSave,
  isSaving,
  dateKey
}) => {
  const ramadanDay = getRamadanDay(currentDate);
  const isPreRamadan = ramadanDay < 1;

  return (
    <header className="sticky top-0 z-10 bg-[#FDFBF7]/95 backdrop-blur-sm border-b border-stone-200 shadow-sm pb-3 pt-3 px-4 transition-colors">
      <div className="max-w-md mx-auto">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h1 className="text-xl font-bold text-emerald-900 tracking-tight leading-tight">Ramadan Tracker</h1>
            <p className="text-[10px] font-bold text-amber-600 uppercase tracking-widest mt-0.5">1447 AH • 2026</p>
          </div>
          <div className="flex flex-col items-end gap-1.5">
            <div className="flex items-center gap-1.5">
              <button 
                onClick={onSave}
                className={`px-2.5 py-0.5 text-[10px] font-bold rounded-full border transition-all flex items-center shadow-sm focus:outline-none focus:ring-2 ${
                  isSaving 
                    ? 'bg-amber-100 text-amber-700 border-amber-200 scale-95' 
                    : 'bg-emerald-50 text-emerald-700 border-emerald-100 hover:bg-emerald-100 active:bg-emerald-200 focus:ring-emerald-500'
                }`}
                aria-label="Save current progress"
              >
                <svg aria-hidden="true" className={`w-2.5 h-2.5 mr-1 ${isSaving ? 'animate-pulse' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d={isSaving ? "M5 13l4 4L19 7" : "M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"} />
                </svg>
                {isSaving ? 'Saved' : 'Save'}
              </button>
              <button 
                onClick={onJumpToday}
                className="px-2.5 py-0.5 text-[10px] font-bold bg-stone-100 text-stone-600 rounded-full hover:bg-stone-200 active:bg-stone-300 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                Today
              </button>
            </div>
            <button 
              onClick={onOpenGoals}
              className="px-2.5 py-0.5 text-[10px] font-bold bg-amber-50 text-amber-700 rounded-full border border-amber-100 hover:bg-amber-100 active:bg-amber-200 transition-colors flex items-center focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-sm"
            >
              <svg aria-hidden="true" className="w-2.5 h-2.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              My Goals
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between bg-white p-0.5 rounded-lg border border-stone-200 shadow-sm">
          <button 
            onClick={onPrevDay}
            className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-50 rounded-md transition-all active:scale-95 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-emerald-500"
            aria-label="Previous Day"
          >
            <svg aria-hidden="true" className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <div className="flex flex-col items-center relative group cursor-pointer">
             <input 
              type="date" 
              value={dateKey}
              onChange={onDateChange}
              aria-label="Change Date"
              className="absolute inset-0 opacity-0 w-full h-full cursor-pointer z-20 focus:opacity-0"
            />
            <span aria-hidden="true" className={`text-[11px] font-bold leading-none ${isPreRamadan ? 'text-stone-400' : 'text-emerald-800'}`}>
              {isPreRamadan ? 'Pre-Ramadan' : `DAY ${ramadanDay}`}
            </span>
            <span aria-hidden="true" className="text-[10px] text-stone-500 font-medium">
              {getFormattedDateString(currentDate)}
            </span>
            <div className="absolute -bottom-0.5 w-6 h-0.5 bg-amber-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" aria-hidden="true"></div>
          </div>

          <button 
            onClick={onNextDay}
            className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-50 rounded-md transition-all active:scale-95 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-emerald-500"
            aria-label="Next Day"
          >
            <svg aria-hidden="true" className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;