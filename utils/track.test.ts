import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { track, trackPageView } from "~/utils/track";

function stubNavigator(overrides: Record<string, unknown> = {}) {
  const sendBeacon = vi.fn(() => true);

  vi.stubGlobal("navigator", { sendBeacon, ...overrides });

  return sendBeacon;
}

describe("track", () => {
  beforeEach(() => {
    vi.stubEnv("DEV", false);
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  it("sends the event name as a beacon to the site's own origin", () => {
    const sendBeacon = stubNavigator();

    track("pdf_opened");

    expect(sendBeacon).toHaveBeenCalledExactlyOnceWith(
      "/api/event",
      "pdf_opened"
    );
  });

  it("sends a page view with its route pattern", () => {
    const sendBeacon = stubNavigator();

    trackPageView("/create");

    expect(sendBeacon).toHaveBeenCalledExactlyOnceWith(
      "/api/event",
      "page_view /create"
    );
  });

  it("sends nothing in development", () => {
    vi.stubEnv("DEV", true);
    const sendBeacon = stubNavigator();

    track("pdf_opened");
    trackPageView("/");

    expect(sendBeacon).not.toHaveBeenCalled();
  });

  it("sends nothing under Global Privacy Control", () => {
    const sendBeacon = stubNavigator({ globalPrivacyControl: true });

    track("invoice_saved");
    trackPageView("/");

    expect(sendBeacon).not.toHaveBeenCalled();
  });

  it("sends when Global Privacy Control is off", () => {
    const sendBeacon = stubNavigator({ globalPrivacyControl: false });

    track("invoice_saved");

    expect(sendBeacon).toHaveBeenCalledOnce();
  });

  it("stays quiet when the beacon throws or doesn't exist", () => {
    stubNavigator({
      sendBeacon: () => {
        throw new TypeError("Blocked");
      }
    });

    expect(() => track("data_exported")).not.toThrow();

    vi.stubGlobal("navigator", {});

    expect(() => track("data_exported")).not.toThrow();
  });
});
