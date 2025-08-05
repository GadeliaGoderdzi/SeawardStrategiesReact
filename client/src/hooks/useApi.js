import { useState, useCallback } from 'react';

export const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const request = useCallback(async (url, options = {}) => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      const headers = {
        'Content-Type': 'application/json',
        ...options.headers
      };

      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const response = await fetch(url, {
        ...options,
        headers
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setLoading(false);
      return { data, error: null };
    } catch (err) {
      setError(err.message);
      setLoading(false);
      return { data: null, error: err.message };
    }
  }, []);

  const get = useCallback((url) => request(url), [request]);
  
  const post = useCallback((url, data) => 
    request(url, {
      method: 'POST',
      body: JSON.stringify(data)
    }), [request]);

  const put = useCallback((url, data) => 
    request(url, {
      method: 'PUT',
      body: JSON.stringify(data)
    }), [request]);

  const del = useCallback((url) => 
    request(url, { method: 'DELETE' }), [request]);

  return {
    loading,
    error,
    get,
    post,
    put,
    delete: del
  };
};