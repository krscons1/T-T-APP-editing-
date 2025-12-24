
import React, { useState } from 'react';
import { Segment, Language } from '../types';
import { Check, Sparkles, ArrowRight, ArrowLeft, Type, Clock } from 'lucide-react';

interface TranscriptionViewProps {
  segments: Segment[];
  onToggleSegment: (id: string) => void;
  onToggleWord: (segmentId: string, wordIndex: number) => void;
  onAutoEdit: (lang: Language) => void;
  onManualFinalize: (lang: Language) => void;
  onBack: () => void;
  isTranslating: boolean;
}

export const TranscriptionView: React.FC<TranscriptionViewProps> = ({ 
  segments, 
  onToggleSegment, 
  onToggleWord,
  onAutoEdit, 
  onManualFinalize,
  onBack
}) => {
  const [activeTab, setActiveTab] = useState<Language>('tamil');
  const selectedCount = segments.filter(s => s.isSelected).length;

  return (
    <div className="flex flex-col h-full gap-5 animate-in slide-in-from-right duration-500 max-w-[1400px] mx-auto w-full overflow-hidden px-6">
      {/* Top Controls */}
      <div className="flex items-center justify-between bg-zinc-900/30 p-3 rounded-2xl border border-zinc-800/50 shadow-2xl backdrop-blur-xl">
        <button 
          onClick={onBack}
          className="flex items-center gap-2.5 text-zinc-500 hover:text-white transition-all font-bold text-[10px] uppercase tracking-widest bg-zinc-950/50 px-4 h-10 rounded-xl border border-zinc-800/50 hover:border-zinc-700"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        <div className="flex bg-zinc-950/80 border border-zinc-800/80 p-1 rounded-xl shadow-inner">
          <button 
            onClick={() => setActiveTab('tamil')}
            className={`px-6 h-9 rounded-lg text-[10px] font-bold uppercase transition-all tracking-widest ${activeTab === 'tamil' ? 'bg-zinc-800 text-white shadow-xl border border-white/5' : 'text-zinc-600 hover:text-zinc-400'}`}
          >
            Tamil
          </button>
          <button 
            onClick={() => setActiveTab('tanglish')}
            className={`px-6 h-9 rounded-lg text-[10px] font-bold uppercase transition-all tracking-widest ${activeTab === 'tanglish' ? 'bg-zinc-800 text-white shadow-xl border border-white/5' : 'text-zinc-600 hover:text-zinc-400'}`}
          >
            Tanglish
          </button>
        </div>

        <button 
          onClick={() => onAutoEdit(activeTab)}
          className="flex items-center gap-2.5 bg-zinc-800 hover:bg-zinc-700 text-white px-6 h-10 rounded-xl font-bold text-[10px] transition-all uppercase tracking-widest border border-zinc-700 shadow-2xl group active:scale-95"
        >
          <Sparkles className="w-4 h-4 text-blue-400 group-hover:rotate-12 transition-transform" />
          AI AUTO EDIT
        </button>
      </div>

      {/* Main Container */}
      <div className="flex flex-col flex-grow bg-black rounded-2xl border border-zinc-900/50 overflow-hidden shadow-2xl">
        <div className="px-8 py-4 border-b border-zinc-900 bg-zinc-950/50 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Type className="w-4 h-4 text-blue-500" />
            <h3 className="font-bold text-[11px] text-zinc-500 uppercase tracking-[0.2em] bebas">Production Timeline</h3>
          </div>
          <span className="text-[10px] font-bold text-zinc-700 uppercase tracking-widest">{segments.length} Segments Detected</span>
        </div>
        
        <div className="flex-grow overflow-y-auto p-6 space-y-3.5 custom-scrollbar min-h-0">
          {segments.map((s, idx) => (
            <SegmentRow 
              key={s.id} 
              index={idx + 1}
              segment={s} 
              text={activeTab === 'tamil' ? s.tamilText : s.tanglishText} 
              onToggle={() => onToggleSegment(s.id)} 
              onToggleWord={(wordIdx) => onToggleWord(s.id, wordIdx)}
            />
          ))}
        </div>
      </div>

      {/* Footer Bar */}
      <div className="bg-zinc-900/40 backdrop-blur-2xl p-5 rounded-2xl border border-zinc-800/50 flex items-center justify-between mb-6 shadow-2xl">
        <div className="flex gap-10 pl-6">
          <div className="flex flex-col">
            <span className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest mb-1.5">Selected Clips</span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-white leading-none bebas">{selectedCount.toString().padStart(2, '0')}</span>
              <span className="text-[11px] text-zinc-700 font-bold uppercase tracking-widest">Items</span>
            </div>
          </div>
          <div className="h-10 w-[1px] bg-zinc-800 self-center" />
          <div className="flex flex-col">
            <span className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest mb-1.5">Master Language</span>
            <span className="text-base font-bold text-blue-500 uppercase tracking-widest bebas leading-none">{activeTab} Mastery</span>
          </div>
        </div>
        
        <button 
          onClick={() => onManualFinalize(activeTab)}
          disabled={selectedCount === 0}
          className="flex items-center gap-3 bg-white hover:bg-zinc-100 text-black px-12 h-12 rounded-xl font-bold text-[12px] transition-all disabled:opacity-20 shadow-2xl active:scale-95 group uppercase tracking-[0.2em] border-b-2 border-zinc-300"
        >
          EDITING
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};

const SegmentRow: React.FC<{ 
  index: number, 
  segment: Segment, 
  text: string, 
  onToggle: () => void,
  onToggleWord: (wordIdx: number) => void 
}> = ({ index, segment, text, onToggle, onToggleWord }) => {
  const words = text.split(/\s+/);

  return (
    <div 
      className={`group px-7 py-5 rounded-[1.5rem] border transition-all duration-300 select-none flex items-center gap-7 ${
        segment.isSelected 
          ? 'border-blue-500/50 bg-blue-600/5 shadow-2xl ring-1 ring-blue-500/20' 
          : 'border-zinc-900/50 bg-[#0a0a0a] hover:bg-zinc-900/30 hover:border-zinc-800'
      }`}
    >
      <div 
        onClick={onToggle}
        className={`w-10 h-10 rounded-xl border transition-all flex items-center justify-center shrink-0 cursor-pointer ${
          segment.isSelected ? 'bg-blue-600 border-blue-400 text-white shadow-xl' : 'bg-black border-zinc-800 text-zinc-800'
        }`}
      >
        {segment.isSelected ? (
          <Check className="w-5 h-5 scale-110" />
        ) : (
          <span className="text-[11px] font-bold font-mono">{index.toString().padStart(2, '0')}</span>
        )}
      </div>

      <div className="flex-grow">
        <div className="flex items-center gap-5 mb-1.5">
          <div className="flex items-center gap-2 text-zinc-600">
             <Clock className="w-3.5 h-3.5" />
             <span className="text-[10px] font-mono font-bold tracking-tight">
              {(segment.startTime).toFixed(2)}s <span className="text-zinc-800 mx-1.5">—</span> {(segment.endTime).toFixed(2)}s
             </span>
          </div>
          {segment.score > 85 && (
            <div className="bg-blue-500/10 text-blue-400 text-[8px] font-bold px-2.5 py-0.5 rounded-md uppercase tracking-[0.15em] border border-blue-500/20">
              VIRAL PEAK
            </div>
          )}
        </div>
        
        {/* Word-level Interactive Text */}
        <div className="flex flex-wrap gap-x-1.5 gap-y-1">
          {words.map((word, wIdx) => {
            const isExcluded = segment.excludedWordsIndices?.includes(wIdx);
            return (
              <span
                key={wIdx}
                onClick={() => onToggleWord(wIdx)}
                className={`text-[15px] font-bold leading-relaxed transition-all cursor-pointer rounded-md px-0.5 ${
                  isExcluded 
                    ? 'text-zinc-800/40 line-through opacity-40 hover:opacity-70' 
                    : segment.isSelected 
                      ? 'text-white hover:bg-white/10' 
                      : 'text-zinc-500 group-hover:text-zinc-400 hover:text-white hover:bg-zinc-800'
                }`}
              >
                {word}
              </span>
            );
          })}
        </div>
      </div>
      
      <div className={`text-[10px] font-bold tracking-[0.2em] uppercase transition-opacity ${segment.isSelected ? 'text-blue-500' : 'text-zinc-800 opacity-0 group-hover:opacity-100'}`}>
        SELECTED
      </div>
    </div>
  );
};
