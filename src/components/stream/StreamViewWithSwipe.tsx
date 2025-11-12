import { memo, useState, useCallback, useEffect } from 'react';
import { StreamView } from './StreamView';
import { Stream } from '@/components/types';
import { useSwipeNavigation } from '@/hooks/useSwipeNavigation';

interface StreamViewWithSwipeProps {
  stream: Stream;
  allStreams: Stream[];
  userBoombucks: number;
  setUserBoombucks: (amount: number | ((prev: number) => number)) => void;
  isStreamer: boolean;
  onClose: () => void;
}

export const StreamViewWithSwipe = memo(({
  stream: initialStream,
  allStreams,
  userBoombucks,
  setUserBoombucks,
  isStreamer,
  onClose
}: StreamViewWithSwipeProps) => {
  const [currentIndex, setCurrentIndex] = useState(() => 
    allStreams.findIndex(s => s.id === initialStream.id)
  );
  
  const currentStream = allStreams[currentIndex] || initialStream;

  const handleSwipeLeft = useCallback(() => {
    if (currentIndex < allStreams.length - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  }, [currentIndex, allStreams.length]);

  const handleSwipeRight = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  }, [currentIndex]);

  const { isSwiping, swipeDistance } = useSwipeNavigation({
    onSwipeLeft: handleSwipeLeft,
    onSwipeRight: handleSwipeRight,
    threshold: 100,
    enabled: true
  });

  return (
    <div 
      className="relative transition-transform duration-300"
      style={{ 
        transform: isSwiping ? `translateX(${swipeDistance}px)` : 'none',
        opacity: isSwiping ? Math.max(0.7, 1 - Math.abs(swipeDistance) / 500) : 1
      }}
    >
      <StreamView
        stream={currentStream}
        userBoombucks={userBoombucks}
        setUserBoombucks={setUserBoombucks}
        isStreamer={isStreamer}
        onClose={onClose}
      />
      
      {isSwiping && swipeDistance > 50 && currentIndex > 0 && (
        <div className="absolute top-1/2 left-8 -translate-y-1/2 bg-primary/20 backdrop-blur-xl rounded-full p-4 animate-fade-in">
          <svg className="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </div>
      )}
      
      {isSwiping && swipeDistance < -50 && currentIndex < allStreams.length - 1 && (
        <div className="absolute top-1/2 right-8 -translate-y-1/2 bg-primary/20 backdrop-blur-xl rounded-full p-4 animate-fade-in">
          <svg className="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      )}

      <div className="fixed bottom-24 left-0 right-0 flex justify-center gap-1.5 pointer-events-none z-50">
        {allStreams.map((_, index) => (
          <div
            key={index}
            className={`h-1 rounded-full transition-all duration-300 ${
              index === currentIndex 
                ? 'w-8 bg-primary' 
                : 'w-1 bg-white/30'
            }`}
          />
        ))}
      </div>
    </div>
  );
});

StreamViewWithSwipe.displayName = 'StreamViewWithSwipe';
