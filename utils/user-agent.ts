import type { BrowserFamily, DeviceType, OperatingSystem } from "~/types";

// Cloudflare's Bot Management fields on `request.cf` need an Enterprise plan,
// so a User-Agent check is what there is. It only has to keep the obvious crawlers,
// previews and test browsers out of the counts.
const BOT_PATTERN = /bot|crawl|spider|headless|lighthouse|preview/i;

export function isBotUserAgent(userAgent: string) {
  return BOT_PATTERN.test(userAgent);
}

// Reduces a User-Agent to coarse buckets; only the buckets are stored. Order
// matters: Edge, Samsung Internet and Opera all say "Chrome" too, and every
// browser on iOS says "Safari".
export function bucketUserAgent(userAgent: string): {
  browser: BrowserFamily;
  os: OperatingSystem;
  device: DeviceType;
} {
  return {
    browser: browserFamily(userAgent),
    os: operatingSystem(userAgent),
    device: deviceType(userAgent)
  };
}

function browserFamily(userAgent: string): BrowserFamily {
  if (/Edg(e|A|iOS)?\//.test(userAgent)) return "edge";
  if (/SamsungBrowser\//.test(userAgent)) return "samsung";
  if (/OPR\/|OPiOS\/|YaBrowser\/|Vivaldi\//.test(userAgent)) return "other";
  if (/Firefox\/|FxiOS\//.test(userAgent)) return "firefox";
  if (/Chrome\/|CriOS\//.test(userAgent)) return "chrome";
  if (/Safari\//.test(userAgent)) return "safari";

  return "other";
}

// iPadOS asks for desktop sites, so an iPad reads as a Mac here.
function operatingSystem(userAgent: string): OperatingSystem {
  if (/iPhone|iPad|iPod/.test(userAgent)) return "ios";
  if (/Android/.test(userAgent)) return "android";
  if (/Windows/.test(userAgent)) return "windows";
  if (/Macintosh|Mac OS X/.test(userAgent)) return "macos";
  if (/CrOS/.test(userAgent)) return "other";
  if (/Linux/.test(userAgent)) return "linux";

  return "other";
}

// Android tablets leave "Mobile" out of the User-Agent; phones include it.
function deviceType(userAgent: string): DeviceType {
  if (/iPad|Tablet/.test(userAgent)) return "tablet";
  if (/Android/.test(userAgent) && !/Mobile/.test(userAgent)) return "tablet";
  if (/Mobi|iPhone|iPod|Android/.test(userAgent)) return "mobile";

  return "desktop";
}
