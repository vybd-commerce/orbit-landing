import { useEffect } from "react";

const NEWSREADER_HREF =
    "https://fonts.googleapis.com/css2?family=Newsreader:opsz,wght@6..72,500;6..72,600&display=swap";

/* Shared by /book and /book/thanks: sets the tab title and loads Newsreader
   for the page's lifetime (the same font /hello adds), removing both again
   on the way out. */
export function useBookShell(title: string) {
    useEffect(() => {
        const prevTitle = document.title;
        document.title = title;
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = NEWSREADER_HREF;
        document.head.appendChild(link);
        return () => {
            document.title = prevTitle;
            link.remove();
        };
    }, [title]);
}
