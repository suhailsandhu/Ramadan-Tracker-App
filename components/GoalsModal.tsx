import React, { useState } from 'react';
import { Goal } from '../types';

interface GoalsModalProps {
  isOpen: boolean;
  onClose: () => void;
  goals: Goal[];
  onAddGoal: (text: string) => void;
  onToggleGoal: (id: string) => void;
  onDeleteGoal: (id: string) => void;
}

const GoalsModal: React.FC<GoalsModalProps> = ({
  isOpen,
  onClose,
  goals,
  onAddGoal,
  onToggleGoal,
  onDeleteGoal,
}) => {
  const [newGoalText, setNewGoalText] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newGoalText.trim()) {
      onAddGoal(newGoalText.trim());
      setNewGoalText('');
    }
  };

  const completedCount = goals.filter(g => g.completed).length;
  const progress = goals.length > 0 ? Math.round((completedCount / goals.length) * 100) : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl w-full max-w-lg max-h-[80vh] overflow-hidden flex flex-col shadow-2xl">
        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <div>
            <h2 className="text-lg font-bold text-slate-800">My Goals</h2>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-0.5">
               {completedCount}/{goals.length} Completed
            </p>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {goals.length > 0 && (
          <div className="h-0.5 bg-slate-100 w-full">
            <div 
              className="h-full bg-emerald-500 transition-all duration-500"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        )}

        <div className="flex-1 overflow-y-auto p-4 no-scrollbar">
          {goals.length === 0 ? (
            <div className="text-center py-10 border-2 border-dashed border-slate-200 rounded-xl mb-4">
              <p className="text-slate-400 text-xs font-medium">No goals yet.</p>
            </div>
          ) : (
            <div className="space-y-2 mb-4">
              {goals.map((goal) => (
                <div 
                  key={goal.id} 
                  className={`flex items-start p-2.5 rounded-lg border transition-all ${
                    goal.completed 
                      ? 'bg-emerald-50 border-emerald-100' 
                      : 'bg-white border-slate-200 shadow-sm'
                  }`}
                >
                  <button
                    onClick={() => onToggleGoal(goal.id)}
                    className={`mt-0.5 flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center mr-2.5 transition-colors ${
                      goal.completed
                        ? 'bg-emerald-500 border-emerald-500 text-white'
                        : 'border-slate-300 text-transparent'
                    }`}
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </button>
                  <span 
                    className={`flex-1 text-[13px] font-semibold leading-snug ${
                      goal.completed ? 'text-emerald-800 line-through decoration-emerald-300' : 'text-slate-700'
                    }`}
                  >
                    {goal.text}
                  </span>
                  <button 
                    onClick={() => onDeleteGoal(goal.id)}
                    className="ml-2 text-slate-300 hover:text-red-400 transition-colors p-0.5"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="p-3 bg-slate-50 border-t border-slate-100">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              type="text"
              value={newGoalText}
              onChange={(e) => setNewGoalText(e.target.value)}
              placeholder="New goal..."
              className="flex-1 px-3 py-2 rounded-lg border border-slate-300 shadow-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none text-xs"
            />
            <button
              type="submit"
              disabled={!newGoalText.trim()}
              className="bg-emerald-600 text-white px-3 py-1 rounded-lg font-bold text-[10px] uppercase shadow-sm hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Add
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default GoalsModal;