import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { TrinhChieuChinh } from './components/TrinhChieuChinh';
import { ChiTietPhim } from './components/ChiTietPhim';
import { ThanhDieuHuong } from './components/ThanhDieuHuong';
import { BangCaiDat } from './components/BangCaiDat';
import { ChonAnhDaiDien } from './components/ChonAnhDaiDien/ChonAnhDaiDien';
import { DangNhap } from './components/DangNhap/DangNhap';
import { BangThongTinPhim } from './components/BangThongTinPhim/BangThongTinPhim';
import BorderGlow from './components/BorderGlow/BorderGlow';
import { ThemeProvider, useTheme } from '@/src/hooks/useTheme';
import { INITIAL_MOVIES, STATUS_OPTIONS } from './constants';
import { Movie } from './types';
import { useTranslation } from 'react-i18next';
import { Clock, Star, PlayCircle, ExternalLink, Check } from 'lucide-react';
import ClickSpark from './components/ClickSpark/ClickSpark';

import { CineVerse3D } from './components/CineVerse3D';

function AppContent() {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const [viewMode, setViewMode] = useState<'3D' | '2D'>('3D');
  const [movies, setMovies] = useState<Movie[]>(() => {
    const saved = localStorage.getItem('cinesync_data');
    if (!saved) return INITIAL_MOVIES;

    // Merge: lấy user data (status, progress) từ localStorage
    // nhưng luôn dùng videoUrl, cast, director,... từ INITIAL_MOVIES mới nhất
    const savedMovies: Movie[] = JSON.parse(saved);
    return INITIAL_MOVIES.map(initial => {
      const saved = savedMovies.find(s => s.id === initial.id);
      if (!saved) return initial;
      // Giữ lại progress/status của user, nhưng lấy videoUrl mới từ constants
      return {
        ...initial,
        status: saved.status,
        progress: saved.progress,
      };
    });
  });
  const [filter, setFilter] = useState('All');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isAvatarSelectorOpen, setIsAvatarSelectorOpen] = useState(false);
  const [userAvatar, setUserAvatar] = useState<string | null>(() => {
    return localStorage.getItem('cinesync_avatar');
  });
  const [userName, setUserName] = useState<string | null>(() => {
    return localStorage.getItem('cinesync_username');
  });
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [infoMovie, setInfoMovie] = useState<Movie | null>(null);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleAvatarSelect = (url: string) => {
    setUserAvatar(url);
    localStorage.setItem('cinesync_avatar', url);
  };

  const handleLoginSuccess = (name: string, avatar: string) => {
    setUserName(name);
    setUserAvatar(avatar);
    localStorage.setItem('cinesync_username', name);
    localStorage.setItem('cinesync_avatar', avatar);
    setIsLoginOpen(false);
  };

  const filteredMovies = movies.filter(m => {
    // Lọc theo search (Tên phim hoặc Thể loại)
    const matchesSearch =
      m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.genres.some(g => g.toLowerCase().includes(searchQuery.toLowerCase()));

    if (searchQuery && !matchesSearch) return false;
    // Lọc theo tab
    if (filter === 'All') return true;
    if (filter === 'Watching') return m.status === 'watching';
    if (filter === 'Planned') return m.status === 'plan_to_watch';
    return true;
  });

  useEffect(() => {
    localStorage.setItem('cinesync_data', JSON.stringify(movies));
  }, [movies]);

  // Nhận diện thể loại từ trang 3D
  useEffect(() => {
    const category = localStorage.getItem('selected_category');
    if (category) {
      console.log('Đã chọn thể loại từ vũ trụ:', category);
      // Bạn có thể thêm logic lọc phim theo category ở đây nếu muốn
      // Ví dụ: setSearchQuery(category);
      // Sau khi đọc xong thì có thể xóa để lần sau load lại không bị lặp
      // localStorage.removeItem('selected_category');
    }
  }, []);

  const handleExport = () => {
    const dataStr = JSON.stringify({ movies, theme, timestamp: new Date().toISOString() }, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    const exportFileDefaultName = 'cinesync_backup.json';
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const json = JSON.parse(e.target?.result as string);
        if (json.movies) {
          setMovies(json.movies);
          alert('Data imported successfully!');
        }
      } catch (error) {
        alert('Invalid backup file.');
      }
    };
    reader.readAsText(file);
  };

  const handleReset = () => {
    if (confirm('Are you sure you want to reset all data and settings?')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <ClickSpark
      sparkColor="#e879f9"
      sparkSize={12}
      sparkRadius={22}
      sparkCount={10}
      duration={500}
      easing="ease-out"
      extraScale={1.2}
    >
    <div className="min-h-screen bg-[#050505] text-white" style={{ position: 'relative', minHeight: '100vh' }}>
      {!selectedMovie && (
        <ThanhDieuHuong
          onOpenSettings={() => setIsSettingsOpen(true)}
          onSearch={setSearchQuery}
          movies={movies}
          onMovieSelect={setSelectedMovie}
          userAvatar={userAvatar}
          userName={userName}
          onOpenAvatarSelector={() => setIsAvatarSelectorOpen(true)}
          onBackTo3D={() => setViewMode('3D')}
          onOpenLogin={() => setIsLoginOpen(true)}
        />
      )}

      <AnimatePresence mode="wait">
        {viewMode === '3D' ? (
          <motion.div
            key="3d-mode"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
          >
            <CineVerse3D
              onMovieClick={(category) => {
                // Map từ tên Tiếng Việt sang từ khóa Tiếng Anh trong dữ liệu
                const genreMap: Record<string, string> = {
                  'KHOA HỌC': 'Sci-Fi',
                  'VIỄN TƯỞNG': 'Sci-Fi',
                  'HÀNH ĐỘNG': 'Action',
                  'VÕ THUẬT': 'Action',
                  'KINH DỊ': 'Horror',
                  'TÌNH CẢM': 'Romance',
                  'HÀI HƯỚC': 'Comedy',
                  'HOẠT HÌNH': 'Animation',
                  'PHIÊU LƯU': 'Adventure',
                  'CHÍNH KỊCH': 'Drama',
                  'TÂM LÝ': 'Drama',
                  'HÌNH SỰ': 'Crime',
                  'BÍ ẨN': 'Mystery',
                  'CHIẾN TRANH': 'War',
                  'GIA ĐÌNH': 'Family',
                  'ÂM NHẠC': 'Music',
                  'CỔ TRANG': 'History'
                };
                const searchKey = genreMap[category] || category;
                setSearchQuery(searchKey);
                setViewMode('2D');
              }}
              onMovieSelect={(movieId) => {
                const movie = movies.find(m => m.id === movieId);
                if (movie) {
                  setSelectedMovie(movie);
                  setViewMode('2D');
                }
              }}
            />
          </motion.div>
        ) : (
          <motion.div
            key="2d-mode"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            {selectedMovie ? (
              <ChiTietPhim
                key="movie-detail"
                movie={selectedMovie}
                onBack={() => setSelectedMovie(null)}
                userAvatar={userAvatar}
              />
            ) : (
              <div key="home">
                {/* Hero Section */}
                <section className="relative">
                  <TrinhChieuChinh movies={movies} onMovieSelect={setSelectedMovie} onOpenInfo={setInfoMovie} />
                </section>

                {/* Watchlist Section */}
                <section className="container mx-auto px-6 py-20">
                  <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: false, margin: '-80px' }}
                    transition={{ duration: 0.7 }}
                    className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4"
                  >
                    <div>
                      <h2 className="text-4xl font-display font-black uppercase tracking-tighter mb-2">
                        {t('nav.mylist')}
                      </h2>
                      <p className="text-zinc-500 font-mono text-xs uppercase tracking-widest">
                        Keep track of your cinematic journey
                      </p>
                    </div>
                    <div className="flex gap-2 bg-white/5 p-1 rounded-xl border border-white/10">
                      {['All', 'Watching', 'Planned'].map(f => (
                        <button
                          key={f}
                          onClick={() => setFilter(f)}
                          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${filter === f ? 'bg-white text-black shadow-lg' : 'hover:bg-white/10 text-zinc-400'}`}
                        >
                          {f}
                        </button>
                      ))}
                    </div>
                  </motion.div>

                  <div className={`grid gap-8 ${theme.layout === 'modern' ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4' : 'grid-cols-1 md:grid-cols-2'}`}>
                    {filteredMovies.map((movie, index) => (
                      <motion.div
                        key={movie.id}
                        initial={{ opacity: 0, rotateY: 30, x: 80, filter: 'blur(10px)' }}
                        whileInView={{ opacity: 1, rotateY: 0, x: 0, filter: 'blur(0px)' }}
                        viewport={{ once: false, margin: '-60px' }}
                        transition={{
                          duration: 0.7,
                          delay: (index % 4) * 0.15,
                          ease: [0.22, 1, 0.36, 1],
                        }}
                        whileHover={{ y: -8, scale: 1.02 }}
                        onClick={() => setSelectedMovie(movie)}
                        className="cursor-pointer h-full"
                        style={{ perspective: '1000px', transformStyle: 'preserve-3d' }}
                      >
                        <BorderGlow
                          className={`group overflow-hidden h-full bg-zinc-900 transition-[border,box-shadow] ${theme.layout === 'minimal' ? 'border-none shadow-none' : 'border border-white/5'
                            }`}
                          backgroundColor="#18181b"
                          borderRadius={24}
                          animated={false}
                          glowColor="190 80 50"
                        >
                          <div className={`h-full ${theme.layout === 'minimal' ? 'flex flex-row gap-6 p-4' : 'flex flex-col'}`}>
                            {/* Poster/Image */}
                            <div className={`relative overflow-hidden aspect-[4/5] ${theme.layout === 'minimal' ? 'w-32 aspect-square rounded-2xl' : ''}`}>
                              <img
                                src={movie.posterUrl}
                                alt={movie.title}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                              />
                              <div className="absolute top-4 right-4 z-10">
                                <div className="bg-black/60 backdrop-blur-md px-2 py-1 rounded-lg flex items-center gap-1 text-xs font-bold border border-white/10">
                                  <Star size={12} className="text-yellow-500 fill-current" />
                                  {movie.rating}
                                </div>
                              </div>
                              {!theme.layout.includes('minimal') && (
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                  <button className="w-12 h-12 rounded-full flex items-center justify-center bg-white text-black transition-transform hover:scale-110 active:scale-95 shadow-xl">
                                    <PlayCircle size={24} />
                                  </button>
                                </div>
                              )}
                            </div>

                            {/* Details */}
                            <div className={`p-6 flex flex-col justify-between ${theme.layout === 'minimal' ? 'p-0 py-2 flex-1' : ''}`}>
                              <div>
                                <div className="flex items-center gap-2 mb-2">
                                  <span className={`w-2 h-2 rounded-full ${STATUS_OPTIONS.find(s => s.value === movie.status)?.color}`} />
                                  <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500">
                                    {t(`status.${movie.status}`)}
                                  </span>
                                </div>
                                <h3 className="text-xl font-display font-bold mb-1 group-hover:text-primary-400 transition-colors">
                                  {movie.title}
                                </h3>
                                <div className="flex items-center gap-4 text-xs text-zinc-500 font-mono mb-4">
                                  <span>{movie.year}</span>
                                  <span>{movie.duration}</span>
                                </div>
                              </div>

                              {/* Progress Bar */}
                              {movie.status === 'watching' && (
                                <div className="space-y-2">
                                  <div className="flex items-center justify-between text-[10px] uppercase tracking-widest font-bold">
                                    <span className="text-zinc-500">{t('movie.progress')}</span>
                                    <span style={{ color: theme.primaryColor }}>{movie.progress}%</span>
                                  </div>
                                  <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                    <div
                                      className="h-full rounded-full progress-bar-grow"
                                      style={{
                                        backgroundColor: theme.primaryColor,
                                        '--target-width': `${movie.progress}%`,
                                      } as React.CSSProperties}
                                    />
                                  </div>
                                </div>
                              )}

                              {movie.status === 'completed' && (
                                <div className="flex items-center gap-2 text-xs font-bold text-green-500 bg-green-500/10 px-3 py-1.5 rounded-lg w-fit">
                                  <Check size={14} />
                                  {t('status.completed')}
                                </div>
                              )}

                              {theme.layout === 'classic' && (
                                <div className="mt-6 pt-6 border-t border-white/5 flex items-center justify-between">
                                  <div className="flex items-center gap-2 text-xs text-zinc-500">
                                    <Clock size={14} />
                                    8 hours ago
                                  </div>
                                  <button className="p-2 hover:bg-white/10 rounded-lg transition-colors text-zinc-400">
                                    <ExternalLink size={16} />
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        </BorderGlow>
                      </motion.div>
                    ))}
                  </div>
                </section>

                {/* Footer */}
                <footer className="w-full py-16 border-t border-white/5 overflow-hidden relative flex items-center">
                  <style>
                    {`
                      @keyframes marqueeRibbon {
                        0% { transform: translateX(-50%); }
                        100% { transform: translateX(0%); }
                      }
                      .marquee-container {
                        display: flex;
                        width: max-content;
                        animation: marqueeRibbon 30s linear infinite;
                        will-change: transform;
                      }
                    `}
                  </style>
                  <div className="marquee-container text-zinc-600 text-xs font-mono uppercase tracking-[0.2em] gap-16">
                    <div className="flex gap-16 whitespace-nowrap">
                      <span>&copy; 2026 CineSync • personal cinematic archive • built with deepmind</span>
                      <span>&copy; 2026 CineSync • personal cinematic archive • built with deepmind</span>
                      <span>&copy; 2026 CineSync • personal cinematic archive • built with deepmind</span>
                    </div>
                    <div className="flex gap-16 whitespace-nowrap">
                      <span>&copy; 2026 CineSync • personal cinematic archive • built with deepmind</span>
                      <span>&copy; 2026 CineSync • personal cinematic archive • built with deepmind</span>
                      <span>&copy; 2026 CineSync • personal cinematic archive • built with deepmind</span>
                    </div>
                  </div>
                </footer>

                <BangCaiDat
                  isOpen={isSettingsOpen}
                  onClose={() => setIsSettingsOpen(false)}
                  onExport={handleExport}
                  onImport={handleImport}
                  onReset={handleReset}
                />
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isAvatarSelectorOpen && (
          <ChonAnhDaiDien
            currentAvatar={userAvatar}
            onSelect={handleAvatarSelect}
            onClose={() => setIsAvatarSelectorOpen(false)}
          />
        )}
      </AnimatePresence>

      <BangThongTinPhim
        movie={infoMovie}
        onClose={() => setInfoMovie(null)}
      />
      <AnimatePresence>
        {isLoginOpen && (
          <DangNhap
            onClose={() => setIsLoginOpen(false)}
            onLoginSuccess={handleLoginSuccess}
          />
        )}
      </AnimatePresence>
    </div>
    </ClickSpark>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}
