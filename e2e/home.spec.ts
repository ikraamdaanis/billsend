import type { Page } from "@playwright/test";
import { expect, test } from "./fixtures";
import { draftContains, gotoEditorSettled, saveInvoiceAs } from "./helpers";

// Group A: home / landing page.

function headerCta(page: Page) {
  return page
    .getByRole("banner")
    .getByRole("link", { name: "Create invoice", exact: true });
}

function heroCta(page: Page) {
  return page
    .getByRole("main")
    .getByRole("link", { name: "Create invoice", exact: true })
    .first();
}

test("home renders the hero and header CTAs", async ({ page }) => {
  await page.goto("/");

  await expect(heroCta(page)).toBeVisible();
  await expect(headerCta(page)).toBeVisible();
});

test("the header CTA navigates to the editor", async ({ page }) => {
  await page.goto("/");

  await headerCta(page).click();
  await expect(page).toHaveURL("/create");
});

test("the hero CTA navigates to the editor", async ({ page }) => {
  await page.goto("/");

  await heroCta(page).click();
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
  await page.goto("/");

  // Guards the <a><button> nesting from the audit: the CTA renders as one link
  // (one tab stop), with no nested button element.
  const cta = headerCta(page);

  await expect(cta).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Create invoice", exact: true })
  ).toHaveCount(0);

  await cta.focus();
  await expect(cta).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL("/create");
});

test("the typeface picked in the sample invoice carries into a new invoice", async ({
  page
}) => {
  await page.goto("/");

  const lora = page.getByRole("radio", { name: /Lora/ });

  await expect(page.getByRole("radio", { name: /Geist/ })).toBeChecked();

  // The radio itself is visually hidden; its label is what a visitor clicks.
  await page.locator("label").filter({ has: lora }).click();
  await expect(lora).toBeChecked();
  await expect(heroCta(page)).toHaveAttribute("href", /font=lora/);

  await heroCta(page).click();

  await expect(page).toHaveURL("/create");
  await expect(page.locator(".bg-paper").first()).toHaveCSS(
    "font-family",
    /Lora/
  );
});

test("picks made before the page finishes loading are kept", async ({
  page
}) => {
  // Hold every script back so the server-rendered form is live but React
  // hasn't attached yet.
  let releaseScripts = () => {};
  const scriptsReleased = new Promise<void>(resolve => {
    releaseScripts = resolve;
  });

  await page.route("**/*", async route => {
    if (route.request().resourceType() === "script") await scriptsReleased;

    await route.continue();
  });
  await page.goto("/", { waitUntil: "commit" });

  const lora = page.getByRole("radio", { name: /Lora/ });

  await page.locator("label").filter({ has: lora }).click();
  await page.locator("#demo-client").fill("Early Bird Ltd");
  await page.locator("label").filter({ hasText: /^EUR$/ }).click();

  releaseScripts();

  await expect(heroCta(page)).toHaveAttribute("href", /font=lora/);
  await expect(lora).toBeChecked();
  // The input's own value isn't page text, so these match the invoice preview.
  await expect(page.locator("#try-it")).toContainText("Early Bird Ltd");
  await expect(page.locator("#try-it")).toContainText("€");
});

test("a saved invoice is offered from the hero and opens the list", async ({
  page
}) => {
  await gotoEditorSettled(page);
  await saveInvoiceAs(page, "Returning client");

  await page.goto("/");

  const openSaved = page.getByRole("link", { name: /Open your invoices/ });

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

test("the homepage makes no requests to other websites", async ({ page }) => {
  const requested: string[] = [];

  page.on("request", request => requested.push(request.url()));

  await page.goto("/");
  await page.locator("#demo-client").fill("Acme Corporation");
  await page.getByRole("radio", { name: /Lora/ }).dispatchEvent("click");
  await page
    .getByRole("heading", { name: "Your next invoice starts here." })
    .scrollIntoViewIfNeeded();
  await page.waitForLoadState("networkidle");

  const homeOrigin = new URL(page.url()).origin;
  const elsewhere = requested.filter(requestUrl => {
    const url = new URL(requestUrl);

    return url.protocol.startsWith("http") && url.origin !== homeOrigin;
  });

  expect(requested.length).toBeGreaterThan(0);
  expect(elsewhere).toEqual([]);
});
