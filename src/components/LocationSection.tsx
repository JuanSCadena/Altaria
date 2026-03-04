"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

export default function LocationSection() {
    const containerRef = useRef<HTMLDivElement>(null);
    const imageWrapperRef = useRef<HTMLDivElement>(null);
    const q1Ref = useRef<HTMLDivElement>(null);
    const q2Ref = useRef<HTMLDivElement>(null);
    const mainTextRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        let ctx = gsap.context(() => {
            // Line animation is now handled by GlobalSnakeLine

            // 2. Fade in preliminary questions
            gsap.from(q1Ref.current, {
                opacity: 0,
                x: 30,
                duration: 1,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: q1Ref.current,
                    start: "top 85%",
                }
            });

            gsap.from(q2Ref.current, {
                opacity: 0,
                x: -30,
                duration: 1,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: q2Ref.current,
                    start: "top 85%",
                }
            });

            // 3. Image parallax and reveal
            gsap.fromTo(imageWrapperRef.current,
                { y: 100, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 1.5,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: imageWrapperRef.current,
                        start: "top 75%",
                    }
                }
            );

            // 4. Main Question & Justification Reveal
            gsap.fromTo(mainTextRef.current,
                { opacity: 0, y: 50 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 1.5,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: mainTextRef.current,
                        start: "top 75%",
                    }
                }
            );

        }, containerRef);
        return () => ctx.revert();
    }, []);

    return (
        <section ref={containerRef} id="location-section" className="relative w-full bg-background-dark text-primary py-32 overflow-hidden z-10">

            {/* Background line is now handled by the global GlobalSnakeLine component */}

            <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10 w-full">

                {/* TOP SECTION: Preliminary Questions */}
                <div className="h-[50vh] relative w-full mb-16 md:mb-32 flex items-center">
                    {/* Right side question */}
                    <div ref={q1Ref} className="absolute right-[5%] md:right-[15%] top-[10%] max-w-xs text-right">
                        <h3 className="text-2xl md:text-3xl font-light italic opacity-90 mb-3 tracking-wide text-white">¿Lejos del ruido?</h3>
                        <p className="text-sm md:text-base opacity-60 font-sans leading-relaxed">
                            Encuentra la paz total sin perder tu conexión vital con la ciudad.
                        </p>
                    </div>

                    {/* Left side question */}
                    <div ref={q2Ref} className="absolute left-[5%] md:left-[15%] bottom-[10%] max-w-xs text-left">
                        <h3 className="text-2xl md:text-3xl font-light italic opacity-90 mb-3 tracking-wide text-white">¿Cerca de la vida?</h3>
                        <p className="text-sm md:text-base opacity-60 font-sans leading-relaxed">
                            A tan solo minutos del área metropolitana, aislado en el corazón del bosque.
                        </p>
                    </div>
                </div>

                {/* BOTTOM SECTION: The location reveal (Image Left, Text Right) */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-16 md:gap-20 mt-24 md:mt-32">

                    {/* Image Block (Left Container) */}
                    <div className="w-full md:w-5/12 relative flex justify-center md:justify-start">
                        <div ref={imageWrapperRef} className="w-[85%] md:w-full aspect-[4/5] bg-black/20 border border-primary/10 rounded-sm overflow-hidden relative shadow-2xl p-2 md:p-3">
                            <Image
                                src="/images/tomadesdeelcielo.jpg"
                                alt="Altaria desde el cielo"
                                fill
                                sizes="(max-width: 768px) 85vw, 42vw"
                                className="object-cover rounded-sm filter brightness-90 saturate-50 hover:brightness-100 hover:saturate-100 transition-all duration-1000"
                                loading="lazy"
                                quality={75}
                            />

                            {/* Radar/Brain Mark */}
                            <div className="absolute top-[65%] left-[50%] -translate-x-1/2 -translate-y-1/2 group cursor-none">
                                <div className="w-16 h-16 border-2 border-[#a7c080]/50 rounded-full animate-ping absolute inset-0 m-auto"></div>
                                <div className="w-20 h-20 border border-[#a7c080]/30 rounded-full absolute inset-0 m-auto animate-spin-slow"></div>
                                <div className="w-3 h-3 bg-[#a7c080] rounded-full absolute inset-0 m-auto shadow-[0_0_15px_rgba(167,192,128,0.8)]"></div>
                                <div className="absolute top-1/2 left-full ml-4 -translate-y-1/2 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                    <span className="bg-background-dark/80 backdrop-blur-sm text-primary text-[10px] tracking-widest px-3 py-1 uppercase rounded-sm border border-primary/20">
                                        Altaria Estate
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Text Block (Right Container) */}
                    <div ref={mainTextRef} className="w-full md:w-6/12 flex flex-col justify-center">
                        <span className="text-[10px] tracking-[0.4em] font-sans opacity-40 mb-6 font-bold uppercase">Ubicación Estratégica</span>
                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-light tracking-tighter leading-[1.1] mb-10 text-white">
                            ¿Dónde se cruzan <br />
                            <span className="italic opacity-60 text-primary">la ciudad y el bosque?</span>
                        </h2>
                        <div className="w-16 h-[1px] bg-primary/30 mb-10"></div>
                        <div className="flex flex-col gap-6 max-w-lg">
                            <p className="text-base md:text-lg font-sans opacity-80 leading-relaxed font-normal">
                                La ubicación de Altaria ha sido cuidadosamente seleccionada para ofrecer
                                lo mejor de ambos mundos. Un santuario natural que te envuelve en silencio
                                y privacidad, preservando una atmósfera exclusiva.
                            </p>
                            <p className="text-base md:text-lg font-sans opacity-60 leading-relaxed font-light">
                                Todo esto, a solo unos pasos de la vitalidad y conveniencia del entorno urbano.
                                Es el equilibrio perfecto entre conectividad total y un refugio personal inalterable.
                            </p>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
