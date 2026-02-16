// Core types for the Bible app
export interface BibleBook {
  id: string;
  name: string;
  nameEn: string;
  chapters: number;
  testament: 'OT' | 'NT';
}

export interface BibleVerse {
  bookId: string;
  chapter: number;
  verse: number;
  textCn: string;
  textEn: string;
}

export interface Note {
  id: string; // format: bookId:chapter:verse
  content: string;
  createdAt: number;
  updatedAt: number;
}

export interface AIResearch {
  id: string;
  verseId: string;
  question: string;
  answer: string;
  createdAt: number;
}

export interface Bookmark {
  id: string;
  verseId: string;
  createdAt: number;
}

export interface ReadingProgress {
  bookId: string;
  chapter: number;
  timestamp: number;
}

export interface DrawingData {
  id: string; // format: bookId:chapter
  strokes: Stroke[];
}

export interface Stroke {
  points: Point[];
  color: string;
  width: number;
  tool: 'pen' | 'marker' | 'highlighter' | 'eraser';
}

export interface Point {
  x: number;
  y: number;
  pressure?: number;
}

export interface AppSettings {
  language: 'cn' | 'en' | 'both';
  theme: 'light' | 'dark' | 'auto';
  fontSize: number;
  showAnnotations: boolean;
  aiEnabled: boolean;
  geminiApiKey?: string;
  claudeApiKey?: string;
  aiProvider?: 'gemini' | 'claude';
}

export interface VibeCoding {
  prompt: string;
  timestamp: number;
  changes: string;
}
