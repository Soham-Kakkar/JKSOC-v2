"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const particles = Array.from({ length: 24 }).map((_, i) => ({
    id: i,
    x: (i * 13) % 100,
    y: (i * 29) % 100,
    size: (i % 4) + 2,
    duration: 12 + (i % 8),
}));

export default function AnimatedBackground() {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        const init = async () => setMounted(true);
        init();
    }, []);

    if (!mounted) return null;

    return (
        <div className="fixed inset-0 -z-10 overflow-hidden bg-background">

            {/* GRID */}
            <div
                className="
          absolute inset-0
          bg-[linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)]
          bg-[size:40px_40px]
          [mask-image:radial-gradient(circle_at_center,black,transparent_90%)]
        "
            />

            {/* animated gradient glow */}
            <motion.div
                className="absolute -top-40 left-1/2 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-primary/20 blur-3xl"
                animate={{
                    x: [-40, 40, -40],
                    y: [-20, 20, -20],
                }}
                transition={{
                    duration: 14,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
            />

            {/* secondary glow */}
            <motion.div
                className="absolute bottom-0 right-0 h-[400px] w-[400px] rounded-full bg-cyan-500/10 blur-3xl"
                animate={{
                    x: [0, -30, 0],
                    y: [0, -40, 0],
                }}
                transition={{
                    duration: 18,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
            />

            {/* particles */}
            {particles.map((p) => (
                <motion.div
                    key={p.id}
                    className="absolute rounded-full bg-primary"
                    style={{
                        width: p.size,
                        height: p.size,
                        left: `${p.x}%`,
                        top: `${p.y}%`,
                        boxShadow: "0 0 12px rgba(99,102,241,0.8)",
                    }}
                    animate={{
                        y: [0, -80, 0],
                        opacity: [0.2, 1, 0.2],
                        scale: [1, 1.6, 1],
                    }}
                    transition={{
                        duration: p.duration,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                />
            ))}

            {/* vignette */}
            <div className="absolute inset-0 bg-radial-[at_center] from-transparent via-background/20 to-background" />
        </div>
    );
}