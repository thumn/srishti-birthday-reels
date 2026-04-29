import React, { useEffect, useRef, useState } from "react";
import "./App.css";
import VideoItem from "./components/video_item";
import videoData from "./videos.json";

function App() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const observerRef = useRef(null);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = parseInt(entry.target.getAttribute("data-index"), 10);

            if (!isNaN(index)) {
              setActiveIndex(index);
            }
          }
        });
      },
      {
        threshold: 0.6,
        rootMargin: "0px",
      },
    );

    const elements = document.querySelectorAll(".video-wrapper");
    elements.forEach((el) => observerRef.current.observe(el));

    return () => {
      if (observerRef.current) observerRef.current.disconnect();
    };
  }, []); // Note: If videoData is fetched dynamically, add [videoData.length] here

  return (
    <div className="reels-container">
      <div className="top-banner" aria-hidden="true">
        Srishtigram Reels
      </div>
      {videoData.map((video, index) => {
        const isActive = activeIndex === index;
        const shouldLoad = Math.abs(index - activeIndex) <= 1;

        return (
          <div key={video.id} className="video-wrapper" data-index={index}>
            <VideoItem
              url={shouldLoad ? video.url : null}
              isActive={isActive}
              isMuted={isMuted}
              setIsMuted={setIsMuted}
              isFirst={index === 0}
            />
          </div>
        );
      })}
    </div>
  );
}

export default App;
