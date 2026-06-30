import { Cpu, DownloadCloud, Sparkles } from 'lucide-react';

interface ProcessingStateProps {
  progressKey: string;
  progressPercentage: number;
  originalImageSrc: string | null;
}

export default function ProcessingState({
  progressKey,
  progressPercentage,
  originalImageSrc
}: ProcessingStateProps) {
  // Determine user-friendly messages
  let statusMessage = 'Initializing...';
  let statusSubMessage = 'Preparing the local AI engine.';
  let Icon = Sparkles;

  if (progressKey.includes('fetch')) {
    statusMessage = 'Downloading AI Model...';
    statusSubMessage = 'This takes 20-30 seconds on the first run. Subsequent uses will be instant.';
    Icon = DownloadCloud;
  } else if (progressKey.includes('compute') || progressKey.includes('processing')) {
    statusMessage = 'Removing Background...';
    statusSubMessage = 'AI is analyzing image details and extracting the subject.';
    Icon = Cpu;
  }

  return (
    <div className="w-full max-w-xl mx-auto px-4 py-8 flex flex-col items-center">
      {/* Scanning Image Preview */}
      {originalImageSrc && (
        <div className="relative w-full aspect-[4/3] max-h-[280px] rounded-3xl overflow-hidden glass-card mb-8 shadow-md">
          <img
            src={originalImageSrc}
            alt="Processing"
            className="w-full h-full object-contain p-2 opacity-60 blur-[1px]"
          />
          {/* Neon Scan Line */}
          <div className="absolute left-0 right-0 h-1.5 bg-gradient-to-r from-indigo-500 via-cyan-400 to-indigo-500 shadow-[0_0_12px_rgba(99,102,241,0.8)] animate-scan" />
          {/* Overlay mask */}
          <div className="absolute inset-0 bg-indigo-50/5 pointer-events-none" />
        </div>
      )}

      {/* Progress Card */}
      <div className="w-full p-6 rounded-2xl glass-card text-center relative overflow-hidden">
        <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 mb-4 mx-auto border border-indigo-100/50">
          <Icon className="w-6 h-6 animate-pulse" />
        </div>

        <h3 className="text-lg font-bold text-slate-800 mb-1">{statusMessage}</h3>
        <p className="text-xs text-slate-500 max-w-sm mx-auto mb-6 leading-relaxed">
          {statusSubMessage}
        </p>

        {/* Progress Bar */}
        <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden mb-2 border border-slate-200/40">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-full transition-all duration-300 ease-out shadow-[0_0_8px_rgba(99,102,241,0.3)]"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
        
        <div className="flex justify-between items-center text-xs font-semibold text-slate-500 px-1">
          <span>{progressKey.includes('fetch') ? 'Downloading Model' : 'AI Processing'}</span>
          <span className="text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">%{progressPercentage}</span>
        </div>
      </div>
    </div>
  );
}
