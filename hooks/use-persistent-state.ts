import { useState } from "react";

export function readStoredValue<TValue>(
  key: string,
  parse: (stored: unknown) => TValue | undefined
): TValue | undefined {
  try {
    const raw = localStorage.getItem(key);

    return raw === null ? undefined : parse(JSON.parse(raw));
  } catch {
    // Unreadable or blocked storage reads as nothing stored.
    return undefined;
  }
}

export function writeStoredValue(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Blocked storage: the choice lasts until the page closes, which is fine
    // for layout preferences.
  }
}

// useState that survives a reload: the value is kept in localStorage under
// `key`. `parse` vets what comes back (storage can hold anything), returning
// undefined to fall back to `initial`. The editor renders client-only, so
// storage is available on the first render and nothing flashes.
export function usePersistentState<TValue>(
  key: string,
  initial: TValue,
  parse: (stored: unknown) => TValue | undefined
) {
  const [value, setValue] = useState<TValue>(
    () => readStoredValue(key, parse) ?? initial
  );

  function setPersistentValue(next: TValue) {
    setValue(next);
    writeStoredValue(key, next);
  }

  return [value, setPersistentValue] as const;
}

export function parseBoolean(stored: unknown): boolean | undefined {
  return typeof stored === "boolean" ? stored : undefined;
}
