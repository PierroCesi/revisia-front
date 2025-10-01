'use client';

import { useEffect, useState } from 'react';

interface ConfettiAnimationProps {
    isActive: boolean;
    onComplete?: () => void;
}

export default function ConfettiAnimation({ isActive, onComplete }: ConfettiAnimationProps) {
    const [particles, setParticles] = useState<Array<{
        id: number;
        x: number;
        y: number;
        vx: number;
        vy: number;
        color: string;
        size: number;
        rotation: number;
        rotationSpeed: number;
    }>>([]);

    useEffect(() => {
        if (!isActive) return;

        // Créer des particules de confettis
        const newParticles = Array.from({ length: 150 }, (_, i) => ({
            id: i,
            x: Math.random() * window.innerWidth,
            y: -10,
            vx: (Math.random() - 0.5) * 8,
            vy: Math.random() * 3 + 2,
            color: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F'][Math.floor(Math.random() * 8)],
            size: Math.random() * 8 + 4,
            rotation: Math.random() * 360,
            rotationSpeed: (Math.random() - 0.5) * 10
        }));

        setParticles(newParticles);

        // Animation des particules
        const animate = () => {
            setParticles(prev =>
                prev.map(particle => ({
                    ...particle,
                    x: particle.x + particle.vx,
                    y: particle.y + particle.vy,
                    vy: particle.vy + 0.1, // Gravité
                    rotation: particle.rotation + particle.rotationSpeed
                })).filter(particle => particle.y < window.innerHeight + 50)
            );
        };

        const interval = setInterval(animate, 16); // 60 FPS

        // Arrêter l'animation après 3 secondes
        const timeout = setTimeout(() => {
            clearInterval(interval);
            setParticles([]);
            onComplete?.();
        }, 3000);

        return () => {
            clearInterval(interval);
            clearTimeout(timeout);
        };
    }, [isActive, onComplete]);

    if (!isActive || particles.length === 0) return null;

    return (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
            {particles.map(particle => (
                <div
                    key={particle.id}
                    className="absolute rounded-sm"
                    style={{
                        left: particle.x,
                        top: particle.y,
                        width: particle.size,
                        height: particle.size,
                        backgroundColor: particle.color,
                        transform: `rotate(${particle.rotation}deg)`,
                        boxShadow: '0 0 6px rgba(0,0,0,0.3)'
                    }}
                />
            ))}
        </div>
    );
}

