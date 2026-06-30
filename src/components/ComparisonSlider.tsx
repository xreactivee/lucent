import { useState, useRef, useEffect } from 'react';

interface ComparisonSliderProps {
  originalUrl: string;
  processedUrl: string;
}

export default function ComparisonSlider({ originalUrl, processedUrl }: ComparisonSliderProps) {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [containerHeight, setContainerHeight] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Keep height of both images aligned
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const img = containerRef.current.querySelector('img');
        if (img) {
          setContainerHeight(img.clientHeight);
        }
      }
    };

    window.addEventListener('resize', handleResize);
    // Trigger initial calculation once images load
    const timer = setTimeout(handleResize, 300);

    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timer);
    };
  }, [originalUrl, processedUrl]);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSliderPosition(Number(e.target.value));
  };

  return (
    <div className="relative w-full overflow-hidden rounded-2xl border border-slate-200/60 bg-slate-50 shadow-sm" ref={containerRef}>
      {/* Before Image (Original) */}
      <div className="w-full h-full select-none pointer-events-none">
        <img
          src={originalUrl}
          alt="Original"
          className="w-full h-auto max-h-[500px] object-contain block mx-auto"
          onLoad={() => {
            if (containerRef.current) {
              const img = containerRef.current.querySelector('img');
              if (img) setContainerHeight(img.clientHeight);
            }
          }}
        />
        <div className="absolute top-3 right-3 px-2.5 py-1 rounded-md bg-black/60 backdrop-blur-sm text-white text-[11px] font-semibold tracking-wider uppercase z-20">
          Original
        </div>
      </div>

      {/* After Image (Processed) - Overlay Container */}
      <div
        className="absolute top-0 left-0 h-full overflow-hidden select-none pointer-events-none bg-checkerboard z-10"
        style={{ width: `${sliderPosition}%` }}
      >
        <div 
          className="h-full" 
          style={{ width: containerRef.current?.clientWidth || '100%', height: containerHeight || '100%' }}
        >
          <img
            src={processedUrl}
            alt="Background Removed"
            className="w-full h-full object-contain block mx-auto"
            style={{ width: '100%', height: '100%' }}
          />
        </div>
        <div className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-indigo-600/90 backdrop-blur-sm text-white text-[11px] font-semibold tracking-wider uppercase whitespace-nowrap">
          Background Removed
        </div>
      </div>

      {/* Slider Control Line & Handle */}
      <div
        className="absolute top-0 bottom-0 w-0.5 bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.6)] z-20 pointer-events-none"
        style={{ left: `${sliderPosition}%` }}
      >
        {/* Custom Handle Button */}
        <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-9 h-9 rounded-full bg-white border-2 border-indigo-500 flex items-center justify-center shadow-lg pointer-events-none">
          <div className="flex gap-1 items-center justify-center text-indigo-500">
            <span className="text-[10px] font-bold">◀</span>
            <span className="text-[10px] font-bold">▶</span>
          </div>
        </div>
      </div>

      {/* Transparent Input Range covering the image for easy dragging */}
      <input
        type="range"
        min="0"
        max="100"
        value={sliderPosition}
        onChange={handleSliderChange}
        className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-30"
        aria-label="Image comparison slider"
      />
    </div>
  );
}
