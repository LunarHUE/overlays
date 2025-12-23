import { useState, useEffect, useCallback } from 'react';

export function useURLParams() {
  const [searchParams, setSearchParams] = useState<URLSearchParams>(() => {
    if (typeof window !== 'undefined') {
      return new URLSearchParams(window.location.search);
    }
    return new URLSearchParams();
  });

  useEffect(() => {
    const handlePopState = () => {
      setSearchParams(new URLSearchParams(window.location.search));
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const updateParams = useCallback((updater: (params: URLSearchParams) => void) => {
    const newParams = new URLSearchParams(window.location.search);
    updater(newParams);

    const newURL = `${window.location.pathname}?${newParams.toString()}`;
    window.history.pushState({}, '', newURL);
    setSearchParams(newParams);
  }, []);

  return { searchParams, updateParams };
}