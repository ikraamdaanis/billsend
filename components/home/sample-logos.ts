// The sample businesses' logos: app-icon marks from Untitled UI's free logo
// set (untitledui.com/logos), free for commercial use without attribution;
// the companies are fictional. scripts/assets/logos holds 384px PNG masters
// rasterised from their SVGs, flattened first: the bevel, rim, sheen and
// shadow effects are stripped and the mark made solid white, as a printed logo
// would be. `bun run render:home` embeds those in the PDF
// renders and writes the web copies the editor previews show.
export const SAMPLE_LOGOS = ["magnolia", "codecraft", "constellation"] as const;

export function getSampleLogoSrc(logo: (typeof SAMPLE_LOGOS)[number]) {
  return `/home/logos/${logo}.webp`;
}
