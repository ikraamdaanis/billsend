// On a reload, TanStack Router restores the window's scroll from a position it
// saved in sessionStorage. The server streams the page, so the browser paints
// the top of it before the rest arrives, and the inline restore script TanStack
// renders on the server is missing from the production Worker build, leaving
// the restore to the browser or to hydration. Either way the visitor sees the
// hero, then a jump. These two scripts take the restore over: the first hides
// the page from first paint when there is a position to restore, and the
// second, once the whole page is parsed, scrolls to it and reveals the page,
// so it appears already in place. A fresh visit paints as soon as it can.

// TanStack Router's sessionStorage key for saved scroll positions (the
// `storageKey` export of @tanstack/router-core); a unit test keeps it in step.
export const SCROLL_RESTORATION_STORAGE_KEY = "tsr-scroll-restoration-v1_3";

// Reads the window's saved position for this history entry, or nothing.
const READ_SAVED_POSITION = `function(){try{var key=history.state&&history.state.__TSR_key;var saved=JSON.parse(sessionStorage.getItem(${JSON.stringify(SCROLL_RESTORATION_STORAGE_KEY)})||"{}");var position=key&&saved[key]&&saved[key].window;if(position&&position.scrollY>0)return position}catch(error){}}`;

// Runs in <head>. It also takes restoration from the browser, whose own
// restore can land after the reveal, and a timeout reveals the page anyway so
// a failed restore can never leave it blank.
export const HIDE_UNTIL_SCROLL_RESTORED_SCRIPT = `(function(){if(!(${READ_SAVED_POSITION})())return;history.scrollRestoration="manual";var root=document.documentElement;root.style.visibility="hidden";setTimeout(function(){root.style.visibility=""},1000)})()`;

// Runs at the end of <body>, when the page is at its full height.
export const REVEAL_AFTER_SCROLL_RESTORED_SCRIPT = `(function(){var root=document.documentElement;if(root.style.visibility!=="hidden")return;var position=(${READ_SAVED_POSITION})();if(position)scrollTo(position.scrollX,position.scrollY);root.style.visibility=""})()`;
