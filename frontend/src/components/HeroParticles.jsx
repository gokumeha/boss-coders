import { useEffect, useRef } from 'react';

export default function HeroParticles() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');

    if (!canvas || !context) {
      return undefined;
    }

    let animationFrameId = 0;
    let particles = [];

    function initParticles() {
      const parent = canvas.parentElement;
      const width = parent?.offsetWidth || window.innerWidth;
      const height = parent?.offsetHeight || window.innerHeight;

      canvas.width = width;
      canvas.height = height;

      particles = Array.from({ length: 60 }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: 1 + Math.random() * 3,
        velocityX: (Math.random() - 0.5) * 0.4,
        velocityY: -0.2 - Math.random() * 0.5,
        opacity: 0.05 + Math.random() * 0.2,
      }));
    }

    function drawFrame() {
      const width = canvas.width;
      const height = canvas.height;

      context.clearRect(0, 0, width, height);

      particles.forEach((particle) => {
        context.beginPath();
        context.arc(
          particle.x,
          particle.y,
          particle.radius,
          0,
          Math.PI * 2,
        );
        context.fillStyle = `rgba(184, 134, 11, ${particle.opacity})`;
        context.fill();

        particle.x += particle.velocityX;
        particle.y += particle.velocityY;

        if (particle.y < -10) {
          particle.y = height + 10;
          particle.x = Math.random() * width;
        }

        if (particle.x < 0) {
          particle.x = width;
        }

        if (particle.x > width) {
          particle.x = 0;
        }
      });

      animationFrameId = window.requestAnimationFrame(drawFrame);
    }

    function handleResize() {
      initParticles();
    }

    initParticles();
    drawFrame();

    window.addEventListener('resize', handleResize);

    return () => {
      window.cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return <canvas className="hero-canvas" ref={canvasRef} aria-hidden="true" />;
}

