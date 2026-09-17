import { useEffect, useLayoutEffect, useRef, useState } from "react";

interface RotatingWordProps {
    words: string[];
    /* Milliseconds each word holds before the next one swaps in. */
    interval?: number;
    className?: string;
}

/* Swaps the last word of a headline on a timer. The width animates with the
   word so the line never jumps, and a hidden sizer measures the next word
   before it is shown. */
export default function RotatingWord({ words, interval = 2600, className }: RotatingWordProps) {
    const reduceMotion =
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const [index, setIndex] = useState(0);
    const [width, setWidth] = useState<number | undefined>(undefined);
    const sizerRef = useRef<HTMLSpanElement>(null);

    useEffect(() => {
        if (reduceMotion || words.length < 2) return;

        let timer = window.setTimeout(function tick() {
            if (!document.hidden) setIndex((i) => (i + 1) % words.length);
            timer = window.setTimeout(tick, interval);
        }, interval);

        return () => window.clearTimeout(timer);
    }, [words, interval, reduceMotion]);

    /* Measure before paint: the width transition should start from the old
       value, not from an unstyled frame. */
    useLayoutEffect(() => {
        const el = sizerRef.current;
        if (el) setWidth(el.getBoundingClientRect().width);
    }, [index, words]);

    const word = words[index] ?? words[0];

    return (
        <span className={`rw-root ${className ?? ""}`} style={{ width }}>
            <span className="rw-sizer" aria-hidden="true" ref={sizerRef}>{word}</span>
            {/* Keyed so both the word and its rule restart their tint on
                every swap: each one arrives white and settles into mint. */}
            <span className="rw-word" key={word}>
                {word}
                <span className="rw-rule" aria-hidden="true" />
            </span>
        </span>
    );
}
