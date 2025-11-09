import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const validatePrintTokenSchema = z.object({
  invoiceId: z.string().min(1, "Invoice ID is required"),
  token: z.string(),
  exp: z.number().optional()
});

export const validatePrintToken = createServerFn({
  method: "POST"
})
  .inputValidator(validatePrintTokenSchema)
  .handler(async ({ data }) => {
    const secret = process.env.PRINT_ROUTE_SECRET;

    if (!secret) {
      throw new Error("PRINT_ROUTE_SECRET not configured");
    }

    // Check expiry if provided
    if (data.exp) {
      const now = Date.now();
      const skew = 60 * 1000; // 1 minute clock skew tolerance
      if (now > data.exp + skew) {
        throw new Error("Unauthorized: Token expired");
      }
    }

    // Verify HMAC signature
    const { createHmac } = await import("node:crypto");
    const message = data.exp ? `${data.invoiceId}.${data.exp}` : data.invoiceId;
    const expectedSignature = createHmac("sha256", secret)
      .update(message)
      .digest("base64")
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=/g, "");

    if (data.token !== expectedSignature) {
      throw new Error("Unauthorized: Invalid token");
    }

    return true;
  });
