import { memo, useMemo, useRef, useEffect, useState, useCallback } from 'react';
import { FixedSizeList } from 'react-window';
import InfiniteLoader from 'react-window-infinite-loader';
import { Stream } from './types';
import { StreamCard } from './StreamCard';

interface StreamsListProps {
  streams: Stream[];
}

export const StreamsList = memo(({ streams: initialStreams }: StreamsListProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [streams, setStreams] = useState(initialStreams);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [isNextPageLoading, setIsNextPageLoading] = useState(false);

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
            <StreamCard stream={streams[streamIndex]} />
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

  return (
    <div ref={containerRef} className="h-full w-full pt-20 pb-24 px-4">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
          <div className="w-3 h-3 bg-accent rounded-full animate-pulse-glow" />
          Прямые эфиры ({streams.length})
        </h2>
        
        {dimensions.height > 0 && (
          <InfiniteLoader
            isItemLoaded={isItemLoaded}
            itemCount={rowCount}
            loadMoreItems={loadNextPage}
          >
            {({ onItemsRendered, ref }) => (
              <FixedSizeList
                height={dimensions.height - 80}
                itemCount={rowCount}
                itemSize={380}
                width="100%"
                overscanCount={2}
                onItemsRendered={onItemsRendered}
                ref={ref}
              >
                {Row}
              </FixedSizeList>
            )}
          </InfiniteLoader>
        )}
      </div>
    </div>
  );
});

StreamsList.displayName = 'StreamsList';
