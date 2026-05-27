export interface CompanyInputs {
  // Basic Info
  companyName: string;
  industry: string;
  businessType: string; // B2B, B2C, D2C, marketplace, etc.
  companyStage: string; // idea, pre-revenue, early-stage, growth, scaling, enterprise
  yearsInBusiness: string;
  employeeCount: string;

  // Product/Service
  productDescription: string;
  uniqueValueProp: string;
  pricePoint: string; // budget, mid-range, premium, enterprise
  productCategory: string;

  // Financial
  fundingStatus: string; // bootstrapped, pre-seed, seed, Series A, B, C+
  totalFunding: string;
  monthlyRevenue: string;
  marketingBudgetMonthly: string;
  budgetFlexibility: string; // fixed, somewhat flexible, very flexible

  // Target Audience
  targetAgeRange: string[];
  targetGender: string;
  targetIncome: string;
  targetLocation: string; // local, regional, national, global
  targetGeography: string;
  targetPainPoints: string;
  buyerPersona: string;
  targetIndustry: string; // for B2B
  targetCompanySize: string; // for B2B
  targetJobTitles: string; // for B2B

  // Current Marketing
  currentChannels: string[];
  currentMonthlyTraffic: string;
  currentConversionRate: string;
  currentCAC: string;
  currentLTV: string;
  biggestMarketingChallenge: string;

  // Competition
  mainCompetitors: string;
  competitiveDifferentiator: string;
  marketPosition: string; // leader, challenger, niche, new entrant

  // Goals
  primaryGoal: string; // brand awareness, lead gen, sales, retention, etc.
  revenueGoal12Months: string;
  customerGrowthGoal: string;
  timelineUrgency: string; // immediate, 3 months, 6 months, 12 months

  // Team
  hasMarketingTeam: string;
  marketingTeamSize: string;
  inHouseCapabilities: string[];

  // Additional
  seasonality: string;
  geographicFocus: string;
  complianceRestrictions: string;
  pastMarketingFailures: string;
  additionalContext: string;
}

export interface MarketingStrategy {
  id: string;
  name: string;
  tagline: string;
  description: string;
  howItWorks: string;
  whyItFitsYou: string;
  estimatedTimeToResults: string;
  estimatedCostRange: string;
  effortLevel: 'Low' | 'Medium' | 'High';
  potentialROI: string;
  channels: string[];
  pros: string[];
  cons: string[];
  bestFor: string;
  isRecommended: boolean;
  recommendationReason?: string;
  icon: string;
  color: string;
}

export interface FollowUpAnswers {
  launchTimeline: string;
  contentCreationCapacity: string;
  brandVoice: string;
  existingAssets: string;
  primaryCTA: string;
  successMetrics: string[];
  weeklyTimeCommitment: string;
  technicalExpertise: string;
  partnerships: string;
  customerFeedbackAvailable: string;
}

export interface KPI {
  metric: string;
  target: string;
  timeframe: string;
  trackingMethod: string;
  frequency: string;
}

export interface ActionItem {
  id: string;
  task: string;
  description: string;
  week: number;
  phase: string;
  priority: 'High' | 'Medium' | 'Low';
  estimatedHours: number;
  completed: boolean;
  category: string;
  owner: string;
  resources?: string[];
}

export interface PlanPhase {
  id: string;
  name: string;
  duration: string;
  objective: string;
  description: string;
  tactics: string[];
  kpis: KPI[];
  actionItems: ActionItem[];
  budget: string;
  expectedOutcomes: string[];
  color: string;
}

export interface MarketingPlan {
  strategyName: string;
  executiveSummary: string;
  targetAudienceSummary: string;
  brandPositioning: string;
  messagingFramework: {
    headline: string;
    subheadline: string;
    elevatorPitch: string;
    keyMessages: string[];
    toneOfVoice: string[];
  };
  phases: PlanPhase[];
  overallKPIs: KPI[];
  totalBudgetBreakdown: { category: string; percentage: number; monthly: string }[];
  toolsAndResources: { name: string; purpose: string; cost: string; priority: string }[];
  riskMitigation: { risk: string; mitigation: string }[];
  successMilestones: { milestone: string; timeline: string; metric: string }[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface TaskBoard {
  [week: string]: ActionItem[];
}
