import { useCallback, useEffect, useRef, type RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { INITIAL_VALUES, STAGE_COUNT, useStackStore } from "./useStackStore";

gsap.registerPlugin(ScrollTrigger);

const EASE = "power2.inOut";

/* The master timeline. It scrubs over the story element and tweens the shared
 * values object in place; the scene reads that object in useFrame. Nothing
 * here touches React state except the active index, which the DOM needs.
 *
 * Two camera tracks via gsap.matchMedia — portrait is a genuinely different
 * choreography, not a scaled one.
 */
export function useStackTimeline(storyRef: RefObject<HTMLElement | null>) {
  const setActiveIndex = useStackStore((s) => s.setActiveIndex);
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const story = storyRef.current;
    if (!story) return;

    const values = useStackStore.getState().values;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // ─── Lenis, driven from GSAP's ticker so the two never fight ───
    let lenis: Lenis | null = null;
    let raf: ((time: number) => void) | null = null;
    if (!reduced) {
      lenis = new Lenis({ autoRaf: false, duration: 1.1 });
      lenisRef.current = lenis;
      lenis.on("scroll", ScrollTrigger.update);
      raf = (time: number) => lenis?.raf(time * 1000);
      gsap.ticker.add(raf);
      gsap.ticker.lagSmoothing(0);
    }

    const media = gsap.matchMedia();

    const buildTimeline = (track: {
      th: number[];
      ph: number[];
      r: number[];
      y: number[];
    }) => {
      Object.assign(values, INITIAL_VALUES);

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: story,
          start: "top top",
          end: "bottom bottom",
          scrub: reduced ? true : 1,
          onUpdate: (self) => {
            values.progress = self.progress;
            setActiveIndex(Math.round(self.progress * (STAGE_COUNT - 1)));
          },
        },
      });

      const shot = (i: number) => ({
        th: track.th[i],
        ph: track.ph[i],
        r: track.r[i],
        y: track.y[i],
      });

      /* Six tweens for seven stages — stage 00 is the timeline's start state. */
      timeline
        .to(values, { align: 1, ctx: 1, ...shot(0), ease: EASE, duration: 1 })
        .to(values, { agent: 1, ...shot(1), ease: EASE, duration: 1 })
        .to(values, { app: 1, ...shot(2), ease: EASE, duration: 1 })
        .to(values, { gov: 1, srcDim: 1, ...shot(3), ease: EASE, duration: 1 })
        .to(values, { rev: 1, ...shot(4), ease: EASE, duration: 1 })
        .to(values, { loop: 1, ...shot(5), ease: EASE, duration: 1 });

      return () => {
        timeline.scrollTrigger?.kill();
        timeline.kill();
      };
    };

    media.add("(min-width: 901px)", () =>
      buildTimeline({
        th: [-0.8, -0.44, -0.92, -0.4, -0.88, -0.6],
        ph: [1.1, 1.1, 1.1, 1.1, 1.1, 0.92],
        r: [13.0, 14.0, 15.0, 16.0, 17.0, 24.0],
        y: [2.6, 1.1, -0.5, -2.1, -3.6, -1.3],
      }),
    );

    /* Portrait is a different choreography, not a scaled one.
       Less orbit (the stack barely rotates — sideways motion reads as wobble
       on a short canvas), more vertical dolly (y tracks the live layer more
       closely than desktop), and further back: the canvas is 58vh of a
       portrait viewport, so horizontal FOV is the binding constraint and the
       5.4-wide slabs need more distance than desktop, not less. */
    media.add("(max-width: 900px)", () =>
      buildTimeline({
        th: [-0.58, -0.54, -0.62, -0.54, -0.6, -0.56],
        ph: [1.04, 1.04, 1.04, 1.04, 1.04, 0.96],
        r: [13.0, 13.6, 14.2, 15.0, 15.8, 22.0],
        y: [2.9, 1.4, -0.3, -2.3, -4.0, -1.1],
      }),
    );

    const onResize = () => ScrollTrigger.refresh();
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      media.revert();
      if (raf) gsap.ticker.remove(raf);
      lenis?.destroy();
      lenisRef.current = null;
    };
  }, [storyRef, setActiveIndex]);

  /* Rail jumps. Native scrollTo fights Lenis while it is running, so route
     through it when it exists and fall back to the browser when it does not
     (reduced motion). */
  return useCallback(
    (index: number) => {
      const act = storyRef.current?.children[index] as HTMLElement | undefined;
      const top = act
        ? act.getBoundingClientRect().top + window.scrollY
        : index * window.innerHeight;
      if (lenisRef.current) lenisRef.current.scrollTo(top);
      else window.scrollTo({ top, behavior: "smooth" });
    },
    [storyRef],
  );
}
