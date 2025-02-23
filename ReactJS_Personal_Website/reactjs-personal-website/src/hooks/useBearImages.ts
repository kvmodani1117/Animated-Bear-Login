// In this File, we're just sorting the images and are returning 3 arrays of strings for:
// 1. watchBearImages -> ["watch_bear_1" , "watch_bear_2", "", ...]
// 2. hideBearImages  -> ["hide_bear_1" , "hide_bear_2", "", ...]
// 3. peakBearImages  -> ["peak_bear_1" , "peak_bear_2", "", ...]

import { useState, useEffect } from 'react';

interface BearImages {
  watchBearImages: string[];
  hideBearImages: string[];
  peakBearImages: string[];
}

export function useBearImages(): BearImages {
  const [watchBearImages, setWatchBearImages] = useState<string[]>([]);
  const [hideBearImages, setHideBearImages] = useState<string[]>([]);
  const [peakBearImages, setPeakBearImages] = useState<string[]>([]);

  useEffect(() => {
    type ImageModule = { default: string };
    
    const watchImages = import.meta.glob<ImageModule>("/src/assets/img/watch_bear_*.png", { eager: true });
    const hideImages = import.meta.glob<ImageModule>("/src/assets/img/hide_bear_*.png", { eager: true });
    const peakImages = import.meta.glob<ImageModule>("/src/assets/img/peak_bear_*.png", { eager: true });

    const sortImages = (images: Record<string, ImageModule>) => {
      console.log('images----->', Object.values(images).map(img => img.default));
      return Object.values(images)
        .map(img => img.default)
        .sort((a, b) => {
          const aNum = parseInt(a.match(/\d+/)?.[0] || "0");
          const bNum = parseInt(b.match(/\d+/)?.[0] || "0");
          return aNum - bNum;
        });
    };

    setWatchBearImages(sortImages(watchImages));
    setHideBearImages(sortImages(hideImages));
    setPeakBearImages(sortImages(peakImages));
  }, []);

  return {
    watchBearImages,
    hideBearImages,
    peakBearImages  
  };
}
