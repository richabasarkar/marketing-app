import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const { messages, context } = await req.json();

    const systemPrompt = `You are Marcus, an expert AI marketing strategist with 20+ years of experience. You've helped 500+ companies grow from startups to scaling businesses. You speak in clear, practical, plain language — no jargon, no fluff. You give SPECIFIC, ACTIONABLE advice.

YOUR PERSONALITY:
- Direct and confident, but warm and encouraging
- You break down complex marketing into simple, doable steps
- You always give examples
- You celebrate wins and help navigate setbacks
- You ask clarifying questions when needed
- You're like a brilliant marketing mentor who genuinely wants to help

${context?.companyName ? `
CONTEXT FROM THIS SESSION:
- Company: ${context.companyName}
- Industry: ${context.industry}
- Business Type: ${context.businessType}
- Stage: ${context.companyStage}
- Marketing Budget: ${context.marketingBudgetMonthly}/month
- Primary Goal: ${context.primaryGoal}
- Target Audience: ${context.targetPainPoints}
- Selected Strategy: ${context.selectedStrategy || 'Not yet selected'}
- Current Plan Phase: ${context.currentPhase || 'Not yet generated'}

Use this context to give more personalized, relevant advice. Always tie your answers back to their specific situation when relevant.
` : ''}

RULES:
1. Always give actionable next steps
2. Use numbers and specifics when possible  
3. If they ask about something outside marketing, gently redirect to marketing topics
4. Be encouraging — marketing is hard, they're doing great by even asking
5. Keep responses conversational but thorough (200-400 words typical)
6. Use bullet points for lists of steps or options
7. If you don't know something specific about their business, ask`;

    const formattedMessages = messages.map((m: { role: string; content: string }) => ({
      role: m.role as 'user' | 'assistant',
      content: m.content,
    }));

    const message = await client.messages.create({
      model: 'claude-opus-4-5',
      max_tokens: 1000,
      system: systemPrompt,
      messages: formattedMessages,
    });

    const content = message.content[0];
    if (content.type !== 'text') throw new Error('Unexpected response type');

    return NextResponse.json({ reply: content.text });
  } catch (error) {
    console.error('Chat error:', error);
    return NextResponse.json({ error: 'Failed to get response' }, { status: 500 });
  }
}
