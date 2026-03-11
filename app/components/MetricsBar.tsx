'use client';

import { useEffect, useRef } from 'react';

const METRICS = [
  { dot: 'green', label: 'Queue Throughput', id: 'm1', value: '1,240,000 msg/s' },
  { dot: 'blue', label: 'Cache Hit Rate', id: 'm2', value: '99.8%' },
  { dot: 'green', label: 'Scheduler Jobs', value: '847K active' },
  { dot: 'orange', label: 'Avg Latency', value: '0.4ms' },
  { dot: 'green', label: 'Replication Lag', value: '<50ms' },
  { dot: 'blue', label: 'Uptime', value: '100.00%' },
  { dot: 'green', label: 'Regions', value: '12 active' },
];

export default function MetricsBar() {
  const m1Ref = useRef<HTMLSpanElement>(null);
  const m2Ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      if (m1Ref.current) {
        const v = (1200000 + Math.floor(Math.random() * 80000)).toLocaleString();
        m1Ref.current.textContent = v + ' msg/s';
      }
      if (m2Ref.current) {
        const v = (99.7 + Math.random() * 0.3).toFixed(1);
        m2Ref.current.textContent = v + '%';
      }
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const items = [...METRICS, ...METRICS];

  return (
    <div className="metrics-bar">
      <div className="metrics-scroll">
        {items.map((m, i) => (
          <div className="metric-item" key={i}>
            <div className={`metric-dot ${m.dot}`} />
            <span className="metric-label">{m.label}</span>
            <span
              className="metric-value"
              ref={i === 0 ? m1Ref : i === 1 ? m2Ref : undefined}
            >
              {m.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
