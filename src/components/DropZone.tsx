import { useState, useRef, useEffect } from 'react';
import { Upload, Clipboard, Sparkles, AlertCircle, Shield, Zap, Award } from 'lucide-react';

interface DropZoneProps {
  onImageSelect: (file: File | string) => void;
  isLoading: boolean;
}

const SAMPLE_IMAGES = [
  {
    id: 'portrait',
    name: 'Portrait',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=500&auto=format&fit=crop',
    thumbnail: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop'
  },
  {
    id: 'product',
    name: 'Product',
    url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=500&auto=format&fit=crop',
    thumbnail: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=150&auto=format&fit=crop'
  },
  {
    id: 'animal',
    name: 'Pet',
    url: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?q=80&w=500&auto=format&fit=crop',
    thumbnail: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?q=80&w=150&auto=format&fit=crop'
  }
];

export default function DropZone({ onImageSelect, isLoading }: DropZoneProps) {
  const [isDragActive, setIsDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle Clipboard Paste (Ctrl+V)
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      if (isLoading) return;
      
      const items = e.clipboardData?.items;
      if (!items) return;

      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          const file = items[i].getAsFile();
          if (file) {
            validateAndSelectFile(file);
            break;
          }
        }
      }
    };

    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, [isLoading]);

  const validateAndSelectFile = (file: File) => {
    setError(null);
    // Check file type
    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file (PNG, JPG, WebP).');
      return;
    }
    // Check file size (limit to 12MB for performance)
    if (file.size > 12 * 1024 * 1024) {
      setError('File size is too large. Please select an image under 12MB.');
      return;
    }
    onImageSelect(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragActive(true);
    } else if (e.type === 'dragleave') {
      setIsDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    
    if (isLoading) return;

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSelectFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSelectFile(e.target.files[0]);
    }
  };

  const triggerFileInput = () => {
    if (isLoading) return;
    fileInputRef.current?.click();
  };

  const handleSampleClick = async (url: string) => {
    if (isLoading) return;
    onImageSelect(url);
  };

  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-4 animate-fade-in">
      {/* Drop Zone Area */}
      <div
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={triggerFileInput}
        className={`relative group cursor-pointer w-full aspect-[16/9] max-h-[340px] flex flex-col items-center justify-center rounded-3xl transition-all duration-300 border-2 border-dashed glass-card ${
          isDragActive 
            ? 'border-indigo-500 bg-indigo-50/40 scale-[0.99] shadow-inner' 
            : 'border-slate-300 hover:border-indigo-400 hover:bg-white/90 hover:scale-[1.01] hover:shadow-md'
        } ${isLoading ? 'opacity-50 pointer-events-none' : ''}`}
      >
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept="image/*"
          onChange={handleFileChange}
          disabled={isLoading}
        />

        <div className="flex flex-col items-center text-center px-6 pointer-events-none">
          <div className={`p-4 rounded-2xl mb-4 transition-all duration-300 bg-slate-100 text-slate-500 ${
            isDragActive 
              ? 'bg-indigo-100 text-indigo-600 scale-110' 
              : 'group-hover:bg-indigo-50 group-hover:text-indigo-500 group-hover:-translate-y-1 group-hover:scale-105'
          }`}>
            <Upload className="w-8 h-8" />
          </div>
          
          <h3 className="text-lg font-bold text-slate-800 mb-1">
            Drag & drop your image here
          </h3>
          <p className="text-sm text-slate-500 mb-4 max-w-xs sm:max-w-md">
            or <span className="text-indigo-600 font-semibold underline">click to browse</span> from your device.
          </p>

          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100/80 text-xs font-medium text-slate-500 border border-slate-200/40">
            <Clipboard className="w-3.5 h-3.5" />
            <span>You can also copy and paste an image (Ctrl+V)</span>
          </div>
        </div>
      </div>

      {error && (
        <div className="mt-4 p-3.5 rounded-xl bg-red-50 border border-red-200/60 text-red-600 text-sm flex items-center gap-2.5 animate-fade-in">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span className="font-medium">{error}</span>
        </div>
      )}

      {/* Trust Badges Row */}
      <div className="flex flex-wrap items-center justify-center gap-3.5 mt-6 mb-2">
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/65 border border-white/50 shadow-sm text-[11px] font-semibold text-slate-500">
          <Shield className="w-3.5 h-3.5 text-indigo-500" />
          <span>100% Secure & Private</span>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/65 border border-white/50 shadow-sm text-[11px] font-semibold text-slate-500">
          <Zap className="w-3.5 h-3.5 text-indigo-500" />
          <span>Instant Local Processing</span>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/65 border border-white/50 shadow-sm text-[11px] font-semibold text-slate-500">
          <Award className="w-3.5 h-3.5 text-indigo-500" />
          <span>Free HD Downloads</span>
        </div>
      </div>

      {/* Sample Images Section */}
      <div className="mt-8 text-center border-t border-slate-200/45 pt-6">
        <div className="flex items-center justify-center gap-1.5 text-xs font-semibold text-slate-400 tracking-wider uppercase mb-4">
          <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
          <span>No image? Try one of these samples</span>
        </div>
        
        <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
          {SAMPLE_IMAGES.map((sample) => (
            <button
              key={sample.id}
              onClick={() => handleSampleClick(sample.url)}
              disabled={isLoading}
              className="group relative aspect-square rounded-2xl overflow-hidden glass-card border border-white/50 hover:border-indigo-400 hover:scale-105 transition-all duration-300 shadow-sm hover:shadow-md cursor-pointer focus:outline-none"
            >
              <img
                src={sample.thumbnail}
                alt={sample.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                crossOrigin="anonymous"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
              <span className="absolute bottom-2 left-0 right-0 text-[11px] font-semibold text-white text-center tracking-wide">
                {sample.name}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
