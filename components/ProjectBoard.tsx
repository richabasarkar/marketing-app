'use client';

import { useState, useMemo } from 'react';
import { ActionItem, MarketingPlan } from '@/types';
import { CheckCircle, Circle, ChevronDown, ChevronRight, Filter, BarChart3, Calendar, Zap, Tag } from 'lucide-react';

interface Props {
  actionItems: ActionItem[];
  onUpdate: (items: ActionItem[]) => void;
  plan: MarketingPlan | null;
}

type ViewMode = 'week' | 'phase' | 'priority' | 'category';

const priorityColors = { High: { text: '#ff91a8', bg: 'rgba(255,101,132,0.1)', border: 'rgba(255,101,132,0.3)' }, Medium: { text: '#f8a935', bg: 'rgba(248,169,53,0.1)', border: 'rgba(248,169,53,0.3)' }, Low: { text: '#43e97b', bg: 'rgba(67,233,123,0.1)', border: 'rgba(67,233,123,0.3)' } };

const categoryEmojis: Record<string, string> = { Content: '✍️', Ads: '📣', Social: '📱', Email: '📧', SEO: '🔍', Analytics: '📊', Website: '💻', Strategy: '🧭', Partnerships: '🤝', PR: '📰', Other: '⚡' };

function TaskItem({ item, onToggle }: { item: ActionItem; onToggle: () => void }) {
  const [expanded, setExpanded] = useState(false);
  const pc = priorityColors[item.priority] || priorityColors.Medium;
  const emoji = categoryEmojis[item.category] || '⚡';

  return (
    <div style={{
      background: item.completed ? 'var(--surface)' : 'var(--surface)',
      border: `1px solid ${item.completed ? 'var(--border)' : 'var(--border)'}`,
      borderRadius: 10, marginBottom: 6, overflow: 'hidden',
      opacity: item.completed ? 0.6 : 1,
      transition: 'all 0.2s',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 14px' }}>
        {/* Checkbox */}
        <div
          onClick={onToggle}
          style={{
            width: 20, height: 20, borderRadius: 5, flexShrink: 0, cursor: 'pointer',
            border: `2px solid ${item.completed ? '#43e97b' : 'var(--border-2)'}`,
            background: item.completed ? '#43e97b' : 'transparent',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'all 0.2s',
          }}
        >
          {item.completed && <span style={{ color: '#0a0a0f', fontSize: 11, fontWeight: 900 }}>✓</span>}
        </div>

        {/* Category emoji */}
        <span style={{ fontSize: 14, flexShrink: 0 }}>{emoji}</span>

        {/* Task name */}
        <div style={{ flex: 1, cursor: 'pointer' }} onClick={() => setExpanded(!expanded)}>
          <span style={{
            fontSize: 13, fontWeight: 600,
            textDecoration: item.completed ? 'line-through' : 'none',
            color: item.completed ? 'var(--text-3)' : 'var(--text)',
          }}>
            {item.task}
          </span>
        </div>

        {/* Meta */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
          <span style={{ fontSize: 11, color: pc.text, background: pc.bg, border: `1px solid ${pc.border}`, padding: '2px 8px', borderRadius: 6, fontWeight: 700 }}>{item.priority}</span>
          <span style={{ fontSize: 11, color: 'var(--text-3)', background: 'var(--surface-2)', padding: '2px 8px', borderRadius: 6 }}>~{item.estimatedHours}h</span>
          <span style={{ fontSize: 11, color: 'var(--text-3)' }}>{item.owner}</span>
          <button onClick={() => setExpanded(!expanded)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-3)', padding: 0 }}>
            {expanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          </button>
        </div>
      </div>

      {expanded && (
        <div style={{ padding: '0 14px 14px 44px', borderTop: '1px solid var(--border)' }}>
          <p style={{ fontSize: 13, color: 'var(--text-2)', lineHeight: 1.7, marginTop: 12 }}>{item.description}</p>
          {(item.resources?.length ?? 0) > 0 && (
            <div style={{ marginTop: 10 }}>
              <p style={{ fontSize: 11, color: 'var(--text-3)', fontWeight: 600, marginBottom: 4 }}>RESOURCES & TOOLS:</p>
              {item.resources?.map((r, i) => <p key={i} style={{ fontSize: 12, color: 'var(--accent)', marginBottom: 3 }}>→ {r}</p>)}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function GroupSection({ title, items, color, onToggle }: { title: string; items: ActionItem[]; color: string; onToggle: (id: string) => void }) {
  const [collapsed, setCollapsed] = useState(false);
  const done = items.filter(i => i.completed).length;

  return (
    <div style={{ marginBottom: 24 }}>
      <div
        onClick={() => setCollapsed(!collapsed)}
        style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12, cursor: 'pointer', padding: '8px 0' }}
      >
        <div style={{ width: 4, height: 20, borderRadius: 2, background: color, flexShrink: 0 }} />
        <span style={{ fontFamily: 'Bricolage Grotesque', fontWeight: 700, fontSize: 16, color: 'var(--text)', flex: 1 }}>{title}</span>
        <span style={{ fontSize: 12, color: 'var(--text-3)', background: 'var(--surface-2)', padding: '3px 10px', borderRadius: 20 }}>{done}/{items.length} done</span>
        <div style={{ height: 6, width: 80, background: 'var(--surface-3)', borderRadius: 3, overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${items.length ? (done / items.length) * 100 : 0}%`, background: color, transition: 'width 0.4s ease', borderRadius: 3 }} />
        </div>
        {collapsed ? <ChevronRight size={16} style={{ color: 'var(--text-3)' }} /> : <ChevronDown size={16} style={{ color: 'var(--text-3)' }} />}
      </div>
      {!collapsed && items.map(item => (
        <TaskItem key={item.id} item={item} onToggle={() => onToggle(item.id)} />
      ))}
    </div>
  );
}

export default function ProjectBoard({ actionItems, onUpdate, plan }: Props) {
  const [viewMode, setViewMode] = useState<ViewMode>('week');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const toggleItem = (id: string) => {
    onUpdate(actionItems.map(item => item.id === id ? { ...item, completed: !item.completed } : item));
  };

  const filtered = useMemo(() => {
    return actionItems.filter(item => {
      if (filterPriority !== 'all' && item.priority !== filterPriority) return false;
      if (filterCategory !== 'all' && item.category !== filterCategory) return false;
      if (searchQuery && !item.task.toLowerCase().includes(searchQuery.toLowerCase()) && !item.description?.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      return true;
    });
  }, [actionItems, filterPriority, filterCategory, searchQuery]);

  const categories = [...new Set(actionItems.map(i => i.category).filter(Boolean))];

  const totalDone = actionItems.filter(i => i.completed).length;
  const totalHours = actionItems.reduce((sum, i) => sum + (i.estimatedHours || 0), 0);
  const completedHours = actionItems.filter(i => i.completed).reduce((sum, i) => sum + (i.estimatedHours || 0), 0);
  const overallProgress = actionItems.length ? (totalDone / actionItems.length) * 100 : 0;

  const groupByWeek = useMemo(() => {
    const groups: Record<number, ActionItem[]> = {};
    filtered.forEach(item => {
      const w = item.week || 1;
      if (!groups[w]) groups[w] = [];
      groups[w].push(item);
    });
    return groups;
  }, [filtered]);

  const groupByPhase = useMemo(() => {
    const groups: Record<string, ActionItem[]> = {};
    filtered.forEach(item => {
      const p = item.phase || 'General';
      if (!groups[p]) groups[p] = [];
      groups[p].push(item);
    });
    return groups;
  }, [filtered]);

  const groupByPriority = useMemo(() => {
    const groups: Record<string, ActionItem[]> = { High: [], Medium: [], Low: [] };
    filtered.forEach(item => { if (groups[item.priority]) groups[item.priority].push(item); });
    return groups;
  }, [filtered]);

  const groupByCat = useMemo(() => {
    const groups: Record<string, ActionItem[]> = {};
    filtered.forEach(item => {
      const c = item.category || 'Other';
      if (!groups[c]) groups[c] = [];
      groups[c].push(item);
    });
    return groups;
  }, [filtered]);

  const phaseColors = ['#a89cff', '#ff91a8', '#43e97b', '#f8a935', '#56b6ff', '#ff7f3d'];

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto', animation: 'fadeIn 0.4s ease' }}>
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <span className="badge badge-purple" style={{ marginBottom: 10, display: 'inline-flex' }}>Step 5 of 5</span>
        <h1 style={{ fontFamily: 'Bricolage Grotesque', fontSize: 38, fontWeight: 800, letterSpacing: '-0.03em', marginBottom: 8 }}>
          Your <span style={{ color: 'var(--accent)' }}>Action Board</span>
        </h1>
        <p style={{ color: 'var(--text-2)', fontSize: 15 }}>Check off tasks as you complete them. Stay focused week by week.</p>
      </div>

      {/* Stats cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 28 }}>
        {[
          { label: 'Total Tasks', value: actionItems.length, icon: '📋', color: '#a89cff' },
          { label: 'Completed', value: totalDone, icon: '✅', color: '#43e97b' },
          { label: 'Remaining', value: actionItems.length - totalDone, icon: '⚡', color: '#f8a935' },
          { label: 'Hours Logged', value: `${completedHours}/${totalHours}h`, icon: '⏱', color: '#56b6ff' },
        ].map((stat, i) => (
          <div key={i} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 14, padding: '18px 20px', textAlign: 'center' }}>
            <div style={{ fontSize: 24, marginBottom: 6 }}>{stat.icon}</div>
            <div style={{ fontFamily: 'Bricolage Grotesque', fontSize: 26, fontWeight: 800, color: stat.color }}>{stat.value}</div>
            <div style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 2 }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Progress bar */}
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 14, padding: '18px 24px', marginBottom: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
          <span style={{ fontFamily: 'Bricolage Grotesque', fontWeight: 700, fontSize: 15 }}>Overall Progress</span>
          <span style={{ fontFamily: 'Bricolage Grotesque', fontWeight: 800, fontSize: 18, color: 'var(--accent-3)' }}>{Math.round(overallProgress)}%</span>
        </div>
        <div style={{ height: 12, background: 'var(--surface-3)', borderRadius: 6, overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${overallProgress}%`, background: 'linear-gradient(90deg, var(--accent), var(--accent-3))', borderRadius: 6, transition: 'width 0.5s ease' }} />
        </div>
        {overallProgress === 100 && (
          <p style={{ color: '#43e97b', fontSize: 14, fontWeight: 600, marginTop: 8, textAlign: 'center' }}>🎉 Amazing — all tasks complete! Your marketing is running!</p>
        )}
      </div>

      {/* Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
        {/* View mode */}
        <div style={{ display: 'flex', gap: 4, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, padding: 4 }}>
          {([['week', '📅 By Week'], ['phase', '🗺 By Phase'], ['priority', '⚡ By Priority'], ['category', '🏷 By Category']] as [ViewMode, string][]).map(([mode, label]) => (
            <button key={mode} onClick={() => setViewMode(mode)} style={{
              padding: '6px 14px', borderRadius: 7, border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 600,
              background: viewMode === mode ? 'var(--accent)' : 'transparent',
              color: viewMode === mode ? 'white' : 'var(--text-3)', transition: 'all 0.15s',
            }}>{label}</button>
          ))}
        </div>

        {/* Filters */}
        <select value={filterPriority} onChange={e => setFilterPriority(e.target.value)} className="input-field" style={{ width: 'auto', fontSize: 12, padding: '7px 12px' }}>
          <option value="all">All Priorities</option>
          <option value="High">High Priority</option>
          <option value="Medium">Medium Priority</option>
          <option value="Low">Low Priority</option>
        </select>

        <select value={filterCategory} onChange={e => setFilterCategory(e.target.value)} className="input-field" style={{ width: 'auto', fontSize: 12, padding: '7px 12px' }}>
          <option value="all">All Categories</option>
          {categories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>

        <input
          className="input-field"
          placeholder="Search tasks..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          style={{ flex: 1, minWidth: 180, fontSize: 13, padding: '7px 14px' }}
        />
      </div>

      {/* Task groups */}
      <div>
        {viewMode === 'week' && Object.entries(groupByWeek).sort(([a], [b]) => Number(a) - Number(b)).map(([week, items]) => (
          <GroupSection key={week} title={`Week ${week}`} items={items} color={phaseColors[Number(week) % phaseColors.length]} onToggle={toggleItem} />
        ))}

        {viewMode === 'phase' && Object.entries(groupByPhase).map(([phase, items], i) => (
          <GroupSection key={phase} title={phase} items={items} color={phaseColors[i % phaseColors.length]} onToggle={toggleItem} />
        ))}

        {viewMode === 'priority' && (['High', 'Medium', 'Low'] as const).map(p => groupByPriority[p]?.length > 0 && (
          <GroupSection key={p} title={`${p} Priority`} items={groupByPriority[p]} color={priorityColors[p].text} onToggle={toggleItem} />
        ))}

        {viewMode === 'category' && Object.entries(groupByCat).map(([cat, items], i) => (
          <GroupSection key={cat} title={`${categoryEmojis[cat] || '⚡'} ${cat}`} items={items} color={phaseColors[i % phaseColors.length]} onToggle={toggleItem} />
        ))}

        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px 40px', color: 'var(--text-3)' }}>
            <p style={{ fontSize: 32, marginBottom: 12 }}>🔍</p>
            <p style={{ fontSize: 16, fontWeight: 600 }}>No tasks match your filters</p>
            <p style={{ fontSize: 14, marginTop: 4 }}>Try adjusting the filters above</p>
          </div>
        )}
      </div>

      {/* Quick tips */}
      <div style={{ marginTop: 32, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, padding: '20px 24px' }}>
        <p style={{ fontFamily: 'Bricolage Grotesque', fontWeight: 700, fontSize: 15, marginBottom: 12 }}>💡 Pro Tips for Staying on Track</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {['Focus on High priority tasks first each week', 'Do a 15-minute weekly review every Monday', 'Track your KPIs monthly — not daily (too early)', 'Batch similar tasks together (e.g. all content on one day)', 'Celebrate small wins — consistency beats perfection', 'If a tactic isn\'t working after 4 weeks, pivot quickly'].map((tip, i) => (
            <div key={i} style={{ display: 'flex', gap: 8, padding: '8px 12px', background: 'var(--surface-2)', borderRadius: 8 }}>
              <span style={{ color: 'var(--accent)', fontSize: 14 }}>→</span>
              <p style={{ fontSize: 12, color: 'var(--text-2)', lineHeight: 1.5 }}>{tip}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
