'use client';

import { useEffect, useRef } from 'react';

const PLANS = [
  {
    tier: 'STARTER',
    price: '$0',
    period: 'Free forever · no credit card',
    features: [
      '1M queue messages/mo',
      '10K scheduled jobs/mo',
      '256MB cache',
      '1 region',
      'Community support',
    ],
    cta: 'Start for free',
    featured: false,
  },
  {
    tier: 'PRO',
    price: '$49',
    period: 'per month · usage-based above limits',
    features: [
      '100M queue messages/mo',
      'Unlimited scheduled jobs',
      '10GB cache',
      '3 regions · <50ms replication',
      '99.99% SLA · email support',
      'OpenTelemetry export',
    ],
    cta: 'Start free trial',
    featured: true,
  },
  {
    tier: 'ENTERPRISE',
    price: 'Custom',
    period: 'Annual contracts · volume discounts',
    features: [
      'Unlimited everything',
      '12 global regions',
      '99.999% SLA',
      'Dedicated support + SRE',
      'Private deployment option',
      'Custom data retention',
    ],
    cta: 'Contact sales',
    featured: false,
  },
];

export default function Pricing() {
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
    <section id="pricing" ref={sectionRef}>
      <div className="section-eyebrow reveal">// Pricing</div>
      <h2 className="section-title reveal reveal-delay-1">
        Simple pricing,<br /><em>no surprises.</em>
      </h2>
      <p style={{ color: 'var(--ink-3)', marginTop: '16px', fontSize: '15px' }} className="reveal reveal-delay-2">
        Pay per message, per cache-GB, and per scheduled job. No cluster management fees.
      </p>

      <div className="pricing-grid reveal">
        {PLANS.map(plan => (
          <div className={`pricing-card${plan.featured ? ' featured' : ''}`} key={plan.tier}>
            <div className="pricing-tier">{plan.tier}</div>
            <div className="pricing-price">{plan.price}</div>
            <div className="pricing-period">{plan.period}</div>
            <ul className="pricing-features">
              {plan.features.map(f => (
                <li className="pricing-feature" key={f}>
                  <span className="pricing-check">✓</span>{f}
                </li>
              ))}
            </ul>
            <button className="btn-pricing">{plan.cta}</button>
          </div>
        ))}
      </div>
    </section>
  );
}
