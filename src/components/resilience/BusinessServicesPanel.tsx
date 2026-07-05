import { Server, DollarSign, CheckCircle2, XCircle } from 'lucide-react';
import type { BusinessService } from '../../models';

interface Props { services: BusinessService[]; }

const TIER_LABEL: Record<string, { label: string; color: string }> = {
  'tier-1': { label: 'Tier 1', color: 'var(--critical)' },
  'tier-2': { label: 'Tier 2', color: 'var(--medium)'   },
  'tier-3': { label: 'Tier 3', color: 'var(--low)'      },
};

export default function BusinessServicesPanel({ services }: Props) {
  const totalRevAtRisk = services.reduce((s, sv) => s + sv.annualRevenueAtRisk, 0);

  return (
    <div className="panel">
      <div className="panel-header">
        <div className="panel-title">
          <Server size={14} color="var(--text-2)" />
          Critical Business Services — Impact Mapping
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: 'var(--high)' }}>
          <DollarSign size={12} />
          <span style={{ fontFamily: 'JetBrains Mono', fontWeight: 700 }}>
            ${totalRevAtRisk}M
          </span>
          <span style={{ color: 'var(--text-3)' }}>annual revenue at risk</span>
        </div>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table>
          <thead>
            <tr>
              <th>Service</th>
              <th>Tier</th>
              <th>RTO</th>
              <th>RPO</th>
              <th>RTO Met</th>
              <th>Revenue at Risk</th>
              <th>Cyber Dependencies</th>
              <th>Customer Impact</th>
            </tr>
          </thead>
          <tbody>
            {services.map(svc => {
              const tier = TIER_LABEL[svc.tier];
              return (
                <tr key={svc.id}>
                  <td>
                    <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>{svc.name}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 2, lineHeight: 1.4 }}>{svc.description}</div>
                  </td>
                  <td>
                    <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 4,
                      background: `${tier.color}15`, color: tier.color, border: `1px solid ${tier.color}30` }}>
                      {tier.label}
                    </span>
                  </td>
                  <td>
                    <span style={{ fontFamily: 'JetBrains Mono', fontSize: 13, fontWeight: 700, color: 'var(--cyan)' }}>
                      {svc.rto}h
                    </span>
                  </td>
                  <td>
                    <span style={{ fontFamily: 'JetBrains Mono', fontSize: 13, fontWeight: 700, color: 'var(--text-2)' }}>
                      {svc.rpo < 1 ? `${svc.rpo * 60}m` : `${svc.rpo}h`}
                    </span>
                  </td>
                  <td>
                    {svc.rtoMet
                      ? <CheckCircle2 size={16} color="var(--low)" />
                      : <XCircle      size={16} color="var(--critical)" />}
                  </td>
                  <td>
                    <span style={{ fontFamily: 'JetBrains Mono', fontSize: 12, fontWeight: 700, color: 'var(--high)' }}>
                      ${svc.annualRevenueAtRisk}M
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                      {svc.cyberDependencies.map(d => (
                        <span key={d} style={{ fontSize: 9, padding: '1px 6px', borderRadius: 3,
                          background: 'var(--card-elevated)', color: 'var(--text-3)',
                          border: '1px solid var(--border)', textTransform: 'uppercase', fontWeight: 600 }}>
                          {d}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td style={{ fontSize: 11, color: 'var(--text-2)', maxWidth: 220, lineHeight: 1.5 }}>
                    {svc.customerImpact}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
