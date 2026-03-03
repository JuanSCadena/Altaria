"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

export default function LocationSection() {
    const containerRef = useRef<HTMLDivElement>(null);
    const pathRef = useRef<SVGPathElement>(null);
    const imageWrapperRef = useRef<HTMLDivElement>(null);
    const q1Ref = useRef<HTMLDivElement>(null);
    const q2Ref = useRef<HTMLDivElement>(null);
    const mainTextRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        let ctx = gsap.context(() => {
            // 1. Draw the SVG line as user scrolls down
            if (pathRef.current) {
                const path = pathRef.current;
                const length = path.getTotalLength();

                gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });

                gsap.to(path, {
                    strokeDashoffset: 0,
                    ease: "none",
                    scrollTrigger: {
                        trigger: containerRef.current,
                        start: "top 20%", // Early start to draw the transition
                        end: "bottom 95%",
                        scrub: true,
                    }
                });
            }

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
        <section ref={containerRef} className="relative w-full bg-background-dark text-primary py-32 overflow-hidden z-10">

            {/* BACKGROUND CONTINUOUS ARROW PATH */}
            <div className="absolute inset-x-0 top-0 h-[100%] pointer-events-none z-0 flex justify-center">
                <svg
                    viewBox="0 0 1000 1500"
                    fill="none"
                    preserveAspectRatio="xMidYMin slice"
                    className="w-full h-full max-w-5xl opacity-20 md:opacity-40 text-[#a7c080]"
                >
                    {/* NEW PATH: Combines the curly transition arrow + the meandering line into ONE path */}
                    <path
                        ref={pathRef}
                        d="M500,0 
                           C520,10 540,30 520,55 
                           C500,80 460,100 480,125 
                           C500,150 520,130 500,160 
                            L500,200 
                           C600,300 750,450 600,600 
                           C450,750 200,800 350,1100 
                           C400,1200 400,1200 350,1230 
                           C200,1300 450,1400 350,1480"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />

                    {/* ArrowHead at the end of the location path */}
                    <path
                        d="M335,1455 L350,1480 L365,1455"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            </div>

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
                            <img
                                src="/images/tomadesdeelcielo.png"
                                alt="Altaria desde el cielo"
                                className="w-full h-full object-cover rounded-sm filter brightness-90 saturate-50 hover:brightness-100 hover:saturate-100 transition-all duration-1000"
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
