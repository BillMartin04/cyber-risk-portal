import type {
  Identity, IdentityType, IdentityRole, IdentityStatus,
  IdentityStats, AccessReviewItem, DomainPermission, AccessLevel,
} from '../models';

export interface IIdentityRepository {
  findAll(): Identity[];
  findById(id: string): Identity | undefined;
  findByType(type: IdentityType): Identity[];
  findByRole(role: IdentityRole): Identity[];
  findByStatus(status: IdentityStatus): Identity[];
  findPrivileged(): Identity[];
  findReviewOverdue(): Identity[];
  getStats(): IdentityStats;
  getAccessReviewQueue(): AccessReviewItem[];
}

const DOMAIN_PERMS = (overrides: Partial<Record<string, AccessLevel>> = {}): DomainPermission[] => {
  const domains = [
    { domainId: 'cyber-data',     domainName: 'Data & Privacy' },
    { domainId: 'cyber-access',   domainName: 'Access & Identity' },
    { domainId: 'cyber-network',  domainName: 'Network & Cloud' },
    { domainId: 'cyber-supply',   domainName: 'Supply Chain' },
    { domainId: 'cyber-incident', domainName: 'Incident Response' },
    { domainId: 'cyber-ai',       domainName: 'AI Governance' },
    { domainId: 'cyber-resil',    domainName: 'Resilience' },
    { domainId: 'cyber-compliance', domainName: 'Compliance' },
  ];
  return domains.map(d => ({
    ...d,
    access: (overrides[d.domainId] ?? 'none') as AccessLevel,
  }));
};

const IDENTITIES: Identity[] = [
  // ── Humans ──────────────────────────────────────────────────────────────
  {
    id: 'id-001', displayName: 'Alexandra Chen', email: 'a.chen@org.internal',
    department: 'Information Security', type: 'human', role: 'ciso', status: 'active',
    accessLevel: 'full', privileged: true, mfaEnabled: true, riskScore: 12,
    lastLogin: '2026-07-05T08:14:00Z', createdAt: '2024-01-10T09:00:00Z',
    reviewedAt: '2026-04-01T00:00:00Z', nextReview: '2026-10-01T00:00:00Z',
    tags: ['executive', 'privileged', 'mfa'],
    domainPermissions: DOMAIN_PERMS({
      'cyber-data': 'full', 'cyber-access': 'full', 'cyber-network': 'full',
      'cyber-supply': 'full', 'cyber-incident': 'full', 'cyber-ai': 'full',
      'cyber-resil': 'full', 'cyber-compliance': 'full',
    }),
  },
  {
    id: 'id-002', displayName: 'Marcus Williams', email: 'm.williams@org.internal',
    department: 'Cyber Risk', type: 'human', role: 'analyst', status: 'active',
    accessLevel: 'read-write', privileged: false, mfaEnabled: true, riskScore: 18,
    lastLogin: '2026-07-04T16:45:00Z', createdAt: '2024-06-15T09:00:00Z',
    reviewedAt: '2026-01-15T00:00:00Z', nextReview: '2026-07-15T00:00:00Z',
    tags: ['analyst', 'mfa'],
    domainPermissions: DOMAIN_PERMS({
      'cyber-data': 'read-write', 'cyber-access': 'read-only', 'cyber-network': 'read-write',
      'cyber-supply': 'read-only', 'cyber-incident': 'read-write', 'cyber-ai': 'read-only',
      'cyber-resil': 'read-write', 'cyber-compliance': 'read-only',
    }),
  },
  {
    id: 'id-003', displayName: 'Priya Sharma', email: 'p.sharma@org.internal',
    department: 'Technology Risk', type: 'human', role: 'risk-owner', status: 'active',
    accessLevel: 'read-write', privileged: false, mfaEnabled: false, riskScore: 54,
    lastLogin: '2026-06-28T11:00:00Z', createdAt: '2023-11-01T09:00:00Z',
    reviewedAt: '2025-11-01T00:00:00Z', nextReview: '2026-05-01T00:00:00Z',
    tags: ['mfa-overdue', 'review-overdue'],
    domainPermissions: DOMAIN_PERMS({
      'cyber-data': 'read-write', 'cyber-access': 'none', 'cyber-network': 'read-write',
      'cyber-supply': 'read-write', 'cyber-incident': 'read-only', 'cyber-ai': 'read-write',
      'cyber-resil': 'none', 'cyber-compliance': 'read-write',
    }),
  },
  {
    id: 'id-004', displayName: 'James Okafor', email: 'j.okafor@org.internal',
    department: 'Internal Audit', type: 'human', role: 'auditor', status: 'active',
    accessLevel: 'read-only', privileged: false, mfaEnabled: true, riskScore: 8,
    lastLogin: '2026-07-03T14:20:00Z', createdAt: '2025-02-01T09:00:00Z',
    reviewedAt: '2026-02-01T00:00:00Z', nextReview: '2026-08-01T00:00:00Z',
    tags: ['auditor', 'mfa', 'read-only'],
    domainPermissions: DOMAIN_PERMS({
      'cyber-data': 'read-only', 'cyber-access': 'read-only', 'cyber-network': 'read-only',
      'cyber-supply': 'read-only', 'cyber-incident': 'read-only', 'cyber-ai': 'read-only',
      'cyber-resil': 'read-only', 'cyber-compliance': 'read-only',
    }),
  },
  {
    id: 'id-005', displayName: 'Elena Voronova', email: 'e.voronova@org.internal',
    department: 'Board', type: 'human', role: 'board', status: 'active',
    accessLevel: 'read-only', privileged: false, mfaEnabled: true, riskScore: 5,
    lastLogin: '2026-06-15T10:00:00Z', createdAt: '2024-03-01T09:00:00Z',
    reviewedAt: '2026-03-01T00:00:00Z', nextReview: '2026-09-01T00:00:00Z',
    tags: ['board', 'mfa', 'executive'],
    domainPermissions: DOMAIN_PERMS({
      'cyber-data': 'read-only', 'cyber-access': 'none', 'cyber-network': 'none',
      'cyber-supply': 'read-only', 'cyber-incident': 'read-only', 'cyber-ai': 'read-only',
      'cyber-resil': 'read-only', 'cyber-compliance': 'read-only',
    }),
  },
  {
    id: 'id-006', displayName: 'David Tan', email: 'd.tan@org.internal',
    department: 'IT Operations', type: 'human', role: 'admin', status: 'active',
    accessLevel: 'full', privileged: true, mfaEnabled: true, riskScore: 38,
    lastLogin: '2026-07-05T07:30:00Z', createdAt: '2023-06-01T09:00:00Z',
    reviewedAt: '2026-01-01T00:00:00Z', nextReview: '2026-07-01T00:00:00Z',
    tags: ['privileged', 'admin', 'mfa', 'review-overdue'],
    domainPermissions: DOMAIN_PERMS({
      'cyber-data': 'full', 'cyber-access': 'full', 'cyber-network': 'full',
      'cyber-supply': 'read-write', 'cyber-incident': 'full', 'cyber-ai': 'read-only',
      'cyber-resil': 'full', 'cyber-compliance': 'read-only',
    }),
  },
  {
    id: 'id-007', displayName: 'Fatima Al-Rashidi', email: 'f.rashidi@org.internal',
    department: 'Compliance', type: 'human', role: 'analyst', status: 'suspended',
    accessLevel: 'restricted', privileged: false, mfaEnabled: false, riskScore: 71,
    lastLogin: '2026-05-10T09:00:00Z', createdAt: '2024-09-01T09:00:00Z',
    reviewedAt: '2025-09-01T00:00:00Z', nextReview: '2026-01-01T00:00:00Z',
    tags: ['suspended', 'mfa-overdue', 'review-overdue', 'high-risk'],
    domainPermissions: DOMAIN_PERMS({
      'cyber-compliance': 'restricted',
    }),
  },

  // ── Service accounts ─────────────────────────────────────────────────────
  {
    id: 'id-101', displayName: 'svc-siem-ingestor', email: 'svc-siem@svc.internal',
    department: 'Security Operations', type: 'service-account', role: 'analyst', status: 'active',
    accessLevel: 'read-write', privileged: true, mfaEnabled: false, riskScore: 42,
    lastLogin: '2026-07-05T12:00:00Z', createdAt: '2024-01-01T00:00:00Z',
    reviewedAt: '2026-01-01T00:00:00Z', nextReview: '2026-07-01T00:00:00Z',
    expiresAt: '2026-12-31T00:00:00Z',
    tags: ['service', 'privileged', 'review-overdue'],
    domainPermissions: DOMAIN_PERMS({
      'cyber-incident': 'read-write', 'cyber-network': 'read-only',
    }),
  },
  {
    id: 'id-102', displayName: 'svc-evidence-collector', email: 'svc-evidence@svc.internal',
    department: 'Risk Technology', type: 'service-account', role: 'analyst', status: 'active',
    accessLevel: 'read-write', privileged: false, mfaEnabled: false, riskScore: 22,
    lastLogin: '2026-07-05T11:58:00Z', createdAt: '2025-03-01T00:00:00Z',
    reviewedAt: '2026-03-01T00:00:00Z', nextReview: '2026-09-01T00:00:00Z',
    expiresAt: '2026-09-30T00:00:00Z',
    tags: ['service'],
    domainPermissions: DOMAIN_PERMS({
      'cyber-data': 'read-only', 'cyber-compliance': 'read-write',
    }),
  },

  // ── Machine identities ───────────────────────────────────────────────────
  {
    id: 'id-201', displayName: 'k8s-node-01-prod', email: 'k8s-node01@machine.internal',
    department: 'Cloud Infrastructure', type: 'machine', role: 'viewer', status: 'active',
    accessLevel: 'restricted', privileged: false, mfaEnabled: false, riskScore: 31,
    lastLogin: '2026-07-05T12:01:00Z', createdAt: '2025-01-15T00:00:00Z',
    reviewedAt: '2026-01-15T00:00:00Z', nextReview: '2026-07-15T00:00:00Z',
    expiresAt: '2026-12-31T00:00:00Z',
    tags: ['machine', 'kubernetes'],
    domainPermissions: DOMAIN_PERMS({ 'cyber-network': 'restricted' }),
  },

  // ── Third-party ──────────────────────────────────────────────────────────
  {
    id: 'id-301', displayName: 'Vendor: SecureAudit Ltd', email: 'audit@secureaudit-vendor.com',
    department: 'External', type: 'third-party', role: 'auditor', status: 'active',
    accessLevel: 'read-only', privileged: false, mfaEnabled: true, riskScore: 28,
    lastLogin: '2026-06-20T10:00:00Z', createdAt: '2026-01-01T00:00:00Z',
    reviewedAt: '2026-01-01T00:00:00Z', nextReview: '2026-07-01T00:00:00Z',
    expiresAt: '2026-07-31T00:00:00Z',
    tags: ['third-party', 'vendor', 'mfa', 'review-overdue'],
    domainPermissions: DOMAIN_PERMS({
      'cyber-compliance': 'read-only', 'cyber-data': 'read-only',
    }),
  },

  // ── API keys ─────────────────────────────────────────────────────────────
  {
    id: 'id-401', displayName: 'api-risk-portal-prod', email: 'api-risk-portal@api.internal',
    department: 'Risk Technology', type: 'api-key', role: 'analyst', status: 'active',
    accessLevel: 'read-write', privileged: false, mfaEnabled: false, riskScore: 19,
    lastLogin: '2026-07-05T12:00:00Z', createdAt: '2025-06-01T00:00:00Z',
    reviewedAt: '2026-06-01T00:00:00Z', nextReview: '2026-12-01T00:00:00Z',
    expiresAt: '2026-12-31T00:00:00Z',
    tags: ['api-key'],
    domainPermissions: DOMAIN_PERMS({
      'cyber-data': 'read-write', 'cyber-resil': 'read-only',
    }),
  },
];

function computeStats(identities: Identity[]): IdentityStats {
  const now = new Date();
  const mfaEnabled = identities.filter(i => i.mfaEnabled).length;
  const humans = identities.filter(i => i.type === 'human');
  const byType = {} as Record<IdentityType, number>;
  const byRole = {} as Record<IdentityRole, number>;
  for (const id of identities) {
    byType[id.type] = (byType[id.type] ?? 0) + 1;
    byRole[id.role] = (byRole[id.role] ?? 0) + 1;
  }
  return {
    total:        identities.length,
    active:       identities.filter(i => i.status === 'active').length,
    suspended:    identities.filter(i => i.status === 'suspended').length,
    pending:      identities.filter(i => i.status === 'pending').length,
    privileged:   identities.filter(i => i.privileged).length,
    mfaEnabled,
    mfaCoverage:  Math.round((mfaEnabled / humans.length) * 100),
    reviewOverdue: identities.filter(i => new Date(i.nextReview) < now).length,
    highRisk:     identities.filter(i => i.riskScore >= 50).length,
    byType,
    byRole,
  };
}

function buildAccessReview(identities: Identity[]): AccessReviewItem[] {
  const now = new Date();
  const overdue = identities.filter(i => new Date(i.nextReview) < now);
  return overdue.flatMap(id =>
    id.domainPermissions
      .filter(dp => dp.access !== 'none' && dp.access !== 'restricted')
      .slice(0, 2)
      .map(dp => ({
        identityId:    id.id,
        displayName:   id.displayName,
        email:         id.email,
        domainId:      dp.domainId,
        domainName:    dp.domainName,
        currentAccess: dp.access,
        lastUsed:      id.lastLogin,
        recommended:   'read-only' as AccessLevel,
        reason:        id.mfaEnabled ? 'Access review overdue — downgrade pending attestation' : 'MFA not enabled — restrict until remediated',
      }))
  );
}

class IdentityRepositoryImpl implements IIdentityRepository {
  private readonly store: Identity[] = IDENTITIES;

  findAll()                              { return this.store; }
  findById(id: string)                   { return this.store.find(i => i.id === id); }
  findByType(type: IdentityType)         { return this.store.filter(i => i.type === type); }
  findByRole(role: IdentityRole)         { return this.store.filter(i => i.role === role); }
  findByStatus(status: IdentityStatus)   { return this.store.filter(i => i.status === status); }
  findPrivileged()                       { return this.store.filter(i => i.privileged); }
  findReviewOverdue()                    {
    const now = new Date();
    return this.store.filter(i => new Date(i.nextReview) < now);
  }
  getStats()                             { return computeStats(this.store); }
  getAccessReviewQueue()                 { return buildAccessReview(this.store); }
}

export const identityRepository: IIdentityRepository = new IdentityRepositoryImpl();
