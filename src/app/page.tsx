"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
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

const VIDEOS = [
    "/videos/tomaaereasinmarcacomp.mp4",
    "/videos/salatoexteriosdinmarcacomp.mp4"
];

export default function Home() {
    const containerRef = useRef<HTMLElement>(null);
    const textRef = useRef<HTMLDivElement>(null);
    const sloganLinesRef = useRef<HTMLHeadingElement>(null);
    const [currentVideo, setCurrentVideo] = useState(0);

    const handleVideoEnd = () => {
        setCurrentVideo((prev) => (prev + 1) % VIDEOS.length);
    };

    useEffect(() => {
        // Basic entrance animation for the Hero content
        const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

        tl.fromTo(containerRef.current, { opacity: 0 }, { opacity: 1, duration: 2 })
            .fromTo(
                Array.from(sloganLinesRef.current!.children),
                { y: 50, opacity: 0 },
                { y: 0, opacity: 1, stagger: 0.15, duration: 1.5 },
                "-=1"
            )
            .fromTo(
                textRef.current,
                { opacity: 0, filter: "blur(10px)" },
                { opacity: 1, filter: "blur(0px)", duration: 2 },
                "-=1"
            );
    }, []);

    return (
        <SmoothScroll>
            <Header />
            <main className="relative min-h-[200vh]">

                {/* Global decorative snake line that traverses the entire page */}
                <GlobalSnakeLine />
                <section ref={containerRef} className="relative h-screen w-full flex items-center justify-center overflow-hidden">

                    {/* Background Loop Videos */}
                    <video
                        key={currentVideo}
                        autoPlay
                        muted
                        playsInline
                        onEnded={handleVideoEnd}
                        className="absolute inset-0 w-full h-full object-cover object-center z-[-2]"
                    >
                        <source src={VIDEOS[currentVideo]} type="video/mp4" />
                    </video>

                    {/* Neutral dark overlay to guarantee text legibility without altering natural video colors */}
                    <div className="absolute inset-0 bg-black/40 z-[-1]" />

                    {/* Slogan & Typography */}
                    <div className="z-10 text-center flex flex-col items-center max-w-5xl px-6 text-primary drop-shadow-xl">
                        <h2 ref={sloganLinesRef} className="text-5xl md:text-7xl lg:text-9xl font-bold tracking-tighter leading-[0.85] mb-8 pb-4">
                            <span className="inline-block">El Arquitecto</span><br />
                            <span className="inline-block">De Tu Legado</span>
                        </h2>

                        <div ref={textRef} className="max-w-xl mx-auto flex flex-col items-center gap-6">
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
    );
}
