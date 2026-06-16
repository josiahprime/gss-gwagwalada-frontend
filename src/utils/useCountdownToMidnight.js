import { useEffect, useRef, useState } from 'react';
import { axiosInstance } from '../lib/axios';

export function useDealCountdown() {
  const [countdown, setCountdown] = useState(null);
  const timerRef = useRef(null);
  const expirationTimeRef = useRef(null);

  useEffect(() => {
    async function syncWithServer() {
      try {
        const res = await axiosInstance.get('/server-time');
        const { expiresAt } = res.data;
        expirationTimeRef.current = new Date(expiresAt).getTime();

        setCountdown(expirationTimeRef.current - Date.now());

        // Clear previous interval if any
        if (timerRef.current) {
          clearInterval(timerRef.current);
        }

        timerRef.current = setInterval(tick, 1000);
      } catch (err) {
        console.error("Failed to syc with server time:", err);
      }
    }

    function tick() {
      const now = Date.now();
      if (!expirationTimeRef.current) return;

      const diff = expirationTimeRef.current - now;

      if (diff <= 0) {
        setCountdown(0);
        clearInterval(timerRef.current);
        syncWithServer(); // ⬅️ this is what was missing!
      } else {
        setCountdown(diff);
      }
    }

    syncWithServer();

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  return countdown;
}
