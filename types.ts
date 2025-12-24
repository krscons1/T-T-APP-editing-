
export interface Segment {
  id: string;
  startTime: number;
  endTime: number;
  tamilText: string;
  tanglishText: string;
  englishText?: string;
  score: number;
  isSelected: boolean;
  speakerId: string;
  excludedWordsIndices?: number[]; // Track indices of words that are removed/unselected
}

export type ViewState = 'upload' | 'video-preview' | 'transcription' | 'final-cut';
export type Language = 'tamil' | 'tanglish';

export interface VideoProject {
  id: string;
  name: string;
  url: string;
  duration: number;
  segments: Segment[];
  isTranscribed: boolean;
}
