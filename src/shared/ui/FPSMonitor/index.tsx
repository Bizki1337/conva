import { useEffect, useRef, useState } from 'react';
import Stats from 'stats.js';

import styles from './styles.module.scss';

export const FPSMonitor = () => {
  const [showStat, setShowStat] = useState(false);
  const statsRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!statsRef.current) return;

    const statsFPS = new Stats();
    const statsMS = new Stats();
    const statsMB = new Stats();

    statsFPS.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
    statsMS.showPanel(1);
    statsMB.showPanel(2);

    statsFPS.dom.style.cssText = '';
    statsMS.dom.style.cssText = '';
    statsMB.dom.style.cssText = '';

    statsRef.current.appendChild(statsFPS.dom);
    statsRef.current.appendChild(statsMS.dom);
    statsRef.current.appendChild(statsMB.dom);

    const animate = () => {
      statsFPS.update();
      statsMS.update();
      statsMB.update();

      requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);

    return () => {
      if (!statsRef.current) return;

      statsRef.current.removeChild(statsFPS.dom);
      statsRef.current.removeChild(statsMS.dom);
      statsRef.current.removeChild(statsMB.dom);
    };
  }, [showStat]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent): void => {
      if (e.code === 'KeyP') {
        setShowStat((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <>
      {!showStat && (
        <div
          className={styles.wrapper}
          ref={statsRef}
        />
      )}
    </>
  );
};
