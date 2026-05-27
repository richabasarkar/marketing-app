'use client';

import { MarketingStrategy, FollowUpAnswers } from '@/types';
import { Sparkles } from 'lucide-react';

interface Props {
  strategy: MarketingStrategy;
  answers: Partial<FollowUpAnswers>;
  onChange: (a: Partial<FollowUpAnswers>) => void;
  onSubmit: () => void;
  isLoading: boolean;
}

function Label({ children }: { children: React.ReactNode }) {
  return <label className="label">{children}</label>;
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
          padding: '6px 14px', borderRadius: 20, fontSize: 13, fontWeight: 500,
          border: value.includes(opt) ? '1px solid var(--accent)' : '1px solid var(--border)',
          background: value.includes(opt) ? 'rgba(108,99,255,0.15)' : 'var(--surface-2)',
          color: value.includes(opt) ? 'var(--accent)' : 'var(--text-2)',
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
    <div style={{ maxWidth: 780, margin: '0 auto', animation: 'fadeIn 0.4s ease' }}>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <span className="badge badge-purple" style={{ marginBottom: 10, display: 'inline-flex' }}>Step 3 of 5</span>
        <h1 style={{ fontFamily: 'Bricolage Grotesque', fontSize: 38, fontWeight: 800, letterSpacing: '-0.03em', marginBottom: 10 }}>
          A few more <span style={{ color: 'var(--accent)' }}>details</span>
        </h1>
        <p style={{ color: 'var(--text-2)', fontSize: 16, maxWidth: 560 }}>
          These answers help us build a plan that truly fits how you work, your timeline, and your resources.
        </p>
      </div>

      {/* Strategy reminder */}
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, padding: '16px 20px', marginBottom: 28, display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(108,99,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>🎯</div>
        <div>
          <p style={{ fontSize: 12, color: 'var(--text-3)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Building plan for</p>
          <p style={{ fontFamily: 'Bricolage Grotesque', fontWeight: 700, fontSize: 16, color: 'var(--text)' }}>{strategy.name}</p>
        </div>
      </div>

      {/* Form */}
      <div className="card" style={{ padding: 32, marginBottom: 20 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px 28px' }}>

          <div style={{ gridColumn: 'span 2' }}>
            <Label>When do you want to launch? *</Label>
            <select className="input-field" value={answers.launchTimeline || ''} onChange={e => set('launchTimeline', e.target.value)}>
              <option value="">Select timeline...</option>
              {['This week (immediately)','Within 2 weeks','Within 1 month','1–2 months from now','2–3 months from now','3+ months from now'].map(v => <option key={v} value={v}>{v}</option>)}
            </select>
          </div>

          <div>
            <Label>How much content can you realistically create per week?</Label>
            <select className="input-field" value={answers.contentCreationCapacity || ''} onChange={e => set('contentCreationCapacity', e.target.value)}>
              <option value="">Select...</option>
              {['Almost none (under 1 hour/week)','Light (1–3 hours, 1–2 pieces)','Moderate (3–5 hours, 3–5 pieces)','Heavy (5–10+ hours, daily content)','I have a team handling content'].map(v => <option key={v} value={v}>{v}</option>)}
            </select>
          </div>

          <div>
            <Label>How many hours per week can you commit to marketing? *</Label>
            <select className="input-field" value={answers.weeklyTimeCommitment || ''} onChange={e => set('weeklyTimeCommitment', e.target.value)}>
              <option value="">Select...</option>
              {['Under 3 hours','3–5 hours','5–10 hours','10–20 hours','20+ hours (part-time dedicated)','40+ hours (full-time dedicated)'].map(v => <option key={v} value={v}>{v}</option>)}
            </select>
          </div>

          <div>
            <Label>How would you describe your brand voice? *</Label>
            <select className="input-field" value={answers.brandVoice || ''} onChange={e => set('brandVoice', e.target.value)}>
              <option value="">Select...</option>
              {['Professional & formal','Friendly & conversational','Bold & energetic','Witty & humorous','Inspirational & motivational','Technical & expert','Warm & empathetic','Edgy & unconventional','Minimalist & clean'].map(v => <option key={v} value={v}>{v}</option>)}
            </select>
          </div>

          <div>
            <Label>Technical expertise level</Label>
            <select className="input-field" value={answers.technicalExpertise || ''} onChange={e => set('technicalExpertise', e.target.value)}>
              <option value="">Select...</option>
              {['Beginner (not comfortable with tech)','Basic (can use most online tools)','Intermediate (can set up ads, email tools)','Advanced (comfortable with analytics, tracking)','Expert (developer-level skills)'].map(v => <option key={v} value={v}>{v}</option>)}
            </select>
          </div>

          <div style={{ gridColumn: 'span 2' }}>
            <Label>What existing assets do you have? (website, email list, social following, etc.)</Label>
            <textarea className="input-field" rows={2} placeholder="e.g. 'We have a WordPress site with ~500 visitors/month, an email list of 800 people, 2K Instagram followers, but no paid ad experience...'" value={answers.existingAssets || ''} onChange={e => set('existingAssets', e.target.value)} />
          </div>

          <div style={{ gridColumn: 'span 2' }}>
            <Label>What do you want people to DO when they find you? (your main call to action) *</Label>
            <input className="input-field" placeholder="e.g. Sign up for a free trial, book a call, buy the product, download our guide..." value={answers.primaryCTA || ''} onChange={e => set('primaryCTA', e.target.value)} />
          </div>

          <div style={{ gridColumn: 'span 2' }}>
            <Label>What does success look like to you? (select all that matter) *</Label>
            <MultiSelect
              options={['More website traffic','More leads / signups','More direct sales','Lower cost per customer','Higher conversion rate','More social media followers','Better brand recognition','More repeat customers','Press / media coverage','Growing email list']}
              value={answers.successMetrics || []}
              onChange={v => set('successMetrics', v)}
            />
          </div>

          <div style={{ gridColumn: 'span 2' }}>
            <Label>Do you have any partnerships or collaborators we should build into the plan?</Label>
            <input className="input-field" placeholder="e.g. Influencer relationships, referral partners, complementary businesses, industry associations..." value={answers.partnerships || ''} onChange={e => set('partnerships', e.target.value)} />
          </div>

          <div style={{ gridColumn: 'span 2' }}>
            <Label>Do you have existing customer feedback, reviews, or testimonials?</Label>
            <select className="input-field" value={answers.customerFeedbackAvailable || ''} onChange={e => set('customerFeedbackAvailable', e.target.value)}>
              <option value="">Select...</option>
              {['No customers yet','Yes, a few testimonials','Yes, many 5-star reviews','Yes, detailed case studies','Yes, video testimonials','Mixed reviews (some negative)'].map(v => <option key={v} value={v}>{v}</option>)}
            </select>
          </div>

        </div>
      </div>

      {/* Submit */}
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 20, padding: '28px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h3 style={{ fontFamily: 'Bricolage Grotesque', fontSize: 18, fontWeight: 700, marginBottom: 4 }}>
            Ready to build your full plan?
          </h3>
          <p style={{ color: 'var(--text-3)', fontSize: 13 }}>
            {requiredDone ? "✅ You're all set — let's generate your marketing plan" : "⚠️ Please fill in all required fields above"}
          </p>
        </div>
        <button
          className="btn-primary"
          onClick={onSubmit}
          disabled={!requiredDone || isLoading}
          style={{ padding: '14px 32px', fontSize: 15 }}
        >
          <Sparkles size={18} />
          Generate My Plan
        </button>
      </div>
    </div>
  );
}
