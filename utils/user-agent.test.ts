import { describe, expect, it } from "vitest";
import { bucketUserAgent, isBotUserAgent } from "~/utils/user-agent";

const USER_AGENTS = {
  chromeMac:
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36",
  chromeWindows:
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36",
  chromeLinux:
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36",
  chromeOs:
    "Mozilla/5.0 (X11; CrOS x86_64 14541.0.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36",
  chromeAndroidPhone:
    "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36",
  chromeAndroidTablet:
    "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36",
  chromeIphone:
    "Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/141.0.7390.96 Mobile/15E148 Safari/604.1",
  safariMac:
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Safari/605.1.15",
  safariIphone:
    "Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.6 Mobile/15E148 Safari/604.1",
  safariIpadMini:
    "Mozilla/5.0 (iPad; CPU OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.6 Mobile/15E148 Safari/604.1",
  firefoxWindows:
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:144.0) Gecko/20100101 Firefox/144.0",
  firefoxLinux:
    "Mozilla/5.0 (X11; Linux x86_64; rv:144.0) Gecko/20100101 Firefox/144.0",
  firefoxIphone:
    "Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) FxiOS/144.0 Mobile/15E148 Safari/605.1.15",
  firefoxAndroid:
    "Mozilla/5.0 (Android 15; Mobile; rv:144.0) Gecko/144.0 Firefox/144.0",
  edgeWindows:
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36 Edg/141.0.0.0",
  edgeAndroid:
    "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36 EdgA/141.0.0.0",
  edgeIphone:
    "Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 EdgiOS/141.0.0.0 Mobile/15E148 Safari/605.1.15",
  samsungPhone:
    "Mozilla/5.0 (Linux; Android 14; SAMSUNG SM-S921B) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/28.0 Chrome/130.0.0.0 Mobile Safari/537.36",
  samsungTablet:
    "Mozilla/5.0 (Linux; Android 14; SAMSUNG SM-X710) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/28.0 Chrome/130.0.0.0 Safari/537.36",
  operaWindows:
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36 OPR/124.0.0.0"
};

describe("bucketUserAgent", () => {
  it.each([
    ["chromeMac", "chrome", "macos", "desktop"],
    ["chromeWindows", "chrome", "windows", "desktop"],
    ["chromeLinux", "chrome", "linux", "desktop"],
    ["chromeOs", "chrome", "other", "desktop"],
    ["chromeAndroidPhone", "chrome", "android", "mobile"],
    ["chromeAndroidTablet", "chrome", "android", "tablet"],
    ["chromeIphone", "chrome", "ios", "mobile"],
    ["safariMac", "safari", "macos", "desktop"],
    ["safariIphone", "safari", "ios", "mobile"],
    ["safariIpadMini", "safari", "ios", "tablet"],
    ["firefoxWindows", "firefox", "windows", "desktop"],
    ["firefoxLinux", "firefox", "linux", "desktop"],
    ["firefoxIphone", "firefox", "ios", "mobile"],
    ["firefoxAndroid", "firefox", "android", "mobile"],
    ["edgeWindows", "edge", "windows", "desktop"],
    ["edgeAndroid", "edge", "android", "mobile"],
    ["edgeIphone", "edge", "ios", "mobile"],
    ["samsungPhone", "samsung", "android", "mobile"],
    ["samsungTablet", "samsung", "android", "tablet"],
    ["operaWindows", "other", "windows", "desktop"]
  ] as const)("buckets %s as %s on %s (%s)", (name, browser, os, device) => {
    expect(bucketUserAgent(USER_AGENTS[name])).toEqual({ browser, os, device });
  });

  it("puts an empty or unknown User-Agent in the other buckets", () => {
    expect(bucketUserAgent("")).toEqual({
      browser: "other",
      os: "other",
      device: "desktop"
    });
    expect(bucketUserAgent("curl/8.7.1")).toEqual({
      browser: "other",
      os: "other",
      device: "desktop"
    });
  });
});

describe("isBotUserAgent", () => {
  it.each([
    "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)",
    "Mozilla/5.0 (compatible; bingbot/2.0; +http://www.bing.com/bingbot.htm)",
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/141.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Linux; Android 11; moto g power (2022)) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36 Chrome-Lighthouse",
    "Mozilla/5.0 (compatible; YandexSpider/3.0)",
    "facebookexternalhit/1.1 Facebot Twitterbot/1.0",
    "Mozilla/5.0 (compatible; Bytespider; spider-feedback@bytedance.com)",
    "Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; Slack-LinkExpanding Preview)",
    "CCBot/2.0 (https://commoncrawl.org/faq/)"
  ])("flags %s", userAgent => {
    expect(isBotUserAgent(userAgent)).toBe(true);
  });

  it.each(Object.values(USER_AGENTS))("lets %s through", userAgent => {
    expect(isBotUserAgent(userAgent)).toBe(false);
  });
});
