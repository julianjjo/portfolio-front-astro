import { readFileSync } from "node:fs";
import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { beforeAll, describe, expect, it } from "vitest";
import Canvas from "../../src/components/Canvas.astro";

// The <script> logic in Canvas.astro is never emitted verbatim by
// container.renderToString (Astro hoists/bundles module scripts), so the
// animation/accent-sync behaviour below is verified against the raw source
// instead of the rendered fragment.
const source = readFileSync(
  new URL("../../src/components/Canvas.astro", import.meta.url),
  "utf-8",
);

let container: Awaited<ReturnType<typeof AstroContainer.create>>;

beforeAll(async () => {
  container = await AstroContainer.create();
});

describe("Canvas.astro markup", () => {
  it("hides the decorative canvas from assistive technology", async () => {
    const result = await container.renderToString(Canvas);

    expect(result).toContain('id="canvas"');
    expect(result).toContain('aria-hidden="true"');
  });

  it("pins the canvas behind other content", async () => {
    const result = await container.renderToString(Canvas);

    expect(result).toMatch(/canvas#canvas\s*\{[^}]*position:\s*fixed/);
    expect(result).toMatch(/canvas#canvas\s*\{[^}]*z-index:\s*-1/);
  });
});

describe("Canvas.astro living accent + animation script", () => {
  it("starts the hue clock at brand violet (270)", () => {
    expect(source).toMatch(/const START_HUE = 270/);
    expect(source).toMatch(/let tick = START_HUE \/ opts\.hueChange/);
  });

  it("computes the current hue from the tick clock, wrapping at 360", () => {
    expect(source).toMatch(
      /function currentHue\(\): number \{\s*return reducedMotion \? START_HUE : \(tick \* opts\.hueChange\) % 360;/,
    );
  });

  it("freezes on the reduced-motion still frame instead of animating", () => {
    expect(source).toMatch(/prefers-reduced-motion:\s*reduce/);
    expect(source).toMatch(/if \(!reducedMotion\) \{\s*loop\(\);\s*\}/);
    expect(source).toMatch(
      /for \(let i = 0; i < 600; i\+\+\) \{\s*drawFrame\(\);/,
    );
  });

  it("writes the current hue onto --accent-h every 10 ticks", () => {
    expect(source).toMatch(/if \(tick % 10 === 0\) \{\s*syncAccent\(\);/);
    expect(source).toMatch(
      /root\.style\.setProperty\("--accent-h", currentHue\(\)\.toFixed\(1\)\)/,
    );
  });

  it("clamps the device pixel ratio to 2 on resize", () => {
    expect(source).toMatch(
      /Math\.min\(window\.devicePixelRatio \|\| 1, 2\)/,
    );
  });

  it("initializes immediately if the document already loaded, otherwise waits for load", () => {
    expect(source).toMatch(/document\.readyState === "complete"/);
    expect(source).toMatch(/window\.addEventListener\("load", initCanvas\)/);
  });
});