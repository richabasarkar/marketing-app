'use client';

import { useState, useMemo } from 'react';
import { ActionItem, MarketingPlan } from '@/types';
import { ChevronDown, ChevronRight } from 'lucide-react';

interface Props {
  actionItems: ActionItem[];
  onUpdate: (items: ActionItem[]) => void;
  plan: MarketingPlan | null;
}

type ViewMode = 'week' | 'phase' | 'priority' | 'category';

const priorityColors = {
  High:   { text: '#dc2626', bg: '#fef2f2',  border: '#fecaca' },
  Medium: { text: '#d97706', bg: '#fffbeb',  border: '#fde68a' },
  Low:    { text: '#16a34a', bg: '#f0fdf4',  border: '#bbf7d0' },
};

function TaskItem({ item, onToggle }: { item: ActionItem; onToggle: () => void }) {
  const [expanded, setExpanded] = useState(false);
  const pc = priorityColors[item.priority as keyof typeof priorityColors] || priorityColors.Medium;

  return (
    <div style={{ background: 'white', border: '1px solid #e4e2f5', marginBottom: 4, overflow: 'hidden', opacity: item.completed ? 0.55 : 1, transition: 'opacity 0.2s' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '11px 14px' }}>
        <div
          onClick={onToggle}
          style={{ width: 18, height: 18, border: `2px solid ${item.completed ? '#22c55e' : '#ccc9f0'}`, background: item.completed ? '#22c55e' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, cursor: 'pointer', transition: 'all 0.2s' }}
        >
          {item.completed && <span style={{ color: 'white', fontSize: 10, fontWeight: 900 }}>✓</span>}
        </div>
        <div style={{ flex: 1, cursor: 'pointer' }} onClick={() => setExpanded(!expanded)}>
          <span style={{ fontSize: 13, fontWeight: 600, textDecoration: item.completed ? 'line-through' : 'none', color: item.completed ? '#8b87a8' : '#1a1730' }}>
            {item.task}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
          <span style={{ fontSize: 10, color: pc.text, background: pc.bg, border: `1px solid ${pc.border}`, padding: '2px 8px', fontWeight: 700 }}>{item.priority}</span>
          <span style={{ fontSize: 10, color: '#8b87a8', background: '#f8f7ff', padding: '2px 8px', border: '1px solid #e4e2f5' }}>~{item.estimatedHours}h</span>
          <button onClick={() => setExpanded(!expanded)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#8b87a8', padding: 0, display: 'flex' }}>
            {expanded ? <ChevronDown size={13} /> : <ChevronRight size={13} />}
          </button>
        </div>
      </div>
      {expanded && (
        <div style={{ padding: '0 14px 14px 42px', borderTop: '1px solid #f3f2ff' }}>
          <p style={{ fontSize: 13, color: '#4a4568', lineHeight: 1.7, marginTop: 10 }}>{item.description}</p>
          {(item.resources?.length ?? 0) > 0 && (
            <div style={{ marginTop: 10 }}>
              <p style={{ fontSize: 10, color: '#8b87a8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>Resources</p>
              {item.resources?.map((r, i) => <p key={i} style={{ fontSize: 12, color: '#6c63ff', marginBottom: 3 }}>→ {r}</p>)}
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
  const pct = items.length ? (done / items.length) * 100 : 0;

  return (
    <div style={{ marginBottom: 20 }}>
      <div onClick={() => setCollapsed(!collapsed)} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8, cursor: 'pointer', padding: '6px 0' }}>
        <div style={{ width: 3, height: 18, background: color, flexShrink: 0 }} />
        <span style={{ fontFamily: 'Bricolage Grotesque', fontWeight: 700, fontSize: 15, color: '#1a1730', flex: 1 }}>{title}</span>
        <span style={{ fontSize: 11, color: '#8b87a8', background: '#f8f7ff', padding: '2px 10px', border: '1px solid #e4e2f5', fontWeight: 600 }}>{done}/{items.length}</span>
        <div style={{ height: 4, width: 64, background: '#f3f2ff' }}>
          <div style={{ height: '100%', width: `${pct}%`, background: color, transition: 'width 0.4s ease' }} />
        </div>
        {collapsed ? <ChevronRight size={14} style={{ color: '#8b87a8' }} /> : <ChevronDown size={14} style={{ color: '#8b87a8' }} />}
      </div>
      {!collapsed && items.map(item => (
        <TaskItem key={item.id} item={item} onToggle={() => onToggle(item.id)} />
      ))}
    </div>
  );
}

function KPIDashboard({ plan, actionItems }: { plan: MarketingPlan | null; actionItems: ActionItem[] }) {
  const totalDone = actionItems.filter(i => i.completed).length;
  const totalTasks = actionItems.length;
  const progress = totalTasks ? Math.round((totalDone / totalTasks) * 100) : 0;
  const completedHours = actionItems.filter(i => i.completed).reduce((s, i) => s + (i.estimatedHours || 0), 0);
  const totalHours = actionItems.reduce((s, i) => s + (i.estimatedHours || 0), 0);

  const highDone = actionItems.filter(i => i.completed && i.priority === 'High').length;
  const highTotal = actionItems.filter(i => i.priority === 'High').length;

  const byCategory = useMemo(() => {
    const cats: Record<string, { done: number; total: number }> = {};
    actionItems.forEach(item => {
      const c = item.category || 'Other';
      if (!cats[c]) cats[c] = { done: 0, total: 0 };
      cats[c].total++;
      if (item.completed) cats[c].done++;
    });
    return Object.entries(cats).sort((a, b) => b[1].total - a[1].total).slice(0, 5);
  }, [actionItems]);

  const kpis = plan?.overallKPIs?.slice(0, 4) || [];
  const phaseProgress = plan?.phases?.map((phase, i) => {
    const phaseItems = actionItems.filter(item => item.phase === phase.name);
    const phaseDone = phaseItems.filter(i => i.completed).length;
    return { name: phase.name, done: phaseDone, total: phaseItems.length, duration: phase.duration };
  }) || [];

  const accentColors = ['#6c63ff', '#22c55e', '#f59e0b', '#3b82f6', '#ec4899'];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14, height: '100%', overflowY: 'auto' }}>

      {/* Overall progress */}
      <div style={{ background: 'white', border: '1px solid #e4e2f5', padding: '18px 20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 10 }}>
          <div>
            <p style={{ fontSize: 10, color: '#8b87a8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 3 }}>Overall Progress</p>
            <p style={{ fontFamily: 'Bricolage Grotesque', fontWeight: 800, fontSize: 32, color: '#6c63ff', lineHeight: 1 }}>{progress}%</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p style={{ fontFamily: 'Bricolage Grotesque', fontWeight: 700, fontSize: 18, color: '#1a1730' }}>{totalDone}<span style={{ fontSize: 13, color: '#8b87a8', fontWeight: 400 }}>/{totalTasks}</span></p>
            <p style={{ fontSize: 11, color: '#8b87a8' }}>tasks done</p>
          </div>
        </div>
        <div style={{ height: 8, background: '#f3f2ff' }}>
          <div style={{ height: '100%', width: `${progress}%`, background: '#6c63ff', transition: 'width 0.5s ease' }} />
        </div>
        {progress === 100 && <p style={{ color: '#22c55e', fontSize: 12, fontWeight: 600, marginTop: 8 }}>All tasks complete!</p>}
      </div>

      {/* Quick stats */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        {[
          { label: 'High Priority Done', value: `${highDone}/${highTotal}`, color: '#dc2626', bg: '#fef2f2' },
          { label: 'Hours Logged', value: `${completedHours}h`, sub: `of ${totalHours}h`, color: '#6c63ff', bg: '#f8f7ff' },
        ].map((s, i) => (
          <div key={i} style={{ background: s.bg, border: '1px solid #e4e2f5', padding: '14px 16px' }}>
            <p style={{ fontSize: 10, color: '#8b87a8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 4 }}>{s.label}</p>
            <p style={{ fontFamily: 'Bricolage Grotesque', fontWeight: 800, fontSize: 22, color: s.color, lineHeight: 1 }}>{s.value}</p>
            {s.sub && <p style={{ fontSize: 11, color: '#8b87a8', marginTop: 2 }}>{s.sub}</p>}
          </div>
        ))}
      </div>

      {/* Phase progress */}
      {phaseProgress.length > 0 && (
        <div style={{ background: 'white', border: '1px solid #e4e2f5', padding: '18px 20px' }}>
          <p style={{ fontSize: 10, color: '#8b87a8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 14 }}>Phase Progress</p>
          {phaseProgress.map((phase, i) => {
            const pct = phase.total ? Math.round((phase.done / phase.total) * 100) : 0;
            const color = accentColors[i % accentColors.length];
            return (
              <div key={i} style={{ marginBottom: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                  <span style={{ fontSize: 12, fontWeight: 600, color: '#1a1730' }}>{phase.name}</span>
                  <span style={{ fontSize: 11, color: '#8b87a8' }}>{phase.done}/{phase.total}</span>
                </div>
                <div style={{ height: 5, background: '#f3f2ff' }}>
                  <div style={{ height: '100%', width: `${pct}%`, background: color, transition: 'width 0.5s ease' }} />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* KPIs from plan */}
      {kpis.length > 0 && (
        <div style={{ background: 'white', border: '1px solid #e4e2f5', padding: '18px 20px' }}>
          <p style={{ fontSize: 10, color: '#8b87a8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 14 }}>Your KPI Targets</p>
          {kpis.map((kpi, i) => (
            <div key={i} style={{ padding: '12px 14px', marginBottom: 8, background: '#f8f7ff', border: '1px solid #e4e2f5', borderLeft: `3px solid ${accentColors[i % accentColors.length]}` }}>
              <p style={{ fontSize: 12, fontWeight: 600, color: '#1a1730', marginBottom: 3 }}>{kpi.metric}</p>
              <p style={{ fontFamily: 'Bricolage Grotesque', fontWeight: 800, fontSize: 18, color: accentColors[i % accentColors.length], lineHeight: 1, marginBottom: 3 }}>{kpi.target}</p>
              <p style={{ fontSize: 10, color: '#8b87a8' }}>By {kpi.timeframe} · {kpi.frequency}</p>
            </div>
          ))}
        </div>
      )}

      {/* By category */}
      {byCategory.length > 0 && (
        <div style={{ background: 'white', border: '1px solid #e4e2f5', padding: '18px 20px' }}>
          <p style={{ fontSize: 10, color: '#8b87a8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 14 }}>Tasks by Category</p>
          {byCategory.map(([cat, data], i) => {
            const pct = data.total ? Math.round((data.done / data.total) * 100) : 0;
            return (
              <div key={i} style={{ marginBottom: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontSize: 12, color: '#1a1730', fontWeight: 500 }}>{cat}</span>
                  <span style={{ fontSize: 11, color: '#8b87a8' }}>{pct}%</span>
                </div>
                <div style={{ height: 4, background: '#f3f2ff' }}>
                  <div style={{ height: '100%', width: `${pct}%`, background: accentColors[i % accentColors.length], transition: 'width 0.5s ease' }} />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Tips */}
      <div style={{ background: '#f8f7ff', border: '1px solid #e4e2f5', borderLeft: '3px solid #6c63ff', padding: '16px 18px' }}>
        <p style={{ fontFamily: 'Bricolage Grotesque', fontWeight: 700, fontSize: 13, marginBottom: 10, color: '#1a1730' }}>Pro Tips</p>
        {['Focus on High priority tasks first', 'Do a 15-min review every Monday', 'Batch similar tasks on one day', 'If something isn\'t working after 4 weeks, pivot'].map((tip, i) => (
          <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 7 }}>
            <span style={{ color: '#6c63ff', fontSize: 12, flexShrink: 0 }}>→</span>
            <p style={{ fontSize: 12, color: '#4a4568', lineHeight: 1.5 }}>{tip}</p>
          </div>
        ))}
      </div>
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
  const phaseColors = ['#6c63ff', '#ec4899', '#22c55e', '#f59e0b', '#3b82f6', '#f97316'];

  const groupByWeek = useMemo(() => {
    const g: Record<number, ActionItem[]> = {};
    filtered.forEach(item => { const w = item.week || 1; if (!g[w]) g[w] = []; g[w].push(item); });
    return g;
  }, [filtered]);

  const groupByPhase = useMemo(() => {
    const g: Record<string, ActionItem[]> = {};
    filtered.forEach(item => { const p = item.phase || 'General'; if (!g[p]) g[p] = []; g[p].push(item); });
    return g;
  }, [filtered]);

  const groupByPriority = useMemo(() => {
    const g: Record<string, ActionItem[]> = { High: [], Medium: [], Low: [] };
    filtered.forEach(item => { if (g[item.priority]) g[item.priority].push(item); });
    return g;
  }, [filtered]);

  const groupByCat = useMemo(() => {
    const g: Record<string, ActionItem[]> = {};
    filtered.forEach(item => { const c = item.category || 'Other'; if (!g[c]) g[c] = []; g[c].push(item); });
    return g;
  }, [filtered]);

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', animation: 'fadeIn 0.4s ease' }}>

      {/* Centered header */}
      <div style={{ textAlign: 'center', marginBottom: 32, paddingTop: 8 }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
          <div style={{ height: 1, width: 32, background: '#6c63ff' }} />
          <span style={{ fontSize: 11, color: '#6c63ff', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em' }}>Step 5 of 5</span>
          <div style={{ height: 1, width: 32, background: '#6c63ff' }} />
        </div>
        <h1 style={{ fontFamily: 'Bricolage Grotesque', fontSize: 38, fontWeight: 800, letterSpacing: '-0.03em', marginBottom: 8, color: '#1a1730' }}>
          Your <span style={{ color: '#6c63ff' }}>Action Board</span>
        </h1>
        <p style={{ color: '#4a4568', fontSize: 15 }}>Check off tasks as you complete them. Your KPI dashboard updates in real time.</p>
      </div>

      {/* Split layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 20, alignItems: 'start' }}>

        {/* LEFT — Task board */}
        <div>
          {/* Controls */}
          <div style={{ background: 'white', border: '1px solid #e4e2f5', padding: '12px 16px', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', gap: 2, background: '#f8f7ff', border: '1px solid #e4e2f5', padding: 3 }}>
              {([['week', 'By Week'], ['phase', 'By Phase'], ['priority', 'By Priority'], ['category', 'By Category']] as [ViewMode, string][]).map(([mode, label]) => (
                <button key={mode} onClick={() => setViewMode(mode)} style={{ padding: '5px 12px', border: 'none', cursor: 'pointer', fontSize: 11, fontWeight: 700, background: viewMode === mode ? '#6c63ff' : 'transparent', color: viewMode === mode ? 'white' : '#4a4568', transition: 'all 0.15s', letterSpacing: '0.02em' }}>
                  {label}
                </button>
              ))}
            </div>
            <select value={filterPriority} onChange={e => setFilterPriority(e.target.value)} style={{ background: 'white', border: '1px solid #e4e2f5', padding: '6px 10px', fontSize: 11, color: '#4a4568', outline: 'none', cursor: 'pointer' }}>
              <option value="all">All Priorities</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
            <select value={filterCategory} onChange={e => setFilterCategory(e.target.value)} style={{ background: 'white', border: '1px solid #e4e2f5', padding: '6px 10px', fontSize: 11, color: '#4a4568', outline: 'none', cursor: 'pointer' }}>
              <option value="all">All Categories</option>
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <input
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{ flex: 1, minWidth: 140, background: 'white', border: '1px solid #e4e2f5', padding: '6px 12px', fontSize: 12, color: '#1a1730', outline: 'none' }}
              onFocus={e => (e.currentTarget.style.borderColor = '#6c63ff')}
              onBlur={e => (e.currentTarget.style.borderColor = '#e4e2f5')}
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
              <GroupSection key={cat} title={cat} items={items} color={phaseColors[i % phaseColors.length]} onToggle={toggleItem} />
            ))}
            {filtered.length === 0 && (
              <div style={{ textAlign: 'center', padding: '48px 24px', color: '#8b87a8', background: 'white', border: '1px solid #e4e2f5' }}>
                <p style={{ fontSize: 15, fontWeight: 600, marginBottom: 4 }}>No tasks match your filters</p>
                <p style={{ fontSize: 13 }}>Try adjusting the filters above</p>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT — KPI Dashboard */}
        <div style={{ position: 'sticky', top: 24 }}>
          <KPIDashboard plan={plan} actionItems={actionItems} />
        </div>
      </div>
    </div>
  );
}