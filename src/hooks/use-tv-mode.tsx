
import { useState, useEffect } from 'react';

export function useTVMode() {
  const [isTVMode, setIsTVMode] = useState(false);

  useEffect(() => {
    const checkTVMode = () => {
      // Screen wider than 1920px is likely a large TV
      setIsTVMode(window.innerWidth >= 1920);
    };
    
    checkTVMode();
    window.addEventListener('resize', checkTVMode);
    
    return () => window.removeEventListener('resize', checkTVMode);
  }, []);

  return isTVMode;
}
