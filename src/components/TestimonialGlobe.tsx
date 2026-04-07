import { useEffect, useState } from "react";
import { Globe } from "./ui/cobe-globe";

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

const globeMarkers = [
  { id: "sf", location: [37.7595, -122.4367] as [number, number], label: "San Francisco" },
  { id: "nyc", location: [40.7128, -74.006] as [number, number], label: "New York" },
  { id: "tokyo", location: [35.6762, 139.6503] as [number, number], label: "Tokyo" },
  { id: "london", location: [51.5074, -0.1278] as [number, number], label: "London" },
  { id: "sydney", location: [-33.8688, 151.2093] as [number, number], label: "Sydney" },
  { id: "capetown", location: [-33.9249, 18.4241] as [number, number], label: "Cape Town" },
  { id: "dubai", location: [25.2048, 55.2708] as [number, number], label: "Dubai" },
  { id: "paris", location: [48.8566, 2.3522] as [number, number], label: "Paris" },
  { id: "saopaulo", location: [-23.5505, -46.6333] as [number, number], label: "São Paulo" },
];

const globeArcs = [
  {
    id: "sf-tokyo",
    from: [37.7595, -122.4367] as [number, number],
    to: [35.6762, 139.6503] as [number, number],
    label: "SF → Tokyo"
  },
  {
    id: "nyc-london",
    from: [40.7128, -74.006] as [number, number],
    to: [51.5074, -0.1278] as [number, number],
    label: "NYC → London"
  },
];

export default function TestimonialGlobe() {
    const [activeIndex, setActiveIndex] = useState(0);

    // Auto-scroll testimonials
    useEffect(() => {
        const interval = setInterval(() => {
            setActiveIndex((prev) => (prev + 1) % testimonialsSource.length);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    const active = testimonialsSource[activeIndex];

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

                    <div className="tg-active-testimonial-card shadow-premium" style={{ minHeight: '300px' }}>
                        <div className="tg-card-top-row">
                            <div className="tg-quote-section-group">
                                <div className="tg-quote-icon-large">“</div>
                                <div className="tg-card-meta-below">
                                    <span className="tg-quote-number">#{String(activeIndex + 1).padStart(2, '0')} / 08</span>
                                    <span className="tg-pulse-indicator"></span>
                                </div>
                            </div>
                        </div>

                        <p className="tg-main-quote">
                            {active.quote}
                        </p>

                        <div className="tg-main-client">
                            <div className="tg-pulsing-orb">
                                <span className="tg-orb-initials">{active.initials}</span>
                            </div>
                            <div className="tg-client-details">
                                <strong>{active.name}</strong>
                                <span>{active.title}</span>
                                <span className="tg-client-metric">{active.metric}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right: Interactive 3D Globe */}
                <div className="tg-globe-side" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Globe 
                        markers={globeMarkers}
                        arcs={globeArcs}
                        className="w-full max-w-lg"
                        markerColor={[0.3, 0.45, 0.85]}
                        baseColor={[1, 1, 1]}
                        arcColor={[0.3, 0.45, 0.85]}
                        glowColor={[0.94, 0.93, 0.91]}
                        dark={0}
                        mapBrightness={10}
                        markerSize={0.025}
                        markerElevation={0.01}
                    />
                </div>
            </div>
        </section>
    );
}
