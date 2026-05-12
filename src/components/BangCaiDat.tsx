import React from 'react';
import { 
  Settings, 
  Trash2, 
  Download, 
  Upload, 
  RefreshCw, 
  Palette, 
  Type, 
  Layout, 
  Globe,
  Check
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/src/hooks/useTheme';
import { THEME_COLORS } from '../constants';
import { FontFamily, ThemeMode } from '../types';

interface BangCaiDatProps {
  isOpen: boolean;
  onClose: () => void;
  onExport: () => void;
  onImport: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onReset: () => void;
}

export const BangCaiDat: React.FC<BangCaiDatProps> = ({ 
  isOpen, 
  onClose, 
  onExport, 
  onImport, 
  onReset 
}) => {
  const { t } = useTranslation();
  const { theme, setPrimaryColor, setFontFamily, setLayout, setLanguage, language } = useTheme();

  const fonts: { id: FontFamily; name: string }[] = [
    { id: 'sans', name: 'Inter (Sans)' },
    { id: 'serif', name: 'Playfair (Serif)' },
    { id: 'mono', name: 'JetBrains (Mono)' },
    { id: 'display', name: 'Syne (Display)' },
  ];

  const layouts: { id: ThemeMode; label: string }[] = [
    { id: 'classic', label: t('settings.theme.classic') },
    { id: 'modern', label: t('settings.theme.modern') },
    { id: 'minimal', label: t('settings.theme.minimal') },
  ];

  return (
    <>
      {/* Overlay — luôn có trong DOM, CSS toggle opacity */}
      <div
        onClick={onClose}
        className={`settings-overlay fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] ${isOpen ? 'open' : ''}`}
      />

      {/* Panel — luôn có trong DOM, CSS toggle translateX */}
      <div
        className={`settings-panel fixed right-0 top-0 bottom-0 w-full max-w-md bg-black/40 backdrop-blur-2xl border-l border-white/10 z-[101] shadow-2xl p-8 overflow-y-auto ${isOpen ? 'open' : ''}`}
      >
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Settings size={24} />
            {t('settings.title')}
          </h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <Trash2 size={20} className="rotate-45" />
          </button>
        </div>

        <div className="space-y-8">
          {/* Language */}
          <section>
            <h3 className="text-sm font-mono text-zinc-500 uppercase tracking-widest mb-4 flex items-center gap-2">
              <Globe size={16} />
              {t('settings.language')}
            </h3>
            <div className="flex gap-2">
              {['en', 'vi'].map((lang) => (
                <button
                  key={lang}
                  onClick={() => setLanguage(lang as 'en' | 'vi')}
                  className={`px-4 py-2 rounded-lg font-bold transition-all ${
                    language === lang 
                    ? 'bg-white text-black' 
                    : 'bg-white/5 hover:bg-white/10'
                  }`}
                >
                  {lang === 'en' ? 'English' : 'Tiếng Việt'}
                </button>
              ))}
            </div>
          </section>

          {/* Accent Color */}
          <section>
            <h3 className="text-sm font-mono text-zinc-500 uppercase tracking-widest mb-4 flex items-center gap-2">
              <Palette size={16} />
              {t('settings.color')}
            </h3>
            <div className="flex flex-wrap gap-3">
              {THEME_COLORS.map((color) => (
                <button
                  key={color}
                  onClick={() => setPrimaryColor(color)}
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-transform hover:scale-110 active:scale-95 ${
                    theme.primaryColor === color ? 'ring-2 ring-white ring-offset-2 ring-offset-zinc-900' : ''
                  }`}
                  style={{ backgroundColor: color }}
                >
                  {theme.primaryColor === color && <Check size={18} className="text-white" />}
                </button>
              ))}
            </div>
          </section>

          {/* Typography */}
          <section>
            <h3 className="text-sm font-mono text-zinc-500 uppercase tracking-widest mb-4 flex items-center gap-2">
              <Type size={16} />
              {t('settings.font')}
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {fonts.map((f) => (
                <button
                  key={f.id}
                  onClick={() => setFontFamily(f.id)}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    theme.fontFamily === f.id 
                    ? 'border-white bg-white/10' 
                    : 'border-white/10 bg-white/5 hover:bg-white/10'
                  }`}
                >
                  <p className={`font-${f.id} text-lg`}>Aa</p>
                  <p className="text-xs opacity-60 mt-1">{f.name}</p>
                </button>
              ))}
            </div>
          </section>

          {/* Layout */}
          <section>
            <h3 className="text-sm font-mono text-zinc-500 uppercase tracking-widest mb-4 flex items-center gap-2">
              <Layout size={16} />
              {t('settings.theme')}
            </h3>
            <div className="space-y-2">
              {layouts.map((l) => (
                <button
                  key={l.id}
                  onClick={() => setLayout(l.id)}
                  className={`w-full p-4 rounded-xl border flex items-center justify-between transition-all ${
                    theme.layout === l.id 
                    ? 'border-white bg-white/10' 
                    : 'border-white/10 bg-white/5 hover:bg-white/10'
                  }`}
                >
                  <span className="font-bold">{l.label}</span>
                  {theme.layout === l.id && <Check size={20} />}
                </button>
              ))}
            </div>
          </section>

          {/* Data Management */}
          <section>
            <h3 className="text-sm font-mono text-zinc-500 uppercase tracking-widest mb-4 flex items-center gap-2">
              <RefreshCw size={16} />
              {t('settings.data')}
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={onExport}
                className="flex flex-col items-center justify-center p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all gap-2"
              >
                <Download size={20} />
                <span className="text-xs font-bold">{t('settings.export')}</span>
              </button>
              <label className="flex flex-col items-center justify-center p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all gap-2 cursor-pointer">
                <Upload size={20} />
                <span className="text-xs font-bold">{t('settings.import')}</span>
                <input type="file" accept=".json" onChange={onImport} className="hidden" />
              </label>
            </div>
            <button 
              onClick={onReset}
              className="w-full mt-4 p-4 rounded-xl border border-red-500/20 text-red-400 bg-red-500/5 hover:bg-red-500/10 transition-all flex items-center justify-center gap-2"
            >
              <RefreshCw size={18} />
              <span className="text-xs font-bold">{t('settings.reset')}</span>
            </button>
          </section>
        </div>
      </div>
    </>
  );
};
