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

const TICKER_ITEMS = ['AI Marketing Strategy', '12-Week Roadmap', 'KPI Tracking', 'Budget Planning', 'Action Board', 'Brand Messaging', 'Competitor Analysis', 'Lead Generation'];

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

      <style>{`
        @keyframes ticker {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .ticker-track {
          display: flex;
          width: max-content;
          animation: ticker 22s linear infinite;
        }
        .ticker-track:hover {
          animation-play-state: paused;
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .fade-up { animation: fadeUp 0.6s ease forwards; }
        .fade-up-2 { animation: fadeUp 0.6s 0.15s ease forwards; opacity: 0; }
        .fade-up-3 { animation: fadeUp 0.6s 0.3s ease forwards; opacity: 0; }
      `}</style>

      {/* Nav */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        padding: '0 56px', height: 58,
        background: scrolled ? 'rgba(255,255,255,0.97)' : 'transparent',
        borderBottom: scrolled ? '1px solid #e4e2f5' : '1px solid transparent',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        transition: 'all 0.35s',
        backdropFilter: scrolled ? 'blur(16px)' : 'none',
      }}>
        <span style={{ fontFamily: 'Bricolage Grotesque', fontWeight: 800, fontSize: 16, letterSpacing: '-0.03em', color: '#1a1730' }}>
          Strategy<span style={{ color: '#6c63ff' }}>OS</span>
        </span>
        <button
          onClick={onGetStarted}
          style={{ background: '#6c63ff', color: 'white', border: 'none', padding: '8px 20px', fontFamily: 'Bricolage Grotesque', fontWeight: 600, fontSize: 13, cursor: 'pointer', letterSpacing: '0.01em', transition: 'background 0.2s' }}
          onMouseEnter={e => (e.currentTarget.style.background = '#5a52e0')}
          onMouseLeave={e => (e.currentTarget.style.background = '#6c63ff')}
        >
          Get Started
        </button>
      </nav>

      {/* HERO */}
      <section style={{
        minHeight: '100vh',
        display: 'grid',
        gridTemplateColumns: '5fr 4fr',
        borderBottom: '1px solid #e4e2f5',
        background: '#f8f7ff',
      }}>
        {/* Left — copy */}
        <div style={{
          padding: '140px 64px 80px 56px',
          display: 'flex', flexDirection: 'column', justifyContent: 'center',
          borderRight: '1px solid #e4e2f5',
        }}>
          <div className="fade-up" style={{ display: 'inline-block', background: '#6c63ff', color: 'white', padding: '4px 11px', fontSize: 10, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 28, alignSelf: 'flex-start' }}>
            AI Marketing Platform
          </div>

          <h1 className="fade-up-2" style={{
            fontFamily: 'Bricolage Grotesque', fontWeight: 800,
            fontSize: 'clamp(38px, 4.2vw, 62px)',
            lineHeight: 1.05, letterSpacing: '-0.035em',
            color: '#1a1730', marginBottom: 22,
          }}>
            Your full marketing<br />
            strategy.<br />
            <span style={{ color: '#6c63ff' }}>Built in minutes.</span>
          </h1>

          <p className="fade-up-3" style={{ fontSize: 16, color: '#4a4568', lineHeight: 1.75, maxWidth: 400, marginBottom: 36 }}>
            Answer a few questions about your business and get a personalized 12-week marketing plan — with strategies, KPIs, budgets, and a week-by-week action board.
          </p>

          <div className="fade-up-3" style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 56 }}>
            <button
              onClick={onGetStarted}
              style={{ background: '#1a1730', color: 'white', border: 'none', padding: '13px 30px', fontFamily: 'Bricolage Grotesque', fontWeight: 700, fontSize: 14, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 9, transition: 'all 0.2s' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#6c63ff'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = '#1a1730'; }}
            >
              Build My Strategy <ArrowRight size={15} />
            </button>
            <span style={{ fontSize: 12, color: '#8b87a8', letterSpacing: '0.01em' }}>Free · No signup required</span>
          </div>

          {/* Stats row */}
          <div style={{ display: 'flex', gap: 0, borderTop: '1px solid #e4e2f5', paddingTop: 32 }}>
            {[['12', 'week plan'], ['40+', 'data points'], ['5', 'strategies'], ['100+', 'tasks']].map(([val, label], i) => (
              <div key={label} style={{ paddingRight: 32, marginRight: 32, borderRight: i < 3 ? '1px solid #e4e2f5' : 'none' }}>
                <div style={{ fontFamily: 'Bricolage Grotesque', fontWeight: 800, fontSize: 28, color: '#6c63ff', lineHeight: 1 }}>{val}</div>
                <div style={{ fontSize: 11, color: '#8b87a8', marginTop: 4, textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right — mock UI */}
        <div style={{ padding: '140px 56px 80px 48px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ width: '100%', maxWidth: 420, background: 'white', border: '1px solid #e4e2f5', boxShadow: '0 8px 40px rgba(108,99,255,0.10), 0 2px 12px rgba(0,0,0,0.05)' }}>
            {/* Mock header */}
            <div style={{ padding: '14px 18px', borderBottom: '1px solid #e4e2f5', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#fafafa' }}>
              <div style={{ display: 'flex', gap: 6 }}>
                {['#ff5f57','#ffbd2e','#28ca42'].map(c => <div key={c} style={{ width: 10, height: 10, borderRadius: '50%', background: c }} />)}
              </div>
              <span style={{ fontFamily: 'Bricolage Grotesque', fontWeight: 700, fontSize: 12, color: '#4a4568' }}>Your Marketing Plan</span>
              <span style={{ fontSize: 10, color: '#8b87a8', background: '#f3f2ff', padding: '2px 8px' }}>Week 3 of 12</span>
            </div>

            {/* Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', borderBottom: '1px solid #e4e2f5' }}>
              {[['Strategy', 'Content-Led', '#6c63ff'], ['ROI Est.', '4–6x return', '#22c55e'], ['Budget', '$2,000/mo', '#1a1730']].map(([label, val, color], i) => (
                <div key={label} style={{ padding: '14px 16px', borderRight: i < 2 ? '1px solid #e4e2f5' : 'none' }}>
                  <div style={{ fontSize: 9, color: '#8b87a8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 4 }}>{label}</div>
                  <div style={{ fontFamily: 'Bricolage Grotesque', fontWeight: 700, fontSize: 12, color }}>{val}</div>
                </div>
              ))}
            </div>

            {/* Progress */}
            <div style={{ padding: '14px 18px', borderBottom: '1px solid #e4e2f5' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 7 }}>
                <span style={{ fontSize: 11, color: '#4a4568', fontWeight: 600 }}>Overall Progress</span>
                <span style={{ fontSize: 11, color: '#6c63ff', fontWeight: 700 }}>24%</span>
              </div>
              <div style={{ height: 3, background: '#f3f2ff' }}>
                <div style={{ height: '100%', width: '24%', background: '#6c63ff' }} />
              </div>
            </div>

            {/* Phase label */}
            <div style={{ padding: '10px 18px', borderBottom: '1px solid #e4e2f5', background: '#f8f7ff' }}>
              <span style={{ fontSize: 10, color: '#6c63ff', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Phase 1 — Foundation</span>
            </div>

            {/* Tasks */}
            {[
              { week: 'W1', task: 'Set up Google Analytics & tracking', done: true },
              { week: 'W2', task: 'Write 3 pillar blog posts', done: true },
              { week: 'W3', task: 'Launch email welcome sequence', done: false },
              { week: 'W4', task: 'Start LinkedIn content calendar', done: false },
              { week: 'W5', task: 'Run first paid ad experiment', done: false },
            ].map((item, i) => (
              <div key={i} style={{ padding: '11px 18px', borderBottom: '1px solid #f3f2ff', display: 'flex', alignItems: 'center', gap: 10, background: i === 2 ? '#fafbff' : 'white' }}>
                <div style={{ width: 14, height: 14, border: item.done ? 'none' : '1.5px solid #ccc9f0', background: item.done ? '#22c55e' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {item.done && <span style={{ color: 'white', fontSize: 9, fontWeight: 900 }}>✓</span>}
                </div>
                <span style={{ fontSize: 10, color: '#8b87a8', fontWeight: 700, width: 18, flexShrink: 0 }}>{item.week}</span>
                <span style={{ fontSize: 11, color: item.done ? '#8b87a8' : '#1a1730', textDecoration: item.done ? 'line-through' : 'none', fontWeight: item.done ? 400 : 500, flex: 1 }}>{item.task}</span>
                {i === 2 && <span style={{ fontSize: 9, color: '#6c63ff', background: '#ede9ff', padding: '2px 6px', fontWeight: 700 }}>NOW</span>}
              </div>
            ))}

            <div style={{ padding: '12px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 11, color: '#6c63ff', fontWeight: 600, cursor: 'pointer' }}>View all 47 tasks →</span>
              <span style={{ fontSize: 10, color: '#8b87a8' }}>2 of 5 done</span>
            </div>
          </div>
        </div>
      </section>

      {/* ANIMATED TICKER */}
      <div style={{ background: '#6c63ff', padding: '13px 0', overflow: 'hidden' }}>
        <div className="ticker-track">
          {[...TICKER_ITEMS, ...TICKER_ITEMS, ...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
            <span key={i} style={{ display: 'inline-flex', alignItems: 'center', fontSize: 11, color: 'rgba(255,255,255,0.85)', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
              {item}
              <span style={{ display: 'inline-block', width: 4, height: 4, background: 'rgba(255,255,255,0.4)', margin: '0 28px', flexShrink: 0 }} />
            </span>
          ))}
        </div>
      </div>

      {/* HOW IT WORKS */}
      <section style={{ padding: '96px 56px', background: 'white', borderBottom: '1px solid #e4e2f5' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 20, marginBottom: 72 }}>
            <h2 style={{ fontFamily: 'Bricolage Grotesque', fontWeight: 800, fontSize: 38, letterSpacing: '-0.03em', lineHeight: 1, whiteSpace: 'nowrap' }}>How it works</h2>
            <div style={{ flex: 1, height: 1, background: '#e4e2f5' }} />
            <span style={{ fontSize: 12, color: '#8b87a8', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>3 simple steps</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 0 }}>
            {PROCESS.map((item, i) => (
              <div key={i} style={{ paddingRight: i < 2 ? 48 : 0, paddingLeft: i > 0 ? 48 : 0, borderRight: i < 2 ? '1px solid #e4e2f5' : 'none' }}>
                <div style={{ fontFamily: 'Bricolage Grotesque', fontWeight: 800, fontSize: 64, color: '#f0eeff', lineHeight: 1, marginBottom: 20, letterSpacing: '-0.04em' }}>{String(i + 1).padStart(2, '0')}</div>
                <div style={{ fontSize: 10, color: '#6c63ff', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 10 }}>{item.step}</div>
                <h3 style={{ fontFamily: 'Bricolage Grotesque', fontWeight: 700, fontSize: 20, marginBottom: 10, lineHeight: 1.2, color: '#1a1730' }}>{item.title}</h3>
                <p style={{ fontSize: 14, color: '#4a4568', lineHeight: 1.75 }}>{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section style={{ padding: '96px 56px', background: '#f8f7ff', borderBottom: '1px solid #e4e2f5' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 96, alignItems: 'start' }}>
            <div style={{ position: 'sticky', top: 100 }}>
              <div style={{ fontSize: 10, color: '#6c63ff', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 16 }}>Everything included</div>
              <h2 style={{ fontFamily: 'Bricolage Grotesque', fontWeight: 800, fontSize: 36, letterSpacing: '-0.03em', lineHeight: 1.1, marginBottom: 16, color: '#1a1730' }}>
                A complete marketing<br />operating system
              </h2>
              <p style={{ fontSize: 14, color: '#4a4568', lineHeight: 1.75, marginBottom: 32 }}>
                Everything you need to plan, execute, and measure your marketing — in one place. No agency required.
              </p>
              <button
                onClick={onGetStarted}
                style={{ background: '#6c63ff', color: 'white', border: 'none', padding: '12px 24px', fontFamily: 'Bricolage Grotesque', fontWeight: 700, fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, transition: 'background 0.2s' }}
                onMouseEnter={e => (e.currentTarget.style.background = '#5a52e0')}
                onMouseLeave={e => (e.currentTarget.style.background = '#6c63ff')}
              >
                Start for free <ArrowRight size={14} />
              </button>
            </div>

            <div>
              {FEATURES.map((feature, i) => (
                <div
                  key={i}
                  onMouseEnter={() => setHoveredFeature(i)}
                  onMouseLeave={() => setHoveredFeature(null)}
                  style={{
                    padding: '26px 0',
                    borderBottom: '1px solid #e4e2f5',
                    display: 'grid',
                    gridTemplateColumns: '44px 1fr',
                    gap: 20,
                    transition: 'all 0.2s',
                    paddingLeft: hoveredFeature === i ? 14 : 0,
                    background: hoveredFeature === i ? 'rgba(108,99,255,0.02)' : 'transparent',
                  }}
                >
                  <span style={{ fontFamily: 'Bricolage Grotesque', fontWeight: 800, fontSize: 12, color: hoveredFeature === i ? '#6c63ff' : '#d4d0f0', paddingTop: 2, transition: 'color 0.2s', letterSpacing: '0.02em' }}>{feature.number}</span>
                  <div>
                    <h3 style={{ fontFamily: 'Bricolage Grotesque', fontWeight: 700, fontSize: 17, marginBottom: 5, color: '#1a1730' }}>{feature.title}</h3>
                    <p style={{ fontSize: 13, color: '#4a4568', lineHeight: 1.7 }}>{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SPLIT CTA */}
      <section style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
        <div style={{ background: '#1a1730', padding: '80px 64px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: 440 }}>
          <div>
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.14em', marginBottom: 24 }}>Get started today</div>
            <h2 style={{ fontFamily: 'Bricolage Grotesque', fontWeight: 800, fontSize: 40, color: 'white', letterSpacing: '-0.03em', lineHeight: 1.1, marginBottom: 18 }}>
              Ready to grow<br />your business?
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 15, lineHeight: 1.75, maxWidth: 340 }}>
              Build your complete AI marketing strategy in under 5 minutes. No marketing experience required.
            </p>
          </div>
          <button
            onClick={onGetStarted}
            style={{ background: '#6c63ff', color: 'white', border: 'none', padding: '14px 28px', fontFamily: 'Bricolage Grotesque', fontWeight: 700, fontSize: 14, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 9, alignSelf: 'flex-start', transition: 'background 0.2s' }}
            onMouseEnter={e => (e.currentTarget.style.background = '#5a52e0')}
            onMouseLeave={e => (e.currentTarget.style.background = '#6c63ff')}
          >
            Build My Strategy <ArrowRight size={15} />
          </button>
        </div>

        <div style={{ background: '#6c63ff', padding: '80px 64px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          {['Personalized to your exact budget', 'No marketing expertise needed', 'Week-by-week task breakdown', 'Built-in KPI tracking', 'AI strategist available 24/7', 'Free — no signup required'].map((item, i, arr) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 16, paddingTop: 18, paddingBottom: 18, borderBottom: i < arr.length - 1 ? '1px solid rgba(255,255,255,0.12)' : 'none' }}>
              <div style={{ width: 5, height: 5, background: 'rgba(255,255,255,0.6)', flexShrink: 0 }} />
              <span style={{ color: 'white', fontSize: 14, fontWeight: 500 }}>{item}</span>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background: '#1a1730', borderTop: '1px solid rgba(255,255,255,0.06)', padding: '22px 56px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontFamily: 'Bricolage Grotesque', fontWeight: 800, fontSize: 14, color: 'white', letterSpacing: '-0.02em' }}>
          Strategy<span style={{ color: '#6c63ff' }}>OS</span>
        </span>
        <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: 12 }}>Built with AI · Your data stays private</p>
      </footer>
    </div>
  );
}