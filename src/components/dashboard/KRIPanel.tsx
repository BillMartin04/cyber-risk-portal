import { AlertCircle } from 'lucide-react';
import type { KRIWithDomain } from '../../models';

interface Props {
  kris: KRIWithDomain[];
}

export default function KRIPanel({ kris }: Props) {
  return (
    <div className="panel">
      <div className="panel-header">
        <div className="panel-title">
          <AlertCircle size={14} color="var(--medium)" />
          KRI Breach Summary
        </div>
        <span
          className="panel-count"
          style={{
            background: 'var(--medium-10)',
            color: 'var(--medium)',
            borderColor: 'rgba(255,193,7,0.2)',
          }}
        >
          {kris.length}
        </span>
      </div>

      <div className="panel-body">
        {kris.map(kri => {
          const pct = Math.min((kri.value / (kri.threshold * 3)) * 100, 100);
          const color = kri.status === 'breach' ? 'var(--critical)' : 'var(--medium)';
          return (
            <div key={kri.id} className="kri-row">
              <div className="kri-header">
                <div className="kri-name">{kri.name}</div>
                <div className="kri-values">
                  <span className={`kri-val ${kri.status}`}>
                    {kri.value}{kri.unit}
                  </span>
                  <span className="kri-threshold">/ {kri.threshold}{kri.unit}</span>
                </div>
              </div>
              <div className="kri-bar-track">
                <div className="kri-bar-fill" style={{ width: `${pct}%`, background: color }} />
              </div>
              <div className="kri-domain" style={{ color: kri.domainColor }}>
                {kri.domainName}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
