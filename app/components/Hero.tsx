'use client';

import { useEffect, useRef } from 'react';

interface Particle {
  x: number; y: number; vx: number; vy: number;
  r: number; alpha: number; color: string;
  reset(w: number, h: number): void;
  update(w: number, h: number): void;
  draw(ctx: CanvasRenderingContext2D): void;
}

function createParticle(w: number, h: number): Particle {
  const p: Particle = {
    x: 0, y: 0, vx: 0, vy: 0, r: 0, alpha: 0, color: '',
    reset(w, h) {
      this.x = Math.random() * w;
      this.y = Math.random() * h;
      this.vx = (Math.random() - 0.5) * 0.4;
      this.vy = (Math.random() - 0.5) * 0.4;
      this.r = Math.random() * 2 + 0.5;
      this.alpha = Math.random() * 0.4 + 0.1;
      this.color = Math.random() > 0.6 ? '#0038ff' : '#0a0a0a';
    },
    update(w, h) {
      this.x += this.vx;
      this.y += this.vy;
      if (this.x < 0 || this.x > w || this.y < 0 || this.y > h) this.reset(w, h);
    },
    draw(ctx) {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.globalAlpha = this.alpha;
      ctx.fill();
      ctx.globalAlpha = 1;
    },
  };
  p.reset(w, h);
  return p;
}

const STATS = [
  { count: 99.999, label: '% SLA UPTIME', id: 'stat-0' },
  { count: 0.4, label: 'ms AVG LATENCY', id: 'stat-1' },
  { count: 1.2, label: 'M MSG/SEC PEAK', id: 'stat-2' },
  { count: 12, label: 'GLOBAL REGIONS', id: 'stat-3' },
];

export default function Hero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const statRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    let animId: number;
    let particles: ReturnType<typeof createParticle>[] = [];

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    for (let i = 0; i < 180; i++) {
      particles.push(createParticle(canvas.width, canvas.height));
    }

    function drawConnections() {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < 80) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = '#0038ff';
            ctx.globalAlpha = (1 - d / 80) * 0.06;
            ctx.lineWidth = 0.8;
            ctx.stroke();
            ctx.globalAlpha = 1;
          }
        }
      }
    }

    function animate() {
      ctx.clearRect(0, 0, canvas!.width, canvas!.height);
      drawConnections();
      particles.forEach(p => {
        p.update(canvas!.width, canvas!.height);
        p.draw(ctx);
      });
      animId = requestAnimationFrame(animate);
    }
    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  // Counter animation
  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target as HTMLDivElement;
        const idx = Number(el.dataset.idx);
        const target = STATS[idx].count;
        const isDecimal = String(target).includes('.');
        const decimals = isDecimal ? String(target).split('.')[1].length : 0;
        const duration = 1800;
        const startTime = performance.now();
        function update(now: number) {
          const elapsed = now - startTime;
          const progress = Math.min(elapsed / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          const val = eased * target;
          el.textContent = decimals > 0 ? val.toFixed(decimals) : Math.floor(val).toLocaleString();
          if (progress < 1) requestAnimationFrame(update);
        }
        requestAnimationFrame(update);
        observer.unobserve(el);
      });
    }, { threshold: 0.5 });

    statRefs.current.forEach(el => { if (el) observer.observe(el); });
    return () => observer.disconnect();
  }, []);

  return (
    <section id="hero">
      <canvas className="hero-canvas" ref={canvasRef} />
      <div className="hero-badge">⬟ Serverless Data Platform · Now in Public Beta</div>
      <h1 className="hero-title">
        Data infrastructure<br />at <em>singular</em> scale
      </h1>
      <p className="hero-sub">
        Distributed queues, intelligent scheduling, delayed messaging, and zero-downtime
        caching — all serverless, all on one platform.
      </p>
      <div className="hero-actions">
        <a href="#services" className="btn-primary">
          <span>Explore Platform</span><span>↓</span>
        </a>
        <a href="#product" className="btn-ghost">View Docs</a>
      </div>
      <div className="hero-stats">
        {STATS.map((s, i) => (
          <div className="hero-stat" key={s.id}>
            <div
              className="hero-stat-num"
              data-idx={i}
              ref={el => { statRefs.current[i] = el; }}
            >
              0
            </div>
            <div className="hero-stat-label">{s.label}</div>
          </div>
        ))}
      </div>
      <div className="scroll-indicator">
        <span>SCROLL</span>
        <div className="scroll-line" />
      </div>
    </section>
  );
}
