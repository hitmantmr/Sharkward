import React, { useMemo } from 'react';

const FloatingCircles = () => {
  const circles = useMemo(() => {
    const count = 30; // Između 20 i 40 krugova
    const generated = [];
    for (let i = 0; i < count; i++) {
      const size = Math.random() * 6 + 2; // Veličina od 2px do 8px
      const startX = Math.random() * 100; // Početna X pozicija u %
      const startY = Math.random() * 100; // Početna Y pozicija u %
      const dx = (Math.random() * 80 - 40) + 'vw'; // Pomeraj po X
      const dy = (Math.random() * 80 - 40) + 'vh'; // Pomeraj po Y
      const duration = Math.random() * 25 + 20; // Trajanje animacije od 20s do 45s
      const delay = Math.random() * -30; // Negativan delay da bi animacije počele odmah u raznim fazama
      const opacity = Math.random() * 0.25 + 0.05; // Opacity od 0.05 do 0.3

      generated.push({
        id: i,
        style: {
          position: 'absolute',
          left: `${startX}%`,
          top: `${startY}%`,
          width: `${size}px`,
          height: `${size}px`,
          borderRadius: '50%',
          backgroundColor: '#00f0ff', // Akcenat plave boje
          boxShadow: size > 5 ? '0 0 8px rgba(0, 240, 255, 0.6)' : 'none',
          opacity: opacity,
          animation: `float-circle ${duration}s infinite ease-in-out`,
          animationDelay: `${delay}s`,
          '--dx': dx,
          '--dy': dy,
        }
      });
    }
    return generated;
  }, []);

  return (
    <div id="background-particles">
      <style>{`
        @keyframes float-circle {
          0% {
            transform: translate(0, 0);
          }
          50% {
            transform: translate(var(--dx), var(--dy));
          }
          100% {
            transform: translate(0, 0);
          }
        }
      `}</style>
      {circles.map((circle) => (
        <div key={circle.id} style={circle.style} />
      ))}
    </div>
  );
};

export default FloatingCircles;
