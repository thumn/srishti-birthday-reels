import React, { useState } from 'react';
import './App.css';
import VideoItem from './VideoItem';
import videoData from './videos.json';

function App() {
  const [isMuted, setIsMuted] = useState(true);

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  return (
    <div className="reels-container">
      {/* Global Mute Button */}
      <button className="mute-floating-button" onClick={toggleMute}>
        {isMuted ? "🔇 Tap for Sound" : "🔊 Audio On"}
      </button>

      {videoData.map((video, index) => (
        <VideoItem 
          key={video.id} 
          url={video.url} 
          isMuted={isMuted} // Pass the global state down
          isLast={index === videoData.length - 1} 
        />
      ))}
    </div>
  );
}

export default App;