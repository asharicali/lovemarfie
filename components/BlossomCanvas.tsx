
import React, { useRef, useEffect } from 'react';
import { COLORS } from '../constants';

interface BlossomCanvasProps {
  isStarted: boolean;
  onBloomComplete: () => void;
}

const BlossomCanvas: React.FC<BlossomCanvasProps> = ({ isStarted, onBloomComplete }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!isStarted) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let progress = 0;
    const particles: any[] = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', resize);
    resize();

    // Scale factors based on screen size
    const getScale = () => {
      const minDim = Math.min(canvas.width, canvas.height);
      return Math.max(minDim / 800, 0.6); // Don't let it get too tiny
    };

    const drawStem = (p: number, scale: number) => {
      const centerX = canvas.width / 2;
      const startY = canvas.height;
      const targetY = canvas.height * (canvas.width < 640 ? 0.45 : 0.65);
      const currentY = startY - (startY - targetY) * Math.min(p * 1.5, 1);

      ctx.beginPath();
      ctx.moveTo(centerX, startY);
      ctx.quadraticCurveTo(centerX - 20 * scale, startY - (startY - targetY) / 2, centerX, currentY);
      ctx.strokeStyle = COLORS.stem;
      ctx.lineWidth = 6 * scale;
      ctx.lineCap = 'round';
      ctx.stroke();

      // Leaves
      if (p > 0.3) {
        const leafProgress = Math.min((p - 0.3) * 2, 1);
        ctx.fillStyle = COLORS.stem;
        // Left Leaf
        ctx.beginPath();
        ctx.ellipse(centerX - 12 * scale, startY - 100 * scale, 20 * leafProgress * scale, 8 * leafProgress * scale, Math.PI / 4, 0, Math.PI * 2);
        ctx.fill();
        // Right Leaf
        ctx.beginPath();
        ctx.ellipse(centerX + 12 * scale, startY - 150 * scale, 20 * leafProgress * scale, 8 * leafProgress * scale, -Math.PI / 4, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const drawPetals = (p: number, scale: number) => {
      if (p < 0.4) return;
      const flowerProgress = Math.min((p - 0.4) * 1.6, 1);
      const centerX = canvas.width / 2;
      const centerY = canvas.height * (canvas.width < 640 ? 0.45 : 0.65);
      const petalCount = 8;
      const layers = 3;

      for (let layer = 0; layer < layers; layer++) {
        const layerScale = 1 - layer * 0.25;
        const petalLen = 100 * flowerProgress * layerScale * scale;
        const petalWidth = 45 * flowerProgress * layerScale * scale;
        const rotationOffset = (layer * Math.PI) / 4;

        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(rotationOffset + p * 0.2); // Gentle sway

        for (let i = 0; i < petalCount; i++) {
          ctx.beginPath();
          ctx.rotate((Math.PI * 2) / petalCount);
          ctx.moveTo(0, 0);
          ctx.bezierCurveTo(
            -petalWidth, -petalLen / 2,
            -petalWidth / 2, -petalLen,
            0, -petalLen
          );
          ctx.bezierCurveTo(
            petalWidth / 2, -petalLen,
            petalWidth, -petalLen / 2,
            0, 0
          );
          
          const gradient = ctx.createRadialGradient(0, -petalLen/2, 0, 0, -petalLen/2, petalLen);
          gradient.addColorStop(0, layer === 0 ? COLORS.roseSecondary : COLORS.rosePrimary);
          gradient.addColorStop(1, COLORS.roseSoft);
          
          ctx.fillStyle = gradient;
          ctx.fill();
          
          ctx.strokeStyle = 'rgba(255,255,255,0.1)';
          ctx.lineWidth = 1;
          ctx.stroke();
        }
        ctx.restore();
      }

      // Center of flower
      if (flowerProgress > 0.8) {
        ctx.beginPath();
        ctx.arc(centerX, centerY, 15 * (flowerProgress - 0.8) * 5 * scale, 0, Math.PI * 2);
        ctx.fillStyle = '#fde047';
        ctx.fill();
      }
    };

    const updateParticles = (scale: number) => {
      if (progress > 0.5 && progress < 0.95 && Math.random() > 0.7) {
        particles.push({
          x: canvas.width / 2 + (Math.random() - 0.5) * 100 * scale,
          y: canvas.height * (canvas.width < 640 ? 0.45 : 0.65) + (Math.random() - 0.5) * 100 * scale,
          vx: (Math.random() - 0.5) * 2 * scale,
          vy: -Math.random() * 2 - 1 * scale,
          size: (Math.random() * 4 + 1) * scale,
          color: Math.random() > 0.5 ? COLORS.roseSoft : '#ffffff',
          life: 1,
          decay: Math.random() * 0.02 + 0.01
        });
      }

      for (let i = particles.length - 1; i >= 0; i--) {
        const part = particles[i];
        part.x += part.vx;
        part.y += part.vy;
        part.life -= part.decay;
        if (part.life <= 0) {
          particles.splice(i, 1);
        } else {
          ctx.globalAlpha = part.life;
          ctx.fillStyle = part.color;
          ctx.beginPath();
          ctx.arc(part.x, part.y, part.size, 0, Math.PI * 2);
          ctx.fill();
          ctx.globalAlpha = 1;
        }
      }
    };

    const render = () => {
      const scale = getScale();
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      progress += 0.005;
      if (progress >= 1) {
        progress = 1;
        onBloomComplete();
      }

      drawStem(progress, scale);
      drawPetals(progress, scale);
      updateParticles(scale);

      if (progress < 1 || particles.length > 0) {
        animationFrameId = requestAnimationFrame(render);
      }
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resize);
    };
  }, [isStarted, onBloomComplete]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-10"
    />
  );
};

export default BlossomCanvas;
