import { useEffect, useRef } from 'react';

interface ParticleFieldProps {
    /* "page" pins the field to the viewport behind the whole document;
       "box" fills the nearest positioned ancestor. */
    mode?: 'page' | 'box';
    particleCount?: number;
    opacity?: number;
}

const PARTICLE_COLOR = { r: 26, g: 179, b: 148 };
const MOUSE_RADIUS = 150;

interface Particle {
    x: number;
    y: number;
    size: number;
    baseX: number;
    baseY: number;
    density: number;
    alpha: number;
}

export default function ParticleField({
    mode = 'box',
    particleCount = 800,
    opacity = 0.8,
}: ParticleFieldProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const host: HTMLElement | Window = mode === 'page' ? window : (canvas.parentElement ?? window);
        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        const measure = () => mode === 'page'
            ? { w: window.innerWidth, h: window.innerHeight }
            : {
                w: canvas.parentElement?.clientWidth || window.innerWidth,
                h: canvas.parentElement?.clientHeight || window.innerHeight,
            };

        let { w: width, h: height } = measure();
        canvas.width = width;
        canvas.height = height;

        let particles: Particle[] = [];
        let mouse = { x: -1000, y: -1000 };
        let frame = 0;
        /* The field is static until something disturbs it, so the loop parks
           itself once every particle is home. A pointer move wakes it. */
        let running = false;

        const init = () => {
            particles = [];
            for (let i = 0; i < particleCount; i++) {
                const x = Math.random() * width;
                const y = Math.random() * height;
                particles.push({
                    x,
                    y,
                    size: Math.random() * 2 + 1,
                    baseX: x,
                    baseY: y,
                    density: Math.random() * 30 + 1,
                    alpha: Math.random() * 0.5 + 0.2,
                });
            }
        };

        const draw = () => {
            ctx.clearRect(0, 0, width, height);
            for (const p of particles) {
                ctx.fillStyle = `rgba(${PARTICLE_COLOR.r}, ${PARTICLE_COLOR.g}, ${PARTICLE_COLOR.b}, ${p.alpha})`;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.closePath();
                ctx.fill();
            }
        };

        /* Returns whether anything is still moving, which is what decides if
           the next frame is worth scheduling. */
        const step = () => {
            let settled = true;

            for (const p of particles) {
                const dx = mouse.x - p.x;
                const dy = mouse.y - p.y;
                const distance = Math.hypot(dx, dy);

                if (distance < MOUSE_RADIUS) {
                    const force = (MOUSE_RADIUS - distance) / MOUSE_RADIUS;
                    p.x -= (dx / distance) * force * p.density;
                    p.y -= (dy / distance) * force * p.density;
                    p.alpha = Math.min(p.alpha + 0.05, 1);
                    settled = false;
                    continue;
                }

                const homeX = p.x - p.baseX;
                const homeY = p.y - p.baseY;
                if (Math.abs(homeX) > 0.1 || Math.abs(homeY) > 0.1) {
                    p.x -= homeX / 10;
                    p.y -= homeY / 10;
                    settled = false;
                } else {
                    p.x = p.baseX;
                    p.y = p.baseY;
                }

                if (p.alpha > 0.2) {
                    p.alpha = Math.max(p.alpha - 0.01, 0.2);
                    settled = false;
                }
            }

            return settled;
        };

        const animate = () => {
            const settled = step();
            draw();
            if (settled) {
                running = false;
                return;
            }
            frame = requestAnimationFrame(animate);
        };

        const wake = () => {
            if (running || reduceMotion || document.hidden) return;
            running = true;
            frame = requestAnimationFrame(animate);
        };

        init();
        draw();

        const handlePointerMove = (e: PointerEvent) => {
            if (mode === 'page') {
                mouse.x = e.clientX;
                mouse.y = e.clientY;
            } else {
                const rect = canvas.getBoundingClientRect();
                mouse.x = e.clientX - rect.left;
                mouse.y = e.clientY - rect.top;
            }
            wake();
        };

        const handlePointerLeave = () => {
            mouse.x = -1000;
            mouse.y = -1000;
            wake();
        };

        const handleResize = () => {
            const { w, h } = measure();
            if (w === width && h === height) return;
            width = canvas.width = w;
            height = canvas.height = h;
            init();
            draw();
        };

        const handleVisibility = () => {
            if (document.hidden) {
                cancelAnimationFrame(frame);
                running = false;
            } else {
                wake();
            }
        };

        if (!reduceMotion) {
            host.addEventListener('pointermove', handlePointerMove as EventListener);
            host.addEventListener('pointerleave', handlePointerLeave as EventListener);
            document.addEventListener('visibilitychange', handleVisibility);
        }
        window.addEventListener('resize', handleResize);

        /* A box-mode host grows as fonts load and copy reflows, so a window
           resize listener alone would leave the field sized to the wrong box. */
        const observer = mode === 'box' && canvas.parentElement
            ? new ResizeObserver(handleResize)
            : null;
        if (observer && canvas.parentElement) observer.observe(canvas.parentElement);

        return () => {
            host.removeEventListener('pointermove', handlePointerMove as EventListener);
            host.removeEventListener('pointerleave', handlePointerLeave as EventListener);
            document.removeEventListener('visibilitychange', handleVisibility);
            window.removeEventListener('resize', handleResize);
            observer?.disconnect();
            cancelAnimationFrame(frame);
        };
    }, [mode, particleCount]);

    return (
        <canvas
            ref={canvasRef}
            aria-hidden="true"
            className={mode === 'page' ? 'lp-particle-field' : undefined}
            style={{
                position: mode === 'page' ? 'fixed' : 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                pointerEvents: 'none',
                zIndex: 0,
                opacity,
            }}
        />
    );
}
