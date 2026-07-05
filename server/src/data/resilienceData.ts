import type {
  MetricPoint, IncidentCategoryMetric, BusinessService,
  DetectionCoverage, Playbook, ScenarioExercise,
} from '../models';

// ─── MTTD / MTTC / MTTR Trend (last 6 quarters) ───────────────────────────

export const METRIC_TREND: MetricPoint[] = [
  { quarter: 'Q1 2025', mttd: 6.8, mttc: 10.2, mttr: 28.4 },
  { quarter: 'Q2 2025', mttd: 6.1, mttc:  9.1, mttr: 25.0 },
  { quarter: 'Q3 2025', mttd: 5.5, mttc:  8.4, mttr: 22.6 },
  { quarter: 'Q4 2025', mttd: 5.0, mttc:  7.6, mttr: 20.1 },
  { quarter: 'Q1 2026', mttd: 4.6, mttc:  7.2, mttr: 19.0 },
  { quarter: 'Q2 2026', mttd: 4.2, mttc:  6.8, mttr: 18.5 },
];

// ─── Metrics by Incident Category ─────────────────────────────────────────

export const CATEGORY_METRICS: IncidentCategoryMetric[] = [
  { category: 'ransomware',     label: 'Ransomware',       mttd: 2.1,  mttc: 4.0,  mttr: 36.0, incidentCount: 0, trend: 'improving' },
  { category: 'data-breach',    label: 'Data Breach',      mttd: 8.4,  mttc: 12.0, mttr: 24.0, incidentCount: 1, trend: 'stable'    },
  { category: 'ddos',           label: 'DDoS',             mttd: 0.3,  mttc:  1.2, mttr:  4.0, incidentCount: 3, trend: 'improving' },
  { category: 'insider-threat', label: 'Insider Threat',   mttd: 18.0, mttc: 24.0, mttr: 48.0, incidentCount: 0, trend: 'stable'    },
  { category: 'supply-chain',   label: 'Supply Chain',     mttd: 12.0, mttc: 18.0, mttr: 32.0, incidentCount: 1, trend: 'degrading' },
  { category: 'cloud-outage',   label: 'Cloud Outage',     mttd: 0.5,  mttc:  2.0, mttr:  6.0, incidentCount: 2, trend: 'improving' },
];

// ─── Critical Business Services ────────────────────────────────────────────

export const BUSINESS_SERVICES: BusinessService[] = [
  {
    id: 'online-banking', name: 'Online & Mobile Banking',
    description: 'Customer-facing digital banking platform serving 2.4M retail and SME customers for account access, payments, and financial management.',
    tier: 'tier-1', rto: 2, rpo: 0.25,
    cyberDependencies:    ['iam', 'appsec', 'cloud', 'network'],
    dataClasses:          ['Customer PII', 'Account data', 'Transaction history', 'Authentication credentials'],
    regulatoryObligation: ['PSD2 Art. 95', 'DORA Art. 8', 'FCA SYSC', 'GDPR Art. 32'],
    customerImpact:       'Loss of access for 2.4M customers; reputational damage; social media escalation within 2 hours of outage.',
    annualRevenueAtRisk:  48.0,
    lastTestedRto:        '2026-04-15',
    rtoMet:               true,
  },
  {
    id: 'payments', name: 'Payment Processing',
    description: 'SWIFT interbank transfers, SEPA credit transfers, card payment authorisation, and real-time payments via ISO 20022 rails.',
    tier: 'tier-1', rto: 1, rpo: 0,
    cyberDependencies:    ['network', 'iam', 'endpoint'],
    dataClasses:          ['Payment instructions', 'Beneficiary data', 'SWIFT messages', 'Card data (PCI scope)'],
    regulatoryObligation: ['PCI DSS Req 4', 'SWIFT CSP', 'PSD2 Art. 96', 'DORA Art. 8'],
    customerImpact:       'Payment failures cascade to corporate clients; SLA breach penalties; regulatory notification within 4 hours under DORA.',
    annualRevenueAtRisk:  120.0,
    lastTestedRto:        '2026-03-01',
    rtoMet:               true,
  },
  {
    id: 'core-banking', name: 'Core Banking System',
    description: 'Temenos T24 core banking platform processing all account postings, interest calculations, and balance management for retail and commercial banking.',
    tier: 'tier-1', rto: 4, rpo: 1,
    cyberDependencies:    ['iam', 'data', 'network', 'endpoint'],
    dataClasses:          ['Account ledger', 'Transaction records', 'Customer master data', 'Regulatory reporting data'],
    regulatoryObligation: ['DORA Art. 8', 'PRA SS1/21', 'EBA GL/2019/04'],
    customerImpact:       'End-of-day processing failure; missed regulatory reporting windows; balance discrepancies.',
    annualRevenueAtRisk:  85.0,
    lastTestedRto:        '2026-05-10',
    rtoMet:               false,
  },
  {
    id: 'customer-data', name: 'Customer Data Platform',
    description: 'Master data management and analytics platform holding profiles, consents, KYC records, and behavioural data for 3.8M customers.',
    tier: 'tier-1', rto: 8, rpo: 4,
    cyberDependencies:    ['data', 'cloud', 'iam'],
    dataClasses:          ['Customer PII', 'GDPR consent records', 'KYC documentation', 'Behavioural analytics'],
    regulatoryObligation: ['GDPR Art. 17/32', 'FCA COBS', 'AML KYC rules'],
    customerImpact:       'GDPR notification obligations within 72 hours of breach; reputational damage; potential regulatory fine up to 4% global turnover.',
    annualRevenueAtRisk:  22.0,
    lastTestedRto:        '2026-02-20',
    rtoMet:               true,
  },
  {
    id: 'fraud-systems', name: 'Fraud & Financial Crime Platform',
    description: 'Real-time fraud scoring, AML transaction monitoring, and sanctions screening covering all inbound and outbound transactions.',
    tier: 'tier-1', rto: 2, rpo: 0.5,
    cyberDependencies:    ['iam', 'data', 'ai'],
    dataClasses:          ['Transaction data', 'Device intelligence', 'Fraud typologies', 'Watchlist data'],
    regulatoryObligation: ['BSA / FinCEN', 'FATF R.20', 'FCA ML Regulations'],
    customerImpact:       'Undetected fraud losses; AML compliance failure; regulatory enforcement action by FCA or FinCEN.',
    annualRevenueAtRisk:  35.0,
    lastTestedRto:        '2026-04-01',
    rtoMet:               true,
  },
  {
    id: 'employee-systems', name: 'Employee & Internal Systems',
    description: 'HR, finance, communications, and productivity platforms (Microsoft 365, Workday, internal portals) used by 4,200 employees.',
    tier: 'tier-2', rto: 24, rpo: 8,
    cyberDependencies:    ['iam', 'endpoint', 'cloud'],
    dataClasses:          ['Employee PII', 'Payroll data', 'Internal communications', 'Financial reports'],
    regulatoryObligation: ['GDPR Art. 32', 'ISO 27001 A.7'],
    customerImpact:       'Operational disruption; no direct customer impact; potential data breach if employee data compromised.',
    annualRevenueAtRisk:  8.0,
    lastTestedRto:        '2025-11-15',
    rtoMet:               true,
  },
];

// ─── Detection Coverage by Domain ──────────────────────────────────────────

export const DETECTION_COVERAGE: DetectionCoverage[] = [
  { domainId: 'iam',      domainName: 'Identity & Access Mgmt',  domainColor: '#00d4ff', coverage: 88, alertsLast30Days: 142, falsePositiveRate: 12, detectionGaps: ['Lateral movement from compromised service accounts'] },
  { domainId: 'data',     domainName: 'Data Security & Privacy', domainColor: '#a855f7', coverage: 72, alertsLast30Days: 63,  falsePositiveRate: 18, detectionGaps: ['Slow data exfiltration via HTTPS to cloud storage', 'Insider copy-to-USB not monitored for contractors'] },
  { domainId: 'endpoint', domainName: 'Endpoint Security',       domainColor: '#f43f5e', coverage: 91, alertsLast30Days: 218, falsePositiveRate: 8,  detectionGaps: ['macOS developer workstations (partial EDR coverage)'] },
  { domainId: 'appsec',   domainName: 'Application Security',    domainColor: '#f97316', coverage: 65, alertsLast30Days: 44,  falsePositiveRate: 22, detectionGaps: ['API abuse detection — no ML-based anomaly scoring', 'Business logic attacks not detected by WAF rules'] },
  { domainId: 'network',  domainName: 'Network & Infrastructure', domainColor: '#06b6d4', coverage: 94, alertsLast30Days: 387, falsePositiveRate: 6,  detectionGaps: ['Encrypted east-west traffic blind spot (planned: Q3 2026 TLS inspection)'] },
  { domainId: 'vendor',   domainName: 'Third-Party & Vendor',    domainColor: '#eab308', coverage: 48, alertsLast30Days: 12,  falsePositiveRate: 35, detectionGaps: ['Vendor-initiated sessions not fully monitored', 'No behavioural baseline for vendor access patterns'] },
  { domainId: 'cloud',    domainName: 'Cloud Security',          domainColor: '#3b82f6', coverage: 83, alertsLast30Days: 94,  falsePositiveRate: 14, detectionGaps: ['Cross-account data movement in AWS Organizations'] },
  { domainId: 'ai',       domainName: 'AI & Emerging Technology', domainColor: '#a855f7', coverage: 55, alertsLast30Days: 28,  falsePositiveRate: 28, detectionGaps: ['Prompt injection via external documents', 'Model output anomaly detection not deployed', 'Shadow AI usage via personal devices'] },
];

// ─── Incident Response Playbooks ───────────────────────────────────────────

export const PLAYBOOKS: Playbook[] = [
  { id: 'pb-ransomware',     name: 'Ransomware Response',          scenario: 'ransomware',     version: '3.1', status: 'tested',      readiness: 88, owner: 'Marcus Webb', lastTested: '2026-04-10', nextTest: '2026-10-10', steps: 42, automatedSteps: 18 },
  { id: 'pb-data-breach',    name: 'Personal Data Breach (GDPR)',  scenario: 'data-breach',    version: '2.4', status: 'tested',      readiness: 82, owner: 'Sophie Brennan', lastTested: '2026-03-01', nextTest: '2026-09-01', steps: 38, automatedSteps: 12 },
  { id: 'pb-ddos',           name: 'DDoS & Availability Attack',   scenario: 'ddos',           version: '2.0', status: 'tested',      readiness: 91, owner: 'David Chen',  lastTested: '2026-05-15', nextTest: '2026-11-15', steps: 24, automatedSteps: 16 },
  { id: 'pb-insider',        name: 'Insider Threat Response',      scenario: 'insider-threat', version: '1.2', status: 'draft',       readiness: 45, owner: 'Marcus Webb', lastTested: '2025-09-01', nextTest: '2026-07-01', steps: 31, automatedSteps: 4  },
  { id: 'pb-supply-chain',   name: 'Supply Chain Compromise',      scenario: 'supply-chain',   version: '1.0', status: 'outdated',    readiness: 38, owner: 'Maria Santos', lastTested: '2025-06-01', nextTest: '2026-07-15', steps: 28, automatedSteps: 6  },
];

// ─── Scenario Exercises ────────────────────────────────────────────────────

export const EXERCISES: ScenarioExercise[] = [
  {
    id: 'ex-001', name: 'Operation Sandstorm — Ransomware Tabletop',
    type: 'tabletop', date: '2026-04-10',
    scenario: 'Simulated ransomware attack on core banking via phishing email — lateral movement to file shares and backup deletion before detection.',
    participants: 22, duration: '4 hours',
    findingsCount: 14, criticalFindings: 3, closedFindings: 9,
    score: 74, nextExercise: '2026-10-10',
  },
  {
    id: 'ex-002', name: 'Operation Cloudbreak — Cloud Outage Simulation',
    type: 'simulation', date: '2026-02-28',
    scenario: 'AWS eu-west-1 region failure affecting online banking and cloud-hosted APIs. Tested failover to eu-central-1 DR environment under time pressure.',
    participants: 15, duration: '6 hours',
    findingsCount: 8, criticalFindings: 1, closedFindings: 7,
    score: 85, nextExercise: '2026-08-28',
  },
  {
    id: 'ex-003', name: 'Operation Phantom — Insider Threat Walkthrough',
    type: 'walkthrough', date: '2025-11-20',
    scenario: 'Privileged employee exfiltrating customer data via legitimate business access before termination. Tested HR-to-IT offboarding and detection procedures.',
    participants: 12, duration: '3 hours',
    findingsCount: 11, criticalFindings: 4, closedFindings: 5,
    score: 58, nextExercise: '2026-07-01',
  },
];
