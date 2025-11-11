import { memo, useMemo, useRef, useEffect, useState } from 'react';
import { FixedSizeList as List } from 'react-window';
import { Stream } from './types';
import { StreamCard } from './StreamCard';

interface StreamsListProps {
  streams: Stream[];
}

export const StreamsList = memo(({ streams }: StreamsListProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

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

  const rowCount = useMemo(() => {
    return Math.ceil(streams.length / itemsPerRow);
  }, [streams.length, itemsPerRow]);

  const Row = useMemo(() => {
    return ({ index, style }: { index: number; style: React.CSSProperties }) => {
      const startIndex = index * itemsPerRow;
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
    };
  }, [streams, itemsPerRow]);

  return (
    <div ref={containerRef} className="h-full w-full pt-20 pb-24 px-4">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
          <div className="w-3 h-3 bg-accent rounded-full animate-pulse-glow" />
          Прямые эфиры
        </h2>
        
        {dimensions.height > 0 && (
          <List
            height={dimensions.height - 80}
            itemCount={rowCount}
            itemSize={380}
            width="100%"
            overscanCount={2}
          >
            {Row}
          </List>
        )}
      </div>
    </div>
  );
});

StreamsList.displayName = 'StreamsList';
