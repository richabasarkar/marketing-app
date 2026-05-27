'use client';

import { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';

interface Props {
  onGetStarted: () => void;
}

const FEATURES = [
  { number: '01', title: 'Deep Company Profiling', description: 'Answer 40+ targeted questions about your business, audience, budget, and goals. The more you share, the sharper your strategy.' },
  { number: '02', title: '5 AI-Tailored Strategies', description: 'Get five marketing strategies built specifically for your company — with two highlighted as top picks.' },
  { number: '03', title: 'Full 12-Week Roadmap', description: 'A phase-by-phase plan with KPIs, budget breakdowns, messaging frameworks, and risk mitigation.' },
  { number: '04', title: 'Week-by-Week Action Board', description: 'Every strategy broken into tasks you can check off. Filter by priority, phase, or category.' },
  { number: '05', title: 'AI Strategist On-Demand', description: 'Marcus, your AI marketing expert, answers questions and gives tailored advice throughout your journey.' },
  { number: '06', title: 'Built-In KPI Tracking', description: 'Know exactly what to measure and when. Every phase comes with specific metrics and tracking methods.' },
];

const PROCESS = [
  { step: 'Step 01', title: 'Profile Your Company', description: 'Tell us about your business, goals, budget, and audience. The more honest you are, the better the output.' },
  { step: 'Step 02', title: 'Pick Your Strategy', description: 'Review 5 personalized strategies and choose the one that excites you most. Our AI flags the top two.' },
  { step: 'Step 03', title: 'Execute Your Plan', description: 'Get a complete 12-week roadmap with tasks, KPIs, and budget guidance — ready to act on immediately.' },
];

export default function HomePage({ onGetStarted }: Props) {
  const [scrolled, setScrolled] = useState(false);
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: '#ffffff', fontFamily: 'DM Sans, sans-serif', color: '#1a1730' }}>

      {/* Nav */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        padding: '0 48px', height: 60,
        background: scrolled ? 'rgba(255,255,255,0.96)' : 'transparent',
        borderBottom: scrolled ? '1px solid #e4e2f5' : '1px solid transparent',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        transition: 'all 0.4s',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
      }}>
        <span style={{ fontFamily: 'Bricolage Grotesque', fontWeight: 800, fontSize: 17, letterSpacing: '-0.03em', color: '#1a1730' }}>
          Strategy<span style={{ color: '#6c63ff' }}>OS</span>
        </span>
        <button
          onClick={onGetStarted}
          style={{ background: '#6c63ff', color: 'white', border: 'none', padding: '9px 22px', fontFamily: 'Bricolage Grotesque', fontWeight: 600, fontSize: 13, cursor: 'pointer', letterSpacing: '0.01em', transition: 'background 0.2s' }}
          onMouseEnter={e => (e.currentTarget.style.background = '#5a52e0')}
          onMouseLeave={e => (e.currentTarget.style.background = '#6c63ff')}
        >
          Get Started
        </button>
      </nav>

      {/* Hero — asymmetric, editorial */}
      <section style={{
        minHeight: '100vh',
        padding: '0 48px',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        alignItems: 'center',
        gap: 0,
        borderBottom: '1px solid #e4e2f5',
        background: '#f8f7ff',
      }}>
        {/* Left */}
        <div style={{ paddingTop: 120, paddingBottom: 80, paddingRight: 64 }}>
          <div style={{ display: 'inline-block', background: '#6c63ff', color: 'white', padding: '5px 12px', fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 32 }}>
            AI Marketing Platform
          </div>
          <h1 style={{
            fontFamily: 'Bricolage Grotesque', fontWeight: 800,
            fontSize: 'clamp(48px, 5.5vw, 80px)',
            lineHeight: 1.0, letterSpacing: '-0.04em',
            color: '#1a1730', marginBottom: 28,
          }}>
            Your full marketing strategy.<br />
            <span style={{ color: '#6c63ff' }}>Built in minutes.</span>
          </h1>
          <p style={{ fontSize: 18, color: '#4a4568', lineHeight: 1.7, maxWidth: 440, marginBottom: 40 }}>
            Answer questions about your business and get a personalized 12-week marketing plan — with strategies, KPIs, budgets, and a week-by-week action board.
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
            <button
              onClick={onGetStarted}
              style={{ background: '#1a1730', color: 'white', border: 'none', padding: '15px 36px', fontFamily: 'Bricolage Grotesque', fontWeight: 700, fontSize: 15, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10, transition: 'all 0.2s' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#6c63ff'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = '#1a1730'; }}
            >
              Build My Strategy <ArrowRight size={16} />
            </button>
            <span style={{ fontSize: 13, color: '#8b87a8' }}>Free · No signup required</span>
          </div>

          {/* Trust row */}
          <div style={{ marginTop: 64, display: 'flex', gap: 40 }}>
            {[['12', 'week plan'], ['40+', 'data points'], ['5', 'strategies']].map(([val, label]) => (
              <div key={label}>
                <div style={{ fontFamily: 'Bricolage Grotesque', fontWeight: 800, fontSize: 32, color: '#6c63ff', lineHeight: 1 }}>{val}</div>
                <div style={{ fontSize: 12, color: '#8b87a8', marginTop: 3, textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right — mock UI panel */}
        <div style={{ paddingTop: 120, paddingBottom: 80, paddingLeft: 48, borderLeft: '1px solid #e4e2f5', height: '100%', display: 'flex', alignItems: 'center' }}>
          <div style={{ width: '100%', background: 'white', border: '1px solid #e4e2f5' }}>
            {/* Mock header */}
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #e4e2f5', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontFamily: 'Bricolage Grotesque', fontWeight: 700, fontSize: 13, color: '#1a1730' }}>Your Marketing Plan</span>
              <span style={{ fontSize: 11, color: '#8b87a8', background: '#f3f2ff', padding: '3px 8px' }}>Week 3 of 12</span>
            </div>
            {/* Mock stats */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', borderBottom: '1px solid #e4e2f5' }}>
              {[['Strategy', 'Content-Led Growth', '#6c63ff'], ['ROI Est.', '4–6x return', '#22c55e'], ['Budget', '$2,000/mo', '#1a1730']].map(([label, val, color]) => (
                <div key={label} style={{ padding: '16px 20px', borderRight: '1px solid #e4e2f5' }}>
                  <div style={{ fontSize: 10, color: '#8b87a8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>{label}</div>
                  <div style={{ fontFamily: 'Bricolage Grotesque', fontWeight: 700, fontSize: 13, color }}>{val}</div>
                </div>
              ))}
            </div>
            {/* Mock progress */}
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #e4e2f5' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ fontSize: 11, color: '#4a4568', fontWeight: 600 }}>Overall Progress</span>
                <span style={{ fontSize: 11, color: '#6c63ff', fontWeight: 700 }}>24%</span>
              </div>
              <div style={{ height: 4, background: '#f3f2ff' }}>
                <div style={{ height: '100%', width: '24%', background: '#6c63ff' }} />
              </div>
            </div>
            {/* Mock tasks */}
            {[
              { week: 'W1', task: 'Set up Google Analytics & tracking', done: true },
              { week: 'W2', task: 'Write 3 pillar blog posts', done: true },
              { week: 'W3', task: 'Launch email welcome sequence', done: false },
              { week: 'W4', task: 'Start LinkedIn content calendar', done: false },
            ].map((item, i) => (
              <div key={i} style={{ padding: '12px 20px', borderBottom: '1px solid #f3f2ff', display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 16, height: 16, border: item.done ? 'none' : '1.5px solid #ccc9f0', background: item.done ? '#22c55e' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {item.done && <span style={{ color: 'white', fontSize: 10, fontWeight: 900 }}>✓</span>}
                </div>
                <span style={{ fontSize: 11, color: '#8b87a8', fontWeight: 700, width: 20, flexShrink: 0 }}>{item.week}</span>
                <span style={{ fontSize: 12, color: item.done ? '#8b87a8' : '#1a1730', textDecoration: item.done ? 'line-through' : 'none', fontWeight: item.done ? 400 : 500 }}>{item.task}</span>
              </div>
            ))}
            <div style={{ padding: '12px 20px' }}>
              <span style={{ fontSize: 11, color: '#6c63ff', fontWeight: 600, cursor: 'pointer' }}>View all 47 tasks →</span>
            </div>
          </div>
        </div>
      </section>

      {/* Marquee strip */}
      <div style={{ background: '#6c63ff', padding: '14px 0', overflow: 'hidden', whiteSpace: 'nowrap' }}>
        {[...Array(3)].map((_, i) => (
          <span key={i} style={{ display: 'inline-block', paddingRight: 48, fontSize: 12, color: 'rgba(255,255,255,0.8)', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            AI Marketing Strategy &nbsp;&nbsp;·&nbsp;&nbsp; 12-Week Roadmap &nbsp;&nbsp;·&nbsp;&nbsp; KPI Tracking &nbsp;&nbsp;·&nbsp;&nbsp; Budget Planning &nbsp;&nbsp;·&nbsp;&nbsp; Action Board &nbsp;&nbsp;·&nbsp;&nbsp; Brand Messaging &nbsp;&nbsp;·&nbsp;&nbsp;
          </span>
        ))}
      </div>

      {/* Process — horizontal numbered */}
      <section style={{ padding: '96px 48px', background: 'white', borderBottom: '1px solid #e4e2f5' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 16, marginBottom: 64 }}>
            <h2 style={{ fontFamily: 'Bricolage Grotesque', fontWeight: 800, fontSize: 42, letterSpacing: '-0.03em', lineHeight: 1 }}>How it works</h2>
            <div style={{ flex: 1, height: 1, background: '#e4e2f5', marginBottom: 8 }} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 0 }}>
            {PROCESS.map((item, i) => (
              <div key={i} style={{ padding: '40px 40px 40px 0', borderRight: i < 2 ? '1px solid #e4e2f5' : 'none', paddingLeft: i > 0 ? 40 : 0 }}>
                <div style={{ fontFamily: 'Bricolage Grotesque', fontWeight: 800, fontSize: 52, color: '#e4e2f5', lineHeight: 1, marginBottom: 20 }}>{item.step.split(' ')[1]}</div>
                <div style={{ fontSize: 11, color: '#6c63ff', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12 }}>{item.step}</div>
                <h3 style={{ fontFamily: 'Bricolage Grotesque', fontWeight: 700, fontSize: 22, marginBottom: 12, lineHeight: 1.2 }}>{item.title}</h3>
                <p style={{ fontSize: 14, color: '#4a4568', lineHeight: 1.7 }}>{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features — editorial list */}
      <section style={{ padding: '96px 48px', background: '#f8f7ff', borderBottom: '1px solid #e4e2f5' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 80, alignItems: 'start' }}>
            <div style={{ position: 'sticky', top: 100 }}>
              <div style={{ fontSize: 11, color: '#6c63ff', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 16 }}>Everything included</div>
              <h2 style={{ fontFamily: 'Bricolage Grotesque', fontWeight: 800, fontSize: 42, letterSpacing: '-0.03em', lineHeight: 1.1, marginBottom: 20 }}>
                A complete marketing operating system
              </h2>
              <p style={{ fontSize: 15, color: '#4a4568', lineHeight: 1.7, marginBottom: 32 }}>
                Everything you need to plan, execute, and measure your marketing — in one place. No agency required.
              </p>
              <button
                onClick={onGetStarted}
                style={{ background: '#6c63ff', color: 'white', border: 'none', padding: '13px 28px', fontFamily: 'Bricolage Grotesque', fontWeight: 700, fontSize: 14, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, transition: 'background 0.2s' }}
                onMouseEnter={e => (e.currentTarget.style.background = '#5a52e0')}
                onMouseLeave={e => (e.currentTarget.style.background = '#6c63ff')}
              >
                Start for free <ArrowRight size={15} />
              </button>
            </div>

            <div>
              {FEATURES.map((feature, i) => (
                <div
                  key={i}
                  onMouseEnter={() => setHoveredFeature(i)}
                  onMouseLeave={() => setHoveredFeature(null)}
                  style={{
                    padding: '28px 0',
                    borderBottom: '1px solid #e4e2f5',
                    display: 'grid',
                    gridTemplateColumns: '48px 1fr',
                    gap: 24,
                    cursor: 'default',
                    transition: 'all 0.2s',
                    background: hoveredFeature === i ? 'rgba(108,99,255,0.03)' : 'transparent',
                    marginLeft: hoveredFeature === i ? -16 : 0,
                    paddingLeft: hoveredFeature === i ? 16 : 0,
                  }}
                >
                  <span style={{ fontFamily: 'Bricolage Grotesque', fontWeight: 800, fontSize: 13, color: hoveredFeature === i ? '#6c63ff' : '#ccc9f0', paddingTop: 3, transition: 'color 0.2s' }}>{feature.number}</span>
                  <div>
                    <h3 style={{ fontFamily: 'Bricolage Grotesque', fontWeight: 700, fontSize: 18, marginBottom: 6, color: '#1a1730' }}>{feature.title}</h3>
                    <p style={{ fontSize: 14, color: '#4a4568', lineHeight: 1.65 }}>{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Split CTA */}
      <section style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', minHeight: 400 }}>
        <div style={{ background: '#1a1730', padding: '80px 64px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 24 }}>Get started today</div>
            <h2 style={{ fontFamily: 'Bricolage Grotesque', fontWeight: 800, fontSize: 42, color: 'white', letterSpacing: '-0.03em', lineHeight: 1.1, marginBottom: 20 }}>
              Ready to grow your business?
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: 16, lineHeight: 1.7, maxWidth: 380 }}>
              Build your complete AI marketing strategy in under 5 minutes. No marketing experience required.
            </p>
          </div>
          <button
            onClick={onGetStarted}
            style={{ background: '#6c63ff', color: 'white', border: 'none', padding: '15px 32px', fontFamily: 'Bricolage Grotesque', fontWeight: 700, fontSize: 15, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 10, alignSelf: 'flex-start', marginTop: 40, transition: 'background 0.2s' }}
            onMouseEnter={e => (e.currentTarget.style.background = '#5a52e0')}
            onMouseLeave={e => (e.currentTarget.style.background = '#6c63ff')}
          >
            Build My Strategy <ArrowRight size={16} />
          </button>
        </div>
        <div style={{ background: '#6c63ff', padding: '80px 64px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          {[
            'Personalized to your exact budget',
            'No marketing expertise needed',
            'Week-by-week task breakdown',
            'Built-in KPI tracking',
            'AI strategist available 24/7',
            'Free — no signup required',
          ].map((item, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 16, paddingTop: 16, paddingBottom: 16, borderBottom: i < 5 ? '1px solid rgba(255,255,255,0.15)' : 'none' }}>
              <div style={{ width: 6, height: 6, background: 'white', flexShrink: 0 }} />
              <span style={{ color: 'white', fontSize: 15, fontWeight: 500 }}>{item}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background: '#1a1730', borderTop: '1px solid rgba(255,255,255,0.08)', padding: '24px 48px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontFamily: 'Bricolage Grotesque', fontWeight: 800, fontSize: 15, color: 'white', letterSpacing: '-0.02em' }}>
          Strategy<span style={{ color: '#6c63ff' }}>OS</span>
        </span>
        <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 12 }}>Built with AI · Your data stays private</p>
      </footer>
    </div>
  );
}