import React from 'react';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell, Legend } from 'recharts';
import { AllData, DailyStats, PRAYER_NAMES } from '../types';
import { calculateDailyScore, getRamadanDay, parseDateKey } from '../utils';

interface OverviewProps {
  isOpen: boolean;
  onClose: () => void;
  allData: AllData;
  onSelectDate: (dateKey: string) => void;
  onResetDay: () => void;
  onResetAll: () => void;
  currentDateKey: string;
}

const Overview: React.FC<OverviewProps> = ({ 
  isOpen, 
  onClose, 
  allData, 
  onSelectDate, 
  onResetDay, 
  onResetAll,
  currentDateKey
}) => {
  if (!isOpen) return null;

  const historyData: DailyStats[] = Object.keys(allData)
    .sort()
    .map(key => {
      const date = parseDateKey(key);
      const dayData = allData[key];
      
      const prayerScore = PRAYER_NAMES.filter(p => dayData.prayers[p]).length;
      const quranScore = PRAYER_NAMES.filter(p => dayData.quran[p]).length;
      const tarawihScore = dayData.tarawih === 8 ? 1 : 0;
      
      return {
        date: key,
        totalScore: calculateDailyScore(dayData),
        prayerScore,
        quranScore,
        tarawihScore,
        total: 11,
        isRamadan: getRamadanDay(date) > 0,
        dayNumber: getRamadanDay(date)
      };
    })
    .filter(d => d.isRamadan && d.totalScore > 0);

  const activeDays = historyData.length;
  const avgScore = activeDays > 0 
    ? (historyData.reduce((acc, curr) => acc + curr.totalScore, 0) / activeDays).toFixed(1) 
    : '0';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl w-full max-w-lg max-h-[85vh] overflow-hidden flex flex-col shadow-2xl">
        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <h2 className="text-lg font-bold text-slate-800">Analytics</h2>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="overflow-y-auto p-4 no-scrollbar">
          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-100">
              <p className="text-[9px] uppercase font-bold text-emerald-600 mb-0.5 tracking-wider">Days Active</p>
              <p className="text-2xl font-bold text-emerald-800 leading-none">{activeDays}</p>
            </div>
            <div className="bg-indigo-50 p-3 rounded-xl border border-indigo-100">
              <p className="text-[9px] uppercase font-bold text-indigo-600 mb-0.5 tracking-wider">Avg Score</p>
              <div className="flex items-baseline leading-none">
                <p className="text-2xl font-bold text-indigo-800">{avgScore}</p>
                <span className="text-[10px] text-indigo-400 ml-1">/ 11</span>
              </div>
            </div>
          </div>

          {historyData.length > 0 ? (
            <div className="mb-6 h-56 w-full">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Breakdown</p>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={historyData} barSize={14}>
                  <XAxis 
                    dataKey="dayNumber" 
                    tick={{fontSize: 9, fill: '#94a3b8'}} 
                    tickFormatter={(val) => `${val}`}
                    axisLine={false}
                    tickLine={false}
                    dy={5}
                  />
                  <Tooltip 
                    cursor={{fill: '#f8fafc'}}
                    contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontSize: '10px'}}
                  />
                  <Legend 
                    verticalAlign="top" 
                    height={30} 
                    iconType="circle"
                    wrapperStyle={{ fontSize: '10px', fontWeight: 'bold' }}
                  />
                  <Bar 
                    dataKey="prayerScore" 
                    name="Prayers" 
                    stackId="a" 
                    fill="#10b981" 
                    radius={[0, 0, 2, 2]} 
                  />
                  <Bar 
                    dataKey="quranScore" 
                    name="Quran" 
                    stackId="a" 
                    fill="#fbbf24" 
                  />
                  <Bar 
                    dataKey="tarawihScore" 
                    name="Tarawih" 
                    stackId="a" 
                    fill="#6366f1" 
                    radius={[2, 2, 0, 0]} 
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="text-center py-8 mb-6 bg-slate-50 rounded-xl border border-dashed border-slate-300">
              <p className="text-slate-400 text-[11px] font-medium">No activity yet.</p>
            </div>
          )}

          <div className="border-t border-slate-100 pt-5">
            <h3 className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-3">Management</h3>
            <div className="space-y-2">
              <button 
                onClick={() => {
                  if (window.confirm('Reset selected day?')) {
                    onResetDay();
                    onClose();
                  }
                }}
                className="w-full py-2.5 px-4 rounded-lg border border-red-100 text-red-600 bg-white hover:bg-red-50 active:bg-red-100 transition-colors font-bold text-[11px] uppercase tracking-wider"
              >
                Reset Selected Day
              </button>
              <button 
                onClick={() => {
                  if (window.confirm('Erase all history?')) {
                    onResetAll();
                    onClose();
                  }
                }}
                className="w-full py-2.5 px-4 rounded-lg bg-red-50 text-red-700 hover:bg-red-100 active:bg-red-200 transition-colors font-bold text-[11px] uppercase tracking-wider"
              >
                Reset All Data
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;