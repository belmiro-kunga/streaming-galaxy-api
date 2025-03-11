import React, { useEffect, useRef, useState } from 'react';
import ReactPlayer from 'react-player';

export const BackgroundAudio = () => {
  const playerRef = useRef<ReactPlayer>(null);
  const [isReady, setIsReady] = useState(false);

  const handleReady = () => {
    setIsReady(true);
  };

  const handleError = (error: any) => {
    console.error('Erro ao carregar o áudio:', error);
  };

  return (
    <div style={{ display: 'none' }}>
      <ReactPlayer
        ref={playerRef}
        url="https://www.youtube.com/watch?v=9KZyUQpihsE"
        playing={isReady}
        loop={true}
        volume={0.5}
        width="0"
        height="0"
        onReady={handleReady}
        onError={handleError}
        config={{
          youtube: {
            playerVars: {
              autoplay: 1,
              controls: 0,
              disablekb: 1,
              fs: 0,
              iv_load_policy: 3,
              modestbranding: 1,
              playsinline: 1,
            },
          },
        }}
      />
    </div>
  );
}; 