import { PropsWithChildren, useEffect, useRef } from 'react';
import '../../css/auth/auth.css';

export default function GuestLayout({ children }: PropsWithChildren) {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        // Apply guest-page class to body to scope background and fonts
        document.body.classList.add('guest-page');

        // Particle animation setup
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let W = (canvas.width = window.innerWidth);
        let H = (canvas.height = window.innerHeight);

        const handleResize = () => {
            if (!canvas) return;
            W = canvas.width = window.innerWidth;
            H = canvas.height = window.innerHeight;
        };
        window.addEventListener('resize', handleResize);

        const COLORS = ['#1a56db', '#2563eb', '#f59e0b', '#0d9488', '#6366f1'];
        const particles: Array<{
            x: number;
            y: number;
            r: number;
            dx: number;
            dy: number;
            alpha: number;
            color: string;
        }> = [];

        for (let i = 0; i < 55; i++) {
            particles.push({
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
                r: Math.random() * 3.5 + 1,
                dx: (Math.random() - 0.5) * 0.5,
                dy: (Math.random() - 0.5) * 0.5,
                alpha: Math.random() * 0.35 + 0.08,
                color: COLORS[Math.floor(Math.random() * COLORS.length)],
            });
        }

        let animationFrameId: number;

        const drawParticles = () => {
            if (!ctx) return;
            ctx.clearRect(0, 0, W, H);
            particles.forEach((p) => {
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fillStyle = p.color;
                ctx.globalAlpha = p.alpha;
                ctx.fill();
                p.x += p.dx;
                p.y += p.dy;
                if (p.x < 0) p.x = W;
                if (p.x > W) p.x = 0;
                if (p.y < 0) p.y = H;
                if (p.y > H) p.y = 0;
            });

            // Connect nearby particles
            ctx.globalAlpha = 1;
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 120) {
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.strokeStyle =
                            'rgba(26,86,219,' + 0.07 * (1 - dist / 120) + ')';
                        ctx.lineWidth = 0.6;
                        ctx.stroke();
                    }
                }
            }

            animationFrameId = requestAnimationFrame(drawParticles);
        };

        drawParticles();

        return () => {
            document.body.classList.remove('guest-page');
            window.removeEventListener('resize', handleResize);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <>


            {/* Animated Background */}
            <div className="bg-canvas">
                <div className="dots-grid"></div>
                <div className="shape shape-1"></div>
                <div className="shape shape-2"></div>
                <div className="shape shape-3"></div>
                <div className="shape shape-4"></div>
                <div className="shape shape-5"></div>

                {/* Floating academic icons */}
                <div className="icon-float">🎓</div>
                <div className="icon-float">📚</div>
                <div className="icon-float">🔬</div>
                <div className="icon-float">✏️</div>
                <div className="icon-float">📐</div>
                <div className="icon-float">🏛️</div>
                <div className="icon-float">📖</div>
                <div className="icon-float">💡</div>
            </div>

            <canvas id="particle-canvas" ref={canvasRef}></canvas>

            {/* Main Page Content Wrapper */}
            <div className="page-wrapper">
                <div className="login-card">
                    {/* LEFT: Illustration Panel */}
                    <div className="left-panel">
                        <div className="campus-logo">
                            <div className="logo-icon">🏛️</div>
                            <div className="logo-text">
                                <h1>SIAKAD</h1>
                                <span>UNIVERSITAS NUSANTARA</span>
                            </div>
                        </div>

                        <div className="illustration-area">
                            <svg className="ill-svg" viewBox="0 0 220 240" fill="none" xmlns="http://www.w3.org/2000/svg">
                                {/* Book stack */}
                                <rect x="30" y="160" width="160" height="22" rx="6" fill="rgba(255,255,255,0.25)" />
                                <rect x="38" y="138" width="144" height="26" rx="6" fill="rgba(255,255,255,0.32)" />
                                <rect x="46" y="112" width="128" height="30" rx="6" fill="rgba(255,255,255,0.4)" />
                                {/* Top book open */}
                                <rect x="55" y="72" width="110" height="44" rx="8" fill="rgba(255,255,255,0.9)" />
                                <line x1="110" y1="72" x2="110" y2="116" stroke="#1a56db" strokeWidth="1.5" />
                                <rect x="62" y="80" width="40" height="4" rx="2" fill="#c7d9fc" />
                                <rect x="62" y="88" width="30" height="4" rx="2" fill="#c7d9fc" />
                                <rect x="62" y="96" width="36" height="4" rx="2" fill="#c7d9fc" />
                                <rect x="62" y="104" width="24" height="4" rx="2" fill="#c7d9fc" />
                                <rect x="116" y="80" width="38" height="4" rx="2" fill="#c7d9fc" />
                                <rect x="116" y="88" width="28" height="4" rx="2" fill="#c7d9fc" />
                                <rect x="116" y="96" width="34" height="4" rx="2" fill="#c7d9fc" />
                                {/* Graduation cap */}
                                <ellipse cx="110" cy="52" rx="46" ry="9" fill="rgba(255,255,255,0.9)" />
                                <rect x="94" y="36" width="32" height="16" rx="3" fill="rgba(255,255,255,0.85)" />
                                <rect x="106" y="52" width="8" height="14" rx="2" fill="rgba(255,255,255,0.7)" />
                                <circle cx="127" cy="57" r="4" fill="#f59e0b" />
                                <line x1="127" y1="57" x2="144" y2="72" stroke="#f59e0b" strokeWidth="2" />
                                {/* Stars */}
                                <circle cx="50" cy="50" r="4" fill="rgba(255,255,255,0.6)" />
                                <circle cx="170" cy="40" r="3" fill="rgba(245,158,11,0.8)" />
                                <circle cx="185" cy="80" r="2.5" fill="rgba(255,255,255,0.5)" />
                                <circle cx="35" cy="100" r="2" fill="rgba(245,158,11,0.6)" />
                                {/* Bottom text */}
                                <text x="110" y="210" textAnchor="middle" fontSize="10" fill="rgba(255,255,255,0.65)" fontFamily="'Plus Jakarta Sans', sans-serif" fontWeight="600">Pendidikan Berkualitas</text>
                                <text x="110" y="224" textAnchor="middle" fontSize="10" fill="rgba(255,255,255,0.45)" fontFamily="'Plus Jakarta Sans', sans-serif">untuk Masa Depan Gemilang</text>
                            </svg>
                        </div>

                        <div className="left-stats">
                            <div className="stat-pill">
                                <span className="num">12K+</span>
                                <span className="lbl">Mahasiswa</span>
                            </div>
                            <div className="stat-pill">
                                <span className="num">480</span>
                                <span className="lbl">Dosen</span>
                            </div>
                            <div className="stat-pill">
                                <span className="num">38</span>
                                <span className="lbl">Prodi</span>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT: Login / Inner Content Form */}
                    <div className="right-panel">
                        {children}
                    </div>
                </div>
            </div>
        </>
    );
}
