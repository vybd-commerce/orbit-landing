import { prefersReducedMotion } from "../motion";

const SEEN_KEY = "vybd-loader-seen";
let shownThisLoad = false;

/* The opening animation plays once per browser session. */
export function shouldShowLoader() {
    if (shownThisLoad || prefersReducedMotion()) return false;
    try {
        return sessionStorage.getItem(SEEN_KEY) !== "1";
    } catch {
        return true;
    }
}

export function markLoaderSeen() {
    shownThisLoad = true;
    try {
        sessionStorage.setItem(SEEN_KEY, "1");
    } catch {
        /* private mode: the module flag still covers in-app navigation */
    }
}
