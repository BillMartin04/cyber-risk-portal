import { useAIGovernance } from '../controllers/useAIGovernance';
import AIGovernanceBanner from '../components/ai-governance/AIGovernanceBanner';
import AIInventoryTable from '../components/ai-governance/AIInventoryTable';
import NISTAIRMFPanel from '../components/ai-governance/NISTAIRMFPanel';
import OWASPThreatPanel from '../components/ai-governance/OWASPThreatPanel';
import ShadowAIPanel from '../components/ai-governance/ShadowAIPanel';

export default function AIGovernanceView() {
  const { models, owaspThreats, nistDomains, shadowIncidents, stats } = useAIGovernance();

  return (
    <div className="ai-governance-view">
      <AIGovernanceBanner stats={stats} />

      <div className="ai-body">
        <div className="ai-main">
          <AIInventoryTable models={models} />
          <OWASPThreatPanel threats={owaspThreats} />
        </div>

        <div className="ai-side">
          <NISTAIRMFPanel domains={nistDomains} />
          <ShadowAIPanel incidents={shadowIncidents} />
        </div>
      </div>
    </div>
  );
}
