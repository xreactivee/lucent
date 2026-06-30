import { History as HistoryIcon, ArrowRight, Trash2 } from 'lucide-react';

export interface HistoryItem {
  id: string;
  fileName: string;
  originalUrl: string;
  processedUrl: string;
}

interface HistoryProps {
  items: HistoryItem[];
  onSelect: (item: HistoryItem) => void;
  onClear: () => void;
  activeId?: string;
}

export default function History({ items, onSelect, onClear, activeId }: HistoryProps) {
  if (items.length === 0) return null;

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8 animate-fade-in">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2 text-slate-500 font-semibold text-sm">
          <HistoryIcon className="w-4 h-4 text-indigo-500" />
          <span>Recent Images ({items.length})</span>
        </div>
        <button
          onClick={onClear}
          className="flex items-center gap-1 text-xs font-semibold text-slate-400 hover:text-red-500 transition-colors cursor-pointer"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Clear All</span>
        </button>
      </div>

      {/* Horizontal Scrollable List */}
      <div className="flex gap-4 overflow-x-auto pb-3 pt-1 scroll-smooth">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => onSelect(item)}
            className={`flex-shrink-0 flex items-center gap-3 p-2.5 rounded-2xl border transition-all duration-200 cursor-pointer text-left ${
              activeId === item.id
                ? 'border-indigo-500 bg-indigo-50/20 shadow-sm'
                : 'border-slate-200/60 bg-white/75 hover:bg-white hover:border-indigo-300 hover:shadow-sm'
            }`}
            style={{ width: '220px' }}
          >
            {/* Thumbnail Preview: Before and After side by side */}
            <div className="relative w-16 h-12 rounded-lg overflow-hidden bg-slate-100 border border-slate-200/50 flex-shrink-0">
              <img
                src={item.processedUrl}
                alt={item.fileName}
                className="w-full h-full object-cover bg-checkerboard"
              />
            </div>

            {/* Title and Action */}
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-slate-700 truncate mb-0.5">
                {item.fileName}
              </p>
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-indigo-600">
                <span>Edit</span>
                <ArrowRight className="w-2.5 h-2.5" />
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
