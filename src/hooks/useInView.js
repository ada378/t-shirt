import { useEffect, useRef, useState } from 'react';

/**
 * useInView — returns a ref and a boolean indicating whether the element
 * has entered the viewport. Once visible, it stays visible (triggerOnce).
 *
 * @param {Object} options - IntersectionObserver options
 * @param {string} options.rootMargin - e.g. '200px' to start loading before element enters view
 * @param {number} options.threshold - 0–1
 * @param {boolean} options.triggerOnce - stop observing after first intersection (default: true)
 */
export function useInView({ rootMargin = '200px', threshold = 0, triggerOnce = true } = {}) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Fallback for environments without IntersectionObserver (SSR, old browsers)
    if (typeof IntersectionObserver === 'undefined') {
      setInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          if (triggerOnce) observer.unobserve(el);
        }
      },
      { rootMargin, threshold }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [rootMargin, threshold, triggerOnce]);

  return [ref, inView];
}
