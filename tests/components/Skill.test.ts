import { readFileSync } from "node:fs";
import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { beforeAll, describe, expect, it } from "vitest";
import Skill from "../../src/components/Skill.astro";

// Container renderToString doesn't inline a component's scoped <style> for
// an isolated render, so the keyframes assertion below checks the raw source.
const source = readFileSync(
  new URL("../../src/components/Skill.astro", import.meta.url),
  "utf-8",
);

let container: Awaited<ReturnType<typeof AstroContainer.create>>;

beforeAll(async () => {
  container = await AstroContainer.create();
});

describe("Skill.astro", () => {
  it("uses the provided label instead of deriving a name from the icon prop", async () => {
    const result = await container.renderToString(Skill, {
      props: {
        widthIcon: "40",
        heightIcon: "40",
        nameIcon: "NodeJsIcon",
        label: "Node.js",
        percentage: "90",
      },
    });

    expect(result).toContain("Node.js");
    expect(result).not.toContain("NodeJs");
  });

  it("falls back to the icon name with the trailing Icon stripped when no label is given", async () => {
    const result = await container.renderToString(Skill, {
      props: {
        widthIcon: "40",
        heightIcon: "40",
        nameIcon: "PostgreSqlIcon",
        percentage: "98",
      },
    });

    expect(result).toContain("PostgreSql");
  });

  it("renders the percentage badge in the monospace accent typeface", async () => {
    const result = await container.renderToString(Skill, {
      props: {
        widthIcon: "40",
        heightIcon: "40",
        nameIcon: "AwsIcon",
        label: "AWS",
        percentage: "90",
      },
    });

    expect(result).toMatch(/plex-mono accent-text font-semibold[^>]*>90%/);
  });

  it("ties the hover border and progress bar glow to the living accent tokens", async () => {
    const result = await container.renderToString(Skill, {
      props: {
        widthIcon: "40",
        heightIcon: "40",
        nameIcon: "AwsIcon",
        label: "AWS",
        percentage: "90",
      },
    });

    expect(result).toContain("hover:border-[color:var(--accent-soft)]");
    expect(result).toContain("accent-gradient");
    expect(result).toContain("box-shadow: 0 0 10px var(--accent-soft);");
  });

  it("sets the progress bar width from the percentage prop and animates it in", async () => {
    const result = await container.renderToString(Skill, {
      props: {
        widthIcon: "40",
        heightIcon: "40",
        nameIcon: "TsIcon",
        label: "TypeScript",
        percentage: "77",
      },
    });

    expect(result).toContain("width: 77%;");
    expect(result).toContain("skill-bar");
    expect(source).toMatch(/@keyframes fillBar\s*\{\s*from\s*\{\s*width:\s*0;/);
  });
});