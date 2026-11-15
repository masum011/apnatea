import { useEffect, useMemo, useState } from 'react';
import {
  computeDataSignature,
  getCachedData,
  setCachedData,
} from '../utils/cacheManager';

/**
 * Caches catalog / menu arrays in localStorage with automatic invalidation
 * whenever prices, availability, or descriptions change.
 */
export function useCachedCatalog(cacheKey, sourceData, extraConfig = {}) {
  const signature = useMemo(
    () => computeDataSignature({ sourceData, extraConfig }),
    [sourceData, extraConfig]
  );

  const cachedHit = useMemo(
    () => getCachedData(cacheKey, signature),
    [cacheKey, signature]
  );

  const [items, setItems] = useState(() => cachedHit || sourceData);
  const [isHydrating, setIsHydrating] = useState(() => !cachedHit);

  useEffect(() => {
    if (cachedHit) {
      setItems(cachedHit);
      setIsHydrating(false);
      return undefined;
    }

    setCachedData(cacheKey, sourceData, signature);
    setItems(sourceData);

    const rafId = window.requestAnimationFrame(() => {
      setIsHydrating(false);
    });

    return () => window.cancelAnimationFrame(rafId);
  }, [cacheKey, cachedHit, sourceData, signature]);

  return { items, isHydrating, cacheVersion: signature };
}
