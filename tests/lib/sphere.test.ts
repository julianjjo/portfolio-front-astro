import { describe, expect, it } from "vitest";
import { fibonacciSphere, placement, rotate } from "../../src/lib/sphere";

const length = ([x, y, z]: number[]) => Math.hypot(x, y, z);

describe("fibonacciSphere", () => {
  it("returns n distinct points on the unit sphere", () => {
    const points = fibonacciSphere(17);
    expect(points).toHaveLength(17);
    for (const p of points) expect(length(p)).toBeCloseTo(1, 10);
    expect(new Set(points.map((p) => p.join())).size).toBe(17);
  });
});

describe("rotate (CSS rotateX(a) rotateY(b) convention)", () => {
  it("turns the front point right for a positive spin", () => {
    const [x, y, z] = rotate([0, 0, 1], 0, Math.PI / 2);
    expect(x).toBeCloseTo(1);
    expect(y).toBeCloseTo(0);
    expect(z).toBeCloseTo(0);
  });

  it("tilts the front point up (y is down) for a positive tilt", () => {
    const [x, y, z] = rotate([0, 0, 1], Math.PI / 2, 0);
    expect(x).toBeCloseTo(0);
    expect(y).toBeCloseTo(-1);
    expect(z).toBeCloseTo(0);
  });

  it("applies the spin before the tilt, like the CSS transform list", () => {
    // Spin front -> right, then tilting about x leaves it on the x axis.
    const [x, y, z] = rotate([0, 0, 1], Math.PI / 2, Math.PI / 2);
    expect(x).toBeCloseTo(1);
    expect(y).toBeCloseTo(0);
    expect(z).toBeCloseTo(0);
  });

  it("preserves length", () => {
    expect(length(rotate([0.3, -0.5, 0.81], 0.7, -2.1))).toBeCloseTo(
      length([0.3, -0.5, 0.81]),
    );
  });
});

describe("placement", () => {
  it("scales translate3d by the --r radius and fades the back half", () => {
    const front = placement([0, 0, 1]);
    const back = placement([0, 0, -1]);
    expect(front.transform).toBe(
      "translate3d(calc(var(--r) * 0.0000), calc(var(--r) * 0.0000), calc(var(--r) * 1.0000))",
    );
    expect(front.opacity).toBe("1.000");
    expect(back.opacity).toBe("0.250");
  });
});
