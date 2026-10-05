import { useMediaQuery } from "../hooks/useMediaQuery";

/* Cinematic loop generated with Veo (Veo 3.1, 720p source), cut to a seamless
   7s loop with a 1s crossfade and graded toward the page black. The source is
   720p, so the large size is 1280 rather than an upscaled 1920. */
const DIR = "/media/consulting-hero-veo";

/* Decorative: the headline carries the message, so the video is hidden from
   screen readers and holds on its poster under reduced motion. */
export default function ConsultingHeroVisual() {
    const reducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");

    return (
        <div className="cons-hero-video" aria-hidden="true">
            <video
                key={reducedMotion ? "still" : "loop"}
                autoPlay={!reducedMotion}
                muted
                loop
                playsInline
                preload="metadata"
                poster={`${DIR}/hero-poster.webp`}
            >
                <source media="(max-width: 900px)" src={`${DIR}/hero-960.webm`} type="video/webm" />
                <source media="(max-width: 900px)" src={`${DIR}/hero-960.mp4`} type="video/mp4" />
                <source src={`${DIR}/hero-1280.webm`} type="video/webm" />
                <source src={`${DIR}/hero-1280.mp4`} type="video/mp4" />
            </video>
        </div>
    );
}
