import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Star, Clock, Calendar, Play } from 'lucide-react';
import { Movie } from '../../types';
import './BangThongTinPhim.css';
import { useTheme } from '@/src/hooks/useTheme';
// ĐÃ SỬA: Import Component Trình phát video xịn của bạn thay vì HlsPlayer
// Xóa dòng cũ và thay bằng dòng này:
import { TrinhPhatVideo } from '../TrinhPhatVideo/TrinhPhatVideo';
interface BangThongTinPhimProps {
  movie: Movie | null;
  onClose: () => void;
}

export const BangThongTinPhim: React.FC<BangThongTinPhimProps> = ({ movie, onClose }) => {
  const { theme } = useTheme();
  const [isWatching, setIsWatching] = useState(false);

  useEffect(() => {
    setIsWatching(false);
  }, [movie]);

  if (!movie) return null;

  return (
    <>
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="movie-info-overlay"
        onClick={onClose}
      >
        <motion.div
          initial={{ y: 50, opacity: 0, scale: 0.95 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 20, opacity: 0, scale: 0.95 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="movie-info-container"
          onClick={(e) => e.stopPropagation()}
        >
          <button className="movie-info-close" onClick={onClose} title="Đóng">
            <X size={20} />
          </button>

          <div className="movie-info-content">
            {/* Poster */}
            <div className="movie-info-poster">
              <img src={movie.posterUrl} alt={movie.title} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent md:bg-gradient-to-r md:from-transparent md:to-[#18181b]" />
            </div>

            {/* Chi tiết phim */}
            <div className="movie-info-details overflow-y-auto">
              <div>
                <h2 className="movie-info-title">{movie.title}</h2>
                <div className="movie-info-meta">
                  <div className="meta-item meta-rating">
                    <Star size={16} className="fill-current" />
                    <span>{movie.rating.toFixed(1)}</span>
                  </div>
                  <span>•</span>
                  <div className="meta-item">
                    <Calendar size={14} />
                    <span>{movie.year}</span>
                  </div>
                  <span>•</span>
                  <div className="meta-item">
                    <Clock size={14} />
                    <span>{movie.duration}</span>
                  </div>
                </div>
              </div>

              {/* TÍNH NĂNG MỚI: Chỉ hiện nút Xem Phim nếu trong Data có trường videoUrl */}
              {!isWatching && movie.videoUrl && (
                <button 
                  onClick={() => setIsWatching(true)}
                  className="flex items-center gap-2 px-6 py-3 mt-4 text-white font-bold rounded-lg transition-transform hover:scale-105 w-max shadow-[0_0_15px_rgba(0,0,0,0.3)]"
                  style={{ backgroundColor: theme.primaryColor }}
                >
                  <Play size={20} className="fill-current" />
                  XEM PHIM
                </button>
              )}

              {/* TÍNH NĂNG MỚI: Báo cho người dùng nếu Admin chưa up link phim */}
              {!isWatching && !movie.videoUrl && (
                <div className="mt-4 px-4 py-2 bg-white/5 rounded-lg text-sm text-white/40 w-max border border-white/10 font-mono">
                  Đang cập nhật link xem...
                </div>
              )}

              {movie.genres && movie.genres.length > 0 && (
                <div className="movie-info-genres mt-4">
                  {movie.genres.map((genre) => (
                    <span key={genre} className="genre-tag" style={{ color: theme.primaryColor, backgroundColor: `${theme.primaryColor}20` }}>
                      {genre}
                    </span>
                  ))}
                </div>
              )}

              <div className="movie-info-section">
                <span className="section-title">Cốt truyện</span>
                <p className="movie-info-desc">{movie.description}</p>
              </div>

              {movie.director && (
                <div className="movie-info-section">
                  <span className="section-title">Đạo diễn</span>
                  <p className="director-name">{movie.director}</p>
                </div>
              )}

              {movie.cast && movie.cast.length > 0 && (
                <div className="movie-info-section flex-1 justify-end">
                  <span className="section-title mb-2">Diễn viên chính</span>
                  <div className="cast-list">
                    {movie.cast.map((actor, idx) => (
                      <div key={idx} className="cast-item">
                        <img 
                          src={`https://api.dicebear.com/7.x/initials/svg?seed=${actor}&backgroundColor=27272a,3f3f46,52525b`} 
                          alt={actor} 
                          className="cast-avatar" 
                        />
                        <span className="cast-name">{actor}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>

    {/* GỌI TRÌNH PHÁT VIDEO CHUẨN KHI BẤM NÚT */}
    {isWatching && movie.videoUrl && (
      <TrinhPhatVideo 
        videoUrl={movie.videoUrl} 
        title={movie.title}
        onClose={() => setIsWatching(false)} 
      />
    )}
    </>
  );
};