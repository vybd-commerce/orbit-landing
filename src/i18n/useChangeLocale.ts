import { useLocation, useNavigate } from "react-router-dom";
import { track } from "../lib/analytics";
import { useLocale } from "./context";
import { isLocale, localePath, rememberLocale, stripLocale } from "./locales";

/* Picking a language remembers it (middleware.ts stops guessing) and moves
   to the same page in that language. */
export function useChangeLocale() {
    const locale = useLocale();
    const navigate = useNavigate();
    const { pathname, search, hash } = useLocation();
    return (next: string) => {
        if (!isLocale(next)) return;
        rememberLocale(next);
        track("language_changed", { from: locale, to: next });
        navigate(localePath(next, stripLocale(pathname)) + search + hash);
    };
}
