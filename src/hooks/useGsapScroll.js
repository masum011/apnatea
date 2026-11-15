import { useEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function usePrefersReducedMotion() {
  const [prefersReduced, setPrefersReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReduced(mq.matches);

    const handleChange = (event) => {
      setPrefersReduced(event.matches);
    };

    mq.addEventListener('change', handleChange);
    return () => mq.removeEventListener('change', handleChange);
  }, []);

  return prefersReduced;
}

export function useGsapContext(scopeRef, setupFn, deps = []) {
  const prefersReduced = usePrefersReducedMotion();

  useEffect(() => {
    if (prefersReduced || !scopeRef.current) {
      return undefined;
    }

    const ctx = gsap.context(() => {
      setupFn(gsap, ScrollTrigger);
    }, scopeRef);

    return () => {
      ctx.revert();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prefersReduced, ...deps]);
}

export { gsap, ScrollTrigger };
