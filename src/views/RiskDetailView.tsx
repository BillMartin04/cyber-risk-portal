import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useRiskDetail } from '../controllers/useRiskDetail';
import RiskHeader from '../components/risk/RiskHeader';
import RiskRatingPanel from '../components/risk/RiskRatingPanel';
import ControlsTable from '../components/risk/ControlsTable';
import IssuesSection from '../components/risk/IssuesSection';
import EvidenceTrailPanel from '../components/evidence/EvidenceTrailPanel';

export default function RiskDetailView() {
  const { domainId = '', riskId = '' } = useParams();
  const navigate = useNavigate();
  const { domain, risk, controlStats, openIssues, isNotFound } = useRiskDetail(domainId, riskId);

  if (isNotFound || !domain || !risk) {
    return (
      <div className="not-found">
        <div style={{ fontSize: 48 }}>🔍</div>
        <div className="not-found-title">Risk Not Found</div>
        <div className="not-found-desc">The risk "{riskId}" does not exist in domain "{domainId}".</div>
        <button className="btn-back" onClick={() => navigate(`/domain/${domainId}`)}>
          <ArrowLeft size={14} /> Back to Domain
        </button>
      </div>
    );
  }

  return (
    <div className="risk-detail-view">
      <RiskHeader domain={domain} risk={risk} />

      <div className="risk-detail-body">
        <div className="risk-detail-main">
          <RiskRatingPanel risk={risk} />
          <ControlsTable controls={risk.controls} />
          <IssuesSection issues={risk.issues} />
        </div>

        <div className="risk-detail-side">
          <div className="panel">
            <div className="panel-header">
              <div className="panel-title">Control Summary</div>
            </div>
            <div className="panel-body" style={{ padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { label: 'Implemented',     count: controlStats.implemented,   color: 'var(--low)' },
                { label: 'Partial',         count: controlStats.partial,       color: 'var(--medium)' },
                { label: 'Not Implemented', count: controlStats.notImplemented, color: 'var(--critical)' },
              ].map(({ label, count, color }) => (
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                  <span style={{ color: 'var(--text-2)' }}>{label}</span>
                  <span style={{ fontFamily: 'JetBrains Mono', color, fontWeight: 700 }}>
                    {count}/{risk.controls.length}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <EvidenceTrailPanel riskId={riskId} />

          <div className="panel">
            <div className="panel-header">
              <div className="panel-title">Open Issues</div>
              <span className="panel-count" style={{ background: 'var(--critical-10)', color: 'var(--critical)' }}>
                {openIssues.length}
              </span>
            </div>
            <div className="panel-body" style={{ padding: '10px 16px', fontSize: 12, color: 'var(--text-2)' }}>
              {openIssues.length === 0
                ? <span style={{ color: 'var(--text-3)' }}>No open issues.</span>
                : openIssues.map(i => (
                    <div key={i.id} style={{ padding: '6px 0', borderBottom: '1px solid var(--border)' }}>
                      {i.title}
                    </div>
                  ))
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
