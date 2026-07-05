import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useDomainDetail } from '../controllers/useDomainDetail';
import Breadcrumb from '../components/shared/Breadcrumb';
import DomainHeader from '../components/domain/DomainHeader';
import KRISection from '../components/domain/KRISection';
import RiskTable from '../components/domain/RiskTable';

export default function DomainDetailView() {
  const { domainId = '' } = useParams();
  const navigate = useNavigate();
  const { domain, isNotFound, openIssueCount, notImplControlCount } = useDomainDetail(domainId);

  if (isNotFound || !domain) {
    return (
      <div className="not-found">
        <div style={{ fontSize: 48 }}>🔍</div>
        <div className="not-found-title">Domain Not Found</div>
        <div className="not-found-desc">The risk domain "{domainId}" does not exist.</div>
        <button className="btn-back" onClick={() => navigate('/')}>
          <ArrowLeft size={14} /> Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="domain-detail-view">
      <Breadcrumb items={[
        { label: 'Dashboard', to: '/' },
        { label: domain.name },
      ]} />

      <DomainHeader
        domain={domain}
        openIssueCount={openIssueCount}
        notImplControlCount={notImplControlCount}
      />

      {domain.kris.length > 0 && <KRISection kris={domain.kris} />}

      <RiskTable risks={domain.risks} domainId={domain.id} />
    </div>
  );
}
