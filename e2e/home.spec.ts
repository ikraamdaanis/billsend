import type { Page } from "@playwright/test";
import { expect, test } from "./fixtures";
import { draftContains, gotoEditorSettled, saveInvoiceAs } from "./helpers";

// Group A: home / landing page.

// The font buttons only render once React has hydrated the page. Waiting for
// them means later scrolls aren't undone by the router's scroll restoration,
// and the scroll-driven header has its observer attached.
async function gotoHomeHydrated(page: Page) {
  await page.goto("/");
  await expect(page.getByRole("button", { name: "Lora" })).toBeVisible();
}

test("home renders the hero CTA and holds the header CTA back", async ({
  page
}) => {
  await gotoHomeHydrated(page);

  await expect(page.locator("#hero-create-invoice")).toBeVisible();

  // The header only offers Create invoice once the hero's button has scrolled
  // away, so the first screen never shows the same action twice.
  const headerCta = page
    .getByRole("banner")
    .getByRole("link", { name: "Create invoice", exact: true });

  await expect(headerCta).toBeHidden();

  await page.locator("#features").scrollIntoViewIfNeeded();
  await expect(headerCta).toBeVisible();
});

test("the header CTA navigates to the editor", async ({ page }) => {
  await gotoHomeHydrated(page);
  await page.locator("#features").scrollIntoViewIfNeeded();

  await page
    .getByRole("banner")
    .getByRole("link", { name: "Create invoice", exact: true })
    .click();
  await expect(page).toHaveURL("/create");
});

test("the hero CTA navigates to the editor", async ({ page }) => {
  await page.goto("/");

  await page.locator("#hero-create-invoice").click();
  await expect(page).toHaveURL("/create");
});

test("in-page anchor links scroll to their sections", async ({ page }) => {
  await page.goto("/");

  const nav = page.getByRole("navigation");

  await nav.getByRole("link", { name: "Features" }).click();
  await expect(page.locator("#features")).toBeInViewport();

  await nav.getByRole("link", { name: "Questions" }).click();
  await expect(page.locator("#questions")).toBeInViewport();

  await nav.getByRole("link", { name: "Privacy" }).click();
  await expect(page.locator("#privacy")).toBeInViewport();
});

test("the header CTA is a single link, not a nested button [R]", async ({
  page
}) => {
  await gotoHomeHydrated(page);
  await page.locator("#features").scrollIntoViewIfNeeded();

  // Guards the <a><button> nesting from the audit: the CTA renders as one link
  // (one tab stop), with no nested button element.
  const cta = page
    .getByRole("banner")
    .getByRole("link", { name: "Create invoice", exact: true });

  await expect(cta).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Create invoice", exact: true })
  ).toHaveCount(0);

  await cta.focus();
  await expect(cta).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL("/create");
});

test("the font picked in the hero preview carries into a new invoice", async ({
  page
}) => {
  await page.goto("/");

  const preview = page.getByRole("figure", {
    name: "Example invoice made with billsend"
  });
  const lora = page.getByRole("button", { name: "Lora" });

  await expect(page.getByRole("button", { name: "Geist" })).toHaveAttribute(
    "aria-pressed",
    "true"
  );

  // The page is server-rendered, so a click can land before hydration attaches
  // the handler; retry until it takes.
  await expect(async () => {
    await lora.click();
    await expect(lora).toHaveAttribute("aria-pressed", "true", {
      timeout: 500
    });
  }).toPass();
  await expect(preview).toHaveCSS("font-family", /Lora/);

  await page.locator("#hero-create-invoice").click();

  await expect(page).toHaveURL("/create");
  await expect(page.locator(".bg-paper").first()).toHaveCSS(
    "font-family",
    /Lora/
  );
});

test("a saved invoice is offered from the hero and opens the list", async ({
  page
}) => {
  await gotoEditorSettled(page);
  await saveInvoiceAs(page, "Returning client");

  await page.goto("/");

  const openSaved = page.getByRole("link", {
    name: "Open your saved invoices"
  });

  await expect(openSaved).toBeVisible();
  await openSaved.click();

  await expect(
    page.getByRole("dialog", { name: "Open Invoice" })
  ).toBeVisible();
  await expect(page).toHaveURL("/create");
});

test("a font hand-off never restyles work in progress", async ({ page }) => {
  await gotoEditorSettled(page);
  await page.getByLabel("Invoice title").fill("Half-finished invoice");
  await expect
    .poll(() => draftContains(page, "Half-finished invoice"))
    .toBe(true);

  await page.goto("/create?font=lora");

  await expect(page.getByLabel("Invoice title")).toHaveValue(
    "Half-finished invoice"
  );
  await expect(page.locator(".bg-paper").first()).not.toHaveCSS(
    "font-family",
    /Lora/
  );
});

test("the header CTA steps aside while the closing CTA is on screen", async ({
  page
}) => {
  await gotoHomeHydrated(page);
  await page.locator("#closing-create-invoice").scrollIntoViewIfNeeded();

  await expect(page.locator("#closing-create-invoice")).toBeInViewport();
  await expect(
    page
      .getByRole("banner")
      .getByRole("link", { name: "Create invoice", exact: true })
  ).toBeHidden();
});

test("the live privacy check reports no requests to other websites", async ({
  page
}) => {
  await gotoHomeHydrated(page);
  await page.locator("#privacy").scrollIntoViewIfNeeded();

  const elsewhere = page
    .locator("#privacy dl > div")
    .filter({ hasText: "Requests to other websites" })
    .locator("dd");

  await expect(elsewhere).toHaveText("0");
});
