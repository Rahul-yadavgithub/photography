import React from 'react';
import { Loader2 } from 'lucide-react';

const Loader = ({ fullScreen = false, text = "Loading data..." }) => {
  const content = (
    <div className="flex flex-col items-center justify-center space-y-4 text-zinc-400">
      <div className="relative flex items-center justify-center">
        {/* Outer pulsing ring */}
        <div className="absolute w-16 h-16 border-4 border-zinc-200 rounded-full animate-ping opacity-20"></div>
        {/* Inner spinning loader */}
        <Loader2 className="w-10 h-10 animate-spin text-zinc-900 relative z-10" />
      </div>
      <p className="text-sm font-semibold uppercase tracking-widest text-zinc-500 animate-pulse">{text}</p>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] w-full">
        {content}
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center py-12 w-full">
      {content}
    </div>
  );
};

export default Loader;
