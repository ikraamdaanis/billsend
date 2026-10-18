import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { APP_NAME } from "~/consts/app";
import { typeClass } from "~/lib/type-scale";
import { cn } from "~/lib/utils";
import { MAKER_NAME, MAKER_URL, SOURCE_URL } from "~/utils/site-meta";

// The marketing pages' shared frame: column, focus ring, wordmark and footer.
// The homepage and the privacy page draw it the same way.

export const CONTAINER = "mx-auto max-w-6xl px-6 lg:px-8";

export const FOCUS_RING =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600";

// The wordmark: the name in Geist, in the homepage's heading blue. The 44px
// box keeps it a comfortable tap target without changing the type.
export function Wordmark() {
  return (
    <Link
      to="/"
      aria-label="Homepage"
      className={cn(
        "font-geist flex min-h-11 items-center rounded-md text-lg font-semibold tracking-tight",
        FOCUS_RING
      )}
    >
      <span className="text-ink-blue">{APP_NAME}</span>
    </Link>
  );
}

export function SiteFooter() {
  return (
    <footer>
      <div
        className={cn(
          CONTAINER,
          "flex flex-col gap-6 py-10 sm:flex-row sm:items-center sm:justify-between"
        )}
      >
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <Wordmark />
          <p className={cn(typeClass("body"), "text-zinc-500")}>
            Invoices that stay on your device.
          </p>
        </div>
        <ul
          className={cn(
            typeClass("body"),
            "flex flex-wrap items-center gap-x-6 gap-y-2 text-zinc-600"
          )}
        >
          <li>
            <Link
              to="/privacy"
              className={cn(
                "hover:text-ink inline-flex min-h-11 items-center rounded-sm sm:min-h-10",
                FOCUS_RING
              )}
            >
              Privacy
            </Link>
          </li>
          <li>
            <FooterLink href={`${SOURCE_URL}/issues`}>
              Report an issue
            </FooterLink>
          </li>
          <li>
            <FooterLink href={SOURCE_URL}>Source on GitHub</FooterLink>
          </li>
          <li>
            Made by <FooterLink href={MAKER_URL}>{MAKER_NAME}</FooterLink>
          </li>
        </ul>
      </div>
    </footer>
  );
}

function FooterLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "hover:text-ink inline-flex min-h-11 items-center rounded-sm sm:min-h-10",
        FOCUS_RING
      )}
    >
      {children}
      <span className="sr-only"> (opens in a new tab)</span>
    </a>
  );
}
