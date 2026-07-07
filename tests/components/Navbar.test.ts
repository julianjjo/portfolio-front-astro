import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

// Navbar.astro renders an astro:assets <Image>, which requires a real image
// transform pipeline (sharp) to render through the container API. Its
// accessibility and styling changes are verified against the raw source
// instead, which is deterministic and dependency-free.
const source = readFileSync(
  new URL("../../src/components/Navbar.astro", import.meta.url),
  "utf-8",
);

describe("Navbar.astro accessibility markup", () => {
  it("labels the mobile menu toggle for assistive technology", () => {
    expect(source).toMatch(
      /id="button-mobile-toggle"[\s\S]*?aria-label="Toggle menu"/,
    );
    expect(source).toContain('aria-controls="mobile-menu"');
    expect(source).toContain('aria-expanded="false"');
  });

  it("no longer suppresses the visible keyboard focus outline on the toggle", () => {
    const start = source.indexOf('id="button-mobile-toggle"');
    const end = source.indexOf("</button>", start);
    const toggleButtonMarkup = source.slice(start, end);

    expect(toggleButtonMarkup).not.toContain("focus:outline-none");
  });

  it("renders the brand name in the monospace typeface with wider letter spacing", () => {
    expect(source).toMatch(
      /class="text-xs plex-mono font-semibold text-slate-400 hidden lg:block tracking-\[0\.2em\] uppercase"/,
    );
  });

  it("ties the active-route indicator dot to the living accent tokens", () => {
    expect(source).toContain(
      "background: var(--accent); box-shadow: 0 0 6px var(--accent-soft);",
    );
    expect(source).not.toContain("bg-violet-400");
  });
});

describe("Navbar.astro mobile menu toggle script", () => {
  it("keeps aria-expanded in sync when the button is clicked", () => {
    expect(source).toMatch(
      /toggleBtn\.setAttribute\("aria-expanded", String\(isMenuOpen\)\)/,
    );
  });

  it("resets aria-expanded to false when the menu is closed by an outside click", () => {
    expect(source).toMatch(
      /toggleBtn\.setAttribute\("aria-expanded", "false"\)/,
    );
  });
});