import type {
  AIFinOpsData, AIFinOpsMonthlyTrend, AIToolSpend, DepartmentSpend, AIFinOpsStats,
} from '../models';

const MONTHLY_BUDGET = 25_000;

// ─── Sanctioned tools (aligned to AI Registry) ───────────────────────────────
// registry-approved tools drive the majority of spend
const sanctionedTools: AIToolSpend[] = [
  {
    toolId:       'chatgpt-enterprise',
    toolName:     'ChatGPT Enterprise',
    vendor:       'OpenAI',
    category:     'Generative AI',
    status:       'sanctioned',
    department:   'Risk & Compliance',
    monthlySpend: 4_800,
    tokenUsage:   18.4,
    users:        312,
    dataRiskLevel: 'medium',
  },
  {
    toolId:       'ms-copilot-m365',
    toolName:     'Microsoft Copilot M365',
    vendor:       'Microsoft',
    category:     'Productivity AI',
    status:       'sanctioned',
    department:   'All Departments',
    monthlySpend: 8_400,
    tokenUsage:   31.2,
    users:        420,
    dataRiskLevel: 'low',
  },
  {
    toolId:       'github-copilot',
    toolName:     'GitHub Copilot',
    vendor:       'Microsoft / GitHub',
    category:     'Code Assistant',
    status:       'sanctioned',
    department:   'Engineering',
    monthlySpend: 1_566,
    tokenUsage:   9.8,
    users:        87,
    dataRiskLevel: 'low',
  },
  {
    toolId:       'salesforce-einstein',
    toolName:     'Salesforce Einstein AI',
    vendor:       'Salesforce',
    category:     'CRM AI',
    status:       'sanctioned',
    department:   'Sales',
    monthlySpend: 3_200,
    tokenUsage:   6.1,
    users:        160,
    dataRiskLevel: 'medium',
  },
  {
    toolId:       'claude-for-work',
    toolName:     'Claude for Work',
    vendor:       'Anthropic',
    category:     'Generative AI',
    status:       'sanctioned',
    department:   'Risk Analytics',
    monthlySpend: 480,
    tokenUsage:   2.2,
    users:        24,
    dataRiskLevel: 'low',
  },
  {
    toolId:       'grammarly-business',
    toolName:     'Grammarly Business',
    vendor:       'Grammarly Inc.',
    category:     'Writing Assistant',
    status:       'sanctioned',
    department:   'Marketing & Comms',
    monthlySpend: 990,
    tokenUsage:   1.4,
    users:        198,
    dataRiskLevel: 'low',
  },
];

// ─── Shadow AI (discovered via monitoring) ────────────────────────────────────
// tools used without IT/security approval, found in expense reports or network logs
const shadowTools: AIToolSpend[] = [
  {
    toolId:        'chatgpt-personal',
    toolName:      'ChatGPT (Personal)',
    vendor:        'OpenAI',
    category:      'Generative AI',
    status:        'shadow',
    department:    'Multiple',
    monthlySpend:  890,
    tokenUsage:    3.4,
    users:         47,
    dataRiskLevel: 'high',
    discoveredVia: 'Expense report analysis — 47 personal subscription reimbursements',
  },
  {
    toolId:        'jasper-ai',
    toolName:      'Jasper AI',
    vendor:        'Jasper',
    category:      'Writing Assistant',
    status:        'shadow',
    department:    'Marketing & Comms',
    monthlySpend:  1_200,
    tokenUsage:    4.1,
    users:         8,
    dataRiskLevel: 'high',
    discoveredVia: 'Procurement anomaly — recurring SaaS charge on team credit card',
  },
  {
    toolId:        'otterai',
    toolName:      'Otter.ai',
    vendor:        'Otter.ai Inc.',
    category:      'Transcription AI',
    status:        'shadow',
    department:    'Sales',
    monthlySpend:  620,
    tokenUsage:    0.8,
    users:         22,
    dataRiskLevel: 'critical',
    discoveredVia: 'IT network monitoring — client meeting recordings uploaded to third-party',
  },
  {
    toolId:        'midjourney-shadow',
    toolName:      'Midjourney',
    vendor:        'Midjourney Inc.',
    category:      'Image Generation',
    status:        'shadow',
    department:    'Marketing & Comms',
    monthlySpend:  480,
    tokenUsage:    0.3,
    users:         12,
    dataRiskLevel: 'medium',
    discoveredVia: 'Expense report analysis — Discord subscription reimbursements',
  },
  {
    toolId:        'perplexity-shadow',
    toolName:      'Perplexity Pro',
    vendor:        'Perplexity AI',
    category:      'Search AI',
    status:        'shadow',
    department:    'Risk & Compliance',
    monthlySpend:  340,
    tokenUsage:    1.1,
    users:         9,
    dataRiskLevel: 'high',
    discoveredVia: 'Expense report analysis — under review by InfoSec',
  },
  {
    toolId:        'character-ai',
    toolName:      'Character.AI',
    vendor:        'Character Technologies',
    category:      'Generative AI',
    status:        'shadow',
    department:    'Unknown',
    monthlySpend:  180,
    tokenUsage:    0.6,
    users:         6,
    dataRiskLevel: 'critical',
    discoveredVia: 'IT network traffic analysis — access from corporate devices',
  },
];

const allTools: AIToolSpend[] = [...sanctionedTools, ...shadowTools];

const totalSanctioned = sanctionedTools.reduce((s, t) => s + t.monthlySpend, 0);  // 19 436
const totalShadow     = shadowTools.reduce((s, t) => s + t.monthlySpend, 0);       // 3 710
const totalSpend      = totalSanctioned + totalShadow;
const totalTokens     = allTools.reduce((s, t) => s + t.tokenUsage, 0);

// ─── Monthly trend ────────────────────────────────────────────────────────────
const monthlyTrend: AIFinOpsMonthlyTrend[] = [
  { month: 'Jan 2026', sanctionedSpend: 15_200, shadowSpend: 1_800, totalTokens: 48.2,  decisions: 1_420 },
  { month: 'Feb 2026', sanctionedSpend: 16_400, shadowSpend: 2_100, totalTokens: 52.6,  decisions: 1_580 },
  { month: 'Mar 2026', sanctionedSpend: 17_800, shadowSpend: 2_900, totalTokens: 58.1,  decisions: 1_740 },
  { month: 'Apr 2026', sanctionedSpend: 18_200, shadowSpend: 3_100, totalTokens: 62.4,  decisions: 1_890 },
  { month: 'May 2026', sanctionedSpend: 19_100, shadowSpend: 3_500, totalTokens: 74.8,  decisions: 2_050 },
  { month: 'Jun 2026', sanctionedSpend: totalSanctioned, shadowSpend: totalShadow, totalTokens: Math.round(totalTokens * 10) / 10, decisions: 2_240 },
];

// ─── Department breakdown ─────────────────────────────────────────────────────
const departmentBreakdown: DepartmentSpend[] = [
  {
    department:      'All Departments',
    sanctionedSpend: 8_400,
    shadowSpend:     890,
    totalSpend:      9_290,
    topTool:         'Microsoft Copilot M365',
    riskFlag:        false,
  },
  {
    department:      'Risk & Compliance',
    sanctionedSpend: 4_800 + 480,
    shadowSpend:     340,
    totalSpend:      4_800 + 480 + 340,
    topTool:         'ChatGPT Enterprise',
    riskFlag:        false,
  },
  {
    department:      'Sales',
    sanctionedSpend: 3_200,
    shadowSpend:     620,
    totalSpend:      3_200 + 620,
    topTool:         'Salesforce Einstein AI',
    riskFlag:        false,
  },
  {
    department:      'Marketing & Comms',
    sanctionedSpend: 990,
    shadowSpend:     1_200 + 480,
    totalSpend:      990 + 1_200 + 480,
    topTool:         'Jasper AI (Shadow)',
    riskFlag:        true,   // shadow > sanctioned
  },
  {
    department:      'Engineering',
    sanctionedSpend: 1_566,
    shadowSpend:     0,
    totalSpend:      1_566,
    topTool:         'GitHub Copilot',
    riskFlag:        false,
  },
  {
    department:      'Unknown',
    sanctionedSpend: 0,
    shadowSpend:     180,
    totalSpend:      180,
    topTool:         'Character.AI (Shadow)',
    riskFlag:        true,
  },
];

// ─── Stats ────────────────────────────────────────────────────────────────────
const stats: AIFinOpsStats = {
  totalMonthlySpend:    totalSpend,
  sanctionedSpend:      totalSanctioned,
  shadowSpend:          totalShadow,
  shadowPercentage:     Math.round((totalShadow / totalSpend) * 100 * 10) / 10,
  totalTokensThisMonth: Math.round(totalTokens * 10) / 10,
  costPerRiskDecision:  Math.round((totalSpend / 2_240) * 100) / 100,
  toolCount:            allTools.length,
  shadowToolCount:      shadowTools.length,
  departmentCount:      departmentBreakdown.length,
  budgetUtilisation:    Math.round((totalSpend / MONTHLY_BUDGET) * 100),
};

export const aiFinOpsData: AIFinOpsData = {
  stats,
  monthlyTrend,
  toolSpend:           allTools,
  departmentBreakdown,
  reportingPeriod:     'June 2026',
  monthlyBudget:       MONTHLY_BUDGET,
};
