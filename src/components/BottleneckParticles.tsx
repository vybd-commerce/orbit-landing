import { useEffect, useRef, useImperativeHandle, forwardRef } from "react";

export interface BottleneckParticlesRef {
    burst: (x: number, y: number, color: string) => void;
}

interface Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    size: number;
    alpha: number;
    color: string;
    isBurst?: boolean;
    decay?: number;
    phase?: number; // for breathing logic
}

const FUNNEL_PARTICLE_COUNT = 2000;

const BottleneckParticles = forwardRef<BottleneckParticlesRef>((_, ref) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const particlesRef = useRef<Particle[]>([]);
    const animIdRef = useRef<number>(0);
    const tickRef = useRef<number>(0);

    useImperativeHandle(ref, () => ({
        burst: (x, y, color) => {
            // Add fast-moving burst particles
            const burstParticles: Particle[] = [];
            for (let i = 0; i < 200; i++) {
                const angle = Math.random() * Math.PI * 2;
                const speed = Math.random() * 12 + 2; 
                burstParticles.push({
                    x,
                    y,
                    vx: Math.cos(angle) * speed,
                    vy: Math.sin(angle) * speed,
                    size: Math.random() * 5 + 1.5,
                    alpha: 1,
                    color, // this is a hex or rgb string, canvas will accept it via globalAlpha
                    isBurst: true,
                    decay: Math.random() * 0.03 + 0.015
                });
            }
            particlesRef.current.push(...burstParticles);
        }
    }));

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let w = canvas.parentElement?.offsetWidth || 1140;
        let h = canvas.parentElement?.offsetHeight || 400;
        canvas.width = w;
        canvas.height = h;

        // Initialize funnel blocking particles
        const initFunnelParticles = () => {
             const pts: Particle[] = [];
             for (let i = 0; i < FUNNEL_PARTICLE_COUNT; i++) {
                 // Constrain strictly inside the bounding curve
                 const px = Math.random() * 520;
                 const yTop = 110 - 100 * Math.pow(1 - px / 550, 2);
                 const yBot = 290 + 100 * Math.pow(1 - px / 550, 2);
                 const py = yTop + Math.random() * (yBot - yTop);

                 pts.push({
                     x: px,
                     y: py,
                     vx: (Math.random() - 0.5) * 0.4,
                     vy: (Math.random() - 0.5) * 0.4,
                     size: Math.random() * 2.5 + 0.5,
                     alpha: Math.random() * 0.4 + 0.1,
                     color: 'rgba(50, 50, 50, 0.4)', // dark greyish blockages
                     isBurst: false,
                     phase: Math.random() * Math.PI * 2
                 });
             }
             particlesRef.current = pts;
        };

        const draw = () => {
            tickRef.current++;
            ctx.clearRect(0, 0, w, h);
            
            const nextParticles = [];

            for (let i = 0; i < particlesRef.current.length; i++) {
                const p = particlesRef.current[i];

                if (p.isBurst) {
                    p.x += p.vx;
                    p.y += p.vy;
                    p.alpha -= p.decay!;
                    if (p.alpha > 0) {
                        ctx.beginPath();
                        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                        ctx.globalAlpha = p.alpha;
                        ctx.fillStyle = p.color;
                        ctx.fill();
                        ctx.globalAlpha = 1;
                        nextParticles.push(p);
                    }
                } else {
                    // Breathing blockages
                    p.x += p.vx;
                    p.y += p.vy;

                    // Soft bounce strictly within funnel bounds
                    const yTopInfo = 110 - 100 * Math.pow(1 - p.x / 550, 2);
                    const yBotInfo = 290 + 100 * Math.pow(1 - p.x / 550, 2);

                    if (p.x < 0) { p.x = 0; p.vx *= -1; }
                    if (p.x > 530) { p.x = 530; p.vx *= -1; }
                    if (p.y < yTopInfo + p.size) { p.y = yTopInfo + p.size; p.vy *= -1; }
                    if (p.y > yBotInfo - p.size) { p.y = yBotInfo - p.size; p.vy *= -1; } 

                    // Breathing opacity size
                    const breatheAlpha = p.alpha + Math.sin(tickRef.current * 0.02 + p.phase!) * 0.15;
                    const displayAlpha = Math.max(0, Math.min(1, breatheAlpha));
                    
                    ctx.beginPath();
                    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                    ctx.fillStyle = p.color;
                    ctx.globalAlpha = displayAlpha;
                    ctx.fill();
                    ctx.globalAlpha = 1;
                    
                    nextParticles.push(p);
                }
            }

            particlesRef.current = nextParticles;
            animIdRef.current = requestAnimationFrame(draw);
        };

        initFunnelParticles();
        draw();

        const handleResize = () => {
             w = canvas.parentElement?.offsetWidth || 1140;
             h = canvas.parentElement?.offsetHeight || 400;
             canvas.width = w;
             canvas.height = h;
             
             const bgCount = particlesRef.current.filter(p => !p.isBurst).length;
             if (bgCount < FUNNEL_PARTICLE_COUNT) {
                 const bursts = particlesRef.current.filter(p => p.isBurst);
                 initFunnelParticles();
                 particlesRef.current = [...particlesRef.current, ...bursts];
             }
        };

        window.addEventListener('resize', handleResize);

        return () => {
            cancelAnimationFrame(animIdRef.current);
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="lp-bottleneck-canvas-overlay"
            style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                pointerEvents: 'none',
                zIndex: 1 // below bubbles, visually blocked inside funnel
            }}
        />
    );
});

export default BottleneckParticles;
