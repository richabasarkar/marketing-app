'use client';

import { useState } from 'react';
import { MarketingPlan, MarketingStrategy, PlanPhase } from '@/types';

interface Props {
  plan: MarketingPlan;
  strategy: MarketingStrategy;
  onStartBoard: () => void;
  inputs: Record<string, unknown>;
}

const phaseAccents: Record<string, { bg: string; border: string; text: string; solid: string }> = {
  purple: { bg: '#f5f3ff', border: '#c4b5fd', text: '#6c63ff', solid: '#6c63ff' },
  pink:   { bg: '#fdf2f8', border: '#f9a8d4', text: '#be185d', solid: '#ec4899' },
  green:  { bg: '#f0fdf4', border: '#86efac', text: '#15803d', solid: '#22c55e' },
  yellow: { bg: '#fffbeb', border: '#fcd34d', text: '#b45309', solid: '#f59e0b' },
  blue:   { bg: '#eff6ff', border: '#93c5fd', text: '#1d4ed8', solid: '#3b82f6' },
  orange: { bg: '#fff7ed', border: '#fdba74', text: '#c2410c', solid: '#f97316' },
};

const defaultPhaseColors = ['purple', 'pink', 'green', 'yellow', 'blue', 'orange'];
type Tab = 'overview' | 'messaging' | string;

const TABS = [
  { id: 'overview',  label: 'Overview' },
  { id: 'messaging', label: 'Messaging' },
  { id: 'kpis',      label: 'KPIs' },
  { id: 'budget',    label: 'Budget' },
  { id: 'tools',     label: 'Tools' },
  { id: 'risks',     label: 'Risks' },
];

function KPICard({ metric, target, timeframe, trackingMethod, frequency }: { metric: string; target: string; timeframe: string; trackingMethod: string; frequency: string }) {
  return (
    <div style={{ background: '#f8f7ff', border: '1px solid #e4e2f5', borderLeft: '3px solid #6c63ff', padding: '16px 18px' }}>
      <p style={{ fontFamily: 'Bricolage Grotesque', fontWeight: 700, fontSize: 14, marginBottom: 6, color: '#1a1730' }}>{metric}</p>
      <p style={{ fontSize: 22, fontWeight: 800, color: '#6c63ff', fontFamily: 'Bricolage Grotesque', marginBottom: 8 }}>{target}</p>
      <p style={{ fontSize: 11, color: '#8b87a8' }}>By {timeframe} · {frequency} check-ins</p>
      <p style={{ fontSize: 11, color: '#8b87a8', marginTop: 2 }}>Track via: {trackingMethod}</p>
    </div>
  );
}

function ActionItemCard({ item }: { item: { id: string; task: string; description: string; week: number; priority: string; estimatedHours: number; category: string; owner: string; resources?: string[] } }) {
  const [expanded, setExpanded] = useState(false);
  const priorityColors: Record<string, { text: string; bg: string }> = {
    High:   { text: '#dc2626', bg: '#fef2f2' },
    Medium: { text: '#d97706', bg: '#fffbeb' },
    Low:    { text: '#16a34a', bg: '#f0fdf4' },
  };
  const pc = priorityColors[item.priority] || priorityColors.Medium;
  return (
    <div style={{ background: 'white', border: '1px solid #e4e2f5', marginBottom: 6, overflow: 'hidden' }}>
      <div onClick={() => setExpanded(!expanded)} style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }}>
        <div style={{ width: 28, height: 20, background: '#f3f2ff', border: '1px solid #e4e2f5', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <span style={{ fontSize: 10, fontWeight: 800, color: '#6c63ff' }}>W{item.week}</span>
        </div>
        <div style={{ flex: 1 }}>
          <p style={{ fontWeight: 600, fontSize: 13, color: '#1a1730', marginBottom: 2 }}>{item.task}</p>
          <div style={{ display: 'flex', gap: 10 }}>
            <span style={{ fontSize: 11, color: '#8b87a8' }}>{item.category}</span>
            <span style={{ fontSize: 11, color: '#8b87a8' }}>~{item.estimatedHours}h</span>
            <span style={{ fontSize: 11, color: '#8b87a8' }}>{item.owner}</span>
          </div>
        </div>
        <span style={{ fontSize: 11, color: pc.text, fontWeight: 700, background: pc.bg, padding: '3px 10px' }}>{item.priority}</span>
        <span style={{ color: '#8b87a8', fontSize: 12 }}>{expanded ? '↑' : '↓'}</span>
      </div>
      {expanded && (
        <div style={{ padding: '0 16px 14px', borderTop: '1px solid #f3f2ff' }}>
          <p style={{ fontSize: 13, color: '#4a4568', lineHeight: 1.65, marginTop: 12 }}>{item.description}</p>
          {(item.resources?.length ?? 0) > 0 && (
            <div style={{ marginTop: 10 }}>
              <p style={{ fontSize: 10, color: '#8b87a8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>Resources</p>
              {item.resources?.map((r, i) => <p key={i} style={{ fontSize: 12, color: '#6c63ff', marginBottom: 2 }}>→ {r}</p>)}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function PlanSection({ plan, strategy, onStartBoard }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>('overview');

  const allTabs = [
    ...TABS.slice(0, 2),
    ...(plan.phases?.map((phase, i) => ({ id: `phase-${i}`, label: `P${i + 1}: ${phase.name}` })) || []),
    ...TABS.slice(2),
  ];

  return (
    <div style={{ maxWidth: 960, margin: '0 auto', animation: 'fadeIn 0.4s ease' }}>

      {/* Centered header */}
      <div style={{ textAlign: 'center', marginBottom: 36, paddingTop: 8 }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
          <div style={{ height: 1, width: 32, background: '#6c63ff' }} />
          <span style={{ fontSize: 11, color: '#6c63ff', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em' }}>Step 4 of 5</span>
          <div style={{ height: 1, width: 32, background: '#6c63ff' }} />
        </div>
        <h1 style={{ fontFamily: 'Bricolage Grotesque', fontSize: 38, fontWeight: 800, letterSpacing: '-0.03em', marginBottom: 8, color: '#1a1730' }}>
          Your <span style={{ color: '#6c63ff' }}>Marketing Plan</span>
        </h1>
        <p style={{ color: '#4a4568', fontSize: 15, marginBottom: 20 }}>Strategy: {plan.strategyName || strategy.name}</p>
        <button
          onClick={onStartBoard}
          style={{ background: '#6c63ff', color: 'white', border: 'none', padding: '12px 28px', fontFamily: 'Bricolage Grotesque', fontWeight: 700, fontSize: 14, cursor: 'pointer', transition: 'background 0.2s' }}
          onMouseEnter={e => (e.currentTarget.style.background = '#5a52e0')}
          onMouseLeave={e => (e.currentTarget.style.background = '#6c63ff')}
        >
          Start Executing →
        </button>
      </div>

      {/* Tabs — centered, visible */}
      <div style={{ background: 'white', border: '1px solid #e4e2f5', padding: '6px', marginBottom: 28, display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 4 }}>
        {allTabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '9px 16px',
              border: 'none',
              cursor: 'pointer',
              fontFamily: 'Bricolage Grotesque',
              fontWeight: 700,
              fontSize: 13,
              transition: 'all 0.15s',
              background: activeTab === tab.id ? '#6c63ff' : 'transparent',
              color: activeTab === tab.id ? 'white' : '#4a4568',
              whiteSpace: 'nowrap',
            }}
            onMouseEnter={e => { if (activeTab !== tab.id) (e.currentTarget as HTMLElement).style.background = '#f3f2ff'; }}
            onMouseLeave={e => { if (activeTab !== tab.id) (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div style={{ animation: 'fadeIn 0.3s ease' }}>

        {/* OVERVIEW */}
        {activeTab === 'overview' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ background: 'white', border: '1px solid #e4e2f5', padding: 28 }}>
              <h2 style={{ fontFamily: 'Bricolage Grotesque', fontWeight: 700, fontSize: 18, marginBottom: 12, color: '#1a1730' }}>Executive Summary</h2>
              <p style={{ color: '#4a4568', lineHeight: 1.8, fontSize: 15 }}>{plan.executiveSummary}</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div style={{ background: 'white', border: '1px solid #e4e2f5', borderLeft: '3px solid #6c63ff', padding: 24 }}>
                <h3 style={{ fontFamily: 'Bricolage Grotesque', fontWeight: 700, fontSize: 14, marginBottom: 10, color: '#1a1730', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Your Target Audience</h3>
                <p style={{ color: '#4a4568', fontSize: 14, lineHeight: 1.7 }}>{plan.targetAudienceSummary}</p>
              </div>
              <div style={{ background: 'white', border: '1px solid #e4e2f5', borderLeft: '3px solid #f59e0b', padding: 24 }}>
                <h3 style={{ fontFamily: 'Bricolage Grotesque', fontWeight: 700, fontSize: 14, marginBottom: 10, color: '#1a1730', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Brand Positioning</h3>
                <p style={{ color: '#4a4568', fontSize: 14, lineHeight: 1.7 }}>{plan.brandPositioning}</p>
              </div>
            </div>

            {/* Roadmap at a glance */}
            <div style={{ background: 'white', border: '1px solid #e4e2f5', padding: 28 }}>
              <h3 style={{ fontFamily: 'Bricolage Grotesque', fontWeight: 700, fontSize: 18, marginBottom: 20, color: '#1a1730' }}>Roadmap at a Glance</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {plan.phases?.map((phase, i) => {
                  const colorKey = phase.color || defaultPhaseColors[i % defaultPhaseColors.length];
                  const colors = phaseAccents[colorKey] || phaseAccents.purple;
                  return (
                    <div key={i} style={{ display: 'flex', gap: 0, background: colors.bg, border: `1px solid ${colors.border}`, overflow: 'hidden' }}>
                      {/* Left accent */}
                      <div style={{ width: 4, background: colors.solid, flexShrink: 0 }} />
                      {/* Phase number */}
                      <div style={{ width: 48, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRight: `1px solid ${colors.border}`, flexShrink: 0 }}>
                        <span style={{ fontFamily: 'Bricolage Grotesque', fontWeight: 800, fontSize: 16, color: colors.solid }}>P{i + 1}</span>
                      </div>
                      {/* Content */}
                      <div style={{ flex: 1, padding: '14px 18px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                          <span style={{ fontFamily: 'Bricolage Grotesque', fontWeight: 700, fontSize: 15, color: '#1a1730' }}>{phase.name}</span>
                          <span style={{ fontSize: 11, color: colors.text, background: 'white', border: `1px solid ${colors.border}`, padding: '2px 10px', fontWeight: 600 }}>{phase.duration}</span>
                        </div>
                        <p style={{ fontSize: 13, color: '#4a4568', marginBottom: 8 }}>{phase.objective}</p>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                          {phase.tactics?.slice(0, 3).map((t, j) => (
                            <span key={j} style={{ fontSize: 11, color: '#4a4568', background: 'white', border: '1px solid #e4e2f5', padding: '2px 10px' }}>{t}</span>
                          ))}
                          {(phase.tactics?.length || 0) > 3 && <span style={{ fontSize: 11, color: '#8b87a8' }}>+{(phase.tactics?.length || 0) - 3} more</span>}
                        </div>
                      </div>
                      {/* Budget — high contrast */}
                      <div style={{ padding: '14px 20px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-end', borderLeft: `1px solid ${colors.border}`, flexShrink: 0, background: 'white', minWidth: 110 }}>
                        <p style={{ fontFamily: 'Bricolage Grotesque', fontSize: 14, fontWeight: 800, color: colors.solid }}>{phase.budget}</p>
                        <p style={{ fontSize: 10, color: '#8b87a8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>per month</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Milestones */}
            {plan.successMilestones?.length > 0 && (
              <div style={{ background: 'white', border: '1px solid #e4e2f5', padding: 28 }}>
                <h3 style={{ fontFamily: 'Bricolage Grotesque', fontWeight: 700, fontSize: 18, marginBottom: 16, color: '#1a1730' }}>Success Milestones</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12 }}>
                  {plan.successMilestones.map((m, i) => (
                    <div key={i} style={{ background: '#f8f7ff', border: '1px solid #e4e2f5', borderTop: '3px solid #6c63ff', padding: 16 }}>
                      <p style={{ fontSize: 11, color: '#6c63ff', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>{m.timeline}</p>
                      <p style={{ fontSize: 13, fontWeight: 600, color: '#1a1730', marginBottom: 6 }}>{m.milestone}</p>
                      <p style={{ fontSize: 11, color: '#8b87a8' }}>{m.metric}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* MESSAGING */}
        {activeTab === 'messaging' && plan.messagingFramework && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ background: 'white', border: '1px solid #e4e2f5', padding: 28 }}>
              <h2 style={{ fontFamily: 'Bricolage Grotesque', fontWeight: 700, fontSize: 20, marginBottom: 6, color: '#1a1730' }}>Messaging Framework</h2>
              <p style={{ color: '#8b87a8', fontSize: 13, marginBottom: 28 }}>Use these words consistently across all your marketing.</p>
              <div style={{ background: '#f8f7ff', border: '1px solid #e4e2f5', padding: 24, marginBottom: 16 }}>
                <p style={{ fontSize: 10, color: '#8b87a8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>Main Headline</p>
                <p style={{ fontFamily: 'Bricolage Grotesque', fontSize: 28, fontWeight: 800, color: '#6c63ff', letterSpacing: '-0.02em', lineHeight: 1.2 }}>{plan.messagingFramework.headline}</p>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                <div style={{ background: '#f8f7ff', border: '1px solid #e4e2f5', padding: 20 }}>
                  <p style={{ fontSize: 10, color: '#8b87a8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 6 }}>Subheadline</p>
                  <p style={{ fontSize: 16, fontWeight: 600, color: '#1a1730', lineHeight: 1.4 }}>{plan.messagingFramework.subheadline}</p>
                </div>
                <div style={{ background: '#f8f7ff', border: '1px solid #e4e2f5', padding: 20 }}>
                  <p style={{ fontSize: 10, color: '#8b87a8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 6 }}>30-Second Pitch</p>
                  <p style={{ fontSize: 14, color: '#1a1730', lineHeight: 1.65 }}>{plan.messagingFramework.elevatorPitch}</p>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div>
                  <p style={{ fontSize: 10, color: '#8b87a8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12 }}>Key Messages</p>
                  {plan.messagingFramework.keyMessages?.map((m, i) => (
                    <div key={i} style={{ display: 'flex', gap: 12, marginBottom: 10, padding: '10px 14px', background: '#f8f7ff', border: '1px solid #e4e2f5', borderLeft: '3px solid #6c63ff' }}>
                      <span style={{ color: '#6c63ff', fontWeight: 800, fontSize: 13, flexShrink: 0 }}>{i + 1}</span>
                      <p style={{ fontSize: 13, color: '#1a1730', lineHeight: 1.5 }}>{m}</p>
                    </div>
                  ))}
                </div>
                <div>
                  <p style={{ fontSize: 10, color: '#8b87a8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12 }}>Tone of Voice</p>
                  {plan.messagingFramework.toneOfVoice?.map((t, i) => (
                    <div key={i} style={{ display: 'inline-flex', marginRight: 8, marginBottom: 8, padding: '6px 14px', background: '#ede9ff', border: '1px solid rgba(108,99,255,0.2)', fontSize: 13, color: '#6c63ff', fontWeight: 600 }}>{t}</div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* PHASE TABS */}
        {plan.phases?.map((phase, i) => activeTab === `phase-${i}` && (
          <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {(() => {
              const colorKey = phase.color || defaultPhaseColors[i % defaultPhaseColors.length];
              const colors = phaseAccents[colorKey] || phaseAccents.purple;
              return <>
                <div style={{ background: colors.bg, border: `1px solid ${colors.border}`, borderLeft: `4px solid ${colors.solid}`, padding: 28 }}>
                  <span style={{ fontSize: 10, color: colors.text, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em' }}>Phase {i + 1} · {phase.duration}</span>
                  <h2 style={{ fontFamily: 'Bricolage Grotesque', fontSize: 26, fontWeight: 800, color: '#1a1730', marginTop: 8, marginBottom: 8 }}>{phase.name}</h2>
                  <p style={{ fontSize: 15, color: '#4a4568', marginBottom: 12, fontWeight: 500 }}>{phase.objective}</p>
                  <p style={{ fontSize: 14, color: '#4a4568', lineHeight: 1.7 }}>{phase.description}</p>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div style={{ background: 'white', border: '1px solid #e4e2f5', padding: 24 }}>
                    <h3 style={{ fontFamily: 'Bricolage Grotesque', fontWeight: 700, fontSize: 15, marginBottom: 14, color: '#1a1730', textTransform: 'uppercase', letterSpacing: '0.05em' }}>What You'll Do</h3>
                    {phase.tactics?.map((tactic, j) => (
                      <div key={j} style={{ display: 'flex', gap: 10, marginBottom: 10, padding: '10px 14px', background: '#f8f7ff', border: '1px solid #e4e2f5', borderLeft: `3px solid ${colors.solid}` }}>
                        <p style={{ fontSize: 13, color: '#1a1730', lineHeight: 1.5 }}>{tactic}</p>
                      </div>
                    ))}
                  </div>
                  <div style={{ background: 'white', border: '1px solid #e4e2f5', padding: 24 }}>
                    <h3 style={{ fontFamily: 'Bricolage Grotesque', fontWeight: 700, fontSize: 15, marginBottom: 14, color: '#1a1730', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Expected Outcomes</h3>
                    {phase.expectedOutcomes?.map((o, j) => (
                      <div key={j} style={{ display: 'flex', gap: 10, marginBottom: 10, padding: '10px 14px', background: '#f0fdf4', border: '1px solid #bbf7d0', borderLeft: '3px solid #22c55e' }}>
                        <p style={{ fontSize: 13, color: '#1a1730', lineHeight: 1.5 }}>{o}</p>
                      </div>
                    ))}
                    <div style={{ marginTop: 16, padding: '14px 16px', background: colors.bg, border: `1px solid ${colors.border}` }}>
                      <p style={{ fontSize: 10, color: colors.text, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>Budget This Phase</p>
                      <p style={{ fontFamily: 'Bricolage Grotesque', fontSize: 22, fontWeight: 800, color: colors.solid }}>{phase.budget}</p>
                    </div>
                  </div>
                </div>
                {phase.kpis?.length > 0 && (
                  <div style={{ background: 'white', border: '1px solid #e4e2f5', padding: 24 }}>
                    <h3 style={{ fontFamily: 'Bricolage Grotesque', fontWeight: 700, fontSize: 16, marginBottom: 16, color: '#1a1730' }}>How You'll Measure Success</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 12 }}>
                      {phase.kpis.map((kpi, j) => <KPICard key={j} {...kpi} />)}
                    </div>
                  </div>
                )}
                {phase.actionItems?.length > 0 && (
                  <div style={{ background: 'white', border: '1px solid #e4e2f5', padding: 24 }}>
                    <h3 style={{ fontFamily: 'Bricolage Grotesque', fontWeight: 700, fontSize: 16, marginBottom: 4, color: '#1a1730' }}>Action Items</h3>
                    <p style={{ color: '#8b87a8', fontSize: 13, marginBottom: 16 }}>Click any item to expand the full instructions</p>
                    {phase.actionItems.map((item, j) => <ActionItemCard key={j} item={item} />)}
                  </div>
                )}
              </>;
            })()}
          </div>
        ))}

        {/* KPIs */}
        {activeTab === 'kpis' && (
          <div style={{ background: 'white', border: '1px solid #e4e2f5', padding: 28 }}>
            <h2 style={{ fontFamily: 'Bricolage Grotesque', fontWeight: 700, fontSize: 20, marginBottom: 6, color: '#1a1730' }}>12-Month KPIs</h2>
            <p style={{ color: '#8b87a8', fontSize: 13, marginBottom: 24 }}>These are the numbers you should check monthly to know if your marketing is working.</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 14 }}>
              {plan.overallKPIs?.map((kpi, i) => <KPICard key={i} {...kpi} />)}
            </div>
          </div>
        )}

        {/* BUDGET */}
        {activeTab === 'budget' && (
          <div style={{ background: 'white', border: '1px solid #e4e2f5', padding: 28 }}>
            <h2 style={{ fontFamily: 'Bricolage Grotesque', fontWeight: 700, fontSize: 20, marginBottom: 6, color: '#1a1730' }}>Budget Breakdown</h2>
            <p style={{ color: '#8b87a8', fontSize: 13, marginBottom: 24 }}>How to allocate your marketing budget for maximum impact.</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {plan.totalBudgetBreakdown?.map((b, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '16px 20px', background: '#f8f7ff', border: '1px solid #e4e2f5' }}>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontWeight: 600, fontSize: 14, marginBottom: 8, color: '#1a1730' }}>{b.category}</p>
                    <div style={{ height: 6, background: '#e4e2f5' }}>
                      <div style={{ height: '100%', width: `${b.percentage}%`, background: '#6c63ff', transition: 'width 0.6s ease' }} />
                    </div>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <p style={{ fontFamily: 'Bricolage Grotesque', fontSize: 18, fontWeight: 800, color: '#6c63ff' }}>{b.percentage}%</p>
                    <p style={{ fontSize: 12, color: '#8b87a8' }}>{b.monthly}/mo</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TOOLS */}
        {activeTab === 'tools' && (
          <div style={{ background: 'white', border: '1px solid #e4e2f5', padding: 28 }}>
            <h2 style={{ fontFamily: 'Bricolage Grotesque', fontWeight: 700, fontSize: 20, marginBottom: 6, color: '#1a1730' }}>Tools & Resources</h2>
            <p style={{ color: '#8b87a8', fontSize: 13, marginBottom: 24 }}>The exact tools you'll need to execute this plan.</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 12 }}>
              {plan.toolsAndResources?.map((tool, i) => {
                const pColors: Record<string, { text: string; bg: string; border: string }> = {
                  Essential:   { text: '#dc2626', bg: '#fef2f2', border: '#fecaca' },
                  Recommended: { text: '#d97706', bg: '#fffbeb', border: '#fde68a' },
                  Optional:    { text: '#16a34a', bg: '#f0fdf4', border: '#bbf7d0' },
                };
                const pc = pColors[tool.priority] || pColors.Optional;
                return (
                  <div key={i} style={{ background: '#f8f7ff', border: '1px solid #e4e2f5', padding: 18 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                      <p style={{ fontFamily: 'Bricolage Grotesque', fontWeight: 700, fontSize: 15, color: '#1a1730' }}>{tool.name}</p>
                      <span style={{ fontSize: 10, color: pc.text, fontWeight: 700, background: pc.bg, border: `1px solid ${pc.border}`, padding: '2px 8px', flexShrink: 0 }}>{tool.priority}</span>
                    </div>
                    <p style={{ fontSize: 13, color: '#4a4568', marginBottom: 8, lineHeight: 1.5 }}>{tool.purpose}</p>
                    <p style={{ fontSize: 12, color: '#6c63ff', fontWeight: 600 }}>{tool.cost}</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* RISKS */}
        {activeTab === 'risks' && (
          <div style={{ background: 'white', border: '1px solid #e4e2f5', padding: 28 }}>
            <h2 style={{ fontFamily: 'Bricolage Grotesque', fontWeight: 700, fontSize: 20, marginBottom: 6, color: '#1a1730' }}>Risk Mitigation</h2>
            <p style={{ color: '#8b87a8', fontSize: 13, marginBottom: 24 }}>Common pitfalls and exactly how to avoid or handle them.</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {plan.riskMitigation?.map((r, i) => (
                <div key={i} style={{ background: '#f8f7ff', border: '1px solid #e4e2f5', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0, overflow: 'hidden' }}>
                  <div style={{ padding: '18px 20px', borderRight: '1px solid #e4e2f5' }}>
                    <p style={{ fontSize: 10, color: '#dc2626', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>Risk</p>
                    <p style={{ fontSize: 13, color: '#1a1730', lineHeight: 1.6 }}>{r.risk}</p>
                  </div>
                  <div style={{ padding: '18px 20px' }}>
                    <p style={{ fontSize: 10, color: '#16a34a', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>How to Handle It</p>
                    <p style={{ fontSize: 13, color: '#4a4568', lineHeight: 1.6 }}>{r.mitigation}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Bottom CTA */}
      <div style={{ marginTop: 32, background: '#f8f7ff', border: '1px solid #e4e2f5', borderLeft: '4px solid #6c63ff', padding: '24px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h3 style={{ fontFamily: 'Bricolage Grotesque', fontSize: 18, fontWeight: 800, marginBottom: 4, color: '#1a1730' }}>Ready to start executing?</h3>
          <p style={{ color: '#4a4568', fontSize: 14 }}>Move to the Action Board to manage your weekly tasks and track progress.</p>
        </div>
        <button
          onClick={onStartBoard}
          style={{ background: '#6c63ff', color: 'white', border: 'none', padding: '14px 28px', fontFamily: 'Bricolage Grotesque', fontWeight: 700, fontSize: 14, cursor: 'pointer', flexShrink: 0, transition: 'background 0.2s' }}
          onMouseEnter={e => (e.currentTarget.style.background = '#5a52e0')}
          onMouseLeave={e => (e.currentTarget.style.background = '#6c63ff')}
        >
          Open Action Board →
        </button>
      </div>
    </div>
  );
}