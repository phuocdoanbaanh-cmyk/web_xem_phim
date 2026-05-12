import React, { createContext, useContext, useState, useEffect } from 'react';
import { AppTheme, FontFamily, ThemeMode } from '../types';
import i18n from '../i18n';

interface ThemeContextType {
  theme: AppTheme;
  setPrimaryColor: (color: string) => void;
  setFontFamily: (font: FontFamily) => void;
  setLayout: (mode: ThemeMode) => void;
  language: string;
  setLanguage: (lang: 'en' | 'vi') => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<AppTheme>(() => {
    const saved = localStorage.getItem('cinesync_theme');
    return saved ? JSON.parse(saved) : {
      primaryColor: '#3b82f6',
      fontFamily: 'sans',
      layout: 'classic',
    };
  });

  const [language, setLanguageState] = useState(i18n.language);

  useEffect(() => {
    localStorage.setItem('cinesync_theme', JSON.stringify(theme));
    document.documentElement.style.setProperty('--primary-main', theme.primaryColor);
    
    // Apply font family to body
    const fontClasses = ['font-sans', 'font-serif', 'font-mono', 'font-display'];
    document.body.classList.remove(...fontClasses);
    document.body.classList.add(`font-${theme.fontFamily}`);
  }, [theme]);

  const setPrimaryColor = (primaryColor: string) => setTheme(prev => ({ ...prev, primaryColor }));
  const setFontFamily = (fontFamily: FontFamily) => setTheme(prev => ({ ...prev, fontFamily }));
  const setLayout = (layout: ThemeMode) => setTheme(prev => ({ ...prev, layout }));

  const setLanguage = (lang: 'en' | 'vi') => {
    i18n.changeLanguage(lang);
    setLanguageState(lang);
  };

  return (
    <ThemeContext.Provider value={{ theme, setPrimaryColor, setFontFamily, setLayout, language, setLanguage }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within a ThemeProvider');
  return context;
};
