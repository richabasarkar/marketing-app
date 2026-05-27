'use client';

import { ChevronRight } from 'lucide-react';

type AppStep = 'inputs' | 'strategies' | 'followup' | 'plan' | 'board';

interface SidebarProps {
  currentStep: AppStep;
  onStepClick: (step: AppStep) => void;
  canNavigateTo: (step: AppStep) => boolean;
  steps: AppStep[];
  stepLabels: Record<AppStep, string>;
  stepNumbers: Record<AppStep, number>;
  companyName?: string;
  selectedStrategy?: string;
  onLogoClick?: () => void;
}

const stepIcons: Record<AppStep, string> = { inputs: '🏢', strategies: '🎯', followup: '💬', plan: '📋', board: '⚡' };
const stepDescriptions: Record<AppStep, string> = { inputs: 'Your company profile', strategies: 'AI-matched strategies', followup: 'Customize your plan', plan: 'Your full roadmap', board: 'Week-by-week tasks' };

export default function Sidebar({ currentStep, onStepClick, canNavigateTo, steps, stepLabels, stepNumbers, companyName, selectedStrategy, onLogoClick }: SidebarProps) {
  const currentNum = stepNumbers[currentStep];

  return (
    <aside style={{ position: 'fixed', top: 0, left: 0, bottom: 0, width: 268, background: 'var(--surface)', borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column', zIndex: 100, boxShadow: '2px 0 16px rgba(108,99,255,0.06)' }}>

      {/* Logo */}
      <div onClick={onLogoClick} style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)', cursor: onLogoClick ? 'pointer' : 'default', display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ width: 34, height: 34, borderRadius: 10, background: 'linear-gradient(135deg, var(--accent), #9f8fff)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17, boxShadow: '0 2px 8px rgba(108,99,255,0.3)', flexShrink: 0 }}>⚡</div>
        <div>
          <p style={{ fontFamily: 'Bricolage Grotesque', fontWeight: 800, fontSize: 17, letterSpacing: '-0.02em', color: 'var(--text)', lineHeight: 1.2 }}>StrategyOS</p>
          <p style={{ color: 'var(--text-3)', fontSize: 11, fontWeight: 500 }}>AI Marketing Platform</p>
        </div>
      </div>

      {/* Company context */}
      {companyName && (
        <div style={{ padding: '14px 24px', borderBottom: '1px solid var(--border)', background: 'var(--surface-2)' }}>
          <p style={{ fontSize: 10, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 3, fontWeight: 700 }}>Active Session</p>
          <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)', marginBottom: selectedStrategy ? 3 : 0 }}>{companyName}</p>
          {selectedStrategy && <p style={{ fontSize: 11, color: 'var(--accent)', fontWeight: 600 }}>📌 {selectedStrategy}</p>}
        </div>
      )}

      {/* Steps */}
      <div style={{ flex: 1, padding: '20px 16px', overflowY: 'auto' }}>
        <p style={{ fontSize: 10, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10, paddingLeft: 8, fontWeight: 700 }}>Your Journey</p>
        {steps.map((step, index) => {
          const stepNum = stepNumbers[step];
          const isDone = stepNum < currentNum;
          const isActive = step === currentStep;
          const isAccessible = canNavigateTo(step);
          return (
            <div key={step} style={{ marginBottom: 2 }}>
              <button onClick={() => isAccessible && onStepClick(step)} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px', borderRadius: 10, border: 'none', background: isActive ? 'var(--accent-light)' : 'transparent', cursor: isAccessible ? 'pointer' : 'not-allowed', opacity: isAccessible ? 1 : 0.4, transition: 'all 0.15s', outline: isActive ? '1.5px solid rgba(108,99,255,0.25)' : 'none' }}>
                <div style={{ width: 30, height: 30, borderRadius: 8, flexShrink: 0, background: isDone ? 'var(--accent-3)' : isActive ? 'var(--accent)' : 'var(--surface-2)', border: `1.5px solid ${isDone ? 'var(--accent-3)' : isActive ? 'var(--accent)' : 'var(--border)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: isDone ? 13 : 14, transition: 'all 0.2s', boxShadow: isActive ? '0 2px 8px rgba(108,99,255,0.25)' : 'none' }}>
                  {isDone ? <span style={{ color: 'white', fontSize: 12, fontWeight: 900 }}>✓</span> : stepIcons[step]}
                </div>
                <div style={{ flex: 1, textAlign: 'left' }}>
                  <div style={{ fontFamily: 'Bricolage Grotesque', fontWeight: 700, fontSize: 13, color: isActive ? 'var(--accent)' : isDone ? 'var(--text-2)' : 'var(--text-3)', lineHeight: 1.2 }}>{stepLabels[step]}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 1 }}>{stepDescriptions[step]}</div>
                </div>
                {isActive && <ChevronRight size={14} style={{ color: 'var(--accent)', flexShrink: 0 }} />}
              </button>
              {index < steps.length - 1 && <div style={{ width: 1.5, height: 8, marginLeft: 28, background: isDone ? 'var(--accent-3)' : 'var(--border)', transition: 'background 0.3s' }} />}
            </div>
          );
        })}
      </div>

      {/* Progress */}
      <div style={{ padding: '16px 24px', borderTop: '1px solid var(--border)', background: 'var(--surface-2)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
          <span style={{ fontSize: 11, color: 'var(--text-3)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Progress</span>
          <span style={{ fontSize: 12, color: 'var(--accent)', fontWeight: 800, fontFamily: 'Bricolage Grotesque' }}>{Math.round((currentNum / (steps.length - 1)) * 100)}%</span>
        </div>
        <div style={{ height: 6, background: 'var(--border)', borderRadius: 3, overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${(currentNum / (steps.length - 1)) * 100}%`, background: 'linear-gradient(90deg, var(--accent), #9f8fff)', borderRadius: 3, transition: 'width 0.5s ease' }} />
        </div>
        <p style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 6 }}>Step {currentNum + 1} of {steps.length}</p>
      </div>
    </aside>
  );
}