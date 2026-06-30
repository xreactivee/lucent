import { useState } from 'react';
import { RefreshCw, Sliders, Paintbrush, Download } from 'lucide-react';
import ComparisonSlider from './ComparisonSlider';
import BackgroundChanger from './BackgroundChanger';

interface EditorProps {
  originalUrl: string;
  processedUrl: string;
  originalFileName: string;
  onReset: () => void;
}

export default function Editor({
  originalUrl,
  processedUrl,
  originalFileName,
  onReset
}: EditorProps) {
  const [activeTab, setActiveTab] = useState<'compare' | 'edit'>('compare');

  const handleDownload = () => {
    const link = document.createElement('a');
    const baseName = originalFileName.substring(0, originalFileName.lastIndexOf('.')) || originalFileName;
    link.download = `${baseName}_bg_remover.png`;
    link.href = processedUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-6">
      <div className="glass-panel rounded-3xl p-6 md:p-8 bg-white/70 shadow-lg border border-white/40">
        
        {/* Editor Top Bar: Tabs & Reset */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8">
          <div className="flex p-1.5 bg-slate-100/80 rounded-2xl border border-slate-200/40 w-full sm:w-auto">
            <button
              onClick={() => setActiveTab('compare')}
              className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer ${
                activeTab === 'compare'
                  ? 'bg-white text-indigo-600 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Sliders className="w-4 h-4" />
              <span>Compare</span>
            </button>
            
            <button
              onClick={() => setActiveTab('edit')}
              className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer ${
                activeTab === 'edit'
                  ? 'bg-white text-indigo-600 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Paintbrush className="w-4 h-4" />
              <span>Change Background</span>
            </button>
          </div>

          <button
            onClick={onReset}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-sm font-semibold text-slate-600 hover:text-indigo-600 hover:border-indigo-200 shadow-sm transition-all duration-200 cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Upload New Image</span>
          </button>
        </div>

        {/* Active Tab Content */}
        <div className="transition-all duration-300">
          {activeTab === 'compare' ? (
            <div className="animate-fade-in max-w-2xl mx-auto flex flex-col gap-6 items-center">
              <ComparisonSlider originalUrl={originalUrl} processedUrl={processedUrl} />
              <button
                onClick={handleDownload}
                className="w-full sm:w-auto flex items-center justify-center gap-2.5 py-3.5 px-8 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-lg shadow-indigo-100 hover:shadow-xl hover:shadow-indigo-200 hover:-translate-y-0.5 transition-all duration-200 cursor-pointer text-sm"
              >
                <Download className="w-4 h-4" />
                <span>Download Transparent PNG</span>
              </button>
            </div>
          ) : (
            <div className="animate-fade-in">
              <BackgroundChanger 
                processedUrl={processedUrl} 
                originalFileName={originalFileName} 
              />
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
