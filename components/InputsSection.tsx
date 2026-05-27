'use client';

import { useState } from 'react';
import { CompanyInputs } from '@/types';
import { ChevronDown, ChevronUp, Sparkles, Info } from 'lucide-react';

interface Props {
  inputs: Partial<CompanyInputs>;
  onChange: (inputs: Partial<CompanyInputs>) => void;
  onSubmit: () => void;
  isLoading: boolean;
}

const SECTIONS = ['basic', 'product', 'financial', 'audience', 'current', 'competition', 'goals', 'team'] as const;
type Section = typeof SECTIONS[number];

const sectionConfig: Record<Section, { label: string; emoji: string; description: string }> = {
  basic: { label: 'Basic Info', emoji: '🏢', description: 'Tell us about your company' },
  product: { label: 'Product / Service', emoji: '📦', description: 'What you sell and why it matters' },
  financial: { label: 'Budget & Finances', emoji: '💰', description: 'Your financial picture' },
  audience: { label: 'Target Audience', emoji: '🎯', description: 'Who you\'re trying to reach' },
  current: { label: 'Current Marketing', emoji: '📊', description: 'What you\'re doing now' },
  competition: { label: 'Competition', emoji: '⚔️', description: 'Your market landscape' },
  goals: { label: 'Goals', emoji: '🚀', description: 'What success looks like for you' },
  team: { label: 'Your Team', emoji: '👥', description: 'Who will execute the strategy' },
};

function Label({ children, required, tip }: { children: React.ReactNode; required?: boolean; tip?: string }) {
  return (
    <label style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
      <span className="label" style={{ marginBottom: 0 }}>{children}</span>
      {required && <span style={{ color: 'var(--accent-2)', fontSize: 12 }}>*</span>}
      {tip && (
        <span title={tip} style={{ cursor: 'help', opacity: 0.5 }}>
          <Info size={12} style={{ color: 'var(--text-3)' }} />
        </span>
      )}
    </label>
  );
}

function Field({ children, span = 1 }: { children: React.ReactNode; span?: number }) {
  return (
    <div style={{ gridColumn: `span ${span}` }}>
      {children}
    </div>
  );
}

function MultiSelect({ options, value, onChange, label }: { options: string[]; value: string[]; onChange: (v: string[]) => void; label?: string }) {
  const toggle = (opt: string) => {
    if (value.includes(opt)) onChange(value.filter(v => v !== opt));
    else onChange([...value, opt]);
  };
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
      {options.map(opt => (
        <button key={opt} type="button" onClick={() => toggle(opt)} style={{
          padding: '6px 12px', borderRadius: 20, fontSize: 12, fontWeight: 500,
          border: value.includes(opt) ? '1px solid var(--accent)' : '1px solid var(--border)',
          background: value.includes(opt) ? 'rgba(108,99,255,0.15)' : 'var(--surface-2)',
          color: value.includes(opt) ? 'var(--accent)' : 'var(--text-2)',
          cursor: 'pointer', transition: 'all 0.15s',
        }}>
          {opt}
        </button>
      ))}
    </div>
  );
}

export default function InputsSection({ inputs, onChange, onSubmit, isLoading }: Props) {
  const [openSections, setOpenSections] = useState<Set<Section>>(new Set(['basic', 'product', 'financial']));
  const [completedSections, setCompletedSections] = useState<Set<Section>>(new Set());

  const toggleSection = (s: Section) => {
    const next = new Set(openSections);
    if (next.has(s)) next.delete(s); else next.add(s);
    setOpenSections(next);
  };

  const set = (key: keyof CompanyInputs, value: string | string[]) => {
    onChange({ ...inputs, [key]: value });
  };

  const requiredFields = ['industry', 'businessType', 'companyStage', 'productDescription', 'marketingBudgetMonthly', 'primaryGoal'];
  const completedCount = requiredFields.filter(f => inputs[f as keyof CompanyInputs]).length;
  const allRequiredDone = completedCount === requiredFields.length;

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', animation: 'fadeIn 0.4s ease' }}>
      {/* Header */}
      <div style={{ marginBottom: 36 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
          <span className="badge badge-purple">Step 1 of 5</span>
          <span className="badge badge-green">{completedCount}/{requiredFields.length} required fields</span>
        </div>
        <h1 style={{ fontFamily: 'Bricolage Grotesque', fontSize: 38, fontWeight: 800, letterSpacing: '-0.03em', marginBottom: 10 }}>
          Tell us about your <span style={{ color: 'var(--accent)' }}>company</span>
        </h1>
        <p style={{ color: 'var(--text-2)', fontSize: 16, maxWidth: 600 }}>
          The more detail you give us, the more personalized and accurate your marketing strategy will be. Fill in as much as you can — starred fields are required.
        </p>
      </div>

      {/* Progress bar */}
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: '16px 20px', marginBottom: 28, display: 'flex', alignItems: 'center', gap: 16 }}>
        <div style={{ flex: 1, height: 8, background: 'var(--surface-3)', borderRadius: 4, overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${(completedCount / requiredFields.length) * 100}%`, background: 'linear-gradient(90deg, var(--accent), var(--accent-2))', borderRadius: 4, transition: 'width 0.4s ease' }} />
        </div>
        <span style={{ fontSize: 13, color: 'var(--text-2)', fontWeight: 600, whiteSpace: 'nowrap' }}>{completedCount} of {requiredFields.length} required</span>
      </div>

      {/* Form Sections */}
      {SECTIONS.map(section => (
        <div key={section} className="card" style={{ marginBottom: 12, overflow: 'hidden' }}>
          <button
            type="button"
            onClick={() => toggleSection(section)}
            style={{
              width: '100%', padding: '18px 24px', display: 'flex', alignItems: 'center', gap: 12,
              background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left',
              borderBottom: openSections.has(section) ? '1px solid var(--border)' : 'none',
            }}
          >
            <span style={{ fontSize: 22 }}>{sectionConfig[section].emoji}</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: 'Bricolage Grotesque', fontWeight: 700, fontSize: 16, color: 'var(--text)' }}>
                {sectionConfig[section].label}
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 1 }}>
                {sectionConfig[section].description}
              </div>
            </div>
            <div style={{ color: 'var(--text-3)' }}>
              {openSections.has(section) ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </div>
          </button>

          {openSections.has(section) && (
            <div style={{ padding: 24 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px 24px' }}>

                {section === 'basic' && <>
                  <Field span={2}><Label required>Company Name</Label><input className="input-field" placeholder="e.g. Acme Co." value={inputs.companyName || ''} onChange={e => set('companyName', e.target.value)} /></Field>
                  <Field><Label required>Industry</Label>
                    <select className="input-field" value={inputs.industry || ''} onChange={e => set('industry', e.target.value)}>
                      <option value="">Select industry...</option>
                      {['SaaS / Software','E-commerce / Retail','Health & Wellness','Food & Beverage','Finance / Fintech','Education / EdTech','Real Estate','Travel & Hospitality','Beauty & Fashion','Fitness','Professional Services','Legal','Consulting','Agency','Non-profit','Manufacturing','Construction','Automotive','Entertainment','Media','Other'].map(v => <option key={v} value={v}>{v}</option>)}
                    </select>
                  </Field>
                  <Field><Label required>Business Type</Label>
                    <select className="input-field" value={inputs.businessType || ''} onChange={e => set('businessType', e.target.value)}>
                      <option value="">Select type...</option>
                      {['B2C (sell to consumers)','B2B (sell to businesses)','D2C (direct-to-consumer brand)','Marketplace / Platform','B2B2C','Subscription','E-commerce','Brick & Mortar','Hybrid (online + offline)','Freelance / Solo'].map(v => <option key={v} value={v}>{v}</option>)}
                    </select>
                  </Field>
                  <Field><Label required>Company Stage</Label>
                    <select className="input-field" value={inputs.companyStage || ''} onChange={e => set('companyStage', e.target.value)}>
                      <option value="">Select stage...</option>
                      {['Just an idea (pre-launch)','Pre-revenue (launched, no sales yet)','Early-stage ($0–$10K/month revenue)','Growing ($10K–$100K/month)','Scaling ($100K–$1M/month)','Enterprise ($1M+/month)'].map(v => <option key={v} value={v}>{v}</option>)}
                    </select>
                  </Field>
                  <Field><Label>Years in Business</Label>
                    <select className="input-field" value={inputs.yearsInBusiness || ''} onChange={e => set('yearsInBusiness', e.target.value)}>
                      <option value="">Select...</option>
                      {['Less than 6 months','6 months – 1 year','1–2 years','2–5 years','5–10 years','10+ years'].map(v => <option key={v} value={v}>{v}</option>)}
                    </select>
                  </Field>
                  <Field><Label>Employee Count</Label>
                    <select className="input-field" value={inputs.employeeCount || ''} onChange={e => set('employeeCount', e.target.value)}>
                      <option value="">Select...</option>
                      {['Just me (solo)','2–5','6–15','16–50','51–200','200+'].map(v => <option key={v} value={v}>{v}</option>)}
                    </select>
                  </Field>
                </>}

                {section === 'product' && <>
                  <Field span={2}><Label required tip="Describe what you sell in plain language">What do you sell?</Label><textarea className="input-field" rows={3} placeholder="e.g. We make a project management app for remote teams that shows everyone what needs to be done each day without requiring any setup..." value={inputs.productDescription || ''} onChange={e => set('productDescription', e.target.value)} /></Field>
                  <Field span={2}><Label required tip="What makes you different from everything else out there?">Your Unique Value Proposition</Label><textarea className="input-field" rows={2} placeholder="e.g. Unlike Asana, our app takes 5 minutes to set up and works out of the box for teams of 2–20 people..." value={inputs.uniqueValueProp || ''} onChange={e => set('uniqueValueProp', e.target.value)} /></Field>
                  <Field><Label>Price Point</Label>
                    <select className="input-field" value={inputs.pricePoint || ''} onChange={e => set('pricePoint', e.target.value)}>
                      <option value="">Select...</option>
                      {['Budget / Affordable (lower end of market)','Mid-range (average market price)','Premium (higher price, higher quality)','Luxury / High-end','Enterprise (custom pricing)','Freemium (free + paid tiers)'].map(v => <option key={v} value={v}>{v}</option>)}
                    </select>
                  </Field>
                  <Field><Label>Product Category</Label>
                    <input className="input-field" placeholder="e.g. Project management software, skincare, coaching..." value={inputs.productCategory || ''} onChange={e => set('productCategory', e.target.value)} />
                  </Field>
                </>}

                {section === 'financial' && <>
                  <Field><Label>Funding Status</Label>
                    <select className="input-field" value={inputs.fundingStatus || ''} onChange={e => set('fundingStatus', e.target.value)}>
                      <option value="">Select...</option>
                      {['Bootstrapped (self-funded)','Pre-seed','Seed round funded','Series A','Series B','Series C+','Profitable (no outside funding needed)'].map(v => <option key={v} value={v}>{v}</option>)}
                    </select>
                  </Field>
                  <Field><Label>Total Funding Raised</Label>
                    <select className="input-field" value={inputs.totalFunding || ''} onChange={e => set('totalFunding', e.target.value)}>
                      <option value="">Select...</option>
                      {['None / $0','Under $50K','$50K–$250K','$250K–$1M','$1M–$5M','$5M–$25M','$25M+'].map(v => <option key={v} value={v}>{v}</option>)}
                    </select>
                  </Field>
                  <Field><Label>Monthly Revenue</Label>
                    <select className="input-field" value={inputs.monthlyRevenue || ''} onChange={e => set('monthlyRevenue', e.target.value)}>
                      <option value="">Select...</option>
                      {['$0 (pre-revenue)','$1–$5K/month','$5K–$20K/month','$20K–$50K/month','$50K–$100K/month','$100K–$500K/month','$500K+/month'].map(v => <option key={v} value={v}>{v}</option>)}
                    </select>
                  </Field>
                  <Field><Label required>Monthly Marketing Budget</Label>
                    <select className="input-field" value={inputs.marketingBudgetMonthly || ''} onChange={e => set('marketingBudgetMonthly', e.target.value)}>
                      <option value="">Select...</option>
                      {['Under $500/month','$500–$2,000/month','$2,000–$5,000/month','$5,000–$15,000/month','$15,000–$50,000/month','$50,000–$150,000/month','$150,000+/month'].map(v => <option key={v} value={v}>{v}</option>)}
                    </select>
                  </Field>
                  <Field><Label>Budget Flexibility</Label>
                    <select className="input-field" value={inputs.budgetFlexibility || ''} onChange={e => set('budgetFlexibility', e.target.value)}>
                      <option value="">Select...</option>
                      {['Fixed — cannot exceed this budget','Somewhat flexible (up to 25% over)','Very flexible if ROI justifies it'].map(v => <option key={v} value={v}>{v}</option>)}
                    </select>
                  </Field>
                  <Field><Label tip="Cost to acquire one new customer">Current Customer Acquisition Cost (CAC)</Label>
                    <input className="input-field" placeholder="e.g. $50, Unknown" value={inputs.currentCAC || ''} onChange={e => set('currentCAC', e.target.value)} />
                  </Field>
                  <Field><Label tip="How much a customer is worth over their lifetime">Customer Lifetime Value (LTV)</Label>
                    <input className="input-field" placeholder="e.g. $500, Unknown" value={inputs.currentLTV || ''} onChange={e => set('currentLTV', e.target.value)} />
                  </Field>
                </>}

                {section === 'audience' && <>
                  <Field span={2}><Label>Age Range (select all that apply)</Label>
                    <MultiSelect options={['13–17','18–24','25–34','35–44','45–54','55–64','65+']} value={inputs.targetAgeRange || []} onChange={v => set('targetAgeRange', v)} />
                  </Field>
                  <Field><Label>Gender Focus</Label>
                    <select className="input-field" value={inputs.targetGender || ''} onChange={e => set('targetGender', e.target.value)}>
                      <option value="">Select...</option>
                      {['All genders equally','Primarily women','Primarily men','Non-binary / gender-fluid focus'].map(v => <option key={v} value={v}>{v}</option>)}
                    </select>
                  </Field>
                  <Field><Label>Income Level</Label>
                    <select className="input-field" value={inputs.targetIncome || ''} onChange={e => set('targetIncome', e.target.value)}>
                      <option value="">Select...</option>
                      {['Under $30K/year','$30K–$60K/year','$60K–$100K/year','$100K–$200K/year','$200K+/year','All income levels'].map(v => <option key={v} value={v}>{v}</option>)}
                    </select>
                  </Field>
                  <Field><Label>Geographic Reach</Label>
                    <select className="input-field" value={inputs.targetLocation || ''} onChange={e => set('targetLocation', e.target.value)}>
                      <option value="">Select...</option>
                      {['Local (one city/town)','Regional (state/province)','National (one country)','North America','English-speaking global','Global'].map(v => <option key={v} value={v}>{v}</option>)}
                    </select>
                  </Field>
                  <Field><Label>Specific Geography</Label>
                    <input className="input-field" placeholder="e.g. New York City, California, United States..." value={inputs.targetGeography || ''} onChange={e => set('targetGeography', e.target.value)} />
                  </Field>
                  <Field span={2}><Label required>Customer Pain Points</Label>
                    <textarea className="input-field" rows={3} placeholder="What problems are your customers struggling with? What keeps them up at night? e.g. 'They spend 3 hours a day on email instead of real work...'" value={inputs.targetPainPoints || ''} onChange={e => set('targetPainPoints', e.target.value)} />
                  </Field>
                  <Field span={2}><Label>Buyer Persona Description</Label>
                    <textarea className="input-field" rows={2} placeholder="e.g. 'Sarah, 32, marketing manager at a 50-person startup. She's juggling 5 tools and is frustrated by the lack of visibility...'" value={inputs.buyerPersona || ''} onChange={e => set('buyerPersona', e.target.value)} />
                  </Field>
                  {(inputs.businessType?.includes('B2B') || inputs.businessType?.includes('Marketplace')) && <>
                    <Field><Label>Target Company Size (B2B)</Label>
                      <select className="input-field" value={inputs.targetCompanySize || ''} onChange={e => set('targetCompanySize', e.target.value)}>
                        <option value="">Select...</option>
                        {['Solopreneurs / Freelancers','Small (2–20 employees)','Mid-size (20–200 employees)','Large (200–2000 employees)','Enterprise (2000+)'].map(v => <option key={v} value={v}>{v}</option>)}
                      </select>
                    </Field>
                    <Field><Label>Target Job Titles (B2B)</Label>
                      <input className="input-field" placeholder="e.g. CEO, Marketing Director, Head of Sales..." value={inputs.targetJobTitles || ''} onChange={e => set('targetJobTitles', e.target.value)} />
                    </Field>
                  </>}
                </>}

                {section === 'current' && <>
                  <Field span={2}><Label>Current Marketing Channels (select all active)</Label>
                    <MultiSelect options={['Instagram','Facebook','TikTok','LinkedIn','Twitter/X','YouTube','Email Marketing','Google Ads','Facebook/Instagram Ads','SEO / Blog','Podcast','Influencer Marketing','Word of Mouth','Cold Outreach','Events / Trade Shows','PR / Press','Affiliate','SMS','None yet']} value={inputs.currentChannels || []} onChange={v => set('currentChannels', v)} />
                  </Field>
                  <Field><Label>Monthly Website Traffic</Label>
                    <select className="input-field" value={inputs.currentMonthlyTraffic || ''} onChange={e => set('currentMonthlyTraffic', e.target.value)}>
                      <option value="">Select...</option>
                      {['0 (no website yet)','Under 500','500–2,000','2,000–10,000','10,000–50,000','50,000–200,000','200,000+'].map(v => <option key={v} value={v}>{v}</option>)}
                    </select>
                  </Field>
                  <Field><Label>Current Website Conversion Rate</Label>
                    <select className="input-field" value={inputs.currentConversionRate || ''} onChange={e => set('currentConversionRate', e.target.value)}>
                      <option value="">Select...</option>
                      {['Unknown','Under 0.5%','0.5–1%','1–3%','3–5%','5%+'].map(v => <option key={v} value={v}>{v}</option>)}
                    </select>
                  </Field>
                  <Field span={2}><Label required>Biggest Marketing Challenge</Label>
                    <textarea className="input-field" rows={2} placeholder="e.g. 'We get traffic but no one converts. We spend on ads but can't tell what works. We have no time for content...'" value={inputs.biggestMarketingChallenge || ''} onChange={e => set('biggestMarketingChallenge', e.target.value)} />
                  </Field>
                  <Field span={2}><Label>Past Marketing Failures (optional)</Label>
                    <textarea className="input-field" rows={2} placeholder="What have you tried that didn't work? This helps us avoid recommending the same things..." value={inputs.pastMarketingFailures || ''} onChange={e => set('pastMarketingFailures', e.target.value)} />
                  </Field>
                </>}

                {section === 'competition' && <>
                  <Field span={2}><Label>Main Competitors</Label>
                    <textarea className="input-field" rows={2} placeholder="e.g. Company A, Company B, Company C — or describe the type of competition you face..." value={inputs.mainCompetitors || ''} onChange={e => set('mainCompetitors', e.target.value)} />
                  </Field>
                  <Field span={2}><Label>Your Competitive Differentiator</Label>
                    <textarea className="input-field" rows={2} placeholder="Why would someone choose you over a competitor? What can you offer that they can't?" value={inputs.competitiveDifferentiator || ''} onChange={e => set('competitiveDifferentiator', e.target.value)} />
                  </Field>
                  <Field><Label>Your Market Position</Label>
                    <select className="input-field" value={inputs.marketPosition || ''} onChange={e => set('marketPosition', e.target.value)}>
                      <option value="">Select...</option>
                      {['Market leader (top 3 in our space)','Challenger (competing with leaders)','Niche player (serving a specific segment)','New entrant (just entering the market)','Disruptor (changing how the industry works)'].map(v => <option key={v} value={v}>{v}</option>)}
                    </select>
                  </Field>
                </>}

                {section === 'goals' && <>
                  <Field span={2}><Label required>Primary Marketing Goal</Label>
                    <select className="input-field" value={inputs.primaryGoal || ''} onChange={e => set('primaryGoal', e.target.value)}>
                      <option value="">Select your #1 goal...</option>
                      {['Build brand awareness (get known)','Generate leads (get contact info from potential customers)','Drive direct sales / purchases','Grow email/subscriber list','Retain existing customers','Launch a new product or service','Enter a new market','Build a community','Reduce customer acquisition cost','All of the above'].map(v => <option key={v} value={v}>{v}</option>)}
                    </select>
                  </Field>
                  <Field><Label>12-Month Revenue Goal</Label>
                    <input className="input-field" placeholder="e.g. $500K, $1M, 2x current revenue..." value={inputs.revenueGoal12Months || ''} onChange={e => set('revenueGoal12Months', e.target.value)} />
                  </Field>
                  <Field><Label>Customer Growth Goal</Label>
                    <input className="input-field" placeholder="e.g. 100 new customers, 10,000 users..." value={inputs.customerGrowthGoal || ''} onChange={e => set('customerGrowthGoal', e.target.value)} />
                  </Field>
                  <Field><Label>Timeline Urgency</Label>
                    <select className="input-field" value={inputs.timelineUrgency || ''} onChange={e => set('timelineUrgency', e.target.value)}>
                      <option value="">Select...</option>
                      {['Immediate (need results within 30 days)','Short-term (3 months)','Medium-term (6 months)','Long-term (12 months)','No specific deadline'].map(v => <option key={v} value={v}>{v}</option>)}
                    </select>
                  </Field>
                  <Field><Label>Seasonality</Label>
                    <select className="input-field" value={inputs.seasonality || ''} onChange={e => set('seasonality', e.target.value)}>
                      <option value="">Select...</option>
                      {['No seasonality (consistent year-round)','Holiday/Q4 heavy','Summer heavy','Spring heavy','B2B calendar (slower Aug, Dec)','Event-driven'].map(v => <option key={v} value={v}>{v}</option>)}
                    </select>
                  </Field>
                </>}

                {section === 'team' && <>
                  <Field><Label>Do you have a marketing team?</Label>
                    <select className="input-field" value={inputs.hasMarketingTeam || ''} onChange={e => set('hasMarketingTeam', e.target.value)}>
                      <option value="">Select...</option>
                      {['No — just me doing everything','I wear all the hats but have some help','Small team (1–3 marketers)','Dedicated marketing team (4+)','Agency or contractor handling it'].map(v => <option key={v} value={v}>{v}</option>)}
                    </select>
                  </Field>
                  <Field><Label>Weekly Time for Marketing</Label>
                    <select className="input-field" value={inputs.marketingTeamSize || ''} onChange={e => set('marketingTeamSize', e.target.value)}>
                      <option value="">Select...</option>
                      {['Under 5 hours/week','5–10 hours/week','10–20 hours/week','20–40 hours/week (part-time equivalent)','Full-time (40+ hrs/week)'].map(v => <option key={v} value={v}>{v}</option>)}
                    </select>
                  </Field>
                  <Field span={2}><Label>In-house Skills (select all you have)</Label>
                    <MultiSelect options={['Writing / Copywriting','Graphic Design','Video Editing','Photography','Web Development','Data Analysis','Paid Ads Management','Social Media','Email Marketing','SEO','Public Relations','None of the above']} value={inputs.inHouseCapabilities || []} onChange={v => set('inHouseCapabilities', v)} />
                  </Field>
                  <Field><Label>Compliance Restrictions</Label>
                    <input className="input-field" placeholder="e.g. Healthcare HIPAA, Finance regulations, none..." value={inputs.complianceRestrictions || ''} onChange={e => set('complianceRestrictions', e.target.value)} />
                  </Field>
                  <Field span={2}><Label>Anything else we should know?</Label>
                    <textarea className="input-field" rows={3} placeholder="Tell us anything else that might be relevant — past wins, special circumstances, partnerships, upcoming launches, etc." value={inputs.additionalContext || ''} onChange={e => set('additionalContext', e.target.value)} />
                  </Field>
                </>}

              </div>
            </div>
          )}
        </div>
      ))}

      {/* Submit */}
      <div style={{ marginTop: 32, padding: '28px 32px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 20, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h3 style={{ fontFamily: 'Bricolage Grotesque', fontSize: 18, fontWeight: 700, marginBottom: 4 }}>Ready to generate your strategies?</h3>
          <p style={{ color: 'var(--text-3)', fontSize: 13 }}>
            {allRequiredDone ? '✅ All required fields complete — looking good!' : `⚠️ ${requiredFields.length - completedCount} required field(s) still need your attention above`}
          </p>
        </div>
        <button
          className="btn-primary"
          onClick={onSubmit}
          disabled={!allRequiredDone || isLoading}
          style={{ padding: '14px 32px', fontSize: 15 }}
        >
          <Sparkles size={18} />
          Generate My Strategies
        </button>
      </div>
    </div>
  );
}
