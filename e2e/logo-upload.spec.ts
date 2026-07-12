import { expect, test } from "./fixtures";
import { gotoEditorReady } from "./helpers";

// Group J: logo upload through the real Dropzone. setInputFiles runs the same
// accept/size validation the drop handler uses.

// A 1x1 transparent PNG.
const PNG_BYTES = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+M8AAAMBAQDJ/pLvAAAAAElFTkSuQmCC",
  "base64"
);

function pngFile(name = "logo.png") {
  return { name, mimeType: "image/png", buffer: PNG_BYTES };
}

test("uploads a PNG and shows it in the preview", async ({ page }) => {
  await gotoEditorReady(page);

  await page.locator('input[type="file"]').setInputFiles(pngFile());

  await expect(page.getByRole("img", { name: "Invoice logo" })).toBeVisible();
});

test("rejects a non-image file with the unsupported-type message", async ({
  page
}) => {
  await gotoEditorReady(page);

  await page.locator('input[type="file"]').setInputFiles({
    name: "notes.txt",
    mimeType: "text/plain",
    buffer: Buffer.from("just some text")
  });

  await expect(page.getByText(/isn't a supported image/)).toBeVisible();
  await expect(page.getByRole("img", { name: "Invoice logo" })).toHaveCount(0);
});

test("rejects an image over 5MB with the size message [R]", async ({
  page
}) => {
  await gotoEditorReady(page);

  await page.locator('input[type="file"]').setInputFiles({
    name: "huge.png",
    mimeType: "image/png",
    buffer: Buffer.alloc(5 * 1024 * 1024 + 1)
  });

  await expect(page.getByText(/too large/)).toBeVisible();
  await expect(page.getByRole("img", { name: "Invoice logo" })).toHaveCount(0);
});

test("uploads the valid image when a stray non-image is included [R]", async ({
  page
}) => {
  await gotoEditorReady(page);

  await page
    .locator('input[type="file"]')
    .setInputFiles([
      pngFile("valid.png"),
      { name: "stray.txt", mimeType: "text/plain", buffer: Buffer.from("x") }
    ]);

  await expect(page.getByRole("img", { name: "Invoice logo" })).toBeVisible();
});

test("removing the logo clears it from the preview", async ({ page }) => {
  await gotoEditorReady(page);

  await page.locator('input[type="file"]').setInputFiles(pngFile());
  await expect(page.getByRole("img", { name: "Invoice logo" })).toBeVisible();

  await page.getByRole("button", { name: "Remove" }).click();
  await expect(page.getByRole("img", { name: "Invoice logo" })).toHaveCount(0);
});
