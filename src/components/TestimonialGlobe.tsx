import { useEffect, useRef, useCallback } from "react";

const N = 80;
const RADIUS = 230;

interface TestimonialData {
    id: number;
    quote: string;
    name: string;
    title: string;
    initials: string;
    metric: string;
}

const testimonialsSource = [
    {
        name: "Keshida Layone",
        initials: "KL",
        quote: "There's a particular kind of silence when your work is good and no one who can afford it knows you exist. Orbit broke that silence. Not with noise — with precision. The right eyes found me. The rest followed.",
        title: "Visual Artist & Founder, Fine Art Brand — USA",
        metric: "→ First international collector sales, week three"
    },
    {
        name: "Bayangrom",
        initials: "B",
        quote: "The brand was alive. The orders were coming. But the backend was swallowing us whole. Orbit took the weight — literally. Warehousing, shipping, fulfilment — handled. We got back to building, not firefighting.",
        title: "Founder, Cultural Streetwear Brand — India",
        metric: "→ Fulfilment time cut from 12 days to 3"
    },
    {
        name: "Emsworth Terry Cotton",
        initials: "ETC",
        quote: "We didn't need someone to just sell for us. We needed to understand the room — who was already in it, what they were charging, where the gap was. Orbit came back with answers we hadn't thought to ask for. We positioned around them and it landed exactly right.",
        title: "Founder, Premium Cotton Goods Brand — UK",
        metric: "→ Wholesale enquiries up 4x, month two"
    },
    {
        name: "Karama",
        initials: "K",
        quote: "Every market has a language. Ours didn't translate — not because the brand wasn't strong, but because we were speaking to people who didn't have the context yet. Orbit built that bridge. Same brand, new conversation.",
        title: "Creative Director, Fashion Brand — USA",
        metric: "→ First international stockist secured, week six"
    },
    {
        name: "Ji-Hoon K.",
        initials: "JK",
        quote: "We'd been trying to crack the US market for eighteen months. We had a great product, a team that believed in it, and no idea how to navigate FDA requirements at the same time as an Amazon launch. Orbit had us live in twelve days. I still don't fully understand how they moved that fast.",
        title: "Founder, Premium Skincare Brand — Seoul, Korea",
        metric: "→ $82K US revenue, month one"
    },
    {
        name: "Priya M.",
        initials: "PM",
        quote: "We went from zero US presence to $40K in revenue in our first month. I didn't have to think about warehousing or Amazon once.",
        title: "CEO, Home Goods Brand — Bangalore, India",
        metric: "→ $40K US revenue, month one"
    },
    {
        name: "Lucas M.",
        initials: "LM",
        quote: "Compliance in the US is a massive roadblock for European health tech. We anticipated six months of deep legal review before even seeing a customer. Orbit's native infrastructure bypassed the friction completely—we were fully compliant and selling in under three weeks.",
        title: "Director of Ops, HealthTech Brand — Berlin, Germany",
        metric: "→ US market entry accelerated by 5 months"
    },
    {
        name: "Elena S.",
        initials: "ES",
        quote: "Scaling into North America felt like a gamble until we found Orbit. They didn't just provide a platform; they provided a roadmap. The level of operational detail they handle allowed us to focus entirely on the creative side of the brand.",
        title: "Founder, Sustainable Decor Brand — Mexico City, Mexico",
        metric: "→ 3x growth in North American reach, quarter one"
    }
];

const testimonialsData: TestimonialData[] = [];
for (let i = 0; i < N; i++) {
    const source = testimonialsSource[i % testimonialsSource.length];
    testimonialsData.push({
        id: (i % testimonialsSource.length) + 1,
        quote: source.quote,
        name: source.name,
        title: source.title,
        initials: source.initials,
        metric: source.metric,
    });
}

const phi = Math.PI * (3 - Math.sqrt(5));

interface TileData {
    el: HTMLDivElement | null;
    lat: number;
    lon: number;
    index: number;
}

export default function TestimonialGlobe() {
    const sphereRef = useRef<HTMLDivElement>(null);
    const sceneRef = useRef<HTMLDivElement>(null);
    const tilesRef = useRef<TileData[]>([]);
    const activeTileRef = useRef<HTMLDivElement | null>(null);
    const animFrameRef = useRef<number>(0);

    const rotRef = useRef({ x: -10, y: 0 });
    const dragRef = useRef({ isDragging: false, startX: 0, startY: 0, startRotX: -10, startRotY: 0 });

    const indexRef = useRef<HTMLSpanElement>(null);
    const quoteRef = useRef<HTMLParagraphElement>(null);
    const nameRef = useRef<HTMLElement>(null);
    const titleRef = useRef<HTMLSpanElement>(null);
    const initialsRef = useRef<HTMLSpanElement>(null);
    const metricRef = useRef<HTMLSpanElement>(null);

    const updateCard = useCallback((index: number) => {
        const data = testimonialsData[index];
        if (indexRef.current) indexRef.current.innerText = `#0${data.id} / 08`;
        if (quoteRef.current) quoteRef.current.innerText = data.quote;
        if (nameRef.current) nameRef.current.innerText = data.name;
        if (titleRef.current) titleRef.current.innerText = data.title;
        if (initialsRef.current) initialsRef.current.innerText = data.initials;
        if (metricRef.current) metricRef.current.innerText = data.metric;
    }, []);

    useEffect(() => {
        const sphere = sphereRef.current;
        const scene = sceneRef.current;
        if (!sphere || !scene) return;

        // Clear any existing tiles
        sphere.innerHTML = "";
        tilesRef.current = [];

        // Build tiles
        for (let i = 0; i < N; i++) {
            const y = 1 - (i / (N - 1)) * 2;
            Math.sqrt(1 - y * y); // radial distance (used implicitly in lat/lon calc)
            const theta = phi * i;
            const lat = Math.asin(y) * (180 / Math.PI);
            const lon = theta * (180 / Math.PI);

            const rootEl = document.createElement("div");
            rootEl.className = "tg-globe-tile";
            rootEl.style.transform = `rotateY(${lon}deg) rotateX(${lat}deg) translateZ(${RADIUS}px)`;
            rootEl.dataset.lat = String(lat);
            rootEl.dataset.lon = String(lon);

            const inner = document.createElement("div");
            inner.className = "tg-tile-inner";
            rootEl.appendChild(inner);

            sphere.appendChild(rootEl);
            tilesRef.current.push({ el: rootEl, lat, lon, index: i });
        }

        // Drag handlers
        const onMouseDown = (e: MouseEvent) => {
            dragRef.current.isDragging = true;
            dragRef.current.startX = e.clientX;
            dragRef.current.startY = e.clientY;
            dragRef.current.startRotX = rotRef.current.x;
            dragRef.current.startRotY = rotRef.current.y;
        };

        const onMouseMove = (e: MouseEvent) => {
            if (!dragRef.current.isDragging) return;
            const deltaX = e.clientX - dragRef.current.startX;
            const deltaY = e.clientY - dragRef.current.startY;
            rotRef.current.y = dragRef.current.startRotY + deltaX * 0.4;
            rotRef.current.x = Math.max(-85, Math.min(85, dragRef.current.startRotX - deltaY * 0.4));
        };

        const onMouseUp = () => { dragRef.current.isDragging = false; };

        // Touch handlers
        const onTouchStart = (e: TouchEvent) => {
            if (e.touches.length !== 1) return;
            dragRef.current.isDragging = true;
            dragRef.current.startX = e.touches[0].clientX;
            dragRef.current.startY = e.touches[0].clientY;
            dragRef.current.startRotX = rotRef.current.x;
            dragRef.current.startRotY = rotRef.current.y;
        };

        const onTouchMove = (e: TouchEvent) => {
            if (!dragRef.current.isDragging || e.touches.length !== 1) return;
            const deltaX = e.touches[0].clientX - dragRef.current.startX;
            const deltaY = e.touches[0].clientY - dragRef.current.startY;
            rotRef.current.y = dragRef.current.startRotY + deltaX * 0.4;
            rotRef.current.x = Math.max(-85, Math.min(85, dragRef.current.startRotX - deltaY * 0.4));
        };

        const onTouchEnd = () => { dragRef.current.isDragging = false; };

        scene.addEventListener("mousedown", onMouseDown);
        window.addEventListener("mousemove", onMouseMove);
        window.addEventListener("mouseup", onMouseUp);
        window.addEventListener("mouseleave", onMouseUp);
        scene.addEventListener("touchstart", onTouchStart, { passive: true });
        window.addEventListener("touchmove", onTouchMove, { passive: true });
        window.addEventListener("touchend", onTouchEnd);

        // Animation loop
        const tick = () => {
            if (!dragRef.current.isDragging) {
                rotRef.current.y -= 0.15;
            }

            sphere.style.transform = `rotateX(${rotRef.current.x}deg) rotateY(${rotRef.current.y}deg)`;

            let minOffset = Infinity;
            let winner: TileData | null = null;

            for (let i = 0; i < tilesRef.current.length; i++) {
                const t = tilesRef.current[i];
                let visualLon = (t.lon + rotRef.current.y) % 360;
                if (visualLon > 180) visualLon -= 360;
                if (visualLon < -180) visualLon += 360;

                let visualLat = (t.lat + rotRef.current.x) % 360;
                if (visualLat > 180) visualLat -= 360;
                if (visualLat < -180) visualLat += 360;

                const dist = Math.sqrt(visualLon * visualLon + visualLat * visualLat);
                if (dist < minOffset) {
                    minOffset = dist;
                    winner = t;
                }
            }

            if (winner && winner.el && winner.el !== activeTileRef.current) {
                if (activeTileRef.current) activeTileRef.current.classList.remove("active");
                winner.el.classList.add("active");
                activeTileRef.current = winner.el;
                updateCard(winner.index);
            }

            animFrameRef.current = requestAnimationFrame(tick);
        };

        tick();

        return () => {
            cancelAnimationFrame(animFrameRef.current);
            scene.removeEventListener("mousedown", onMouseDown);
            window.removeEventListener("mousemove", onMouseMove);
            window.removeEventListener("mouseup", onMouseUp);
            window.removeEventListener("mouseleave", onMouseUp);
            scene.removeEventListener("touchstart", onTouchStart);
            window.removeEventListener("touchmove", onTouchMove);
            window.removeEventListener("touchend", onTouchEnd);
        };
    }, [updateCard]);

    return (
        <section className="tg-globe-section" id="testimonial-globe">
            <div className="tg-dual-panel">
                {/* Left: Text + Active Testimonial Card */}
                <div className="tg-content-side">
                    <header className="tg-grid-header">
                        <span className="tg-orbit-label">Global Impact ↗</span>
                        <h2 className="tg-orbit-heading">Built around companies that move the world</h2>
                        <p className="tg-orbit-sub">
                            Spin the world. Our clients left something for you.
                        </p>
                    </header>

                    <div className="tg-active-testimonial-card shadow-premium">
                        <div className="tg-card-top-row">
                            <div className="tg-quote-section-group">
                                <div className="tg-quote-icon-large">“</div>
                                <div className="tg-card-meta-below">
                                    <span className="tg-quote-number" ref={indexRef}>#01 / 08</span>
                                    <span className="tg-pulse-indicator"></span>
                                </div>
                            </div>
                        </div>

                        <p className="tg-main-quote" ref={quoteRef}>
                            The brand was alive. The orders were coming. But the backend was swallowing us whole. Orbit took the weight — literally. 
                        </p>

                        <div className="tg-main-client">
                            <div className="tg-pulsing-orb">
                                <span className="tg-orb-initials" ref={initialsRef}>KL</span>
                            </div>
                            <div className="tg-client-details">
                                <strong ref={nameRef}>Keshida Layone</strong>
                                <span ref={titleRef}>Visual Artist & Founder, Fine Art Brand — USA</span>
                                <span className="tg-client-metric" ref={metricRef}>→ First international collector sales, week three</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right: Interactive 3D Globe */}
                <div className="tg-globe-side">
                    <div className="tg-drag-instruction">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M5 12h14M12 5l-7 7 7 7" />
                        </svg>
                        Drag to rotate
                    </div>

                    <div className="tg-scene" ref={sceneRef}>
                        <div className="tg-sphere" ref={sphereRef}></div>
                    </div>
                </div>
            </div>
        </section>
    );
}
