import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';

const PremiumVideoModal = ({ video, onClose }) => {
  const [isVertical, setIsVertical] = useState(false);
  const [embedUrl, setEmbedUrl] = useState('');

  // Lock body scroll when modal is open
  useEffect(() => {
    if (video) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [video]);

  useEffect(() => {
    if (!video) return;

    let url = video.videoUrl || '';
    let source = video.videoSource || 'url';
    let vertical = false;

    // Detect Vertical Videos
    if (
      source === 'instagram' ||
      source === 'youtube_shorts' ||
      url.includes('/reel/') ||
      url.includes('/shorts/') ||
      url.includes('/p/') && url.includes('instagram.com')
    ) {
      vertical = true;
    }
    setIsVertical(vertical);

    // Format Embed URLs
    if (source === 'instagram' || url.includes('instagram.com')) {
      const match = url.match(/(?:p|reel|tv)\/([A-Za-z0-9_-]+)/);
      if (match) {
        setEmbedUrl(`https://www.instagram.com/p/${match[1]}/embed/`);
      } else {
        setEmbedUrl(url);
      }
    } else if (source === 'youtube_shorts' || url.includes('youtube.com/shorts/')) {
      const match = url.match(/shorts\/([A-Za-z0-9_-]+)/);
      if (match) {
        setEmbedUrl(`https://www.youtube.com/embed/${match[1]}?autoplay=1&controls=0&modestbranding=1&rel=0&playsinline=1`);
      } else {
        setEmbedUrl(url);
      }
    } else if (source === 'youtube' || url.includes('youtube.com/watch') || url.includes('youtu.be/')) {
      const match = url.match(/(?:v=|youtu\.be\/)([^&]+)/);
      if (match) {
        setEmbedUrl(`https://www.youtube.com/embed/${match[1]}?autoplay=1&rel=0`);
      } else {
        setEmbedUrl(url);
      }
    } else if (source === 'vimeo' || url.includes('vimeo.com/')) {
      const match = url.match(/vimeo\.com\/(\d+)/);
      if (match) {
        setEmbedUrl(`https://player.vimeo.com/video/${match[1]}?autoplay=1`);
      } else {
        setEmbedUrl(url);
      }
    } else {
      setEmbedUrl(url);
    }
  }, [video]);

  if (!video) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-xl animate-in fade-in zoom-in duration-300">
      {/* Close Button */}
      <button 
        onClick={onClose} 
        className="absolute top-4 right-4 md:top-8 md:right-8 z-50 text-white/50 hover:text-white transition-colors bg-black/50 p-2 rounded-full backdrop-blur-md"
      >
        <X className="w-6 h-6 md:w-8 md:h-8" />
      </button>

      {/* Video Container */}
      {isVertical ? (
        // VERTICAL REEL PLAYER (Instagram/Shorts style)
        <div className="w-full h-[100dvh] md:h-auto md:w-[380px] md:aspect-[9/16] bg-black md:rounded-2xl overflow-hidden shadow-2xl relative mx-auto flex flex-col justify-center">
          {video.videoSource === 'upload' || video.videoSource === 'url' ? (
            <video 
              src={embedUrl} 
              autoPlay 
              controls={false}
              playsInline
              loop
              className="w-full h-full object-cover"
            />
          ) : (
            <iframe 
              className="w-full h-full bg-black border-none" 
              src={embedUrl} 
              title={video.title} 
              frameBorder="0" 
              scrolling="no"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowFullScreen
            />
          )}

          {/* Fallback Custom Cinematic Overlay for raw uploads */}
          {(video.videoSource === 'upload' || video.videoSource === 'url') && (
            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none">
              <h3 className="text-white text-lg font-bold drop-shadow-md mb-1">{video.title}</h3>
              {video.category && (
                <span className="text-[#ea580c] text-xs uppercase tracking-widest font-bold drop-shadow-md">
                  {video.category}
                </span>
              )}
            </div>
          )}
        </div>
      ) : (
        // LANDSCAPE CINEMATIC PLAYER (Default)
        <div className="w-full max-w-6xl aspect-[16/9] bg-black md:rounded-2xl overflow-hidden shadow-2xl relative mx-4 flex flex-col justify-center">
          {video.videoSource === 'upload' || video.videoSource === 'url' ? (
            <video 
              src={embedUrl} 
              autoPlay 
              controls 
              className="w-full h-full object-contain"
            />
          ) : (
            <iframe 
              className="w-full h-full bg-black border-none" 
              src={embedUrl} 
              title={video.title} 
              frameBorder="0" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowFullScreen
            />
          )}
        </div>
      )}
    </div>
  );
};

export default PremiumVideoModal;
