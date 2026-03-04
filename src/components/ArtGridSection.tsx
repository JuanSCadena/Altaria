"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

const DIRECTORY_LINKS = [
    { label: "Inicio", href: "#hero", num: "01" },
    { label: "Visión", href: "#benefits", num: "02" },
    { label: "Ubicación", href: "#location", num: "03" },
    { label: "Amenidades", href: "#amenities", num: "04" },
    { label: "Residencias", href: "#tipologias", num: "05" },
    { label: "Galería", href: "#map", num: "06" },
];

export default function ArtGridSection() {
    const sectionRef = useRef<HTMLDivElement>(null);
    const gridRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Staggered reveal for each grid cell
            const cells = gridRef.current?.querySelectorAll(".bento-cell");
            if (cells) {
                gsap.from(cells, {
                    opacity: 0,
                    y: 40,
                    stagger: 0.1,
                    duration: 1,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: gridRef.current,
                        start: "top 80%",
                    },
                });
            }

            // Directory links hover shift
            const dirLinks = gridRef.current?.querySelectorAll(".dir-link");
            dirLinks?.forEach((link) => {
                link.addEventListener("mouseenter", () => {
                    gsap.to(link, { x: 6, duration: 0.3, ease: "power2.out" });
                });
                link.addEventListener("mouseleave", () => {
                    gsap.to(link, { x: 0, duration: 0.3, ease: "power2.out" });
                });
            });
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section
            ref={sectionRef}
            className="relative w-full bg-background-dark text-primary"
        >
            {/* ── BENTO GRID ── */}
            <div
                ref={gridRef}
                className="max-w-[1500px] mx-auto px-4 md:px-8 lg:px-12 py-8 md:py-12"
            >
                {/* ═══ DESKTOP: grid-template-areas ═══ */}
                <div
                    className="hidden md:grid gap-[6px]"
                    style={{
                        gridTemplateAreas: `
                            "art     phrases"
                            "art     directory"
                            "video   directory"
                            "video   contact"
                        `,
                        gridTemplateColumns: "1.4fr 0.6fr",
                        gridTemplateRows: "1.2fr 1fr 0.8fr 0.5fr",
                        height: "92vh",
                        maxHeight: "920px",
                        minHeight: "620px",
                    }}
                >
                    {/* ── CELL: Art Text ── */}
                    <div
                        className="bento-cell relative overflow-hidden rounded-[3px]"
                        style={{
                            gridArea: "art",
                            background:
                                "linear-gradient(160deg, #0d2e1f 0%, #132b1e 40%, #0a1f14 100%)",
                        }}
                    >
                        {/* Watermark */}
                        <div
                            className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
                            aria-hidden="true"
                        >
                            <span className="text-[10vw] font-bold text-white/[0.02] tracking-tighter leading-none">
                                ALTARIA
                            </span>
                        </div>

                        {/* Grain */}
                        <div
                            className="absolute inset-0 pointer-events-none opacity-[0.035]"
                            style={{
                                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
                            }}
                        />

                        {/* Content */}
                        <div className="relative z-10 flex flex-col justify-between h-full p-8 lg:p-10">
                            {/* Top */}
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-[1.5px] bg-[#a7c080]/30" />
                                <span className="text-[8px] tracking-[0.5em] uppercase font-bold text-[#a7c080]/50">
                                    Manifiesto
                                </span>
                            </div>

                            {/* Center */}
                            <div className="flex flex-col gap-5 max-w-xl">
                                <h2 className="text-[clamp(1.6rem,3.2vw,2.6rem)] font-light tracking-tighter leading-[1.1] text-primary">
                                    Donde la{" "}
                                    <span className="italic font-normal text-[#a7c080]/80">
                                        arquitectura
                                    </span>{" "}
                                    se convierte en{" "}
                                    <span className="italic font-normal text-[#a7c080]/80">
                                        legado,
                                    </span>{" "}
                                    y cada detalle cuenta{" "}
                                    <span className="italic font-normal text-primary/50">
                                        una historia de permanencia.
                                    </span>
                                </h2>
                                <div className="w-14 h-[1px] bg-primary/10" />
                                <p className="text-[0.82rem] leading-relaxed text-primary/35 font-light max-w-md">
                                    Altaria no es solo un lugar para vivir — es una
                                    declaración de intenciones. Un espacio donde la
                                    naturaleza dicta el ritmo y la arquitectura
                                    responde con reverencia.
                                </p>
                            </div>

                            {/* Bottom */}
                            <span className="text-[7px] tracking-[0.4em] uppercase text-primary/20">
                                EST. 2026 — RESIDENCIAS DE AUTOR
                            </span>
                        </div>

                        {/* Corner accents */}
                        <div className="absolute top-4 right-4 pointer-events-none">
                            <div className="w-[1px] h-10 bg-[#a7c080]/15" />
                            <div className="absolute top-0 left-0 w-10 h-[1px] bg-[#a7c080]/15" />
                        </div>
                        <div className="absolute bottom-4 left-4 pointer-events-none">
                            <div className="w-[1px] h-10 bg-[#a7c080]/15" />
                            <div className="absolute bottom-0 left-0 w-10 h-[1px] bg-[#a7c080]/15" />
                        </div>
                    </div>

                    {/* ── CELL: Phrases ── */}
                    <div
                        className="bento-cell relative overflow-hidden rounded-[3px] flex flex-col justify-between p-5 lg:p-6"
                        style={{
                            gridArea: "phrases",
                            background:
                                "linear-gradient(180deg, #122a1d 0%, #0e231a 100%)",
                        }}
                    >
                        {/* Corner dots */}
                        <div className="absolute top-3 right-3 w-1.5 h-1.5 rounded-full bg-[#a7c080]/20" />
                        <div className="absolute top-3 left-3 w-1.5 h-1.5 rounded-full bg-[#a7c080]/20" />
                        <div className="absolute bottom-3 right-3 w-1.5 h-1.5 rounded-full bg-[#a7c080]/20" />
                        <div className="absolute bottom-3 left-3 w-1.5 h-1.5 rounded-full bg-[#a7c080]/20" />

                        <div>
                            <span className="text-[7px] tracking-[0.5em] uppercase text-[#a7c080]/40 font-bold block mb-2">
                                Filosofía
                            </span>
                            <div className="w-6 h-[1px] bg-primary/10" />
                        </div>

                        <p className="text-[clamp(0.95rem,1.3vw,1.15rem)] font-light tracking-tight leading-snug text-primary/80 italic">
                            &ldquo;El verdadero lujo no se mide en metros
                            cuadrados, sino en la calidad del silencio.&rdquo;
                        </p>

                        <div>
                            <p className="text-[9px] tracking-[0.2em] uppercase text-primary/25 font-light mb-3">
                                — Principio Fundacional
                            </p>
                            <div className="flex items-center gap-3">
                                <div className="flex-grow h-[1px] bg-primary/5" />
                                <span className="text-[7px] tracking-[0.3em] uppercase text-primary/15">
                                    Altaria
                                </span>
                                <div className="flex-grow h-[1px] bg-primary/5" />
                            </div>
                        </div>
                    </div>

                    {/* ── CELL: Directory ── */}
                    <div
                        className="bento-cell relative overflow-hidden rounded-[3px] flex flex-col p-5 lg:p-6"
                        style={{
                            gridArea: "directory",
                            background:
                                "linear-gradient(165deg, #0a1f14 0%, #0d2a1c 50%, #0a1f14 100%)",
                        }}
                    >
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-[7px] tracking-[0.5em] uppercase text-[#a7c080]/40 font-bold">
                                Directorio
                            </span>
                            <div className="w-4 h-4 rounded-full border border-primary/10 flex items-center justify-center">
                                <div className="w-1 h-1 rounded-full bg-[#a7c080]/30" />
                            </div>
                        </div>
                        <div className="w-full h-[1px] bg-primary/5 mb-2" />

                        <nav className="flex flex-col flex-1 justify-between">
                            {DIRECTORY_LINKS.map((link) => (
                                <a
                                    key={link.num}
                                    href={link.href}
                                    className="dir-link group flex items-center justify-between py-[6px] border-b border-primary/[0.04] hover:border-[#a7c080]/20 transition-all duration-500"
                                >
                                    <div className="flex items-center gap-2">
                                        <span className="text-[7px] tracking-wide text-primary/15 font-mono group-hover:text-[#a7c080]/40 transition-colors duration-500">
                                            {link.num}
                                        </span>
                                        <span className="text-[0.8rem] text-primary/50 font-light tracking-wide group-hover:text-primary/80 transition-colors duration-500">
                                            {link.label}
                                        </span>
                                    </div>
                                    <span className="text-primary/10 group-hover:text-[#a7c080]/50 transition-all duration-500 text-[10px]">
                                        →
                                    </span>
                                </a>
                            ))}
                        </nav>
                    </div>

                    {/* ── CELL: Video ── */}
                    <div
                        className="bento-cell relative overflow-hidden rounded-[3px] group"
                        style={{
                            gridArea: "video",
                            background:
                                "linear-gradient(160deg, #0a1f14 0%, #0d2519 100%)",
                        }}
                    >
                        <video
                            autoPlay
                            muted
                            loop
                            playsInline
                            preload="none"
                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-105"
                        >
                            <source
                                src="/videos/salatoexteriosdinmarcacomp.mp4"
                                type="video/mp4"
                            />
                        </video>

                        {/* Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20 pointer-events-none" />

                        {/* Caption */}
                        <div className="absolute bottom-0 left-0 right-0 p-4 z-10">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="flex items-center gap-[3px]">
                                        <div className="w-[2px] h-3 bg-[#a7c080] rounded-full animate-pulse" />
                                        <div
                                            className="w-[2px] h-4 bg-[#a7c080] rounded-full animate-pulse"
                                            style={{ animationDelay: "200ms" }}
                                        />
                                        <div
                                            className="w-[2px] h-2 bg-[#a7c080] rounded-full animate-pulse"
                                            style={{ animationDelay: "400ms" }}
                                        />
                                        <div
                                            className="w-[2px] h-5 bg-[#a7c080] rounded-full animate-pulse"
                                            style={{ animationDelay: "100ms" }}
                                        />
                                    </div>
                                    <span className="text-[8px] tracking-[0.4em] uppercase text-primary/60 font-bold">
                                        Recorrido Virtual
                                    </span>
                                </div>
                                <span className="text-[7px] tracking-[0.3em] uppercase text-primary/30">
                                    ALTARIA
                                </span>
                            </div>
                        </div>

                        <div className="absolute inset-0 border border-white/5 pointer-events-none rounded-[3px]" />
                    </div>

                    {/* ── CELL: Contact ── */}
                    <div
                        className="bento-cell relative overflow-hidden rounded-[3px] flex flex-col items-center justify-center cursor-pointer group"
                        style={{
                            gridArea: "contact",
                            background:
                                "linear-gradient(145deg, #132b1e 0%, #0d2e1f 100%)",
                        }}
                        onClick={() => {
                            /* Future: open contact overlay */
                        }}
                    >
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
                            <div className="absolute inset-3 rounded-[3px] border border-[#a7c080]/10" />
                        </div>

                        <div className="relative flex flex-col items-center gap-2">
                            <div className="w-10 h-10 rounded-full border border-primary/10 flex items-center justify-center group-hover:border-[#a7c080]/30 transition-all duration-700 group-hover:scale-110">
                                <svg
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="w-4 h-4 text-primary/40 group-hover:text-[#a7c080]/70 transition-colors duration-500"
                                >
                                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                                    <polyline points="22,6 12,13 2,6" />
                                </svg>
                            </div>
                            <span className="text-[7px] tracking-[0.4em] uppercase text-primary/25 group-hover:text-primary/50 transition-colors duration-500">
                                Contacto
                            </span>
                        </div>

                        <div className="absolute bottom-2 right-2 text-primary/10 group-hover:text-[#a7c080]/40 transition-all duration-500">
                            <svg
                                viewBox="0 0 16 16"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1"
                                className="w-3 h-3"
                            >
                                <path d="M4 12L12 4M12 4H6M12 4V10" />
                            </svg>
                        </div>
                    </div>
                </div>

                {/* ═══ MOBILE: Stacked ═══ */}
                <div className="md:hidden flex flex-col gap-2">
                    {/* Art Text */}
                    <div
                        className="bento-cell relative overflow-hidden rounded-[3px]"
                        style={{
                            minHeight: "340px",
                            background:
                                "linear-gradient(160deg, #0d2e1f 0%, #132b1e 40%, #0a1f14 100%)",
                        }}
                    >
                        <div className="relative z-10 flex flex-col justify-between h-full p-6">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-[1.5px] bg-[#a7c080]/30" />
                                <span className="text-[8px] tracking-[0.5em] uppercase font-bold text-[#a7c080]/50">
                                    Manifiesto
                                </span>
                            </div>
                            <div className="flex flex-col gap-4 my-6">
                                <h2 className="text-[1.5rem] font-light tracking-tighter leading-[1.1] text-primary">
                                    Donde la{" "}
                                    <span className="italic text-[#a7c080]/80">
                                        arquitectura
                                    </span>{" "}
                                    se convierte en{" "}
                                    <span className="italic text-[#a7c080]/80">
                                        legado,
                                    </span>{" "}
                                    y cada detalle cuenta{" "}
                                    <span className="italic text-primary/50">
                                        una historia de permanencia.
                                    </span>
                                </h2>
                                <div className="w-12 h-[1px] bg-primary/10" />
                                <p className="text-sm leading-relaxed text-primary/35 font-light">
                                    Un espacio donde la naturaleza dicta el ritmo y
                                    la arquitectura responde con reverencia.
                                </p>
                            </div>
                            <span className="text-[7px] tracking-[0.4em] uppercase text-primary/20">
                                EST. 2026
                            </span>
                        </div>
                    </div>

                    {/* Video */}
                    <div
                        className="bento-cell relative overflow-hidden rounded-[3px]"
                        style={{
                            minHeight: "200px",
                            background: "#0a1f14",
                        }}
                    >
                        <video
                            autoPlay
                            muted
                            loop
                            playsInline
                            preload="none"
                            className="absolute inset-0 w-full h-full object-cover"
                        >
                            <source
                                src="/videos/salatoexteriosdinmarcacomp.mp4"
                                type="video/mp4"
                            />
                        </video>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20 pointer-events-none" />
                        <div className="absolute bottom-0 left-0 right-0 p-4 z-10">
                            <span className="text-[8px] tracking-[0.4em] uppercase text-primary/60 font-bold">
                                Recorrido Virtual
                            </span>
                        </div>
                    </div>

                    {/* Phrases */}
                    <div
                        className="bento-cell overflow-hidden rounded-[3px] flex flex-col justify-between p-5"
                        style={{
                            minHeight: "160px",
                            background:
                                "linear-gradient(180deg, #122a1d 0%, #0e231a 100%)",
                        }}
                    >
                        <span className="text-[7px] tracking-[0.5em] uppercase text-[#a7c080]/40 font-bold block mb-2">
                            Filosofía
                        </span>
                        <p className="text-lg font-light tracking-tight leading-snug text-primary/80 italic">
                            &ldquo;El verdadero lujo no se mide en metros
                            cuadrados, sino en la calidad del
                            silencio.&rdquo;
                        </p>
                        <p className="text-[9px] tracking-[0.2em] uppercase text-primary/25 font-light mt-3">
                            — Principio Fundacional
                        </p>
                    </div>

                    {/* Directory */}
                    <div
                        className="bento-cell overflow-hidden rounded-[3px] flex flex-col p-5"
                        style={{
                            background:
                                "linear-gradient(165deg, #0a1f14 0%, #0d2a1c 50%, #0a1f14 100%)",
                        }}
                    >
                        <span className="text-[7px] tracking-[0.5em] uppercase text-[#a7c080]/40 font-bold block mb-3">
                            Directorio
                        </span>
                        <nav className="flex flex-col">
                            {DIRECTORY_LINKS.map((link) => (
                                <a
                                    key={link.num}
                                    href={link.href}
                                    className="flex items-center justify-between py-2 border-b border-primary/[0.04]"
                                >
                                    <div className="flex items-center gap-2">
                                        <span className="text-[7px] text-primary/15 font-mono">
                                            {link.num}
                                        </span>
                                        <span className="text-xs text-primary/50 font-light">
                                            {link.label}
                                        </span>
                                    </div>
                                    <span className="text-primary/10 text-[10px]">
                                        →
                                    </span>
                                </a>
                            ))}
                        </nav>
                    </div>

                    {/* Contact */}
                    <div
                        className="bento-cell overflow-hidden rounded-[3px] flex flex-col items-center justify-center py-7"
                        style={{
                            background:
                                "linear-gradient(145deg, #132b1e 0%, #0d2e1f 100%)",
                        }}
                    >
                        <div className="w-10 h-10 rounded-full border border-primary/10 flex items-center justify-center mb-2">
                            <svg
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1"
                                className="w-4 h-4 text-primary/40"
                            >
                                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                                <polyline points="22,6 12,13 2,6" />
                            </svg>
                        </div>
                        <span className="text-[7px] tracking-[0.4em] uppercase text-primary/25">
                            Contacto
                        </span>
                    </div>
                </div>
            </div>

            {/* Bottom divider */}
            <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 pb-10 md:pb-16">
                <div className="flex items-center gap-4">
                    <div className="flex-grow h-[1px] bg-primary/5" />
                    <span className="text-[7px] tracking-[0.6em] uppercase text-primary/15 font-bold">
                        Altaria — Arte & Arquitectura
                    </span>
                    <div className="flex-grow h-[1px] bg-primary/5" />
                </div>
            </div>
        </section>
    );
}
