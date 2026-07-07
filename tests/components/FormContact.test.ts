import { readFileSync } from "node:fs";
import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { beforeAll, describe, expect, it } from "vitest";
import FormContact from "../../src/components/FormContact.astro";

// The submit handler lives in an inline <script>, which container rendering
// does not inline verbatim, so its behaviour is verified against the raw
// source alongside the rendered markup checks below.
const source = readFileSync(
  new URL("../../src/components/FormContact.astro", import.meta.url),
  "utf-8",
);

let container: Awaited<ReturnType<typeof AstroContainer.create>>;

beforeAll(async () => {
  container = await AstroContainer.create();
});

describe("FormContact.astro markup", () => {
  it("renders the refreshed heading and supporting copy", async () => {
    const result = await container.renderToString(FormContact);

    expect(result).toMatch(/Let(?:&#39;|')s talk/);
    expect(result).toContain('class="eyebrow mb-3"');
    expect(result).toContain("Your message goes straight to my inbox.");
    expect(result).not.toContain("animated-text");
  });

  it("replaces the reload-based Cancel button with a native reset button labeled Clear", async () => {
    const result = await container.renderToString(FormContact);

    expect(result).toContain('type="reset"');
    expect(result).toContain("Clear");
    expect(result).not.toContain("window.location.reload()");
    expect(result).not.toContain("Cancel");
  });

  it("submits with a living-accent gradient button", async () => {
    const result = await container.renderToString(FormContact);

    expect(result).toContain('type="submit"');
    expect(result).toContain("accent-gradient-deep");
    expect(result).toContain("Send Message");
  });

  it("ties input focus rings to the living accent tokens instead of fixed violet/cyan", async () => {
    const result = await container.renderToString(FormContact);

    expect(result).toContain("focus:border-[color:var(--accent-soft)]");
    expect(result).toContain("focus:ring-[color:var(--accent-faint)]");
    expect(result).not.toContain("focus:border-violet-500/50");
    expect(result).not.toContain("focus:border-cyan-500/50");
  });

  it("renders both the success and danger toasts", async () => {
    const result = await container.renderToString(FormContact);

    expect(result).toContain('id="toast-success"');
    expect(result).toContain('id="toast-danger"');
  });
});

describe("FormContact.astro submit script", () => {
  it("prevents the default submit and posts JSON to the contact API", () => {
    expect(source).toMatch(/e\.preventDefault\(\);/);
    expect(source).toMatch(/fetch\("\/api\/contact_me", \{/);
    expect(source).toMatch(/method: "POST"/);
  });

  it("disables the submit button while sending and restores its label afterwards", () => {
    expect(source).toMatch(/btn\.textContent = "Sending\.\.\."/);
    expect(source).toMatch(/btn\.disabled = true/);
    expect(source).toMatch(/btn\.disabled = false/);
  });

  it("shows the success toast and resets the form when the request succeeds", () => {
    expect(source).toMatch(/showToast\("toast-success"\)/);
    expect(source).toMatch(/target\.reset\(\)/);
  });

  it("shows the danger toast on a failed response and on a network error", () => {
    const matches = source.match(/showToast\("toast-danger"\)/g) ?? [];
    expect(matches.length).toBe(2);
  });

  it("auto-hides a shown toast after 5 seconds", () => {
    expect(source).toMatch(
      /setTimeout\(\(\) => toast\.classList\.add\("hidden"\), 5000\)/,
    );
  });
});