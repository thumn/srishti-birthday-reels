import React, { useEffect, useRef, useState } from 'react';

const VideoItem = ({ url, isLast, isMuted, setIsMuted, isFirst }) => {
  const videoRef = useRef(null);
  // For the first reel: start paused until the user taps play.
  const userPausedRef = useRef(!!isFirst);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    if (!isFirst) return;
    const video = videoRef.current;
    if (!video) return;
    userPausedRef.current = true;
    video.pause();
    setIsPlaying(false);
  }, [isFirst]);

  const togglePlayPauseAndAudio = () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      userPausedRef.current = false;
      if (typeof setIsMuted === 'function') setIsMuted(false);
      video
        .play()
        .then(() => setIsPlaying(true))
        .catch((error) => {
          userPausedRef.current = true;
          if (typeof setIsMuted === 'function') setIsMuted(true);
          console.log('Play prevented:', error);
        });
    } else {
      userPausedRef.current = true;
      video.pause();
      if (typeof setIsMuted === 'function') setIsMuted(true);
      setIsPlaying(false);
    }
  };

  useEffect(() => {
    // Lower threshold makes autoplay trigger more consistently inside scroll containers.
    const options = { threshold: 0.2 };
    const callback = (entries) => {
      entries.forEach((entry) => {
        const video = videoRef.current;
        if (!video) return;

        if (entry.isIntersecting) {
          setIsInView(true);
          if (!userPausedRef.current) {
            video
              .play()
              .then(() => {
                setIsPlaying(true);
              })
              .catch((error) => {
                // If the browser blocks autoplay, the overlay will remain.
                console.log('Autoplay prevented:', error);
              });
          } else {
            video.pause();
            setIsPlaying(false);
          }
        } else {
          setIsInView(false);
          video.pause();
          setIsPlaying(false);
        }
      });
    };

    // Use the scroll container as the IntersectionObserver root so autoplay triggers
    // consistently when scrolling inside `.reels-container`.
    const root = document.querySelector('.reels-container');
    const observer = new IntersectionObserver(callback, { ...options, root });
    if (videoRef.current) observer.observe(videoRef.current);

    return () => {
      if (videoRef.current) observer.unobserve(videoRef.current);
    };
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);

    return () => {
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
    };
  }, []);

  if (!url) return null;

  return (
    <div
      key={url} // This "key" forces the video element to re-mount when the URL changes
      className="video-section"
      role="button"
      tabIndex={0}
      onClick={togglePlayPauseAndAudio}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          togglePlayPauseAndAudio();
        }
      }}
    >
      <video
        ref={videoRef}
        className="video-player"
        src={url}
        loop
        playsInline
        muted={isMuted} // Controlled by the parent state
        preload="auto"
      />

      {!isPlaying && isInView && (
        <button
          type="button"
          className="play-overlay-button"
          aria-label="Play video"
          onClick={(e) => {
            // Prevent triggering the parent click handler twice.
            e.stopPropagation();
            togglePlayPauseAndAudio();
          }}
        >
          ▶
        </button>
      )}
    </div>
  );
};

export default VideoItem;