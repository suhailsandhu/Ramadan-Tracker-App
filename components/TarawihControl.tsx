import React from 'react';

interface TarawihControlProps {
  count: number;
  onChange: (count: number) => void;
}

const TarawihControl: React.FC<TarawihControlProps> = ({ count, onChange }) => {
  const isComplete = count === 8;

  const handleDecrement = () => {
    if (count > 0) onChange(count - 1);
  };

  const handleIncrement = () => {
    if (count < 8) onChange(count + 1);
  };

  return (
    <div className={`p-4 rounded-xl shadow-sm border mb-5 transition-colors ${isComplete ? 'bg-indigo-50/50 border-indigo-200' : 'bg-white border-stone-200'}`}>
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-base font-bold text-stone-800">Tarawih</h3>
          <p className="text-[11px] text-stone-500">Record your Rak'ahs (Goal: 8)</p>
        </div>
        {isComplete && (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-800 uppercase tracking-tighter" aria-label="Tarawih Goal Completed">
            Done
          </span>
        )}
      </div>

      <div className="flex items-center justify-between bg-stone-50 rounded-lg p-1.5 border border-stone-100">
        <button
          type="button"
          onClick={handleDecrement}
          disabled={count === 0}
          className="w-10 h-10 flex items-center justify-center bg-white rounded-md shadow-sm border border-stone-200 text-stone-600 active:bg-stone-100 disabled:opacity-50 disabled:cursor-not-allowed text-lg font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500"
          aria-label="Decrease Rak'ahs"
        >
          −
        </button>
        
        <div className="text-center" aria-live="polite">
          <span className="text-2xl font-bold text-stone-800 tabular-nums">{count}</span>
          <span className="text-xs text-stone-400 ml-1" aria-hidden="true">/ 8</span>
          <span className="sr-only">out of 8 Rak'ahs</span>
        </div>

        <button
          type="button"
          onClick={handleIncrement}
          disabled={count === 8}
          className={`w-10 h-10 flex items-center justify-center rounded-md shadow-sm border text-lg font-bold transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
            count === 7 
              ? 'bg-indigo-600 text-white border-indigo-600 hover:bg-indigo-700' 
              : 'bg-white border-stone-200 text-stone-600 active:bg-stone-100'
          } disabled:opacity-50 disabled:cursor-not-allowed`}
          aria-label="Increase Rak'ahs"
        >
          +
        </button>
      </div>
    </div>
  );
};

export default TarawihControl;