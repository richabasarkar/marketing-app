'use client';

import { useState, useEffect } from 'react';
import { ArrowRight, Sparkles, Target, BarChart3, Zap, CheckCircle, ChevronDown } from 'lucide-react';

interface Props {
  onGetStarted: () => void;
}

const FEATURES = [
  { icon: '🏢', title: 'Deep Company Profiling', description: 'Answer 40+ targeted questions about your business, audience, budget, and goals. The more you share, the sharper your strategy.' },
  { icon: '🎯', title: '5 AI-Tailored Strategies', description: 'Get five marketing strategies built specifically for your company — with two highlighted as top picks by our AI.' },
  { icon: '📋', title: 'Full 12-Week Roadmap', description: 'A phase-by-phase marketing plan with KPIs, budget breakdowns, messaging frameworks, and risk mitigation.' },
  { icon: '⚡', title: 'Asana-Style Action Board', description: 'Every strategy broken into weekly tasks you can check off. Filter by priority, phase, or category.' },
  { icon: '💬', title: 'AI Strategist On-Demand', description: 'Marcus, your AI marketing expert, is always available to answer questions and give tailored advice.' },
  { icon: '📊', title: 'Built-In KPI Tracking', description: 'Know exactly what to measure and when. Every phase comes with specific metrics and how to track them.' },
];

const STEPS = [
  { number: '1', label: 'Profile Your Company', description: 'Tell us about your business, goals, budget, and audience in detail.' },
  { number: '2', label: 'Pick Your Strategy', description: 'Review 5 personalized strategies and choose the one that fits best.' },
  { number: '3', label: 'Get Your Full Plan', description: 'Receive a complete 12-week roadmap with tasks, KPIs, and budget guidance.' },
];

const STATS = [
  { value: '12', label: 'Weeks of planning', suffix: '-week' },
  { value: '40', label: 'Data points analyzed', suffix: '+' },
  { value: '5', label: 'Custom strategies generated', suffix: '' },
  { value: '100', label: 'Actionable tasks created', suffix: '+' },
];

export default function HomePage({ onGetStarted }: Props) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', fontFamily: 'DM Sans, sans-serif' }}>

      {/* Nav */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        padding: '0 48px', height: 64,
        background: scrolled ? 'rgba(255,255,255,0.92)' : 'transparent',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        borderBottom: scrolled ? '1px solid var(--border)' : '1px solid transparent',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        transition: 'all 0.3s',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: 9, background: 'linear-gradient(135deg, var(--accent), #9f8fff)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, boxShadow: '0 2px 8px rgba(108,99,255,0.35)' }}>⚡</div>
          <span style={{ fontFamily: 'Bricolage Grotesque', fontWeight: 800, fontSize: 18, color: 'var(--text)', letterSpacing: '-0.02em' }}>StrategyOS</span>
        </div>
        <button onClick={onGetStarted} className="btn-primary" style={{ padding: '9px 22px', fontSize: 14 }}>
          Get Started <ArrowRight size={15} />
        </button>
      </nav>

      {/* Hero */}
      <section style={{
        minHeight: '100vh',
        background: 'linear-gradient(160deg, #f8f7ff 0%, #ede9ff 45%, #f5f3ff 100%)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        padding: '120px 24px 80px', textAlign: 'center', position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(108,99,255,0.12) 0%, transparent 70%)', top: -100, right: -100, pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,101,132,0.08) 0%, transparent 70%)', bottom: 50, left: -50, pointerEvents: 'none' }} />

        <div style={{ position: 'relative', maxWidth: 760, animation: 'slideUp 0.6s ease forwards' }}>
          <div className="purple-pill" style={{ marginBottom: 24 }}>
            <Sparkles size={13} /> AI-Powered Marketing Strategy
          </div>

          <h1 style={{ fontFamily: 'Bricolage Grotesque', fontWeight: 800, fontSize: 'clamp(42px, 6vw, 72px)', lineHeight: 1.08, letterSpacing: '-0.03em', color: 'var(--text)', marginBottom: 22 }}>
            Your complete{' '}
            <span style={{ color: 'var(--accent)' }}>marketing strategy</span>
            {' '}in one place
          </h1>

          <p style={{ fontSize: 19, color: 'var(--text-2)', lineHeight: 1.65, maxWidth: 580, margin: '0 auto 40px' }}>
            Answer a few questions about your business, and our AI generates a personalized 12-week marketing plan with strategies, KPIs, budgets, and a week-by-week action board.
          </p>

          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button onClick={onGetStarted} className="btn-primary" style={{ padding: '14px 32px', fontSize: 16 }}>
              Build My Strategy <ArrowRight size={18} />
            </button>
            <a href="#how-it-works" className="btn-ghost" style={{ padding: '14px 28px', fontSize: 16, textDecoration: 'none' }}>
              See How It Works <ChevronDown size={16} />
            </a>
          </div>

          <div style={{ marginTop: 48, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 24, flexWrap: 'wrap' }}>
            {['No marketing expertise needed', 'Tailored to your budget', 'Ready in under 5 minutes'].map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 7, color: 'var(--text-3)', fontSize: 13, fontWeight: 500 }}>
                <CheckCircle size={14} style={{ color: 'var(--accent)' }} />{item}
              </div>
            ))}
          </div>
        </div>

        {/* Floating preview card */}
        <div style={{ marginTop: 72, position: 'relative', maxWidth: 700, width: '100%', animation: 'float 4s ease-in-out infinite' }}>
          <div style={{ background: 'white', borderRadius: 20, padding: 24, boxShadow: '0 24px 80px rgba(108,99,255,0.18), 0 8px 24px rgba(0,0,0,0.06)', border: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', gap: 6, marginBottom: 20 }}>
              {['#ff5f57','#ffbd2e','#28ca42'].map(c => <div key={c} style={{ width: 12, height: 12, borderRadius: '50%', background: c }} />)}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 16 }}>
              {[
                { label: 'Strategy', value: 'Content-Led Growth', color: 'var(--accent)' },
                { label: 'Timeline', value: '12 Weeks', color: '#16a34a' },
                { label: 'Est. ROI', value: '4-6x', color: '#d97706' },
              ].map((stat, i) => (
                <div key={i} style={{ background: 'var(--surface-2)', borderRadius: 10, padding: '12px 14px', border: '1px solid var(--border)' }}>
                  <p style={{ fontSize: 10, color: 'var(--text-3)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>{stat.label}</p>
                  <p style={{ fontFamily: 'Bricolage Grotesque', fontWeight: 700, fontSize: 14, color: stat.color }}>{stat.value}</p>
                </div>
              ))}
            </div>
            <div style={{ height: 8, background: 'var(--surface-2)', borderRadius: 4, overflow: 'hidden', marginBottom: 12 }}>
              <div style={{ height: '100%', width: '65%', background: 'linear-gradient(90deg, var(--accent), #9f8fff)', borderRadius: 4 }} />
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              {['Week 1: Brand Setup', 'Week 2: Content Plan', 'Week 3: Launch'].map((task, i) => (
                <div key={i} style={{ flex: 1, background: i === 0 ? 'var(--accent-light)' : 'var(--surface-2)', border: `1px solid ${i === 0 ? 'rgba(108,99,255,0.2)' : 'var(--border)'}`, borderRadius: 8, padding: '8px 10px' }}>
                  <p style={{ fontSize: 11, fontWeight: 600, color: i === 0 ? 'var(--accent)' : 'var(--text-2)' }}>{task}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section style={{ background: 'var(--accent)', padding: '56px 48px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 32 }}>
          {STATS.map((stat, i) => (
            <div key={i} style={{ textAlign: 'center' }}>
              <p style={{ fontFamily: 'Bricolage Grotesque', fontWeight: 800, fontSize: 44, color: 'white', lineHeight: 1, marginBottom: 6 }}>
                {stat.value}<span style={{ fontSize: 28 }}>{stat.suffix}</span>
              </p>
              <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)', fontWeight: 500 }}>{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" style={{ padding: '96px 48px', background: 'var(--surface)' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <div className="purple-pill" style={{ marginBottom: 16 }}><Target size={13} /> Simple Process</div>
            <h2 style={{ fontFamily: 'Bricolage Grotesque', fontWeight: 800, fontSize: 42, letterSpacing: '-0.02em', marginBottom: 14 }}>
              From zero to strategy in <span style={{ color: 'var(--accent)' }}>minutes</span>
            </h2>
            <p style={{ color: 'var(--text-2)', fontSize: 17, maxWidth: 500, margin: '0 auto' }}>No marketing experience needed. Just answer honestly and our AI does the heavy lifting.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
            {STEPS.map((step, i) => (
              <div key={i} style={{ position: 'relative' }}>
                {i < STEPS.length - 1 && (
                  <div style={{ position: 'absolute', top: 24, left: 'calc(50% + 40px)', width: 'calc(100% - 80px)', height: 2, background: 'linear-gradient(90deg, var(--accent), var(--border))', zIndex: 0 }} />
                )}
                <div style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 20, padding: 28, textAlign: 'center', position: 'relative', zIndex: 1, boxShadow: '0 2px 12px rgba(108,99,255,0.06)' }}>
                  <div className="step-number" style={{ margin: '0 auto 16px' }}>{step.number}</div>
                  <h3 style={{ fontFamily: 'Bricolage Grotesque', fontWeight: 700, fontSize: 18, marginBottom: 8 }}>{step.label}</h3>
                  <p style={{ fontSize: 14, color: 'var(--text-2)', lineHeight: 1.6 }}>{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: '96px 48px', background: 'var(--bg)' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <div className="purple-pill" style={{ marginBottom: 16 }}><BarChart3 size={13} /> Everything Included</div>
            <h2 style={{ fontFamily: 'Bricolage Grotesque', fontWeight: 800, fontSize: 42, letterSpacing: '-0.02em', marginBottom: 14 }}>
              A complete marketing <span style={{ color: 'var(--accent)' }}>operating system</span>
            </h2>
            <p style={{ color: 'var(--text-2)', fontSize: 17, maxWidth: 520, margin: '0 auto' }}>Everything you need to plan, execute, and measure your marketing — in one place.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
            {FEATURES.map((feature, i) => (
              <div key={i} className="feature-card">
                <div style={{ fontSize: 36, marginBottom: 16 }}>{feature.icon}</div>
                <h3 style={{ fontFamily: 'Bricolage Grotesque', fontWeight: 700, fontSize: 18, marginBottom: 8 }}>{feature.title}</h3>
                <p style={{ fontSize: 14, color: 'var(--text-2)', lineHeight: 1.65 }}>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '96px 48px', background: 'linear-gradient(135deg, var(--accent) 0%, #9f8fff 100%)', textAlign: 'center' }}>
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(255,255,255,0.15)', color: 'white', borderRadius: 100, padding: '6px 14px', fontSize: 13, fontWeight: 600, marginBottom: 24 }}>
            <Zap size={13} /> Free to use · No signup required
          </div>
          <h2 style={{ fontFamily: 'Bricolage Grotesque', fontWeight: 800, fontSize: 46, color: 'white', letterSpacing: '-0.02em', lineHeight: 1.1, marginBottom: 18 }}>Ready to grow your business?</h2>
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 18, marginBottom: 36, lineHeight: 1.6 }}>Build your complete AI marketing strategy in under 5 minutes. No experience required.</p>
          <button
            onClick={onGetStarted}
            style={{ background: 'white', color: 'var(--accent)', border: 'none', borderRadius: 12, padding: '16px 40px', fontFamily: 'Bricolage Grotesque', fontWeight: 700, fontSize: 17, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 10, boxShadow: '0 8px 30px rgba(0,0,0,0.15)', transition: 'all 0.2s' }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'none'; }}
          >
            Get Started Free <ArrowRight size={18} />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background: 'var(--text)', padding: '28px 48px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 18 }}>⚡</span>
          <span style={{ fontFamily: 'Bricolage Grotesque', fontWeight: 700, color: 'white', fontSize: 15 }}>StrategyOS</span>
        </div>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13 }}>Built with AI · Your data stays private</p>
      </footer>
    </div>
  );
}