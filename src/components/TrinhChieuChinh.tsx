import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, Play, Info } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Movie } from '../types';
import { useTheme } from '@/src/hooks/useTheme';

interface TrinhChieuChinhProps {
  movies: Movie[];
  onMovieSelect?: (movie: Movie) => void;
  onOpenInfo?: (movie: Movie) => void;
}

export const TrinhChieuChinh: React.FC<TrinhChieuChinhProps> = ({ movies, onMovieSelect, onOpenInfo }) => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const [currentIndex, setCurrentIndex] = useState(0);
  const wheelTimeout = useRef<NodeJS.Timeout | null>(null);

  const activeMovie = movies[currentIndex];
  const thumbnailRefs = useRef<(HTMLDivElement | null)[]>([]);

  const nextSlide = () => setCurrentIndex((prev) => (prev + 1) % movies.length);
  const prevSlide = () => setCurrentIndex((prev) => (prev - 1 + movies.length) % movies.length);

  // Xử lý vuốt bằng Touchpad (bàn di chuột trên máy tính)
  const handleWheel = (e: React.WheelEvent) => {
    // Kiểm tra nếu người dùng vuốt ngang
    if (Math.abs(e.deltaX) > Math.abs(e.deltaY) && Math.abs(e.deltaX) > 15) {
      if (wheelTimeout.current) return; // Đang trong thời gian chờ (cooldown) thì bỏ qua
      
      if (e.deltaX > 0) {
        nextSlide(); // Vuốt phải -> sang phim tiếp theo
      } else {
        prevSlide(); // Vuốt trái -> quay lại phim trước
      }
      
      // Đặt cooldown 500ms để không bị nhảy quá nhiều phim cùng lúc khi vuốt nhanh
      wheelTimeout.current = setTimeout(() => {
        wheelTimeout.current = null;
      }, 500);
    }
  };

  // Auto-slide
  useEffect(() => {
    const timer = setInterval(nextSlide, 8000);
    return () => clearInterval(timer);
  }, [movies.length]);

  // Scroll active thumbnail into view
  useEffect(() => {
    if (thumbnailRefs.current[currentIndex]) {
      thumbnailRefs.current[currentIndex]?.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center'
      });
    }
  }, [currentIndex]);

  if (!activeMovie) return null;

  return (
    <div className="relative h-screen w-full overflow-hidden bg-black">
      {/* Background with cross-fade */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeMovie.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="absolute inset-0"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent z-10" />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent z-10" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-transparent z-10" />
          <img
            src={activeMovie.backdropUrl}
            alt={activeMovie.title}
            className="h-full w-full object-cover"
          />
        </motion.div>
      </AnimatePresence>

      {/* Content Container */}
      <div className="relative z-20 h-full w-full px-6 md:px-12 lg:px-20 xl:px-24 2xl:px-32 flex flex-col justify-start pt-20 sm:pt-28 lg:justify-center lg:pt-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={`content-${activeMovie.id}`}
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 100, opacity: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="max-w-2xl mb-24 sm:mb-32 lg:mb-0 relative z-30"
          >
            <span className="inline-block px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm text-[10px] md:text-xs font-mono mb-2 md:mb-4 text-zinc-300">
              {activeMovie.genres?.join(' • ')}
            </span>
            <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-9xl font-display font-black leading-[0.9] mb-3 md:mb-6 tracking-tighter uppercase max-w-[12ch] sm:max-w-none">
              {activeMovie.title}
            </h1>
            <p className="text-zinc-400 text-xs sm:text-base md:text-lg mb-6 md:mb-8 max-w-[280px] sm:max-w-md lg:max-w-2xl line-clamp-2 sm:line-clamp-3 md:line-clamp-4 font-light leading-relaxed">
              {activeMovie.description}
            </p>

            <div className="flex flex-wrap items-center gap-2 md:gap-4">
              <button 
                onClick={() => onMovieSelect?.(activeMovie)}
                className="flex-1 sm:flex-none px-5 md:px-8 py-2 md:py-3 rounded-full flex items-center justify-center gap-2 text-xs md:text-base font-bold transition-all hover:scale-105 active:scale-95 shadow-xl shadow-primary-500/20"
                style={{ backgroundColor: theme.primaryColor }}
              >
                <Play className="fill-current" size={16} />
                {t('hero.discover')}
              </button>
              <button 
                onClick={() => onOpenInfo?.(activeMovie)}
                className="flex-1 sm:flex-none px-5 md:px-8 py-2 md:py-3 rounded-full flex items-center justify-center gap-2 text-xs md:text-base font-bold bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 transition-all text-white"
              >
                <Info size={16} />
                Chi tiết
              </button>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Thumbnail Strip (3D Arc Carousel - Bottom Right) */}
        <div className="absolute bottom-4 sm:bottom-8 lg:bottom-12 right-0 w-full lg:w-[65%] xl:w-[60%] overflow-visible flex flex-col items-end lg:pr-4 pointer-events-none z-40">
          <motion.div 
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onWheel={handleWheel}
            onDragEnd={(e, { offset, velocity }) => {
              if (offset.x < -50 || velocity.x < -300) {
                nextSlide();
              } else if (offset.x > 50 || velocity.x > 300) {
                prevSlide();
              }
            }}
            className="relative h-48 md:h-64 lg:h-[22rem] w-full max-w-4xl flex items-end justify-center pointer-events-auto mb-4 md:mb-6 translate-x-4 lg:translate-x-12 cursor-grab active:cursor-grabbing"
          >
            <AnimatePresence initial={false}>
              {movies.map((movie, idx) => {
                let offset = idx - currentIndex;
                
                // Chuẩn hóa offset
                if (offset > movies.length / 2) offset -= movies.length;
                if (offset < -movies.length / 2) offset += movies.length;

                // CHỈ render đúng 3 hình: 1 Trái (-1), 1 Giữa (0), 1 Phải (1) để giữ đối xứng
                if (Math.abs(offset) > 1) return null;

                return (
                  <motion.div
                    key={movie.id}
                    onClick={() => {
                      if (offset === 0) {
                        onMovieSelect?.(movie);
                      } else {
                        setCurrentIndex(idx);
                      }
                    }}
                    initial={false}
                    animate={{
                      x: `${offset * 115}%`,
                      scale: offset === 0 ? 1 : 0.8,
                      opacity: offset === 0 ? 1 : 0.7,
                      zIndex: 50 - Math.abs(offset),
                    }}
                    transition={{ type: 'spring', damping: 25, stiffness: 120 }}
                    // Không dùng transition-all của CSS ở đây để tránh xung đột gây lag với Framer Motion
                    className={`absolute bottom-0 cursor-pointer overflow-hidden rounded-lg md:rounded-2xl border-2 origin-bottom ${
                      Math.abs(offset) > 0 ? 'hover:brightness-125' : 'shadow-2xl shadow-black/50 hover:scale-[1.02]'
                    }`}
                    style={{ 
                      width: 'clamp(8rem, 16vw, 15rem)', // Phóng to ảnh thêm một khoảng theo yêu cầu
                      aspectRatio: '2/3',
                      borderColor: offset === 0 ? theme.primaryColor : 'transparent' 
                    }}
                  >
                    <img src={movie.posterUrl} alt={movie.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent flex flex-col justify-end p-2 md:p-4">
                      <motion.p 
                        animate={{ opacity: offset === 0 ? 1 : 0 }}
                        className="text-[10px] md:text-sm font-bold truncate leading-none uppercase"
                      >
                        {movie.title}
                      </motion.p>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
          
          {/* Controls */}
          <div className="flex items-center gap-3 md:gap-4 pointer-events-auto z-50 justify-end">
            <div className="text-sm md:text-5xl font-display font-black text-white/20 leading-none">
              0{currentIndex + 1}
            </div>
            <div className="hidden sm:block h-px w-8 md:w-24 bg-white/20" />
            <div className="flex gap-1 md:gap-2">
              <button 
                onClick={prevSlide}
                className="p-2 md:p-3 rounded-full border border-white/20 hover:bg-white/10 text-white backdrop-blur-md transition-all"
              >
                <ChevronLeft size={16} className="sm:w-5 sm:h-5 md:w-6 md:h-6" />
              </button>
              <button 
                onClick={nextSlide}
                className="p-2 md:p-3 rounded-full border border-white/20 hover:bg-white/10 text-white backdrop-blur-md transition-all"
              >
                <ChevronRight size={16} className="sm:w-5 sm:h-5 md:w-6 md:h-6" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
