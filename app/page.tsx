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

type AppStep = 'inputs' | 'strategies' | 'followup' | 'plan' | 'board';

export default function Home() {
  const [currentStep, setCurrentStep] = useState<AppStep>('inputs');
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

  const steps: AppStep[] = ['inputs', 'strategies', 'followup', 'plan', 'board'];
  const stepLabels: Record<AppStep, string> = { inputs: 'Company Profile', strategies: 'Your Strategies', followup: 'Plan Details', plan: 'Marketing Plan', board: 'Action Board' };
  const stepNumbers: Record<AppStep, number> = { inputs: 0, strategies: 1, followup: 2, plan: 3, board: 4 };

  const canNavigateTo = (step: AppStep): boolean => {
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
    } catch (e) { setError('Failed to generate strategies. Please check your API key and try again.'); }
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
    } catch (e) { setError('Failed to generate plan. Please try again.'); }
    finally { setIsLoading(false); }
  };

  const chatContext = { companyName: inputs.companyName, industry: inputs.industry, businessType: inputs.businessType, companyStage: inputs.companyStage, marketingBudgetMonthly: inputs.marketingBudgetMonthly, primaryGoal: inputs.primaryGoal, targetPainPoints: inputs.targetPainPoints, selectedStrategy: selectedStrategy?.name, currentPhase: currentStep };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', position: 'relative' }}>
      <div className="gradient-orb" style={{ width: 600, height: 600, background: 'radial-gradient(circle, rgba(108,99,255,0.12) 0%, transparent 70%)', top: -200, left: -200 }} />
      <div className="gradient-orb" style={{ width: 400, height: 400, background: 'radial-gradient(circle, rgba(255,101,132,0.08) 0%, transparent 70%)', top: 400, right: -100 }} />

      <Sidebar currentStep={currentStep} onStepClick={(step: AppStep) => { if (canNavigateTo(step)) setCurrentStep(step); }} canNavigateTo={canNavigateTo} steps={steps} stepLabels={stepLabels} stepNumbers={stepNumbers} companyName={inputs.companyName} selectedStrategy={selectedStrategy?.name} />

      <main style={{ flex: 1, marginLeft: 260, padding: '32px 40px', maxWidth: 'calc(100vw - 260px)', position: 'relative', zIndex: 1 }}>
        {isLoading && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(10,10,15,0.85)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(8px)' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ width: 64, height: 64, borderRadius: '50%', border: '3px solid var(--border)', borderTopColor: 'var(--accent)', animation: 'spin 1s linear infinite', margin: '0 auto 24px' }} />
              <h3 style={{ fontFamily: 'Bricolage Grotesque', fontSize: 22, marginBottom: 8 }}>{loadingMessage}</h3>
              <p style={{ color: 'var(--text-3)', fontSize: 14 }}>Our AI is crafting personalized insights just for you</p>
              <div style={{ marginTop: 20 }} className="loading-dots"><span /><span /><span /></div>
            </div>
          </div>
        )}

        {error && (
          <div style={{ background: 'rgba(255,101,132,0.1)', border: '1px solid rgba(255,101,132,0.3)', borderRadius: 10, padding: '12px 16px', marginBottom: 24, color: '#ff91a8', display: 'flex', alignItems: 'center', gap: 10 }}>
            <span>⚠</span><span style={{ fontSize: 14 }}>{error}</span>
            <button onClick={() => setError('')} style={{ marginLeft: 'auto', background: 'none', border: 'none', color: '#ff91a8', cursor: 'pointer', fontSize: 18 }}>×</button>
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
