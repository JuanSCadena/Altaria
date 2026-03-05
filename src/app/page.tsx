"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Header from "@/components/Header";
import SmoothScroll from "@/components/SmoothScroll";
import BenefitsSection from "@/components/BenefitsSection";
import LocationSection from "@/components/LocationSection";
import AmenitiesSection from "@/components/AmenitiesSection";
import StackingCardsSection from "@/components/StackingCardsSection";
import MapSection from "@/components/MapSection";
import ArtGridSection from "@/components/ArtGridSection";
import PhotoCollageStrip from "@/components/PhotoCollageStrip";
import GlobalSnakeLine from "@/components/GlobalSnakeLine";
import Preloader from "@/components/Preloader";

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

const VIDEOS = [
    "/videos/tomaaereasinmarcacomp.mp4",
    "/videos/salatoexteriosdinmarcacomp.mp4"
];

export default function Home() {
    const containerRef = useRef<HTMLElement>(null);
    const textRef = useRef<HTMLDivElement>(null);
    const sloganLinesRef = useRef<HTMLHeadingElement>(null);
    const preloaderRef = useRef<HTMLDivElement>(null);
    const [currentVideo, setCurrentVideo] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const hasAnimated = useRef(false);

    const handleVideoEnd = () => {
        setCurrentVideo((prev) => (prev + 1) % VIDEOS.length);
    };

    // Called by Preloader when counter reaches 100% and assets are ready.
    // This orchestrates BOTH the preloader exit AND the hero entrance
    // as a single synchronized timeline — no gap, no empty frames.
    const handlePreloaderReady = useCallback(() => {
        if (hasAnimated.current) return;
        hasAnimated.current = true;

        const preloaderEl = preloaderRef.current;
        const heroEl = containerRef.current;
        const sloganEl = sloganLinesRef.current;
        const ctaEl = textRef.current;

        if (!preloaderEl || !heroEl || !sloganEl) return;

        // Master timeline: preloader exit + hero reveal, perfectly synced
        const master = gsap.timeline({
            defaults: { ease: "power3.inOut" },
            onComplete: () => {
                // Clean up: remove preloader from flow
                preloaderEl.style.pointerEvents = "none";
                preloaderEl.style.visibility = "hidden";
                document.body.style.overflow = "";
                setIsLoading(false);

                // Refresh GSAP for scroll-based animations
                ScrollTrigger.refresh();
                setTimeout(() => ScrollTrigger.refresh(), 300);
                setTimeout(() => ScrollTrigger.refresh(), 1000);
            }
        });

        // Phase 1: Preloader content fades up and out (0.4s)
        master.to(preloaderEl.querySelector('[data-preloader-content]'), {
            opacity: 0, y: -20, duration: 0.4, ease: "power2.in"
        });

        // Phase 2: Preloader curtain lifts while hero simultaneously reveals
        // These run at the SAME time — the curtain slides up revealing the hero underneath
        master.to(preloaderEl, {
            opacity: 0,
            duration: 1.2,
            ease: "power2.inOut"
        }, "curtain");

        // Hero background scale-down (cinematic reveal)
        master.fromTo(heroEl, {
            scale: 1.05
        }, {
            scale: 1,
            duration: 2.0,
            ease: "power2.out"
        }, "curtain");

        // Hero text: staggered reveal from below
        master.fromTo(
            Array.from(sloganEl.children),
            { y: 60, opacity: 0 },
            { y: 0, opacity: 1, stagger: 0.15, duration: 1.4, ease: "power4.out" },
            "curtain+=0.3"
        );

        // CTA button: deblur and fade in
        if (ctaEl) {
            master.fromTo(
                ctaEl,
                { opacity: 0, filter: "blur(10px)" },
                { opacity: 1, filter: "blur(0px)", duration: 1.8, ease: "power3.out" },
                "curtain+=0.6"
            );
        }
    }, []);

    return (
        <>
            {/* Preloader always in DOM — fades via GSAP, never unmounted abruptly */}
            <div ref={preloaderRef}>
                <Preloader onComplete={handlePreloaderReady} />
            </div>
            <SmoothScroll>
                <Header />
                <main className="relative">
                    <GlobalSnakeLine />

                    {/* HERO — always visible; preloader covers it until reveal */}
                    <section
                        ref={containerRef}
                        className="relative h-screen w-full flex items-center justify-center overflow-hidden will-change-transform"
                    >
                        <video
                            key={currentVideo}
                            autoPlay
                            muted
                            playsInline
                            preload="auto"
                            onEnded={handleVideoEnd}
                            className="absolute inset-0 w-full h-full object-cover object-center z-[-2]"
                        >
                            <source src={VIDEOS[currentVideo]} type="video/mp4" />
                        </video>
                        <div className="absolute inset-0 bg-black/40 z-[-1]" />
                        <div className="z-10 text-center flex flex-col items-center max-w-5xl px-6 text-primary drop-shadow-xl">
                            <h2 ref={sloganLinesRef} className="text-5xl md:text-7xl lg:text-9xl font-bold tracking-tighter leading-[0.85] mb-8 pb-4 overflow-hidden">
                                <span className="inline-block" style={{ opacity: 0, transform: 'translateY(60px)' }}>El Arquitecto</span><br />
                                <span className="inline-block" style={{ opacity: 0, transform: 'translateY(60px)' }}>De Tu Legado</span>
                            </h2>
                            <div ref={textRef} className="max-w-xl mx-auto flex flex-col items-center gap-6" style={{ opacity: 0 }}>
                                <button className="mt-8 border border-primary/50 backdrop-blur-sm px-8 py-3 rounded-full text-xs uppercase tracking-widest hover:bg-primary hover:text-background-dark transition-all duration-500">
                                    Descubrir Visión
                                </button>
                            </div>
                        </div>
                    </section>

                    <BenefitsSection />

                    <div id="strip1-collage">
                        <PhotoCollageStrip variant="strip1" />
                    </div>

                    <LocationSection />
                    <AmenitiesSection />

                    <div id="strip2-collage">
                        <PhotoCollageStrip variant="strip2" />
                    </div>

                    <div id="stacking-cards-section">
                        <StackingCardsSection />
                    </div>

                    <div id="map-section-wrapper">
                        <MapSection />
                    </div>

                    <div id="art-grid-wrapper">
                        <ArtGridSection />
                    </div>
                </main>
            </SmoothScroll>
        </>
    );
}
