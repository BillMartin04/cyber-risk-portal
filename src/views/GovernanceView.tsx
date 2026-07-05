import { useGovernance } from '../controllers/useGovernance';
import GovernanceBanner from '../components/governance/GovernanceBanner';
import RiskAppetitePanel from '../components/governance/RiskAppetitePanel';
import ExceptionRegister from '../components/governance/ExceptionRegister';
import EscalationMatrix from '../components/governance/EscalationMatrix';
import DecisionLog from '../components/governance/DecisionLog';
import PolicyRegister from '../components/governance/PolicyRegister';

export default function GovernanceView() {
  const {
    appetite, activeExceptions, escalationRules,
    committees, allDecisions, policies, stats,
  } = useGovernance();

  return (
    <div className="governance-view">
      <GovernanceBanner stats={stats} />

      <div className="governance-body">
        <div className="governance-main">
          <RiskAppetitePanel appetite={appetite} />
          <ExceptionRegister exceptions={activeExceptions} />
          <DecisionLog decisions={allDecisions} committees={committees} />
          <PolicyRegister policies={policies} />
        </div>

        <div className="governance-side">
          <EscalationMatrix rules={escalationRules} />
        </div>
      </div>
    </div>
  );
}
