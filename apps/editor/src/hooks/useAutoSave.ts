import { useEffect, useRef } from 'react';

const serialize = <T,>(value: T) =>
  JSON.stringify(value, (key, currentValue) => (key === 'updated_at' ? undefined : currentValue));

export const useAutoSave = <T,>(
  value: T,
  onSave: (next: T) => Promise<void>,
  delay = 3000,
  enabled = true
) => {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const firstRunRef = useRef(true);
  const snapshotRef = useRef<string | null>(null);
  const serialized = serialize(value);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    if (firstRunRef.current) {
      firstRunRef.current = false;
      snapshotRef.current = serialized;
      return;
    }

    if (snapshotRef.current === serialized) {
      return;
    }

    snapshotRef.current = serialized;

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(() => {
      onSave(value).catch((error) => {
        console.error('Auto save failed', error);
      });
    }, delay);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [serialized, value, delay, enabled, onSave]);
};
