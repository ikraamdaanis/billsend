// The browser enforces this on every billsend page. Nothing may be fetched
// from, sent to, or embedded from any origin but billsend's own; `data:` and
// `blob:` are in-memory URLs (logos, generated PDFs) that never leave the
// device. Inline scripts and styles carry the server-rendered hydration state,
// and `wasm-unsafe-eval` lets the PDF layout engine (Yoga) start its
// WebAssembly module.
export const CONTENT_SECURITY_POLICY = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'wasm-unsafe-eval'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self' data:",
  "connect-src 'self' data: blob:",
  "worker-src 'self' blob:",
  "frame-src 'none'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'none'",
  "frame-ancestors 'none'"
].join("; ");

// The design catalogue (/design) shows the editor in frames of its own pages,
// so those pages alone may frame and be framed by billsend itself.
export const DESIGN_CONTENT_SECURITY_POLICY = CONTENT_SECURITY_POLICY.replace(
  "frame-src 'none'",
  "frame-src 'self'"
).replace("frame-ancestors 'none'", "frame-ancestors 'self'");
