import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { AllData } from '../types';
import { calculateDailyScore } from '../utils';

interface AiInsightProps {
  allData: AllData;
  dateKey: string;
}

const AiInsight: React.FC<AiInsightProps> = ({ allData, dateKey }) => {
  const [insight, setInsight] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const generateInsight = async () => {
    setLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      // Get last 7 days of memory
      const sortedKeys = Object.keys(allData).sort().reverse();
      const lastWeek = sortedKeys.slice(0, 7).map(k => ({
        date: k,
        score: calculateDailyScore(allData[k]),
        note: allData[k].note
      }));

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `User's Ramadan progress (memory): ${JSON.stringify(lastWeek)}. 
        The current date is ${dateKey}. 
        Provide a 2-sentence warm, poetic, and spiritually encouraging reflection for their Ramadan journey. 
        Focus on mercy and consistency. Keep it short and beautiful. Do not use Markdown headings.`,
      });

      setInsight(response.text || "May your journey be filled with light and ease.");
    } catch (error) {
      console.error("Gemini Error:", error);
      setInsight("The heart finds rest in remembrance. Keep going, you are doing beautifully.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // We could auto-generate, but let's make it on-demand to save tokens/API calls
  }, []);

  return (
    <div className="bg-amber-50/50 border border-amber-100 rounded-2xl p-4 mb-5 transition-all">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-amber-100 rounded-full flex items-center justify-center">
            <svg className="w-3.5 h-3.5 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" />
            </svg>
          </div>
          <h3 className="text-[10px] font-bold text-amber-700 uppercase tracking-widest">Daily Reflection</h3>
        </div>
        {!insight && !loading && (
          <button 
            onClick={generateInsight}
            className="text-[9px] font-bold text-amber-600 hover:text-amber-800 transition-colors uppercase"
          >
            Seek Insight
          </button>
        )}
      </div>
      
      {loading ? (
        <div className="flex items-center gap-2 py-1">
          <div className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-bounce"></div>
          <div className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-bounce delay-75"></div>
          <div className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-bounce delay-150"></div>
          <span className="text-[11px] text-amber-500 font-medium italic">The stars are aligning...</span>
        </div>
      ) : insight ? (
        <p className="text-[12px] text-stone-700 leading-relaxed font-medium italic">
          "{insight}"
        </p>
      ) : (
        <p className="text-[11px] text-stone-400 font-medium italic">
          Reflect on your memory to find inspiration for today's path.
        </p>
      )}
    </div>
  );
};

export default AiInsight;