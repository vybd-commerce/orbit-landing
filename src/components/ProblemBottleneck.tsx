import React, { useState, useEffect, useRef } from 'react';
import '../pages/LandingPage.css';

const problemsData = [
    {
        id: '001',
        title: 'Scattered Consultants',
        subtitle: '"Six vendors, zero coordination"',
        desc: 'You hire a compliance firm, a 3PL, a marketing agency, and an Amazon specialist — and then spend all your time on coordination calls. The cost of misalignment falls on you.',
        issues: [
            'No single point of accountability',
            'Optimised individually, not for your outcome',
            '4–6 months to get everything aligned'
        ],
        color: 'var(--lp-surface-variant)', 
        activeColor: 'rgba(26, 179, 148, 0.15)',
        borderColor: 'var(--lp-outline)',
        activeBorderColor: 'var(--lp-primary)'
    },
    {
        id: '002',
        title: 'Full DIY',
        subtitle: '"I\'ll figure it out myself"',
        desc: 'FDA filings, tariff codes, warehouse contracts, Amazon PPC — you\'re doing six jobs none of which is building your brand. Compliance errors are costly.',
        issues: [
            'Founders burn out on logistics',
            'Compliance mistakes cost $50K+',
            'No leverage — every task is manual'
        ],
        color: 'var(--lp-surface-variant)', 
        activeColor: 'rgba(26, 179, 148, 0.15)',
        borderColor: 'var(--lp-outline)',
        activeBorderColor: 'var(--lp-primary)'
    },
    {
        id: '003',
        title: 'Single-Function Providers',
        subtitle: '"Great at one thing, blind to the rest"',
        desc: 'You find a best-in-class 3PL and a great compliance partner — then discover they\'ve never worked together. Vendor count is down, but not coordination.',
        issues: [
            'Handoff gaps fall through the cracks',
            'Difficult to pivot when one part breaks',
            'Still running 4 projects instead of 6'
        ],
        color: 'var(--lp-surface-variant)', 
        activeColor: 'rgba(26, 179, 148, 0.15)',
        borderColor: 'var(--lp-outline)',
        activeBorderColor: 'var(--lp-primary)'
    }
];

export default function ProblemBottleneck() {
    const [activeId, setActiveId] = useState<string | null>(null);
    const [userInteracted, setUserInteracted] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    // Intersection + Interval mapped automation logic
    useEffect(() => {
        let interval: ReturnType<typeof setInterval> | null = null;
        let observer: IntersectionObserver | null = null;

        const startAutoplay = () => {
            if (interval || userInteracted || isHovered) return;
            interval = setInterval(() => {
                setActiveId(prev => {
                    if (!prev) return problemsData[0].id;
                    const idx = problemsData.findIndex(p => p.id === prev);
                    return problemsData[(idx + 1) % problemsData.length].id;
                });
            }, 6000); // 6s to read text
        };

        const stopAutoplay = () => {
            if (interval) {
                clearInterval(interval);
                interval = null;
            }
        };

        if (!userInteracted && !isHovered) {
            observer = new IntersectionObserver(([entry]) => {
                if (entry.isIntersecting) {
                    startAutoplay();
                } else {
                    stopAutoplay();
                }
            }, { threshold: 0.5 });
            
            if (containerRef.current) observer.observe(containerRef.current);
        } else {
            stopAutoplay();
        }

        return () => {
            stopAutoplay();
            if (observer) observer.disconnect();
        };
    }, [userInteracted, isHovered]);

    const handleBubbleClick = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        setUserInteracted(true);
        if (activeId === id) {
            setActiveId(null);
        } else {
            setActiveId(id);
        }
    };

    return (
        <div 
            className="lp-bottleneck-container" 
            ref={containerRef}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <svg className="lp-bottleneck-svg" viewBox="0 0 1000 400" preserveAspectRatio="none">
                {/* Hand-drawn style bottleneck lines - Wider funnel, wider neck stopping at mid-body */}
                <path d="M 0,10 C 250,90 350,110 550,110" fill="none" stroke="var(--lp-on-surface)" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" className="lp-bottleneck-line" />
                <path d="M 0,390 C 250,310 350,290 550,290" fill="none" stroke="var(--lp-on-surface)" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" className="lp-bottleneck-line" />
            </svg>

            <div className="lp-bottleneck-track">
                {problemsData.map((problem, index) => {
                    const isActive = activeId === problem.id;
                    const hasActive = activeId !== null;
                    const isFaded = hasActive && !isActive;

                    return (
                        <div
                            key={problem.id}
                            className={`lp-bottleneck-bubble ${isActive ? 'active' : ''} ${isFaded ? 'faded' : ''}`}
                            style={{
                                '--bubble-color': problem.color,
                                '--active-color': problem.activeColor,
                                '--index-offset': index,
                                '--border-color': problem.borderColor,
                                '--active-border': problem.activeBorderColor
                            } as React.CSSProperties}
                            onClick={(e) => handleBubbleClick(problem.id, e)}
                        >
                            <div className="lp-bottleneck-bubble-inner">
                                {/* Short form when inactive */}
                                <div className="lp-bottleneck-bubble-short">
                                    <span className="lp-bubble-id">{problem.id}</span>
                                    <h4 className="lp-bubble-title-short">{problem.title}</h4>
                                </div>

                                {/* Expanded form when active */}
                                <div className="lp-bottleneck-bubble-expanded">
                                    <span className="lp-bubble-id-large">{problem.id}</span>
                                    <h3 className="lp-bubble-title">{problem.title}</h3>
                                    <div className="lp-bubble-subtitle">{problem.subtitle}</div>
                                    <p className="lp-bubble-desc">{problem.desc}</p>
                                    <ul className="lp-bubble-issues">
                                        {problem.issues.map((issue, i) => (
                                            <li key={i}><span className="lp-issue-dash">—</span> {issue}</li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    );
                })}

                {!activeId && (
                    <div className="lp-bottleneck-hint">
                        Click a bottleneck to expand
                    </div>
                )}
            </div>
        </div>
    );
}
