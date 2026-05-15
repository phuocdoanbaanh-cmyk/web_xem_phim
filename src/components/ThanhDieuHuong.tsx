import React, { useState, useRef, useEffect } from 'react';
import { Search, Settings, User, Bell, Star, Play, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/src/hooks/useTheme';
import { Movie } from '../types';

interface ThanhDieuHuongProps {
  onOpenSettings: () => void;
  onSearch?: (query: string) => void;
  movies?: Movie[];
  onMovieSelect?: (movie: Movie) => void;
  userAvatar?: string | null;
  onOpenAvatarSelector?: () => void;
  onBackTo3D?: () => void;
  onOpenLogin?: () => void;
  onReset?: () => void;
  userName?: string | null;
}

export const ThanhDieuHuong: React.FC<ThanhDieuHuongProps> = ({ 
  onOpenSettings, 
  onSearch, 
  movies = [], 
  onMovieSelect, 
  userAvatar, 
  onOpenAvatarSelector, 
  onBackTo3D, 
  onOpenLogin,
  onReset,
  userName
}) => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [query, setQuery] = useState('');
  
  // State thông báo
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'movie',
      title: 'Deadpool & Wolverine',
      message: 'Phim bạn đang theo dõi vừa ra mắt Trailer mới!',
      time: '2 giờ trước',
      image: 'https://image.tmdb.org/t/p/w500/8cdWjvZQUExUUTzyp4t6EDMubfO.jpg',
      read: false
    },
    {
      id: 2,
      type: 'suggestion',
      title: 'Gợi ý phim',
      message: 'Dựa trên lịch sử xem, chúng tôi đã thêm 5 phim khoa học viễn tưởng vào danh sách.',
      time: '5 giờ trước',
      read: false
    },
    {
      id: 3,
      type: 'system',
      title: 'Hệ thống',
      message: 'Cập nhật hệ thống: CineSync phiên bản 2.0 đã ra mắt với giao diện hoàn toàn mới.',
      time: 'Hôm qua',
      read: true
    }
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const markAsRead = (id: number) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
  };
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Lọc phim theo từ khóa
  const searchResults = query.length > 0
    ? movies.filter(m => m.title.toLowerCase().includes(query.toLowerCase()))
    : [];

  // Focus input when search opens
  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  // Close search when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setIsSearchOpen(false);
        setQuery('');
        onSearch?.('');
      }
    };
    if (isSearchOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isSearchOpen]);

  const handleSelectMovie = (movie: Movie) => {
    onMovieSelect?.(movie);
    setIsSearchOpen(false);
    setQuery('');
    onSearch?.('');
    if (searchInputRef.current) searchInputRef.current.value = '';
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-[60] py-3 px-4 md:py-6 md:px-8 flex items-center justify-between">
      {/* Brand */}
      <div className="flex items-center gap-2">
        <div 
          onClick={() => window.location.reload()}
          className="w-8 h-8 rounded-lg flex items-center justify-center font-black text-lg cursor-pointer hover:scale-110 active:scale-95 transition-all"
          style={{ backgroundColor: theme.primaryColor }}
          title="Làm mới trang"
        >
          C
        </div>
        <span className="text-base md:text-xl font-display font-black tracking-tighter uppercase hidden xs:block">
          CineSync
        </span>
        <button 
          onClick={onBackTo3D}
          className="ml-4 px-3 py-1.5 rounded-full bg-transparent border border-white/10 text-[10px] font-bold uppercase tracking-widest hover:bg-white/10 transition-all flex items-center gap-2"
        >
          🚀 Vũ trụ 3D
        </button>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4">
        {/* Search — expandable on hover */}
        <div 
          ref={searchContainerRef} 
          className="relative flex items-center"
          onMouseEnter={() => setIsSearchOpen(true)}
          onMouseLeave={() => {
            if (!query) setIsSearchOpen(false);
          }}
        >
          <div
            className={`flex items-center overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] rounded-full border ${
              isSearchOpen 
                ? 'w-72 sm:w-96 bg-white/5 backdrop-blur-sm border-white/15' 
                : 'w-9 bg-transparent border-transparent'
            }`}
          >
            <button 
              className="p-2 hover:bg-white/10 rounded-full transition-colors flex-shrink-0"
            >
              <Search size={20} />
            </button>
            
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Tìm kiếm phim..."
              value={query}
              className={`bg-transparent outline-none text-sm text-white placeholder-zinc-500 transition-all duration-500 ${
                isSearchOpen ? 'w-full pr-4 opacity-100' : 'w-0 opacity-0'
              }`}
              onChange={(e) => {
                setQuery(e.target.value);
                onSearch?.(e.target.value);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Escape') {
                  setIsSearchOpen(false);
                  setQuery('');
                  onSearch?.('');
                }
              }}
            />
          </div>

          {/* Dropdown kết quả tìm kiếm */}
          {isSearchOpen && searchResults.length > 0 && (
            <div className="absolute top-full right-0 mt-2 w-72 sm:w-96 bg-zinc-900/95 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl shadow-black/60 overflow-hidden max-h-[400px] overflow-y-auto">
              <div className="p-3 border-b border-white/5">
                <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500">
                  {searchResults.length} kết quả
                </span>
              </div>
              {searchResults.map((movie) => (
                <div
                  key={movie.id}
                  onClick={() => handleSelectMovie(movie)}
                  className="flex items-center gap-3 p-3 hover:bg-white/5 transition-colors cursor-pointer group"
                >
                  {/* Poster nhỏ */}
                  <div className="w-12 h-16 rounded-lg overflow-hidden flex-shrink-0 border border-white/5">
                    <img src={movie.posterUrl} alt={movie.title} className="w-full h-full object-cover" />
                  </div>
                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-display font-bold truncate group-hover:text-white transition-colors">{movie.title}</p>
                    <div className="flex items-center gap-2 text-[10px] text-zinc-500 font-mono mt-1">
                      <span>{movie.year}</span>
                      <span>•</span>
                      <span>{movie.duration}</span>
                      <span>•</span>
                      <span className="flex items-center gap-0.5">
                        <Star size={10} className="text-yellow-500 fill-current" />
                        {movie.rating}
                      </span>
                    </div>
                  </div>
                  {/* Play icon */}
                  <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                    <Play size={12} className="fill-white text-white ml-0.5" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Thông báo không tìm thấy */}
          {isSearchOpen && query.length > 0 && searchResults.length === 0 && (
            <div className="absolute top-full right-0 mt-2 w-72 sm:w-96 bg-zinc-900/95 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl shadow-black/60 p-6 text-center">
              <Search size={24} className="text-zinc-600 mx-auto mb-3" />
              <p className="text-sm text-zinc-500">Không tìm thấy phim nào</p>
              <p className="text-[10px] text-zinc-700 font-mono mt-1">Thử từ khóa khác nhé</p>
            </div>
          )}
        </div>

        {/* Notifications */}
        <div className="relative group">
          <button className="p-2 hover:bg-white/10 rounded-full transition-colors relative">
            <Bell size={20} />
            {/* Chấm đỏ báo có thông báo mới */}
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 border-2 border-zinc-900" />
            )}
          </button>
          
          {/* Notifications Dropdown */}
          <div className="absolute right-0 top-full pt-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform origin-top-right scale-95 group-hover:scale-100 z-50">
            <div className="w-80 sm:w-96 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl shadow-black/50 flex flex-col">
              {/* Header */}
              <div className="p-4 border-b border-white/5 flex items-center justify-between bg-white/5">
                <h3 className="font-bold text-sm">
                  Thông báo {unreadCount > 0 && <span className="ml-1 text-[10px] bg-red-500 px-1.5 py-0.5 rounded-full">{unreadCount}</span>}
                </h3>
                {unreadCount > 0 && (
                  <span 
                    onClick={markAllAsRead}
                    className="text-[10px] uppercase tracking-widest text-zinc-400 font-mono cursor-pointer hover:text-white transition-colors"
                  >
                    Đánh dấu đã đọc
                  </span>
                )}
              </div>
              
              {/* Danh sách thông báo */}
              <div className="flex flex-col max-h-[350px] overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-8 text-center text-zinc-500 text-sm">Không có thông báo nào</div>
                ) : (
                  notifications.map(notif => (
                    <div 
                      key={notif.id}
                      onClick={() => markAsRead(notif.id)}
                      className={`group/item p-4 flex gap-4 hover:bg-white/5 transition-colors cursor-pointer border-b border-white/5 relative ${notif.read ? 'opacity-60' : ''}`}
                    >
                      {!notif.read && <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-blue-500" />}
                      
                      {/* Icon / Image theo loại */}
                      {notif.type === 'movie' && (
                        <div className="w-12 h-16 rounded-md overflow-hidden flex-shrink-0 shadow-lg border border-white/5">
                          <img src={notif.image} alt="Poster" className="w-full h-full object-cover" />
                        </div>
                      )}
                      {notif.type === 'suggestion' && (
                        <div className="w-12 h-12 rounded-full bg-yellow-500/10 text-yellow-500 flex items-center justify-center flex-shrink-0 border border-yellow-500/20">
                          <Star size={16} className="fill-current" />
                        </div>
                      )}
                      {notif.type === 'system' && (
                        <div className="w-12 h-12 rounded-full bg-zinc-800 text-zinc-400 flex items-center justify-center flex-shrink-0">
                          <Settings size={16} />
                        </div>
                      )}

                      {/* Nội dung */}
                      <div className="flex-1">
                        <p className="text-xs text-white/80 leading-relaxed">
                          {notif.type === 'movie' ? (
                            <>Phim <span className="font-bold text-white">{notif.title}</span> {notif.message.replace('Phim bạn đang theo dõi ', '')}</>
                          ) : (
                            notif.message
                          )}
                        </p>
                        <p className={`text-[10px] font-mono mt-2 ${notif.read ? 'text-zinc-500' : 'text-blue-400'}`}>
                          {notif.time}
                        </p>
                      </div>
                      
                      {/* Xóa thông báo (hiện khi hover) */}
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setNotifications(prev => prev.filter(n => n.id !== notif.id));
                        }}
                        className="opacity-0 group-hover/item:opacity-100 hover:text-red-400 absolute right-4 top-4 text-zinc-500 transition-colors"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))
                )}
              </div>

              {/* Footer */}
              <div className="p-3 border-t border-white/5 text-center bg-black/20 hover:bg-white/5 transition-colors cursor-pointer">
                <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Xem tất cả</span>
              </div>
            </div>
          </div>
        </div>
        <button 
          onClick={onOpenSettings}
          className="p-2 hover:bg-white/10 rounded-full transition-colors"
        >
          <Settings size={20} />
        </button>
        {/* Auth & Profile */}
        <div className="flex items-center gap-3">
          {!userName ? (
            <button 
              onClick={onOpenLogin}
              className="px-4 py-1.5 rounded-full bg-white/10 border border-white/20 hover:bg-white/20 text-[10px] font-bold uppercase tracking-widest transition-all hover:scale-105 active:scale-95"
            >
              Sign In
            </button>
          ) : (
            <div className="flex flex-col items-end mr-1">
              <span className="text-[9px] text-zinc-500 uppercase tracking-widest font-bold">Hello,</span>
              <span className="text-xs font-black text-white">{userName}</span>
            </div>
          )}
          
          <button 
            onClick={onOpenAvatarSelector}
            className="w-9 h-9 rounded-full bg-zinc-800 border border-white/10 flex items-center justify-center overflow-hidden hover:border-primary-500/50 transition-colors"
          >
            {userAvatar ? (
              <img src={userAvatar} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <User size={18} className="text-zinc-400" />
            )}
          </button>
        </div>
      </div>
    </nav>
  );
};
