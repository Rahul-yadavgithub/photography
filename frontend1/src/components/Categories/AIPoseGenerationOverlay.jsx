import React, { useEffect, useState } from 'react';
import { CheckCircle2, Sparkles, AlertCircle, RefreshCw, Loader2 } from 'lucide-react';

const GENERATION_STEPS = [
  "Reading Category",
  "Analyzing Photography Trends",
  "Creating Pose Concepts",
  "Writing Professional Titles",
  "Creating Descriptions",
  "Determining Best Time",
  "Selecting Best Lens",
  "Creating Shooting Tips",
  "Preparing Pose Cards",
  "Finalizing Results"
];

const AIPoseGenerationOverlay = ({ isOpen, status, onRetry, onDismiss }) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  useEffect(() => {
    let timeouts = [];
    
    if (isOpen && status === 'GENERATING') {
      setCurrentStepIndex(0);
      
      // Simulate progressive steps more gradually since there are 10 steps
      timeouts.push(setTimeout(() => setCurrentStepIndex(1), 1000));
      timeouts.push(setTimeout(() => setCurrentStepIndex(2), 2000));
      timeouts.push(setTimeout(() => setCurrentStepIndex(3), 3000));
      timeouts.push(setTimeout(() => setCurrentStepIndex(4), 4500));
      timeouts.push(setTimeout(() => setCurrentStepIndex(5), 5500));
      timeouts.push(setTimeout(() => setCurrentStepIndex(6), 6500));
      timeouts.push(setTimeout(() => setCurrentStepIndex(7), 7500));
      timeouts.push(setTimeout(() => setCurrentStepIndex(8), 8500));
      timeouts.push(setTimeout(() => setCurrentStepIndex(9), 9500));
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
            <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 mb-6 shadow-sm border border-indigo-100 mx-auto">
              <Sparkles className="w-8 h-8 animate-pulse" />
            </div>
            
            <h3 className="text-2xl font-bold text-center text-zinc-900 mb-2">Generating Professional Poses</h3>
            <p className="text-zinc-500 text-center text-sm font-medium mb-8">Creating unique, high-end photography poses...</p>
            
            <div className="space-y-3 h-64 overflow-y-auto pr-2 custom-scrollbar">
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
            <h3 className="text-2xl font-bold text-zinc-900 mb-2">Poses Generated!</h3>
            <p className="text-zinc-500 font-medium">Your AI-generated poses are ready for review.</p>
          </div>
        )}

        {/* ERROR STATE */}
        {status === 'ERROR' && (
          <div className="p-10 flex flex-col items-center justify-center text-center animate-in fade-in zoom-in duration-300">
            <div className="flex items-center justify-center w-20 h-20 rounded-full bg-red-50 text-red-500 mb-6 shadow-sm border border-red-100">
              <AlertCircle className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-bold text-zinc-900 mb-2">Unable To Generate Poses</h3>
            <p className="text-zinc-500 font-medium text-sm mb-4 leading-relaxed">
              Possible Reasons:<br/>
              • AI timeout<br/>
              • Network issue<br/>
              • Rate limit exceeded
            </p>
            <div className="flex items-center gap-3 w-full mt-4">
              <button 
                onClick={onDismiss}
                className="flex-1 px-4 py-3 bg-zinc-100 text-zinc-700 text-sm font-bold rounded-xl hover:bg-zinc-200 transition-colors"
              >
                Cancel
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

export default AIPoseGenerationOverlay;
