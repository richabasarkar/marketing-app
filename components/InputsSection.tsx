'use client';

import { useState } from 'react';
import { CompanyInputs } from '@/types';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface Props {
  inputs: Partial<CompanyInputs>;
  onChange: (inputs: Partial<CompanyInputs>) => void;
  onSubmit: () => void;
  isLoading: boolean;
}

const SECTIONS = ['basic', 'product', 'financial', 'audience', 'current', 'competition', 'goals', 'team'] as const;
type Section = typeof SECTIONS[number];

const sectionConfig: Record<Section, { label: string; description: string; step: string }> = {
  basic:       { label: 'Basic Info',         description: 'Tell us about your company',        step: '01' },
  product:     { label: 'Product / Service',  description: 'What you sell and why it matters',  step: '02' },
  financial:   { label: 'Budget & Finances',  description: 'Your financial picture',            step: '03' },
  audience:    { label: 'Target Audience',    description: 'Who you\'re trying to reach',       step: '04' },
  current:     { label: 'Current Marketing',  description: 'What you\'re doing now',            step: '05' },
  competition: { label: 'Competition',        description: 'Your market landscape',             step: '06' },
  goals:       { label: 'Goals',              description: 'What success looks like for you',   step: '07' },
  team:        { label: 'Your Team',          description: 'Who will execute the strategy',     step: '08' },
};

function Label({ children, required, tip }: { children: React.ReactNode; required?: boolean; tip?: string }) {
  return (
    <label style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 7 }}>
      <span style={{ color: '#4a4568', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em' }}>{children}</span>
      {required && <span style={{ color: '#e0365a', fontSize: 12, lineHeight: 1 }}>*</span>}
      {tip && <span title={tip} style={{ cursor: 'help', fontSize: 11, color: '#8b87a8' }}>?</span>}
    </label>
  );
}

function Field({ children, span = 1 }: { children: React.ReactNode; span?: number }) {
  return <div style={{ gridColumn: `span ${span}` }}>{children}</div>;
}

function MultiSelect({ options, value, onChange }: { options: string[]; value: string[]; onChange: (v: string[]) => void }) {
  const toggle = (opt: string) => {
    if (value.includes(opt)) onChange(value.filter(v => v !== opt));
    else onChange([...value, opt]);
  };
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 2 }}>
      {options.map(opt => (
        <button key={opt} type="button" onClick={() => toggle(opt)} style={{
          padding: '7px 16px',
          fontSize: 13,
          fontWeight: 500,
          border: value.includes(opt) ? '1.5px solid #6c63ff' : '1.5px solid #e4e2f5',
          background: value.includes(opt) ? '#ede9ff' : 'white',
          color: value.includes(opt) ? '#6c63ff' : '#4a4568',
          cursor: 'pointer',
          transition: 'all 0.15s',
          borderRadius: 0,
        }}>{opt}</button>
      ))}
    </div>
  );
}

const inputStyle = {
  background: 'white',
  border: '1.5px solid #e4e2f5',
  borderRadius: 0,
  padding: '11px 14px',
  color: '#1a1730',
  fontFamily: 'DM Sans, sans-serif',
  fontSize: 14,
  width: '100%',
  outline: 'none',
  transition: 'border-color 0.2s',
};

export default function InputsSection({ inputs, onChange, onSubmit, isLoading }: Props) {
  const [openSections, setOpenSections] = useState<Set<Section>>(new Set(['basic']));
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const toggleSection = (s: Section) => {
    const next = new Set(openSections);
    if (next.has(s)) next.delete(s); else next.add(s);
    setOpenSections(next);
  };

  const set = (key: keyof CompanyInputs, value: string | string[]) => onChange({ ...inputs, [key]: value });

  const fieldStyle = (id: string) => ({
    ...inputStyle,
    borderColor: focusedField === id ? '#6c63ff' : '#e4e2f5',
    boxShadow: focusedField === id ? '0 0 0 3px rgba(108,99,255,0.08)' : 'none',
  });

  const requiredFields = ['industry', 'businessType', 'companyStage', 'productDescription', 'marketingBudgetMonthly', 'primaryGoal'];
  const completedCount = requiredFields.filter(f => inputs[f as keyof CompanyInputs]).length;
  const allRequiredDone = completedCount === requiredFields.length;
  const progressPct = Math.round((completedCount / requiredFields.length) * 100);

  return (
    <div style={{ maxWidth: 760, margin: '0 auto', padding: '0 0 80px', animation: 'fadeIn 0.4s ease' }}>

      {/* Page header — centered */}
      <div style={{ textAlign: 'center', marginBottom: 48, paddingTop: 8 }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
          <div style={{ height: 1, width: 32, background: '#6c63ff' }} />
          <span style={{ fontSize: 11, color: '#6c63ff', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em' }}>Step 1 of 5</span>
          <div style={{ height: 1, width: 32, background: '#6c63ff' }} />
        </div>
        <h1 style={{ fontFamily: 'Bricolage Grotesque', fontSize: 38, fontWeight: 800, letterSpacing: '-0.03em', marginBottom: 12, lineHeight: 1.1, color: '#1a1730' }}>
          Tell us about your <span style={{ color: '#6c63ff' }}>company</span>
        </h1>
        <p style={{ color: '#4a4568', fontSize: 16, lineHeight: 1.7, maxWidth: 480, margin: '0 auto' }}>
          The more detail you give us, the more personalized your strategy will be. Fields marked <span style={{ color: '#e0365a' }}>*</span> are required.
        </p>
      </div>

      {/* Progress bar */}
      <div style={{ marginBottom: 40, background: 'white', border: '1px solid #e4e2f5', padding: '20px 24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <span style={{ fontSize: 12, color: '#4a4568', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Required fields</span>
          <span style={{ fontSize: 13, color: progressPct === 100 ? '#22c55e' : '#6c63ff', fontWeight: 800, fontFamily: 'Bricolage Grotesque' }}>{completedCount} / {requiredFields.length} complete</span>
        </div>
        <div style={{ height: 4, background: '#f3f2ff' }}>
          <div style={{ height: '100%', width: `${progressPct}%`, background: progressPct === 100 ? '#22c55e' : '#6c63ff', transition: 'width 0.4s ease, background 0.3s' }} />
        </div>
        {progressPct === 100 && (
          <p style={{ marginTop: 10, fontSize: 12, color: '#22c55e', fontWeight: 600 }}>All required fields complete — ready to generate!</p>
        )}
      </div>

      {/* Accordion sections */}
      {SECTIONS.map((section, sectionIndex) => {
        const isOpen = openSections.has(section);
        const config = sectionConfig[section];
        return (
          <div key={section} style={{ marginBottom: 2 }}>
            {/* Section header */}
            <button
              type="button"
              onClick={() => toggleSection(section)}
              style={{
                width: '100%',
                padding: '20px 28px',
                display: 'flex',
                alignItems: 'center',
                background: isOpen ? 'white' : '#fafafa',
                border: '1px solid #e4e2f5',
                borderBottom: isOpen ? 'none' : '1px solid #e4e2f5',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'background 0.15s',
                gap: 16,
              }}
            >
              <span style={{ fontFamily: 'Bricolage Grotesque', fontWeight: 800, fontSize: 13, color: '#d4d0f0', letterSpacing: '0.02em', flexShrink: 0 }}>{config.step}</span>
              <div style={{ flex: 1, textAlign: 'center' }}>
                <div style={{ fontFamily: 'Bricolage Grotesque', fontWeight: 700, fontSize: 16, color: isOpen ? '#6c63ff' : '#1a1730', transition: 'color 0.15s' }}>{config.label}</div>
                <div style={{ fontSize: 12, color: '#8b87a8', marginTop: 2 }}>{config.description}</div>
              </div>
              <span style={{ color: '#8b87a8', flexShrink: 0 }}>{isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}</span>
            </button>

            {/* Section body */}
            {isOpen && (
              <div style={{ background: 'white', border: '1px solid #e4e2f5', borderTop: '1px solid #f3f2ff', padding: '32px 28px 36px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px 28px' }}>

                  {section === 'basic' && <>
                    <Field span={2}>
                      <Label required>Company Name</Label>
                      <input style={fieldStyle('companyName')} placeholder="e.g. Acme Co." value={inputs.companyName || ''} onChange={e => set('companyName', e.target.value)} onFocus={() => setFocusedField('companyName')} onBlur={() => setFocusedField(null)} />
                    </Field>
                    <Field>
                      <Label required>Industry</Label>
                      <select style={fieldStyle('industry')} value={inputs.industry || ''} onChange={e => set('industry', e.target.value)} onFocus={() => setFocusedField('industry')} onBlur={() => setFocusedField(null)}>
                        <option value="">Select industry...</option>
                        {['SaaS / Software','E-commerce / Retail','Health & Wellness','Food & Beverage','Finance / Fintech','Education / EdTech','Real Estate','Travel & Hospitality','Beauty & Fashion','Fitness','Professional Services','Legal','Consulting','Agency','Non-profit','Manufacturing','Construction','Automotive','Entertainment','Media','Other'].map(v => <option key={v} value={v}>{v}</option>)}
                      </select>
                    </Field>
                    <Field>
                      <Label required>Business Type</Label>
                      <select style={fieldStyle('businessType')} value={inputs.businessType || ''} onChange={e => set('businessType', e.target.value)} onFocus={() => setFocusedField('businessType')} onBlur={() => setFocusedField(null)}>
                        <option value="">Select type...</option>
                        {['B2C (sell to consumers)','B2B (sell to businesses)','D2C (direct-to-consumer brand)','Marketplace / Platform','B2B2C','Subscription','E-commerce','Brick & Mortar','Hybrid (online + offline)','Freelance / Solo'].map(v => <option key={v} value={v}>{v}</option>)}
                      </select>
                    </Field>
                    <Field>
                      <Label required>Company Stage</Label>
                      <select style={fieldStyle('companyStage')} value={inputs.companyStage || ''} onChange={e => set('companyStage', e.target.value)} onFocus={() => setFocusedField('companyStage')} onBlur={() => setFocusedField(null)}>
                        <option value="">Select stage...</option>
                        {['Just an idea (pre-launch)','Pre-revenue (launched, no sales yet)','Early-stage ($0–$10K/month revenue)','Growing ($10K–$100K/month)','Scaling ($100K–$1M/month)','Enterprise ($1M+/month)'].map(v => <option key={v} value={v}>{v}</option>)}
                      </select>
                    </Field>
                    <Field>
                      <Label>Years in Business</Label>
                      <select style={fieldStyle('yearsInBusiness')} value={inputs.yearsInBusiness || ''} onChange={e => set('yearsInBusiness', e.target.value)} onFocus={() => setFocusedField('yearsInBusiness')} onBlur={() => setFocusedField(null)}>
                        <option value="">Select...</option>
                        {['Less than 6 months','6 months – 1 year','1–2 years','2–5 years','5–10 years','10+ years'].map(v => <option key={v} value={v}>{v}</option>)}
                      </select>
                    </Field>
                    <Field>
                      <Label>Employee Count</Label>
                      <select style={fieldStyle('employeeCount')} value={inputs.employeeCount || ''} onChange={e => set('employeeCount', e.target.value)} onFocus={() => setFocusedField('employeeCount')} onBlur={() => setFocusedField(null)}>
                        <option value="">Select...</option>
                        {['Just me (solo)','2–5','6–15','16–50','51–200','200+'].map(v => <option key={v} value={v}>{v}</option>)}
                      </select>
                    </Field>
                  </>}

                  {section === 'product' && <>
                    <Field span={2}>
                      <Label required tip="Describe what you sell">What do you sell?</Label>
                      <textarea style={{ ...fieldStyle('productDescription'), resize: 'vertical' }} rows={3} placeholder="e.g. We make a project management app for remote teams that shows everyone what needs to be done each day..." value={inputs.productDescription || ''} onChange={e => set('productDescription', e.target.value)} onFocus={() => setFocusedField('productDescription')} onBlur={() => setFocusedField(null)} />
                    </Field>
                    <Field span={2}>
                      <Label required tip="What makes you different?">Unique Value Proposition</Label>
                      <textarea style={{ ...fieldStyle('uniqueValueProp'), resize: 'vertical' }} rows={2} placeholder="e.g. Unlike Asana, our app takes 5 minutes to set up and works out of the box for teams of 2–20..." value={inputs.uniqueValueProp || ''} onChange={e => set('uniqueValueProp', e.target.value)} onFocus={() => setFocusedField('uniqueValueProp')} onBlur={() => setFocusedField(null)} />
                    </Field>
                    <Field>
                      <Label>Price Point</Label>
                      <select style={fieldStyle('pricePoint')} value={inputs.pricePoint || ''} onChange={e => set('pricePoint', e.target.value)} onFocus={() => setFocusedField('pricePoint')} onBlur={() => setFocusedField(null)}>
                        <option value="">Select...</option>
                        {['Budget / Affordable','Mid-range','Premium','Luxury / High-end','Enterprise (custom pricing)','Freemium'].map(v => <option key={v} value={v}>{v}</option>)}
                      </select>
                    </Field>
                    <Field>
                      <Label>Product Category</Label>
                      <input style={fieldStyle('productCategory')} placeholder="e.g. Project management software..." value={inputs.productCategory || ''} onChange={e => set('productCategory', e.target.value)} onFocus={() => setFocusedField('productCategory')} onBlur={() => setFocusedField(null)} />
                    </Field>
                  </>}

                  {section === 'financial' && <>
                    <Field>
                      <Label>Funding Status</Label>
                      <select style={fieldStyle('fundingStatus')} value={inputs.fundingStatus || ''} onChange={e => set('fundingStatus', e.target.value)} onFocus={() => setFocusedField('fundingStatus')} onBlur={() => setFocusedField(null)}>
                        <option value="">Select...</option>
                        {['Bootstrapped (self-funded)','Pre-seed','Seed round funded','Series A','Series B','Series C+','Profitable'].map(v => <option key={v} value={v}>{v}</option>)}
                      </select>
                    </Field>
                    <Field>
                      <Label>Total Funding Raised</Label>
                      <select style={fieldStyle('totalFunding')} value={inputs.totalFunding || ''} onChange={e => set('totalFunding', e.target.value)} onFocus={() => setFocusedField('totalFunding')} onBlur={() => setFocusedField(null)}>
                        <option value="">Select...</option>
                        {['None / $0','Under $50K','$50K–$250K','$250K–$1M','$1M–$5M','$5M–$25M','$25M+'].map(v => <option key={v} value={v}>{v}</option>)}
                      </select>
                    </Field>
                    <Field>
                      <Label>Monthly Revenue</Label>
                      <select style={fieldStyle('monthlyRevenue')} value={inputs.monthlyRevenue || ''} onChange={e => set('monthlyRevenue', e.target.value)} onFocus={() => setFocusedField('monthlyRevenue')} onBlur={() => setFocusedField(null)}>
                        <option value="">Select...</option>
                        {['$0 (pre-revenue)','$1–$5K/month','$5K–$20K/month','$20K–$50K/month','$50K–$100K/month','$100K–$500K/month','$500K+/month'].map(v => <option key={v} value={v}>{v}</option>)}
                      </select>
                    </Field>
                    <Field>
                      <Label required>Monthly Marketing Budget</Label>
                      <select style={fieldStyle('marketingBudgetMonthly')} value={inputs.marketingBudgetMonthly || ''} onChange={e => set('marketingBudgetMonthly', e.target.value)} onFocus={() => setFocusedField('marketingBudgetMonthly')} onBlur={() => setFocusedField(null)}>
                        <option value="">Select...</option>
                        {['Under $500/month','$500–$2,000/month','$2,000–$5,000/month','$5,000–$15,000/month','$15,000–$50,000/month','$50,000–$150,000/month','$150,000+/month'].map(v => <option key={v} value={v}>{v}</option>)}
                      </select>
                    </Field>
                    <Field>
                      <Label>Budget Flexibility</Label>
                      <select style={fieldStyle('budgetFlexibility')} value={inputs.budgetFlexibility || ''} onChange={e => set('budgetFlexibility', e.target.value)} onFocus={() => setFocusedField('budgetFlexibility')} onBlur={() => setFocusedField(null)}>
                        <option value="">Select...</option>
                        {['Fixed — cannot exceed budget','Somewhat flexible (up to 25% over)','Very flexible if ROI justifies it'].map(v => <option key={v} value={v}>{v}</option>)}
                      </select>
                    </Field>
                    <Field>
                      <Label tip="Cost to acquire one customer">Current CAC</Label>
                      <input style={fieldStyle('currentCAC')} placeholder="e.g. $50, Unknown" value={inputs.currentCAC || ''} onChange={e => set('currentCAC', e.target.value)} onFocus={() => setFocusedField('currentCAC')} onBlur={() => setFocusedField(null)} />
                    </Field>
                    <Field>
                      <Label tip="How much a customer is worth over their lifetime">Customer LTV</Label>
                      <input style={fieldStyle('currentLTV')} placeholder="e.g. $500, Unknown" value={inputs.currentLTV || ''} onChange={e => set('currentLTV', e.target.value)} onFocus={() => setFocusedField('currentLTV')} onBlur={() => setFocusedField(null)} />
                    </Field>
                  </>}

                  {section === 'audience' && <>
                    <Field span={2}>
                      <Label>Age Range — select all that apply</Label>
                      <MultiSelect options={['13–17','18–24','25–34','35–44','45–54','55–64','65+']} value={inputs.targetAgeRange || []} onChange={v => set('targetAgeRange', v)} />
                    </Field>
                    <Field>
                      <Label>Gender Focus</Label>
                      <select style={fieldStyle('targetGender')} value={inputs.targetGender || ''} onChange={e => set('targetGender', e.target.value)} onFocus={() => setFocusedField('targetGender')} onBlur={() => setFocusedField(null)}>
                        <option value="">Select...</option>
                        {['All genders equally','Primarily women','Primarily men','Non-binary / gender-fluid focus'].map(v => <option key={v} value={v}>{v}</option>)}
                      </select>
                    </Field>
                    <Field>
                      <Label>Income Level</Label>
                      <select style={fieldStyle('targetIncome')} value={inputs.targetIncome || ''} onChange={e => set('targetIncome', e.target.value)} onFocus={() => setFocusedField('targetIncome')} onBlur={() => setFocusedField(null)}>
                        <option value="">Select...</option>
                        {['Under $30K/year','$30K–$60K/year','$60K–$100K/year','$100K–$200K/year','$200K+/year','All income levels'].map(v => <option key={v} value={v}>{v}</option>)}
                      </select>
                    </Field>
                    <Field>
                      <Label>Geographic Reach</Label>
                      <select style={fieldStyle('targetLocation')} value={inputs.targetLocation || ''} onChange={e => set('targetLocation', e.target.value)} onFocus={() => setFocusedField('targetLocation')} onBlur={() => setFocusedField(null)}>
                        <option value="">Select...</option>
                        {['Local (one city/town)','Regional (state/province)','National','North America','English-speaking global','Global'].map(v => <option key={v} value={v}>{v}</option>)}
                      </select>
                    </Field>
                    <Field>
                      <Label>Specific Geography</Label>
                      <input style={fieldStyle('targetGeography')} placeholder="e.g. New York City..." value={inputs.targetGeography || ''} onChange={e => set('targetGeography', e.target.value)} onFocus={() => setFocusedField('targetGeography')} onBlur={() => setFocusedField(null)} />
                    </Field>
                    <Field span={2}>
                      <Label required>Customer Pain Points</Label>
                      <textarea style={{ ...fieldStyle('targetPainPoints'), resize: 'vertical' }} rows={3} placeholder="What problems are your customers struggling with? What keeps them up at night?" value={inputs.targetPainPoints || ''} onChange={e => set('targetPainPoints', e.target.value)} onFocus={() => setFocusedField('targetPainPoints')} onBlur={() => setFocusedField(null)} />
                    </Field>
                    <Field span={2}>
                      <Label>Buyer Persona</Label>
                      <textarea style={{ ...fieldStyle('buyerPersona'), resize: 'vertical' }} rows={2} placeholder="e.g. 'Sarah, 32, marketing manager at a 50-person startup...'" value={inputs.buyerPersona || ''} onChange={e => set('buyerPersona', e.target.value)} onFocus={() => setFocusedField('buyerPersona')} onBlur={() => setFocusedField(null)} />
                    </Field>
                  </>}

                  {section === 'current' && <>
                    <Field span={2}>
                      <Label>Current Marketing Channels — select all that apply</Label>
                      <MultiSelect options={['Instagram','Facebook','TikTok','LinkedIn','Twitter/X','YouTube','Email Marketing','Google Ads','Facebook/Instagram Ads','SEO / Blog','Podcast','Influencer Marketing','Word of Mouth','Cold Outreach','Events / Trade Shows','PR / Press','Affiliate','SMS','None yet']} value={inputs.currentChannels || []} onChange={v => set('currentChannels', v)} />
                    </Field>
                    <Field>
                      <Label>Monthly Website Traffic</Label>
                      <select style={fieldStyle('currentMonthlyTraffic')} value={inputs.currentMonthlyTraffic || ''} onChange={e => set('currentMonthlyTraffic', e.target.value)} onFocus={() => setFocusedField('currentMonthlyTraffic')} onBlur={() => setFocusedField(null)}>
                        <option value="">Select...</option>
                        {['0 (no website yet)','Under 500','500–2,000','2,000–10,000','10,000–50,000','50,000–200,000','200,000+'].map(v => <option key={v} value={v}>{v}</option>)}
                      </select>
                    </Field>
                    <Field>
                      <Label>Current Conversion Rate</Label>
                      <select style={fieldStyle('currentConversionRate')} value={inputs.currentConversionRate || ''} onChange={e => set('currentConversionRate', e.target.value)} onFocus={() => setFocusedField('currentConversionRate')} onBlur={() => setFocusedField(null)}>
                        <option value="">Select...</option>
                        {['Unknown','Under 0.5%','0.5–1%','1–3%','3–5%','5%+'].map(v => <option key={v} value={v}>{v}</option>)}
                      </select>
                    </Field>
                    <Field span={2}>
                      <Label required>Biggest Marketing Challenge</Label>
                      <textarea style={{ ...fieldStyle('biggestMarketingChallenge'), resize: 'vertical' }} rows={2} placeholder="e.g. 'We get traffic but no one converts...'" value={inputs.biggestMarketingChallenge || ''} onChange={e => set('biggestMarketingChallenge', e.target.value)} onFocus={() => setFocusedField('biggestMarketingChallenge')} onBlur={() => setFocusedField(null)} />
                    </Field>
                    <Field span={2}>
                      <Label>Past Marketing Failures</Label>
                      <textarea style={{ ...fieldStyle('pastMarketingFailures'), resize: 'vertical' }} rows={2} placeholder="What have you tried that didn't work? This helps us avoid recommending the same things." value={inputs.pastMarketingFailures || ''} onChange={e => set('pastMarketingFailures', e.target.value)} onFocus={() => setFocusedField('pastMarketingFailures')} onBlur={() => setFocusedField(null)} />
                    </Field>
                  </>}

                  {section === 'competition' && <>
                    <Field span={2}>
                      <Label>Main Competitors</Label>
                      <textarea style={{ ...fieldStyle('mainCompetitors'), resize: 'vertical' }} rows={2} placeholder="e.g. Company A, Company B, Company C..." value={inputs.mainCompetitors || ''} onChange={e => set('mainCompetitors', e.target.value)} onFocus={() => setFocusedField('mainCompetitors')} onBlur={() => setFocusedField(null)} />
                    </Field>
                    <Field span={2}>
                      <Label>Your Competitive Differentiator</Label>
                      <textarea style={{ ...fieldStyle('competitiveDifferentiator'), resize: 'vertical' }} rows={2} placeholder="Why would someone choose you over a competitor?" value={inputs.competitiveDifferentiator || ''} onChange={e => set('competitiveDifferentiator', e.target.value)} onFocus={() => setFocusedField('competitiveDifferentiator')} onBlur={() => setFocusedField(null)} />
                    </Field>
                    <Field>
                      <Label>Market Position</Label>
                      <select style={fieldStyle('marketPosition')} value={inputs.marketPosition || ''} onChange={e => set('marketPosition', e.target.value)} onFocus={() => setFocusedField('marketPosition')} onBlur={() => setFocusedField(null)}>
                        <option value="">Select...</option>
                        {['Market leader','Challenger','Niche player','New entrant','Disruptor'].map(v => <option key={v} value={v}>{v}</option>)}
                      </select>
                    </Field>
                  </>}

                  {section === 'goals' && <>
                    <Field span={2}>
                      <Label required>Primary Marketing Goal</Label>
                      <select style={fieldStyle('primaryGoal')} value={inputs.primaryGoal || ''} onChange={e => set('primaryGoal', e.target.value)} onFocus={() => setFocusedField('primaryGoal')} onBlur={() => setFocusedField(null)}>
                        <option value="">Select your #1 goal...</option>
                        {['Build brand awareness','Generate leads','Drive direct sales','Grow email/subscriber list','Retain existing customers','Launch a new product','Enter a new market','Build a community','Reduce customer acquisition cost','All of the above'].map(v => <option key={v} value={v}>{v}</option>)}
                      </select>
                    </Field>
                    <Field>
                      <Label>12-Month Revenue Goal</Label>
                      <input style={fieldStyle('revenueGoal12Months')} placeholder="e.g. $500K, $1M..." value={inputs.revenueGoal12Months || ''} onChange={e => set('revenueGoal12Months', e.target.value)} onFocus={() => setFocusedField('revenueGoal12Months')} onBlur={() => setFocusedField(null)} />
                    </Field>
                    <Field>
                      <Label>Customer Growth Goal</Label>
                      <input style={fieldStyle('customerGrowthGoal')} placeholder="e.g. 100 new customers..." value={inputs.customerGrowthGoal || ''} onChange={e => set('customerGrowthGoal', e.target.value)} onFocus={() => setFocusedField('customerGrowthGoal')} onBlur={() => setFocusedField(null)} />
                    </Field>
                    <Field>
                      <Label>Timeline Urgency</Label>
                      <select style={fieldStyle('timelineUrgency')} value={inputs.timelineUrgency || ''} onChange={e => set('timelineUrgency', e.target.value)} onFocus={() => setFocusedField('timelineUrgency')} onBlur={() => setFocusedField(null)}>
                        <option value="">Select...</option>
                        {['Immediate (30 days)','Short-term (3 months)','Medium-term (6 months)','Long-term (12 months)','No specific deadline'].map(v => <option key={v} value={v}>{v}</option>)}
                      </select>
                    </Field>
                    <Field>
                      <Label>Seasonality</Label>
                      <select style={fieldStyle('seasonality')} value={inputs.seasonality || ''} onChange={e => set('seasonality', e.target.value)} onFocus={() => setFocusedField('seasonality')} onBlur={() => setFocusedField(null)}>
                        <option value="">Select...</option>
                        {['No seasonality','Holiday/Q4 heavy','Summer heavy','Spring heavy','B2B calendar','Event-driven'].map(v => <option key={v} value={v}>{v}</option>)}
                      </select>
                    </Field>
                  </>}

                  {section === 'team' && <>
                    <Field>
                      <Label>Do you have a marketing team?</Label>
                      <select style={fieldStyle('hasMarketingTeam')} value={inputs.hasMarketingTeam || ''} onChange={e => set('hasMarketingTeam', e.target.value)} onFocus={() => setFocusedField('hasMarketingTeam')} onBlur={() => setFocusedField(null)}>
                        <option value="">Select...</option>
                        {['No — just me','I have some help','Small team (1–3 marketers)','Dedicated marketing team (4+)','Agency or contractor'].map(v => <option key={v} value={v}>{v}</option>)}
                      </select>
                    </Field>
                    <Field>
                      <Label>Weekly Time for Marketing</Label>
                      <select style={fieldStyle('marketingTeamSize')} value={inputs.marketingTeamSize || ''} onChange={e => set('marketingTeamSize', e.target.value)} onFocus={() => setFocusedField('marketingTeamSize')} onBlur={() => setFocusedField(null)}>
                        <option value="">Select...</option>
                        {['Under 5 hours/week','5–10 hours/week','10–20 hours/week','20–40 hours/week','Full-time (40+ hrs/week)'].map(v => <option key={v} value={v}>{v}</option>)}
                      </select>
                    </Field>
                    <Field span={2}>
                      <Label>In-house Skills — select all you have</Label>
                      <MultiSelect options={['Writing / Copywriting','Graphic Design','Video Editing','Photography','Web Development','Data Analysis','Paid Ads Management','Social Media','Email Marketing','SEO','Public Relations','None of the above']} value={inputs.inHouseCapabilities || []} onChange={v => set('inHouseCapabilities', v)} />
                    </Field>
                    <Field span={2}>
                      <Label>Anything else we should know?</Label>
                      <textarea style={{ ...fieldStyle('additionalContext'), resize: 'vertical' }} rows={3} placeholder="Past wins, upcoming launches, partnerships, special circumstances..." value={inputs.additionalContext || ''} onChange={e => set('additionalContext', e.target.value)} onFocus={() => setFocusedField('additionalContext')} onBlur={() => setFocusedField(null)} />
                    </Field>
                  </>}

                </div>

                {/* Next section nudge */}
                {sectionIndex < SECTIONS.length - 1 && (
                  <div style={{ marginTop: 28, paddingTop: 20, borderTop: '1px solid #f3f2ff', display: 'flex', justifyContent: 'flex-end' }}>
                    <button
                      type="button"
                      onClick={() => {
                        toggleSection(section);
                        const next = SECTIONS[sectionIndex + 1];
                        setOpenSections(prev => new Set([...prev, next]));
                        setTimeout(() => document.getElementById(`section-${next}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
                      }}
                      style={{ background: 'none', border: '1.5px solid #e4e2f5', padding: '9px 20px', fontSize: 13, fontWeight: 600, color: '#4a4568', cursor: 'pointer', fontFamily: 'Bricolage Grotesque', display: 'flex', alignItems: 'center', gap: 8, transition: 'all 0.15s' }}
                      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = '#6c63ff'; (e.currentTarget as HTMLElement).style.color = '#6c63ff'; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = '#e4e2f5'; (e.currentTarget as HTMLElement).style.color = '#4a4568'; }}
                    >
                      Next: {sectionConfig[SECTIONS[sectionIndex + 1]].label} →
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Invisible anchor for scroll */}
            <div id={`section-${section}`} />
          </div>
        );
      })}

      {/* Submit */}
      <div style={{ marginTop: 32, background: 'white', border: '1px solid #e4e2f5', padding: '28px 32px' }}>
        <div style={{ textAlign: 'center', marginBottom: 20 }}>
          <h3 style={{ fontFamily: 'Bricolage Grotesque', fontSize: 20, fontWeight: 800, marginBottom: 6, color: '#1a1730' }}>
            Ready to generate your strategies?
          </h3>
          <p style={{ color: allRequiredDone ? '#22c55e' : '#8b87a8', fontSize: 13, fontWeight: 500 }}>
            {allRequiredDone
              ? 'All required fields complete — let\'s build your strategy'
              : `${requiredFields.length - completedCount} required field${requiredFields.length - completedCount !== 1 ? 's' : ''} still needed`}
          </p>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <button
            onClick={onSubmit}
            disabled={!allRequiredDone || isLoading}
            style={{
              background: allRequiredDone ? '#6c63ff' : '#d4d0f0',
              color: 'white', border: 'none',
              padding: '15px 48px',
              fontFamily: 'Bricolage Grotesque', fontWeight: 700, fontSize: 15,
              cursor: allRequiredDone ? 'pointer' : 'not-allowed',
              transition: 'background 0.2s',
              letterSpacing: '0.01em',
            }}
            onMouseEnter={e => { if (allRequiredDone) (e.currentTarget as HTMLElement).style.background = '#5a52e0'; }}
            onMouseLeave={e => { if (allRequiredDone) (e.currentTarget as HTMLElement).style.background = '#6c63ff'; }}
          >
            {isLoading ? 'Generating...' : 'Generate My Strategies'}
          </button>
        </div>
      </div>
    </div>
  );
}