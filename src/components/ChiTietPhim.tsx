import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, ChevronRight, Play, User } from 'lucide-react';
import { AnimatePresence } from 'motion/react';
import { Movie } from '../types';
import { useTheme } from '@/src/hooks/useTheme';
import { TrinhPhatVideo } from './TrinhPhatVideo/TrinhPhatVideo';

interface ChiTietPhimProps {
  movie: Movie;
  onBack: () => void;
  userAvatar?: string | null;
}

export const ChiTietPhim: React.FC<ChiTietPhimProps> = ({ movie, onBack, userAvatar }) => {
  const { theme } = useTheme();
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [playingEpisode, setPlayingEpisode] = React.useState<number>(0);
  const scrollRef = React.useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -250, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 250, behavior: 'smooth' });
    }
  };

  // Drag to scroll logic
  const [isDragging, setIsDragging] = React.useState(false);
  const [startX, setStartX] = React.useState(0);
  const [scrollLeftPos, setScrollLeftPos] = React.useState(0);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeftPos(scrollRef.current.scrollLeft);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 2; // Tốc độ cuộn
    scrollRef.current.scrollLeft = scrollLeftPos - walk;
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="h-screen w-full overflow-hidden relative bg-[#0a0a0a] text-white select-none"
    >
      {/* LAYER 1: Full-screen Backdrop (mờ nhạt) */}
      <div className="absolute inset-0">
        <img
          src={movie.backdropUrl}
          alt=""
          className="w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a] via-[#0a0a0a]/90 to-[#0a0a0a]/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent" />
      </div>

      {/* LAYER 2: Ảnh nhân vật bên trái — tăng độ sáng để nhìn rõ hơn */}
      <div className="absolute inset-0 hidden md:block pointer-events-none">
        <div className="absolute left-0 top-0 w-[48%] h-full">
          <img
            src={movie.backdropUrl}
            alt={movie.title}
            className="w-full h-full object-cover object-center opacity-80"
            style={{
              maskImage: 'linear-gradient(to right, black 30%, transparent 95%)',
              WebkitMaskImage: 'linear-gradient(to right, black 30%, transparent 95%)',
            }}
          />
          <div className="absolute bottom-0 left-0 right-0 h-1/4 bg-gradient-to-t from-[#0a0a0a] to-transparent" />
        </div>
      </div>

      {/* LAYER 3: Navbar */}
      <nav className="relative z-50 flex items-center justify-between py-3 px-4 md:py-6 md:px-8">
        <div className="flex items-center gap-2">
          <button
            onClick={onBack}
            className="group flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-all cursor-pointer"
          >
            <ChevronLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-xs font-bold tracking-widest uppercase">Quay lại</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-zinc-800 border border-white/10 flex items-center justify-center overflow-hidden">
            {userAvatar ? (
              <img src={userAvatar} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <User size={14} className="text-zinc-500" />
            )}
          </div>
        </div>
      </nav>

      {/* LAYER 4: Main Content */}
      <div className="relative z-20 h-[calc(100vh-64px)] flex">

        {/* Spacer bên trái (ảnh nhân vật chiếm vùng này) */}
        <div className="hidden md:block w-[40%] lg:w-[36%] flex-shrink-0" />

        {/* Nội dung chính */}
        <div className="flex-1 flex flex-col justify-between px-6 md:px-8 lg:px-12 py-4 min-w-0">

          {/* Phần trên: Title + Desc + Meta */}
          <div className="flex-1 flex flex-col justify-center">
          {/* Title — giới hạn chiều rộng để không bao giờ tràn */}
          <motion.h1
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="font-display font-black uppercase tracking-[-0.04em] leading-[0.88] mb-4 max-w-[90%]"
            style={{
              fontSize: 'clamp(2.5rem, 6vw, 5.5rem)',
              textShadow: '0 4px 60px rgba(0,0,0,0.8)',
            }}
          >
            {movie.title}
          </motion.h1>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.6 }}
            className="text-zinc-500 text-[12px] sm:text-sm leading-[1.7] max-w-md mb-4 font-light line-clamp-3"
          >
            {movie.description}
          </motion.p>

          {/* Meta */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex items-center gap-5 text-[10px] sm:text-xs font-mono uppercase tracking-[0.25em] text-zinc-600"
          >
            <span className="text-white/70 font-bold">{movie.year}</span>
            <span className="text-zinc-700">|</span>
            <span>{movie.duration}</span>
            <span className="text-zinc-700">|</span>
            <span>{movie.genres?.[0]}</span>
          </motion.div>
          </div>

          {/* Phần dưới: Trailers — nằm sát đáy màn hình */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.7 }}
            className="pb-15 w-full min-w-0"
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.25em] text-zinc-400">Tập phim</h3>
              <div className="flex gap-1.5">
                <button onClick={scrollLeft} className="w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center rounded-full border border-white/10 hover:bg-white/10 transition-colors text-zinc-500 hover:text-white">
                  <ChevronLeft size={12} />
                </button>
                <button
                  onClick={scrollRight}
                  className="w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center rounded-full border hover:opacity-80 transition-all"
                  style={{ borderColor: theme.primaryColor, color: theme.primaryColor }}
                >
                  <ChevronRight size={12} />
                </button>
              </div>
            </div>

            <div 
              ref={scrollRef}
              className={`flex gap-3 overflow-x-auto pb-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
              onMouseDown={handleMouseDown}
              onMouseLeave={handleMouseLeave}
              onMouseUp={handleMouseUp}
              onMouseMove={handleMouseMove}
            >
              {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                <div
                  key={num}
                  className="relative flex-none w-[200px] sm:w-[240px] aspect-[16/10] rounded-xl overflow-hidden group select-none"
                  onClick={() => { setPlayingEpisode(num); setIsPlaying(true); }}
                >
                  <img
                    src={`https://picsum.photos/seed/${movie.id}${num}/400/250`}
                    alt={`Tập ${num}`}
                    className="w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                  
                  {/* Nút Play mờ nổi lên khi hover */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                    <div className="w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center border border-white/20">
                      <Play size={16} className="fill-white text-white ml-0.5" />
                    </div>
                  </div>

                  <span className="absolute bottom-3 left-4 text-2xl font-display font-black text-white/20 group-hover:text-white/60 transition-colors z-20">
                    0{num}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* LAYER 5: Play Button (góc dưới trái) */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.7, type: 'spring', damping: 15 }}
        className="absolute bottom-8 sm:bottom-12 left-6 sm:left-10 z-30 flex items-center gap-3 cursor-pointer group"
        onClick={() => { setPlayingEpisode(0); setIsPlaying(true); }}
      >
        <div
          className="w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(0,0,0,0.5)] group-hover:scale-110 group-hover:shadow-[0_0_50px] transition-all duration-300"
          style={{ backgroundColor: theme.primaryColor, '--tw-shadow-color': theme.primaryColor + '40' } as React.CSSProperties}
        >
          <Play size={24} className="fill-white text-white ml-0.5" />
        </div>
        <div className="hidden sm:block">
          <p className="text-xs text-white/40 font-mono uppercase tracking-[0.2em] leading-none mb-1">Xem</p>
          <p className="text-base font-bold text-white/90 leading-none">phim</p>
        </div>
      </motion.div>

      {/* LAYER 6: Video Player Overlay */}
      <AnimatePresence>
        {isPlaying && (
          <TrinhPhatVideo 
            videoUrl="https://storage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4" 
            title={playingEpisode === 0 ? movie.title : `${movie.title} - Tập ${playingEpisode}`} 
            onClose={() => setIsPlaying(false)} 
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};
