import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const { inputs, selectedStrategy, followUpAnswers } = await req.json();

    const prompt = `You are a world-class marketing strategist. Create a detailed marketing plan for this company. Write everything in PLAIN, simple English.

COMPANY PROFILE:
${JSON.stringify(inputs, null, 2)}

SELECTED STRATEGY: ${selectedStrategy.name}
Strategy Description: ${selectedStrategy.description}
Channels: ${selectedStrategy.channels?.join(', ')}

FOLLOW-UP ANSWERS:
- Launch Timeline: ${followUpAnswers.launchTimeline}
- Content Creation Capacity: ${followUpAnswers.contentCreationCapacity}
- Brand Voice: ${followUpAnswers.brandVoice}
- Existing Assets: ${followUpAnswers.existingAssets}
- Primary CTA: ${followUpAnswers.primaryCTA}
- Success Metrics: ${followUpAnswers.successMetrics?.join(', ')}
- Weekly Time Commitment: ${followUpAnswers.weeklyTimeCommitment}
- Technical Expertise: ${followUpAnswers.technicalExpertise}
- Partnerships Available: ${followUpAnswers.partnerships}

Respond ONLY with a valid JSON object. No preamble, no markdown fences, no text outside the JSON.

IMPORTANT: Keep descriptions concise (1-2 sentences max). Limit to exactly 4 phases, 5 action items per phase, 2 KPIs per phase, 4 overall KPIs, 4 budget categories, 5 tools, 3 risks, 4 milestones.

{
  "strategyName": "Full name of the strategy",
  "executiveSummary": "2-3 sentences summarizing the plan.",
  "targetAudienceSummary": "1-2 sentences describing who they're targeting.",
  "brandPositioning": "1-2 sentences on brand positioning.",
  "messagingFramework": {
    "headline": "Main headline/tagline",
    "subheadline": "Supporting subtitle",
    "elevatorPitch": "30-second pitch",
    "keyMessages": ["message1", "message2", "message3"],
    "toneOfVoice": ["characteristic1", "characteristic2", "characteristic3"]
  },
  "phases": [
    {
      "id": "phase-1",
      "name": "Foundation & Setup",
      "duration": "Weeks 1-3",
      "objective": "One sentence objective",
      "description": "1-2 sentences about this phase.",
      "tactics": ["tactic1", "tactic2", "tactic3"],
      "budget": "$X,XXX/month",
      "expectedOutcomes": ["outcome1", "outcome2"],
      "color": "purple",
      "kpis": [
        {
          "metric": "KPI name",
          "target": "Specific goal",
          "timeframe": "End of month 1",
          "trackingMethod": "Tool/method",
          "frequency": "Weekly"
        }
      ],
      "actionItems": [
        {
          "id": "ai-1-1",
          "task": "Short task title",
          "description": "What to do and how in 1-2 sentences",
          "week": 1,
          "phase": "Foundation & Setup",
          "priority": "High",
          "estimatedHours": 3,
          "completed": false,
          "category": "Strategy",
          "owner": "You",
          "resources": ["one resource or tool"]
        }
      ]
    }
  ],
  "overallKPIs": [
    {
      "metric": "KPI name",
      "target": "12-month target",
      "timeframe": "12 months",
      "trackingMethod": "Tracking method",
      "frequency": "Monthly"
    }
  ],
  "totalBudgetBreakdown": [
    { "category": "Paid Advertising", "percentage": 40, "monthly": "$X,XXX" }
  ],
  "toolsAndResources": [
    {
      "name": "Tool name",
      "purpose": "What it does",
      "cost": "Free / $X/month",
      "priority": "Essential"
    }
  ],
  "riskMitigation": [
    {
      "risk": "A risk",
      "mitigation": "How to handle it"
    }
  ],
  "successMilestones": [
    {
      "milestone": "What success looks like",
      "timeline": "Month X",
      "metric": "Measurable indicator"
    }
  ]
}`;

    const message = await client.messages.create({
      model: 'claude-sonnet-4-5',
      max_tokens: 8000,
      messages: [{ role: 'user', content: prompt }],
    });

    const content = message.content[0];
    if (content.type !== 'text') throw new Error('Unexpected response type');

    let plan;
    try {
      const clean = content.text.replace(/```json|```/g, '').trim();
      plan = JSON.parse(clean);
    } catch {
      const match = content.text.match(/\{[\s\S]*\}/);
      if (!match) throw new Error('Could not parse plan JSON');
      plan = JSON.parse(match[0]);
    }

    return NextResponse.json({ plan });
  } catch (error) {
    console.error('Error generating plan:', error);
    return NextResponse.json({ error: 'Failed to generate plan' }, { status: 500 });
  }
}