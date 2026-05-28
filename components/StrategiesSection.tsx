'use client';

import { MarketingStrategy } from '@/types';
import { ChevronRight } from 'lucide-react';

interface Props {
  strategies: MarketingStrategy[];
  selectedStrategy: MarketingStrategy | null;
  onSelect: (s: MarketingStrategy) => void;
  onContinue: () => void;
}

const effortColors: Record<string, { bg: string; text: string }> = {
  Low:    { bg: 'rgba(34,197,94,0.1)',   text: '#16a34a' },
  Medium: { bg: 'rgba(245,158,11,0.1)',  text: '#d97706' },
  High:   { bg: 'rgba(239,68,68,0.1)',   text: '#dc2626' },
};

const accentColors: Record<string, { border: string; tag: string; tagText: string; left: string }> = {
  purple: { border: '#6c63ff', tag: '#ede9ff', tagText: '#6c63ff', left: '#6c63ff' },
  pink:   { border: '#f472b6', tag: '#fdf2f8', tagText: '#be185d', left: '#f472b6' },
  green:  { border: '#22c55e', tag: '#f0fdf4', tagText: '#15803d', left: '#22c55e' },
  yellow: { border: '#f59e0b', tag: '#fffbeb', tagText: '#b45309', left: '#f59e0b' },
  blue:   { border: '#3b82f6', tag: '#eff6ff', tagText: '#1d4ed8', left: '#3b82f6' },
  orange: { border: '#f97316', tag: '#fff7ed', tagText: '#c2410c', left: '#f97316' },
};

function StrategyCard({ strategy, isSelected, onSelect, index }: { strategy: MarketingStrategy; isSelected: boolean; onSelect: () => void; index: number }) {
  const colors = accentColors[strategy.color] || accentColors.purple;
  const effort = effortColors[strategy.effortLevel] || effortColors.Medium;

  return (
    <div
      onClick={onSelect}
      style={{
        background: 'white',
        border: `1.5px solid ${isSelected ? colors.border : '#e4e2f5'}`,
        borderLeft: `4px solid ${isSelected ? colors.border : '#e4e2f5'}`,
        padding: 0,
        cursor: 'pointer',
        transition: 'all 0.2s',
        position: 'relative',
        boxShadow: isSelected ? `0 4px 24px rgba(108,99,255,0.12)` : '0 1px 4px rgba(0,0,0,0.04)',
        marginBottom: 0,
      }}
    >
      {/* Top bar — index + recommended badge */}
      <div style={{ padding: '16px 24px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontFamily: 'Bricolage Grotesque', fontWeight: 800, fontSize: 12, color: '#d4d0f0', letterSpacing: '0.04em' }}>
          {String(index + 1).padStart(2, '0')}
        </span>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          {strategy.isRecommended && (
            <span style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#16a34a', background: '#f0fdf4', border: '1px solid #bbf7d0', padding: '3px 10px' }}>
              Recommended
            </span>
          )}
          {isSelected && (
            <span style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: colors.tagText, background: colors.tag, border: `1px solid ${colors.border}`, padding: '3px 10px' }}>
              Selected
            </span>
          )}
        </div>
      </div>

      {/* Main content */}
      <div style={{ padding: '14px 24px 20px' }}>
        {/* Title + tagline */}
        <h3 style={{ fontFamily: 'Bricolage Grotesque', fontWeight: 800, fontSize: 20, marginBottom: 4, color: '#1a1730', lineHeight: 1.2 }}>
          {strategy.name}
        </h3>
        <p style={{ fontSize: 13, color: '#6c63ff', fontWeight: 600, marginBottom: 12 }}>{strategy.tagline}</p>

        {/* Description */}
        <p style={{ fontSize: 14, color: '#4a4568', lineHeight: 1.7, marginBottom: 16 }}>
          {strategy.description}
        </p>

        {/* Stats row — clean table style */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', borderTop: '1px solid #f3f2ff', borderLeft: '1px solid #f3f2ff', marginBottom: 16 }}>
          {[
            { label: 'Time to Results', value: strategy.estimatedTimeToResults },
            { label: 'Cost Range',      value: strategy.estimatedCostRange },
            { label: 'Potential ROI',   value: strategy.potentialROI },
            { label: 'Effort',          value: strategy.effortLevel, effortColor: effort },
          ].map((stat, i) => (
            <div key={i} style={{ padding: '10px 14px', borderRight: '1px solid #f3f2ff', borderBottom: '1px solid #f3f2ff' }}>
              <div style={{ fontSize: 10, color: '#8b87a8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>{stat.label}</div>
              <div style={{
                fontSize: 12, fontWeight: 700, fontFamily: 'Bricolage Grotesque',
                color: stat.effortColor ? stat.effortColor.text : '#1a1730',
                background: stat.effortColor ? stat.effortColor.bg : 'transparent',
                display: stat.effortColor ? 'inline-block' : 'block',
                padding: stat.effortColor ? '1px 8px' : '0',
              }}>
                {stat.value}
              </div>
            </div>
          ))}
        </div>

        {/* Two column — why it fits + recommendation */}
        <div style={{ display: 'grid', gridTemplateColumns: strategy.isRecommended && strategy.recommendationReason ? '1fr 1fr' : '1fr', gap: 12, marginBottom: 16 }}>
          {strategy.whyItFitsYou && (
            <div style={{ background: '#f8f7ff', borderLeft: `3px solid ${colors.border}`, padding: '10px 14px' }}>
              <div style={{ fontSize: 10, color: colors.tagText, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>Why this fits you</div>
              <p style={{ fontSize: 12, color: '#4a4568', lineHeight: 1.6 }}>{strategy.whyItFitsYou}</p>
            </div>
          )}
          {strategy.isRecommended && strategy.recommendationReason && (
            <div style={{ background: '#f0fdf4', borderLeft: '3px solid #22c55e', padding: '10px 14px' }}>
              <div style={{ fontSize: 10, color: '#15803d', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>Recommendation</div>
              <p style={{ fontSize: 12, color: '#4a4568', lineHeight: 1.6 }}>{strategy.recommendationReason}</p>
            </div>
          )}
        </div>

        {/* Channels */}
        {strategy.channels?.length > 0 && (
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 10, color: '#8b87a8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>Channels</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {strategy.channels.map(ch => (
                <span key={ch} style={{ padding: '4px 12px', fontSize: 11, fontWeight: 600, background: colors.tag, color: colors.tagText, border: `1px solid ${colors.border}20` }}>{ch}</span>
              ))}
            </div>
          </div>
        )}

        {/* Pros / Cons */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, paddingTop: 14, borderTop: '1px solid #f3f2ff' }}>
          <div>
            <div style={{ fontSize: 10, color: '#16a34a', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>Strengths</div>
            {strategy.pros?.slice(0, 3).map((p, i) => (
              <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 6 }}>
                <span style={{ color: '#22c55e', fontSize: 12, flexShrink: 0, marginTop: 1 }}>+</span>
                <p style={{ fontSize: 12, color: '#4a4568', lineHeight: 1.5 }}>{p}</p>
              </div>
            ))}
          </div>
          <div>
            <div style={{ fontSize: 10, color: '#dc2626', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>Considerations</div>
            {strategy.cons?.slice(0, 3).map((c, i) => (
              <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 6 }}>
                <span style={{ color: '#f87171', fontSize: 12, flexShrink: 0, marginTop: 1 }}>–</span>
                <p style={{ fontSize: 12, color: '#4a4568', lineHeight: 1.5 }}>{c}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{ padding: '12px 24px', background: '#fafafa', borderTop: '1px solid #f3f2ff', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 12, color: '#8b87a8', fontStyle: 'italic' }}>{strategy.bestFor}</span>
        <span style={{ fontSize: 12, color: isSelected ? colors.tagText : '#8b87a8', fontWeight: 600 }}>
          {isSelected ? 'Selected' : 'Click to select →'}
        </span>
      </div>
    </div>
  );
}

export default function StrategiesSection({ strategies, selectedStrategy, onSelect, onContinue }: Props) {
  const recommended = strategies.filter(s => s.isRecommended);

  return (
    <div style={{ maxWidth: 860, margin: '0 auto', animation: 'fadeIn 0.4s ease' }}>

      {/* Header — centered */}
      <div style={{ textAlign: 'center', marginBottom: 40, paddingTop: 8 }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
          <div style={{ height: 1, width: 32, background: '#6c63ff' }} />
          <span style={{ fontSize: 11, color: '#6c63ff', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em' }}>Step 2 of 5</span>
          <div style={{ height: 1, width: 32, background: '#6c63ff' }} />
        </div>
        <h1 style={{ fontFamily: 'Bricolage Grotesque', fontSize: 38, fontWeight: 800, letterSpacing: '-0.03em', marginBottom: 12, color: '#1a1730', lineHeight: 1.1 }}>
          Your <span style={{ color: '#6c63ff' }}>5 personalized</span> strategies
        </h1>
        <p style={{ color: '#4a4568', fontSize: 16, lineHeight: 1.7, maxWidth: 520, margin: '0 auto' }}>
          We analyzed your profile and generated these strategies for your company. Read each one, then pick the one that excites you most.
        </p>
      </div>

      {/* Recommendations callout */}
      {recommended.length > 0 && (
        <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', padding: '14px 20px', marginBottom: 28, display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ width: 8, height: 8, background: '#22c55e', flexShrink: 0 }} />
          <div>
            <span style={{ fontFamily: 'Bricolage Grotesque', fontWeight: 700, fontSize: 13, color: '#15803d' }}>Recommendations for you — </span>
            <span style={{ fontSize: 13, color: '#4a4568' }}>
              Based on your profile, <strong style={{ color: '#1a1730' }}>{recommended.map(r => r.name).join(' and ')}</strong> are the best fit for your goals and budget.
            </span>
          </div>
        </div>
      )}

      {/* Strategy cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 32 }}>
        {strategies.map((strategy, i) => (
          <StrategyCard
            key={strategy.id}
            strategy={strategy}
            index={i}
            isSelected={selectedStrategy?.id === strategy.id}
            onSelect={() => onSelect(strategy)}
          />
        ))}
      </div>

      {/* Sticky footer CTA */}
      <div style={{
        background: 'white',
        border: '1px solid #e4e2f5',
        padding: '20px 28px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        bottom: 16,
        boxShadow: '0 -4px 24px rgba(0,0,0,0.08)',
      }}>
        <div>
          {selectedStrategy ? (
            <>
              <p style={{ fontFamily: 'Bricolage Grotesque', fontSize: 16, fontWeight: 700, marginBottom: 2, color: '#1a1730' }}>
                <span style={{ color: '#22c55e' }}>✓</span> {selectedStrategy.name} selected
              </p>
              <p style={{ color: '#8b87a8', fontSize: 12 }}>Ready to build your detailed marketing plan</p>
            </>
          ) : (
            <>
              <p style={{ fontFamily: 'Bricolage Grotesque', fontSize: 16, fontWeight: 700, marginBottom: 2, color: '#1a1730' }}>Select a strategy to continue</p>
              <p style={{ color: '#8b87a8', fontSize: 12 }}>Click any card above to select it</p>
            </>
          )}
        </div>
        <button
          onClick={onContinue}
          disabled={!selectedStrategy}
          style={{
            background: selectedStrategy ? '#6c63ff' : '#d4d0f0',
            color: 'white', border: 'none',
            padding: '13px 28px',
            fontFamily: 'Bricolage Grotesque', fontWeight: 700, fontSize: 14,
            cursor: selectedStrategy ? 'pointer' : 'not-allowed',
            display: 'flex', alignItems: 'center', gap: 8,
            transition: 'background 0.2s',
          }}
          onMouseEnter={e => { if (selectedStrategy) (e.currentTarget as HTMLElement).style.background = '#5a52e0'; }}
          onMouseLeave={e => { if (selectedStrategy) (e.currentTarget as HTMLElement).style.background = '#6c63ff'; }}
        >
          Build My Plan <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}