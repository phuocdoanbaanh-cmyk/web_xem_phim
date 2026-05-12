export interface Movie {
  id: string;
  title: string;
  originalTitle: string;
  description: string;
  posterUrl: string;
  backdropUrl: string;
  rating: number;
  year: number;
  genres: string[];
  duration: string;
  status: 'watching' | 'completed' | 'on_hold' | 'dropped' | 'plan_to_watch';
  progress: number; // percentage
  platform?: string;
  personalNotes?: string;
  director?: string;
  cast?: string[];
}

export type ThemeMode = 'classic' | 'modern' | 'minimal';
export type FontFamily = 'sans' | 'serif' | 'mono' | 'display';

export interface AppTheme {
  primaryColor: string;
  fontFamily: FontFamily;
  layout: ThemeMode;
}

export interface AppSettings {
  language: 'en' | 'vi';
  theme: AppTheme;
}
