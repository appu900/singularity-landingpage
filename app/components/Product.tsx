'use client';

import { useEffect, useRef } from 'react';

function QueueVisual() {
  return (
    <div className="queue-visual">
      <div className="q-label">PRODUCER</div>
      <div className="q-row">
        <div className="q-block active">P-01</div>
        <div className="q-block">P-02</div>
        <div className="q-block">P-03</div>
      </div>
      <div style={{ color: 'rgba(255,255,255,0.2)', fontSize: '24px', margin: '4px 0' }}>↓</div>
      <div className="q-label" style={{ marginBottom: '8px' }}>PARTITION RING</div>
      <div className="q-row">
        <div className="q-block active">P-0</div>
        <div className="q-block">P-1</div>
        <div className="q-block active">P-2</div>
        <div className="q-block">P-3</div>
      </div>
      <div style={{ color: 'rgba(255,255,255,0.2)', fontSize: '24px', margin: '4px 0' }}>↓</div>
      <div className="q-label" style={{ marginBottom: '8px' }}>CONSUMER GROUP</div>
      <div className="q-row">
        <div className="q-block">C-01</div>
        <div className="q-block active">C-02</div>
        <div className="q-block">C-03</div>
      </div>
      <div
        className="q-label"
        style={{
          marginTop: '12px',
          background: 'rgba(0,200,150,0.1)',
          border: '1px solid rgba(0,200,150,0.3)',
          padding: '6px 16px',
          borderRadius: '100px',
          color: 'rgba(0,200,150,0.9)',
        }}
      >
        ● 1.2M msg/s throughput
      </div>
    </div>
  );
}

function Terminal() {
  return (
    <div style={{ padding: '32px', width: '100%' }}>
      <div className="terminal">
        <div className="terminal-bar">
          <div className="terminal-dot r" />
          <div className="terminal-dot y" />
          <div className="terminal-dot g" />
          <span className="terminal-title">singularity-scheduler.ts</span>
        </div>
        <div className="terminal-body">
          <span className="t-comment">{'// Schedule a delayed message'}</span><br />
          <span className="t-kw">const</span> <span className="t-key">job</span> = <span className="t-kw">await</span> <span className="t-fn">singularity</span>.<span className="t-fn">schedule</span>({'{'}<br />
          &nbsp;&nbsp;<span className="t-key">queue</span>: <span className="t-str">&quot;billing.invoices&quot;</span>,<br />
          &nbsp;&nbsp;<span className="t-key">payload</span>: {'{'} <span className="t-key">userId</span>: <span className="t-str">&quot;usr_xyz&quot;</span> {'}'},<br />
          &nbsp;&nbsp;<span className="t-key">delay</span>: <span className="t-str">&quot;30d&quot;</span>, <span className="t-comment">{'// 30 days later'}</span><br />
          &nbsp;&nbsp;<span className="t-key">idempotencyKey</span>: <span className="t-str">&quot;inv-2024-q1&quot;</span><br />
          {'}'});<br /><br />
          <span className="t-comment">{'// Recurring cron job'}</span><br />
          <span className="t-kw">await</span> <span className="t-fn">singularity</span>.<span className="t-fn">cron</span>({'{'}<br />
          &nbsp;&nbsp;<span className="t-key">schedule</span>: <span className="t-str">&quot;0 9 * * MON-FRI&quot;</span>,<br />
          &nbsp;&nbsp;<span className="t-key">queue</span>: <span className="t-str">&quot;reports.daily&quot;</span>,<br />
          &nbsp;&nbsp;<span className="t-key">timezone</span>: <span className="t-str">&quot;America/New_York&quot;</span><br />
          {'}'});<br /><br />
          <span className="t-green">{'// ✓ Job enqueued: job_9f3k2m'}</span><br />
          <span className="t-green">{'// ✓ Delivery guaranteed: 2024-04-12T09:00'}</span>
          <span className="typing-cursor" />
        </div>
      </div>
    </div>
  );
}

function CacheArchVisual() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const parent = canvas.parentElement!;
    const ctx = canvas.getContext('2d')!;
    let animId: number;

    const resize = () => {
      canvas.width = parent.offsetWidth;
      canvas.height = parent.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const connections: [string, string][] = [
      ['cn-c1', 'cn-lb'], ['cn-c2', 'cn-lb'], ['cn-c3', 'cn-lb'],
      ['cn-lb', 'cn-p1'], ['cn-lb', 'cn-p2'], ['cn-lb', 'cn-p3'],
      ['cn-p1', 'cn-r1'], ['cn-p2', 'cn-r2'], ['cn-p3', 'cn-r3'],
    ];

    let t = 0;

    function getCenter(id: string) {
      const el = document.getElementById(id);
      if (!el) return null;
      const er = el.getBoundingClientRect();
      const cr = canvas!.getBoundingClientRect();
      return { x: er.left + er.width / 2 - cr.left, y: er.top + er.height / 2 - cr.top };
    }

    function drawLine(ax: number, ay: number, bx: number, by: number, progress: number, color: string, dashed: boolean) {
      ctx.save();
      ctx.beginPath();
      if (dashed) ctx.setLineDash([4, 6]);
      const dx = bx - ax, dy = by - ay;
      const ex = ax + dx * progress, ey = ay + dy * progress;
      ctx.moveTo(ax, ay); ctx.lineTo(ex, ey);
      ctx.strokeStyle = color; ctx.lineWidth = 1; ctx.globalAlpha = 0.35;
      ctx.stroke(); ctx.restore();

      ctx.save();
      ctx.beginPath();
      ctx.arc(ex, ey, 2.5, 0, Math.PI * 2);
      ctx.fillStyle = color; ctx.globalAlpha = 0.7 * progress; ctx.fill();
      ctx.restore();
    }

    function animate() {
      ctx.clearRect(0, 0, canvas!.width, canvas!.height);
      t += 0.004;

      connections.forEach((pair, i) => {
        const a = getCenter(pair[0]), b = getCenter(pair[1]);
        if (!a || !b) return;
        const phase = (t + i * 0.18) % 1;
        const isPrimReplica = i >= 6;
        const color = isPrimReplica ? '#00c896' : (i >= 3 ? '#0038ff' : 'rgba(255,255,255,0.6)');
        drawLine(a.x, a.y, b.x, b.y, phase, color, isPrimReplica);
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y);
        ctx.strokeStyle = color; ctx.lineWidth = 0.5; ctx.globalAlpha = 0.08;
        ctx.stroke(); ctx.restore();
      });
      animId = requestAnimationFrame(animate);
    }

    const timeout = setTimeout(animate, 400);
    return () => {
      clearTimeout(timeout);
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <div className="cache-arch">
      <canvas className="cache-arch-canvas" ref={canvasRef} />
      {/* CLIENT LAYER */}
      <div className="cache-layer" style={{ marginBottom: 0 }}>
        <div className="cache-layer-label">CLIENTS</div>
        <div className="cache-node" id="cn-c1">
          <div className="cache-node-icon client">
            <svg viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="1.5" strokeLinecap="round">
              <rect x="2" y="3" width="20" height="14" rx="2" /><path d="M8 21h8M12 17v4" />
            </svg>
            <div className="cache-node-status blue" />
          </div>
          <div className="cache-node-label">APP<br />SERVER</div>
        </div>
        <div className="cache-node" id="cn-c2">
          <div className="cache-node-icon client">
            <svg viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="1.5" strokeLinecap="round">
              <path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" />
            </svg>
            <div className="cache-node-status blue" />
          </div>
          <div className="cache-node-label">MICROSERVICE<br />CLUSTER</div>
        </div>
        <div className="cache-node" id="cn-c3">
          <div className="cache-node-icon client">
            <svg viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="1.5" strokeLinecap="round">
              <circle cx="12" cy="12" r="10" /><path d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
            </svg>
            <div className="cache-node-status blue" />
          </div>
          <div className="cache-node-label">EDGE<br />FUNCTION</div>
        </div>
      </div>
      <div className="cache-spacer" />
      {/* LOAD BALANCER */}
      <div className="cache-layer">
        <div className="cache-node" id="cn-lb">
          <div className="cache-node-icon lb" style={{ width: '64px', height: '44px', borderRadius: '10px' }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="rgba(255,140,80,0.9)" strokeWidth="1.5" strokeLinecap="round" style={{ width: '22px', height: '22px' }}>
              <path d="M18 20V10" /><path d="M12 20V4" /><path d="M6 20v-6" />
            </svg>
          </div>
          <div className="cache-node-label">CONSISTENT-HASH<br />LOAD BALANCER</div>
        </div>
      </div>
      <div className="cache-spacer" />
      {/* PRIMARY NODES */}
      <div className="cache-layer">
        <div className="cache-layer-label">PRIMARY</div>
        {['SHARD-1', 'SHARD-2', 'SHARD-3'].map((s, i) => (
          <div className="cache-node" id={`cn-p${i + 1}`} key={s}>
            <div className="cache-node-icon primary">
              <svg viewBox="0 0 24 24" fill="none" stroke="rgba(100,160,255,0.9)" strokeWidth="1.5" strokeLinecap="round">
                <ellipse cx="12" cy="5" rx="9" ry="3" /><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" /><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
              </svg>
              <div className="cache-node-status" />
            </div>
            <div className="cache-node-label">{s}<br />PRIMARY</div>
          </div>
        ))}
      </div>
      <div className="cache-spacer" />
      {/* REPLICA NODES */}
      <div className="cache-layer">
        <div className="cache-layer-label">REPLICAS</div>
        {['SHARD-1', 'SHARD-2', 'SHARD-3'].map((s, i) => (
          <div className="cache-node" id={`cn-r${i + 1}`} key={s}>
            <div className="cache-node-icon replica">
              <svg viewBox="0 0 24 24" fill="none" stroke="rgba(0,200,150,0.85)" strokeWidth="1.5" strokeLinecap="round">
                <ellipse cx="12" cy="5" rx="9" ry="3" /><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" /><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
              </svg>
              <div className="cache-node-status" />
            </div>
            <div className="cache-node-label">{s}<br />REPLICA</div>
          </div>
        ))}
      </div>
      {/* Legend */}
      <div style={{ display: 'flex', gap: '20px', marginTop: '18px', position: 'relative', zIndex: 2 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontFamily: 'var(--mono)', fontSize: '9px', color: 'rgba(255,255,255,0.35)' }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '2px', background: 'rgba(0,56,255,0.4)', border: '1px solid rgba(0,56,255,0.6)' }} />PRIMARY WRITE
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontFamily: 'var(--mono)', fontSize: '9px', color: 'rgba(255,255,255,0.35)' }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '2px', background: 'rgba(0,200,150,0.3)', border: '1px solid rgba(0,200,150,0.5)' }} />READ REPLICA
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontFamily: 'var(--mono)', fontSize: '9px', color: 'rgba(255,255,255,0.35)' }}>
          <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: 'var(--accent-3)' }} />LIVE
        </div>
      </div>
    </div>
  );
}

export default function Product() {
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
    <section id="product" ref={sectionRef}>
      <div className="section-eyebrow reveal">// Product Details</div>
      <h2 className="section-title reveal reveal-delay-1">
        Built for<br /><em>serious</em> workloads.
      </h2>

      {/* QUEUE */}
      <div className="product-grid" style={{ marginTop: '80px' }}>
        <div className="product-visual reveal">
          <QueueVisual />
        </div>
        <div className="product-content reveal reveal-delay-2">
          <div className="section-eyebrow">Distributed Queue</div>
          <h3 className="product-title">Messages that <em>never</em> drop.</h3>
          <p className="product-desc">
            Built on an append-only log architecture, Singularity Queue scales horizontally
            across partitions without any configuration. Write once, deliver anywhere.
          </p>
          <ul className="feature-list">
            {[
              'Exactly-once delivery with idempotent producers and transactional consumers',
              'Consumer groups with automatic rebalancing and offset management',
              'Dead-letter queues with configurable retry policies and backoff',
              'Fan-out patterns: broadcast single messages to unlimited subscribers',
              'Message TTL, priority queues, and ordered partitions',
              'Real-time lag monitoring and auto-scaling consumer groups',
            ].map((f, i) => (
              <li className="feature-item" key={i}>
                <div className="feature-dot" />{f}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="product-divider" />

      {/* SCHEDULER */}
      <div className="product-grid reverse">
        <div className="product-visual reveal">
          <Terminal />
        </div>
        <div className="product-content reveal reveal-delay-2">
          <div className="section-eyebrow">Scheduler &amp; Delayed Messages</div>
          <h3 className="product-title">Time is just another <em>variable.</em></h3>
          <p className="product-desc">
            Schedule messages from 1 millisecond to 1 year in the future. Singularity&apos;s
            scheduler is durable, distributed, and resilient to node failures.
          </p>
          <ul className="feature-list">
            {[
              'Millisecond-precision delay scheduling up to 365 days in the future',
              'Cron expressions with timezone support and daylight saving handling',
              'Idempotency keys prevent duplicate job creation on retries',
              'Full audit log: created, scheduled, delivered, acknowledged',
              'Cancel or modify scheduled jobs up until delivery',
              'Durable across full region failures with 0-RPO cross-region replication',
            ].map((f, i) => (
              <li className="feature-item" key={i}>
                <div className="feature-dot" />{f}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="product-divider" />

      {/* CACHE */}
      <div className="product-grid">
        <div className="product-visual reveal" style={{ minHeight: '500px' }}>
          <CacheArchVisual />
        </div>
        <div className="product-content reveal reveal-delay-2">
          <div className="section-eyebrow">Horizontal Cache</div>
          <h3 className="product-title">Cache that never <em>sleeps.</em></h3>
          <p className="product-desc">
            A Redis-compatible caching layer that scales horizontally using consistent hashing.
            Rolling updates guarantee zero downtime — no more maintenance windows.
          </p>
          <ul className="feature-list">
            {[
              '100% Redis-compatible — migrate existing code with zero changes',
              'Zero-downtime scaling: add or remove nodes with automatic rehashing',
              'Multi-region replication with configurable consistency (async/sync)',
              'LRU/LFU/TTL eviction policies with per-key overrides',
              'Read replicas for geo-local reads with eventual consistency',
              'Built-in cache warming and gradual traffic shifting during migrations',
            ].map((f, i) => (
              <li className="feature-item" key={i}>
                <div className="feature-dot" />{f}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
