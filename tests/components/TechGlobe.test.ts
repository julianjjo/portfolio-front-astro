import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { beforeAll, describe, expect, it } from "vitest";
import TechGlobe from "../../src/components/TechGlobe.astro";

let container: Awaited<ReturnType<typeof AstroContainer.create>>;

beforeAll(async () => {
  container = await AstroContainer.create();
});

describe("TechGlobe.astro", () => {
  it("server-renders every item already placed on the sphere", async () => {
    const result = await container.renderToString(TechGlobe);

    const items = result.match(/class="globe-item"[^>]*>/g) ?? [];
    expect(items).toHaveLength(17);
    for (const item of items) {
      expect(item).toMatch(/transform:\s*translate3d\(calc\(var\(--r\)/);
    }
  });

  it("describes the globe for assistive technology", async () => {
    const result = await container.renderToString(TechGlobe);

    expect(result).toContain('role="img"');
    expect(result).toMatch(/aria-label="3D globe of the technologies I work with: Java, Spring Boot,/);
  });
});
