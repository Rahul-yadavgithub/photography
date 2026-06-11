import React, { useEffect, useState } from 'react';
import { CheckCircle2, Sparkles, AlertCircle, RefreshCw, X, Loader2 } from 'lucide-react';

const GENERATION_STEPS = [
  "Analyzing category intent...",
  "Crafting marketing copy...",
  "Creating category highlights...",
  "Building FAQ suggestions...",
  "Preparing SEO metadata...",
  "Finalizing content..."
];

const AIGenerationOverlay = ({ isOpen, status, onRetry, onDismiss }) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  useEffect(() => {
    let timeouts = [];
    
    if (isOpen && status === 'GENERATING') {
      setCurrentStepIndex(0);
      
      // Simulate progressive steps
      // 0 -> 1 at 1.5s
      // 1 -> 2 at 3.0s
      // 2 -> 3 at 4.5s
      // 3 -> 4 at 6.0s
      // 4 -> 5 at 8.0s (Will hang here until API finishes if it takes longer)
      
      timeouts.push(setTimeout(() => setCurrentStepIndex(1), 1500));
      timeouts.push(setTimeout(() => setCurrentStepIndex(2), 3000));
      timeouts.push(setTimeout(() => setCurrentStepIndex(3), 4500));
      timeouts.push(setTimeout(() => setCurrentStepIndex(4), 6000));
      timeouts.push(setTimeout(() => setCurrentStepIndex(5), 8000));
    }

    if (!isOpen) {
      setCurrentStepIndex(0);
    }

    return () => timeouts.forEach(clearTimeout);
  }, [isOpen, status]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-zinc-900/40 backdrop-blur-sm transition-all duration-500">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden transform animate-in zoom-in-95 fade-in duration-300 border border-zinc-100">
        
        {/* GENERATING STATE */}
        {status === 'GENERATING' && (
          <div className="p-8 md:p-10 flex flex-col">
            <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 mb-8 shadow-sm border border-indigo-100 mx-auto">
              <Sparkles className="w-8 h-8 animate-pulse" />
            </div>
            
            <h3 className="text-2xl font-bold text-center text-zinc-900 mb-2">Generating Content</h3>
            <p className="text-zinc-500 text-center text-sm font-medium mb-8">Creating content for your photography services...</p>
            
            <div className="space-y-4">
              {GENERATION_STEPS.map((step, index) => {
                const isCompleted = index < currentStepIndex;
                const isCurrent = index === currentStepIndex;
                const isPending = index > currentStepIndex;

                return (
                  <div key={index} className={`flex items-center gap-4 transition-all duration-500 ${isPending ? 'opacity-30' : 'opacity-100'}`}>
                    <div className="shrink-0 flex items-center justify-center w-6 h-6">
                      {isCompleted ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-500 animate-in zoom-in duration-300" />
                      ) : isCurrent ? (
                        <Loader2 className="w-5 h-5 text-indigo-500 animate-spin" />
                      ) : (
                        <div className="w-2 h-2 rounded-full bg-zinc-300" />
                      )}
                    </div>
                    <span className={`text-sm font-medium ${isCompleted ? 'text-zinc-500' : isCurrent ? 'text-zinc-900' : 'text-zinc-400'}`}>
                      {step}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* SUCCESS STATE */}
        {status === 'SUCCESS' && (
          <div className="p-10 flex flex-col items-center justify-center text-center animate-in fade-in zoom-in duration-500">
            <div className="flex items-center justify-center w-20 h-20 rounded-full bg-emerald-50 text-emerald-500 mb-6 shadow-sm border border-emerald-100">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-bold text-zinc-900 mb-2">Content Generated!</h3>
            <p className="text-zinc-500 font-medium">Your category content is ready for review.</p>
          </div>
        )}

        {/* ERROR STATE */}
        {status === 'ERROR' && (
          <div className="p-10 flex flex-col items-center justify-center text-center animate-in fade-in zoom-in duration-300">
            <div className="flex items-center justify-center w-20 h-20 rounded-full bg-red-50 text-red-500 mb-6 shadow-sm border border-red-100">
              <AlertCircle className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-bold text-zinc-900 mb-2">Generation Failed</h3>
            <p className="text-zinc-500 font-medium text-sm mb-8 leading-relaxed max-w-[280px]">
              The content service is temporarily unavailable. Please try again in a moment.
            </p>
            <div className="flex items-center gap-3 w-full">
              <button 
                onClick={onDismiss}
                className="flex-1 px-4 py-3 bg-zinc-100 text-zinc-700 text-sm font-bold rounded-xl hover:bg-zinc-200 transition-colors"
              >
                Dismiss
              </button>
              <button 
                onClick={onRetry}
                className="flex-1 px-4 py-3 bg-zinc-900 text-white text-sm font-bold rounded-xl hover:bg-zinc-800 transition-colors flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Retry
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default AIGenerationOverlay;
