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
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [allData, setAllData] = useState<AllData>({});
  const [goals, setGoals] = useState<Goal[]>([]);
  const [isOverviewOpen, setIsOverviewOpen] = useState(false);
  const [isGoalsOpen, setIsGoalsOpen] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  const dateKey = formatDateKey(currentDate);
  const dayData = allData[dateKey] || getInitialDayData();
  const dailyScore = calculateDailyScore(dayData);
  const progressPercent = Math.round((dailyScore / 11) * 100);

  useEffect(() => {
    const loadedData = loadData();
    const loadedGoals = loadGoals();
    setAllData(loadedData);
    setGoals(loadedGoals);
    setIsInitialized(true);
  }, []);

  useEffect(() => {
    if (isInitialized) {
      saveData(allData);
    }
  }, [allData, isInitialized]);

  useEffect(() => {
    if (isInitialized) {
      saveGoals(goals);
    }
  }, [goals, isInitialized]);

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
    <div className="min-h-screen pb-20 font-sans" style={{
      background: 'linear-gradient(135deg, #f5e6d3 0%, #e8d4c0 25%, #f0dcc8 50%, #e5cfb8 75%, #f3dfca 100%)',
      color: '#3d2817'
    }}>
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        <div className="absolute top-8 left-6 text-3xl opacity-30">✨</div>
        <div className="absolute top-20 right-8 text-2xl opacity-25">✨</div>
        <div className="absolute bottom-32 left-4 text-2xl opacity-20">✨</div>
        <div className="absolute top-1/3 right-4 text-xl opacity-20">✨</div>
      </div>

      <Header 
        currentDate={currentDate} 
        onPrevDay={handlePrevDay} 
        onNextDay={handleNextDay}
        onJumpToday={handleJumpToday}
        onDateChange={handleDateInput}
        onOpenGoals={() => setIsGoalsOpen(true)}
        dateKey={dateKey}
      />

      <main className="max-w-md mx-auto px-4 pt-6 relative z-10">
        <div className="mb-6 relative">
          <div style={{
            background: 'linear-gradient(135deg, rgba(217, 119, 6, 0.1) 0%, rgba(217, 119, 6, 0.05) 100%)',
            border: '2px solid rgba(217, 119, 6, 0.3)',
            borderRadius: '20px',
            padding: '24px',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 8px 32px rgba(217, 119, 6, 0.15), inset 0 1px 0 rgba(255,255,255,0.5)'
          }}>
            <div style={{
              position: 'absolute',
              top: '12px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '90%',
              height: '8px',
              background: `linear-gradient(90deg, transparent, rgba(217, 119, 6, ${progressPercent / 100}), transparent)`,
              borderRadius: '4px',
              transition: 'all 0.6s ease',
              boxShadow: `0 0 16px rgba(217, 119, 6, ${progressPercent / 150})`
            }}></div>

            <div className="flex justify-between items-start mb-4">
              <div>
                <p style={{ fontSize: '10px', fontWeight: '700', letterSpacing: '1px', color: '#8B5A2B', textTransform: 'uppercase', marginBottom: '4px' }}>
                  ✨ Daily Completion ✨
                </p>
                <div className="flex items-baseline">
                  <span style={{ fontSize: '32px', fontWeight: '800', color: '#7C2D12', fontFamily: 'Georgia, serif' }}>{dailyScore}</span>
                  <span style={{ fontSize: '16px', color: '#b8860b', marginLeft: '4px', fontWeight: '600' }}>/ 11</span>
                </div>
              </div>
              <div className="text-center">
                <div style={{
                  fontSize: '28px',
                  fontWeight: '700',
                  color: '#d97706',
                  fontFamily: 'Georgia, serif',
                  textShadow: '0 2px 8px rgba(217, 119, 6, 0.3)'
                }}>
                  {progressPercent}%
                </div>
                <p style={{ fontSize: '9px', fontWeight: '600', color: '#a16207', marginTop: '2px' }}>Complete</p>
              </div>
            </div>

            <div style={{
              width: '100%',
              height: '24px',
              background: 'rgba(255, 255, 255, 0.3)',
              borderRadius: '12px',
              overflow: 'hidden',
              border: '1px solid rgba(217, 119, 6, 0.2)'
            }}>
              <div style={{
                height: '100%',
                width: `${progressPercent}%`,
                background: 'linear-gradient(90deg, #d97706 0%, #f59e0b 50%, #fbbf24 100%)',
                transition: 'width 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)',
                boxShadow: `0 0 12px rgba(217, 119, 6, 0.6), inset 0 0 8px rgba(255, 255, 255, 0.3)`,
                borderRadius: '12px'
              }}></div>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <p style={{ fontSize: '10px', fontWeight: '700', letterSpacing: '2px', color: '#8B5A2B', textTransform: 'uppercase', marginBottom: '12px', paddingLeft: '4px', textAlign: 'center' }}>
            🌙 Daily Prayers 🌙
          </p>
          <div className="space-y-3">
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
        </div>

        <div className="mb-6">
          <TarawihControl 
            count={dayData.tarawih} 
            onChange={handleTarawihChange} 
          />
        </div>

        <div className="mb-6">
          <details className="group">
            <summary style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer',
              listStyle: 'none',
              fontSize: '10px',
              fontWeight: '700',
              letterSpacing: '1px',
              color: '#8B5A2B',
              textTransform: 'uppercase',
              marginBottom: '8px',
              paddingLeft: '4px',
              userSelect: 'none'
            }}>
              <span>📝 Reflections 📝</span>
              <span style={{ transition: 'transform 0.3s ease' }} className="group-open:rotate-180">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
              </span>
            </summary>
            <textarea
              value={dayData.note}
              onChange={handleNoteChange}
              placeholder="Share your Ramadan reflections..."
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '12px',
                border: '2px solid rgba(217, 119, 6, 0.3)',
                background: 'rgba(255, 255, 255, 0.7)',
                color: '#3d2817',
                fontSize: '14px',
                minHeight: '100px',
                resize: 'none',
                fontFamily: 'Poppins, sans-serif',
                transition: 'all 0.3s ease',
                outline: 'none',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)'
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = 'rgba(217, 119, 6, 0.6)';
                e.currentTarget.style.boxShadow = '0 0 16px rgba(217, 119, 6, 0.2), 0 2px 8px rgba(0, 0, 0, 0.05)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = 'rgba(217, 119, 6, 0.3)';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.05)';
              }}
            />
          </details>
        </div>
      </main>

      <button 
        onClick={() => setIsOverviewOpen(true)}
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '20px',
          width: '56px',
          height: '56px',
          background: 'linear-gradient(135deg, #d97706 0%, #f59e0b 100%)',
          color: 'white',
          border: 'none',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          fontSize: '24px',
          boxShadow: '0 8px 24px rgba(217, 119, 6, 0.4), 0 0 16px rgba(217, 119, 6, 0.2)',
          transition: 'all 0.3s ease',
          zIndex: 50
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.1)';
          e.currentTarget.style.boxShadow = '0 12px 32px rgba(217, 119, 6, 0.5), 0 0 24px rgba(217, 119, 6, 0.3)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.boxShadow = '0 8px 24px rgba(217, 119, 6, 0.4), 0 0 16px rgba(217, 119, 6, 0.2)';
        }}
        aria-label="Open Analytics"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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