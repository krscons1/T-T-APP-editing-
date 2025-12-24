
import React, { useRef } from 'react';
import { Upload, Loader2, Sparkles, Scissors, Play, Film, ChevronRight, Video } from 'lucide-react';
import { VideoProject } from '../types';

interface DashboardProps {
  project: VideoProject | null;
  onVideoUpload: (file: File) => void;
  onStartTranscription: () => void;
  isProcessing: boolean;
}

export const Dashboard: React.FC<DashboardProps> = ({ project, onVideoUpload, onStartTranscription, isProcessing }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  if (project) {
    return (
      <div className="flex flex-col h-full animate-in fade-in duration-500 max-w-[1400px] mx-auto w-full overflow-hidden px-6">
        {/* Top Info Bar */}
        <div className="flex items-center justify-between mb-8 pb-6 border-b border-zinc-900/50">
          <div className="flex items-center gap-5">
            <div className="w-11 h-11 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/30 ring-1 ring-white/10">
              <Film className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white tracking-wider uppercase leading-none">{project.name}</h2>
              <div className="flex items-center gap-2 mt-2">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-600">ASSET LOADED</p>
              </div>
            </div>
          </div>
          
          <button 
            onClick={onStartTranscription}
            disabled={isProcessing}
            className="group relative h-12 px-8 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold transition-all disabled:opacity-50 text-[11px] shadow-xl active:scale-95 uppercase tracking-[0.15em] border border-white/10 flex items-center gap-3"
          >
            {isProcessing ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Sparkles className="w-4 h-4" />
            )}
            {isProcessing ? "PROCESSING..." : "TRANSCRIPT GENERATE"}
          </button>
        </div>

        {/* Workspace Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 flex-grow overflow-hidden min-h-0">
          {/* Main Monitor */}
          <div className="lg:col-span-9 bg-[#080808] rounded-2xl overflow-hidden border border-zinc-900/80 shadow-2xl flex flex-col relative group">
            <div className="absolute top-5 left-5 z-10 bg-black/60 backdrop-blur-md px-4 py-2 rounded-lg border border-white/5">
               <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">MASTER MONITOR</span>
            </div>
            <div className="flex-grow flex items-center justify-center bg-black">
              <video 
                ref={videoRef}
                src={project.url}
                controls
                className="w-full h-full max-h-[60vh] object-contain"
              />
            </div>
          </div>
          
          {/* Sidebar Tools */}
          <div className="lg:col-span-3 flex flex-col gap-6">
            <div className="bg-[#0a0a0a] border border-zinc-900/50 p-7 rounded-2xl shadow-xl">
              <div className="flex items-center gap-3 mb-8 border-b border-zinc-900 pb-4">
                <Scissors className="w-4 h-4 text-blue-500" />
                <h3 className="text-[11px] font-bold text-zinc-400 uppercase tracking-[0.2em]">TECHNICAL</h3>
              </div>
              
              <div className="space-y-6">
                <div className="flex justify-between items-center text-[10px]">
                  <span className="text-zinc-600 font-bold uppercase tracking-widest">FORMAT</span>
                  <span className="text-zinc-400 font-mono font-bold">H.264 / AVC</span>
                </div>
                <div className="flex justify-between items-center text-[10px]">
                  <span className="text-zinc-600 font-bold uppercase tracking-widest">RES</span>
                  <span className="text-zinc-400 font-mono font-bold">1920x1080</span>
                </div>
                <div className="flex justify-between items-center text-[10px]">
                  <span className="text-zinc-600 font-bold uppercase tracking-widest">FPS</span>
                  <span className="text-zinc-400 font-mono font-bold">24.00</span>
                </div>
              </div>
              
              <div className="mt-10 flex flex-col gap-3">
                <button 
                  onClick={() => videoRef.current?.play()} 
                  className="w-full h-12 bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl text-[11px] font-bold transition-all flex items-center justify-center gap-3 uppercase tracking-widest border border-zinc-800 shadow-lg active:scale-95"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  MONITOR
                </button>
                <button 
                  onClick={() => window.location.reload()} 
                  className="w-full h-10 text-zinc-800 hover:text-zinc-600 rounded-xl text-[9px] font-bold transition-all uppercase tracking-[0.2em]"
                >
                  UNLOAD
                </button>
              </div>
            </div>
            
            <div className="flex-grow bg-[#0a0a0a] border border-zinc-900/50 p-7 rounded-2xl flex flex-col justify-end">
               <Video className="w-5 h-5 text-blue-500 mb-4" />
               <p className="text-[11px] font-bold text-blue-500 uppercase tracking-[0.2em] mb-2">EDITORIAL STATUS</p>
               <p className="text-[13px] text-zinc-600 leading-relaxed font-medium italic">Neural analysis ready for Tamil semantic detection.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[75vh] w-full px-6 animate-in fade-in duration-700">
      <div className="text-center mb-12 max-w-5xl">
        <div className="inline-block px-5 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full mb-8">
          <span className="text-[11px] font-bold text-blue-500 uppercase tracking-[0.5em]">VEDAEDIT CINEMA SUITE</span>
        </div>
        <h1 className="text-7xl md:text-8xl font-black text-white mb-6 tracking-tighter leading-none bebas uppercase select-none">
          THE <span className="text-blue-500">EDITORIAL</span> MASTER
        </h1>
        <p className="text-zinc-500 text-lg md:text-xl font-medium leading-relaxed max-w-2xl mx-auto tracking-tight opacity-90">
          AI-driven Tamil content generation and viral highlight detection for modern creators.
        </p>
      </div>

      <label className="relative group cursor-pointer w-full max-w-xl">
        <input 
          type="file" 
          className="hidden" 
          accept="video/*" 
          onChange={(e) => e.target.files?.[0] && onVideoUpload(e.target.files[0])}
        />
        <div className="border border-dashed border-zinc-800/60 bg-zinc-900/10 hover:bg-zinc-900/20 hover:border-blue-500/50 rounded-3xl p-12 md:p-16 flex flex-col items-center justify-center transition-all duration-500 relative shadow-2xl">
          <div className="w-14 h-14 bg-zinc-950 rounded-2xl flex items-center justify-center mb-6 border border-zinc-800 group-hover:bg-blue-600 group-hover:border-blue-400 group-hover:scale-105 shadow-2xl transition-all duration-300">
            <Upload className="w-6 h-6 text-zinc-600 group-hover:text-white" />
          </div>
          <p className="text-xl md:text-2xl font-bold text-white bebas tracking-[0.3em] uppercase">IMPORT MEDIA</p>
          <p className="text-zinc-700 text-[10px] mt-4 uppercase font-bold tracking-[0.3em]">MP4 / MOV / PRORES</p>
        </div>
      </label>
    </div>
  );
};
