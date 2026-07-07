import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { beforeAll, describe, expect, it } from "vitest";
import ExperienceCards from "../../src/components/ExperienceCards.astro";

let container: Awaited<ReturnType<typeof AstroContainer.create>>;

beforeAll(async () => {
  container = await AstroContainer.create();
});

describe("ExperienceCards.astro", () => {
  it("renders a card for every experience entry", async () => {
    const result = await container.renderToString(ExperienceCards);

    for (const title of [
      "Farmatodo",
      "Sophos Solutions",
      "ElTiempo",
      "Ministry of Environment",
      "Fusagasuga City Hall",
    ]) {
      expect(result).toContain(title);
    }
    expect(result).toContain("Currently, 2 years");
  });

  it("ties hover glow and border colors to the living accent instead of a fixed violet", async () => {
    const result = await container.renderToString(ExperienceCards);

    expect(result).toContain("hover:shadow-[0_0_40px_var(--accent-faint)]");
    expect(result).toContain("hover:border-[color:var(--accent-soft)]");
    expect(result).toContain("group-hover:text-[color:var(--accent)]");
    expect(result).not.toContain("hover:border-white/20");
    expect(result).not.toContain("violet");
  });

  it("labels the duration badge with the monospace eyebrow style", async () => {
    const result = await container.renderToString(ExperienceCards);

    expect(result).toMatch(
      /plex-mono text-\[10px\] uppercase tracking-wide text-slate-500/,
    );
  });

  it("draws one accent-gradient divider per card", async () => {
    const result = await container.renderToString(ExperienceCards);

    const matches = result.match(/h-0\.5 w-12 accent-gradient/g) ?? [];
    expect(matches.length).toBe(5);
  });
});