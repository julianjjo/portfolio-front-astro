import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const source = readFileSync(
  new URL("../../src/pages/index.astro", import.meta.url),
  "utf-8",
);

describe("index.astro hero markup", () => {
  it("replaces the generic About Me heading with the person's name and a role eyebrow", () => {
    expect(source).not.toContain("About Me");
    expect(source).not.toContain('id="animatedTitle"');
    expect(source).toContain("Julian Mican");
    expect(source).toContain(
      '<p class="eyebrow mb-5">Backend &amp; Full Stack Developer</p>',
    );
  });

  it("drops the italic styling from the typing-effect intro container", () => {
    expect(source).not.toContain("text-center italic");
  });

  it("uses the shared eyebrow utility for the expertise section headings instead of hardcoded colors", () => {
    expect(source).toContain('<h3 class="eyebrow">');
    expect(source).toContain('<h3 class="eyebrow eyebrow-alt">');
    expect(source).not.toContain("text-violet-400");
    expect(source).not.toContain("text-cyan-400");
  });

  it("ties every social icon's hover glow/border to the living accent", () => {
    const matches =
      source.match(
        /hover:shadow-\[0_0_20px_var\(--accent-soft\)\] hover:border-\[color:var\(--accent-soft\)\]/g,
      ) ?? [];
    expect(matches.length).toBe(3);
    expect(source).not.toContain("hover:shadow-[0_0_20px_rgba(255,255,255,0.1)]");
  });
});

describe("index.astro typing effect script", () => {
  it("shows the full bio immediately when the user prefers reduced motion", () => {
    expect(source).toMatch(
      /window\.matchMedia\("\(prefers-reduced-motion: reduce\)"\)\.matches/,
    );
    expect(source).toMatch(/if \(container\) container\.textContent = text;/);
  });

  it("otherwise starts the typewriter effect after a short delay", () => {
    expect(source).toMatch(/setTimeout\(typeText, 700\)/);
    expect(source).not.toContain("setTimeout(typeText, 1200)");
  });

  it("uses a monospace blinking cursor tied to the accent color", () => {
    expect(source).toContain('content: "▌";');
    expect(source).toContain("color: var(--accent);");
    expect(source).not.toContain('content: "|";');
  });
});