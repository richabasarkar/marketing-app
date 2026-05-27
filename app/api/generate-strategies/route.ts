import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const { inputs } = await req.json();

    const prompt = `You are a world-class marketing strategist with 20+ years of experience helping companies from startups to Fortune 500. Based on the company profile below, generate exactly 5 marketing strategies tailored to this specific company.

COMPANY PROFILE:
- Company: ${inputs.companyName || 'Unnamed Company'}
- Industry: ${inputs.industry}
- Business Type: ${inputs.businessType}
- Stage: ${inputs.companyStage}
- Years in Business: ${inputs.yearsInBusiness || 'Not specified'}
- Employees: ${inputs.employeeCount || 'Not specified'}
- Product/Service: ${inputs.productDescription}
- Unique Value Prop: ${inputs.uniqueValueProp}
- Price Point: ${inputs.pricePoint}
- Funding: ${inputs.fundingStatus} (${inputs.totalFunding || 'amount not specified'})
- Monthly Revenue: ${inputs.monthlyRevenue || 'Not specified'}
- Monthly Marketing Budget: ${inputs.marketingBudgetMonthly}
- Primary Goal: ${inputs.primaryGoal}
- Target Audience: Age ${inputs.targetAgeRange?.join(', ')}, ${inputs.targetGender}, Income: ${inputs.targetIncome}, Location: ${inputs.targetLocation}
- Target Pain Points: ${inputs.targetPainPoints}
- Current Channels: ${inputs.currentChannels?.join(', ') || 'None'}
- Biggest Challenge: ${inputs.biggestMarketingChallenge}
- Competitors: ${inputs.mainCompetitors}
- Competitive Advantage: ${inputs.competitiveDifferentiator}
- Market Position: ${inputs.marketPosition}
- Revenue Goal (12 mo): ${inputs.revenueGoal12Months}
- Timeline Urgency: ${inputs.timelineUrgency}
- In-house Capabilities: ${inputs.inHouseCapabilities?.join(', ') || 'None specified'}
- Additional Context: ${inputs.additionalContext || 'None'}

Respond ONLY with a valid JSON array of exactly 5 strategy objects. No preamble, no markdown, no explanation outside the JSON.

Each strategy must be a JSON object with these exact fields:
{
  "id": "strategy-1", (strategy-1 through strategy-5)
  "name": "Short strategy name (3-5 words)",
  "tagline": "One punchy sentence describing the approach",
  "description": "2-3 sentences in PLAIN language explaining what this strategy is. Write as if talking to someone who has never done marketing before.",
  "howItWorks": "3-4 sentences explaining HOW to actually execute this. Step-by-step in plain language.",
  "whyItFitsYou": "2-3 sentences explaining specifically why this works for THIS company's profile.",
  "estimatedTimeToResults": "e.g. '30-60 days', '3-6 months'",
  "estimatedCostRange": "Monthly cost range based on their budget, e.g. '$500-$2,000/month'",
  "effortLevel": "Low" | "Medium" | "High",
  "potentialROI": "e.g. '3-5x within 6 months'",
  "channels": ["channel1", "channel2"],
  "pros": ["pro1", "pro2", "pro3"],
  "cons": ["con1", "con2"],
  "bestFor": "One sentence about what type of company/situation this is best for",
  "isRecommended": true or false (mark exactly 2 as true - the TOP 2 best fits),
  "recommendationReason": "Only include if isRecommended is true - explain in 1 sentence why this is a top pick for them",
  "icon": "one of: rocket, target, megaphone, users, trending-up, star, zap, heart, globe, mail",
  "color": "one of: purple, pink, green, yellow, blue, orange"
}`;

    const message = await client.messages.create({
      model: 'claude-opus-4-5',
      max_tokens: 4000,
      messages: [{ role: 'user', content: prompt }],
    });

    const content = message.content[0];
    if (content.type !== 'text') throw new Error('Unexpected response type');

    let strategies;
    try {
      const clean = content.text.replace(/```json|```/g, '').trim();
      strategies = JSON.parse(clean);
    } catch {
      const match = content.text.match(/\[[\s\S]*\]/);
      if (!match) throw new Error('Could not parse strategies JSON');
      strategies = JSON.parse(match[0]);
    }

    return NextResponse.json({ strategies });
  } catch (error) {
    console.error('Error generating strategies:', error);
    return NextResponse.json({ error: 'Failed to generate strategies' }, { status: 500 });
  }
}
