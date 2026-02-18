import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import PrayerItem from './components/PrayerItem';
import TarawihControl from './components/TarawihControl';
import Overview from './components/Overview';
import GoalsModal from './components/GoalsModal';
import { 
  getInitialDayData, 
  loadData, 
  saveData, 
  loadGoals,
  saveGoals,
  formatDateKey, 
  parseDateKey, 
  calculateDailyScore,
  getLocalStorageKey,
  getGoalsStorageKey
} from './utils';
import { AllData, PRAYER_NAMES, PrayerName, Goal } from './types';

const App: React.FC = () => {
  // State
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [allData, setAllData] = useState<AllData>({});
  const [goals, setGoals] = useState<Goal[]>([]);
  const [isOverviewOpen, setIsOverviewOpen] = useState(false);
  const [isGoalsOpen, setIsGoalsOpen] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Derived state
  const dateKey = formatDateKey(currentDate);
  const dayData = allData[dateKey] || getInitialDayData();
  const dailyScore = calculateDailyScore(dayData);
  const progressPercent = Math.round((dailyScore / 11) * 100);

  // Load data on mount
  useEffect(() => {
    const loadedData = loadData();
    const loadedGoals = loadGoals();
    setAllData(loadedData);
    setGoals(loadedGoals);
    setIsInitialized(true);
  }, []);

  // Save data on change
  useEffect(() => {
    if (isInitialized) {
      saveData(allData);
    }
  }, [allData, isInitialized]);

  // Save goals on change
  useEffect(() => {
    if (isInitialized) {
      saveGoals(goals);
    }
  }, [goals, isInitialized]);

  // Handlers
  const handleDateChange = (date: Date) => {
    setCurrentDate(date);
  };

  const handlePrevDay = () => {
    const prev = new Date(currentDate);
    prev.setDate(prev.getDate() - 1);
    handleDateChange(prev);
  };

  const handleNextDay = () => {
    const next = new Date(currentDate);
    next.setDate(next.getDate() + 1);
    handleDateChange(next);
  };

  const handleJumpToday = () => {
    handleDateChange(new Date());
  };

  const updateDayData = useCallback((updater: (prev: typeof dayData) => typeof dayData) => {
    setAllData(prev => ({
      ...prev,
      [dateKey]: updater(prev[dateKey] || getInitialDayData())
    }));
  }, [dateKey]);

  const togglePrayer = (name: PrayerName) => {
    updateDayData(d => ({
      ...d,
      prayers: { ...d.prayers, [name]: !d.prayers[name] }
    }));
  };

  const toggleQuran = (name: PrayerName) => {
    updateDayData(d => ({
      ...d,
      quran: { ...d.quran, [name]: !d.quran[name] }
    }));
  };

  const handleTarawihChange = (count: number) => {
    updateDayData(d => ({ ...d, tarawih: count }));
  };

  const handleNoteChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    updateDayData(d => ({ ...d, note: val }));
  };

  const handleResetDay = () => {
    updateDayData(() => getInitialDayData());
  };

  const handleResetAll = () => {
    setAllData({});
    setGoals([]);
    localStorage.removeItem(getLocalStorageKey());
    localStorage.removeItem(getGoalsStorageKey());
  };

  const handleDateInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value) {
      setCurrentDate(parseDateKey(e.target.value));
    }
  };

  // Goals Handlers
  const handleAddGoal = (text: string) => {
    setGoals(prev => [
      ...prev, 
      { id: Date.now().toString(), text, completed: false }
    ]);
  };

  const handleToggleGoal = (id: string) => {
    setGoals(prev => prev.map(g => 
      g.id === id ? { ...g, completed: !g.completed } : g
    ));
  };

  const handleDeleteGoal = (id: string) => {
    setGoals(prev => prev.filter(g => g.id !== id));
  };

  if (!isInitialized) return null;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-16 font-sans">
      <Header 
        currentDate={currentDate} 
        onPrevDay={handlePrevDay} 
        onNextDay={handleNextDay}
        onJumpToday={handleJumpToday}
        onDateChange={handleDateInput}
        onOpenGoals={() => setIsGoalsOpen(true)}
        dateKey={dateKey}
      />

      <main className="max-w-md mx-auto px-4 pt-4">
        {/* Progress Card */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 mb-5 relative overflow-hidden">
          <div className="absolute top-0 left-0 h-1 bg-emerald-500 transition-all duration-500" style={{ width: `${progressPercent}%` }}></div>
          <div className="flex justify-between items-end mb-1">
            <div>
              <p className="text-[11px] text-slate-500 font-bold uppercase tracking-wider mb-0.5">Completion</p>
              <div className="flex items-baseline">
                <span className="text-3xl font-bold text-slate-800 tracking-tight">{dailyScore}</span>
                <span className="text-base text-slate-400 ml-1 font-medium">/ 11</span>
              </div>
            </div>
            <div className="text-right">
               <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-100">
                 {progressPercent}%
               </span>
            </div>
          </div>
        </div>

        {/* Prayer List */}
        <div className="mb-5">
          <h2 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 px-1">Daily Prayers</h2>
          {PRAYER_NAMES.map(p => (
            <PrayerItem 
              key={p} 
              name={p} 
              dayData={dayData} 
              onTogglePrayer={togglePrayer}
              onToggleQuran={toggleQuran}
            />
          ))}
        </div>

        {/* Tarawih Section */}
        <div className="mb-5">
          <TarawihControl 
            count={dayData.tarawih} 
            onChange={handleTarawihChange} 
          />
        </div>

        {/* Notes */}
        <div className="mb-6">
           <details className="group">
            <summary className="flex items-center justify-between cursor-pointer list-none text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 px-1">
              <span>Notes</span>
              <span className="transition-transform group-open:rotate-180">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
              </span>
            </summary>
            <textarea
              value={dayData.note}
              onChange={handleNoteChange}
              placeholder="Reflections..."
              className="w-full p-3 rounded-xl border border-slate-200 shadow-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none min-h-[100px] text-sm text-slate-700 bg-white resize-none"
            />
           </details>
        </div>

      </main>

      {/* Floating Action Button for Overview - Optimized size */}
      <button 
        onClick={() => setIsOverviewOpen(true)}
        className="fixed bottom-5 right-5 w-12 h-12 bg-emerald-600 text-white rounded-full shadow-lg shadow-emerald-200 flex items-center justify-center hover:bg-emerald-700 active:scale-95 transition-all z-40"
        aria-label="Open Analytics"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
        </svg>
      </button>

      <Overview 
        isOpen={isOverviewOpen}
        onClose={() => setIsOverviewOpen(false)}
        allData={allData}
        onSelectDate={(key) => {
          setCurrentDate(parseDateKey(key));
          setIsOverviewOpen(false);
        }}
        onResetDay={handleResetDay}
        onResetAll={handleResetAll}
        currentDateKey={dateKey}
      />

      <GoalsModal 
        isOpen={isGoalsOpen}
        onClose={() => setIsGoalsOpen(false)}
        goals={goals}
        onAddGoal={handleAddGoal}
        onToggleGoal={handleToggleGoal}
        onDeleteGoal={handleDeleteGoal}
      />
    </div>
  );
};

export default App;