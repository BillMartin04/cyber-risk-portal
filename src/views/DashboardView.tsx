import { useDashboard } from '../controllers/useDashboard';
import PostureBanner from '../components/dashboard/PostureBanner';
import DomainCard from '../components/dashboard/DomainCard';
import ActionItemPanel from '../components/dashboard/ActionItemPanel';
import KRIPanel from '../components/dashboard/KRIPanel';
import ControlStatusPanel from '../components/dashboard/ControlStatusPanel';

export default function DashboardView() {
  const { domains, stats, topKRIs, actionItems } = useDashboard();

  return (
    <div className="dashboard-view">
      <PostureBanner stats={stats} domainCount={domains.length} />

      <div className="dashboard-main">
        <div className="domain-grid-section">
          <div className="section-title">Risk Domains ({domains.length})</div>
          <div className="domain-grid">
            {domains.map(d => <DomainCard key={d.id} domain={d} />)}
          </div>
        </div>

        <div className="dashboard-sidebar">
          <KRIPanel kris={topKRIs} />
          <ActionItemPanel items={actionItems} />
          <ControlStatusPanel stats={stats} />
        </div>
      </div>
    </div>
  );
}
