'use client';

import { useState } from 'react';
import { CompanyInputs, MarketingStrategy, FollowUpAnswers, MarketingPlan, ChatMessage, ActionItem } from '@/types';
import InputsSection from '@/components/InputsSection';
import StrategiesSection from '@/components/StrategiesSection';
import FollowUpSection from '@/components/FollowUpSection';
import PlanSection from '@/components/PlanSection';
import ProjectBoard from '@/components/ProjectBoard';
import ChatBot from '@/components/ChatBot';
import Sidebar from '@/components/Sidebar';
import HomePage from '@/components/HomePage';

type AppStep = 'home' | 'inputs' | 'strategies' | 'followup' | 'plan' | 'board';

export default function Home() {
  const [currentStep, setCurrentStep] = useState<AppStep>('home');
  const [inputs, setInputs] = useState<Partial<CompanyInputs>>({ currentChannels: [], targetAgeRange: [], inHouseCapabilities: [] });
  const [strategies, setStrategies] = useState<MarketingStrategy[]>([]);
  const [selectedStrategy, setSelectedStrategy] = useState<MarketingStrategy | null>(null);
  const [followUpAnswers, setFollowUpAnswers] = useState<Partial<FollowUpAnswers>>({ successMetrics: [] });
  const [plan, setPlan] = useState<MarketingPlan | null>(null);
  const [allActionItems, setAllActionItems] = useState<ActionItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [error, setError] = useState('');

  const steps: Exclude<AppStep, 'home'>[] = ['inputs', 'strategies', 'followup', 'plan', 'board'];
  const stepLabels: Record<Exclude<AppStep, 'home'>, string> = { inputs: 'Company Profile', strategies: 'Your Strategies', followup: 'Plan Details', plan: 'Marketing Plan', board: 'Action Board' };
  const stepNumbers: Record<Exclude<AppStep, 'home'>, number> = { inputs: 0, strategies: 1, followup: 2, plan: 3, board: 4 };

  const canNavigateTo = (step: Exclude<AppStep, 'home'>): boolean => {
    if (step === 'inputs') return true;
    if (step === 'strategies') return strategies.length > 0;
    if (step === 'followup') return !!selectedStrategy;
    if (step === 'plan') return !!plan;
    if (step === 'board') return allActionItems.length > 0;
    return false;
  };

  const generateStrategies = async () => {
    setIsLoading(true); setError('');
    setLoadingMessage('Analyzing your company profile...');
    try {
      setTimeout(() => setLoadingMessage('Crafting personalized strategies...'), 2000);
      setTimeout(() => setLoadingMessage('Almost done...'), 5000);
      const res = await fetch('/api/generate-strategies', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ inputs }) });
      if (!res.ok) throw new Error('Failed');
      const data = await res.json();
      setStrategies(data.strategies);
      setCurrentStep('strategies');
    } catch { setError('Failed to generate strategies. Please check your API key and try again.'); }
    finally { setIsLoading(false); }
  };

  const generatePlan = async () => {
    if (!selectedStrategy) return;
    setIsLoading(true); setError('');
    setLoadingMessage('Building your custom marketing plan...');
    try {
      setTimeout(() => setLoadingMessage('Creating your phase-by-phase roadmap...'), 3000);
      setTimeout(() => setLoadingMessage('Writing your action items...'), 7000);
      const res = await fetch('/api/generate-plan', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ inputs, selectedStrategy, followUpAnswers }) });
      if (!res.ok) throw new Error('Failed');
      const data = await res.json();
      setPlan(data.plan);
      const items: ActionItem[] = [];
      data.plan.phases?.forEach((phase: { actionItems?: ActionItem[] }) => { if (phase.actionItems) items.push(...phase.actionItems); });
      setAllActionItems(items);
      setCurrentStep('plan');
    } catch { setError('Failed to generate plan. Please try again.'); }
    finally { setIsLoading(false); }
  };

  const chatContext = {
    companyName: inputs.companyName, industry: inputs.industry,
    businessType: inputs.businessType, companyStage: inputs.companyStage,
    marketingBudgetMonthly: inputs.marketingBudgetMonthly, primaryGoal: inputs.primaryGoal,
    targetPainPoints: inputs.targetPainPoints, selectedStrategy: selectedStrategy?.name,
    currentPhase: currentStep,
  };

  if (currentStep === 'home') {
    return <HomePage onGetStarted={() => setCurrentStep('inputs')} />;
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg)', position: 'relative' }}>
      <Sidebar
        currentStep={currentStep as Exclude<AppStep, 'home'>}
        onStepClick={(step) => { if (canNavigateTo(step)) setCurrentStep(step); }}
        canNavigateTo={canNavigateTo}
        steps={steps}
        stepLabels={stepLabels}
        stepNumbers={stepNumbers}
        companyName={inputs.companyName}
        selectedStrategy={selectedStrategy?.name}
        onLogoClick={() => setCurrentStep('home')}
      />

      <main style={{ flex: 1, marginLeft: 268, padding: '36px 48px', maxWidth: 'calc(100vw - 268px)', position: 'relative', zIndex: 1, minHeight: '100vh' }}>
        {isLoading && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(248,247,255,0.92)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(8px)' }}>
            <div style={{ textAlign: 'center', padding: 40 }}>
              <div style={{ width: 64, height: 64, borderRadius: '50%', border: '3px solid var(--border)', borderTopColor: 'var(--accent)', animation: 'spin 1s linear infinite', margin: '0 auto 24px' }} />
              <h3 style={{ fontFamily: 'Bricolage Grotesque', fontSize: 22, marginBottom: 8, color: 'var(--text)' }}>{loadingMessage}</h3>
              <p style={{ color: 'var(--text-3)', fontSize: 14 }}>Our AI is crafting personalized insights just for you</p>
              <div style={{ marginTop: 20 }} className="loading-dots"><span /><span /><span /></div>
            </div>
          </div>
        )}

        {error && (
          <div style={{ background: 'rgba(255,101,132,0.06)', border: '1px solid rgba(255,101,132,0.25)', borderRadius: 10, padding: '12px 16px', marginBottom: 24, color: '#e0365a', display: 'flex', alignItems: 'center', gap: 10 }}>
            <span>⚠</span><span style={{ fontSize: 14 }}>{error}</span>
            <button onClick={() => setError('')} style={{ marginLeft: 'auto', background: 'none', border: 'none', color: '#e0365a', cursor: 'pointer', fontSize: 18 }}>×</button>
          </div>
        )}

        {currentStep === 'inputs' && <InputsSection inputs={inputs} onChange={setInputs} onSubmit={generateStrategies} isLoading={isLoading} />}
        {currentStep === 'strategies' && <StrategiesSection strategies={strategies} selectedStrategy={selectedStrategy} onSelect={setSelectedStrategy} onContinue={() => setCurrentStep('followup')} />}
        {currentStep === 'followup' && selectedStrategy && <FollowUpSection strategy={selectedStrategy} answers={followUpAnswers} onChange={setFollowUpAnswers} onSubmit={generatePlan} isLoading={isLoading} />}
        {currentStep === 'plan' && plan && <PlanSection plan={plan} strategy={selectedStrategy!} onStartBoard={() => setCurrentStep('board')} inputs={inputs} />}
        {currentStep === 'board' && <ProjectBoard actionItems={allActionItems} onUpdate={setAllActionItems} plan={plan} />}
      </main>

      <ChatBot isOpen={chatOpen} onToggle={() => setChatOpen(!chatOpen)} messages={chatMessages} onMessagesChange={setChatMessages} context={chatContext} currentStep={currentStep} />
    </div>
  );
}