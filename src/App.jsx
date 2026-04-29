import React, { useState } from 'react';
import './App.css';
import VideoItem from './components/video_item';
import videoData from './videos.json';

function App() {
  const [isMuted, setIsMuted] = useState(true);

  return (
    <div className="reels-container">
      {videoData.map((video, index) => (
        <VideoItem 
          key={video.id} 
          url={video.url} 
          isMuted={isMuted} // Pass the global state down
          setIsMuted={setIsMuted}
          isFirst={index === 0}
          isLast={index === videoData.length - 1} 
        />
      ))}
    </div>
  );
}

export default App;