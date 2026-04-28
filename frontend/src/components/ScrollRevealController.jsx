import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const TARGET_SELECTOR = [
  '.scroll-reveal-target',
  '.page-stack > *',
  '.feature-grid > *',
  '.resource-grid > *',
  '.mini-card-grid > *',
  '.trust-grid > *',
  '.assistant-main > *',
].join(', ');

export default function ScrollRevealController() {
  const location = useLocation();

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const targets = Array.from(document.querySelectorAll(TARGET_SELECTOR));

    if (!targets.length) {
      return undefined;
    }

    targets.forEach((target, index) => {
      target.classList.add('scroll-reveal');
      target.style.setProperty('--reveal-delay', `${Math.min(index * 40, 220)}ms`);
    });

    if (prefersReducedMotion) {
      targets.forEach((target) => target.classList.add('is-revealed'));
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        rootMargin: '0px 0px -10% 0px',
        threshold: 0.12,
      },
    );

    targets.forEach((target) => {
      target.classList.remove('is-revealed');
      observer.observe(target);
    });

    return () => {
      observer.disconnect();
    };
  }, [location.pathname]);

  return null;
}
