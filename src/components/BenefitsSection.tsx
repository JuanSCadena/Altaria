"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

const BENEFITS = [
    {
        image: "/images/piscina.jpg",
        title: "Aguas Cristalinas",
        desc: "Un oasis privado diseñado para la desconexión total y la contemplación profunda en el corazón de Altaria."
    },
    {
        image: "/images/gimnasio.jpg",
        title: "Centro de Bienestar",
        desc: "Equipamiento de primer nivel para cultivar cuerpo y mente sin salir de tu refugio privado."
    },
    {
        image: "/images/zonabbq.jpg",
        title: "Encuentros Culinarios",
        desc: "Áreas sociales creadas para celebrar momentos inolvidables bajo el cielo abierto y aroma de hogar."
    },
    {
        image: "/images/canchatenis.jpg",
        title: "Club Deportivo",
        desc: "Espacios activos para un estilo de vida de élite, rodeados de naturaleza virgen y diseño."
    }
];

export default function BenefitsSection() {
    const sectionRef = useRef<HTMLDivElement>(null);
    const triggerRef = useRef<HTMLDivElement>(null);
    const sliderRef = useRef<HTMLDivElement>(null);
    const [hoverState, setHoverState] = useState<'none' | 'slider' | 'view'>('none');

    // 1. "Drag" Cursor Logic
    useEffect(() => {
        let ctx = gsap.context(() => {
            let xTo = gsap.quickTo(".custom-cursor-wrapper", "x", { duration: 0.15, ease: "none" });
            let yTo = gsap.quickTo(".custom-cursor-wrapper", "y", { duration: 0.15, ease: "none" });

            const moveCursor = (e: MouseEvent) => {
                xTo(e.clientX);
                yTo(e.clientY);
            };
            window.addEventListener("mousemove", moveCursor);
            return () => window.removeEventListener("mousemove", moveCursor);
        });
        return () => ctx.revert();
    }, []);

    // 2. Horizontal Scrolljacking (Desktop Only)
    useEffect(() => {
        let ctx = gsap.context(() => {
            if (!sliderRef.current || !triggerRef.current) return;

            const mm = gsap.matchMedia();

            // DESKTOP: Complex GSAP pinning and scrub
            mm.add("(min-width: 768px)", () => {
                const totalWidth = sliderRef.current!.scrollWidth;
                const windowWidth = window.innerWidth;
                const amountToScroll = totalWidth - windowWidth + 100;

                gsap.to(sliderRef.current, {
                    x: -amountToScroll,
                    ease: "none",
                    scrollTrigger: {
                        trigger: triggerRef.current,
                        pin: true,
                        scrub: 1.2,
                        start: "top top",
                        end: () => `+=${totalWidth}`,
                        invalidateOnRefresh: true,
                    }
                });
            });

            // MOBILE: Native CSS scroll (no GSAP timeline needed)
            mm.add("(max-width: 767px)", () => {
                // Reset positional values
                gsap.set(sliderRef.current, { clearProps: "x" });
            });

        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <div ref={sectionRef} className="relative w-full bg-background-dark text-primary selection:bg-primary selection:text-background-dark overflow-hidden">

            <div className="custom-cursor-wrapper fixed top-0 left-0 z-50 pointer-events-none">
                <div className={`absolute top-0 left-0 w-32 h-32 -ml-16 -mt-16 bg-[#a7c080]/60 backdrop-blur-md text-[#0b2519] rounded-full flex items-center justify-center text-sm font-medium transition-all duration-500 ease-out origin-center ${hoverState === 'slider' ? "scale-100 opacity-100" : "scale-50 opacity-0"}`}>
                    Drag
                </div>
                <div className={`absolute top-0 left-0 w-32 h-32 -ml-16 -mt-16 bg-[#e0edc8]/20 backdrop-blur-sm border border-[#e0edc8]/40 text-[#f5f5f5] rounded-full flex items-center justify-center text-sm font-medium transition-all duration-500 ease-out origin-center ${hoverState === 'view' ? "scale-100 opacity-100" : "scale-50 opacity-0"}`}>
                    View
                </div>
            </div>

            <div ref={triggerRef} className="h-auto md:h-screen min-h-[100svh] w-full flex flex-col justify-start relative pt-32 md:pt-36 z-10 bg-background-dark">
                <div className="px-6 md:px-12 lg:px-20 mb-8 md:mb-10 w-full shrink-0">
                    <h2 className="benefit-title text-4xl md:text-5xl lg:text-6xl font-light tracking-tight leading-tight md:max-w-[85vw] text-white/90">
                        Ofrecemos un <span className="italic font-normal serif opacity-80 decoration-primary/20 text-primary">catálogo de espacios verdes</span> y tipologías diseñadas para la contemplación.
                    </h2>
                </div>

                {/* Minimalist Mobile Slider Indicator */}
                <div className="md:hidden flex items-center justify-start gap-4 px-6 mb-6">
                    <div className="w-12 h-[1px] bg-primary/30"></div>
                    <span className="uppercase text-[9px] tracking-widest text-primary/60 font-medium">Desliza para explorar</span>
                    <svg className="w-3 h-3 text-primary/60 animate-bounce-x" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                </div>

                <div
                    ref={sliderRef}
                    className="flex items-start md:items-center gap-6 md:gap-0 pl-6 pr-6 md:pl-0 md:pr-[40vw] mt-4 overflow-x-auto md:overflow-visible overflow-y-hidden snap-x snap-mandatory md:snap-none"
                    onMouseEnter={() => setHoverState('slider')}
                    onMouseLeave={() => setHoverState('none')}
                    style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                >
                    <style dangerouslySetInnerHTML={{ __html: `::-webkit-scrollbar { display: none; }` }} />
                    {BENEFITS.map((item, idx) => (
                        <div key={idx} className="flex-shrink-0 flex flex-col md:flex-row items-center h-auto md:h-[48vh] w-[85vw] md:w-auto snap-center transition-all duration-700 pb-12 md:pb-0">
                            <div className="relative w-full md:w-[42vw] h-[40vh] md:h-full overflow-hidden shrink-0 pr-0 md:pr-16 mb-8 md:mb-0">
                                <Image
                                    src={item.image}
                                    alt={item.title}
                                    fill
                                    sizes="(max-width: 768px) 85vw, 42vw"
                                    className="object-cover shadow-2xl rounded-sm"
                                    loading="lazy"
                                    quality={75}
                                />
                            </div>

                            <div className="w-full md:w-[28vw] h-auto md:h-full flex flex-col justify-start md:justify-between shrink-0 pr-4 md:pr-24 py-0 md:py-8">
                                <div className="flex justify-between items-center text-xs tracking-widest opacity-40 mb-6 md:mb-0">
                                    <span>SPEC (0{idx + 1})</span>
                                    <div className="hidden md:flex gap-3">
                                        <div className="w-8 h-8 border border-primary/20 rounded-full flex items-center justify-center cursor-none hover:bg-primary/10 transition-colors">←</div>
                                        <div className="w-8 h-8 border border-primary/20 rounded-full flex items-center justify-center cursor-none hover:bg-primary/10 transition-colors">→</div>
                                    </div>
                                    {/* Removed redundant inline mobile drag text */}
                                </div>

                                <div className="mb-2">
                                    <h3 className="text-3xl md:text-4xl lg:text-5xl font-light tracking-tighter leading-none mb-4 text-white max-w-[320px]">
                                        {item.title}
                                    </h3>
                                    <p className="text-sm md:text-base font-sans opacity-70 leading-relaxed max-w-[300px] italic">
                                        {item.desc}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
