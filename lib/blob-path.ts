/**
 * Generates a smooth closed SVG path ("blob") through N points placed
 * around a circle, each nudged in/out by a radius multiplier — used to
 * morph a circle into an organic, planet-like distorted shape.
 */
export function blobPath(cx: number, cy: number, baseRadius: number, radii: number[]): string {
  const n = radii.length;
  const points = radii.map((r, i) => {
    const angle = (i / n) * Math.PI * 2 - Math.PI / 2;
    const radius = baseRadius * r;
    return { x: cx + Math.cos(angle) * radius, y: cy + Math.sin(angle) * radius };
  });

  const smoothing = 0.62;
  const controlPoint = (
    current: { x: number; y: number },
    previous: { x: number; y: number },
    next: { x: number; y: number },
    reverse?: boolean,
  ) => {
    const p = previous ?? current;
    const n2 = next ?? current;
    const lengthX = n2.x - p.x;
    const lengthY = n2.y - p.y;
    const angle = Math.atan2(lengthY, lengthX) + (reverse ? Math.PI : 0);
    const length = Math.sqrt(lengthX ** 2 + lengthY ** 2) * smoothing;
    return {
      x: current.x + Math.cos(angle) * length,
      y: current.y + Math.sin(angle) * length,
    };
  };

  // Fixed precision keeps the string identical between server and client
  // renders — raw floats can differ in their last digit between JS engines
  // for the same trig input, which otherwise trips a hydration mismatch.
  const fmt = (value: number) => value.toFixed(2);

  let d = `M ${fmt(points[0].x)},${fmt(points[0].y)} `;
  for (let i = 0; i < n; i++) {
    const current = points[i];
    const next = points[(i + 1) % n];
    const prevPrev = points[(i - 1 + n) % n];
    const nextNext = points[(i + 2) % n];
    const cp1 = controlPoint(current, prevPrev, next);
    const cp2 = controlPoint(next, current, nextNext, true);
    d += `C ${fmt(cp1.x)},${fmt(cp1.y)} ${fmt(cp2.x)},${fmt(cp2.y)} ${fmt(next.x)},${fmt(next.y)} `;
  }
  return `${d}Z`;
}
