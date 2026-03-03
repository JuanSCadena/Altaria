"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

export default function AmenitiesSection() {
    const sectionRef = useRef<HTMLDivElement>(null);
    const headerLabelRef = useRef<HTMLSpanElement>(null);
    const headerNameRef = useRef<HTMLSpanElement>(null);
    const heroTextRef = useRef<HTMLDivElement>(null);
    const leftImageRef = useRef<HTMLDivElement>(null);
    const centerTextRef = useRef<HTMLDivElement>(null);
    const rightBlockRef = useRef<HTMLDivElement>(null);
    const galleryRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // "Tapar" Effect — Slide section up from lower position relative to scroll
            gsap.fromTo(
                sectionRef.current,
                { y: "20vh" }, // Starts overlapping less and slides into position
                {
                    y: 0,
                    ease: "none",
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: "top bottom",
                        end: "top top",
                        scrub: true,
                    }
                }
            );

            // Mini header animation
            gsap.fromTo(
                [headerLabelRef.current, headerNameRef.current],
                { opacity: 0, y: 20 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 1,
                    stagger: 0.15,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: "top 70%",
                    },
                }
            );

            // Hero text across top — staggered word reveal
            gsap.fromTo(
                heroTextRef.current,
                { opacity: 0, y: 40 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 1.2,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: heroTextRef.current,
                        start: "top 80%",
                    },
                }
            );

            // Left image reveal
            gsap.fromTo(
                leftImageRef.current,
                { opacity: 0, y: 80, scale: 0.96 },
                {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    duration: 1.4,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: leftImageRef.current,
                        start: "top 80%",
                    },
                }
            );

            // Center text + button
            gsap.fromTo(
                centerTextRef.current,
                { opacity: 0, x: -30 },
                {
                    opacity: 1,
                    x: 0,
                    duration: 1,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: centerTextRef.current,
                        start: "top 80%",
                    },
                }
            );

            // Right text block
            gsap.fromTo(
                rightBlockRef.current,
                { opacity: 0, y: 30 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 1,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: rightBlockRef.current,
                        start: "top 85%",
                    },
                }
            );

            // Gallery images — cascading reveal
            const galleryImages = galleryRef.current?.querySelectorAll(".gallery-item");
            if (galleryImages) {
                gsap.fromTo(
                    galleryImages,
                    { opacity: 0, y: 60, scale: 0.94 },
                    {
                        opacity: 1,
                        y: 0,
                        scale: 1,
                        duration: 1,
                        stagger: 0.15,
                        ease: "power3.out",
                        scrollTrigger: {
                            trigger: galleryRef.current,
                            start: "top 80%",
                        },
                    }
                );
            }
            // Header theme switch trigger
            ScrollTrigger.create({
                trigger: sectionRef.current,
                start: "top 50px",
                end: "bottom 50px",
                onEnter: () => window.dispatchEvent(new CustomEvent('headerTheme', { detail: 'dark' })),
                onLeave: () => window.dispatchEvent(new CustomEvent('headerTheme', { detail: 'light' })),
                onEnterBack: () => window.dispatchEvent(new CustomEvent('headerTheme', { detail: 'dark' })),
                onLeaveBack: () => window.dispatchEvent(new CustomEvent('headerTheme', { detail: 'light' })),
            });

        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section
            ref={sectionRef}
            className="relative w-full bg-white text-[#0B2519] z-20 -mt-[15vh] overflow-hidden"
            id="amenities-section"
            data-header-light="true"
        >
            {/* ── MINI HEADER ── */}
            <div className="w-full px-6 md:px-12 lg:px-20 pt-20 md:pt-28 pb-8 flex items-center justify-between border-b border-[#0B2519]/10">
                <span
                    ref={headerLabelRef}
                    className="text-[10px] md:text-sm tracking-[0.4em] uppercase font-bold opacity-60"
                >
                    CONFORTE SIN LÍMITES
                </span>
                <span
                    ref={headerNameRef}
                    className="text-[10px] md:text-sm tracking-[0.4em] uppercase font-bold opacity-60"
                >
                    ARTIMIA
                </span>
            </div>

            {/* ── HERO TEXT ACROSS TOP QUARTER ── */}
            <div
                ref={heroTextRef}
                className="w-full px-6 md:px-12 lg:px-20 pt-16 md:pt-28 pb-16 md:pb-24"
            >
                <div className="w-full flex justify-start">
                    <h2 className="text-3xl md:text-5xl lg:text-[4.2rem] xl:text-[5rem] font-light tracking-tighter leading-[1.05] max-w-6xl">
                        Un refugio donde el <span className="italic font-normal opacity-50">confort de los espacios</span> se entrelaza con la serenidad de lo <span className="italic font-normal opacity-50">absolutamente premium.</span>
                    </h2>
                </div>
            </div>

            {/* ── MAIN CONTENT GRID ── */}
            <div className="w-full px-6 md:px-12 lg:px-20 pb-32 md:pb-48">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-start">

                    {/* LEFT — Large Hero Image (Nivel 0) */}
                    <div
                        ref={leftImageRef}
                        className="md:col-span-5 relative"
                    >
                        <div className="aspect-[3/4.5] w-full overflow-hidden shadow-2xl">
                            <img
                                src="/images/salamoderna.png"
                                alt="Espacios Artimia"
                                className="w-full h-full object-cover grayscale-[0.2] hover:grayscale-0 transition-all duration-[2s]"
                            />
                        </div>
                    </div>

                    {/* CENTER — Text + CTA (Desplazado un poco a la derecha/abajo) */}
                    <div
                        ref={centerTextRef}
                        className="md:col-span-3 flex flex-col justify-start pt-12 md:pt-32"
                    >
                        <div className="flex flex-col gap-10">
                            <div className="w-12 h-[2px] bg-[#0B2519]"></div>
                            <p className="text-base md:text-lg leading-relaxed opacity-80 font-sans font-light">
                                La precisión arquitectónica se encuentra con la calidez humana. En Artimia,
                                cada rincón ha sido esculpido para ofrecer una amplitud que respira.
                            </p>

                            {/* Circular Button */}
                            <button className="group relative w-32 h-32 rounded-full border border-[#0B2519]/30 flex items-center justify-center transition-all duration-700 hover:bg-[#0B2519] overflow-hidden">
                                <span className="relative z-10 text-[10px] tracking-[0.3em] uppercase font-bold text-[#0B2519] group-hover:text-white transition-colors duration-500">
                                    Explorar
                                </span>
                                <div className="absolute inset-0 bg-[#0B2519] translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-expo"></div>
                            </button>
                        </div>
                    </div>

                    {/* RIGHT — Elevated Text + Multi-size Gallery */}
                    <div
                        ref={rightBlockRef}
                        className="md:col-span-4 flex flex-col gap-12 md:-mt-32" // ELEVADO respecto a la imagen izquierda
                    >
                        {/* Right top text */}
                        <div className="max-w-sm pl-4 border-l border-[#0B2519]/10">
                            <span className="text-[10px] tracking-[0.4em] uppercase opacity-40 mb-6 block font-bold">
                                VIVIR EN ARTIMIA
                            </span>
                            <h3 className="text-2xl md:text-3xl font-light tracking-tighter leading-tight mb-6">
                                La estética de la <br />
                                <span className="italic font-normal opacity-60">amplitud ininterrumpida.</span>
                            </h3>
                            <p className="text-sm leading-relaxed opacity-60 font-sans">
                                Integramos la luz natural como un material más de construcción,
                                creando una sensación de libertad que solo el verdadero confort puede brindar.
                            </p>
                        </div>

                        {/* Asymmetric Gallery (Fotos de diferentes tamaños) */}
                        <div ref={galleryRef} className="flex flex-col gap-4">
                            <div className="flex gap-4 items-end">
                                {/* Small square */}
                                <div className="gallery-item w-1/3 aspect-square overflow-hidden">
                                    <img src="/images/cuaroyoga.png" className="w-full h-full object-cover" alt="Detalle" />
                                </div>
                                {/* Tall rectangle */}
                                <div className="gallery-item w-2/3 aspect-[4/5] overflow-hidden shadow-xl">
                                    <img src="/images/piscina.png" className="w-full h-full object-cover" alt="Amenidad" />
                                </div>
                            </div>
                            {/* Wide image below */}
                            <div className="gallery-item w-full aspect-[16/9] overflow-hidden">
                                <img src="/images/parque.png" className="w-full h-full object-cover" alt="Entorno" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Subtle bottom divider */}
            <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-[#0B2519]/10 to-transparent"></div>
        </section>
    );
}
