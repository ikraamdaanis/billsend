// TanStack Router restores the window's scroll on a reload with an inline
// script that runs after the route's markup. The server streams that markup,
// so the browser can paint the top of the page first and then jump to the
// saved position. These two scripts hide the page from first paint until the
// restore has run, and only when there is a position to restore, so a fresh
// visit paints as soon as it can.

// TanStack Router's sessionStorage key for saved scroll positions (the
// `storageKey` export of @tanstack/router-core); a unit test keeps it in step.
export const SCROLL_RESTORATION_STORAGE_KEY = "tsr-scroll-restoration-v1_3";

// Runs in <head>. A timeout reveals the page anyway, so a failed restore can
// never leave it blank.
export const HIDE_UNTIL_SCROLL_RESTORED_SCRIPT = `(function(){try{var key=history.state&&history.state.__TSR_key;var saved=JSON.parse(sessionStorage.getItem(${JSON.stringify(SCROLL_RESTORATION_STORAGE_KEY)})||"{}");var position=key&&saved[key]&&saved[key].window;if(position&&position.scrollY>0){var root=document.documentElement;root.style.visibility="hidden";setTimeout(function(){root.style.visibility=""},1000)}}catch(error){}})()`;

// Runs at the end of <body>, after TanStack's restore script.
export const REVEAL_AFTER_SCROLL_RESTORED_SCRIPT = `document.documentElement.style.visibility=""`;
