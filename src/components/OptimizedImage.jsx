import { useEffect, useRef, useState } from 'react';
import { Coffee } from 'lucide-react';

/**
 * Responsive WebP-first <picture> component with:
 * - Explicit width/height attributes to eliminate Cumulative Layout Shift (CLS)
 * - Eager + high fetchPriority for LCP hero imagery, lazy + async decoding below the fold
 * - Smooth placeholder shimmer only while loading
 * - Styled CSS/SVG fallback on load error
 */
export default function OptimizedImage({
  src,
  webpSrc,
  webpSrcSet,
  sizes = '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw',
  alt,
  width,
  height,
  priority = false,
  className = '',
  wrapperClassName = '',
  imgRef = null,
  onReady,
}) {
  const internalRef = useRef(null);
  const resolvedRef = imgRef || internalRef;
  const [loaded, setLoaded] = useState(priority);
  const [errored, setErrored] = useState(false);

  useEffect(() => {
    if (resolvedRef.current && resolvedRef.current.complete && resolvedRef.current.naturalWidth > 0) {
      setLoaded(true);
      onReady?.();
    }
  }, [resolvedRef, onReady]);

  if (errored || (!src && !webpSrc)) {
    return (
      <div
        className={`w-full h-full flex flex-col items-center justify-center p-4 text-center bg-[radial-gradient(circle_at_top,rgba(200,139,54,0.2),#22110B)] ${wrapperClassName}`}
      >
        <Coffee className="w-8 h-8 text-[#E59F29] mb-2" aria-hidden="true" />
        <p className="text-xs font-medium text-[#F6EBDD]/85 line-clamp-2">{alt}</p>
      </div>
    );
  }

  return (
    <div className={`relative w-full h-full overflow-hidden ${wrapperClassName}`}>
      {!loaded && !priority && (
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[#E9DAC5] overflow-hidden"
        >
          <div className="skeleton-shimmer w-full h-full" />
        </div>
      )}

      <picture className="block w-full h-full">
        {(webpSrcSet || webpSrc) && (
          <source
            type="image/webp"
            srcSet={webpSrcSet || webpSrc}
            sizes={webpSrcSet ? sizes : undefined}
          />
        )}
        <img
          ref={resolvedRef}
          src={src}
          alt={alt}
          width={width}
          height={height}
          loading={priority ? 'eager' : 'lazy'}
          fetchPriority={priority ? 'high' : 'auto'}
          decoding={priority ? 'sync' : 'async'}
          referrerPolicy="no-referrer"
          onLoad={() => {
            setLoaded(true);
            onReady?.();
          }}
          onError={() => {
            setErrored(true);
            onReady?.();
          }}
          className={`${className} transition-opacity duration-300 ${
            loaded || priority ? 'opacity-100' : 'opacity-0'
          }`}
        />
      </picture>
    </div>
  );
}
