'use client';

import { CheckCircle, Circle, ChevronRight } from 'lucide-react';

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
}

const stepIcons: Record<AppStep, string> = {
  inputs: '🏢',
  strategies: '🎯',
  followup: '💬',
  plan: '📋',
  board: '⚡',
};

const stepDescriptions: Record<AppStep, string> = {
  inputs: 'Your company profile',
  strategies: 'AI-matched strategies',
  followup: 'Customize your plan',
  plan: 'Your full roadmap',
  board: 'Week-by-week tasks',
};

export default function Sidebar({ currentStep, onStepClick, canNavigateTo, steps, stepLabels, stepNumbers, companyName, selectedStrategy }: SidebarProps) {
  const currentNum = stepNumbers[currentStep];

  return (
    <aside style={{
      position: 'fixed', top: 0, left: 0, bottom: 0, width: 260,
      background: 'var(--surface)', borderRight: '1px solid var(--border)',
      display: 'flex', flexDirection: 'column', zIndex: 100,
      padding: '24px 0',
    }}>
      {/* Logo */}
      <div style={{ padding: '0 24px 24px', borderBottom: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 8,
            background: 'linear-gradient(135deg, var(--accent), var(--accent-2))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 16,
          }}>⚡</div>
          <span style={{ fontFamily: 'Bricolage Grotesque', fontWeight: 800, fontSize: 18, letterSpacing: '-0.02em' }}>
            StrategyOS
          </span>
        </div>
        <p style={{ color: 'var(--text-3)', fontSize: 11, paddingLeft: 42 }}>AI Marketing Platform</p>
      </div>

      {/* Company Context */}
      {companyName && (
        <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--border)' }}>
          <p style={{ fontSize: 11, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4, fontWeight: 600 }}>Active Session</p>
          <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', marginBottom: 2 }}>{companyName}</p>
          {selectedStrategy && (
            <p style={{ fontSize: 11, color: 'var(--accent)', fontWeight: 500 }}>📌 {selectedStrategy}</p>
          )}
        </div>
      )}

      {/* Steps */}
      <div style={{ flex: 1, padding: '20px 16px', overflowY: 'auto' }}>
        <p style={{ fontSize: 11, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12, paddingLeft: 8, fontWeight: 600 }}>Your Journey</p>
        
        {steps.map((step, index) => {
          const stepNum = stepNumbers[step];
          const isDone = stepNum < currentNum;
          const isActive = step === currentStep;
          const isAccessible = canNavigateTo(step);

          return (
            <div key={step} style={{ marginBottom: 2 }}>
              <button
                onClick={() => isAccessible && onStepClick(step)}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', gap: 12,
                  padding: '10px 12px', borderRadius: 10, border: 'none',
                  background: isActive ? 'rgba(108,99,255,0.15)' : 'transparent',
                  cursor: isAccessible ? 'pointer' : 'not-allowed',
                  opacity: isAccessible ? 1 : 0.4,
                  transition: 'all 0.2s',
                  outline: isActive ? '1px solid rgba(108,99,255,0.3)' : 'none',
                }}
              >
                {/* Status indicator */}
                <div style={{
                  width: 28, height: 28, borderRadius: 8, flexShrink: 0,
                  background: isDone ? 'var(--accent-3)' : isActive ? 'var(--accent)' : 'var(--surface-2)',
                  border: `1px solid ${isDone ? 'var(--accent-3)' : isActive ? 'var(--accent)' : 'var(--border)'}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: isDone ? 13 : 14,
                  transition: 'all 0.3s',
                }}>
                  {isDone ? '✓' : stepIcons[step]}
                </div>

                <div style={{ flex: 1, textAlign: 'left' }}>
                  <div style={{
                    fontFamily: 'Bricolage Grotesque', fontWeight: 600, fontSize: 13,
                    color: isActive ? 'var(--text)' : isDone ? 'var(--text-2)' : 'var(--text-3)',
                    lineHeight: 1.2,
                  }}>
                    {stepLabels[step]}
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 1 }}>
                    {stepDescriptions[step]}
                  </div>
                </div>

                {isActive && (
                  <ChevronRight size={14} style={{ color: 'var(--accent)', flexShrink: 0 }} />
                )}
              </button>

              {/* Connector line */}
              {index < steps.length - 1 && (
                <div style={{
                  width: 1, height: 8, marginLeft: 27,
                  background: isDone ? 'var(--accent-3)' : 'var(--border)',
                  transition: 'background 0.3s',
                }} />
              )}
            </div>
          );
        })}
      </div>

      {/* Progress indicator */}
      <div style={{ padding: '16px 24px', borderTop: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
          <span style={{ fontSize: 11, color: 'var(--text-3)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Progress</span>
          <span style={{ fontSize: 11, color: 'var(--accent)', fontWeight: 700 }}>{Math.round((currentNum / (steps.length - 1)) * 100)}%</span>
        </div>
        <div style={{ height: 4, background: 'var(--surface-3)', borderRadius: 2, overflow: 'hidden' }}>
          <div style={{
            height: '100%',
            width: `${(currentNum / (steps.length - 1)) * 100}%`,
            background: 'linear-gradient(90deg, var(--accent), var(--accent-2))',
            borderRadius: 2,
            transition: 'width 0.5s ease',
          }} />
        </div>
        <p style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 8 }}>Step {currentNum + 1} of {steps.length}</p>
      </div>
    </aside>
  );
}
