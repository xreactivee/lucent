import { Sparkles, HelpCircle } from 'lucide-react';

interface HeaderProps {
  onHowItWorksClick: () => void;
}

export default function Header({ onHowItWorksClick }: HeaderProps) {
  return (
    <div className="fixed top-4 left-0 right-0 z-50 px-4">
      <header className="w-[92%] md:w-[60%] max-w-5xl mx-auto px-6 py-3.5 glass-panel backdrop-blur-md bg-white/70 border border-white/50 rounded-full flex items-center justify-between shadow-lg shadow-slate-100/50 transition-all duration-300">
        <div className="flex items-center gap-2.5">
          <div className="relative flex items-center justify-center w-8.5 h-8.5 rounded-full bg-gradient-to-tr from-indigo-500 to-cyan-400 text-white shadow-md shadow-indigo-200">
            <Sparkles className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <h1 className="text-base font-bold tracking-tight bg-gradient-to-r from-slate-900 to-indigo-950 bg-clip-text text-transparent m-0 p-0 leading-none">
              Lucent
            </h1>
            <span className="text-[10px] font-semibold text-slate-400 tracking-wider">LOCAL AI REMOVER</span>
          </div>
        </div>

        <nav className="flex items-center gap-3">
          <button
            onClick={onHowItWorksClick}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-slate-600 hover:text-indigo-600 hover:bg-indigo-50/50 transition-all duration-200 cursor-pointer"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>How it Works</span>
          </button>

          <a
            href="https://github.com/xreactivee"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-slate-600 hover:text-indigo-600 hover:bg-indigo-50/50 transition-all duration-200"
          >
            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
              <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
            </svg>
            <span>GitHub</span>
          </a>
        </nav>
      </header>
    </div>
  );
}
