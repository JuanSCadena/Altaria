"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

interface CollagePhoto {
    src: string;
    alt: string;
    aspect: string;
    rotation: number;
    parallaxSpeed: number;
    delay: number;
    size?: string;        // custom width for mosaic
}

const STRIP_1_PHOTOS: CollagePhoto[] = [
    { src: "/images/salamoderna.png", alt: "Arquitectura Viva", aspect: "aspect-[3/4]", rotation: -2, parallaxSpeed: 0.6, delay: 0 },
    { src: "/images/cuaroyoga.png", alt: "Zen & Calma", aspect: "aspect-[4/3]", rotation: 1.5, parallaxSpeed: 1.1, delay: 0.1 },
    { src: "/images/interior.png", alt: "Detalle Premium", aspect: "aspect-[3/4]", rotation: -1, parallaxSpeed: 0.8, delay: 0.2 },
];

const STRIP_2_PHOTOS: CollagePhoto[] = [
    { src: "/images/tomadesdeelcielo.png", alt: "Perspectiva", aspect: "aspect-[3/4.5]", rotation: 0, parallaxSpeed: 0.5, delay: 0 },
    { src: "/images/emplazamiento.png", alt: "Entorno Vida", aspect: "aspect-[3/4]", rotation: 0, parallaxSpeed: 0.8, delay: 0.15 },
    { src: "/images/entrada.png", alt: "Bienvenida", aspect: "aspect-[3/4.5]", rotation: 0, parallaxSpeed: 0.5, delay: 0.25 },
];

const STRIP_3_PHOTOS: CollagePhoto[] = [
    { src: "/images/baño.png", alt: "Privacidad", aspect: "aspect-square", rotation: 0, parallaxSpeed: 0.7, delay: 0 },
    { src: "/images/cocina.png", alt: "Vanguardia", aspect: "aspect-square", rotation: 0, parallaxSpeed: 1.2, delay: 0.1 },
    { src: "/images/habitacion.png", alt: "Descanso", aspect: "aspect-square", rotation: 0, parallaxSpeed: 0.9, delay: 0.2 },
];

interface PhotoCollageStripProps {
    variant: "strip1" | "strip2" | "strip3";
}

export default function PhotoCollageStrip({ variant }: PhotoCollageStripProps) {
    const sectionRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const photoRefs = useRef<(HTMLDivElement | null)[]>([]);
    const innerRefs = useRef<(HTMLDivElement | null)[]>([]);

    const photos = variant === "strip1" ? STRIP_1_PHOTOS : variant === "strip2" ? STRIP_2_PHOTOS : STRIP_3_PHOTOS;

    useEffect(() => {
        const ctx = gsap.context(() => {
            const items = photoRefs.current.filter(Boolean) as HTMLDivElement[];
            const inners = innerRefs.current.filter(Boolean) as HTMLDivElement[];

            items.forEach((item, i) => {
                const photo = photos[i];
                const inner = inners[i];

                // Directional entrance for strip1: 0,1 left->right, 2 right->left
                let xStart = 0;
                if (variant === "strip1") {
                    xStart = i < 2 ? -60 : 60;
                }

                gsap.fromTo(
                    item,
                    { opacity: 0, x: xStart, y: 30 },
                    {
                        opacity: 1,
                        x: 0,
                        y: 0,
                        duration: 1.2,
                        delay: photo.delay,
                        ease: "power3.out",
                        scrollTrigger: {
                            trigger: item,
                            start: "top 95%",
                            toggleActions: "play none none none"
                        },
                    }
                );

                if (inner) {
                    gsap.to(inner, {
                        y: -30 * photo.parallaxSpeed,
                        ease: "none",
                        scrollTrigger: {
                            trigger: sectionRef.current,
                            start: "top bottom",
                            end: "bottom top",
                            scrub: true,
                        },
                    });
                }
            });
        }, sectionRef);

        return () => ctx.revert();
    }, [photos, variant]);

    // Layout configuration based on variant
    const getLayoutClasses = () => {
        switch (variant) {
            case "strip1":
                return "grid grid-cols-2 gap-4 md:gap-8 max-w-4xl mx-auto";
            case "strip2":
                return "flex flex-row items-center justify-center gap-2 md:gap-4 max-w-5xl mx-auto";
            case "strip3":
                return "flex flex-col gap-4 md:gap-6 items-start max-w-md";
            default:
                return "flex flex-row gap-8 max-w-5xl mx-auto";
        }
    };

    return (
        <section
            ref={sectionRef}
            className="relative w-full bg-background-dark overflow-hidden py-16 md:py-24"
        >
            {/* Blending Gradients */}
            <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-background-dark to-transparent z-10 pointer-events-none" />
            <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-background-dark to-transparent z-10 pointer-events-none" />

            <div className="px-6 md:px-12 lg:px-20 relative">
                <div ref={containerRef} className={getLayoutClasses()}>
                    {photos.map((photo, idx) => {
                        // Offset styles per variant for an "artistic" feel
                        let offsetStyle = {};
                        // Triptych or Vertical Stack logic
                        let itemClass = "w-full";
                        if (variant === "strip2") {
                            itemClass = idx === 1 ? "w-[45%] md:w-[40%] z-20" : "w-[25%] md:w-[25%] z-10";
                        } else if (variant === "strip3") {
                            itemClass = "w-[60%] md:w-[45%]";
                        }

                        return (
                            <div
                                key={idx}
                                ref={(el) => { photoRefs.current[idx] = el; }}
                                className={`group relative ${variant === "strip1" && idx === 2 ? "col-span-2 flex justify-center pt-4" : itemClass} flex-shrink-0 transition-transform duration-700`}
                                style={offsetStyle}
                            >
                                {/* THE PARALLAX WRAPPER (This is what moves on scroll to avoid the bug) */}
                                <div
                                    ref={(el) => { innerRefs.current[idx] = el; }}
                                    className={`will-change-transform ${variant === "strip1" && idx === 2 ? "w-[90%] md:w-[55%]" : "w-full"}`}
                                >
                                    <div
                                        className={`${photo.aspect} w-full overflow-hidden rounded-[2px] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] relative`}
                                        style={{ transform: `rotate(${photo.rotation}deg)` }}
                                    >
                                        <img
                                            src={photo.src}
                                            alt={photo.alt}
                                            className="w-full h-full object-cover transition-transform duration-[2s] ease-out group-hover:scale-110"
                                        />

                                        {/* Overlays */}
                                        <div className="absolute inset-0 bg-gradient-to-tr from-black/30 via-transparent to-black/10 pointer-events-none" />
                                        <div className="absolute inset-0 border border-white/[0.04] pointer-events-none" />

                                        {/* Minimalist Label */}
                                        <div className="absolute bottom-4 left-4 overflow-hidden">
                                            <span className="block text-[8px] tracking-[0.5em] uppercase text-white/40 font-bold translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                                                {photo.alt}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Decorative Minimalist Accents */}
                <div className="mt-16 md:mt-24 flex items-center justify-center gap-8 opacity-10">
                    <div className="w-12 h-[1px] bg-primary" />
                    <span className="text-[7px] tracking-[0.6em] uppercase text-primary font-bold">Altaria Edition</span>
                    <div className="w-12 h-[1px] bg-primary" />
                </div>
            </div>
        </section>
    );
}
