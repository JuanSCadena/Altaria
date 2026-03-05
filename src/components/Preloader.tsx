"use client";

import { useEffect, useState, useRef } from "react";
import gsap from "gsap";

interface PreloaderProps {
    onComplete: () => void;
}

export default function Preloader({ onComplete }: PreloaderProps) {
    const [isReady, setIsReady] = useState(false);
    const orbitRef = useRef<HTMLDivElement>(null);
    const barRef = useRef<HTMLDivElement>(null);
    const counterRef = useRef<HTMLSpanElement>(null);
    const hasCalledComplete = useRef(false);

    // Block scroll while loading
    useEffect(() => {
        document.body.style.overflow = "hidden";
        window.scrollTo(0, 0);
    }, []);

    // Orbit animation
    useEffect(() => {
        if (!orbitRef.current) return;
        const anim = gsap.to(orbitRef.current, {
            rotation: 360, duration: 6, repeat: -1, ease: "none"
        });
        return () => { anim.kill(); };
    }, []);

    // Progress: smooth 0→100 over 2s, then wait for video
    useEffect(() => {
        let cancelled = false;
        let videoReady = false;
        let progressDone = false;

        const checkReady = () => {
            if (cancelled) return;
            if (videoReady && progressDone) setIsReady(true);
        };

        // Animate progress bar visually
        const start = Date.now();
        const duration = 2200;
        const tick = () => {
            if (cancelled) return;
            const elapsed = Date.now() - start;
            const p = Math.min((elapsed / duration) * 100, 100);
            if (barRef.current) barRef.current.style.width = `${p}%`;
            if (counterRef.current) counterRef.current.textContent = `${Math.round(p)}`;
            if (p < 100) requestAnimationFrame(tick);
            else { progressDone = true; checkReady(); }
        };
        requestAnimationFrame(tick);

        // Wait for hero video canplay OR timeout
        const waitVideo = () => {
            const vid = document.querySelector("video") as HTMLVideoElement | null;
            if (!vid) { videoReady = true; checkReady(); return; }
            if (vid.readyState >= 3) { videoReady = true; checkReady(); return; }
            const handler = () => { videoReady = true; vid.removeEventListener("canplay", handler); checkReady(); };
            vid.addEventListener("canplay", handler);
            // Safety: max 4s wait
            setTimeout(() => {
                if (!videoReady) { videoReady = true; vid.removeEventListener("canplay", handler); checkReady(); }
            }, 4000);
        };
        setTimeout(waitVideo, 100);

        return () => { cancelled = true; };
    }, []);

    // When ready, signal the parent — the parent handles the exit choreography
    useEffect(() => {
        if (isReady && !hasCalledComplete.current) {
            hasCalledComplete.current = true;
            onComplete();
        }
    }, [isReady, onComplete]);

    return (
        <div
            className="fixed inset-0 z-[9999] bg-[#0b2519] flex items-center justify-center"
        >
            <div data-preloader-content className="relative flex flex-col items-center">
                {/* Orbital ring */}
                <div className="absolute w-36 h-36 md:w-48 md:h-48 pointer-events-none">
                    <div ref={orbitRef} className="absolute inset-0">
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-primary/50" />
                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-1 h-1 rounded-full bg-primary/25" />
                        <div className="absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-1 rounded-full bg-primary/35" />
                    </div>
                    <div className="absolute inset-0 rounded-full border border-primary/[0.06]" />
                    <div className="absolute inset-3 rounded-full border border-primary/[0.03]" />
                </div>

                {/* Brand */}
                <h1 className="text-primary text-2xl md:text-4xl font-bold tracking-[0.5em] uppercase mb-5">
                    Altaria
                </h1>

                {/* Progress bar */}
                <div className="w-28 md:w-36 h-[1px] bg-primary/10 relative overflow-hidden mb-4">
                    <div
                        ref={barRef}
                        className="absolute inset-y-0 left-0 bg-primary/60"
                        style={{ width: "0%" }}
                    />
                </div>

                {/* Counter */}
                <div className="flex items-baseline gap-0.5">
                    <span ref={counterRef} className="text-primary/40 text-[10px] font-mono tracking-widest">0</span>
                    <span className="text-primary/20 text-[9px] font-mono">%</span>
                </div>
            </div>
        </div>
    );
}
