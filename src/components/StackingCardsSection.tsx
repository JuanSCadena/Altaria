"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

const TIPOLOGIAS = [
    {
        id: 1,
        label: "TIPOLOGÍA 01",
        title: "Residencias de Horizonte",
        desc: "Diseño abierto que integra la naturaleza como un lienzo vivo, fusionando elegancia estructural con la calidez del entorno.",
        image: "/images/sala.jpg",
        accent: "ESPACIOS PREMIUM",
    },
    {
        id: 2,
        label: "TIPOLOGÍA 02",
        title: "Suites de Contemplación",
        desc: "Espacios elevados donde cada ventana enmarca un fragmento de paisaje, creando una galería natural de serenidad.",
        image: "/images/dormitoriodibujo.jpg",
        accent: "DISEÑO INTEGRADO",
    },
    {
        id: 3,
        label: "TIPOLOGÍA 03",
        title: "Estudios de Luz Natural",
        desc: "Arquitectura que respira: cada rincón calibrado para capturar la luz del día y transformarla en ambiente.",
        image: "/images/comedordibujo.jpg",
        accent: "ILUMINACIÓN NATURAL",
    },
    {
        id: 4,
        label: "TIPOLOGÍA 04",
        title: "Penthouses Privados",
        desc: "El epítome del lujo discreto. Interiores expansivos coronados por terrazas con vistas panorámicas de 360°.",
        image: "/images/tomadesdearriba.jpg",
        accent: "EXCLUSIVIDAD",
    },
    {
        id: 5,
        label: "TIPOLOGÍA 05",
        title: "Villas Jardín",
        desc: "Residencias con jardines privados que diluyen la frontera entre el hogar y la naturaleza circundante.",
        image: "/images/entrada.jpg",
        accent: "NATURALEZA & HOGAR",
    },
];

export default function StackingCardsSection() {
    const wrapperRef = useRef<HTMLDivElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const pinnedRef = useRef<HTMLDivElement>(null);
    const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
    const contentRefs = useRef<(HTMLDivElement | null)[]>([]);
    const overlayRefs = useRef<(HTMLDivElement | null)[]>([]);
    const shadowRefs = useRef<(HTMLDivElement | null)[]>([]);

    useEffect(() => {
        const ctx = gsap.context(() => {
            /* ── Video Parallax ── */
            if (videoRef.current) {
                gsap.fromTo(
                    videoRef.current,
                    { scale: 1.05 },
                    {
                        scale: 1,
                        ease: "none",
                        scrollTrigger: {
                            trigger: videoRef.current,
                            start: "top bottom",
                            end: "bottom top",
                            scrub: true,
                        },
                    }
                );
            }

            /* ── BIFURCATED SCROLL ANIMATION (DESKTOP VS MOBILE) ── */
            const panels = cardRefs.current.filter(Boolean) as HTMLDivElement[];
            if (!pinnedRef.current || panels.length === 0) return;

            // Use matchMedia so complex stacking ONLY occurs on desktop (min-width: 768px)
            const mm = gsap.matchMedia();

            mm.add("(min-width: 768px)", () => {
                // 1. Initial desktop positions
                gsap.set(panels, { yPercent: (i) => i * 100, opacity: 1 });

                // 2. Timeline attached to the tall container
                const tl = gsap.timeline({
                    scrollTrigger: {
                        trigger: pinnedRef.current,
                        start: "top top",
                        end: "bottom bottom",
                        scrub: 0.3,
                        invalidateOnRefresh: true,
                    }
                });

                // 3. Build stepping animation — duration:1 on EVERY tween
                for (let i = 1; i <= 5; i++) {
                    const movingPanels = panels.slice(i);

                    tl.to(movingPanels, {
                        yPercent: "-=100",
                        duration: 1,
                        ease: "none",
                    }, i - 1);

                    const coveredContent = contentRefs.current[i - 1];
                    const coveredOverlay = overlayRefs.current[i - 1];

                    if (coveredContent) {
                        tl.to(coveredContent, {
                            scale: 0.94,
                            duration: 1,
                            transformOrigin: "top center",
                            ease: "none"
                        }, i - 1);
                    }

                    if (coveredOverlay) {
                        tl.to(coveredOverlay, {
                            opacity: 0.5,
                            duration: 1,
                            ease: "none"
                        }, i - 1);
                    }

                    const coveringShadow = shadowRefs.current[i];
                    if (coveringShadow) {
                        tl.fromTo(coveringShadow,
                            { opacity: 0 },
                            { opacity: 1, duration: 1, ease: "none" },
                            i - 1);
                    }
                }
            });

            // Mobile: natural scroll flow, simple fade-in
            mm.add("(max-width: 767px)", () => {
                // Reset any lingering desktop offsets so they stack naturally in flex-col
                gsap.set(panels, { clearProps: "yPercent,scale,opacity", yPercent: 0 });

                panels.forEach((panel) => {
                    gsap.from(panel, {
                        opacity: 0,
                        y: 30, // Subtle slide up
                        duration: 1,
                        ease: "power2.out",
                        scrollTrigger: {
                            trigger: panel,
                            start: "top 85%", // Starts earlier to avoid blank space frustration
                            toggleActions: "play none none reverse"
                        }
                    });
                });
            });
        }, wrapperRef);

        return () => ctx.revert();
    }, []);

    // Slight gradient for the background of the panels
    const getPanelBg = (idx: number) => {
        const lightness = 95 - idx * 2.5; // darkens slightly
        const saturation = 30 - idx * 1.5;
        return `hsl(38, ${saturation}%, ${lightness}%)`;
    };

    return (
        <div ref={wrapperRef} className="relative w-full bg-background-dark">

            <div className="h-[15vh] md:h-[20vh]" />

            {/* ── VIDEO SECTION — half section ── */}
            <div className="relative w-full overflow-hidden px-6 md:px-12 lg:px-20" style={{ height: "50vh" }}>
                <div className="relative w-full h-full rounded-lg overflow-hidden shadow-2xl">
                    <video
                        ref={videoRef}
                        autoPlay
                        muted
                        loop
                        playsInline
                        preload="none"
                        className="absolute inset-0 w-full h-full object-cover"
                    >
                        <source src="/videos/planoa3dsinmarcacomp.mp4" type="video/mp4" />
                    </video>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-black/10 pointer-events-none" />
                </div>
            </div>

            <div className="h-[15vh] md:h-[20vh]" />

            {/* TALL CONTAINER — provides the scroll track ONLY on Desktop */}
            <div
                ref={pinnedRef}
                className="relative w-full md:h-[500vh] bg-background-dark flex flex-col md:block"
            >
                {/* STICKY WRAPPER — stays fixed in view while the parent scrolls ONLY on Desktop */}
                <div className="md:sticky md:top-0 w-full md:h-screen md:overflow-hidden flex flex-col md:block">
                    {/* Panel 0: INTRO */}
                    <div
                        ref={(el) => { cardRefs.current[0] = el; }}
                        className="relative md:absolute md:top-0 md:left-0 w-full flex items-center md:will-change-transform py-20 md:py-0 min-h-[50vh] md:min-h-0 md:h-screen"
                        style={{ zIndex: 0, backgroundColor: getPanelBg(0) }}
                    >
                        <div ref={(el) => { contentRefs.current[0] = el; }} className="w-full h-full flex flex-col justify-center px-8 md:px-16 lg:px-24 relative z-10 md:will-change-transform">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="w-14 h-[1.5px] bg-[#0B2519]/25" />
                                <span className="text-[10px] md:text-xs tracking-[0.5em] uppercase font-bold text-[#0B2519]/40">
                                    TIPOLOGÍAS ARTIMIA
                                </span>
                            </div>
                            <h2 className="text-3xl md:text-5xl lg:text-[3.8rem] font-light tracking-tighter leading-[1.08] text-[#0B2519] max-w-4xl">
                                Cada espacio ha sido{" "}
                                <span className="italic font-normal opacity-50">
                                    diseñado como una pieza única
                                </span>{" "}
                                que responde al ritmo de{" "}
                                <span className="italic font-normal opacity-50">
                                    quienes lo habitan.
                                </span>
                            </h2>
                        </div>
                        {/* Dimming overlay */}
                        <div ref={(el) => { overlayRefs.current[0] = el; }} className="absolute inset-0 bg-[#0B2519] opacity-0 z-20 pointer-events-none will-change-transform" />
                    </div>

                    {/* Panels 1-5: TIPOLOGÍAS */}
                    {TIPOLOGIAS.map((tipo, idx) => {
                        const panelIndex = idx + 1;
                        const isEven = idx % 2 === 0;

                        return (
                            <div
                                key={tipo.id}
                                ref={(el) => { cardRefs.current[panelIndex] = el; }}
                                className="relative md:absolute md:top-0 md:left-0 w-full flex py-16 md:py-0 md:items-center md:will-change-transform min-h-[75vh] md:min-h-0 md:h-screen"
                                style={{
                                    zIndex: panelIndex,
                                    backgroundColor: getPanelBg(panelIndex),
                                    borderTop: "1px solid rgba(255, 255, 255, 0.1)"
                                }}
                            >
                                {/* Dynamic shadow — starts at opacity 0, animated by GSAP only when card begins to slide */}
                                <div
                                    ref={(el) => { shadowRefs.current[panelIndex] = el; }}
                                    className="hidden md:block absolute top-0 left-0 w-full h-[180px] -translate-y-full pointer-events-none z-30 md:will-change-transform"
                                    style={{
                                        opacity: 0,
                                        background: "linear-gradient(to top, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.12) 40%, transparent 100%)"
                                    }}
                                />

                                <div ref={(el) => { contentRefs.current[panelIndex] = el; }} className="w-full h-full flex items-center justify-center relative z-10 will-change-transform">
                                    <div className="w-full h-full flex items-center px-8 md:px-16 lg:px-24">
                                        <div className={`w-full grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-10 items-center ${!isEven ? "direction-rtl" : ""}`}>
                                            {/* IMAGE COLUMN */}
                                            <div
                                                className={`md:col-span-5 overflow-hidden rounded-sm shadow-xl relative ${isEven ? "md:order-1" : "md:order-2"}`}
                                                style={{ height: "clamp(180px, 36vh, 400px)" }}
                                            >
                                                <Image
                                                    src={tipo.image}
                                                    alt={tipo.title}
                                                    fill
                                                    sizes="(max-width: 768px) 100vw, 42vw"
                                                    className="object-cover"
                                                    loading="lazy"
                                                    quality={70}
                                                />
                                            </div>

                                            {/* TEXT COLUMN */}
                                            <div
                                                className={`md:col-span-6 flex flex-col gap-3 md:gap-4 ${isEven ? "md:order-2 md:col-start-7 md:pl-4" : "md:order-1 md:pr-4"
                                                    }`}
                                            >
                                                <div className="flex items-center justify-between">
                                                    <span className="text-[9px] md:text-[10px] tracking-[0.5em] uppercase font-bold text-[#0B2519]/40">
                                                        {tipo.label}
                                                    </span>
                                                    <span className="text-[9px] tracking-[0.25em] uppercase text-[#0B2519]/20 hidden md:inline">
                                                        {tipo.accent}
                                                    </span>
                                                </div>

                                                <h3 className="text-2xl md:text-3xl lg:text-[2.6rem] font-light tracking-tighter leading-[1.1] text-[#0B2519]">
                                                    {tipo.title}
                                                </h3>

                                                <div className="w-8 h-[1px] bg-[#0B2519]/15" />

                                                <p className="text-sm md:text-[0.95rem] leading-relaxed text-[#0B2519]/50 font-light max-w-md">
                                                    {tipo.desc}
                                                </p>

                                                <button className="self-start mt-1 text-[9px] md:text-[10px] tracking-[0.3em] uppercase font-bold text-[#0B2519]/50 border-b border-[#0B2519]/15 pb-1 hover:text-[#0B2519] hover:border-[#0B2519]/40 transition-all duration-500">
                                                    Explorar →
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Enormous Watermark Number */}
                                    <span className="absolute bottom-1 md:bottom-2 right-4 md:right-12 text-[6rem] md:text-[12rem] font-bold leading-[0.8] text-[#0B2519]/[0.015] md:text-[#0B2519]/[0.025] select-none pointer-events-none z-0">
                                        {String(tipo.id).padStart(2, "0")}
                                    </span>
                                </div>

                                {/* Dimming overlay for when THIS panel gets covered (Desktop Only) */}
                                <div ref={(el) => { overlayRefs.current[panelIndex] = el; }} className="hidden md:block absolute inset-0 bg-[#0B2519] opacity-0 z-20 pointer-events-none md:will-change-transform" />
                            </div>
                        );
                    })}
                </div>
            </div>


        </div>
    );
}
