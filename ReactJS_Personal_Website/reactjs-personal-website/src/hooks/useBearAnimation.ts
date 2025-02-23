// This file contains the logic for animating the bear images based on the user's input in the email and password fields...
// Reversing images from moving to password field to email field, and vice versa... and all...


import { useState, useEffect, useRef } from 'react';

type InputFocus = 'EMAIL' | 'PASSWORD';

interface UseBearAnimationProps {
  watchBearImages: string[];
  hideBearImages: string[];
  peakBearImages: string[];
  emailLength: number;
  showPassword: boolean;
}

export function useBearAnimation({
  watchBearImages,
  hideBearImages,
  peakBearImages,
  emailLength,
  showPassword,
}: UseBearAnimationProps) {
  const [currentFocus, setCurrentFocus] = useState<InputFocus>('EMAIL');
  const [currentBearImage, setCurrentBearImage] = useState<string | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  const prevFocus = useRef(currentFocus);     // useRef is used to keep track of the previous focus state...
  const prevShowPassword = useRef(showPassword);    // useRef is used to keep track of the previous showPassword state...
  const timeouts = useRef<number[]>([]);

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => timeouts.current.forEach(clearTimeout);
  }, []);


  // --------------------------------  useEffect starts here --------------------------------
  useEffect(() => {
    // Clear existing timeouts
    timeouts.current.forEach(clearTimeout);
    timeouts.current = [];


    const animateImages = (
      images: string[],
      interval: number,
      reverse = false,
      onComplete?: () => void,
    ) => {
      if (images.length === 0) {
        onComplete?.();
        return;
      }

      setIsAnimating(true);
      const imageSequence = reverse ? [...images].reverse() : images;

      imageSequence.forEach((img, index) => {
        const timeoutId = setTimeout(() => {
          setCurrentBearImage(img);
          if (index === imageSequence.length - 1) {  // Last image is already set now, so we can stop animating...
            setIsAnimating(false);
            onComplete?.();
          }
        }, index * interval);  // This is progressive loading, that gives a nice animation effect... If we remove "index *", it will load all images at once...
        // 0	img1.png	0 * 100 = 0ms	  Displays img1.png immediately
        // 1	img2.png	1 * 100 = 100ms	After 100ms, displays img2.png
        // 2	img3.png	2 * 100 = 200ms	After 200ms, displays img3.png, ends animation

        timeouts.current.push(timeoutId);
      });
    };


    // For password input, animate through hide bear images
    // This is for the bear watching on each key press in the email field...
    const animateWatchingBearImages = () => {
      const progress = Math.min(emailLength / 30, 1); // will be always from 0 to 1.

      const index = Math.min(
        Math.floor(progress * (watchBearImages.length - 1)), // whole number between [0, 20] 
        watchBearImages.length - 1,
      ); // This min prevents index from exceeding the available images... (Just to double check...)

      setCurrentBearImage(watchBearImages[Math.max(0, index)]);
      setIsAnimating(false);
    };


    // Animation Logic based on Focus and ShowPassword
    if (currentFocus === 'EMAIL') {
      if (prevFocus.current === 'PASSWORD') {
        // Reverse hideBearImages when moving from PASSWORD to EMAIL  0,1,2,3,4,5 --> 5,4,3,2,1,0
        animateImages(hideBearImages, 60, true, animateWatchingBearImages);
      } else {
        animateWatchingBearImages();
      }
    } else if (currentFocus === 'PASSWORD') {
      if (prevFocus.current !== 'PASSWORD') {
        // First time entering password field
        animateImages(hideBearImages, 40, false, () => {        // eyes will be closed at index 5, so no need to reverse the images sequence... (Open to Close)
          if (showPassword) {
            animateImages(peakBearImages, 50);                  // peeking at index 3, so no need to reverse the images sequence here as well...
          }
        });
      } else if (showPassword && prevShowPassword.current === false) {
        // Show password selected
        animateImages(peakBearImages, 50);
      } else if (!showPassword && prevShowPassword.current === true) {
        // Hide password selected
        animateImages(peakBearImages, 50, true);                // reverse from 3 to 0 , as we're closing the eyes...
      }
    }

    prevFocus.current = currentFocus;
    prevShowPassword.current = showPassword;

  }, [
    currentFocus,
    showPassword,
    emailLength,
    watchBearImages,
    hideBearImages,
    peakBearImages,
  ]);  

  // ---------------------------------  useEffect ends here ------------------------------



  return {
    currentFocus,
    setCurrentFocus,
    currentBearImage:
      currentBearImage ?? (watchBearImages.length > 0 ? watchBearImages[0] : null),
    isAnimating,
  };


}
