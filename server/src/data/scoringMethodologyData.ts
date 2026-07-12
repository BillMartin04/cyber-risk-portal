import type {
  ScoringMethodology,
  DomainWeight,
  ScoreBand,
  LikelihoodImpactCell,
  FrameworkCalibration,
  ControlEffectivenessExample,
} from '../models';

// Domain weights must sum to 100.  Rationale reflects the regulatory and
// operational criticality weighting used by the 1LoD cyber risk function.
const domainWeights: DomainWeight[] = [
  {
    domainId:      'identity-access',
    domainName:    'Identity & Access Management',
    weight:        15,
    currentScore:  62,
    weightedScore: Math.round(62 * 0.15 * 100) / 100,
    color:         '#4FC3F7',
    rationale:     'Foundational control layer; compromised identity is the leading initial-access vector across 80% of significant cyber incidents.',
  },
  {
    domainId:      'data-security',
    domainName:    'Data Security & Privacy',
    weight:        15,
    currentScore:  71,
    weightedScore: Math.round(71 * 0.15 * 100) / 100,
    color:         '#F06292',
    rationale:     'GDPR, APRA CPS 234, and CCPA obligations attach directly to data security outcomes; regulatory penalty exposure is highest in this domain.',
  },
  {
    domainId:      'endpoint-security',
    domainName:    'Endpoint Security',
    weight:        12,
    currentScore:  67,
    weightedScore: Math.round(67 * 0.12 * 100) / 100,
    color:         '#FFB74D',
    rationale:     'Endpoints are the primary execution environment for malware and ransomware; broad attack surface across 4 800+ managed devices.',
  },
  {
    domainId:      'application-security',
    domainName:    'Application Security',
    weight:        12,
    currentScore:  44,
    weightedScore: Math.round(44 * 0.12 * 100) / 100,
    color:         '#CE93D8',
    rationale:     'Customer-facing applications carry reputational and financial risk; OWASP Top 10 exposure directly tied to development pipeline maturity.',
  },
  {
    domainId:      'network-infrastructure',
    domainName:    'Network & Infrastructure',
    weight:        12,
    currentScore:  65,
    weightedScore: Math.round(65 * 0.12 * 100) / 100,
    color:         '#4DB6AC',
    rationale:     'Network segmentation failures amplify lateral movement; infrastructure underpins all other domains and is a systemic dependency.',
  },
  {
    domainId:      'third-party-vendor',
    domainName:    'Third-Party & Vendor Risk',
    weight:        13,
    currentScore:  76,
    weightedScore: Math.round(76 * 0.13 * 100) / 100,
    color:         '#EF9A9A',
    rationale:     'Supply-chain attacks have increased 742% since 2021; elevated weight reflects DORA ICT third-party oversight requirements and recent sector incidents.',
  },
  {
    domainId:      'cloud-security',
    domainName:    'Cloud Security',
    weight:        10,
    currentScore:  52,
    weightedScore: Math.round(52 * 0.10 * 100) / 100,
    color:         '#81C784',
    rationale:     'Hybrid cloud estate holds 65% of production workloads; misconfiguration remains the primary cloud risk driver.',
  },
  {
    domainId:      'security-awareness',
    domainName:    'Security Awareness & Training',
    weight:        6,
    currentScore:  38,
    weightedScore: Math.round(38 * 0.06 * 100) / 100,
    color:         '#FFF176',
    rationale:     'Human error contributes to 74% of breaches; lower weight reflects that technical controls provide the primary defence layer.',
  },
  {
    domainId:      'ai-emerging-tech',
    domainName:    'AI & Emerging Technology',
    weight:        5,
    currentScore:  58,
    weightedScore: Math.round(58 * 0.05 * 100) / 100,
    color:         '#B0BEC5',
    rationale:     'AI risk is emerging and governance frameworks are still maturing (NIST AI RMF, EU AI Act); weight will increase as AI adoption grows.',
  },
];

// Composite = Σ(score × weight/100)
const compositeScore = Math.round(
  domainWeights.reduce((sum, d) => sum + d.currentScore * (d.weight / 100), 0),
);

const scoreBands: ScoreBand[] = [
  {
    label:       'Critical',
    min:         76,
    max:         100,
    color:       '#FF5252',
    description: 'Unacceptable risk level. Immediate executive escalation and remediation sprint required. Board notification may be warranted.',
    action:      'Escalate to CISO and Risk Committee within 24 hours. Mandatory remediation plan within 5 business days.',
  },
  {
    label:       'High',
    min:         51,
    max:         75,
    color:       '#FF8C00',
    description: 'Risk exceeds appetite in one or more domains. Targeted control uplift required with defined milestones.',
    action:      'Domain owner to present remediation roadmap within 10 business days. Monthly tracking by Risk Committee.',
  },
  {
    label:       'Medium',
    min:         26,
    max:         50,
    color:       '#FFD600',
    description: 'Risk is within appetite with some pressure points. Continuous monitoring and incremental control improvement in place.',
    action:      'Quarterly domain review. Control gaps tracked in risk register with risk owner accountability.',
  },
  {
    label:       'Low',
    min:         0,
    max:         25,
    color:       '#00E676',
    description: 'Risk is well within appetite. Controls are effective and operating as designed.',
    action:      'Annual attestation sufficient. Monitor for emerging threats and changes in regulatory landscape.',
  },
];

// 5×5 Likelihood × Impact matrix
function cellLabel(raw: number): 'Critical' | 'High' | 'Medium' | 'Low' {
  if (raw >= 20) return 'Critical';
  if (raw >= 10) return 'High';
  if (raw >= 5)  return 'Medium';
  return 'Low';
}

function cellColor(label: string): string {
  switch (label) {
    case 'Critical': return '#FF5252';
    case 'High':     return '#FF8C00';
    case 'Medium':   return '#FFD600';
    default:         return '#00E676';
  }
}

const likelihoodImpactMatrix: LikelihoodImpactCell[] = [];
for (let l = 1; l <= 5; l++) {
  for (let i = 1; i <= 5; i++) {
    const raw = l * i;
    const label = cellLabel(raw);
    likelihoodImpactMatrix.push({
      likelihood: l,
      impact:     i,
      rawScore:   raw,
      label,
      color:      cellColor(label),
    });
  }
}

const controlExamples: ControlEffectivenessExample[] = [
  { domain: 'Identity & Access Mgmt', inherentScore: 85, controlEffectiveness: 27, residualScore: 62 },
  { domain: 'Application Security',   inherentScore: 55, controlEffectiveness: 20, residualScore: 44 },
  { domain: 'Third-Party & Vendor',   inherentScore: 90, controlEffectiveness: 16, residualScore: 76 },
  { domain: 'Security Awareness',     inherentScore: 48, controlEffectiveness: 21, residualScore: 38 },
];

const frameworkCalibrations: FrameworkCalibration[] = [
  {
    framework: 'NIST CSF',
    version:   '2.0',
    ranges: [
      { ourScoreMin: 76, ourScoreMax: 100, frameworkLevel: 'Tier 1 — Partial',         description: 'Risk management is ad-hoc. Limited awareness of cyber risk.' },
      { ourScoreMin: 51, ourScoreMax: 75,  frameworkLevel: 'Tier 2 — Risk Informed',    description: 'Risk practices exist but are not enterprise-wide. Inconsistent implementation.' },
      { ourScoreMin: 26, ourScoreMax: 50,  frameworkLevel: 'Tier 3 — Repeatable',       description: 'Formal risk-management practices approved at executive level and consistently applied.' },
      { ourScoreMin: 0,  ourScoreMax: 25,  frameworkLevel: 'Tier 4 — Adaptive',         description: 'Cyber risk management is continuous, adaptive and integrated with business strategy.' },
    ],
  },
  {
    framework: 'ISO 27001',
    version:   '2022',
    ranges: [
      { ourScoreMin: 76, ourScoreMax: 100, frameworkLevel: 'Pre-implementation',        description: 'ISMS scope undefined; critical Annex A controls absent or unimplemented.' },
      { ourScoreMin: 51, ourScoreMax: 75,  frameworkLevel: 'ISMS in Progress',          description: 'Controls being implemented; Statement of Applicability drafted but gaps remain.' },
      { ourScoreMin: 26, ourScoreMax: 50,  frameworkLevel: 'ISMS Certified — Managed',  description: 'Certification achieved; controls operating and monitored but some optimisation needed.' },
      { ourScoreMin: 0,  ourScoreMax: 25,  frameworkLevel: 'ISMS Certified — Optimised', description: 'Controls fully embedded, continually improved and integrated with enterprise risk.' },
    ],
  },
  {
    framework: 'DORA',
    version:   'RTS 2025',
    ranges: [
      { ourScoreMin: 76, ourScoreMax: 100, frameworkLevel: 'Non-Compliant',             description: 'Material gaps in ICT risk framework, incident reporting or third-party oversight.' },
      { ourScoreMin: 51, ourScoreMax: 75,  frameworkLevel: 'Partially Compliant',       description: 'Core DORA requirements partially met; notable gaps in testing or resilience plans.' },
      { ourScoreMin: 26, ourScoreMax: 50,  frameworkLevel: 'Substantially Compliant',   description: 'DORA obligations largely met with minor gaps under remediation.' },
      { ourScoreMin: 0,  ourScoreMax: 25,  frameworkLevel: 'Fully Compliant',           description: 'All DORA ICT risk management, testing and third-party requirements satisfied.' },
    ],
  },
];

export const scoringMethodologyData: ScoringMethodology = {
  compositeScore,
  compositeFormula:            'Composite Score = Σ (Domain Score × Domain Weight%)',
  domainWeights,
  scoreBands,
  likelihoodImpactMatrix,
  controlEffectivenessFormula: 'Residual Score = Inherent Score × (1 − Control Effectiveness%)',
  controlExamples,
  frameworkCalibrations,
  lastUpdated:                 '2026-07-01',
};
