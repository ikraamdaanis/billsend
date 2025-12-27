const CANVAS_LOCK_COOKIE_NAME = "canvas_locked";
const CANVAS_LOCK_COOKIE_MAX_AGE = 60 * 60 * 24 * 365; // 1 year

function getCookie(name: string): string | null {
  if (typeof document === "undefined") {
    return null;
  }
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return parts.pop()?.split(";").shift() ?? null;
  }
  return null;
}

function setCookie(name: string, value: string, maxAge: number): void {
  if (typeof document === "undefined") {
    return;
  }
  document.cookie = `${name}=${value}; path=/; max-age=${maxAge}`;
}

export function getCanvasLockState(): boolean {
  const cookie = getCookie(CANVAS_LOCK_COOKIE_NAME);
  return cookie === "true";
}

export function setCanvasLockState(locked: boolean): void {
  setCookie(
    CANVAS_LOCK_COOKIE_NAME,
    String(locked),
    CANVAS_LOCK_COOKIE_MAX_AGE
  );
}
