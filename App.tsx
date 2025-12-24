
import React, { useState } from 'react';
import { ViewState, Segment, VideoProject, Language } from './types';
import { Dashboard } from './components/Dashboard';
import { TranscriptionView } from './components/TranscriptionView';
import { PreviewView } from './components/PreviewView';
import { generateTranscripts, translateSegments } from './services/geminiService';
import { Clapperboard, Layers, Settings, User, LayoutGrid } from 'lucide-react';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('upload');
  const [project, setProject] = useState<VideoProject | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<Language>('tamil');

  const handleVideoUpload = (file: File) => {
    const url = URL.createObjectURL(file);
    setProject({
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      url: url,
      duration: 0,
      segments: [],
      isTranscribed: false
    });
    setView('video-preview');
  };

  const handleStartTranscription = async () => {
    if (!project) return;
    setIsProcessing(true);
    try {
      const segments = await generateTranscripts(project.name);
      setProject({
        ...project,
        segments: segments.map(s => ({ ...s, excludedWordsIndices: [] })),
        isTranscribed: true
      });
      setView('transcription');
    } catch (error) {
      console.error("Transcription failed", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleToggleSegment = (id: string) => {
    if (!project) return;
    setProject({
      ...project,
      segments: project.segments.map(s => 
        s.id === id ? { ...s, isSelected: !s.isSelected } : s
      )
    });
  };

  const handleToggleWord = (segmentId: string, wordIndex: number) => {
    if (!project) return;
    setProject({
      ...project,
      segments: project.segments.map(s => {
        if (s.id !== segmentId) return s;
        const currentExcluded = s.excludedWordsIndices || [];
        const newExcluded = currentExcluded.includes(wordIndex)
          ? currentExcluded.filter(i => i !== wordIndex)
          : [...currentExcluded, wordIndex];
        return { ...s, excludedWordsIndices: newExcluded };
      })
    });
  };

  const handleAutoEdit = (lang: Language) => {
    if (!project) return;
    setSelectedLanguage(lang);
    const autoSegments = project.segments.map(s => ({
      ...s,
      isSelected: s.score > 80
    }));
    setProject({ ...project, segments: autoSegments });
    setView('final-cut');
  };

  const handleManualFinalize = (lang: Language) => {
    setSelectedLanguage(lang);
    setView('final-cut');
  };

  const handleTranslate = async () => {
    if (!project) return;
    setIsTranslating(true);
    try {
      const translated = await translateSegments(project.segments);
      setProject({ ...project, segments: translated });
    } catch (error) {
      console.error("Translation failed", error);
    } finally {
      setIsTranslating(false);
    }
  };

  const selectedSegments = project?.segments.filter(s => s.isSelected) || [];

  return (
    <div className="flex h-screen w-full bg-[#050505] text-zinc-100 selection:bg-blue-500/30 font-sans">
      <nav className="w-20 border-r border-zinc-900 flex flex-col items-center py-8 gap-10 bg-black">
        <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-lg cursor-pointer hover:scale-105 transition-all">
          <Clapperboard className="w-6 h-6 text-black fill-current" />
        </div>
        <div className="flex flex-col gap-8 flex-grow">
          <button onClick={() => setView('upload')} className={`p-2 transition-all group ${view === 'upload' ? 'text-blue-500' : 'text-zinc-700 hover:text-white'}`}>
            <LayoutGrid className="w-6 h-6 group-hover:scale-110 transition-transform" />
          </button>
          <button className="text-zinc-700 hover:text-white transition-all group">
            <Layers className="w-6 h-6 group-hover:scale-110 transition-transform" />
          </button>
          <button className="text-zinc-700 hover:text-white transition-all group">
            <Settings className="w-6 h-6 group-hover:scale-110 transition-transform" />
          </button>
        </div>
        <div className="w-10 h-10 bg-zinc-900 rounded-full flex items-center justify-center border border-zinc-800">
          <User className="w-4 h-4 text-zinc-500" />
        </div>
      </nav>

      <main className="flex-grow flex flex-col p-8 overflow-hidden bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-zinc-900/10 via-zinc-950 to-zinc-950">
        {(view === 'upload' || view === 'video-preview') && (
          <Dashboard 
            project={project}
            onVideoUpload={handleVideoUpload} 
            onStartTranscription={handleStartTranscription}
            isProcessing={isProcessing} 
          />
        )}

        {view === 'transcription' && project && (
          <TranscriptionView 
            segments={project.segments}
            onToggleSegment={handleToggleSegment}
            onToggleWord={handleToggleWord}
            onAutoEdit={handleAutoEdit}
            onManualFinalize={handleManualFinalize}
            onBack={() => setView('video-preview')}
            isTranslating={isTranslating}
          />
        )}

        {view === 'final-cut' && project && (
          <PreviewView 
            videoUrl={project.url}
            selectedSegments={selectedSegments}
            onTranslate={handleTranslate}
            isTranslating={isTranslating}
            selectedLanguage={selectedLanguage}
            onBack={() => setView('transcription')}
          />
        )}
      </main>
    </div>
  );
};

export default App;
