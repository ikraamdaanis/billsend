import { cors } from "@elysiajs/cors";
import { Elysia } from "elysia";
import { existsSync } from "node:fs";
import puppeteer, { Browser, Page } from "puppeteer";

// Validate environment variables on startup
const requiredEnvVars = ["API_KEY"];
for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    console.error(`❌ Missing required environment variable: ${envVar}`);
    process.exit(1);
  }
}

// Reusable browser instance with concurrency control
let browserInstance: Browser | null = null;
let browserPromise: Promise<Browser> | null = null;
const MAX_CONCURRENT_REQUESTS = 5;
let activeRequests = 0;
const requestQueue: Array<() => void> = [];

async function ensureChromeInstalled(): Promise<void> {
  try {
    const executablePath = puppeteer.executablePath();
    if (!existsSync(executablePath)) {
      console.log("Chrome not found, installing...");
      const { execSync } = await import("node:child_process");
      execSync("npx puppeteer browsers install chrome", {
        stdio: "inherit"
      });
      console.log("Chrome installed successfully");
    }
  } catch (error) {
    console.warn("Could not verify/install Chrome:", error);
  }
}

async function getBrowser(): Promise<Browser> {
  if (browserInstance && browserInstance.isConnected()) {
    return browserInstance;
  }

  if (browserPromise) {
    return browserPromise;
  }

  // Ensure Chrome is installed before launching
  await ensureChromeInstalled();

  // Get Chrome executable path
  let executablePath: string | undefined;
  try {
    executablePath =
      process.env.PUPPETEER_EXECUTABLE_PATH || puppeteer.executablePath();

    // Verify the path exists
    if (executablePath && !existsSync(executablePath)) {
      console.warn(
        `Chrome not found at ${executablePath}, trying to find system Chrome`
      );
      executablePath = undefined;
    }
  } catch (error) {
    console.warn("Could not determine Chrome executable path:", error);
    executablePath = undefined;
  }

  const launchOptions: Parameters<typeof puppeteer.launch>[0] = {
    headless: true,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-gpu",
      "--disable-software-rasterizer",
      "--disable-extensions"
    ]
  };

  // Only set executablePath if we have a valid path
  if (executablePath) {
    launchOptions.executablePath = executablePath;
  }

  browserPromise = puppeteer.launch(launchOptions);

  browserInstance = await browserPromise;
  browserPromise = null;

  browserInstance.on("disconnected", () => {
    browserInstance = null;
  });

  return browserInstance;
}

async function waitForSlot(): Promise<void> {
  if (activeRequests < MAX_CONCURRENT_REQUESTS) {
    activeRequests++;
    return Promise.resolve();
  }

  return new Promise(resolve => {
    requestQueue.push(() => {
      activeRequests++;
      resolve();
    });
  });
}

function releaseSlot(): void {
  activeRequests--;
  const next = requestQueue.shift();
  if (next) {
    next();
  }
}

const app = new Elysia()
  .use(
    cors({
      origin: process.env.CORS_ORIGIN
        ? process.env.CORS_ORIGIN.split(",")
        : ["http://localhost:3000"],
      credentials: true
    })
  )
  .post("/generate-pdf", async ({ body, set, headers }) => {
    try {
      // Verify API key
      const authHeader = headers.authorization;
      const expectedKey = process.env.API_KEY;

      if (!expectedKey) {
        set.status = 500;
        return { error: "API_KEY not configured" };
      }

      if (authHeader !== `Bearer ${expectedKey}`) {
        set.status = 401;
        return { error: "Unauthorized" };
      }

      const requestBody = body as {
        url?: string;
        html?: string;
        fileName?: string;
        token?: string;
        disposition?: "inline" | "attachment";
      };

      if (!requestBody.url && !requestBody.html) {
        set.status = 400;
        return { error: "Either 'url' or 'html' is required" };
      }

      // Wait for available slot
      await waitForSlot();

      let page: Page | null = null;

      try {
        const browser = await getBrowser();
        page = await browser.newPage();

        // Set viewport to A4 size
        await page.setViewport({
          width: 794, // A4 width in pixels at 96 DPI
          height: 1123, // A4 height in pixels at 96 DPI
          deviceScaleFactor: 1
        });

        // Emulate print media for proper CSS rendering
        await page.emulateMediaType("print");

        let finalUrl = requestBody.url;
        if (finalUrl && requestBody.token) {
          const urlObj = new URL(finalUrl);
          urlObj.searchParams.set("token", requestBody.token);
          finalUrl = urlObj.toString();
        }

        if (finalUrl) {
          // Navigate to URL with timeout
          await page.goto(finalUrl, {
            waitUntil: "networkidle0",
            timeout: 30000
          });
        } else if (requestBody.html) {
          // Set HTML content
          await page.setContent(requestBody.html, {
            waitUntil: "networkidle0",
            timeout: 30000
          });
        }

        // Wait for invoice container to be ready
        await page
          .waitForSelector(".invoice-preview-container", {
            timeout: 5000
          })
          .catch(() => {
            // Continue even if selector not found
          });

        // Remove no-print elements
        await page.evaluate(() => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const doc = (globalThis as any).document;
          const noPrintElements = doc?.querySelectorAll?.(".no-print");
          if (noPrintElements) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            noPrintElements.forEach((el: any) => {
              el.remove();
            });
          }
        });

        // Generate PDF with print-optimized settings
        const pdf = await page.pdf({
          format: "A4",
          printBackground: true,
          preferCSSPageSize: true,
          margin: {
            top: "8mm",
            right: "8mm",
            bottom: "8mm",
            left: "8mm"
          },
          pageRanges: "1" // Force single page only
        });

        // Return PDF with appropriate disposition
        const fileName = requestBody.fileName || "invoice.pdf";
        const disposition =
          requestBody.disposition === "inline" ? "inline" : "attachment";
        set.headers["Content-Type"] = "application/pdf";
        set.headers["Content-Disposition"] =
          `${disposition}; filename="${fileName}"`;

        return new Response(pdf);
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Unknown error";

        if (process.env.NODE_ENV !== "production") {
          console.error("PDF generation error:", error);
        }

        set.status = 500;
        return {
          error: "Failed to generate PDF",
          message:
            process.env.NODE_ENV === "production"
              ? "Internal server error"
              : errorMessage
        };
      } finally {
        if (page) {
          await page.close().catch(() => {
            // Ignore errors when closing page
          });
        }
        releaseSlot();
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";

      if (process.env.NODE_ENV !== "production") {
        console.error("PDF generation error:", error);
      }

      set.status = 500;
      return {
        error: "Failed to generate PDF",
        message:
          process.env.NODE_ENV === "production"
            ? "Internal server error"
            : errorMessage
      };
    }
  })
  .get("/health", async () => {
    try {
      const browser = await getBrowser();
      const isConnected = browser.connected;

      return {
        status: "ok",
        service: "api",
        browser: isConnected ? "connected" : "disconnected",
        activeRequests,
        queueLength: requestQueue.length
      };
    } catch (error) {
      return {
        status: "error",
        service: "api",
        error: error instanceof Error ? error.message : "Unknown error"
      };
    }
  })
  .listen(process.env.PORT || 4001);

console.log(
  `🦊 PDF Service running at http://${app.server?.hostname}:${app.server?.port}`
);
