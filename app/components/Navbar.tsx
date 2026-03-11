'use client';

import { useEffect, useRef, useState } from 'react';

export default function Navbar() {
  const navRef = useRef<HTMLElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;
    const onScroll = () => {
      nav.style.padding = window.scrollY > 40 ? '14px 48px' : '20px 48px';
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <nav ref={navRef}>
        <div className="nav-logo">
          <div className="nav-logo-mark">
            <svg viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="#0038ff" strokeWidth="2" />
              <circle cx="12" cy="12" r="4" fill="#0038ff" />
              <line x1="12" y1="2" x2="12" y2="7" stroke="#0038ff" strokeWidth="2" />
              <line x1="12" y1="17" x2="12" y2="22" stroke="#0038ff" strokeWidth="2" />
              <line x1="2" y1="12" x2="7" y2="12" stroke="#0038ff" strokeWidth="2" />
              <line x1="17" y1="12" x2="22" y2="12" stroke="#0038ff" strokeWidth="2" />
            </svg>
          </div>
          Singularity
        </div>
        <div className="nav-links">
          <a href="#services">Services</a>
          <a href="#product">Product</a>
          <a href="#infrastructure">Infrastructure</a>
          <a href="#pricing">Pricing</a>
          <a href="#cta" className="nav-cta">Get Started →</a>
        </div>
        <button
          className="nav-hamburger"
          onClick={() => setMenuOpen(true)}
          aria-label="Open menu"
        >
          <span />
          <span />
          <span />
        </button>
      </nav>

      {menuOpen && (
        <div className="mobile-menu open">
          <button className="mobile-menu-close" onClick={closeMenu} aria-label="Close menu">✕</button>
          <a href="#services" onClick={closeMenu}>Services</a>
          <a href="#product" onClick={closeMenu}>Product</a>
          <a href="#infrastructure" onClick={closeMenu}>Infrastructure</a>
          <a href="#pricing" onClick={closeMenu}>Pricing</a>
          <a href="#cta" onClick={closeMenu} style={{ color: 'var(--accent)' }}>Get Started →</a>
        </div>
      )}
    </>
  );
}
