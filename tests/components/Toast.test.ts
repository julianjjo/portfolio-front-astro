import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { beforeAll, describe, expect, it } from "vitest";
import Toast from "../../src/components/Toast.astro";

let container: Awaited<ReturnType<typeof AstroContainer.create>>;

beforeAll(async () => {
  container = await AstroContainer.create();
});

describe("Toast.astro", () => {
  it("renders the success variant with its emerald icon and message", async () => {
    const result = await container.renderToString(Toast, {
      props: { type: "Success", className: "hidden" },
    });

    expect(result).toContain('id="toast-success"');
    expect(result).toContain("text-emerald-400 bg-emerald-400/10");
    expect(result).toContain("Message sent.");
    expect(result).toContain("within a day.");
  });

  it("renders the danger variant with its red icon and message", async () => {
    const result = await container.renderToString(Toast, {
      props: { type: "Danger", className: "hidden" },
    });

    expect(result).toContain('id="toast-danger"');
    expect(result).toContain("text-red-400 bg-red-400/10");
    expect(result).toContain("go through. Please try again.");
  });

  it("renders the warning variant with its amber icon and message", async () => {
    const result = await container.renderToString(Toast, {
      props: { type: "Warning", className: "hidden" },
    });

    expect(result).toContain('id="toast-warning"');
    expect(result).toContain("text-amber-400 bg-amber-400/10");
    expect(result).toContain("Check the highlighted fields");
  });

  it("renders no toast markup for a type with no matching variant", async () => {
    const result = await container.renderToString(Toast, {
      props: { type: "Nonexistent", className: "hidden" },
    });

    expect(result).not.toContain("id=\"toast-");
    expect(result).not.toContain('role="alert"');
  });

  it("appends the className prop onto the toast container's class list", async () => {
    const result = await container.renderToString(Toast, {
      props: { type: "Success", className: "custom-test-class" },
    });

    expect(result).toMatch(
      /id="toast-success"\s+class="[^"]*custom-test-class[^"]*"/,
    );
  });

  it("wires each close button to dismiss only its own toast by id", async () => {
    const result = await container.renderToString(Toast, {
      props: { type: "Danger", className: "hidden" },
    });

    expect(result).toContain(
      "document.getElementById('toast-danger').classList.add('disappear');",
    );
  });
});