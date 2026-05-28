# StrategyOS — AI Marketing Strategy Platform

A full-stack AI-powered marketing strategy app built with Next.js, TypeScript, and Claude AI.

## Features

- **Company Profiler** — 40+ input fields covering every aspect of your business
- **AI Strategy Generator** — 5 custom strategies ranked by fit, with 2 top picks highlighted
- **Plan Builder** — Full 12-week marketing plan with phases, KPIs, budget breakdowns, and messaging frameworks
- **Action Board** — Asana-style project management with week/phase/priority/category views
- **Chip AI Chatbot** — Context-aware marketing expert available throughout the entire journey

## Setup

### 1. Clone the repo
```bash
git clone <your-repo-url>
cd marketing-strategy-app
```

### 2. Install dependencies
```bash
npm install
```

### 3. Set up your API key
Copy `.env.example` to `.env.local` and add your Anthropic API key:
```bash
cp .env.example .env.local
```

Then edit `.env.local`:
```
ANTHROPIC_API_KEY=your_actual_api_key_here
```

Get your API key at: https://console.anthropic.com

### 4. Run locally
```bash
npm run dev
```

Open http://localhost:3000

## Deploy to Vercel

1. Push to GitHub
2. Go to vercel.com → Import project
3. Add `ANTHROPIC_API_KEY` in Vercel's Environment Variables
4. Deploy!

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Custom CSS with CSS variables (dark theme)
- **AI**: Anthropic Claude API (claude-opus-4-5)
- **Fonts**: Bricolage Grotesque + DM Sans
- **Icons**: Lucide React

## App Flow

1. **Company Profile** → Fill in 40+ fields about your company
2. **Strategies** → View 5 AI-generated strategies tailored to you, select the best one
3. **Plan Details** → Answer follow-up questions to customize your plan
4. **Marketing Plan** → Tabbed plan with phases, KPIs, budget, messaging, tools, risks
5. **Action Board** → Week-by-week tasks with progress tracking and filtering

## Customization

- Colors: Edit CSS variables in `app/globals.css`
- AI prompts: Edit `app/api/generate-strategies/route.ts` and `app/api/generate-plan/route.ts`
- Chatbot persona: Edit `app/api/chat/route.ts`
