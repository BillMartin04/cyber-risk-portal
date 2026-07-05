import type {
  RiskAppetite, RiskException, EscalationRule,
  GovernanceCommittee, GovernanceDecision, PolicyRecord,
} from '../models';

// ─── Risk Appetite ──────────────────────────────────────────────────────────

export const RISK_APPETITE: RiskAppetite = {
  statement: 'Your Organization maintains a LOW risk appetite for cyber risk. The Board accepts that some residual cyber risk is inherent in operating a digital financial services business, but will not tolerate risks that threaten customer data confidentiality, payment system integrity, or regulatory standing. Critical residual risks require immediate escalation and an approved remediation plan within 30 days. High risks must be actively managed with documented mitigation actions and quarterly Board reporting.',
  overallTolerance: 'low',
  boardEndorsed:    true,
  approvedBy:       'Board Audit & Risk Committee',
  approvedDate:     '2026-01-15',
  nextReview:       '2027-01-15',
  thresholds: [
    { level: 'critical', label: 'Critical Risk',  maxAllowed: 0,  current: 3,  breached: true  },
    { level: 'high',     label: 'High Risk',      maxAllowed: 5,  current: 9,  breached: true  },
    { level: 'medium',   label: 'Medium Risk',    maxAllowed: 15, current: 11, breached: false },
    { level: 'low',      label: 'Low Risk',       maxAllowed: 50, current: 4,  breached: false },
  ],
};

// ─── Exception Register ─────────────────────────────────────────────────────

export const EXCEPTIONS: RiskException[] = [
  {
    id:          'exc-001',
    title:       'PAM solution not deployed to legacy AS/400 banking core',
    domainId:    'iam',
    domainName:  'Identity & Access Management',
    controlId:   'c-iam-1',
    controlName: 'Privileged Access Management (PAM) Solution',
    justification: 'AS/400 architecture does not support CyberArk agent installation. Vendor roadmap for migration to modern core banking is Q4 2027.',
    compensatingControl: 'Manual quarterly access review by IT Operations Manager; all AS/400 sessions logged to SIEM with 90-day retention; access list restricted to 4 named individuals.',
    residualRisk: 'high',
    approver:     'Marcus Webb (CISO)',
    approvedDate: '2026-01-10',
    expiryDate:   '2026-12-31',
    status:       'active',
    reviewDate:   '2026-07-01',
  },
  {
    id:          'exc-002',
    title:       'MFA not enforced for 34 legacy business applications',
    domainId:    'iam',
    domainName:  'Identity & Access Management',
    controlId:   'c-iam-4',
    controlName: 'Microsoft Entra ID Conditional Access + MFA',
    justification: 'Legacy applications built on proprietary frameworks lack SAML/OIDC support. Remediation requires application re-architecture currently funded in FY2027 IT budget.',
    compensatingControl: 'All 34 apps accessible via internal network only (VPN required for remote access). MFA enforced at VPN boundary. Monthly access log review.',
    residualRisk: 'high',
    approver:     'Marcus Webb (CISO)',
    approvedDate: '2026-02-01',
    expiryDate:   '2026-12-31',
    status:       'active',
    reviewDate:   '2026-08-01',
  },
  {
    id:          'exc-003',
    title:       'Annual penetration test delayed — Q1 2026 scope not completed',
    domainId:    'appsec',
    domainName:  'Application Security',
    controlId:   'c-appsec-pen',
    controlName: 'Annual External Penetration Test',
    justification: 'Third-party penetration testing vendor contract expired in December 2025. New vendor procurement completed April 2026; test rescheduled to June 2026.',
    compensatingControl: 'Internal red team conducted targeted tests on 5 highest-risk applications in Q1 2026. DAST scans run weekly across all production apps.',
    residualRisk: 'medium',
    approver:     'Sophie Brennan (Head of Compliance)',
    approvedDate: '2026-02-15',
    expiryDate:   '2026-07-31',
    status:       'active',
    reviewDate:   '2026-06-30',
  },
  {
    id:          'exc-004',
    title:       'Vendor SOC 2 Type II reports not obtained for 6 critical suppliers',
    domainId:    'vendor',
    domainName:  'Third-Party & Vendor Risk',
    controlId:   'c-vendor-soc2',
    controlName: 'Annual SOC 2 Type II Assessment',
    justification: 'Vendors in scope are smaller regional providers who have not yet completed SOC 2 certification. Contractual clause added requiring certification by Q3 2026.',
    compensatingControl: 'Vendor questionnaire completed for all 6 suppliers; annual on-site assessments conducted for top 3. Contractual right to audit in place.',
    residualRisk: 'medium',
    approver:     'James Whitfield (CRO)',
    approvedDate: '2026-03-01',
    expiryDate:   '2026-09-30',
    status:       'active',
    reviewDate:   '2026-07-15',
  },
  {
    id:          'exc-005',
    title:       'AML Graph Neural Network deployed without full explainability',
    domainId:    'ai',
    domainName:  'AI & Emerging Technology',
    controlId:   'aml-gnn-v1',
    controlName: 'AML Transaction Network Monitor (AML-GNN-v1)',
    justification: 'Regulator examination scheduled for Q3 2026 raised explainability concern. Model currently in shadow mode alongside existing rules engine. Full deployment blocked pending XAI layer development.',
    compensatingControl: 'Existing AML rules engine remains primary detection system. GNN runs in parallel shadow mode only — no automated SAR filings generated. Weekly output reviewed by human analysts.',
    residualRisk: 'critical',
    approver:     'James Whitfield (CRO) + Legal',
    approvedDate: '2026-05-01',
    expiryDate:   '2026-08-31',
    status:       'active',
    reviewDate:   '2026-07-01',
  },
  {
    id:          'exc-006',
    title:       'Cloud storage encryption key rotation — 180-day cycle vs 90-day policy',
    domainId:    'cloud',
    domainName:  'Cloud Security',
    controlId:   'c-cloud-kms',
    controlName: 'KMS Encryption Key Rotation',
    justification: 'AWS KMS key rotation for 3 legacy S3 buckets set to 180 days due to application dependency on key ARNs. Migration to AWS-managed keys requires application change freeze window.',
    compensatingControl: 'Monitoring alert configured for any key usage anomaly. Customer data not stored in affected buckets (internal analytics only). Migration scheduled for Q3 2026 maintenance window.',
    residualRisk: 'low',
    approver:     'Marcus Webb (CISO)',
    approvedDate: '2026-04-01',
    expiryDate:   '2026-09-30',
    status:       'active',
    reviewDate:   '2026-07-01',
  },
];

// ─── Escalation Matrix ──────────────────────────────────────────────────────

export const ESCALATION_RULES: EscalationRule[] = [
  {
    tier:        'risk-owner',
    label:       'Risk Owner',
    triggers:    ['Low or medium residual risk identified', 'Control attestation gap < 30 days overdue', 'KRI at-risk (not breach)', 'Issue opened'],
    notifyRoles: ['Domain Risk Owner', 'IT Operations Manager'],
    sla:         '5 business days',
    channel:     'ServiceNow task + email',
  },
  {
    tier:        'ciso',
    label:       'CISO',
    triggers:    ['High residual risk with no active mitigation plan', 'KRI breach', 'Control attestation gap > 30 days', 'Exception pending approval', 'Incident Severity 2+'],
    notifyRoles: ['CISO', 'Domain Risk Owner', 'Head of Compliance'],
    sla:         '24 hours',
    channel:     'ServiceNow escalation + direct notification',
  },
  {
    tier:        'cro',
    label:       'CRO',
    triggers:    ['Critical residual risk', 'Risk appetite threshold breached', 'Regulatory inquiry received', 'Exception for critical control', 'Incident Severity 1'],
    notifyRoles: ['CRO', 'CISO', 'General Counsel', 'Head of Compliance'],
    sla:         '4 hours',
    channel:     'Direct call + executive dashboard alert',
  },
  {
    tier:        'board',
    label:       'Board Audit & Risk Committee',
    triggers:    ['Multiple critical risks with no approved remediation', 'Regulatory enforcement action', 'Material data breach (GDPR/DORA reportable)', 'Systemic control failure across domains', 'Audit finding rated Unsatisfactory'],
    notifyRoles: ['Board Audit & Risk Committee Chair', 'CEO', 'CRO', 'CISO', 'External Auditors'],
    sla:         '2 hours (emergency) / Next scheduled meeting',
    channel:     'Board secretary notification + emergency session if required',
  },
];

// ─── Governance Committees ──────────────────────────────────────────────────

export const COMMITTEES: GovernanceCommittee[] = [
  {
    id:          'crc',
    name:        'Cyber Risk Committee',
    shortName:   'CRC',
    chair:       'Marcus Webb (CISO)',
    members:     ['David Chen (IT Ops)', 'Sophie Brennan (Compliance)', 'Dr. Amir Hassan (CISO Office)', 'Rachel Torres (Financial Crime)', 'Leon Park (Digital)'],
    frequency:   'monthly',
    remit:       'Operational oversight of cyber risk posture, control effectiveness, KRI monitoring, and issue triage across all cyber domains.',
    lastMeeting: '2026-06-05',
    nextMeeting: '2026-07-03',
    openActions: 7,
  },
  {
    id:          'trc',
    name:        'Technology Risk Committee',
    shortName:   'TRC',
    chair:       'James Whitfield (CRO)',
    members:     ['Marcus Webb (CISO)', 'Claire Nakamura (Digital Banking)', 'Dr. Priya Mehta (Data Science)', 'Legal Counsel', 'Internal Audit'],
    frequency:   'quarterly',
    remit:       'Strategic review of technology and cyber risk appetite, exception approvals above CISO authority, AI governance oversight, and regulatory engagement on cyber matters.',
    lastMeeting: '2026-04-10',
    nextMeeting: '2026-07-10',
    openActions: 4,
  },
  {
    id:          'barc',
    name:        'Board Audit & Risk Committee',
    shortName:   'BARC',
    chair:       'Non-Executive Director (Cybersecurity)',
    members:     ['CEO', 'CRO', 'CISO', 'CFO', 'External Auditor', 'Regulatory Affairs'],
    frequency:   'quarterly',
    remit:       'Board-level oversight of enterprise risk appetite, material cyber risk reporting, regulatory compliance status, and approval of risk appetite statements.',
    lastMeeting: '2026-04-28',
    nextMeeting: '2026-07-28',
    openActions: 2,
  },
];

// ─── Decision Log ───────────────────────────────────────────────────────────

export const DECISIONS: GovernanceDecision[] = [
  {
    id: 'dec-001', date: '2026-06-05', committee: 'CRC',
    title: 'Approve 90-day remediation plan for Prompt Injection finding in Customer Chatbot',
    outcome: 'approved', closed: false,
    owner: 'Leon Park', dueDate: '2026-09-05',
    rationale: 'CRC reviewed pen test findings. Plan accepted with condition: interim output validation filter deployed within 14 days. Full remediation by Sep 2026.',
  },
  {
    id: 'dec-002', date: '2026-06-05', committee: 'CRC',
    title: 'Escalate AML-GNN explainability gap to TRC for exception decision',
    outcome: 'approved', closed: true,
    owner: 'James Whitfield',
    rationale: 'CRC agreed GNN deployment cannot proceed without regulator-grade explainability. Escalated to TRC with recommendation to maintain shadow mode until XAI layer complete.',
  },
  {
    id: 'dec-003', date: '2026-04-10', committee: 'TRC',
    title: 'Approve AML-GNN shadow mode exception — 4-month window',
    outcome: 'approved', closed: false,
    owner: 'Dr. Priya Mehta', dueDate: '2026-08-31',
    rationale: 'TRC approved exception with conditions: GNN runs in shadow mode only, no automated filings, weekly analyst review. Exception reviewed at July TRC.',
  },
  {
    id: 'dec-004', date: '2026-04-10', committee: 'TRC',
    title: 'Reject request to deploy Employee AI Copilot to all staff',
    outcome: 'rejected', closed: true,
    owner: 'Marcus Webb',
    rationale: 'TRC assessed indirect prompt injection and data leakage risks as too high for unrestricted deployment. Pilot limited to 150 approved users in IT and Risk. Full rollout deferred to Q4 2026 pending security hardening.',
  },
  {
    id: 'dec-005', date: '2026-04-28', committee: 'BARC',
    title: 'Note cyber risk appetite breach — Critical and High thresholds exceeded',
    outcome: 'noted', closed: false,
    owner: 'Marcus Webb', dueDate: '2026-07-28',
    rationale: 'BARC noted appetite breach in Critical (0 tolerance, 3 active) and High (5 tolerance, 9 active) tiers. CISO to present remediation trajectory at next BARC. Board endorsed CISO investment request for FY2027 cyber uplift programme.',
  },
  {
    id: 'dec-006', date: '2026-01-15', committee: 'BARC',
    title: 'Endorse FY2026 Cyber Risk Appetite Statement',
    outcome: 'approved', closed: true,
    owner: 'James Whitfield',
    rationale: 'BARC formally endorsed the Cyber Risk Appetite Statement. Key change from prior year: zero tolerance for critical residual risks without approved remediation plan within 30 days.',
  },
];

// ─── Policy Register ────────────────────────────────────────────────────────

export const POLICIES: PolicyRecord[] = [
  { id: 'pol-001', name: 'Cyber Security Policy',                   version: '4.2', owner: 'Marcus Webb',    domains: ['iam','endpoint','network'], status: 'current',       lastReviewed: '2026-01-15', nextReview: '2027-01-15', regulatoryRef: ['ISO 27001 A.5', 'NIST CSF'] },
  { id: 'pol-002', name: 'Access Control & Identity Management Policy', version: '3.1', owner: 'David Chen', domains: ['iam'],                      status: 'current',       lastReviewed: '2026-02-01', nextReview: '2027-02-01', regulatoryRef: ['ISO 27001 A.9', 'PCI DSS 7'] },
  { id: 'pol-003', name: 'Data Classification & Protection Policy',  version: '2.8', owner: 'Sophie Brennan', domains: ['data','cloud'],            status: 'current',       lastReviewed: '2026-01-20', nextReview: '2027-01-20', regulatoryRef: ['GDPR Art. 32', 'ISO 27001 A.8'] },
  { id: 'pol-004', name: 'Third-Party & Supplier Risk Policy',       version: '2.3', owner: 'Maria Santos',   domains: ['vendor'],                  status: 'under-review',  lastReviewed: '2025-06-01', nextReview: '2026-06-01', regulatoryRef: ['DORA Art. 28', 'ISO 27001 A.15'] },
  { id: 'pol-005', name: 'Cloud Security Policy',                    version: '1.9', owner: 'Leon Park',      domains: ['cloud'],                   status: 'current',       lastReviewed: '2026-03-01', nextReview: '2027-03-01', regulatoryRef: ['CSA CCM', 'ISO 27001 A.17'] },
  { id: 'pol-006', name: 'AI & Emerging Technology Governance Policy', version: '1.0', owner: 'Marcus Webb',  domains: ['ai'],                      status: 'under-review',  lastReviewed: '2026-02-15', nextReview: '2026-08-15', regulatoryRef: ['EU AI Act', 'NIST AI RMF'] },
  { id: 'pol-007', name: 'Vulnerability & Patch Management Policy',  version: '3.5', owner: 'David Chen',     domains: ['endpoint','network'],      status: 'overdue',       lastReviewed: '2024-12-01', nextReview: '2025-12-01', regulatoryRef: ['PCI DSS 6.3', 'NIST CSF PR.IP'] },
  { id: 'pol-008', name: 'Security Incident Response Policy',        version: '3.0', owner: 'Marcus Webb',    domains: ['endpoint','network'],      status: 'current',       lastReviewed: '2026-01-10', nextReview: '2027-01-10', regulatoryRef: ['DORA Art. 18', 'ISO 27001 A.16'] },
  { id: 'pol-009', name: 'Secure Development Lifecycle (SDLC) Policy', version: '2.1', owner: 'Leon Park',   domains: ['appsec'],                  status: 'current',       lastReviewed: '2026-02-20', nextReview: '2027-02-20', regulatoryRef: ['OWASP SAMM', 'ISO 27001 A.14'] },
  { id: 'pol-010', name: 'Security Awareness & Training Policy',     version: '2.0', owner: 'Maria Santos',   domains: ['training'],               status: 'draft',         lastReviewed: '2025-09-01', nextReview: '2026-09-01', regulatoryRef: ['ISO 27001 A.7', 'NIST CSF PR.AT'] },
];
