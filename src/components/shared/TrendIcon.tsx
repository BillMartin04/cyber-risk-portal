import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import type { TrendDirection } from '../../models';

interface Props {
  trend: TrendDirection;
  size?: number;
  showLabel?: boolean;
}

export default function TrendIcon({ trend, size = 13, showLabel = false }: Props) {
  const Icon = trend === 'improving' ? TrendingUp
    : trend === 'degrading'         ? TrendingDown
    : Minus;

  return (
    <span className={`trend ${trend}`}>
      <Icon size={size} />
      {showLabel && (
        <span style={{ fontSize: size - 1, textTransform: 'capitalize' }}>{trend}</span>
      )}
    </span>
  );
}
