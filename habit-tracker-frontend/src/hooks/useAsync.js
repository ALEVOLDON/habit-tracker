import { useState, useCallback } from 'react';

export const useAsync = () => {
  const [status, setStatus] = useState('idle');
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const execute = useCallback(async (asyncFn) => {
    setStatus('loading');
    setData(null);
    setError(null);
    try {
      const responseData = await asyncFn();
      setData(responseData);
      setStatus('success');
      return responseData;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Что-то пошло не так';
      setError(errorMessage);
      setStatus('error');
      throw err;
    }
  }, []);

  return { execute, status, data, error, setData, isLoading: status === 'loading' };
};
