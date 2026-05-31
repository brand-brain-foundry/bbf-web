'use client';

import React from 'react';
import { Nav, Hero } from './home-nav-hero';
import { Capabilities } from './home-capabilities';
import { HowItWorks } from './home-process';
import { CaseStudy } from './home-case';
import { Comparison } from './home-comparison';
import { Method } from './home-method';
import { Closing, Footer } from './home-closing';

// Scroll reveal — rAF-throttled, identical to home-app.jsx original.
// IntersectionObserver is unreliable in scaled/embedded iframes.
function useScrollReveal() {
  React.useEffect(() => {
    let pending: Element[] = [];
    let rafId: number | null = null;

    const collect = () => {
      pending = Array.from(document.querySelectorAll('.reveal:not(.is-in)'));
    };

    const sweep = () => {
      rafId = null;
      const vh = window.innerHeight;
      const remaining: Element[] = [];
      for (const el of pending) {
        const r = el.getBoundingClientRect();
        if (r.top < vh * 0.92 && r.bottom > 0) {
          el.classList.add('is-in');
        } else {
          remaining.push(el);
        }
      }
      pending = remaining;
    };

    const schedule = () => {
      if (rafId != null) return;
      rafId = requestAnimationFrame(sweep);
    };

    collect();

    const vh = window.innerHeight;
    pending.forEach((el) => {
      const r = el.getBoundingClientRect();
      if (r.top < vh * 0.92) el.classList.add('is-in');
    });
    collect();

    requestAnimationFrame(() => {
      document.documentElement.classList.add('js-reveal-ready');
    });

    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);

    const interval = setInterval(() => {
      if (pending.length === 0) {
        clearInterval(interval);
        return;
      }
      schedule();
    }, 400);

    return () => {
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      clearInterval(interval);
      if (rafId != null) cancelAnimationFrame(rafId);
    };
  }, []);
}

export function App() {
  useScrollReveal();

  return (
    <React.Fragment>
      <Nav />
      <main>
        <Hero />
        <Capabilities />
        <HowItWorks />
        <CaseStudy />
        <Comparison />
        <Method />
        <Closing />
      </main>
      <Footer />
    </React.Fragment>
  );
}
