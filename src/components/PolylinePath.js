import { Polyline } from 'react-leaflet';

export default function PolylinePath({ pins }) {
  const OFFSET_METERS = 10;
  const metersToLatOffset = (m) => m / 111320;
  const LAT_OFFSET = metersToLatOffset(OFFSET_METERS);

  const sortedPins = [...pins].sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );

  // Build shortened segments between pins
  const trimmedSegments = [];
  const TRIM_RATIO = 0.05;

  for (let i = 0; i < sortedPins.length - 1; i++) {
    const start = sortedPins[i];
    const end = sortedPins[i + 1];

    const latDiff = end.latitude - start.latitude;
    const lngDiff = end.longitude - start.longitude;

    const trimmedStart = [
      start.latitude + latDiff * TRIM_RATIO,
      start.longitude + lngDiff * TRIM_RATIO,
    ];
    const trimmedEnd = [
      end.latitude - latDiff * TRIM_RATIO,
      end.longitude - lngDiff * TRIM_RATIO,
    ];

    trimmedSegments.push([trimmedStart, trimmedEnd]);
  }

  if (trimmedSegments.length === 0) return null;

  return (
    <>
      {trimmedSegments.map((segment, idx) => (
        <Polyline
          key={idx}
          positions={segment}
          pathOptions={{ color: '#4d5659', weight: 2 }}
          pane="polylinePane"
        />
      ))}
    </>
  );
}
