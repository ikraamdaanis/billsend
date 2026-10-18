import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import {
  CONTENT_SECURITY_POLICY,
  DESIGN_CONTENT_SECURITY_POLICY
} from "~/consts/content-security-policy";
import { SECURITY_HEADERS } from "~/consts/security-headers";

// The pre-rendered pages are static files, so their headers come from
// public/_headers rather than the Worker; the two copies must match.
function readHeaderRules() {
  const rules = new Map<string, Map<string, string>>();
  let currentHeaders: Map<string, string> | undefined;

  for (const line of readFileSync("public/_headers", "utf8").split("\n")) {
    if (line.trim() === "" || line.trimStart().startsWith("#")) continue;

    if (!line.startsWith(" ")) {
      currentHeaders = new Map();
      rules.set(line.trim(), currentHeaders);
      continue;
    }

    const separator = line.indexOf(":");

    currentHeaders?.set(
      line.slice(0, separator).trim().toLowerCase(),
      line.slice(separator + 1).trim()
    );
  }

  return rules;
}

describe("Content-Security-Policy", () => {
  const rules = readHeaderRules();

  it.each(["/", "/index.html", "/privacy", "/privacy.html"])(
    "public/_headers sends the Worker's policy for %s",
    path => {
      expect(rules.get(path)?.get("content-security-policy")).toBe(
        CONTENT_SECURITY_POLICY
      );
    }
  );

  it.each(Object.entries(SECURITY_HEADERS))(
    "public/_headers sends the Worker's %s on every static file",
    (name, value) => {
      expect(rules.get("/*")?.get(name.toLowerCase())).toBe(value);
    }
  );
});

describe("the design catalogue's policy", () => {
  it("only lets billsend frame its own pages", () => {
    expect(DESIGN_CONTENT_SECURITY_POLICY).toContain("frame-src 'self'");
    expect(DESIGN_CONTENT_SECURITY_POLICY).toContain("frame-ancestors 'self'");
  });

  it("matches the site's policy in everything else", () => {
    const withoutFraming = (policy: string) =>
      policy.split("; ").filter(directive => !directive.startsWith("frame-"));

    expect(withoutFraming(DESIGN_CONTENT_SECURITY_POLICY)).toEqual(
      withoutFraming(CONTENT_SECURITY_POLICY)
    );
  });
});
