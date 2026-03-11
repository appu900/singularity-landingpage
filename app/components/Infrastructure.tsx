'use client';

import { useEffect, useRef } from 'react';

const INFRA_CARDS = [
  { badge: 'CONSENSUS', title: 'Raft-based Leader Election', desc: 'Every service uses a Raft consensus protocol for leader election. If a primary node fails, a new leader is elected in under 500ms with no data loss.' },
  { badge: 'STORAGE', title: 'Append-Only Log Engine', desc: 'Messages are persisted to a write-ahead log before acknowledgment. Durability is guaranteed even if the process crashes after ack but before flush.' },
  { badge: 'NETWORKING', title: 'Gossip Protocol Membership', desc: 'Nodes discover each other and detect failures using a gossip-based SWIM protocol. Ring membership is eventually consistent and extremely low overhead.' },
  { badge: 'PARTITIONING', title: 'Consistent Hash Ring', desc: 'The cache and queue use a virtual-node consistent hash ring. Adding or removing a node redistributes only ~1/N of keys, ensuring minimal disruption.' },
  { badge: 'REPLICATION', title: 'Async + Sync Replication', desc: 'Choose synchronous replication for strong consistency (RPO=0) or asynchronous for maximum throughput. Mixed modes supported per-topic or per-key.' },
  { badge: 'OBSERVABILITY', title: 'OpenTelemetry Native', desc: 'Every operation emits structured traces, metrics, and logs in OTLP format. Works with Datadog, Grafana, Honeycomb, or any OTel-compatible backend.' },
];

const REP_STEPS = [
  { num: 'STEP 01', name: 'Write Received', desc: 'Client sends message to the partition leader via HTTP/2 or SDK. The leader assigns a monotonic sequence ID.', delay: '0s' },
  { num: 'STEP 02', name: 'WAL Append', desc: "Leader appends to write-ahead log. The entry is fsync'd to durable storage before acknowledgment is possible.", delay: '0.4s' },
  { num: 'STEP 03', name: 'Follower Replicate', desc: 'Followers pull WAL segments from the leader. Sync mode waits for quorum (n/2+1) before acking. Async mode acks immediately.', delay: '0.8s' },
  { num: 'STEP 04', name: 'Cross-Region Relay', desc: 'A dedicated replication bus streams committed entries to remote regions over persistent multiplexed TCP tunnels (<50ms lag).', delay: '1.2s' },
  { num: 'STEP 05', name: 'Client ACK', desc: 'Once durability requirement is satisfied, the leader returns ACK. Consumers can now fetch the message from any replica.', delay: '1.6s' },
];

export default function Infrastructure() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    let animId: number;
    let pulses: { x: number; y: number; r: number; maxR: number; alpha: number; color: string }[] = [];

    const resize = () => {
      canvas.width = canvas.parentElement!.offsetWidth;
      canvas.height = canvas.parentElement!.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const spawnInterval = setInterval(() => {
      pulses.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: 0, maxR: 60 + Math.random() * 80,
        alpha: 0.3,
        color: Math.random() > 0.5 ? '#0038ff' : '#00c896',
      });
    }, 800);

    function animate() {
      ctx.clearRect(0, 0, canvas!.width, canvas!.height);
      pulses = pulses.filter(p => p.alpha > 0.01);
      pulses.forEach(p => {
        p.r += 1.5; p.alpha *= 0.97;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.strokeStyle = p.color; ctx.globalAlpha = p.alpha;
        ctx.lineWidth = 1.5; ctx.stroke(); ctx.globalAlpha = 1;
      });
      animId = requestAnimationFrame(animate);
    }
    animate();

    return () => {
      cancelAnimationFrame(animId);
      clearInterval(spawnInterval);
      window.removeEventListener('resize', resize);
    };
  }, []);

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
    <section id="infrastructure" ref={sectionRef}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div className="section-eyebrow reveal">// Infrastructure</div>
        <h2 className="section-title reveal reveal-delay-1" style={{ color: '#fff' }}>
          How Singularity<br /><em>stays alive.</em>
        </h2>

        {/* NODE DIAGRAM */}
        <div className="infra-diagram">
          <canvas className="infra-canvas" ref={canvasRef} />
          <div style={{ position: 'relative', zIndex: 2, width: '100%', maxWidth: '900px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '32px', fontFamily: 'var(--mono)', fontSize: '11px', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.1em' }}>
              PRIMARY REGION — US-EAST-1
            </div>
            <div className="infra-nodes">
              <div className="infra-node">
                <div className="infra-node-icon">⬡</div>
                <div className="infra-node-name">QUEUE<br />NODE-1</div>
                <div className="infra-node-status" />
              </div>
              <div className="infra-node">
                <div className="infra-node-icon">⬡</div>
                <div className="infra-node-name">QUEUE<br />NODE-2</div>
                <div className="infra-node-status" />
              </div>
              <div className="infra-node" style={{ background: 'rgba(0,56,255,0.15)', borderColor: 'rgba(0,56,255,0.4)' }}>
                <div className="infra-node-icon">◈</div>
                <div className="infra-node-name">CACHE<br />PRIMARY</div>
                <div className="infra-node-status" />
              </div>
              <div className="infra-node">
                <div className="infra-node-icon">◷</div>
                <div className="infra-node-name">SCHED<br />NODE-1</div>
                <div className="infra-node-status" />
              </div>
              <div className="infra-node">
                <div className="infra-node-icon">◈</div>
                <div className="infra-node-name">CACHE<br />REPLICA</div>
                <div className="infra-node-status" />
              </div>
            </div>
            <div style={{ textAlign: 'center', marginTop: '20px', fontFamily: 'var(--mono)', fontSize: '10px', color: 'rgba(0,200,150,0.7)', letterSpacing: '0.08em' }}>
              ⟵ REPLICATING TO US-WEST, EU-CENTRAL, AP-SOUTHEAST ⟶
            </div>
          </div>
        </div>

        {/* INFRA DETAIL CARDS */}
        <div className="infra-detail-grid reveal">
          {INFRA_CARDS.map((c, i) => (
            <div className={`infra-detail-card${i > 0 ? ` reveal-delay-${Math.min(i, 4)}` : ''}`} key={c.badge}>
              <div className="infra-badge">{c.badge}</div>
              <div className="infra-detail-title">{c.title}</div>
              <div className="infra-detail-desc">{c.desc}</div>
            </div>
          ))}
        </div>

        {/* REPLICATION FLOW */}
        <div className="replication-section reveal">
          <div className="replication-title">Replication Pipeline</div>
          <div className="replication-subtitle">How every write travels from producer to all replicas</div>
          <div className="replication-flow">
            {REP_STEPS.map(step => (
              <div className="rep-step" key={step.num}>
                <div className="rep-step-num">{step.num}</div>
                <div className="rep-step-name">{step.name}</div>
                <div className="rep-step-desc">{step.desc}</div>
                <div className="rep-indicator">
                  <div className="rep-indicator-fill" style={{ animationDelay: step.delay }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
