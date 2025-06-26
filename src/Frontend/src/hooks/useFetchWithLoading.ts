// src/hooks/useFetchWithLoading.ts
import { useLoading } from '../context/LoadingContext';

export const useFetchWithLoading = () => {
  const { setLoading } = useLoading();

  const fetchWithLoading = async <T>(
    input: RequestInfo,
    init?: RequestInit
  ): Promise<T> => {
    setLoading(true);
    try {
      const response = await fetch(input, init);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Fetch error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return { fetchWithLoading };
};
