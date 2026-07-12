import { expect, test } from "./fixtures";
import { addLineItem, gotoEditorReady, setNumber } from "./helpers";

// Group D: pricing and totals. The totals math is unit-tested in Vitest; these
// specs verify the editor wires the inputs to the rendered summary rows.

test("subtotal equals the sum of line amounts", async ({ page }) => {
  await gotoEditorReady(page);

  await setNumber(page.getByLabel("Quantity, item 1"), "2");
  await setNumber(page.getByLabel("Unit Price, item 1"), "50");

  await addLineItem(page);
  await setNumber(page.getByLabel("Quantity, item 2"), "1");
  await setNumber(page.getByLabel("Unit Price, item 2"), "30");

  await expect(page.getByTestId("subtotal-value")).toHaveText("£130.00");
});

test("tax percentage applies to the subtotal", async ({ page }) => {
  await gotoEditorReady(page);

  await setNumber(page.getByLabel("Quantity, item 1"), "1");
  await setNumber(page.getByLabel("Unit Price, item 1"), "100");
  await expect(page.getByTestId("subtotal-value")).toHaveText("£100.00");

  await setNumber(page.getByLabel("Tax percentage"), "10");
  await expect(page.getByTestId("tax-amount")).toHaveText("£10.00");
  await expect(page.getByTestId("total-value")).toHaveText("£110.00");
});

test("fees add and discounts subtract from the total", async ({ page }) => {
  await gotoEditorReady(page);

  await setNumber(page.getByLabel("Quantity, item 1"), "1");
  await setNumber(page.getByLabel("Unit Price, item 1"), "100");

  await setNumber(page.getByLabel("Fees amount"), "20");
  await expect(page.getByTestId("total-value")).toHaveText("£120.00");

  await setNumber(page.getByLabel("Discounts amount"), "30");
  await expect(page.getByTestId("total-value")).toHaveText("£90.00");
});

test("total never drops below zero", async ({ page }) => {
  await gotoEditorReady(page);

  await setNumber(page.getByLabel("Quantity, item 1"), "1");
  await setNumber(page.getByLabel("Unit Price, item 1"), "100");

  await setNumber(page.getByLabel("Discounts amount"), "500");
  await expect(page.getByTestId("total-value")).toHaveText("£0.00");
});

test("money values render to two decimal places", async ({ page }) => {
  await gotoEditorReady(page);

  await setNumber(page.getByLabel("Quantity, item 1"), "3");
  await setNumber(page.getByLabel("Unit Price, item 1"), "10");

  await expect(page.getByTestId("subtotal-value")).toHaveText("£30.00");
  await expect(page.getByTestId("total-value")).toHaveText("£30.00");
});
