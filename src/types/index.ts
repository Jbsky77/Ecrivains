export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  dailyGoal: number;
  theme: 'light' | 'dark';
}

export interface Book {
  id: string;
  title: string;
  genre: string;
  description: string;
  status: 'draft' | 'in-progress' | 'completed' | 'published';
  wordGoal: number;
  currentWords: number;
  createdAt: string;
  updatedAt: string;
  chapters: Chapter[];
  characters: Character[];
  locations: Location[];
  objects: BookObject[];
}

export interface Chapter {
  id: string;
  title: string;
  content: string;
  wordCount: number;
  status: 'todo' | 'in-progress' | 'completed';
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface Character {
  id: string;
  name: string;
  role: string;
  description: string;
  imageUrl?: string;
  relationships: string[];
  relatedChapters: string[];
}

export interface Location {
  id: string;
  name: string;
  description: string;
  relatedChapters: string[];
}

export interface BookObject {
  id: string;
  name: string;
  description: string;
  importance: 'low' | 'medium' | 'high';
  relatedChapters: string[];
}

export interface DailyProgress {
  date: string;
  wordsWritten: number;
  goalMet: boolean;
}

export interface WritingSession {
  id: string;
  bookId: string;
  chapterId: string;
  startTime: string;
  endTime: string;
  wordsWritten: number;
}