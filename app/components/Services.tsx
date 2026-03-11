'use client';

import { useEffect, useRef } from 'react';

export default function Services() {
  const sectionRef = useRef<HTMLDivElement>(null);

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
    <section id="services" ref={sectionRef}>
      <div className="section-eyebrow reveal">// Platform Services</div>
      <h2 className="section-title reveal reveal-delay-1">
        Three services.<br /><em>Infinite</em> possibilities.
      </h2>
      <div className="services-grid reveal reveal-delay-2">
        {/* QUEUE */}
        <div className="service-card">
          <div className="service-num">01</div>
          <div className="service-icon-bg"><div className="service-icon">⬡</div></div>
          <div className="service-name">Distributed Queue</div>
          <div className="service-desc">
            A horizontally scalable message queue built for high-throughput workloads.
            Exactly-once delivery, ordered partitions, and consumer groups — zero ops overhead.
          </div>
          <div className="service-tags">
            {['AT-LEAST-ONCE', 'EXACTLY-ONCE', 'FIFO', 'DLQ', 'FANOUT'].map(t => (
              <span className="service-tag" key={t}>{t}</span>
            ))}
          </div>
        </div>
        {/* SCHEDULER */}
        <div className="service-card">
          <div className="service-num">02</div>
          <div className="service-icon-bg"><div className="service-icon">◷</div></div>
          <div className="service-name">Scheduler & Delayed Messages</div>
          <div className="service-desc">
            Cron-based and arbitrary-delay message scheduling with millisecond precision.
            Schedule jobs months in advance with guaranteed delivery and full audit trail.
          </div>
          <div className="service-tags">
            {['CRON', 'ONE-TIME', 'RECURRING', 'DELAY'].map(t => (
              <span className="service-tag" key={t}>{t}</span>
            ))}
          </div>
        </div>
        {/* CACHE */}
        <div className="service-card">
          <div className="service-num">03</div>
          <div className="service-icon-bg"><div className="service-icon">◈</div></div>
          <div className="service-name">Horizontal Cache</div>
          <div className="service-desc">
            A globally distributed caching layer with zero-downtime rolling updates,
            automatic sharding, and consistent hashing. Drop-in Redis-compatible API.
          </div>
          <div className="service-tags">
            {['REDIS API', '0 DOWNTIME', 'AUTO-SHARD', 'MULTI-REGION'].map(t => (
              <span className="service-tag" key={t}>{t}</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
