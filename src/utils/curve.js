/**
 * Generate a true SVG quadratic‑bézier command array for Leaflet.curve.
 *
 * @param {[number,number]} start        – [lat, lng]
 * @param {[number,number]} end          – [lat, lng]
 * @param {number}         curveFactor  – bulge factor
 * @returns {Array}       – ['M',[lat0,lng0],'Q',[cx,cy],[lat1,lng1]]
 */
export function getBezierCommand(
  start,
  end,
  curveFactor = 0.2
) {
  const [lat0, lng0] = start;
  const [lat1, lng1] = end;

  // Midpoint
  const mx = (lat0 + lat1) / 2;
  const my = (lng0 + lng1) / 2;

  // Direction & perp vector
  const dx = lat1 - lat0;
  const dy = lng1 - lng0;
  let px = -dy, py = dx;
  const len = Math.hypot(px, py) || 1;
  px /= len; py /= len;

  // Control point
  const distance = Math.hypot(dx, dy);
  const cx = mx + px * distance * curveFactor;
  const cy = my + py * distance * curveFactor;

  return ['M', [lat0, lng0], 'Q', [cx, cy], [lat1, lng1]];
}
