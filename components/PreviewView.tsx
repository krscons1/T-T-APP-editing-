
import React, { useRef, useState, useEffect } from 'react';
import { Segment, Language } from '../types';
import { 
  ArrowLeft, Play, Pause, RotateCcw, Download, 
  Languages, CheckCircle, 
  Maximize, Film, Eye, EyeOff, Loader2, ChevronRight,
  HardDrive
} from 'lucide-react';

interface PreviewViewProps {
  videoUrl: string;
  selectedSegments: Segment[];
  onTranslate: () => void;
  isTranslating: boolean;
  selectedLanguage: Language;
  onBack: () => void;
}

export const PreviewView: React.FC<PreviewViewProps> = ({ 
  videoUrl, 
  selectedSegments, 
  onTranslate, 
  isTranslating, 
  selectedLanguage, 
  onBack 
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSegmentIndex, setCurrentSegmentIndex] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [showExportSuccess, setShowExportSuccess] = useState(false);
  const [showEnglish, setShowEnglish] = useState(false);
  const [showTranscript, setShowTranscript] = useState(true);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const currentSegment = selectedSegments[currentSegmentIndex];
    if (!currentSegment) return;

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
      if (video.currentTime >= currentSegment.endTime) {
        if (currentSegmentIndex < selectedSegments.length - 1) {
          setCurrentSegmentIndex(prev => prev + 1);
        } else {
          video.pause();
          setIsPlaying(false);
        }
      }
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    return () => video.removeEventListener('timeupdate', handleTimeUpdate);
  }, [currentSegmentIndex, selectedSegments]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const targetSegment = selectedSegments[currentSegmentIndex];
    if (targetSegment) {
       video.currentTime = targetSegment.startTime;
       if (isPlaying) video.play();
    }
  }, [currentSegmentIndex]);

  const togglePlay = () => {
    if (videoRef.current?.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current?.pause();
      setIsPlaying(false);
    }
  };

  const handleTranslationToggle = () => {
    if (!selectedSegments[0]?.englishText) {
      onTranslate();
    }
    setShowEnglish(!showEnglish);
  };

  const currentSegment = selectedSegments[currentSegmentIndex];
  
  // Dynamic Caption Filtering: Only show words that aren't excluded
  const getFilteredText = (segment: Segment, lang: Language) => {
    const fullText = lang === 'tamil' ? segment.tamilText : segment.tanglishText;
    const words = fullText.split(/\s+/);
    const excluded = segment.excludedWordsIndices || [];
    return words.filter((_, i) => !excluded.includes(i)).join(' ');
  };

  const activeCaption = currentSegment ? getFilteredText(currentSegment, selectedLanguage) : "";

  return (
    <div className="flex flex-col h-full gap-5 max-w-[1400px] mx-auto w-full animate-in fade-in duration-500 overflow-hidden px-6">
      {/* Header Controls */}
      <div className="flex items-center justify-between bg-zinc-900/30 px-5 py-2 rounded-2xl border border-zinc-800/60 shadow-2xl backdrop-blur-xl">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack} 
            className="w-9 h-9 flex items-center justify-center rounded-lg bg-zinc-800/50 hover:bg-zinc-700 text-zinc-400 hover:text-white transition-all border border-zinc-700 group shadow-lg active:scale-90"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          </button>
          <div className="h-6 w-[1px] bg-zinc-800" />
          <h2 className="text-[10px] font-bold text-white uppercase tracking-[0.2em] bebas opacity-80">Output Monitor 01</h2>
        </div>

        <div className="flex items-center gap-2.5">
           <div className="flex bg-zinc-950/80 p-0.5 rounded-lg border border-zinc-800/80 shadow-inner">
             <button 
              onClick={() => setShowTranscript(!showTranscript)}
              className={`flex items-center gap-2 px-3.5 py-1 rounded-md text-[9px] font-bold uppercase transition-all tracking-widest ${
                showTranscript ? 'bg-zinc-800 text-white shadow-xl ring-1 ring-white/5' : 'text-zinc-600 hover:text-zinc-400'
              }`}
            >
              {showTranscript ? <Eye className="w-3 h-3 text-blue-500" /> : <EyeOff className="w-3 h-3" />}
              Transcript
            </button>
            <button 
              onClick={handleTranslationToggle}
              className={`flex items-center gap-2 px-3.5 py-1 rounded-md text-[9px] font-bold uppercase transition-all tracking-widest ${
                showEnglish ? 'bg-blue-600 text-white shadow-xl ring-1 ring-blue-400/30' : 'text-zinc-600 hover:text-zinc-400'
              }`}
            >
              {isTranslating ? <Loader2 className="w-3 h-3 animate-spin" /> : <Languages className="w-3 h-3" />}
              AI Translate
            </button>
           </div>
          
          <button 
            onClick={() => setShowExportSuccess(true)}
            className="bg-white hover:bg-zinc-100 text-black px-4 h-8 rounded-lg font-bold text-[9px] shadow-2xl transition-all uppercase tracking-[0.15em] active:scale-95 flex items-center gap-2 border-b-2 border-zinc-300 hover:shadow-blue-500/10"
          >
            <HardDrive className="w-3 h-3" />
            DOWNLOADED
          </button>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-grow min-h-0 overflow-hidden pb-6">
        <div className="lg:col-span-9 flex flex-col gap-5 min-h-0">
          {/* Main Viewport */}
          <div className="relative flex-grow bg-black rounded-3xl overflow-hidden shadow-2xl border border-zinc-900 flex items-center justify-center">
            <video 
              ref={videoRef}
              src={videoUrl}
              className="w-full h-full object-contain"
            />
            
            {/* Reduced Caption Overlay */}
            <div className="absolute inset-x-0 bottom-8 flex justify-center px-16 pointer-events-none">
              <div className="flex flex-col items-center gap-2 w-full max-w-xl">
                {showTranscript && (
                  <div className="bg-black/95 backdrop-blur-3xl px-7 py-2.5 rounded-xl border border-white/5 shadow-[0_0_30px_rgba(0,0,0,0.8)] text-center ring-1 ring-white/5">
                    <p className="text-white text-base md:text-lg font-bold tracking-tight leading-snug uppercase bebas tracking-[0.02em]">
                      {activeCaption}
                    </p>
                  </div>
                )}
                
                {showEnglish && currentSegment?.englishText && (
                  <div className="bg-blue-600/90 backdrop-blur-2xl px-5 py-1.5 rounded-lg border border-blue-400/30 shadow-2xl text-center">
                    <p className="text-white text-[9px] font-bold tracking-[0.1em] uppercase leading-tight italic">
                      {currentSegment.englishText}
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="absolute top-5 left-5 flex items-center gap-2.5 bg-black/60 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/10 shadow-lg">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse shadow-[0_0_10px_rgba(59,130,246,0.7)]" />
              <span className="text-[9px] font-bold text-white uppercase tracking-[0.2em] bebas opacity-70">MASTER BROADCAST PREVIEW</span>
            </div>
          </div>

          {/* Transport Bar */}
          <div className="flex items-center justify-between bg-zinc-900/30 p-4 rounded-3xl border border-zinc-800/60 shadow-2xl backdrop-blur-xl shrink-0">
            <div className="flex items-center gap-5">
               <button 
                 onClick={() => {
                   setCurrentSegmentIndex(0);
                   if (videoRef.current) videoRef.current.currentTime = selectedSegments[0].startTime;
                 }} 
                 className="w-9 h-9 flex items-center justify-center rounded-lg bg-zinc-800/50 text-zinc-500 hover:text-blue-400 hover:bg-blue-500/10 hover:border-blue-500/30 transition-all transform hover:rotate-[-45deg] active:scale-90 border border-zinc-700 shadow-md group"
               >
                 <RotateCcw className="w-4 h-4 group-hover:scale-110" />
               </button>
               <button 
                 onClick={togglePlay}
                 className="w-11 h-11 bg-white hover:bg-blue-50 rounded-full flex items-center justify-center transition-all shadow-xl active:scale-90 group border-b-2 border-zinc-300 hover:ring-4 hover:ring-blue-500/10"
               >
                 {isPlaying ? (
                   <Pause className="w-5 h-5 text-black fill-current" />
                 ) : (
                   <Play className="w-5 h-5 text-black fill-current ml-0.5" />
                 )}
               </button>
            </div>

            <div className="flex items-center gap-8">
              <div className="text-right flex flex-col items-end">
                <span className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest mb-1 block">TIMELINE TC</span>
                <span className="text-xl font-mono font-bold text-white tabular-nums tracking-tighter leading-none bg-black/50 px-4 py-2 rounded-lg border border-zinc-800 shadow-inner">
                  {Math.floor(currentTime / 60)}:{(currentTime % 60).toFixed(2).padStart(5, '0')}
                </span>
              </div>
              <div className="h-10 w-[1px] bg-zinc-800" />
              <div className="text-right flex flex-col items-end">
                <span className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest mb-1 block">SEQUENCE ID</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-zinc-400 leading-none bebas tracking-[0.15em]">{currentSegmentIndex + 1}</span>
                  <span className="text-[10px] text-zinc-800 font-bold uppercase tracking-widest">/ {selectedSegments.length}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Storyboard Sidebar */}
        <div className="lg:col-span-3 flex flex-col gap-5 min-h-0">
          <div className="bg-[#0a0a0a] rounded-3xl border border-zinc-900/50 flex-grow flex flex-col min-h-0 overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-900 bg-zinc-950/40">
              <h3 className="font-bold text-[10px] text-zinc-400 uppercase tracking-[0.2em] bebas">Sequence Manifest</h3>
            </div>
            
            <div className="flex-grow overflow-y-auto space-y-2 p-4 custom-scrollbar">
              {selectedSegments.map((s, idx) => (
                <button 
                  key={s.id}
                  onClick={() => setCurrentSegmentIndex(idx)}
                  className={`w-full text-left px-4 py-2.5 rounded-xl border transition-all duration-300 group ${
                    idx === currentSegmentIndex 
                    ? 'border-blue-500/60 bg-blue-500/10 shadow-xl ring-1 ring-blue-500/10' 
                    : 'border-zinc-800/40 bg-zinc-900/30 hover:bg-zinc-800/60'
                  }`}
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className={`text-[8px] font-bold uppercase tracking-[0.15em] ${idx === currentSegmentIndex ? 'text-blue-500' : 'text-zinc-600'}`}>CLIP {idx + 1}</span>
                    <span className="text-[8px] font-mono font-bold text-zinc-700">{(s.endTime - s.startTime).toFixed(2)}s</span>
                  </div>
                  <p className={`text-[11px] font-bold leading-relaxed line-clamp-1 ${idx === currentSegmentIndex ? 'text-white' : 'text-zinc-500'}`}>
                    {getFilteredText(s, selectedLanguage)}
                  </p>
                </button>
              ))}
            </div>
          </div>
          
          {/* Action Card */}
          <div className="bg-[#0a0a0a] p-5 rounded-3xl border border-zinc-900/50 shadow-2xl">
             <div className="grid grid-cols-2 gap-3 mb-5">
                <div className="bg-black p-2.5 rounded-lg border border-zinc-900 text-center shadow-inner">
                   <p className="text-[8px] font-bold text-zinc-700 uppercase tracking-widest mb-1">RUNTIME</p>
                   <p className="text-sm font-bold text-white font-mono leading-none tracking-tighter">{(selectedSegments.reduce((acc, s) => acc + (s.endTime - s.startTime), 0)).toFixed(2)}s</p>
                </div>
                <div className="bg-black p-2.5 rounded-lg border border-zinc-900 text-center shadow-inner">
                   <p className="text-[8px] font-bold text-zinc-700 uppercase tracking-widest mb-1">FORMAT</p>
                   <p className="text-sm font-bold text-white bebas tracking-[0.15em] leading-none">MASTER</p>
                </div>
             </div>
             <button 
              onClick={() => setShowExportSuccess(true)}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white h-11 rounded-xl font-bold text-[10px] shadow-2xl shadow-blue-600/20 transition-all flex items-center justify-center gap-2.5 uppercase tracking-[0.2em] active:scale-95 border-b-2 border-blue-400/50 hover:ring-4 hover:ring-blue-500/10"
             >
               EXPORT VIDEO
               <ChevronRight className="w-3.5 h-3.5" />
             </button>
          </div>
        </div>
      </div>

      {showExportSuccess && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-zinc-950 text-white px-8 py-5 rounded-2xl border border-green-500/30 shadow-[0_20px_80px_rgba(0,0,0,0.8)] flex items-center gap-6 animate-in fade-in slide-in-from-bottom-16 duration-500 z-50 ring-1 ring-white/10">
          <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center border border-green-500/20 shadow-xl">
            <CheckCircle className="w-5 h-5 text-green-500" />
          </div>
          <div className="flex flex-col pr-6">
            <span className="font-bold text-base tracking-[0.05em] uppercase bebas mb-0.5">MASTER RENDER COMPLETE</span>
            <span className="text-[9px] font-bold text-zinc-600 uppercase tracking-[0.2em]">Ready for transmission</span>
          </div>
          <button 
            onClick={() => setShowExportSuccess(false)}
            className="p-2 text-zinc-600 hover:text-white transition-colors bg-white/5 hover:bg-white/10 rounded-lg"
          >
            <Maximize className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
