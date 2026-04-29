import React, { useEffect, useRef } from 'react';

const VideoItem = ({ url, isLast, isMuted }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    const options = { threshold: 0.6 };
    const callback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          videoRef.current.play().catch(error => {
            // This catches the error if the browser still blocks it
            console.log("Autoplay prevented:", error);
          });
        } else {
          videoRef.current.pause();
        }
      });
    };

    const observer = new IntersectionObserver(callback, options);
    if (videoRef.current) observer.observe(videoRef.current);

    return () => {
      if (videoRef.current) observer.unobserve(videoRef.current);
    };
  }, []);

  return (
    <div className="video-section">
      <video
        ref={videoRef}
        className="video-player"
        src={url}
        loop
        playsInline
        muted={isMuted} // Controlled by the parent state
        preload="auto"
      />
      
      {isLast && (
        <div className="last-video-overlay">
          That's the last one, happy birthday! 🎂
        </div>
      )}
    </div>
  );
};

export default VideoItem;