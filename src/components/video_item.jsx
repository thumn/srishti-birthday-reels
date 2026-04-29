import React, { useEffect, useRef, useState } from "react";

const VideoItem = ({ url, isMuted, setIsMuted, isFirst, isActive }) => {
  const videoRef = useRef(null);
  // For the first reel: start paused until the user taps play.
  const userPausedRef = useRef(!!isFirst);
  const [isPlaying, setIsPlaying] = useState(false);

  // Sync playback with the 'isActive' prop sent from App.jsx
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !url) return;

    if (isActive) {
      // If it's the active video and user hasn't manually paused
      if (!userPausedRef.current) {
        video
          .play()
          .then(() => setIsPlaying(true))
          .catch((err) => console.log("Autoplay blocked:", err));
      }
    } else {
      // If it's not active, pause it
      video.pause();
      setIsPlaying(false);
      // Reset userPaused when scrolling away so it's fresh if they scroll back
      userPausedRef.current = false;
    }
  }, [isActive, url]); // Re-run when isActive or the URL changes

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
      if (typeof setIsMuted === "function") setIsMuted(false);
      video
        .play()
        .then(() => setIsPlaying(true))
        .catch((error) => {
          userPausedRef.current = true;
          if (typeof setIsMuted === "function") setIsMuted(true);
          console.log("Play prevented:", error);
        });
    } else {
      userPausedRef.current = true;
      video.pause();
      if (typeof setIsMuted === "function") setIsMuted(true);
      setIsPlaying(false);
    }
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    video.addEventListener("play", handlePlay);
    video.addEventListener("pause", handlePause);

    return () => {
      video.removeEventListener("play", handlePlay);
      video.removeEventListener("pause", handlePause);
    };
  }, []);

  // If there's no URL, don't even render the <video> tag.
  // This physically prevents the browser from making a network request.
  if (!url) {
    return (
      <div className="video-section placeholder">
        <div className="spinner">Loading...</div>
      </div>
    );
  }

  return (
    <div
      key={url} // This "key" forces the video element to re-mount when the URL changes
      className="video-section"
      role="button"
      tabIndex={0}
      onClick={togglePlayPauseAndAudio}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          togglePlayPauseAndAudio();
        }
      }}
    >
      <video
        ref={videoRef}
        className="video-player"
        src={`${url}#t=0.1`}
        loop
        playsInline
        muted={isMuted} // Controlled by the parent state
        preload="auto"
      />

      {!isPlaying && isActive && (
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
