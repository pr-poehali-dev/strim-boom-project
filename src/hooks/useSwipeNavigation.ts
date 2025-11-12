import { useCallback, useEffect, useRef, useState } from 'react';

interface SwipeNavigationOptions {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  threshold?: number;
  enabled?: boolean;
}

export const useSwipeNavigation = ({
  onSwipeLeft,
  onSwipeRight,
  threshold = 50,
  enabled = true
}: SwipeNavigationOptions) => {
  const touchStartX = useRef<number>(0);
  const touchStartY = useRef<number>(0);
  const [isSwiping, setIsSwiping] = useState(false);
  const [swipeDistance, setSwipeDistance] = useState(0);

  const handleTouchStart = useCallback((e: TouchEvent) => {
    if (!enabled) return;
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    setIsSwiping(true);
  }, [enabled]);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!enabled || !isSwiping) return;
    
    const touchCurrentX = e.touches[0].clientX;
    const touchCurrentY = e.touches[0].clientY;
    const diffX = touchCurrentX - touchStartX.current;
    const diffY = touchCurrentY - touchStartY.current;
    
    if (Math.abs(diffX) > Math.abs(diffY)) {
      e.preventDefault();
      setSwipeDistance(diffX);
    }
  }, [enabled, isSwiping]);

  const handleTouchEnd = useCallback(() => {
    if (!enabled || !isSwiping) return;
    
    if (swipeDistance > threshold && onSwipeRight) {
      onSwipeRight();
    } else if (swipeDistance < -threshold && onSwipeLeft) {
      onSwipeLeft();
    }
    
    setIsSwiping(false);
    setSwipeDistance(0);
    touchStartX.current = 0;
    touchStartY.current = 0;
  }, [enabled, isSwiping, swipeDistance, threshold, onSwipeLeft, onSwipeRight]);

  useEffect(() => {
    if (!enabled) return;

    document.addEventListener('touchstart', handleTouchStart, { passive: false });
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleTouchEnd);

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [enabled, handleTouchStart, handleTouchMove, handleTouchEnd]);

  return {
    isSwiping,
    swipeDistance
  };
};
