'use client';

import { MarketingStrategy, FollowUpAnswers } from '@/types';

interface Props {
  strategy: MarketingStrategy;
  answers: Partial<FollowUpAnswers>;
  onChange: (a: Partial<FollowUpAnswers>) => void;
  onSubmit: () => void;
  isLoading: boolean;
}

const inputStyle = {
  background: 'white', border: '1.5px solid #e4e2f5', borderRadius: 0,
  padding: '11px 14px', color: '#1a1730', fontFamily: 'DM Sans, sans-serif',
  fontSize: 14, width: '100%', outline: 'none', transition: 'border-color 0.2s',
};

function Label({ children }: { children: React.ReactNode }) {
  return <label style={{ display: 'block', fontSize: 11, color: '#4a4568', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.07em', marginBottom: 7 }}>{children}</label>;
}

function MultiSelect({ options, value, onChange }: { options: string[]; value: string[]; onChange: (v: string[]) => void }) {
  const toggle = (opt: string) => {
    if (value.includes(opt)) onChange(value.filter(v => v !== opt));
    else onChange([...value, opt]);
  };
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
      {options.map(opt => (
        <button key={opt} type="button" onClick={() => toggle(opt)} style={{
          padding: '7px 16px', fontSize: 13, fontWeight: 500, borderRadius: 0,
          border: value.includes(opt) ? '1.5px solid #6c63ff' : '1.5px solid #e4e2f5',
          background: value.includes(opt) ? '#ede9ff' : 'white',
          color: value.includes(opt) ? '#6c63ff' : '#4a4568',
          cursor: 'pointer', transition: 'all 0.15s',
        }}>{opt}</button>
      ))}
    </div>
  );
}

export default function FollowUpSection({ strategy, answers, onChange, onSubmit, isLoading }: Props) {
  const set = (key: keyof FollowUpAnswers, value: string | string[]) => onChange({ ...answers, [key]: value });
  const requiredDone = answers.launchTimeline && answers.brandVoice && answers.weeklyTimeCommitment && answers.primaryCTA && (answers.successMetrics?.length ?? 0) > 0;

  return (
    <div style={{ maxWidth: 720, margin: '0 auto', animation: 'fadeIn 0.4s ease' }}>

      {/* Centered header */}
      <div style={{ textAlign: 'center', marginBottom: 40, paddingTop: 8 }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
          <div style={{ height: 1, width: 32, background: '#6c63ff' }} />
          <span style={{ fontSize: 11, color: '#6c63ff', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em' }}>Step 3 of 5</span>
          <div style={{ height: 1, width: 32, background: '#6c63ff' }} />
        </div>
        <h1 style={{ fontFamily: 'Bricolage Grotesque', fontSize: 38, fontWeight: 800, letterSpacing: '-0.03em', marginBottom: 12, color: '#1a1730', lineHeight: 1.1 }}>
          A few more <span style={{ color: '#6c63ff' }}>details</span>
        </h1>
        <p style={{ color: '#4a4568', fontSize: 16, lineHeight: 1.7, maxWidth: 460, margin: '0 auto' }}>
          These answers help us build a plan that truly fits how you work, your timeline, and your resources.
        </p>
      </div>

      {/* Strategy reminder */}
      <div style={{ background: 'white', border: '1px solid #e4e2f5', borderLeft: '4px solid #6c63ff', padding: '14px 20px', marginBottom: 32, display: 'flex', alignItems: 'center', gap: 16 }}>
        <div>
          <p style={{ fontSize: 10, color: '#8b87a8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 3 }}>Building plan for</p>
          <p style={{ fontFamily: 'Bricolage Grotesque', fontWeight: 700, fontSize: 16, color: '#1a1730' }}>{strategy.name}</p>
        </div>
      </div>

      {/* Form */}
      <div style={{ background: 'white', border: '1px solid #e4e2f5', padding: '32px 28px', marginBottom: 20 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px 28px' }}>

          <div style={{ gridColumn: 'span 2' }}>
            <Label>When do you want to launch? *</Label>
            <select style={inputStyle} value={answers.launchTimeline || ''} onChange={e => set('launchTimeline', e.target.value)}>
              <option value="">Select timeline...</option>
              {['This week (immediately)','Within 2 weeks','Within 1 month','1–2 months from now','2–3 months from now','3+ months from now'].map(v => <option key={v} value={v}>{v}</option>)}
            </select>
          </div>

          <div>
            <Label>Content creation capacity per week</Label>
            <select style={inputStyle} value={answers.contentCreationCapacity || ''} onChange={e => set('contentCreationCapacity', e.target.value)}>
              <option value="">Select...</option>
              {['Almost none (under 1 hour/week)','Light (1–3 hours, 1–2 pieces)','Moderate (3–5 hours, 3–5 pieces)','Heavy (5–10+ hours, daily content)','I have a team handling content'].map(v => <option key={v} value={v}>{v}</option>)}
            </select>
          </div>

          <div>
            <Label>Hours per week for marketing *</Label>
            <select style={inputStyle} value={answers.weeklyTimeCommitment || ''} onChange={e => set('weeklyTimeCommitment', e.target.value)}>
              <option value="">Select...</option>
              {['Under 3 hours','3–5 hours','5–10 hours','10–20 hours','20+ hours (part-time dedicated)','40+ hours (full-time dedicated)'].map(v => <option key={v} value={v}>{v}</option>)}
            </select>
          </div>

          <div>
            <Label>Brand voice *</Label>
            <select style={inputStyle} value={answers.brandVoice || ''} onChange={e => set('brandVoice', e.target.value)}>
              <option value="">Select...</option>
              {['Professional & formal','Friendly & conversational','Bold & energetic','Witty & humorous','Inspirational & motivational','Technical & expert','Warm & empathetic','Edgy & unconventional','Minimalist & clean'].map(v => <option key={v} value={v}>{v}</option>)}
            </select>
          </div>

          <div>
            <Label>Technical expertise level</Label>
            <select style={inputStyle} value={answers.technicalExpertise || ''} onChange={e => set('technicalExpertise', e.target.value)}>
              <option value="">Select...</option>
              {['Beginner (not comfortable with tech)','Basic (can use most online tools)','Intermediate (can set up ads, email tools)','Advanced (comfortable with analytics, tracking)','Expert (developer-level skills)'].map(v => <option key={v} value={v}>{v}</option>)}
            </select>
          </div>

          <div style={{ gridColumn: 'span 2' }}>
            <Label>Existing assets (website, email list, social following, etc.)</Label>
            <textarea style={{ ...inputStyle, resize: 'vertical' } as React.CSSProperties} rows={2} placeholder="e.g. WordPress site with ~500 visitors/month, email list of 800 people, 2K Instagram followers..." value={answers.existingAssets || ''} onChange={e => set('existingAssets', e.target.value)} />
          </div>

          <div style={{ gridColumn: 'span 2' }}>
            <Label>Your main call to action *</Label>
            <input style={inputStyle} placeholder="e.g. Sign up for a free trial, book a call, buy the product..." value={answers.primaryCTA || ''} onChange={e => set('primaryCTA', e.target.value)} />
          </div>

          <div style={{ gridColumn: 'span 2' }}>
            <Label>What does success look like? (select all that matter) *</Label>
            <MultiSelect
              options={['More website traffic','More leads / signups','More direct sales','Lower cost per customer','Higher conversion rate','More social media followers','Better brand recognition','More repeat customers','Press / media coverage','Growing email list']}
              value={answers.successMetrics || []}
              onChange={v => set('successMetrics', v)}
            />
          </div>

          <div style={{ gridColumn: 'span 2' }}>
            <Label>Partnerships or collaborators to build into the plan</Label>
            <input style={inputStyle} placeholder="e.g. Influencer relationships, referral partners, industry associations..." value={answers.partnerships || ''} onChange={e => set('partnerships', e.target.value)} />
          </div>

          <div style={{ gridColumn: 'span 2' }}>
            <Label>Existing customer feedback or testimonials</Label>
            <select style={inputStyle} value={answers.customerFeedbackAvailable || ''} onChange={e => set('customerFeedbackAvailable', e.target.value)}>
              <option value="">Select...</option>
              {['No customers yet','Yes, a few testimonials','Yes, many 5-star reviews','Yes, detailed case studies','Yes, video testimonials','Mixed reviews (some negative)'].map(v => <option key={v} value={v}>{v}</option>)}
            </select>
          </div>

        </div>
      </div>

      {/* Submit */}
      <div style={{ background: 'white', border: '1px solid #e4e2f5', padding: '28px 32px' }}>
        <div style={{ textAlign: 'center', marginBottom: 20 }}>
          <h3 style={{ fontFamily: 'Bricolage Grotesque', fontSize: 20, fontWeight: 800, marginBottom: 6, color: '#1a1730' }}>Ready to build your full plan?</h3>
          <p style={{ color: requiredDone ? '#22c55e' : '#8b87a8', fontSize: 13, fontWeight: 500 }}>
            {requiredDone ? "All set — let's generate your marketing plan" : "Please fill in all required fields above"}
          </p>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <button
            onClick={onSubmit}
            disabled={!requiredDone || isLoading}
            style={{ background: requiredDone ? '#6c63ff' : '#d4d0f0', color: 'white', border: 'none', padding: '15px 48px', fontFamily: 'Bricolage Grotesque', fontWeight: 700, fontSize: 15, cursor: requiredDone ? 'pointer' : 'not-allowed', transition: 'background 0.2s' }}
            onMouseEnter={e => { if (requiredDone) (e.currentTarget as HTMLElement).style.background = '#5a52e0'; }}
            onMouseLeave={e => { if (requiredDone) (e.currentTarget as HTMLElement).style.background = '#6c63ff'; }}
          >
            {isLoading ? 'Generating...' : 'Generate My Plan'}
          </button>
        </div>
      </div>
    </div>
  );
}