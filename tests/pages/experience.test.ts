import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const source = readFileSync(
  new URL("../../src/pages/experience.astro", import.meta.url),
  "utf-8",
);

describe("experience.astro", () => {
  it("introduces the page with a mono eyebrow label", () => {
    expect(source).toContain('<p class="eyebrow mb-5">Experience</p>');
  });

  it("draws the header divider with the shared accent-gradient utility and a soft accent glow", () => {
    expect(source).toContain(
      'class="h-px w-24 accent-gradient mx-auto rounded-full"',
    );
    expect(source).toContain("box-shadow: 0 0 15px var(--accent-soft);");
  });

  it("no longer hardcodes a violet-to-cyan gradient divider", () => {
    expect(source).not.toContain("from-violet-500 to-cyan-500");
    expect(source).not.toContain("bg-gradient-to-r from-violet-500");
  });

  it("still renders the ExperienceCards list", () => {
    expect(source).toContain("<ExperienceCards />");
  });
});