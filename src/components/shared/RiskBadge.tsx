import type { RiskLevel } from '../../models';

interface Props {
  level: RiskLevel;
}

export default function RiskBadge({ level }: Props) {
  return <span className={`risk-badge ${level}`}>{level}</span>;
}
