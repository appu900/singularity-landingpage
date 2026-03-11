'use client';

import { useEffect, useRef } from 'react';

export default function Cursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    const ring = ringRef.current;
    if (!cursor || !ring) return;

    let mx = 0, my = 0, rx = 0, ry = 0;
    let animId: number;

    const onMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
    };
    document.addEventListener('mousemove', onMove);

    function animCursor() {
      cursor!.style.left = mx + 'px';
      cursor!.style.top = my + 'px';
      rx += (mx - rx) * 0.12;
      ry += (my - ry) * 0.12;
      ring!.style.left = rx + 'px';
      ring!.style.top = ry + 'px';
      animId = requestAnimationFrame(animCursor);
    }
    animCursor();

    const interactiveEls = document.querySelectorAll('a, button, .service-card, .pricing-card, .infra-node');
    const onEnter = () => {
      cursor!.style.width = '20px';
      cursor!.style.height = '20px';
      ring!.style.opacity = '0';
    };
    const onLeave = () => {
      cursor!.style.width = '10px';
      cursor!.style.height = '10px';
      ring!.style.opacity = '0.6';
    };
    interactiveEls.forEach(el => {
      el.addEventListener('mouseenter', onEnter);
      el.addEventListener('mouseleave', onLeave);
    });

    return () => {
      document.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(animId);
      interactiveEls.forEach(el => {
        el.removeEventListener('mouseenter', onEnter);
        el.removeEventListener('mouseleave', onLeave);
      });
    };
  }, []);

  return (
    <>
      <div className="cursor" ref={cursorRef} />
      <div className="cursor-ring" ref={ringRef} />
    </>
  );
}
