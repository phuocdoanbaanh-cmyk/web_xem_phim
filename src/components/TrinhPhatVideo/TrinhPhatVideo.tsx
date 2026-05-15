import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize, Minimize, ArrowLeft } from 'lucide-react';
import ElasticSlider from './ElasticSlider';
import Hls from 'hls.js'; // ĐÃ THÊM: Import thư viện hls.js
import './TrinhPhatVideo.css';

interface TrinhPhatVideoProps {
  videoUrl: string;
  title: string;
  onClose: () => void;
}

export const TrinhPhatVideo: React.FC<TrinhPhatVideoProps> = ({ videoUrl, title, onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [showCenterIcon, setShowCenterIcon] = useState(false);
  
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-hide controls
  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) {
        setShowControls(false);
      }
    }, 3000);
  };

  useEffect(() => {
    handleMouseMove();
    return () => {
      if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    };
  }, [isPlaying]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isFullscreen) {
        onClose();
      } else if (e.key === ' ' || e.key === 'k') {
        e.preventDefault();
        togglePlay();
      } else if (e.key === 'f') {
        toggleFullscreen();
      } else if (e.key === 'm') {
        toggleMute();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen]);

  // ĐÃ THÊM: useEffect để khởi tạo HLS.js
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !videoUrl) return;

    let hls: Hls;

    // Chỉ dùng hls.js nếu URL là m3u8
    if (videoUrl.includes('.m3u8')) {
      if (Hls.isSupported()) {
        hls = new Hls();
        hls.loadSource(videoUrl);
        hls.attachMedia(video);
        
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          video.play().catch(e => console.log('Auto-play blocked:', e));
        });
      } 
      // Fallback cho Safari (tự hỗ trợ m3u8 mà không cần hls.js)
      else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = videoUrl;
      }
    }

    return () => {
      if (hls) {
        hls.destroy();
      }
    };
  }, [videoUrl]);

  // Video events
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        const playPromise = videoRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch((error) => {
            console.error("Video playback failed:", error);
            // This happens if the source is 404 or not supported
          });
        }
      }
      setIsPlaying(!isPlaying);
      
      // Show center animation
      setShowCenterIcon(true);
      setTimeout(() => setShowCenterIcon(false), 500);
    }
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (videoRef.current) {
      const bounds = e.currentTarget.getBoundingClientRect();
      const percent = (e.clientX - bounds.left) / bounds.width;
      videoRef.current.currentTime = percent * duration;
    }
  };

  const handleVolumeClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (videoRef.current) {
      const bounds = e.currentTarget.getBoundingClientRect();
      const percent = Math.max(0, Math.min(1, (e.clientX - bounds.left) / bounds.width));
      setVolume(percent);
      videoRef.current.volume = percent;
      setIsMuted(percent === 0);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      const newMuted = !isMuted;
      videoRef.current.muted = newMuted;
      setIsMuted(newMuted);
      if (!newMuted && volume === 0) {
        setVolume(1);
        videoRef.current.volume = 1;
      }
    }
  };

  // Lắng nghe sự kiện fullscreenchange để đồng bộ state
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
    };
  }, []);

  const toggleFullscreen = async (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    
    try {
      if (!document.fullscreenElement) {
        // Dùng document.documentElement thay vì containerRef vì position:fixed element 
        // có thể bị browser từ chối fullscreen
        const target = document.documentElement;
        if (target.requestFullscreen) {
          await target.requestFullscreen();
        } else if ((target as any).webkitRequestFullscreen) {
          (target as any).webkitRequestFullscreen();
        }
      } else {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        } else if ((document as any).webkitExitFullscreen) {
          (document as any).webkitExitFullscreen();
        }
      }
    } catch (err) {
      console.error('Fullscreen error:', err);
    }
  };

  const formatTime = (timeInSeconds: number) => {
    if (isNaN(timeInSeconds)) return "0:00";
    const m = Math.floor(timeInSeconds / 60);
    const s = Math.floor(timeInSeconds % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div 
      className="video-player-overlay" 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => isPlaying && setShowControls(false)}
    >
      <div className="video-container" onClick={togglePlay} style={{ backgroundColor: '#000' }}>
        <video
          ref={videoRef}
          // ĐÃ XÓA src={videoUrl} ở đây vì hls.js sẽ tự động bơm luồng video vào ref
          src={!videoUrl.includes('.m3u8') ? videoUrl : undefined}
          className="video-element"
          style={{ backgroundColor: '#000', width: '100%', height: '100%' }}  
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onEnded={() => setIsPlaying(false)}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          autoPlay
        />

        {/* Center Action Icon Animation */}
        <div className="center-action">
          <div className={`center-play-icon ${showCenterIcon ? 'animate' : ''}`}>
            {isPlaying ? <Play size={40} className="ml-2" /> : <Pause size={40} />}
          </div>
        </div>
      </div>

      {/* Custom Controls */}
      <div className={`video-controls ${!showControls ? 'idle' : ''}`}>
        <div className="video-header">
          <button className="btn-back" onClick={onClose} title="Go back (Esc)">
            <ArrowLeft size={24} />
          </button>
          <h2 className="video-title">{title}</h2>
        </div>

        <div className="video-bottom-bar">
          <div className="progress-container" onClick={handleProgressClick}>
            <div className="progress-filled" style={{ width: `${progressPercent}%` }}>
              <div className="progress-thumb" />
            </div>
          </div>

          <div className="controls-row">
            <div className="controls-left">
              <button className="control-btn" onClick={togglePlay}>
                {isPlaying ? <Pause size={24} /> : <Play size={24} />}
              </button>
              
              <div className="volume-container">
                <button className="control-btn" onClick={toggleMute}>
                  {isMuted || volume === 0 ? <VolumeX size={20} /> : <Volume2 size={20} />}
                </button>
                <div className="volume-slider">
                  <ElasticSlider 
                    defaultValue={isMuted ? 0 : volume * 100}
                    maxValue={100}
                    leftIcon={null}
                    rightIcon={null}
                    onChange={(val: number) => {
                      const newVol = val / 100;
                      setVolume(newVol);
                      if (videoRef.current) videoRef.current.volume = newVol;
                      setIsMuted(newVol === 0);
                    }}
                  />
                </div>
              </div>

              <div className="time-display">
                {formatTime(currentTime)} / {formatTime(duration)}
              </div>
            </div>

            <div className="controls-right">
              <button className="control-btn" onClick={(e) => toggleFullscreen(e)} title="Fullscreen (f)">
                {isFullscreen ? <Minimize size={20} /> : <Maximize size={20} />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};