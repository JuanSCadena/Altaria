"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

export default function Header() {
    const headerRef = useRef<HTMLElement>(null);
    const lineRef = useRef<HTMLDivElement>(null);
    const titleRef = useRef<HTMLHeadingElement>(null);
    const leftLinksRef = useRef<HTMLDivElement>(null);
    const rightLinksRef = useRef<HTMLDivElement>(null);
    const [isDark, setIsDark] = useState(false);

    useEffect(() => {
        // Entrance animation
        const tl = gsap.timeline({ defaults: { ease: "power3.out", duration: 1.2 } });
        gsap.set([titleRef.current, ...Array.from(leftLinksRef.current!.children), ...Array.from(rightLinksRef.current!.children)], {
            y: 20,
            opacity: 0
        });
        gsap.set(lineRef.current, { scaleX: 0, transformOrigin: "center" });

        tl.to(lineRef.current, { scaleX: 1, duration: 1.5, ease: "power4.inOut" })
            .to(titleRef.current, { y: 0, opacity: 1, duration: 1 }, "-=0.5")
            .to([...Array.from(leftLinksRef.current!.children), ...Array.from(rightLinksRef.current!.children)], {
                y: 0,
                opacity: 1,
                stagger: 0.1
            }, "-=0.8");

        // Event listener for theme changes from sections
        const handleThemeChange = (e: Event) => {
            const customEvent = e as CustomEvent;
            setIsDark(customEvent.detail === 'dark');
        };

        window.addEventListener('headerTheme', handleThemeChange);

        return () => {
            window.removeEventListener('headerTheme', handleThemeChange);
        };
    }, []);

    return (
        <header
            ref={headerRef}
            className={`fixed top-0 left-0 w-full z-50 pt-6 px-8 transition-colors duration-500 flex flex-col items-center
                ${isDark ? "text-[#0B2519]" : "text-primary"}`}
        >
            <div className="relative w-full h-[1px] mb-4">
                {/* The horizontal line */}
                <div
                    ref={lineRef}
                    className={`absolute inset-0 origin-center transition-colors duration-500
                        ${isDark ? "bg-[#0B2519]/20" : "bg-primary/30"}`}
                />
            </div>

            <nav className="flex justify-between items-center w-full uppercase tracking-widest text-[10px] md:text-xs">
                {/* Left Routes */}
                <div ref={leftLinksRef} className="hidden md:flex gap-8 md:gap-12 w-1/3">
                    <a href="#" className="hover:opacity-50 transition-opacity">Vision</a>
                    <a href="#" className="hover:opacity-50 transition-opacity">Residences</a>
                </div>

                {/* Center Title */}
                <h1 ref={titleRef} className="text-lg md:text-2xl font-bold tracking-[0.4em] text-center w-1/3">
                    Altaria
                </h1>

                {/* Right Routes */}
                <div ref={rightLinksRef} className="hidden md:flex justify-end gap-8 md:gap-12 w-1/3">
                    <a href="#" className="hover:opacity-50 transition-opacity">Gallery</a>
                    <a href="#" className="hover:opacity-50 transition-opacity">Inquire</a>
                </div>
            </nav>
        </header>
    );
}
