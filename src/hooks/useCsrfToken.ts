import { useState, useEffect } from 'react';
import { getCsrfToken } from '../services/api';
import type { RequestStatus } from '../types/api';

export function useCsrfToken() {
  const [token, setToken] = useState<string>('');
  const [status, setStatus] = useState<RequestStatus>({
    loading: true,
    error: null,
    success: false
  });

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const newToken = await getCsrfToken();
        setToken(newToken);
        setStatus({ loading: false, error: null, success: true });
      } catch (err) {
        setStatus({
          loading: false,
          error: 'Failed to fetch CSRF token',
          success: false
        });
      }
    };

    fetchToken();
  }, []);

  const refreshToken = async () => {
    setStatus({ loading: true, error: null, success: false });
    try {
      const newToken = await getCsrfToken();
      setToken(newToken);
      setStatus({ loading: false, error: null, success: true });
    } catch (err) {
      setStatus({
        loading: false,
        error: 'Failed to refresh CSRF token',
        success: false
      });
    }
  };

  return { token, status, refreshToken };
}