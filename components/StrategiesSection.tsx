'use client';

import { MarketingStrategy } from '@/types';
import { Rocket, Target, Megaphone, Users, TrendingUp, Star, Zap, Heart, Globe, Mail, CheckCircle, Clock, DollarSign, BarChart3, ThumbsUp, ChevronRight } from 'lucide-react';

interface Props {
  strategies: MarketingStrategy[];
  selectedStrategy: MarketingStrategy | null;
  onSelect: (s: MarketingStrategy) => void;
  onContinue: () => void;
}

const iconMap: Record<string, React.ReactNode> = {
  rocket: <Rocket size={22} />,
  target: <Target size={22} />,
  megaphone: <Megaphone size={22} />,
  users: <Users size={22} />,
  'trending-up': <TrendingUp size={22} />,
  star: <Star size={22} />,
  zap: <Zap size={22} />,
  heart: <Heart size={22} />,
  globe: <Globe size={22} />,
  mail: <Mail size={22} />,
};

const colorMap: Record<string, { bg: string; border: string; text: string; glow: string }> = {
  purple: { bg: 'rgba(108,99,255,0.12)', border: 'rgba(108,99,255,0.4)', text: '#a89cff', glow: 'rgba(108,99,255,0.2)' },
  pink: { bg: 'rgba(255,101,132,0.12)', border: 'rgba(255,101,132,0.4)', text: '#ff91a8', glow: 'rgba(255,101,132,0.15)' },
  green: { bg: 'rgba(67,233,123,0.12)', border: 'rgba(67,233,123,0.4)', text: '#43e97b', glow: 'rgba(67,233,123,0.15)' },
  yellow: { bg: 'rgba(248,169,53,0.12)', border: 'rgba(248,169,53,0.4)', text: '#f8a935', glow: 'rgba(248,169,53,0.15)' },
  blue: { bg: 'rgba(56,182,255,0.12)', border: 'rgba(56,182,255,0.4)', text: '#56b6ff', glow: 'rgba(56,182,255,0.15)' },
  orange: { bg: 'rgba(255,127,61,0.12)', border: 'rgba(255,127,61,0.4)', text: '#ff7f3d', glow: 'rgba(255,127,61,0.15)' },
};

const effortColors = { Low: '#43e97b', Medium: '#f8a935', High: '#ff91a8' };

function StrategyCard({ strategy, isSelected, onSelect }: { strategy: MarketingStrategy; isSelected: boolean; onSelect: () => void }) {
  const colors = colorMap[strategy.color] || colorMap.purple;
  const icon = iconMap[strategy.icon] || <Target size={22} />;

  return (
    <div
      onClick={onSelect}
      style={{
        background: isSelected ? 'var(--surface-2)' : 'var(--surface)',
        border: `2px solid ${isSelected ? colors.border : strategy.isRecommended ? 'rgba(67,233,123,0.35)' : 'var(--border)'}`,
        borderRadius: 20, padding: 24, cursor: 'pointer',
        transition: 'all 0.25s', position: 'relative', overflow: 'hidden',
        boxShadow: isSelected ? `0 0 30px ${colors.glow}` : 'none',
        transform: isSelected ? 'translateY(-2px)' : 'none',
        animation: 'fadeIn 0.4s ease forwards',
      }}
    >
      {/* Top gradient bar */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, ${colors.text}, transparent)`, opacity: isSelected ? 1 : 0.4, transition: 'opacity 0.2s' }} />

      {/* Recommended badge */}
      {strategy.isRecommended && (
        <div style={{ position: 'absolute', top: 14, right: 14 }}>
          <span className="badge badge-green" style={{ fontSize: 11 }}>
            <Star size={10} fill="currentColor" /> Top Pick
          </span>
        </div>
      )}

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, marginBottom: 16 }}>
        <div style={{
          width: 48, height: 48, borderRadius: 14, flexShrink: 0,
          background: colors.bg, border: `1px solid ${colors.border}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: colors.text,
        }}>
          {icon}
        </div>
        <div style={{ flex: 1, paddingRight: strategy.isRecommended ? 80 : 0 }}>
          <h3 style={{ fontFamily: 'Bricolage Grotesque', fontWeight: 800, fontSize: 18, marginBottom: 3, lineHeight: 1.2 }}>
            {strategy.name}
          </h3>
          <p style={{ color: colors.text, fontSize: 13, fontWeight: 500 }}>{strategy.tagline}</p>
        </div>
      </div>

      {/* Description */}
      <p style={{ color: 'var(--text-2)', fontSize: 14, lineHeight: 1.65, marginBottom: 16 }}>
        {strategy.description}
      </p>

      {/* Why it fits */}
      {strategy.whyItFitsYou && (
        <div style={{ background: 'var(--surface-2)', borderRadius: 10, padding: '10px 14px', marginBottom: 16, borderLeft: `3px solid ${colors.text}` }}>
          <p style={{ fontSize: 12, color: 'var(--text-2)', lineHeight: 1.5 }}>
            <strong style={{ color: colors.text }}>Why this fits you: </strong>{strategy.whyItFitsYou}
          </p>
        </div>
      )}

      {/* Recommendation reason */}
      {strategy.isRecommended && strategy.recommendationReason && (
        <div style={{ background: 'rgba(67,233,123,0.08)', border: '1px solid rgba(67,233,123,0.25)', borderRadius: 10, padding: '10px 14px', marginBottom: 16 }}>
          <p style={{ fontSize: 12, color: '#43e97b', lineHeight: 1.5 }}>
            <strong>⭐ AI Recommendation: </strong>{strategy.recommendationReason}
          </p>
        </div>
      )}

      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 8, marginBottom: 16 }}>
        {[
          { icon: <Clock size={12} />, label: 'Time to Results', value: strategy.estimatedTimeToResults },
          { icon: <DollarSign size={12} />, label: 'Cost Range', value: strategy.estimatedCostRange },
          { icon: <BarChart3 size={12} />, label: 'Effort', value: strategy.effortLevel, color: effortColors[strategy.effortLevel] },
          { icon: <TrendingUp size={12} />, label: 'Potential ROI', value: strategy.potentialROI },
        ].map((stat, i) => (
          <div key={i} style={{ background: 'var(--surface-2)', borderRadius: 8, padding: '8px 10px', border: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--text-3)', marginBottom: 3 }}>
              {stat.icon}<span style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{stat.label}</span>
            </div>
            <div style={{ fontSize: 12, fontWeight: 700, color: stat.color || 'var(--text)', fontFamily: 'Bricolage Grotesque' }}>{stat.value}</div>
          </div>
        ))}
      </div>

      {/* Channels */}
      {strategy.channels?.length > 0 && (
        <div style={{ marginBottom: 14 }}>
          <p style={{ fontSize: 11, color: 'var(--text-3)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>Channels</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {strategy.channels.map(ch => (
              <span key={ch} style={{ padding: '4px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600, background: colors.bg, color: colors.text, border: `1px solid ${colors.border}` }}>{ch}</span>
            ))}
          </div>
        </div>
      )}

      {/* Pros and cons */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
        <div>
          <p style={{ fontSize: 11, color: '#43e97b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>✓ Pros</p>
          {strategy.pros?.slice(0, 3).map((p, i) => <p key={i} style={{ fontSize: 12, color: 'var(--text-2)', marginBottom: 4, paddingLeft: 8, borderLeft: '2px solid rgba(67,233,123,0.3)' }}>{p}</p>)}
        </div>
        <div>
          <p style={{ fontSize: 11, color: '#ff91a8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>✗ Cons</p>
          {strategy.cons?.slice(0, 2).map((c, i) => <p key={i} style={{ fontSize: 12, color: 'var(--text-2)', marginBottom: 4, paddingLeft: 8, borderLeft: '2px solid rgba(255,101,132,0.3)' }}>{c}</p>)}
        </div>
      </div>

      {/* Select indicator */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 12, color: 'var(--text-3)' }}>{strategy.bestFor}</span>
        {isSelected ? (
          <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: colors.text, fontSize: 13, fontWeight: 700 }}>
            <CheckCircle size={16} /> Selected
          </span>
        ) : (
          <span style={{ fontSize: 12, color: 'var(--text-3)' }}>Click to select →</span>
        )}
      </div>
    </div>
  );
}

export default function StrategiesSection({ strategies, selectedStrategy, onSelect, onContinue }: Props) {
  const recommended = strategies.filter(s => s.isRecommended);

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto', animation: 'fadeIn 0.4s ease' }}>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <span className="badge badge-purple" style={{ marginBottom: 10, display: 'inline-flex' }}>Step 2 of 5</span>
        <h1 style={{ fontFamily: 'Bricolage Grotesque', fontSize: 38, fontWeight: 800, letterSpacing: '-0.03em', marginBottom: 10 }}>
          Your <span style={{ color: 'var(--accent)' }}>5 personalized</span> strategies
        </h1>
        <p style={{ color: 'var(--text-2)', fontSize: 16, maxWidth: 640 }}>
          Our AI analyzed your profile and generated these strategies specifically for your company. Read each one carefully, then pick the one that excites you most.
        </p>
      </div>

      {/* Top picks callout */}
      {recommended.length > 0 && (
        <div style={{ background: 'rgba(67,233,123,0.08)', border: '1px solid rgba(67,233,123,0.3)', borderRadius: 16, padding: '16px 20px', marginBottom: 28, display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 24 }}>⭐</span>
          <div>
            <p style={{ fontFamily: 'Bricolage Grotesque', fontWeight: 700, fontSize: 15, color: '#43e97b', marginBottom: 2 }}>
              AI Top Picks for You
            </p>
            <p style={{ fontSize: 13, color: 'var(--text-2)' }}>
              Based on your profile, <strong style={{ color: 'var(--text)' }}>{recommended.map(r => r.name).join(' and ')}</strong> are the best fit for your goals and budget.
            </p>
          </div>
        </div>
      )}

      {/* Strategy cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 32 }}>
        {strategies.map(strategy => (
          <StrategyCard
            key={strategy.id}
            strategy={strategy}
            isSelected={selectedStrategy?.id === strategy.id}
            onSelect={() => onSelect(strategy)}
          />
        ))}
      </div>

      {/* CTA */}
      <div style={{
        background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 20,
        padding: '28px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        position: 'sticky', bottom: 24,
        boxShadow: '0 -8px 40px rgba(0,0,0,0.4)',
      }}>
        <div>
          {selectedStrategy ? (
            <>
              <p style={{ fontFamily: 'Bricolage Grotesque', fontSize: 18, fontWeight: 700, marginBottom: 2 }}>
                ✅ <span style={{ color: 'var(--accent)' }}>{selectedStrategy.name}</span> selected
              </p>
              <p style={{ color: 'var(--text-3)', fontSize: 13 }}>Ready to build your detailed marketing plan</p>
            </>
          ) : (
            <>
              <p style={{ fontFamily: 'Bricolage Grotesque', fontSize: 18, fontWeight: 700, marginBottom: 2 }}>Select a strategy to continue</p>
              <p style={{ color: 'var(--text-3)', fontSize: 13 }}>Click any strategy above to select it</p>
            </>
          )}
        </div>
        <button
          className="btn-primary"
          onClick={onContinue}
          disabled={!selectedStrategy}
          style={{ padding: '14px 32px', fontSize: 15 }}
        >
          Build My Plan <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
}
