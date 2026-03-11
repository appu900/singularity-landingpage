'use client';

import { useEffect, useRef } from 'react';

export default function CTA() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const els = sectionRef.current?.querySelectorAll('.reveal');
    if (!els) return;
    const observer = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
    }, { threshold: 0.1 });
    els.forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section id="cta" ref={sectionRef}>
      <div className="cta-bg-text">SG</div>
      <div className="section-eyebrow reveal" style={{ position: 'relative', zIndex: 1 }}>
        // Get Started
      </div>
      <h2 className="cta-title reveal reveal-delay-1">
        Your data platform<br />is one <em>command</em> away.
      </h2>
      <p className="cta-sub reveal reveal-delay-2">
        No infrastructure to provision. No clusters to manage. Just ship.
      </p>
      <div
        style={{ display: 'flex', gap: '14px', justifyContent: 'center', position: 'relative', zIndex: 1 }}
        className="reveal reveal-delay-3"
      >
        <a href="#" className="btn-primary"><span>Start Building Free</span><span>→</span></a>
        <a href="#" className="btn-ghost">Read the Docs</a>
      </div>
      <div
        className="terminal reveal"
        style={{ maxWidth: '540px', margin: '48px auto 0', position: 'relative', zIndex: 1 }}
      >
        <div className="terminal-bar">
          <div className="terminal-dot r" />
          <div className="terminal-dot y" />
          <div className="terminal-dot g" />
          <span className="terminal-title">quickstart</span>
        </div>
        <div className="terminal-body" style={{ fontSize: '13px' }}>
          <span className="t-dim">$</span> <span className="t-green">npm install @singularity/sdk</span><br />
          <span className="t-dim">$</span> <span className="t-key">singularity</span> init<br />
          <span className="t-green">✓ Project initialized</span><br />
          <span className="t-green">✓ Queue: billing.events created</span><br />
          <span className="t-green">✓ Cache: session-store ready</span><br />
          <span className="t-green">✓ Scheduler: connected</span><br />
          <span className="t-dim">→ Dashboard: </span><span className="t-str">app.singularity.io/proj_abc</span>
          <span className="typing-cursor" />
        </div>
      </div>
    </section>
  );
}
