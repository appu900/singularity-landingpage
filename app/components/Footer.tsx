export default function Footer() {
  return (
    <footer>
      <div className="footer-top">
        <div>
          <div className="footer-brand">Singularity</div>
          <div className="footer-tagline">
            Serverless data infrastructure for distributed systems. Queues, scheduling,
            and caching — all without the ops overhead.
          </div>
        </div>
        <div>
          <div className="footer-col-title">Platform</div>
          <ul className="footer-links">
            <li><a href="#">Distributed Queue</a></li>
            <li><a href="#">Scheduler</a></li>
            <li><a href="#">Delayed Messages</a></li>
            <li><a href="#">Horizontal Cache</a></li>
          </ul>
        </div>
        <div>
          <div className="footer-col-title">Developers</div>
          <ul className="footer-links">
            <li><a href="#">Documentation</a></li>
            <li><a href="#">API Reference</a></li>
            <li><a href="#">SDKs</a></li>
            <li><a href="#">Status Page</a></li>
          </ul>
        </div>
        <div>
          <div className="footer-col-title">Company</div>
          <ul className="footer-links">
            <li><a href="#">About</a></li>
            <li><a href="#">Blog</a></li>
            <li><a href="#">Careers</a></li>
            <li><a href="#">Contact</a></li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <div className="footer-copy">© 2025 Singularity Inc. All rights reserved.</div>
        <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
          <div style={{
            width: '6px', height: '6px', borderRadius: '50%',
            background: 'var(--accent-3)', animation: 'statusPulse 2s infinite',
          }} />
          <span style={{ fontFamily: 'var(--mono)', fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}>
            All systems operational
          </span>
        </div>
      </div>
    </footer>
  );
}
