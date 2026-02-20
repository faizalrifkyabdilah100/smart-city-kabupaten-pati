import React, { useState, useEffect, useRef } from 'react';
import { useTheme } from '../../hooks/useTheme';

// === CSS ANIMASI GLOBAL (Dipindah kesini biar tersedia untuk semua) ===
const globalStyles = `
  @keyframes float { 0% { transform: translateY(0px); } 50% { transform: translateY(-15px); } 100% { transform: translateY(0px); } }
  .animate-float { animation: float 6s ease-in-out infinite; }
  
  @keyframes pulseGlow { 0%, 100% { opacity: 0.3; transform: scale(1); } 50% { opacity: 0.6; transform: scale(1.1); } }
  .animate-pulse-glow { animation: pulseGlow 4s ease-in-out infinite; }
  
  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  .animate-fade-in { animation: fadeIn 0.4s ease-out forwards; }
  
  @keyframes scaleUp { from { transform: scale(0.8); opacity: 0; } to { transform: scale(1); opacity: 1; } }
  .animate-scale-up { animation: scaleUp 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; }
  
  @keyframes slideDown { from { transform: translateY(-20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
  .animate-slide-down { animation: slideDown 0.5s ease-out forwards; }
  
  @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
  .animate-slide-up { animation: slideUp 0.5s ease-out forwards; }
`;

// === KOMPONEN PARTIKEL ===
const ParticleBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { isDark } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext('2d'); if (!ctx) return;

    let particles: any[] = [];
    let w = (canvas.width = window.innerWidth);
    let h = (canvas.height = window.innerHeight);
    let animationId: number;

    const particleCount = 45;
    const connectionDistance = 160;

    // Warna partikel berdasarkan tema
    // Light mode: partikel putih agar terlihat jelas di atas gradient biru
    const particleColor = isDark ? 'rgba(255, 255, 255, 0.6)' : 'rgba(255, 255, 255, 0.7)';
    const lineColor = isDark
      ? (opacity: number) => `rgba(255, 255, 255, ${opacity * 0.25})`
      : (opacity: number) => `rgba(255, 255, 255, ${opacity * 0.2})`;

    class Particle {
      x: number; y: number; vx: number; vy: number; size: number;
      constructor() {
        this.x = Math.random() * w; this.y = Math.random() * h;
        this.vx = (Math.random() - 0.5) * 0.2; this.vy = (Math.random() - 0.5) * 0.2;
        this.size = Math.random() * 2 + 1;
      }
      update() {
        this.x += this.vx; this.y += this.vy;
        if (this.x < 0 || this.x > w) this.vx *= -1;
        if (this.y < 0 || this.y > h) this.vy *= -1;
      }
      draw() {
        if (!ctx) return;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = particleColor;
        ctx.fill();
      }
    }

    const init = () => { particles = []; for (let i = 0; i < particleCount; i++) particles.push(new Particle()); };
    const animate = () => {
      if (!ctx) return; ctx.clearRect(0, 0, w, h);
      particles.forEach((p) => { p.update(); p.draw(); connect(p); });
      animationId = requestAnimationFrame(animate);
    };
    const connect = (p: any) => {
      if (!ctx) return;
      particles.forEach((op) => {
        const dx = p.x - op.x; const dy = p.y - op.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < connectionDistance) {
          ctx.strokeStyle = lineColor(1 - dist / connectionDistance);
          ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(op.x, op.y); ctx.stroke();
        }
      });
    };
    const handleResize = () => { w = canvas.width = window.innerWidth; h = canvas.height = window.innerHeight; init(); };
    window.addEventListener('resize', handleResize); init(); animate();
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);
    };
  }, [isDark]);

  return <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" />;
};

// === KOMPONEN BACKGROUND UTAMA ===
const GlobalBackground: React.FC = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const { isDark } = useTheme();

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX - window.innerWidth / 2, y: e.clientY - window.innerHeight / 2 });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="fixed inset-0 w-full h-full pointer-events-none z-0">
      <style>{globalStyles}</style>

      {/* 0. BASE GRADIENT BACKGROUND */}
      {/* Dark: original dark blue. Light: rich blue gradient like government portal */}
      <div
        className="absolute inset-0 transition-all duration-700"
        style={{
          background: isDark
            ? 'linear-gradient(180deg, #0c1929 0%, #132744 30%, #1a2a4e 60%, #0f1f3d 100%)'
            : 'linear-gradient(160deg, #1e40af 0%, #3b82f6 30%, #60a5fa 60%, #93c5fd 100%)'
        }}
      ></div>

      {/* 1. LAYER PETA HOLOGRAM */}
      <div
        className="absolute inset-0 bg-contain bg-center bg-no-repeat transition-all duration-500 ease-out"
        style={{
          backgroundImage: "url('/peta-pati-clean.png')",
          transform: `translate(${mousePos.x * -0.02}px, ${mousePos.y * -0.02}px) scale(1.35)`,
          filter: isDark
            ? "invert(1) grayscale(100%) brightness(1.2)"
            : "invert(1) grayscale(100%) brightness(2)",
          opacity: isDark ? 0.35 : 0.12,
          mixBlendMode: "overlay"
        }}
      ></div>

      {/* 2. LAYER GRADIENT OVERLAY - adds depth */}
      <div
        className="absolute inset-0 transition-all duration-700"
        style={{
          background: isDark
            ? 'radial-gradient(ellipse at 50% 30%, rgba(6,182,212,0.15) 0%, transparent 60%)'
            : 'radial-gradient(ellipse at 50% 30%, rgba(255,255,255,0.2) 0%, transparent 70%)'
        }}
      ></div>

      {/* 2B. LAYER GRADIENT ACCENT - horizontal shimmer */}
      <div className={`absolute inset-0 transition-all duration-700 ${isDark
        ? 'bg-gradient-to-r from-transparent via-cyan-600/10 to-transparent'
        : 'bg-gradient-to-r from-transparent via-white/10 to-transparent'
        }`}></div>

      {/* 2C. VIGNETTE - darker edges for depth */}
      <div
        className="absolute inset-0"
        style={{
          background: isDark
            ? 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.4) 100%)'
            : 'radial-gradient(ellipse at center, transparent 30%, rgba(30,58,138,0.3) 100%)'
        }}
      ></div>

      {/* 3. LAYER PARTIKEL BERGERAK */}
      <div className={`absolute inset-0 transition-opacity duration-700 ${isDark ? 'opacity-60' : 'opacity-80'}`} style={{ transform: `translate(${mousePos.x * -0.01}px, ${mousePos.y * -0.01}px)` }}>
        <ParticleBackground />
      </div>
    </div>
  );
};

export default GlobalBackground;