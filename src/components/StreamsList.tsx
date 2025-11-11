import { memo, useMemo, useRef, useEffect, useState, useCallback } from 'react';
import { FixedSizeList } from 'react-window';
import { Stream } from './types';
import { StreamCard } from './StreamCard';

interface StreamsListProps {
  streams: Stream[];
  onStreamClick?: (stream: Stream) => void;
}

export const StreamsList = memo(({ streams: initialStreams, onStreamClick }: StreamsListProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [streams, setStreams] = useState(initialStreams);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [isNextPageLoading, setIsNextPageLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [pullStart, setPullStart] = useState(0);
  const [pullDistance, setPullDistance] = useState(0);

  useEffect(() => {
    setStreams(initialStreams);
  }, [initialStreams]);

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const width = containerRef.current.offsetWidth;
        const height = window.innerHeight - 180;
        setDimensions({ width, height });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  const handleTouchStart = useCallback((e: TouchEvent) => {
    if (containerRef.current && containerRef.current.scrollTop === 0) {
      setPullStart(e.touches[0].clientY);
    }
  }, []);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (pullStart > 0 && containerRef.current && containerRef.current.scrollTop === 0) {
      const distance = e.touches[0].clientY - pullStart;
      if (distance > 0) {
        setPullDistance(Math.min(distance, 150));
      }
    }
  }, [pullStart]);

  const handleTouchEnd = useCallback(async () => {
    if (pullDistance > 80 && !isRefreshing) {
      setIsRefreshing(true);
      
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setStreams(initialStreams);
      setHasNextPage(true);
      setIsRefreshing(false);
    }
    
    setPullStart(0);
    setPullDistance(0);
  }, [pullDistance, isRefreshing, initialStreams]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener('touchstart', handleTouchStart as any);
    container.addEventListener('touchmove', handleTouchMove as any);
    container.addEventListener('touchend', handleTouchEnd as any);

    return () => {
      container.removeEventListener('touchstart', handleTouchStart as any);
      container.removeEventListener('touchmove', handleTouchMove as any);
      container.removeEventListener('touchend', handleTouchEnd as any);
    };
  }, [handleTouchStart, handleTouchMove, handleTouchEnd]);

  const itemsPerRow = useMemo(() => {
    return dimensions.width >= 768 ? 2 : 1;
  }, [dimensions.width]);

  const loadNextPage = useCallback(async () => {
    if (isNextPageLoading) return;
    
    setIsNextPageLoading(true);
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newStreams: Stream[] = Array.from({ length: 8 }, (_, i) => ({
      id: streams.length + i + 1,
      username: `@stream_${streams.length + i + 1}`,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=stream${streams.length + i}`,
      title: `AI Стрим ${streams.length + i + 1} 🎬`,
      thumbnail: `https://images.unsplash.com/photo-${1500000000000 + (streams.length + i) * 1000000}`,
      viewers: Math.floor(Math.random() * 20000) + 1000,
      category: ['Игры', 'Музыка', 'Технологии', 'Творчество'][Math.floor(Math.random() * 4)],
      isLive: true
    }));
    
    setStreams(prev => [...prev, ...newStreams]);
    setIsNextPageLoading(false);
    
    if (streams.length > 50) {
      setHasNextPage(false);
    }
  }, [streams.length, isNextPageLoading]);

  const rowCount = useMemo(() => {
    const baseCount = Math.ceil(streams.length / itemsPerRow);
    return hasNextPage ? baseCount + 1 : baseCount;
  }, [streams.length, itemsPerRow, hasNextPage]);

  const isItemLoaded = useCallback((index: number) => {
    return !hasNextPage || index < Math.ceil(streams.length / itemsPerRow);
  }, [hasNextPage, streams.length, itemsPerRow]);

  const Row = useCallback(({ index, style }: { index: number; style: React.CSSProperties }) => {
    const startIndex = index * itemsPerRow;
    
    if (!isItemLoaded(index)) {
      return (
        <div style={style} className="flex items-center justify-center">
          <div className="text-white text-lg">Загрузка...</div>
        </div>
      );
    }
    
    const items = [];

    for (let i = 0; i < itemsPerRow; i++) {
      const streamIndex = startIndex + i;
      if (streamIndex < streams.length) {
        items.push(
          <div
            key={streams[streamIndex].id}
            style={{
              width: itemsPerRow === 2 ? '50%' : '100%',
              display: 'inline-block',
              verticalAlign: 'top'
            }}
          >
            <StreamCard 
              stream={streams[streamIndex]} 
              onClick={onStreamClick}
            />
          </div>
        );
      }
    }

    return (
      <div style={style}>
        {items}
      </div>
    );
  }, [streams, itemsPerRow, isItemLoaded]);

  const pullProgress = Math.min(pullDistance / 80, 1);

  return (
    <div ref={containerRef} className="h-full w-full pt-20 pb-24 px-4 relative overflow-y-auto">
      {pullDistance > 0 && (
        <div 
          className="absolute top-20 left-0 right-0 flex items-center justify-center z-30 transition-opacity"
          style={{ 
            opacity: pullProgress,
            transform: `translateY(${pullDistance - 80}px)`
          }}
        >
          <div className="bg-card/90 backdrop-blur-xl border border-primary/30 rounded-full p-3 shadow-lg">
            {isRefreshing ? (
              <div className="animate-spin">
                <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              </div>
            ) : (
              <svg 
                className={`w-6 h-6 text-primary transition-transform ${pullProgress >= 1 ? 'rotate-180' : ''}`}
                style={{ transform: `rotate(${pullProgress * 180}deg)` }}
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            )}
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
          <div className="w-3 h-3 bg-accent rounded-full animate-pulse-glow" />
          Прямые эфиры ({streams.length})
        </h2>
        
        {dimensions.height > 0 && (
          <FixedSizeList
            height={dimensions.height - 80}
            itemCount={rowCount}
            itemSize={380}
            width="100%"
            overscanCount={2}
            onScroll={({ scrollOffset }) => {
              const container = containerRef.current;
              if (!container) return;
              
              const scrollHeight = container.scrollHeight;
              const clientHeight = dimensions.height - 80;
              
              if (scrollHeight - scrollOffset <= clientHeight * 1.5 && !isNextPageLoading && hasNextPage) {
                loadNextPage();
              }
            }}
          >
            {Row}
          </FixedSizeList>
        )}
      </div>
    </div>
  );
});

StreamsList.displayName = 'StreamsList';