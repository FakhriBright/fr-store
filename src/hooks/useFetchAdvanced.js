import { useState, useEffect, useRef } from "react";

const cache = {};

export function useFetchAdvanced(url) {
  const [data, setData] = useState(cache[url] || null);
  const [loading, setLoading] = useState(!cache[url]);
  const [error, setError] = useState(null);
  const controllerRef = useRef(null);

  useEffect(() => {
    if (cache[url]) return;
    controllerRef.current = new AbortController();

    fetch(url, { signal: controllerRef.current.signal })
      .then((res) => res.json())
      .then((json) => {
        cache[url] = json;
        setData(json);
        setLoading(false);
      })
      .catch((err) => {
        if (err.name !== "AbortError") {
          setError(err);
          setLoading(false);
        }
      });

    return () => controllerRef.current.abort();
  }, [url]);

  return { data, loading, error };
}
