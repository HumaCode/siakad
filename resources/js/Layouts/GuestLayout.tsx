import { PropsWithChildren, useEffect, useRef } from 'react';

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
            <style dangerouslySetInnerHTML={{ __html: `
                :root {
                    --primary: #1a56db;
                    --primary-light: #e8f0fe;
                    --primary-mid: #4f83f0;
                    --accent: #f59e0b;
                    --accent-light: #fef3c7;
                    --teal: #0d9488;
                    --teal-light: #ccfbf1;
                    --soft-bg: #f0f4ff;
                    --white: #ffffff;
                    --text-dark: #1e2a4a;
                    --text-muted: #64748b;
                    --border: rgba(26,86,219,0.13);
                }

                body.guest-page {
                    font-family: 'Plus Jakarta Sans', sans-serif;
                    background: var(--soft-bg);
                    min-height: 100vh;
                    overflow-x: hidden;
                }

                /* ======= ANIMATED BACKGROUND ======= */
                .bg-canvas {
                    position: fixed;
                    inset: 0;
                    z-index: 0;
                    overflow: hidden;
                    background: linear-gradient(135deg, #e8f0fe 0%, #f0f4ff 40%, #e0f2fe 70%, #ecfdf5 100%);
                }

                /* Floating shapes */
                .shape {
                    position: absolute;
                    border-radius: 50%;
                    opacity: 0.18;
                    animation: floatShape linear infinite;
                }
                .shape-1 { width: 420px; height: 420px; background: #1a56db; top: -120px; left: -80px; animation-duration: 18s; }
                .shape-2 { width: 300px; height: 300px; background: #f59e0b; top: 60%; right: -100px; animation-duration: 22s; animation-delay: -5s; }
                .shape-3 { width: 200px; height: 200px; background: #0d9488; bottom: 10%; left: 8%; animation-duration: 16s; animation-delay: -8s; }
                .shape-4 { width: 150px; height: 150px; background: #6366f1; top: 45%; left: 20%; animation-duration: 25s; animation-delay: -12s; }
                .shape-5 { width: 80px; height: 80px; background: #f59e0b; top: 20%; right: 25%; animation-duration: 14s; animation-delay: -3s; }

                @keyframes floatShape {
                    0%   { transform: translate(0,0) rotate(0deg); }
                    25%  { transform: translate(30px,-20px) rotate(90deg); }
                    50%  { transform: translate(-20px,30px) rotate(180deg); }
                    75%  { transform: translate(20px,10px) rotate(270deg); }
                    100% { transform: translate(0,0) rotate(360deg); }
                }

                /* Academic floating icons */
                .icon-float {
                    position: absolute;
                    font-size: 28px;
                    opacity: 0.12;
                    animation: iconDrift ease-in-out infinite;
                    color: var(--primary);
                    user-select: none;
                }
                .icon-float:nth-child(1) { top: 12%; left: 10%; animation-duration: 6s; font-size: 36px; }
                .icon-float:nth-child(2) { top: 30%; left: 5%; animation-duration: 8s; animation-delay: -2s; font-size: 22px; color: var(--accent); }
                .icon-float:nth-child(3) { top: 65%; left: 12%; animation-duration: 7s; animation-delay: -4s; font-size: 30px; color: var(--teal); }
                .icon-float:nth-child(4) { top: 80%; left: 30%; animation-duration: 9s; animation-delay: -1s; font-size: 20px; }
                .icon-float:nth-child(5) { top: 8%; right: 12%; animation-duration: 7.5s; animation-delay: -3s; font-size: 32px; color: var(--accent); }
                .icon-float:nth-child(6) { top: 50%; right: 8%; animation-duration: 6.5s; animation-delay: -5s; font-size: 26px; color: var(--teal); }
                .icon-float:nth-child(7) { top: 75%; right: 15%; animation-duration: 10s; animation-delay: -7s; font-size: 28px; }
                .icon-float:nth-child(8) { top: 20%; right: 30%; animation-duration: 5.5s; animation-delay: -2s; font-size: 18px; color: #6366f1; }

                @keyframes iconDrift {
                    0%, 100% { transform: translateY(0) rotate(-5deg); }
                    50%       { transform: translateY(-18px) rotate(5deg); }
                }

                /* Dots grid pattern */
                .dots-grid {
                    position: absolute;
                    inset: 0;
                    background-image: radial-gradient(circle, rgba(26,86,219,0.08) 1.5px, transparent 1.5px);
                    background-size: 32px 32px;
                }

                /* ======= LAYOUT ======= */
                .page-wrapper {
                    position: relative;
                    z-index: 1;
                    min-height: 100vh;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 2rem 1rem;
                }

                .login-card {
                    background: rgba(255,255,255,0.82);
                    backdrop-filter: blur(22px);
                    -webkit-backdrop-filter: blur(22px);
                    border: 1.5px solid rgba(255,255,255,0.9);
                    border-radius: 28px;
                    box-shadow: 0 8px 48px rgba(26,86,219,0.10), 0 2px 12px rgba(0,0,0,0.04);
                    overflow: hidden;
                    width: 100%;
                    max-width: 960px;
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    min-height: 580px;
                    animation: cardIn 0.7s cubic-bezier(0.34,1.56,0.64,1) both;
                }

                @keyframes cardIn {
                    from { opacity: 0; transform: translateY(40px) scale(0.97); }
                    to   { opacity: 1; transform: translateY(0) scale(1); }
                }

                /* ======= LEFT PANEL (illustration) ======= */
                .left-panel {
                    background: linear-gradient(145deg, #1a56db 0%, #2563eb 50%, #1e40af 100%);
                    padding: 3rem 2.5rem;
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    position: relative;
                    overflow: hidden;
                    border-radius: 26px 0 0 26px;
                }

                .left-panel::before {
                    content: '';
                    position: absolute;
                    width: 340px;
                    height: 340px;
                    border-radius: 50%;
                    background: rgba(255,255,255,0.07);
                    top: -100px;
                    right: -100px;
                }
                .left-panel::after {
                    content: '';
                    position: absolute;
                    width: 200px;
                    height: 200px;
                    border-radius: 50%;
                    background: rgba(255,255,255,0.05);
                    bottom: -60px;
                    left: -60px;
                }

                .campus-logo {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    position: relative;
                    z-index: 1;
                    animation: slideDown 0.6s 0.2s both;
                }

                .logo-icon {
                    width: 48px;
                    height: 48px;
                    background: rgba(255,255,255,0.18);
                    border-radius: 14px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 24px;
                    border: 1.5px solid rgba(255,255,255,0.25);
                }

                .logo-text h1 {
                    font-family: 'Poppins', sans-serif;
                    font-size: 1.3rem;
                    font-weight: 800;
                    color: #fff;
                    line-height: 1.1;
                    margin: 0;
                }

                .logo-text span {
                    font-size: 0.72rem;
                    color: rgba(255,255,255,0.7);
                    font-weight: 500;
                    letter-spacing: 0.04em;
                }

                /* Book illustration SVG area */
                .illustration-area {
                    position: relative;
                    z-index: 1;
                    flex: 1;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    animation: slideDown 0.6s 0.3s both;
                }

                .ill-svg {
                    width: 220px;
                    filter: drop-shadow(0 16px 40px rgba(0,0,0,0.2));
                    animation: ilFloat 4s ease-in-out infinite;
                }

                @keyframes ilFloat {
                    0%, 100% { transform: translateY(0); }
                    50%       { transform: translateY(-10px); }
                }

                .left-stats {
                    position: relative;
                    z-index: 1;
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 12px;
                    animation: slideDown 0.6s 0.4s both;
                }

                .stat-pill {
                    background: rgba(255,255,255,0.12);
                    border: 1px solid rgba(255,255,255,0.2);
                    border-radius: 14px;
                    padding: 12px 10px;
                    text-align: center;
                }

                .stat-pill .num {
                    font-size: 1.25rem;
                    font-weight: 800;
                    color: #fff;
                    display: block;
                }

                .stat-pill .lbl {
                    font-size: 0.68rem;
                    color: rgba(255,255,255,0.65);
                    font-weight: 500;
                }

                @keyframes slideDown {
                    from { opacity: 0; transform: translateY(-20px); }
                    to   { opacity: 1; transform: translateY(0); }
                }

                /* ======= RIGHT PANEL (form) ======= */
                .right-panel {
                    padding: 3rem 2.5rem;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    animation: slideRight 0.7s 0.15s cubic-bezier(0.34,1.56,0.64,1) both;
                }

                @keyframes slideRight {
                    from { opacity: 0; transform: translateX(30px); }
                    to   { opacity: 1; transform: translateX(0); }
                }

                /* Responsive and Compact Resizing for Smaller Desktops / Laptops */
                @media (max-width: 1100px), (max-height: 800px) {
                    .page-wrapper {
                        padding: 1rem 0.5rem;
                    }
                    .login-card {
                        min-height: 480px;
                        max-width: 860px;
                        border-radius: 20px;
                    }
                    .left-panel {
                        padding: 2rem 1.75rem;
                        border-radius: 18px 0 0 18px;
                    }
                    .right-panel {
                        padding: 2rem 1.75rem;
                    }
                    .form-header {
                        margin-bottom: 1rem;
                    }
                    .form-header h2 {
                        font-size: 1.5rem;
                    }
                    .form-header .welcome-badge {
                        margin-bottom: 8px;
                        padding: 4px 10px;
                    }
                    .ill-svg {
                        width: 140px;
                    }
                    .left-stats {
                        gap: 8px;
                    }
                    .stat-pill {
                        padding: 8px 6px;
                        border-radius: 10px;
                    }
                    .stat-pill .num {
                        font-size: 1rem;
                    }
                    .stat-pill .lbl {
                        font-size: 0.6rem;
                    }
                    .btn-google {
                        padding: 8px 16px;
                        font-size: 0.82rem;
                    }
                    .divider {
                        margin: 0.75rem 0;
                    }
                    .form-label {
                        margin-bottom: 4px;
                        font-size: 0.78rem;
                    }
                    .input-wrap {
                        margin-bottom: 0.75rem;
                    }
                    .form-control-custom {
                        padding: 9px 12px 9px 38px;
                        font-size: 0.85rem;
                    }
                    .role-btn {
                        padding: 6px 3px;
                        font-size: 0.65rem;
                        border-radius: 8px;
                    }
                    .role-btn .rb-icon {
                        font-size: 14px;
                        margin-bottom: 2px;
                    }
                    .btn-login {
                        padding: 10px;
                        font-size: 0.88rem;
                        border-radius: 10px;
                    }
                    .form-footer {
                        margin-top: 0.75rem;
                        font-size: 0.75rem;
                    }
                    .form-row-util {
                        margin-bottom: 0.75rem;
                    }
                }

                /* Mobile Viewport Rules */
                @media (max-width: 700px) {
                    .login-card { grid-template-columns: 1fr; min-height: auto; border-radius: 22px; }
                    .left-panel { display: none; }
                    .right-panel { padding: 2.5rem 1.75rem; }
                }

                .form-header { margin-bottom: 2rem; }

                .form-header .welcome-badge {
                    display: inline-flex;
                    align-items: center;
                    gap: 6px;
                    background: var(--primary-light);
                    color: var(--primary);
                    font-size: 0.75rem;
                    font-weight: 700;
                    padding: 5px 14px;
                    border-radius: 100px;
                    margin-bottom: 14px;
                    letter-spacing: 0.03em;
                }

                .form-header h2 {
                    font-family: 'Poppins', sans-serif;
                    font-size: 1.85rem;
                    font-weight: 800;
                    color: var(--text-dark);
                    line-height: 1.2;
                    margin-bottom: 6px;
                }

                .form-header p {
                    font-size: 0.875rem;
                    color: var(--text-muted);
                    font-weight: 400;
                }

                /* Google button */
                .btn-google {
                    width: 100%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 10px;
                    padding: 11px 20px;
                    background: #fff;
                    border: 1.5px solid var(--border);
                    border-radius: 14px;
                    font-size: 0.9rem;
                    font-weight: 600;
                    color: var(--text-dark);
                    cursor: pointer;
                    transition: all 0.22s ease;
                    font-family: 'Plus Jakarta Sans', sans-serif;
                    box-shadow: 0 1px 6px rgba(26,86,219,0.06);
                }

                .btn-google:hover {
                    background: var(--primary-light);
                    border-color: var(--primary);
                    transform: translateY(-1px);
                    box-shadow: 0 4px 16px rgba(26,86,219,0.12);
                }

                .btn-google:active { transform: scale(0.98); }

                .google-icon {
                    width: 20px;
                    height: 20px;
                }

                /* Divider */
                .divider {
                    display: flex;
                    align-items: center;
                    gap: 14px;
                    margin: 1.25rem 0;
                }

                .divider::before, .divider::after {
                    content: '';
                    flex: 1;
                    height: 1px;
                    background: var(--border);
                }

                .divider span {
                    font-size: 0.78rem;
                    color: var(--text-muted);
                    font-weight: 500;
                    white-space: nowrap;
                }

                /* Form controls */
                .form-label {
                    font-size: 0.82rem;
                    font-weight: 600;
                    color: var(--text-dark);
                    margin-bottom: 6px;
                    display: block;
                }

                .input-wrap {
                    position: relative;
                    margin-bottom: 1rem;
                }

                .input-icon {
                    position: absolute;
                    left: 14px;
                    top: 50%;
                    transform: translateY(-50%);
                    color: var(--text-muted);
                    font-size: 16px;
                    pointer-events: none;
                    transition: color 0.2s;
                }

                .form-control-custom {
                    width: 100%;
                    padding: 11px 14px 11px 42px;
                    border: 1.5px solid rgba(26,86,219,0.15);
                    border-radius: 12px;
                    font-size: 0.9rem;
                    font-family: 'Plus Jakarta Sans', sans-serif;
                    color: var(--text-dark);
                    background: rgba(255,255,255,0.8);
                    transition: all 0.22s ease;
                    outline: none;
                }

                .form-control-custom:focus {
                    border-color: var(--primary);
                    background: #fff;
                    box-shadow: 0 0 0 4px rgba(26,86,219,0.08);
                }

                .form-control-custom:focus + .input-icon,
                .input-wrap:focus-within .input-icon {
                    color: var(--primary);
                }

                .pass-toggle {
                    position: absolute;
                    right: 13px;
                    top: 50%;
                    transform: translateY(-50%);
                    cursor: pointer;
                    color: var(--text-muted);
                    font-size: 15px;
                    transition: color 0.2s;
                    background: none;
                    border: none;
                    padding: 0;
                }

                .pass-toggle:hover { color: var(--primary); }

                /* Role selector */
                .role-selector {
                    display: grid;
                    grid-template-columns: repeat(4, 1fr);
                    gap: 8px;
                    margin-bottom: 1rem;
                }

                .role-btn {
                    padding: 8px 4px;
                    border: 1.5px solid rgba(26,86,219,0.15);
                    border-radius: 10px;
                    background: rgba(255,255,255,0.7);
                    cursor: pointer;
                    font-size: 0.7rem;
                    font-weight: 600;
                    color: var(--text-muted);
                    text-align: center;
                    transition: all 0.2s;
                    font-family: 'Plus Jakarta Sans', sans-serif;
                }

                .role-btn .rb-icon { font-size: 18px; display: block; margin-bottom: 3px; }

                .role-btn:hover, .role-btn.active {
                    border-color: var(--primary);
                    background: var(--primary-light);
                    color: var(--primary);
                }

                /* Login button */
                .btn-login {
                    width: 100%;
                    padding: 13px;
                    background: linear-gradient(135deg, #1a56db, #2563eb);
                    color: #fff;
                    border: none;
                    border-radius: 14px;
                    font-size: 0.95rem;
                    font-weight: 700;
                    font-family: 'Plus Jakarta Sans', sans-serif;
                    cursor: pointer;
                    transition: all 0.25s ease;
                    margin-top: 0.25rem;
                    letter-spacing: 0.01em;
                    position: relative;
                    overflow: hidden;
                }

                .btn-login::before {
                    content: '';
                    position: absolute;
                    inset: 0;
                    background: linear-gradient(135deg, rgba(255,255,255,0.1), transparent);
                    opacity: 0;
                    transition: opacity 0.2s;
                }

                .btn-login:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(26,86,219,0.35); }
                .btn-login:hover::before { opacity: 1; }
                .btn-login:active { transform: scale(0.98); }

                .form-footer {
                    text-align: center;
                    margin-top: 1.25rem;
                    font-size: 0.8rem;
                    color: var(--text-muted);
                }

                .form-footer a {
                    color: var(--primary);
                    font-weight: 600;
                    text-decoration: none;
                }

                .form-footer a:hover { text-decoration: underline; }

                /* Remember + Forgot row */
                .form-row-util {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    margin-bottom: 1.2rem;
                }

                .check-custom {
                    display: flex;
                    align-items: center;
                    gap: 7px;
                    cursor: pointer;
                }

                .check-custom input[type=checkbox] {
                    width: 16px;
                    height: 16px;
                    accent-color: var(--primary);
                    cursor: pointer;
                }

                .check-custom span {
                    font-size: 0.82rem;
                    color: var(--text-muted);
                    font-weight: 500;
                }

                .forgot-link {
                    font-size: 0.82rem;
                    color: var(--primary);
                    font-weight: 600;
                    text-decoration: none;
                }

                .forgot-link:hover { text-decoration: underline; }

                .role-selector {
                    grid-template-columns: repeat(4, 1fr);
                }

                @media (max-width: 700px) {
                    .role-selector { grid-template-columns: repeat(2, 1fr); }
                }

                #particle-canvas {
                    position: fixed;
                    inset: 0;
                    pointer-events: none;
                    z-index: 0;
                }
            ` }} />

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
