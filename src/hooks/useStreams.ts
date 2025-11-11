import { useState, useEffect } from 'react';
import { streamsAPI, type Stream } from '@/lib/api';

export const useStreams = () => {
  const [streams, setStreams] = useState<Stream[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStreams = async () => {
    try {
      setLoading(true);
      const data = await streamsAPI.getAll();
      setStreams(data.streams);
      setError(null);
    } catch (err) {
      setError('Failed to load streams');
      console.error('Error fetching streams:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStreams();
    
    const interval = setInterval(fetchStreams, 10000);
    
    return () => clearInterval(interval);
  }, []);

  return { streams, loading, error, refetch: fetchStreams };
};
