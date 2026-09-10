const STORAGE_PREFIX = "cargolink";

export function getStorageKey(key: string) {
  return `${STORAGE_PREFIX}:${key}`;
}

export function readStorage<T>(key: string, fallback: T): T {
  try {
    const value = localStorage.getItem(getStorageKey(key));
    return value ? (JSON.parse(value) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function writeStorage<T>(key: string, value: T) {
  localStorage.setItem(getStorageKey(key), JSON.stringify(value));
}

export function removeStorage(key: string) {
  localStorage.removeItem(getStorageKey(key));
}
