"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

const GALLERY_PHOTOS = [
    { src: "/images/emplazamiento.jpg", alt: "Vista Maestra", w: "w-[24%]", h: "h-[320px] md:h-[450px]", pos: "top-0 left-[0%]", rot: -6, speed: 0.8 },
    { src: "/images/materiales.jpg", alt: "Inspiración", w: "w-[26%]", h: "h-[300px] md:h-[420px]", pos: "top-[30px] left-[20%]", rot: 2, speed: 1.2 },
    { src: "/images/parque.jpg", alt: "Entorno", w: "w-[26%]", h: "h-[340px] md:h-[480px]", pos: "top-[15px] left-[45%]", rot: -3, speed: 1.5 },
    { src: "/images/plano3d.jpg", alt: "Visualización", w: "w-[24%]", h: "h-[280px] md:h-[400px]", pos: "top-[40px] left-[70%]", rot: 5, speed: 0.9 },
];

export default function MapSection() {
    const sectionRef = useRef<HTMLDivElement>(null);
    const titleRef = useRef<HTMLDivElement>(null);
    const mapRef = useRef<HTMLDivElement>(null);
    const galleryRef = useRef<HTMLDivElement>(null);
    const photoRefs = useRef<(HTMLDivElement | null)[]>([]);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Snake line animation is now handled by GlobalSnakeLine

            // 2. Text reveal
            if (titleRef.current) {
                gsap.from(titleRef.current, {
                    opacity: 0,
                    y: 40,
                    duration: 1.2,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: titleRef.current,
                        start: "top 80%",
                    }
                });
            }

            // 3. Map reveal
            if (mapRef.current) {
                gsap.from(mapRef.current, {
                    opacity: 0,
                    x: 40,
                    duration: 1.2,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: mapRef.current,
                        start: "top 80%",
                    }
                });
            }

            // 4. Photo collage staggered reveal + individual parallax
            const photos = photoRefs.current.filter(Boolean) as HTMLDivElement[];
            photos.forEach((photo, i) => {
                const photoData = GALLERY_PHOTOS[i];

                // Initial Entrance
                gsap.from(photo, {
                    opacity: 0,
                    y: 60,
                    rotation: photoData.rot * 2,
                    scale: 0.85,
                    duration: 1.5,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: photo,
                        start: "top 95%",
                    }
                });

                // Subtle Scroll Parallax
                gsap.to(photo, {
                    y: -40 * (photoData.speed || 1),
                    ease: "none",
                    scrollTrigger: {
                        trigger: galleryRef.current,
                        start: "top bottom",
                        end: "bottom top",
                        scrub: true,
                    }
                });
            });

        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section
            ref={sectionRef}
            className="relative w-full bg-background-dark text-primary overflow-hidden"
        >
            {/* Snake line is now handled by the global GlobalSnakeLine component */}

            {/* ── MAIN CONTENT ── */}
            <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 lg:px-20 pt-16 md:pt-24 pb-12 md:pb-16">

                {/* TOP ROW: Text (Left) + Map (Right) */}
                <div className="flex flex-col md:flex-row gap-10 md:gap-16 items-start">

                    {/* Left: Title & Location Text */}
                    <div ref={titleRef} className="w-full md:w-5/12 flex flex-col gap-6 md:gap-8">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-[1.5px] bg-primary/25" />
                            <span className="text-[9px] md:text-[10px] tracking-[0.5em] uppercase font-bold text-primary/40">
                                Ubicación
                            </span>
                        </div>

                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-light tracking-tighter leading-[1.08] text-white">
                            Un refugio{" "}
                            <span className="italic font-normal opacity-60 text-primary">
                                estratégicamente
                            </span>{" "}
                            conectado con{" "}
                            <span className="italic font-normal opacity-60 text-primary">
                                el mundo.
                            </span>
                        </h2>

                        <div className="w-10 h-[1px] bg-primary/20" />

                        <p className="text-sm md:text-base font-sans opacity-70 leading-relaxed max-w-md">
                            Altaria se sitúa en un enclave privilegiado donde la naturaleza
                            virgen se encuentra con la accesibilidad urbana. A minutos del
                            centro metropolitano, pero envuelto en el silencio de un bosque
                            centenario.
                        </p>

                        <p className="text-sm md:text-base font-sans opacity-50 leading-relaxed max-w-md font-light">
                            Cada residencia ha sido orientada para maximizar las vistas
                            panorámicas y la entrada de luz natural, creando un diálogo
                            permanente entre arquitectura y paisaje.
                        </p>

                        {/* Mini stats */}
                        <div className="flex gap-8 md:gap-12 mt-4">
                            <div className="flex flex-col">
                                <span className="text-2xl md:text-3xl font-light text-white tracking-tight">15</span>
                                <span className="text-[9px] tracking-widest uppercase opacity-40 mt-1">Min al centro</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-2xl md:text-3xl font-light text-white tracking-tight">2.4k</span>
                                <span className="text-[9px] tracking-widest uppercase opacity-40 mt-1">M² de bosque</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-2xl md:text-3xl font-light text-white tracking-tight">360°</span>
                                <span className="text-[9px] tracking-widest uppercase opacity-40 mt-1">Vista panorámica</span>
                            </div>
                        </div>
                    </div>

                    {/* Right: Google Maps Embed */}
                    <div ref={mapRef} className="w-full md:w-7/12">
                        <div className="relative w-full aspect-[4/3] md:aspect-[16/10] rounded-sm overflow-hidden shadow-2xl border border-primary/10">
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3976.123456789!2d-75.56!3d6.25!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNsKwMTUnMDAuMCJOIDc1wrAzMycwMC4wIlc!5e0!3m2!1ses!2sco!4v1600000000000"
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                allowFullScreen
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                className="absolute inset-0 w-full h-full"
                                title="Ubicación Altaria"
                            />
                            {/* Subtle overlay border glow */}
                            <div className="absolute inset-0 pointer-events-none border border-primary/5 rounded-sm" />
                        </div>

                        {/* Map caption */}
                        <div className="flex items-center gap-3 mt-4 opacity-40">
                            <div className="w-2 h-2 bg-[#a7c080] rounded-full shadow-[0_0_8px_rgba(167,192,128,0.6)]" />
                            <span className="text-[9px] tracking-widest uppercase">Ubicación referencial — Interactúa con el mapa</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── BOTTOM: Giant ALTARIA text + Photo Gallery Overlay ── */}
            <div className="relative w-full mt-16 md:mt-24 pb-20 md:pb-32 overflow-hidden">

                {/* Background Layer: Giant ALTARIA Letters Spaced Evenly */}
                <div
                    className="absolute inset-x-0 bottom-16 md:bottom-24 flex items-center justify-between px-4 md:px-12 pointer-events-none select-none z-0 overflow-hidden font-bold text-white/[0.04] leading-none text-[15vw] md:text-[12vw] tracking-tighter"
                    aria-hidden="true"
                >
                    <span>A</span>
                    <span>L</span>
                    <span>T</span>
                    <span>A</span>
                    <span>R</span>
                    <span>I</span>
                    <span>A</span>
                </div>

                {/* Foreground Layer: Photo Collage */}
                <div
                    ref={galleryRef}
                    className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 lg:px-20"
                >
                    {/* Mobile: Horizontal scroll gallery / Desktop: Artistic scattered grid */}
                    <div className="relative h-[480px] md:h-[550px] w-full">
                        {GALLERY_PHOTOS.map((photo, idx) => (
                            <div
                                key={idx}
                                ref={(el) => { photoRefs.current[idx] = el; }}
                                className={`absolute ${photo.pos} ${photo.w} ${photo.h} overflow-hidden rounded-sm shadow-2xl group transition-shadow duration-500 hover:shadow-[0_20px_50px_rgba(0,0,0,0.5)]`}
                                style={{ transform: `rotate(${photo.rot}deg)` }}
                            >
                                <Image
                                    src={photo.src}
                                    alt={photo.alt}
                                    fill
                                    sizes="(max-width: 768px) 50vw, 26vw"
                                    className="object-cover transition-transform duration-1000 group-hover:scale-110"
                                    loading="lazy"
                                    quality={70}
                                />
                                {/* Subtle overlay border glow */}
                                <div className="absolute inset-0 border border-white/5 pointer-events-none" />
                                {/* Soft dark vignette */}
                                <div className="absolute inset-0 bg-gradient-to-tr from-black/20 via-transparent to-transparent pointer-events-none" />
                            </div>
                        ))}
                    </div>

                    {/* Decorative bottom line */}
                    <div className="flex items-center gap-4 mt-12 md:mt-16">
                        <div className="flex-grow h-[1px] bg-primary/10" />
                        <span className="text-[8px] md:text-[9px] tracking-[0.6em] uppercase text-primary/25 font-bold">
                            Altaria Estate — Ubicación Exclusiva
                        </span>
                        <div className="flex-grow h-[1px] bg-primary/10" />
                    </div>
                </div>
            </div>
        </section>
    );
}
