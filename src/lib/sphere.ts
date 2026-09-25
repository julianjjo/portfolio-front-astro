export type Vec3 = [number, number, number];

// Spreads n points evenly over a unit sphere (golden-angle spiral).
export function fibonacciSphere(n: number): Vec3[] {
  const golden = Math.PI * (3 - Math.sqrt(5));
  return Array.from({ length: n }, (_, i) => {
    const y = 1 - (2 * (i + 0.5)) / n;
    const ring = Math.sqrt(1 - y * y);
    return [Math.cos(golden * i) * ring, y, Math.sin(golden * i) * ring];
  });
}

// Same result as CSS `rotateX(a) rotateY(b)` on p (CSS axes: y down, z toward
// the viewer), so JS-placed items stay in step with CSS-rotated elements.
export function rotate([x, y, z]: Vec3, a: number, b: number): Vec3 {
  const x1 = x * Math.cos(b) + z * Math.sin(b);
  const z1 = z * Math.cos(b) - x * Math.sin(b);
  return [
    x1,
    y * Math.cos(a) - z1 * Math.sin(a),
    y * Math.sin(a) + z1 * Math.cos(a),
  ];
}

// Inline style for an item at unit-sphere point p; --r is the sphere radius.
// Items only translate, so they always face the viewer; the back fades out.
export function placement([x, y, z]: Vec3) {
  const r = (v: number) => `calc(var(--r) * ${v.toFixed(4)})`;
  return {
    transform: `translate3d(${r(x)}, ${r(y)}, ${r(z)})`,
    opacity: (0.25 + 0.375 * (z + 1)).toFixed(3),
  };
}
