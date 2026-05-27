'use client';

import { useState } from 'react';
import { MarketingPlan, MarketingStrategy, PlanPhase } from '@/types';
import { Target, TrendingUp, DollarSign, Clock, Wrench, AlertTriangle, Trophy, ChevronRight, Download, BarChart3 } from 'lucide-react';

interface Props {
  plan: MarketingPlan;
  strategy: MarketingStrategy;
  onStartBoard: () => void;
  inputs: Record<string, unknown>;
}

const phaseColors: Record<string, { bg: string; border: string; text: string }> = {
  purple: { bg: 'rgba(108,99,255,0.12)', border: 'rgba(108,99,255,0.5)', text: '#a89cff' },
  pink: { bg: 'rgba(255,101,132,0.12)', border: 'rgba(255,101,132,0.5)', text: '#ff91a8' },
  green: { bg: 'rgba(67,233,123,0.12)', border: 'rgba(67,233,123,0.5)', text: '#43e97b' },
  yellow: { bg: 'rgba(248,169,53,0.12)', border: 'rgba(248,169,53,0.5)', text: '#f8a935' },
  blue: { bg: 'rgba(56,182,255,0.12)', border: 'rgba(56,182,255,0.5)', text: '#56b6ff' },
  orange: { bg: 'rgba(255,127,61,0.12)', border: 'rgba(255,127,61,0.5)', text: '#ff7f3d' },
};

const defaultPhaseColors = ['purple', 'pink', 'green', 'yellow', 'blue', 'orange'];

type Tab = 'overview' | 'messaging' | string;

function PhaseTab({ phase, isActive, onClick, index }: { phase: PlanPhase; isActive: boolean; onClick: () => void; index: number }) {
  const colorKey = phase.color || defaultPhaseColors[index % defaultPhaseColors.length];
  const colors = phaseColors[colorKey] || phaseColors.purple;
  return (
    <button onClick={onClick} style={{
      padding: '10px 18px', borderRadius: 10, border: 'none', cursor: 'pointer',
      background: isActive ? colors.bg : 'transparent',
      outline: isActive ? `1px solid ${colors.border}` : '1px solid transparent',
      color: isActive ? colors.text : 'var(--text-3)',
      fontFamily: 'Bricolage Grotesque', fontWeight: 600, fontSize: 13,
      transition: 'all 0.2s', whiteSpace: 'nowrap',
    }}>
      <span style={{ marginRight: 6, opacity: 0.7 }}>Phase {index + 1}</span>{phase.name}
    </button>
  );
}

function KPICard({ metric, target, timeframe, trackingMethod, frequency }: { metric: string; target: string; timeframe: string; trackingMethod: string; frequency: string }) {
  return (
    <div style={{ background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 12, padding: 18 }}>
      <p style={{ fontFamily: 'Bricolage Grotesque', fontWeight: 700, fontSize: 15, marginBottom: 6 }}>{metric}</p>
      <p style={{ fontSize: 20, fontWeight: 800, color: 'var(--accent)', fontFamily: 'Bricolage Grotesque', marginBottom: 8 }}>{target}</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <p style={{ fontSize: 11, color: 'var(--text-3)' }}>⏱ By {timeframe} · {frequency} check-ins</p>
        <p style={{ fontSize: 11, color: 'var(--text-3)' }}>📊 Track via: {trackingMethod}</p>
      </div>
    </div>
  );
}

function ActionItemCard({ item, index }: { item: { id: string; task: string; description: string; week: number; priority: string; estimatedHours: number; category: string; owner: string; resources?: string[] }; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const priorityColors = { High: '#ff91a8', Medium: '#f8a935', Low: '#43e97b' };
  const pc = priorityColors[item.priority as keyof typeof priorityColors] || '#a89cff';
  return (
    <div style={{ background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 10, marginBottom: 8, overflow: 'hidden' }}>
      <div onClick={() => setExpanded(!expanded)} style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }}>
        <div style={{ width: 26, height: 26, borderRadius: 6, background: `${pc}20`, border: `1px solid ${pc}60`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: pc }}>W{item.week}</span>
        </div>
        <div style={{ flex: 1 }}>
          <p style={{ fontWeight: 600, fontSize: 13, color: 'var(--text)', marginBottom: 2 }}>{item.task}</p>
          <div style={{ display: 'flex', gap: 8 }}>
            <span style={{ fontSize: 11, color: 'var(--text-3)' }}>{item.category}</span>
            <span style={{ fontSize: 11, color: 'var(--text-3)' }}>~{item.estimatedHours}h</span>
            <span style={{ fontSize: 11, color: 'var(--text-3)' }}>👤 {item.owner}</span>
          </div>
        </div>
        <span style={{ fontSize: 11, color: pc, fontWeight: 700, background: `${pc}15`, padding: '3px 8px', borderRadius: 6 }}>{item.priority}</span>
        <span style={{ color: 'var(--text-3)', fontSize: 14 }}>{expanded ? '↑' : '↓'}</span>
      </div>
      {expanded && (
        <div style={{ padding: '0 16px 14px', borderTop: '1px solid var(--border)' }}>
          <p style={{ fontSize: 13, color: 'var(--text-2)', lineHeight: 1.65, marginTop: 12 }}>{item.description}</p>
          {(item.resources?.length ?? 0) > 0 && (
            <div style={{ marginTop: 10 }}>
              <p style={{ fontSize: 11, color: 'var(--text-3)', fontWeight: 600, marginBottom: 4 }}>RESOURCES:</p>
              {item.resources?.map((r, i) => <p key={i} style={{ fontSize: 12, color: 'var(--accent)', marginBottom: 2 }}>→ {r}</p>)}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function PlanSection({ plan, strategy, onStartBoard }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>('overview');

  const phaseTabs: Tab[] = plan.phases?.map((_, i) => `phase-${i}`) || [];

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto', animation: 'fadeIn 0.4s ease' }}>
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <span className="badge badge-purple" style={{ marginBottom: 10, display: 'inline-flex' }}>Step 4 of 5</span>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 20 }}>
          <div>
            <h1 style={{ fontFamily: 'Bricolage Grotesque', fontSize: 38, fontWeight: 800, letterSpacing: '-0.03em', marginBottom: 8 }}>
              Your <span style={{ color: 'var(--accent)' }}>Marketing Plan</span>
            </h1>
            <p style={{ color: 'var(--text-2)', fontSize: 15 }}>Strategy: {plan.strategyName || strategy.name}</p>
          </div>
          <button onClick={onStartBoard} className="btn-primary" style={{ flexShrink: 0 }}>
            Start Executing <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 28, overflowX: 'auto', paddingBottom: 4, flexWrap: 'wrap' }}>
        <button onClick={() => setActiveTab('overview')} className={`tab ${activeTab === 'overview' ? 'active' : ''}`}>📊 Overview</button>
        <button onClick={() => setActiveTab('messaging')} className={`tab ${activeTab === 'messaging' ? 'active' : ''}`}>💬 Messaging</button>
        {plan.phases?.map((phase, i) => (
          <PhaseTab key={i} phase={phase} isActive={activeTab === `phase-${i}`} onClick={() => setActiveTab(`phase-${i}`)} index={i} />
        ))}
        <button onClick={() => setActiveTab('kpis')} className={`tab ${activeTab === 'kpis' ? 'active' : ''}`}>📈 KPIs</button>
        <button onClick={() => setActiveTab('budget')} className={`tab ${activeTab === 'budget' ? 'active' : ''}`}>💰 Budget</button>
        <button onClick={() => setActiveTab('tools')} className={`tab ${activeTab === 'tools' ? 'active' : ''}`}>🔧 Tools</button>
        <button onClick={() => setActiveTab('risks')} className={`tab ${activeTab === 'risks' ? 'active' : ''}`}>⚠️ Risks</button>
      </div>

      {/* Tab Content */}
      <div style={{ animation: 'fadeIn 0.3s ease' }}>

        {/* OVERVIEW */}
        {activeTab === 'overview' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div className="card" style={{ padding: 28 }}>
              <h2 style={{ fontFamily: 'Bricolage Grotesque', fontWeight: 700, fontSize: 20, marginBottom: 12 }}>Executive Summary</h2>
              <p style={{ color: 'var(--text-2)', lineHeight: 1.8, fontSize: 15 }}>{plan.executiveSummary}</p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
              <div className="card" style={{ padding: 24 }}>
                <h3 style={{ fontFamily: 'Bricolage Grotesque', fontWeight: 700, fontSize: 16, marginBottom: 10, display: 'flex', alignItems: 'center', gap: 8 }}><Target size={18} style={{ color: 'var(--accent)' }} /> Your Target Audience</h3>
                <p style={{ color: 'var(--text-2)', fontSize: 14, lineHeight: 1.7 }}>{plan.targetAudienceSummary}</p>
              </div>
              <div className="card" style={{ padding: 24 }}>
                <h3 style={{ fontFamily: 'Bricolage Grotesque', fontWeight: 700, fontSize: 16, marginBottom: 10, display: 'flex', alignItems: 'center', gap: 8 }}><Trophy size={18} style={{ color: 'var(--accent-4)' }} /> Brand Positioning</h3>
                <p style={{ color: 'var(--text-2)', fontSize: 14, lineHeight: 1.7 }}>{plan.brandPositioning}</p>
              </div>
            </div>
            {/* Phase overview */}
            <div className="card" style={{ padding: 28 }}>
              <h3 style={{ fontFamily: 'Bricolage Grotesque', fontWeight: 700, fontSize: 18, marginBottom: 20 }}>Your Roadmap at a Glance</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {plan.phases?.map((phase, i) => {
                  const colorKey = phase.color || defaultPhaseColors[i % defaultPhaseColors.length];
                  const colors = phaseColors[colorKey] || phaseColors.purple;
                  return (
                    <div key={i} style={{ display: 'flex', gap: 16, alignItems: 'flex-start', padding: '16px 20px', background: colors.bg, border: `1px solid ${colors.border}`, borderRadius: 12 }}>
                      <div style={{ width: 36, height: 36, borderRadius: 8, background: colors.border, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Bricolage Grotesque', fontWeight: 800, fontSize: 14, color: colors.text, flexShrink: 0 }}>P{i + 1}</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                          <span style={{ fontFamily: 'Bricolage Grotesque', fontWeight: 700, fontSize: 15, color: colors.text }}>{phase.name}</span>
                          <span style={{ fontSize: 12, color: 'var(--text-3)', background: 'var(--surface-2)', padding: '2px 8px', borderRadius: 10 }}>{phase.duration}</span>
                        </div>
                        <p style={{ fontSize: 13, color: 'var(--text-2)', marginBottom: 6 }}>{phase.objective}</p>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                          {phase.tactics?.slice(0, 3).map((t, j) => <span key={j} style={{ fontSize: 11, color: 'var(--text-3)', background: 'var(--surface)', padding: '3px 8px', borderRadius: 6, border: '1px solid var(--border)' }}>{t}</span>)}
                          {(phase.tactics?.length || 0) > 3 && <span style={{ fontSize: 11, color: 'var(--text-3)' }}>+{(phase.tactics?.length || 0) - 3} more</span>}
                        </div>
                      </div>
                      <div style={{ textAlign: 'right', flexShrink: 0 }}>
                        <p style={{ fontSize: 12, color: colors.text, fontWeight: 700 }}>{phase.budget}</p>
                        <p style={{ fontSize: 11, color: 'var(--text-3)' }}>/month</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            {/* Milestones */}
            {plan.successMilestones?.length > 0 && (
              <div className="card" style={{ padding: 28 }}>
                <h3 style={{ fontFamily: 'Bricolage Grotesque', fontWeight: 700, fontSize: 18, marginBottom: 16 }}>🏆 Success Milestones</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12 }}>
                  {plan.successMilestones.map((m, i) => (
                    <div key={i} style={{ background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 10, padding: 16 }}>
                      <p style={{ fontSize: 12, color: 'var(--accent)', fontWeight: 700, marginBottom: 6 }}>{m.timeline}</p>
                      <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', marginBottom: 6 }}>{m.milestone}</p>
                      <p style={{ fontSize: 11, color: 'var(--text-3)' }}>📊 {m.metric}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* MESSAGING */}
        {activeTab === 'messaging' && plan.messagingFramework && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div className="card" style={{ padding: 28 }}>
              <h2 style={{ fontFamily: 'Bricolage Grotesque', fontWeight: 700, fontSize: 22, marginBottom: 8 }}>Your Messaging Framework</h2>
              <p style={{ color: 'var(--text-3)', fontSize: 14, marginBottom: 24 }}>Use these words and phrases consistently across all your marketing.</p>
              <div style={{ background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 16, padding: 24, marginBottom: 20 }}>
                <p style={{ fontSize: 11, color: 'var(--text-3)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>Main Headline</p>
                <p style={{ fontFamily: 'Bricolage Grotesque', fontSize: 32, fontWeight: 800, color: 'var(--accent)', letterSpacing: '-0.02em', lineHeight: 1.2 }}>{plan.messagingFramework.headline}</p>
              </div>
              <div style={{ background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 12, padding: 20, marginBottom: 20 }}>
                <p style={{ fontSize: 11, color: 'var(--text-3)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 6 }}>Subheadline</p>
                <p style={{ fontSize: 18, fontWeight: 600, color: 'var(--text-2)', lineHeight: 1.4 }}>{plan.messagingFramework.subheadline}</p>
              </div>
              <div style={{ background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 12, padding: 20, marginBottom: 20 }}>
                <p style={{ fontSize: 11, color: 'var(--text-3)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 6 }}>Your 30-Second Pitch</p>
                <p style={{ fontSize: 15, color: 'var(--text)', lineHeight: 1.7 }}>{plan.messagingFramework.elevatorPitch || plan.messagingFramework['elevator pitch' as keyof typeof plan.messagingFramework]}</p>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                <div>
                  <p style={{ fontSize: 11, color: 'var(--text-3)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12 }}>Key Messages</p>
                  {plan.messagingFramework.keyMessages?.map((m, i) => (
                    <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 10, padding: '10px 14px', background: 'var(--surface-2)', borderRadius: 8, border: '1px solid var(--border)' }}>
                      <span style={{ color: 'var(--accent)', fontWeight: 700, fontSize: 14, flexShrink: 0 }}>{i + 1}</span>
                      <p style={{ fontSize: 13, color: 'var(--text)', lineHeight: 1.5 }}>{m}</p>
                    </div>
                  ))}
                </div>
                <div>
                  <p style={{ fontSize: 11, color: 'var(--text-3)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12 }}>Tone of Voice</p>
                  {plan.messagingFramework.toneOfVoice?.map((t, i) => (
                    <div key={i} style={{ display: 'inline-flex', marginRight: 8, marginBottom: 8, padding: '6px 14px', background: 'rgba(108,99,255,0.1)', border: '1px solid rgba(108,99,255,0.3)', borderRadius: 20, fontSize: 13, color: 'var(--accent)', fontWeight: 600 }}>{t}</div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* PHASE TABS */}
        {plan.phases?.map((phase, i) => activeTab === `phase-${i}` && (
          <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 20, animation: 'fadeIn 0.3s ease' }}>
            {(() => {
              const colorKey = phase.color || defaultPhaseColors[i % defaultPhaseColors.length];
              const colors = phaseColors[colorKey] || phaseColors.purple;
              return (
                <>
                  {/* Phase header */}
                  <div style={{ background: colors.bg, border: `1px solid ${colors.border}`, borderRadius: 20, padding: 28 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                      <span style={{ fontFamily: 'Bricolage Grotesque', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: colors.text, background: colors.border, padding: '4px 12px', borderRadius: 20 }}>Phase {i + 1} · {phase.duration}</span>
                    </div>
                    <h2 style={{ fontFamily: 'Bricolage Grotesque', fontSize: 28, fontWeight: 800, color: colors.text, marginBottom: 8 }}>{phase.name}</h2>
                    <p style={{ fontSize: 16, color: 'var(--text-2)', marginBottom: 16, fontWeight: 500 }}>{phase.objective}</p>
                    <p style={{ fontSize: 14, color: 'var(--text-2)', lineHeight: 1.7 }}>{phase.description}</p>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                    {/* Tactics */}
                    <div className="card" style={{ padding: 24 }}>
                      <h3 style={{ fontFamily: 'Bricolage Grotesque', fontWeight: 700, fontSize: 16, marginBottom: 14 }}>What You'll Do This Phase</h3>
                      {phase.tactics?.map((tactic, j) => (
                        <div key={j} style={{ display: 'flex', gap: 10, marginBottom: 10, padding: '10px 14px', background: 'var(--surface-2)', borderRadius: 8, border: '1px solid var(--border)' }}>
                          <span style={{ color: colors.text, fontWeight: 700, flexShrink: 0, fontSize: 16 }}>→</span>
                          <p style={{ fontSize: 13, color: 'var(--text)', lineHeight: 1.5 }}>{tactic}</p>
                        </div>
                      ))}
                    </div>

                    {/* Expected outcomes */}
                    <div className="card" style={{ padding: 24 }}>
                      <h3 style={{ fontFamily: 'Bricolage Grotesque', fontWeight: 700, fontSize: 16, marginBottom: 14 }}>What to Expect</h3>
                      {phase.expectedOutcomes?.map((o, j) => (
                        <div key={j} style={{ display: 'flex', gap: 10, marginBottom: 10, padding: '10px 14px', background: 'rgba(67,233,123,0.08)', borderRadius: 8, border: '1px solid rgba(67,233,123,0.2)' }}>
                          <span style={{ color: '#43e97b', flexShrink: 0 }}>✓</span>
                          <p style={{ fontSize: 13, color: 'var(--text-2)', lineHeight: 1.5 }}>{o}</p>
                        </div>
                      ))}
                      <div style={{ marginTop: 16, padding: '12px 16px', background: 'var(--surface-2)', borderRadius: 10, border: '1px solid var(--border)' }}>
                        <p style={{ fontSize: 12, color: 'var(--text-3)', fontWeight: 600, marginBottom: 2 }}>BUDGET THIS PHASE</p>
                        <p style={{ fontFamily: 'Bricolage Grotesque', fontSize: 22, fontWeight: 800, color: colors.text }}>{phase.budget}</p>
                      </div>
                    </div>
                  </div>

                  {/* KPIs */}
                  {phase.kpis?.length > 0 && (
                    <div className="card" style={{ padding: 24 }}>
                      <h3 style={{ fontFamily: 'Bricolage Grotesque', fontWeight: 700, fontSize: 18, marginBottom: 16 }}>📈 How You'll Measure Success</h3>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 12 }}>
                        {phase.kpis.map((kpi, j) => <KPICard key={j} {...kpi} />)}
                      </div>
                    </div>
                  )}

                  {/* Action Items */}
                  {phase.actionItems?.length > 0 && (
                    <div className="card" style={{ padding: 24 }}>
                      <h3 style={{ fontFamily: 'Bricolage Grotesque', fontWeight: 700, fontSize: 18, marginBottom: 4 }}>⚡ Action Items</h3>
                      <p style={{ color: 'var(--text-3)', fontSize: 13, marginBottom: 16 }}>Click any item to expand the full instructions</p>
                      {phase.actionItems.map((item, j) => <ActionItemCard key={j} item={item} index={j} />)}
                    </div>
                  )}
                </>
              );
            })()}
          </div>
        ))}

        {/* KPIs TAB */}
        {activeTab === 'kpis' && (
          <div>
            <div className="card" style={{ padding: 28, marginBottom: 20 }}>
              <h2 style={{ fontFamily: 'Bricolage Grotesque', fontWeight: 700, fontSize: 22, marginBottom: 6 }}>📈 Your 12-Month KPIs</h2>
              <p style={{ color: 'var(--text-3)', fontSize: 14, marginBottom: 24 }}>These are the numbers you should be checking monthly to know if your marketing is working.</p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 16 }}>
                {plan.overallKPIs?.map((kpi, i) => <KPICard key={i} {...kpi} />)}
              </div>
            </div>
          </div>
        )}

        {/* BUDGET TAB */}
        {activeTab === 'budget' && (
          <div className="card" style={{ padding: 28 }}>
            <h2 style={{ fontFamily: 'Bricolage Grotesque', fontWeight: 700, fontSize: 22, marginBottom: 6 }}>💰 Budget Breakdown</h2>
            <p style={{ color: 'var(--text-3)', fontSize: 14, marginBottom: 24 }}>How to allocate your marketing budget for maximum impact.</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {plan.totalBudgetBreakdown?.map((b, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '16px 20px', background: 'var(--surface-2)', borderRadius: 12, border: '1px solid var(--border)' }}>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontWeight: 600, fontSize: 14, marginBottom: 6 }}>{b.category}</p>
                    <div style={{ height: 8, background: 'var(--surface-3)', borderRadius: 4, overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${b.percentage}%`, background: `hsl(${i * 60 + 240}, 70%, 65%)`, borderRadius: 4, transition: 'width 0.6s ease' }} />
                    </div>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <p style={{ fontFamily: 'Bricolage Grotesque', fontSize: 18, fontWeight: 800 }}>{b.percentage}%</p>
                    <p style={{ fontSize: 13, color: 'var(--text-3)' }}>{b.monthly}/mo</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TOOLS TAB */}
        {activeTab === 'tools' && (
          <div className="card" style={{ padding: 28 }}>
            <h2 style={{ fontFamily: 'Bricolage Grotesque', fontWeight: 700, fontSize: 22, marginBottom: 6 }}>🔧 Tools & Resources</h2>
            <p style={{ color: 'var(--text-3)', fontSize: 14, marginBottom: 24 }}>The exact tools you'll need to execute this plan.</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 14 }}>
              {plan.toolsAndResources?.map((tool, i) => {
                const pColors = { Essential: '#ff91a8', Recommended: '#f8a935', Optional: '#43e97b' };
                const pc = pColors[tool.priority as keyof typeof pColors] || '#a89cff';
                return (
                  <div key={i} style={{ background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 12, padding: 18 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                      <p style={{ fontFamily: 'Bricolage Grotesque', fontWeight: 700, fontSize: 15 }}>{tool.name}</p>
                      <span style={{ fontSize: 11, color: pc, fontWeight: 700, background: `${pc}15`, padding: '2px 8px', borderRadius: 6 }}>{tool.priority}</span>
                    </div>
                    <p style={{ fontSize: 13, color: 'var(--text-2)', marginBottom: 8, lineHeight: 1.5 }}>{tool.purpose}</p>
                    <p style={{ fontSize: 13, color: 'var(--accent)', fontWeight: 600 }}>💳 {tool.cost}</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* RISKS TAB */}
        {activeTab === 'risks' && (
          <div className="card" style={{ padding: 28 }}>
            <h2 style={{ fontFamily: 'Bricolage Grotesque', fontWeight: 700, fontSize: 22, marginBottom: 6 }}>⚠️ Risk Mitigation</h2>
            <p style={{ color: 'var(--text-3)', fontSize: 14, marginBottom: 24 }}>Common pitfalls and exactly how to avoid or handle them.</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {plan.riskMitigation?.map((r, i) => (
                <div key={i} style={{ background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 12, padding: 20, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                  <div>
                    <p style={{ fontSize: 11, color: '#ff91a8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>⚠ Risk</p>
                    <p style={{ fontSize: 14, color: 'var(--text)', lineHeight: 1.5 }}>{r.risk}</p>
                  </div>
                  <div>
                    <p style={{ fontSize: 11, color: '#43e97b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>✓ How to Handle It</p>
                    <p style={{ fontSize: 14, color: 'var(--text-2)', lineHeight: 1.5 }}>{r.mitigation}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Bottom CTA */}
      <div style={{ marginTop: 32, background: 'linear-gradient(135deg, rgba(108,99,255,0.15), rgba(255,101,132,0.1))', border: '1px solid rgba(108,99,255,0.3)', borderRadius: 20, padding: '28px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h3 style={{ fontFamily: 'Bricolage Grotesque', fontSize: 20, fontWeight: 800, marginBottom: 4 }}>Ready to start executing?</h3>
          <p style={{ color: 'var(--text-2)', fontSize: 14 }}>Move to the Action Board to manage your weekly tasks, check off progress, and stay on track.</p>
        </div>
        <button onClick={onStartBoard} className="btn-primary" style={{ padding: '16px 36px', fontSize: 15, flexShrink: 0 }}>
          ⚡ Open Action Board
        </button>
      </div>
    </div>
  );
}
