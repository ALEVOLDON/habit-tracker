import { useState, useCallback } from 'react';

type AsyncStatus = 'idle' | 'loading' | 'success' | 'error';

// T - это тип данных, которые мы ожидаем получить
// E - это тип ошибки
export const useAsync = <T, E = string>() => {
  const [status, setStatus] = useState<AsyncStatus>('idle');
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<E | null>(null);

  // useCallback нужен, чтобы функция не создавалась заново при каждом рендере
  const execute = useCallback(async (asyncFn: () => Promise<T>) => {
    setStatus('loading');
    setData(null);
    setError(null);
    try {
      const responseData = await asyncFn();
      setData(responseData);
      setStatus('success');
      return responseData; // Возвращаем данные в случае успеха
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Что-то пошло не так';
      setError(errorMessage as E);
      setStatus('error');
      throw err; // Пробрасываем ошибку, чтобы ее можно было поймать в компоненте
    }
  }, []);

  return { execute, status, data, error, setData, isLoading: status === 'loading' };
};