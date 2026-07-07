import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

// Pages render Layout -> Navbar -> astro:assets Image, which needs a real
// image pipeline to render through the container API, so this page is
// verified against its raw source instead.
const source = readFileSync(
  new URL("../../src/pages/contact.astro", import.meta.url),
  "utf-8",
);

describe("contact.astro", () => {
  it("renders the contact form inside the shared Layout", () => {
    expect(source).toMatch(
      /<Layout[\s\S]*<FormContact \/>[\s\S]*<\/Layout>/,
    );
  });

  it("no longer declares its own local playfair-display style block", () => {
    expect(source).not.toContain(".playfair-display");
    expect(source).not.toMatch(/<style>/);
  });
});