import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { STORY, TAGLINE, type StoryStep } from "../data/waitlistCopy";
import { useMediaQuery } from "../hooks/useMediaQuery";
import "./OrbitStory.css";

/* ── Timing (tune here) ──
   The dot orbits at a steady pace, the same 20s lap as the footer orbit on
   the other pages. Each caption is pinned at a clock position (STORY in
   waitlistCopy.ts) and shows for VISIBLE_MS, centred on the moment the dot
   passes it. */
const LAP_MS = 20000; // one full orbit
const VISIBLE_MS = 5000; // how long each caption stays up
const START_DEG = -45; // dot starts at 7:30, just before "Plug in" (0° = 9 o'clock, clockwise)
const CAPTION_IN_MS = 400; // caption fade-in
const CAPTION_OUT_MS = 250; // caption fade-out
const PIN_GAP = "1.25rem"; // distance from the ring to a caption

/* Half the visible window, as degrees of orbit. */
const HALF_WINDOW_DEG = (VISIBLE_MS / 2 / LAP_MS) * 360;

/* Degrees between two clock angles, 0..180. */
function angularDistance(a: number, b: number): number {
    return Math.abs((((a - b) % 360) + 540) % 360 - 180);
}

/* Pins a caption just outside the ring at its clock position, anchored so
   the box always sits outside the circle: to the left at 9, above at 12,
   below at 6, and blended in between. */
function pinStyle(clockDeg: number): CSSProperties {
    const rad = (clockDeg * Math.PI) / 180;
    const sx = Math.sin(rad);
    const sy = -Math.cos(rad);
    return {
        left: `calc(50% + ${sx.toFixed(4)} * (50% + ${PIN_GAP}))`,
        top: `calc(50% + ${sy.toFixed(4)} * (50% + ${PIN_GAP}))`,
        transform: `translate(${(-(1 - sx) / 2 * 100).toFixed(2)}%, ${(-(1 - sy) / 2 * 100).toFixed(2)}%)`,
        textAlign: sx > 0.3 ? "left" : sx < -0.3 ? "right" : "center",
        alignItems: sx > 0.3 ? "flex-start" : sx < -0.3 ? "flex-end" : "center",
    };
}

function Caption({ step, active }: { step: StoryStep; active: boolean }) {
    return (
        <p className={`orbit-caption${active ? " is-active" : ""}`}>
            <strong>{step.title}</strong>
            <span>{step.body}</span>
        </p>
    );
}

/* The waitlist orbit, telling the four-step story. `children` (wordmark and
   form) render inside the circle; the tagline and caption slot render under
   it. The dot is driven by rotating the thin ring it rides on: one transform
   write per frame, React state only when the step changes. */
export default function OrbitStory({ children }: { children: ReactNode }) {
    const reducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
    const ringRef = useRef<HTMLDivElement>(null);
    const elapsedRef = useRef(0);
    const activeRef = useRef("");
    /* Pinned captions can overlap in time if two sit closer together than
       VISIBLE_MS allows, so each has its own flag. The narrow slot shows one: the nearest. */
    const [active, setActive] = useState<boolean[]>(() => STORY.map(() => false));
    const [slot, setSlot] = useState(0);

    useEffect(() => {
        const ring = ringRef.current;
        if (!ring) return;
        if (reducedMotion) {
            ring.style.transform = "";
            return;
        }

        const apply = () => {
            const e = elapsedRef.current % LAP_MS;
            const rot = START_DEG + (360 * e) / LAP_MS;
            ring.style.transform = `rotate(${rot}deg)`;

            /* 0° of ring rotation puts the dot at 9 o'clock (270° on the clock). */
            const dotClock = 270 + rot;
            const dists = STORY.map((st) => angularDistance(dotClock, st.clockDeg));
            const next = dists.map((d) => d <= HALF_WINDOW_DEG);
            const nearest = dists.indexOf(Math.min(...dists));

            const key = `${next.map(Number).join("")}:${nearest}`;
            if (key !== activeRef.current) {
                activeRef.current = key;
                setActive(next);
                setSlot(nearest);
            }
        };

        let raf = 0;
        let last: number | null = null;
        const frame = (ts: number) => {
            if (last !== null) elapsedRef.current += Math.min(ts - last, 100);
            last = ts;
            apply();
            raf = requestAnimationFrame(frame);
        };
        const start = () => {
            if (raf) return;
            last = null;
            raf = requestAnimationFrame(frame);
        };
        const stop = () => {
            cancelAnimationFrame(raf);
            raf = 0;
        };
        /* Hidden tab: freeze the clock, so the story resumes where it was
           rather than jumping ahead. */
        const onVisibility = () => (document.hidden ? stop() : start());

        apply();
        if (!document.hidden) start();
        document.addEventListener("visibilitychange", onVisibility);
        return () => {
            stop();
            document.removeEventListener("visibilitychange", onVisibility);
        };
    }, [reducedMotion]);

    const timing = {
        "--orbit-caption-in": `${CAPTION_IN_MS}ms`,
        "--orbit-caption-out": `${CAPTION_OUT_MS}ms`,
    } as CSSProperties;

    return (
        <>
            <div className="wl-orbit" style={timing}>
                <div className="lp-footer-ellipses lp-footer-ellipses--thin" ref={ringRef}>
                    <div className="lp-footer-ellipses lp-footer-ellipses--planet"></div>
                </div>
                <div className="lp-footer-ellipses lp-footer-ellipses--thick"></div>

                {!reducedMotion &&
                    STORY.map((st, i) => (
                        <div key={i} className="orbit-pin" style={pinStyle(st.clockDeg)} aria-hidden="true">
                            <Caption step={st} active={active[i]} />
                        </div>
                    ))}

                {children}
            </div>

            <p className="orbit-tagline">{TAGLINE}</p>

            {reducedMotion ? (
                <ol className="orbit-static" aria-hidden="true">
                    {STORY.map((s, i) => (
                        <li key={i}>
                            <strong>{s.title}</strong> <span>{s.body}</span>
                        </li>
                    ))}
                </ol>
            ) : (
                <div className="orbit-slot" style={timing} aria-hidden="true">
                    {STORY.map((s, i) => (
                        <Caption key={i} step={s} active={slot === i} />
                    ))}
                </div>
            )}

            <ol className="lp-sr-only">
                {STORY.map((s, i) => (
                    <li key={i}>
                        {s.title} {s.body}
                    </li>
                ))}
            </ol>
        </>
    );
}
