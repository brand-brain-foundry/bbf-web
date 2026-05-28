'use client';

import { useState, useEffect } from 'react';

function formatRecTime(seconds: number): string {
  const mm = Math.floor(seconds / 60)
    .toString()
    .padStart(2, '0');
  const ss = Math.floor(seconds % 60)
    .toString()
    .padStart(2, '0');
  return `${mm}:${ss}`;
}

/**
 * HeroRecTimer — Client leaf component (B-BBF-WEB-HERO-T6_7-FIX-RSC)
 *
 * Sincroniza display de tiempo REC con video.currentTime via DOM query.
 * Aplica D-99 (minimize client surface).
 *
 * Approach: useEffect query <video[data-hero-video]> + addEventListener.
 * Q-PAUSE Op-A firmada Zavala: timeupdate solo dispara durante playback,
 * pause congela timer naturalmente. ended resetea a 00:00.
 *
 * Auto-discovery via querySelector — un solo hero video por página.
 * Sin props necesarios.
 */
export function HeroRecTimer() {
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    const video = document.querySelector<HTMLVideoElement>('video[data-hero-video]');
    if (!video) return;

    const onTimeUpdate = () => setCurrentTime(video.currentTime);
    const onEnded = () => setCurrentTime(0);

    video.addEventListener('timeupdate', onTimeUpdate);
    video.addEventListener('ended', onEnded);

    return () => {
      video.removeEventListener('timeupdate', onTimeUpdate);
      video.removeEventListener('ended', onEnded);
    };
  }, []);

  return <>{formatRecTime(currentTime)}</>;
}
