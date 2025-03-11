import { useState, useEffect } from 'react';

export type DeviceType = 'mobile' | 'tablet' | 'desktop';

export function useDeviceType() {
  const [deviceType, setDeviceType] = useState<DeviceType>(
    typeof window !== 'undefined' 
      ? window.innerWidth < 480 
        ? 'mobile' 
        : window.innerWidth < 768 
          ? 'tablet' 
          : 'desktop'
      : 'desktop'
  );

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleResize = () => {
      if (window.innerWidth < 480) {
        setDeviceType('mobile');
      } else if (window.innerWidth < 768) {
        setDeviceType('tablet');
      } else {
        setDeviceType('desktop');
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return deviceType;
}
