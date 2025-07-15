import { Curve } from './Curve';
import { getBezierCommand } from '@/utils/curve';

export default function PolylinePath({ pins, curveFactor = 0.2 }) {
  if (pins.length < 2) return null;

  const sorted = [...pins].sort((a, b) => new Date(a.date) - new Date(b.date));

  return (
    <>
      {sorted.slice(0, -1).map((p0, i) => {
        const p1   = sorted[i + 1];
        const cmd  = getBezierCommand(
          [p0.latitude, p0.longitude],
          [p1.latitude, p1.longitude],
          curveFactor
        );
        return (
          <Curve
            key={i}
            positions={cmd}
            pathOptions={{ color: '#4d5659', weight: 2 }}
            pane="polylinePane"
          />
        );
      })}
    </>
  );
}
