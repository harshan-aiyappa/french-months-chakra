
import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import CELLS from 'vanta/dist/vanta.cells.min';

const VantaBackground = () => {
    const vantaRef = useRef(null);
    const vantaEffect = useRef(null);

    useEffect(() => {
        if (!vantaEffect.current && vantaRef.current) {
            try {
                vantaEffect.current = CELLS({
                    el: vantaRef.current,
                    THREE: THREE,
                    mouseControls: true,
                    touchControls: true,
                    gyroControls: false,
                    minHeight: 200.00,
                    minWidth: 200.00,
                    scale: 1.00,
                    color1: 0x6366f1, // brand.500 (Indigo)
                    color2: 0x312e81, // brand.900 (Deep Indigo)
                    size: 1.50,
                    speed: 1.00
                });
            } catch (error) {
                console.error("[VantaBackground] Failed to initialize Vanta effect:", error);
            }
        }
        return () => {
            if (vantaEffect.current) vantaEffect.current.destroy();
        };
    }, []);

    return (
        <div ref={vantaRef} style={{ width: '100%', height: '100vh', position: 'absolute', top: 0, left: 0, zIndex: 0 }} />
    );
};

export default VantaBackground;
