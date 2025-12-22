import React, { useEffect, useRef } from 'react';
import { Box } from '@chakra-ui/react';

const NeuralBackground = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        let animationFrameId;
        let particles = [];

        // Constants for the animation
        const PARTICLE_COUNT = Math.min(Math.floor(window.innerWidth / 15), 100);
        const CONNECTION_DISTANCE = 150;
        const PARTICLE_SPEED = 0.5;

        class Particle {
            constructor(width, height) {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.vx = (Math.random() - 0.5) * PARTICLE_SPEED;
                this.vy = (Math.random() - 0.5) * PARTICLE_SPEED;
                this.radius = Math.random() * 2 + 1;
            }

            update(width, height) {
                this.x += this.vx;
                this.y += this.vy;

                if (this.x < 0 || this.x > width) this.vx *= -1;
                if (this.y < 0 || this.y > height) this.vy *= -1;
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(99, 102, 241, 0.4)'; // brand.500 with opacity
                ctx.fill();
            }
        }

        const init = () => {
            const { innerWidth: width, innerHeight: height } = window;
            const dpr = window.devicePixelRatio || 1;
            canvas.width = width * dpr;
            canvas.height = height * dpr;
            canvas.style.width = `${width}px`;
            canvas.style.height = `${height}px`;
            ctx.scale(dpr, dpr);

            particles = [];
            for (let i = 0; i < PARTICLE_COUNT; i++) {
                particles.push(new Particle(width, height));
            }
        };

        const drawConnections = () => {
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < CONNECTION_DISTANCE) {
                        const opacity = 1 - distance / CONNECTION_DISTANCE;
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.strokeStyle = `rgba(99, 102, 241, ${opacity * 0.2})`;
                        ctx.lineWidth = 1;
                        ctx.stroke();
                    }
                }
            }
        };

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            const { innerWidth: width, innerHeight: height } = window;
            particles.forEach(p => {
                p.update(width, height);
                p.draw();
            });
            drawConnections();

            animationFrameId = requestAnimationFrame(animate);
        };

        init();
        animate();

        const handleResize = () => {
            init();
        };

        window.addEventListener('resize', handleResize);

        return () => {
            cancelAnimationFrame(animationFrameId);
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return (
        <Box
            as="canvas"
            ref={canvasRef}
            position="fixed"
            top={0}
            left={0}
            w="100vw"
            h="100vh"
            zIndex={-1}
            bg="slate.50"
            pointerEvents="none"
            opacity={0.6}
            style={{ willChange: 'transform' }}
        />
    );
};

export default NeuralBackground;
