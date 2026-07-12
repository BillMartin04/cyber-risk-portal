import { Routes, Route } from 'react-router-dom';
import MasterLayout from './layouts/MasterLayout';
import DashboardView from './views/DashboardView';
import DomainDetailView from './views/DomainDetailView';
import RiskDetailView from './views/RiskDetailView';
import AIGovernanceView from './views/AIGovernanceView';
import GovernanceView from './views/GovernanceView';
import ResilienceView from './views/ResilienceView';
import EvidenceView from './views/EvidenceView';
import IdentityView from './views/IdentityView';
import WorkflowView from './views/WorkflowView';
import AIRegistryView from './views/AIRegistryView';

export default function App() {
  return (
    <Routes>
      <Route element={<MasterLayout />}>
        <Route path="/" element={<DashboardView />} />
        <Route path="/domain/:domainId" element={<DomainDetailView />} />
        <Route path="/domain/:domainId/risk/:riskId" element={<RiskDetailView />} />
        <Route path="/ai-governance" element={<AIGovernanceView />} />
        <Route path="/governance" element={<GovernanceView />} />
        <Route path="/resilience" element={<ResilienceView />} />
        <Route path="/evidence"   element={<EvidenceView />} />
        <Route path="/identities" element={<IdentityView />} />
        <Route path="/workflows"  element={<WorkflowView />} />
        <Route path="/ai-registry" element={<AIRegistryView />} />
      </Route>
    </Routes>
  );
}
