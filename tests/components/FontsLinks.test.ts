import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { beforeAll, describe, expect, it } from "vitest";
import FontsLinks from "../../src/components/FontsLinks.astro";

let container: Awaited<ReturnType<typeof AstroContainer.create>>;

beforeAll(async () => {
  container = await AstroContainer.create();
});

describe("FontsLinks.astro", () => {
  it("preconnects to the Google Fonts origins", async () => {
    const result = await container.renderToString(FontsLinks);

    expect(result).toContain('href="https://fonts.googleapis.com"');
    expect(result).toContain('href="https://fonts.gstatic.com"');
  });

  it("loads Playfair Display, Outfit, and IBM Plex Mono in a single stylesheet request", async () => {
    const result = await container.renderToString(FontsLinks);

    const linkMatch = result.match(
      /<link[^>]*href="([^"]*fonts\.googleapis\.com\/css2[^"]*)"[^>]*>/,
    );
    expect(linkMatch).not.toBeNull();
    const href = linkMatch![1];

    expect(href).toContain("family=Playfair+Display");
    expect(href).toContain("family=Outfit");
    expect(href).toContain("family=IBM+Plex+Mono:wght@400;500;600");
  });
});