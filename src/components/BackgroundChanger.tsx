import { useState, useRef, useEffect } from 'react';
import { Download, Image as ImageIcon, Paintbrush, Undo, Upload } from 'lucide-react';

interface BackgroundChangerProps {
  processedUrl: string;
  originalFileName: string;
}

interface PresetBg {
  name: string;
  type: 'transparent' | 'color' | 'gradient';
  value: string;
  colors?: string[];
}

const PRESET_BGS: PresetBg[] = [
  { name: 'Transparent', type: 'transparent', value: 'transparent' },
  { name: 'White', type: 'color', value: '#ffffff' },
  { name: 'Dark Slate', type: 'color', value: '#1e293b' },
  { name: 'Sunset Glow', type: 'gradient', value: 'linear-gradient(135deg, #ff7e5f 0%, #feb47b 100%)', colors: ['#ff7e5f', '#feb47b'] },
  { name: 'Ocean Breeze', type: 'gradient', value: 'linear-gradient(135deg, #2b5876 0%, #4e4376 100%)', colors: ['#2b5876', '#4e4376'] },
  { name: 'Aurora', type: 'gradient', value: 'linear-gradient(135deg, #0575e6 0%, #00f260 100%)', colors: ['#0575e6', '#00f260'] },
  { name: 'Sweet Lavender', type: 'gradient', value: 'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)', colors: ['#a18cd1', '#fbc2eb'] },
];

export default function BackgroundChanger({ processedUrl, originalFileName }: BackgroundChangerProps) {
  const [bgType, setBgType] = useState<'transparent' | 'color' | 'gradient' | 'image'>('transparent');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [activeGradient, setActiveGradient] = useState<PresetBg | null>(null);
  const [bgImage, setBgImage] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const bgInputRef = useRef<HTMLInputElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  // Clean up object URL when component unmounts
  useEffect(() => {
    return () => {
      if (bgImage && bgImage.startsWith('blob:')) {
        URL.revokeObjectURL(bgImage);
      }
    };
  }, [bgImage]);

  const handleBgImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const url = URL.createObjectURL(file);
      setBgImage(url);
      setBgType('image');
    }
  };

  const handlePresetClick = (preset: PresetBg) => {
    if (preset.type === 'transparent') {
      setBgType('transparent');
      setActiveGradient(null);
    } else if (preset.type === 'gradient') {
      setBgType('gradient');
      setActiveGradient(preset);
    } else {
      setBgColor(preset.value);
      setBgType('color');
      setActiveGradient(null);
    }
  };

  // High Quality Download using HTML5 Canvas
  const triggerDownload = async () => {
    setIsDownloading(true);
    try {
      // Create an image element for the processed image
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = processedUrl;

      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
      });

      // Create canvas with natural dimensions (HD Quality)
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext('2d');

      if (!ctx) throw new Error('Canvas context could not be created.');

      // 1. Draw Background
      if (bgType === 'color') {
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      } else if (bgType === 'gradient' && activeGradient && activeGradient.colors) {
        // Draw linear gradient
        const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        grad.addColorStop(0, activeGradient.colors[0]);
        grad.addColorStop(1, activeGradient.colors[1]);
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      } else if (bgType === 'image' && bgImage) {
        const bgImg = new Image();
        bgImg.crossOrigin = 'anonymous';
        bgImg.src = bgImage;

        await new Promise((resolve, reject) => {
          bgImg.onload = resolve;
          bgImg.onerror = reject;
        });

        // Draw background image covering the canvas (aspect-fill)
        const canvasRatio = canvas.width / canvas.height;
        const bgRatio = bgImg.naturalWidth / bgImg.naturalHeight;
        let drawWidth = canvas.width;
        let drawHeight = canvas.height;
        let drawX = 0;
        let drawY = 0;

        if (bgRatio > canvasRatio) {
          drawWidth = canvas.height * bgRatio;
          drawX = (canvas.width - drawWidth) / 2;
        } else {
          drawHeight = canvas.width / bgRatio;
          drawY = (canvas.height - drawHeight) / 2;
        }

        ctx.drawImage(bgImg, drawX, drawY, drawWidth, drawHeight);
      }

      // 2. Draw Processed Image on top
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      // 3. Create download link
      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      const baseName = originalFileName.substring(0, originalFileName.lastIndexOf('.')) || originalFileName;
      link.download = `${baseName}_bg_remover.png`;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Download failed:', error);
      alert('An error occurred while downloading the image.');
    } finally {
      setIsDownloading(false);
    }
  };

  // Get preview style
  const getPreviewStyle = (): React.CSSProperties => {
    if (bgType === 'color') {
      return { backgroundColor: bgColor };
    }
    if (bgType === 'gradient' && activeGradient) {
      return { backgroundImage: activeGradient.value };
    }
    if (bgType === 'image' && bgImage) {
      return {
        backgroundImage: `url(${bgImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      };
    }
    return {};
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
      {/* Left: Preview Panel (3 cols) */}
      <div className="md:col-span-3 flex flex-col items-center justify-center">
        <div 
          ref={previewRef}
          className={`relative w-full aspect-[4/3] max-h-[380px] rounded-2xl overflow-hidden border border-slate-200/60 flex items-center justify-center transition-all duration-300 ${
            bgType === 'transparent' ? 'bg-checkerboard' : ''
          }`}
          style={getPreviewStyle()}
        >
          <img
            src={processedUrl}
            alt="Preview with custom background"
            className="w-full h-full object-contain p-2 select-none"
          />
        </div>
      </div>

      {/* Right: Controls Panel (2 cols) */}
      <div className="md:col-span-2 flex flex-col justify-between gap-6">
        <div className="space-y-5">
          {/* Preset Colors */}
          <div>
            <h4 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-1.5">
              <Paintbrush className="w-4 h-4 text-indigo-500" />
              <span>Backdrop Theme</span>
            </h4>
            <div className="grid grid-cols-4 gap-2">
              {PRESET_BGS.map((bg) => (
                <button
                  key={bg.name}
                  onClick={() => handlePresetClick(bg)}
                  className={`group relative aspect-square rounded-xl border flex items-center justify-center transition-all duration-200 cursor-pointer ${
                    (bg.type === 'transparent' && bgType === 'transparent') || 
                    (bg.type === 'gradient' && bgType === 'gradient' && activeGradient?.name === bg.name) ||
                    (bg.type === 'color' && bgType === 'color' && bgColor === bg.value)
                      ? 'border-indigo-500 ring-2 ring-indigo-100 scale-95'
                      : 'border-slate-200 hover:border-indigo-300 hover:scale-105 shadow-sm'
                  }`}
                  style={
                    bg.type === 'color' 
                      ? { backgroundColor: bg.value } 
                      : bg.type === 'gradient' 
                        ? { backgroundImage: bg.value } 
                        : {}
                  }
                  title={bg.name}
                >
                  {bg.type === 'transparent' && (
                    <div className="absolute inset-0 bg-checkerboard rounded-xl" />
                  )}
                  <span className="sr-only">{bg.name}</span>
                </button>
              ))}
              
              {/* Custom Color Picker */}
              <label 
                className="group relative aspect-square rounded-xl border border-slate-200 hover:border-indigo-300 hover:scale-105 flex flex-col items-center justify-center cursor-pointer transition-all duration-200 bg-white shadow-sm"
                title="Choose Custom Color"
              >
                <input 
                  type="color" 
                  value={bgColor} 
                  onChange={(e) => {
                    setBgColor(e.target.value);
                    setBgType('color');
                    setActiveGradient(null);
                  }}
                  className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                />
                <span className="text-[18px]">🎨</span>
              </label>
            </div>
          </div>

          {/* Custom Background Image */}
          <div>
            <h4 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-1.5">
              <ImageIcon className="w-4 h-4 text-indigo-500" />
              <span>Background Image</span>
            </h4>
            <div className="flex gap-2.5">
              <button
                onClick={() => bgInputRef.current?.click()}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border text-sm font-medium transition-all duration-200 cursor-pointer ${
                  bgType === 'image'
                    ? 'border-indigo-500 bg-indigo-50/30 text-indigo-600'
                    : 'border-slate-200 bg-white text-slate-600 hover:border-indigo-300 hover:bg-slate-50'
                }`}
              >
                <Upload className="w-4 h-4" />
                <span>Upload Image</span>
              </button>
              
              <input
                ref={bgInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleBgImageUpload}
              />

              {bgImage && (
                <button
                  onClick={() => {
                    setBgType('transparent');
                    setBgImage(null);
                  }}
                  className="p-2.5 rounded-xl border border-slate-200 hover:border-red-300 hover:bg-red-50 text-slate-400 hover:text-red-500 transition-all duration-200 cursor-pointer"
                  title="Remove Background Image"
                >
                  <Undo className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Action Button: Download */}
        <button
          onClick={triggerDownload}
          disabled={isDownloading}
          className="w-full flex items-center justify-center gap-2.5 py-4 px-6 rounded-2xl bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-semibold shadow-lg shadow-indigo-100 hover:shadow-xl hover:shadow-indigo-200 hover:-translate-y-0.5 transition-all duration-200 cursor-pointer text-base"
        >
          <Download className="w-5 h-5" />
          <span>{isDownloading ? 'Preparing Image...' : 'Download HD Image'}</span>
        </button>
      </div>
    </div>
  );
}
