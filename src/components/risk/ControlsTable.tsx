import { CheckCircle2, AlertCircle, XCircle, Activity } from 'lucide-react';
import type { Control } from '../../models';

interface Props {
  controls: Control[];
}

function StatusIcon({ status }: { status: Control['status'] }) {
  if (status === 'implemented')     return <CheckCircle2 size={14} color="var(--low)" />;
  if (status === 'partial')         return <AlertCircle  size={14} color="var(--medium)" />;
  if (status === 'not-implemented') return <XCircle      size={14} color="var(--critical)" />;
  return <Activity size={14} color="var(--text-3)" />;
}

function EffBar({ score }: { score: number }) {
  const color = score >= 75 ? 'var(--low)' : score >= 40 ? 'var(--medium)' : 'var(--critical)';
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 100 }}>
      <div style={{ flex: 1, height: 5, background: 'rgba(255,255,255,0.05)', borderRadius: 3 }}>
        <div style={{ width: `${score}%`, height: '100%', background: color, borderRadius: 3 }} />
      </div>
      <span style={{ fontSize: 11, fontFamily: 'JetBrains Mono', color }}>{score}%</span>
    </div>
  );
}

export default function ControlsTable({ controls }: Props) {
  return (
    <div className="controls-table-wrap">
      <div className="controls-table-header">
        <div className="panel-title">Controls ({controls.length})</div>
      </div>
      <div style={{ overflowX: 'auto' }}>
        <table>
          <thead>
            <tr>
              <th>Status</th>
              <th>Control Name</th>
              <th>Type</th>
              <th>Effectiveness</th>
              <th>Automation</th>
              <th>Frequency</th>
              <th>Owner</th>
              <th>Last Attested</th>
              <th>Next Attestation</th>
              <th>Framework</th>
            </tr>
          </thead>
          <tbody>
            {controls.map(c => (
              <tr key={c.id}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <StatusIcon status={c.status} />
                    <span style={{ fontSize: 11, color: 'var(--text-2)', textTransform: 'capitalize' }}>
                      {c.status.replace('-', ' ')}
                    </span>
                  </div>
                </td>
                <td>
                  <div style={{ fontSize: 13, color: 'var(--text-1)', fontWeight: 500 }}>{c.name}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 2 }}>{c.description}</div>
                </td>
                <td>
                  <span className={`control-type-badge ${c.type}`}>{c.type}</span>
                </td>
                <td><EffBar score={c.effectiveness} /></td>
                <td>
                  <span style={{ fontSize: 11, color: 'var(--text-2)', textTransform: 'capitalize' }}>
                    {c.automationLevel.replace('-', ' ')}
                  </span>
                </td>
                <td>
                  <span style={{ fontSize: 11, color: 'var(--text-2)', textTransform: 'capitalize' }}>
                    {c.frequency.replace('-', ' ')}
                  </span>
                </td>
                <td style={{ fontSize: 11, color: 'var(--text-2)' }}>{c.owner}</td>
                <td style={{ fontSize: 11, color: 'var(--text-3)' }}>
                  {new Date(c.lastAttested).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </td>
                <td style={{ fontSize: 11, color: 'var(--text-3)' }}>
                  {new Date(c.nextAttestation).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </td>
                <td>
                  {c.framework ? (
                    <span style={{ fontSize: 10, color: 'var(--cyan)', background: 'var(--cyan-10)', padding: '2px 7px', borderRadius: 4, fontFamily: 'JetBrains Mono' }}>
                      {c.framework}
                    </span>
                  ) : <span style={{ color: 'var(--text-3)', fontSize: 11 }}>—</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
