import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const source = readFileSync(
  new URL("../../src/pages/skills.astro", import.meta.url),
  "utf-8",
);

describe("skills.astro data", () => {
  it("supplies a human readable label for every backend skill", () => {
    for (const label of [
      "Java",
      "PHP",
      "Python",
      "Node.js",
      "Spring Boot",
      "NestJS",
      "Symfony",
    ]) {
      expect(source).toContain(`label: "${label}"`);
    }
  });

  it("supplies a human readable label for every other skill", () => {
    for (const label of [
      "TypeScript",
      "CSS",
      "HTML",
      "MySQL",
      "PostgreSQL",
      "AWS",
      "Google Cloud",
    ]) {
      expect(source).toContain(`label: "${label}"`);
    }
  });

  it("forwards the label prop down to the Skill component for both lists", () => {
    const matches = source.match(/label=\{skill\.label\}/g) ?? [];
    expect(matches.length).toBe(2);
  });
});

describe("skills.astro markup", () => {
  it("introduces the page with a mono eyebrow and an accent divider", () => {
    expect(source).toContain('<p class="eyebrow mb-5">Skills</p>');
    expect(source).toContain(
      'class="h-px w-24 accent-gradient mx-auto rounded-full mb-6"',
    );
  });

  it("uses the shared eyebrow utility for the section headings instead of hardcoded colors", () => {
    expect(source).toContain('<h2 class="eyebrow">');
    expect(source).toContain('<h2 class="eyebrow eyebrow-alt">');
    expect(source).not.toContain("text-violet-400");
    expect(source).not.toContain("text-cyan-400");
  });

  it("renders each skill list as a single-column grid", () => {
    const matches = source.match(/class="grid grid-cols-1 gap-4"/g) ?? [];
    expect(matches.length).toBe(2);
    expect(source).not.toContain("grid grid-cols-1 md:grid-cols-1 gap-4");
  });
});