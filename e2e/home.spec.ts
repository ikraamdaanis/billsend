import { expect, test } from "./fixtures";

// Group A: home / landing page.

test("home renders the hero and primary CTAs", async ({ page }) => {
  await page.goto("/");

  await expect(
    page.getByRole("link", { name: "Create invoice", exact: true })
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Create your first invoice" })
  ).toBeVisible();
});

test("the header CTA navigates to the editor", async ({ page }) => {
  await page.goto("/");

  await page.getByRole("link", { name: "Create invoice", exact: true }).click();
  await expect(page).toHaveURL("/create");
});

test("the hero CTA navigates to the editor", async ({ page }) => {
  await page.goto("/");

  await page.getByRole("link", { name: "Create your first invoice" }).click();
  await expect(page).toHaveURL("/create");
});

test("in-page anchor links scroll to their sections", async ({ page }) => {
  await page.goto("/");

  const nav = page.getByRole("navigation");

  await nav.getByRole("link", { name: "Features" }).click();
  await expect(page.locator("#features")).toBeInViewport();

  await nav.getByRole("link", { name: "How it works" }).click();
  await expect(page.locator("#how")).toBeInViewport();

  await nav.getByRole("link", { name: "Privacy" }).click();
  await expect(page.locator("#privacy")).toBeInViewport();
});

test("the header CTA is keyboard-actionable as a link", async ({ page }) => {
  await page.goto("/");

  const cta = page.getByRole("link", { name: "Create invoice", exact: true });

  await cta.focus();
  await expect(cta).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL("/create");
});
