import { useState } from 'react';
import { removeBackground } from '@imgly/background-removal';
import Header from './components/Header';
import DropZone from './components/DropZone';
import ProcessingState from './components/ProcessingState';
import Editor from './components/Editor';
import History, { type HistoryItem } from './components/History';
import { Sparkles, AlertCircle, RefreshCw, ShieldCheck, Zap, Award, ChevronDown, HelpCircle } from 'lucide-react';

interface FaqItem {
  question: string;
  answer: string;
}

const FAQ_ITEMS: FaqItem[] = [
  {
    question: 'Is Lucent really free?',
    answer: 'Yes, 100% free! There are no subscription plans, credit systems, or hidden fees. You can process as many images as you want and download them in full HD resolution at no cost.'
  },
  {
    question: 'Where are my images uploaded?',
    answer: 'Nowhere! Your privacy is our top priority. The AI model runs entirely inside your browser (client-side) via WebAssembly. Your images never leave your device and are never uploaded to any server.'
  },
  {
    question: 'Why did the first image take longer to process?',
    answer: 'On the first run, the application downloads the AI model (~30MB) and caches it in your browser. Once cached, subsequent images are processed locally and instantly in just a few seconds.'
  },
  {
    question: 'Which image formats and sizes are supported?',
    answer: 'We support all standard web image formats including PNG, JPG, JPEG, and WebP. For optimal performance, we recommend uploading images under 12MB.'
  }
];

export default function App() {
  const [status, setStatus] = useState<'idle' | 'processing' | 'done' | 'error'>('idle');
  const [originalUrl, setOriginalUrl] = useState<string | null>(null);
  const [processedUrl, setProcessedUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('');
  
  // Progress states
  const [progressKey, setProgressKey] = useState<string>('');
  const [progressPercentage, setProgressPercentage] = useState<number>(0);
  const [errorMessage, setErrorMessage] = useState<string>('');

  // History state
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [activeHistoryId, setActiveHistoryId] = useState<string | undefined>(undefined);

  // FAQ state
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Clean up object URLs on unmount or reset
  const cleanupUrls = () => {
    if (originalUrl && originalUrl.startsWith('blob:')) {
      URL.revokeObjectURL(originalUrl);
    }
    if (processedUrl && processedUrl.startsWith('blob:')) {
      URL.revokeObjectURL(processedUrl);
    }
  };

  const handleReset = () => {
    cleanupUrls();
    setOriginalUrl(null);
    setProcessedUrl(null);
    setFileName('');
    setProgressKey('');
    setProgressPercentage(0);
    setErrorMessage('');
    setStatus('idle');
    setActiveHistoryId(undefined);
  };

  const processImage = async (imageSource: File | string, name: string) => {
    setStatus('processing');
    setErrorMessage('');
    setProgressPercentage(0);
    setProgressKey('Preparing Engine...');

    let sourceUrl = '';
    if (typeof imageSource === 'string') {
      sourceUrl = imageSource;
      setOriginalUrl(imageSource);
    } else {
      sourceUrl = URL.createObjectURL(imageSource);
      setOriginalUrl(sourceUrl);
    }
    setFileName(name);

    try {
      // Run the background removal
      const outputBlob = await removeBackground(sourceUrl, {
        progress: (key: string, current: number, total: number) => {
          const percentage = Math.round((current / total) * 100);
          let friendlyKey = key;
          if (key.startsWith('fetch')) friendlyKey = 'fetch';
          if (key.startsWith('compute')) friendlyKey = 'compute';
          
          setProgressKey(friendlyKey);
          setProgressPercentage(percentage);
        }
      });

      // Create URL for the processed image
      const resultUrl = URL.createObjectURL(outputBlob);
      setProcessedUrl(resultUrl);
      setStatus('done');

      // Add to history
      const newHistoryItem: HistoryItem = {
        id: Math.random().toString(36).substring(2, 9),
        fileName: name,
        originalUrl: sourceUrl,
        processedUrl: resultUrl
      };
      setHistory(prev => [newHistoryItem, ...prev.slice(0, 4)]); // Keep last 5 items
      setActiveHistoryId(newHistoryItem.id);

    } catch (error) {
      console.error('Background removal error:', error);
      setErrorMessage(
        error instanceof Error 
          ? error.message 
          : 'An unknown AI error occurred while processing the image.'
      );
      setStatus('error');
    }
  };

  const handleImageSelect = (fileOrUrl: File | string) => {
    if (fileOrUrl instanceof File) {
      processImage(fileOrUrl, fileOrUrl.name);
    } else {
      // Extract filename from URL
      const name = fileOrUrl.split('/').pop()?.split('?')[0] || 'sample-image.jpg';
      processImage(fileOrUrl, name);
    }
  };

  const handleHistorySelect = (item: HistoryItem) => {
    setOriginalUrl(item.originalUrl);
    setProcessedUrl(item.processedUrl);
    setFileName(item.fileName);
    setActiveHistoryId(item.id);
    setStatus('done');
  };

  const handleClearHistory = () => {
    history.forEach(item => {
      if (item.originalUrl.startsWith('blob:')) URL.revokeObjectURL(item.originalUrl);
      if (item.processedUrl.startsWith('blob:')) URL.revokeObjectURL(item.processedUrl);
    });
    setHistory([]);
    if (status === 'done') {
      handleReset();
    }
  };

  const scrollToHowItWorks = () => {
    const element = document.getElementById('how-it-works');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="flex flex-col min-h-screen pt-24 relative overflow-hidden">
      {/* Background Dot Grid Overlay */}
      <div className="absolute inset-0 bg-dot-grid pointer-events-none z-0 opacity-70" />

      <Header onHowItWorksClick={scrollToHowItWorks} />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col justify-center py-6 relative z-10">
        
        {/* Hero Banner (Only shown in idle/upload state) */}
        {status === 'idle' && (
          <div className="text-center max-w-2xl mx-auto px-4 mb-8 animate-fade-in">
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-indigo-50 text-indigo-600 text-xs font-semibold mb-4 border border-indigo-100/50 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 animate-pulse" />
              <span>100% Browser-Based Local AI</span>
            </div>
            
            <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 mb-4 leading-[1.15]">
              Remove Image <br className="sm:hidden" />
              <span className="bg-gradient-to-r from-indigo-600 to-cyan-500 bg-clip-text text-transparent">
                Backgrounds Instantly
              </span>
            </h2>
            
            <p className="text-base text-slate-500 max-w-md mx-auto leading-relaxed">
              Upload your images and let our local AI handle the rest. Entirely free, unlimited, and privacy-friendly.
            </p>
          </div>
        )}

        {/* State Renderer */}
        <div className="transition-all duration-300">
          {status === 'idle' && (
            <DropZone onImageSelect={handleImageSelect} isLoading={false} />
          )}

          {status === 'processing' && (
            <ProcessingState
              progressKey={progressKey}
              progressPercentage={progressPercentage}
              originalImageSrc={originalUrl}
            />
          )}

          {status === 'done' && originalUrl && processedUrl && (
            <Editor
              originalUrl={originalUrl}
              processedUrl={processedUrl}
              originalFileName={fileName}
              onReset={handleReset}
            />
          )}

          {status === 'error' && (
            <div className="w-full max-w-md mx-auto px-4 py-8 text-center animate-fade-in">
              <div className="glass-panel rounded-3xl p-8 bg-white/70 border border-red-100 shadow-md">
                <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-500 flex items-center justify-center mb-4 mx-auto border border-red-100">
                  <AlertCircle className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-2">Processing Failed</h3>
                <p className="text-sm text-slate-500 mb-6 leading-relaxed">
                  {errorMessage || 'The AI model could not process this image. Please try another one.'}
                </p>
                <button
                  onClick={handleReset}
                  className="flex items-center justify-center gap-2 px-6 py-3 w-full rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition-all duration-200 shadow-sm cursor-pointer"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Try Again</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Landing Page Content (Only in idle state to eliminate scroll in editor mode) */}
        {status === 'idle' && (
          <div className="w-full max-w-4xl mx-auto px-4 py-10 space-y-16 animate-fade-in">
            
            {/* How it Works Section */}
            <section id="how-it-works" className="scroll-mt-28">
              <h3 className="text-xl font-bold text-center text-slate-800 mb-8 flex items-center justify-center gap-2">
                <span>How it Works</span>
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="glass-card rounded-2xl p-6 relative overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-md">
                  <div className="absolute -top-4 -right-4 text-8xl font-black text-indigo-50/50 select-none">1</div>
                  <h4 className="text-sm font-bold text-indigo-600 mb-2">Step 1: Upload</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Drag and drop your image, browse from your device, or paste directly from your clipboard (Ctrl+V).
                  </p>
                </div>
                
                <div className="glass-card rounded-2xl p-6 relative overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-md">
                  <div className="absolute -top-4 -right-4 text-8xl font-black text-indigo-50/50 select-none">2</div>
                  <h4 className="text-sm font-bold text-indigo-600 mb-2">Step 2: Auto-Process</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Our local AI model automatically detects and separates the subject from the background in seconds.
                  </p>
                </div>
                
                <div className="glass-card rounded-2xl p-6 relative overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-md">
                  <div className="absolute -top-4 -right-4 text-8xl font-black text-indigo-50/50 select-none">3</div>
                  <h4 className="text-sm font-bold text-indigo-600 mb-2">Step 3: Edit & Download</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Compare the results, add custom background colors or images, and download your final HD image for free.
                  </p>
                </div>
              </div>
            </section>

            {/* Features Section */}
            <section className="border-t border-slate-200/45 pt-16">
              <h3 className="text-xl font-bold text-center text-slate-800 mb-8">
                Why Lucent?
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex flex-col items-center text-center p-4">
                  <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4 border border-indigo-100/50 transition-all duration-300 hover:scale-110">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-800 mb-1.5">100% Private & Secure</h4>
                  <p className="text-xs text-slate-500 leading-relaxed max-w-xs">
                    Your images never leave your computer. All AI processing is performed locally inside your browser using WebAssembly.
                  </p>
                </div>

                <div className="flex flex-col items-center text-center p-4">
                  <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4 border border-indigo-100/50 transition-all duration-300 hover:scale-110">
                    <Zap className="w-6 h-6" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-800 mb-1.5">Free & Unlimited</h4>
                  <p className="text-xs text-slate-500 leading-relaxed max-w-xs">
                    No subscriptions, no credits, no sign-ups. Process as many images as you need without any restrictions.
                  </p>
                </div>

                <div className="flex flex-col items-center text-center p-4">
                  <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4 border border-indigo-100/50 transition-all duration-300 hover:scale-110">
                    <Award className="w-6 h-6" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-800 mb-1.5">HD Quality Downloads</h4>
                  <p className="text-xs text-slate-500 leading-relaxed max-w-xs">
                    Unlike other background removers, we don't charge for high-resolution downloads. Get your images in full HD quality.
                  </p>
                </div>
              </div>
            </section>

            {/* FAQ Section */}
            <section className="border-t border-slate-200/45 pt-16">
              <h3 className="text-xl font-bold text-center text-slate-800 mb-8 flex items-center justify-center gap-2">
                <HelpCircle className="w-5 h-5 text-indigo-500" />
                <span>Frequently Asked Questions</span>
              </h3>
              
              <div className="max-w-2xl mx-auto space-y-4">
                {FAQ_ITEMS.map((item, idx) => {
                  const isOpen = openFaq === idx;
                  return (
                    <div 
                      key={idx} 
                      className="glass-card rounded-2xl overflow-hidden border border-slate-200/50 transition-all duration-300"
                    >
                      <button
                        onClick={() => toggleFaq(idx)}
                        className="w-full flex items-center justify-between p-5 text-left font-semibold text-sm text-slate-800 hover:text-indigo-600 transition-colors cursor-pointer"
                      >
                        <span>{item.question}</span>
                        <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180 text-indigo-500' : ''}`} />
                      </button>
                      
                      <div 
                        className={`transition-all duration-300 ease-in-out ${
                          isOpen ? 'max-h-40 border-t border-slate-200/30' : 'max-h-0'
                        } overflow-hidden`}
                      >
                        <p className="p-5 text-xs text-slate-500 leading-relaxed">
                          {item.answer}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

          </div>
        )}

        {/* History Panel */}
        {status !== 'processing' && (
          <History
            items={history}
            onSelect={handleHistorySelect}
            onClear={handleClearHistory}
            activeId={activeHistoryId}
          />
        )}

      </main>

      {/* Footer (No background, just simple text) */}
      <footer className="py-8 text-center text-[11px] text-slate-400 font-medium relative z-10">
        <p>© 2026 Lucent. All rights reserved. Powered by local browser AI.</p>
      </footer>
    </div>
  );
}
