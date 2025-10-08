'use client'
import React, { useEffect, useState } from 'react';

interface Particle {
  id: number;
  left: number;
  size: number;
  duration: number;
  delay: number;
  opacity: number;
  drift: number;
}

interface FloatingParticlesProps {
  count?: number;
  color?: string;
}

export const FloatingParticles: React.FC<FloatingParticlesProps> = ({ 
  count = 15, 
  color = '#8b5cf6' 
}) => {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    const newParticles: Particle[] = Array.from({ length: count }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      size: Math.random() * 4 + 2,
      duration: Math.random() * 15 + 10,
      delay: Math.random() * 5,
      opacity: Math.random() * 0.5 + 0.3,
      drift: (Math.random() - 0.5) * 30,
    }));
    setParticles(newParticles);
  }, [count]);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute rounded-full"
          style={{
            left: `${particle.left}%`,
            bottom: '-10px',
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            backgroundColor: color,
            opacity: particle.opacity,
            animation: `floatUp ${particle.duration}s ${particle.delay}s infinite ease-in-out`,
            animationFillMode: 'forwards',
            transform: `translateX(${particle.drift}px)`,
          }}
        />
      ))}
      <style>{`
        @keyframes floatUp {
          0% {
            transform: translate3d(0px, 0px, 0px) scale3d(1, 1, 1) rotateX(0deg) rotateY(0deg) rotateZ(0deg) skew(0deg, 0deg);
            opacity: 0;
          }
          10% {
            opacity: ${Math.random() * 0.5 + 0.3};
          }
          90% {
            opacity: ${Math.random() * 0.5 + 0.3};
          }
          100% {
            transform: translate3d(${(Math.random() - 0.5) * 100}px, -${window.innerHeight + 50}px, 0px) 
                       scale3d(${Math.random() * 0.5 + 0.8}, ${Math.random() * 0.5 + 0.8}, 1) 
                       rotateX(0deg) rotateY(0deg) rotateZ(${Math.random() * 360}deg) 
                      skew(0deg, 0deg);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};