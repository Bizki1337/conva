import { useState, useEffect, useRef } from 'react';

export const useResize = () => {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const currentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!currentRef.current) return;

    const updateDimensions = () => {
      const { offsetWidth, offsetHeight } = currentRef.current!;
      setDimensions({ width: offsetWidth, height: offsetHeight });
    };

    updateDimensions();

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        setDimensions({ width, height: height - 100 }); // потом убрать - 100
      }
    });

    resizeObserver.observe(currentRef.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  return { currentRef, dimensions };
};
