import { useEffect } from "react";

/* Shared by /book and /book/thanks: sets the tab title for the page's
   lifetime. Newsreader is self-hosted (src/fonts.css), so nothing to load. */
export function useBookShell(title: string) {
    useEffect(() => {
        const prevTitle = document.title;
        document.title = title;
        return () => {
            document.title = prevTitle;
        };
    }, [title]);
}
