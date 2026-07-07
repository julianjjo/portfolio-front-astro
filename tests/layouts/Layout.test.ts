import { existsSync, readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

// Layout.astro renders Navbar (which uses astro:assets), so it is verified
// against the raw source instead of through container rendering, which
// would otherwise require a real image transform pipeline.
const source = readFileSync(
  new URL("../../src/layouts/Layout.astro", import.meta.url),
  "utf-8",
);

describe("Layout.astro living accent tokens", () => {
  it("derives every accent color from a single --accent-h hue variable", () => {
    expect(source).toContain("--accent-h: 270;");
    expect(source).toContain("--accent: hsl(var(--accent-h) 84% 66%);");
    expect(source).toContain("--accent-deep: hsl(var(--accent-h) 84% 45%);");
    expect(source).toContain(
      "--accent-soft: hsl(var(--accent-h) 84% 66% / 0.35);",
    );
    expect(source).toContain(
      "--accent-faint: hsl(var(--accent-h) 84% 66% / 0.12);",
    );
    expect(source).toContain(
      "--accent-2: hsl(calc(var(--accent-h) - 70) 84% 62%);",
    );
  });

  it("no longer defines the old static RGB accent triplets", () => {
    expect(source).not.toMatch(/--accent:\s*136,\s*58,\s*234/);
    expect(source).not.toContain("--accent-light");
    expect(source).not.toContain("--accent-dark");
  });

  it("exposes reusable eyebrow, accent-text and accent-gradient utility classes", () => {
    expect(source).toContain(".eyebrow {");
    expect(source).toContain(".eyebrow-alt {");
    expect(source).toContain(".accent-text {");
    expect(source).toContain(".accent-gradient {");
    expect(source).toContain(".accent-gradient-deep {");
    expect(source).toContain(".plex-mono {");
  });

  it("shrinks the eyebrow tracking on small screens", () => {
    expect(source).toMatch(/@media \(max-width: 640px\) \{\s*\.eyebrow \{/);
  });

  it("styles text selection and keyboard focus with the living accent", () => {
    expect(source).toMatch(
      /::selection\s*\{\s*background: var\(--accent-soft\);/,
    );
    expect(source).toMatch(
      /:focus-visible\s*\{\s*outline: 2px solid var\(--accent\);/,
    );
  });

  it("honors prefers-reduced-motion by collapsing animation/transition durations", () => {
    expect(source).toMatch(/@media \(prefers-reduced-motion: reduce\)/);
    expect(source).toContain("animation-duration: 0.01ms !important;");
    expect(source).toContain("scroll-behavior: auto;");
  });

  it("fixes the malformed noise-texture SVG data URI entities", () => {
    expect(source).toContain(
      "%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence",
    );
    expect(source).not.toContain("%3BaseFilter");
  });

  it("switches the monospace code font to IBM Plex Mono", () => {
    expect(source).toMatch(/code\s*\{\s*font-family:\s*"IBM Plex Mono",/);
    expect(source).not.toContain("JetBrains Mono");
  });
});

describe("Layout.astro composition", () => {
  it("still wires up SEO, fonts, canvas and navbar", () => {
    expect(source).toContain("<SEO title={title} description={description} />");
    expect(source).toContain("<FontsLinks />");
    expect(source).toContain("<Canvas />");
    expect(source).toContain("<Navbar />");
  });
});

describe("LayoutTwo removal", () => {
  it("no longer exists as a duplicate layout", () => {
    const layoutTwoPath = new URL(
      "../../src/layouts/LayoutTwo.astro",
      import.meta.url,
    );
    expect(existsSync(layoutTwoPath)).toBe(false);
  });
});