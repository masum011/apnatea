/**
 * Client-side caching with deterministic content-hash invalidation.
 * Automatically busts stale cache whenever product prices, availability,
 * menu items, or owner settings change in centralized data files.
 */

const DEFAULT_TTL_MS = 1000 * 60 * 60 * 6; // 6 hours

export function computeDataSignature(payload) {
  const str = JSON.stringify(payload);
  let hash = 2166136261;
  for (let i = 0; i < str.length; i += 1) {
    hash ^= str.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return `v1_${(hash >>> 0).toString(36)}`;
}

export function getCachedData(key, expectedSignature, ttlMs = DEFAULT_TTL_MS) {
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return null;

    const record = JSON.parse(raw);
    if (!record || record.signature !== expectedSignature) {
      window.localStorage.removeItem(key);
      return null;
    }

    if (Date.now() - record.timestamp > ttlMs) {
      window.localStorage.removeItem(key);
      return null;
    }

    return record.data;
  } catch {
    return null;
  }
}

export function setCachedData(key, data, signature) {
  try {
    const record = {
      signature,
      timestamp: Date.now(),
      data,
    };
    window.localStorage.setItem(key, JSON.stringify(record));
  } catch {
    // Ignore storage quota / privacy-mode errors gracefully
  }
}

export function getSessionValue(key, fallback = null) {
  try {
    const raw = window.sessionStorage.getItem(key);
    return raw !== null ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

export function setSessionValue(key, value) {
  try {
    window.sessionStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Ignore storage failures
  }
}
