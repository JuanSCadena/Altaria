"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

/* ─── Section definitions ─── */
interface SectionConfig {
    id: string;
    bg: "dark" | "light";
    /** Varying curve amplitudes (fraction of viewport width). Each entry = one S-curve. */
    amplitudes: number[];
}

// Segment A: strip1 → location → amenities → strip2  (then gap for stacking cards)
const SEGMENT_A: SectionConfig[] = [
    { id: "strip1-collage", bg: "dark", amplitudes: [0.15, 0.25] },
    { id: "location-section", bg: "dark", amplitudes: [0.35, 0.10, 0.22, 0.15] },
    { id: "amenities-section", bg: "light", amplitudes: [0.18, 0.30, 0.12] },
    { id: "strip2-collage", bg: "dark", amplitudes: [0.20, 0.15] },
];

// Segment B: map → artGrid  (after stacking cards)
const SEGMENT_B: SectionConfig[] = [
    { id: "map-section-wrapper", bg: "dark", amplitudes: [0.22, 0.14, 0.28] },
    { id: "art-grid-wrapper", bg: "dark", amplitudes: [0.16, 0.24] },
];

/* ─── Find the actual element with a background (not the wrapper div) ─── */
function findBgElement(wrapper: HTMLElement): HTMLElement {
    if (wrapper.tagName === "SECTION") return wrapper;
    const section = wrapper.querySelector("section");
    return section || wrapper;
}

interface IconPoint {
    type: string;
    x: number;
    y: number;
}

/* ─── Path generator with varied amplitudes & icons ─── */
function generatePath(
    entryX: number,
    width: number,
    height: number,
    amps: number[],
    startLeft: boolean
): { d: string; exitX: number; icons: IconPoint[] } {
    const n = amps.length;
    const segH = height / n;
    const lo = width * 0.08;
    const hi = width * 0.92;
    const clamp = (v: number) => Math.max(lo, Math.min(hi, v));

    let x = entryX;
    let y = 0;
    let d = `M ${r(x)},${r(y)}`;
    let goLeft = startLeft;

    let icons: IconPoint[] = [];
    const iconTypes = ["icon-pine", "icon-oak", "icon-cabin"];

    for (let i = 0; i < n; i++) {
        const sweep = width * amps[i];
        const midY = y + segH * 0.5;
        const nextY = y + segH;

        // Peak position (leftmost or rightmost point of this curve)
        const peakX = clamp(goLeft ? x - sweep : x + sweep);

        // Spawn a dense forest of icons for this segment
        // User requesting: "sin miedo, mas poblado", around 18-28 icons per segment
        const numIcons = 18 + Math.floor(Math.random() * 11);
        for (let j = 0; j < numIcons; j++) {
            const type = iconTypes[Math.floor(Math.random() * iconTypes.length)];
            const iconY = y + Math.random() * segH;

            // Random X across the width
            let iconX = width * (0.05 + Math.random() * 0.9);

            // Avoid the center zone where text usually lives (~ middle 35%)
            const distFromCenter = Math.abs(iconX - width / 2);
            if (distFromCenter < width * 0.18) {
                // Push horizontally out of the center zone
                iconX += (iconX >= width / 2 ? 1 : -1) * (width * 0.18);
            }

            icons.push({ type, x: clamp(iconX), y: iconY });
        }

        // First half: from current position to peak
        d += ` C ${r(x)},${r(y + segH * 0.3)} ${r(peakX)},${r(midY - segH * 0.06)} ${r(peakX)},${r(midY)}`;

        // Second half: from peak to a return position
        const returnAmt = sweep * 0.32;
        const endX = clamp(goLeft ? peakX + returnAmt : peakX - returnAmt);

        d += ` C ${r(peakX)},${r(midY + segH * 0.14)} ${r(endX)},${r(nextY - segH * 0.08)} ${r(endX)},${r(nextY)}`;
        x = endX;
        y = nextY;
        goLeft = !goLeft;
    }

    return { d, exitX: x, icons };
}

function r(n: number): string {
    return n.toFixed(1);
}

/* ─── Component ─── */
export default function GlobalSnakeLine() {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Wait for GSAP pins to settle (BenefitsSection + StackingCardsSection)
        const timer = setTimeout(() => {
            const injected: HTMLElement[] = [];
            const contexts: gsap.Context[] = [];

            function processSegment(
                configs: SectionConfig[],
                startX: number,
                startLeft: boolean
            ) {
                let curX = startX;
                let goLeft = startLeft;

                configs.forEach((cfg) => {
                    const wrapper = document.getElementById(cfg.id);
                    if (!wrapper) {
                        console.warn(`[SnakeLine] Section not found: ${cfg.id}`);
                        return;
                    }

                    // Find the real element with the background color
                    const target = findBgElement(wrapper);
                    const w = target.offsetWidth;
                    const h = target.offsetHeight;
                    if (h < 50) return;

                    // Ensure target creates a stacking context so z-index:-1 works
                    const cs = window.getComputedStyle(target);
                    if (cs.position === "static") {
                        target.style.position = "relative";
                    }
                    if (cs.zIndex === "auto") {
                        target.style.zIndex = "0";
                    }

                    // Generate the serpentine path and icon coordinates
                    const { d, exitX, icons } = generatePath(
                        curX, w, h, cfg.amplitudes, goLeft
                    );

                    // ── Build the SVG element ──
                    const container = document.createElement("div");
                    container.setAttribute("data-snake-line", "true");
                    // z-index: -1 → above background, below all flow content and positioned children
                    container.style.cssText =
                        "position:absolute;inset:0;pointer-events:none;overflow:hidden;z-index:-1;";

                    const NS = "http://www.w3.org/2000/svg";
                    const svg = document.createElementNS(NS, "svg");
                    svg.setAttribute("viewBox", `0 0 ${w} ${h}`);
                    svg.setAttribute("fill", "none");
                    svg.setAttribute("preserveAspectRatio", "none");
                    svg.style.cssText = "width:100%;height:100%;display:block;position:absolute;inset:0;";

                    // Glow filter (removed symbols to avoid mobile stretching bugs)
                    const defs = document.createElementNS(NS, "defs");
                    defs.innerHTML = `
                        <filter id="snk-${cfg.id}" x="-15%" y="-5%" width="130%" height="110%">
                            <feGaussianBlur in="SourceGraphic" stdDeviation="2.5" result="b" />
                            <feMerge>
                                <feMergeNode in="b" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>
                    `;
                    svg.append(defs);

                    // Path element
                    const path = document.createElementNS(NS, "path");
                    path.setAttribute("d", d);
                    const strokeColor =
                        cfg.bg === "dark"
                            ? "rgba(255,247,230,0.22)"
                            : "rgba(90,130,60,0.15)";
                    path.setAttribute("stroke", strokeColor);
                    path.setAttribute("stroke-width", "2");
                    path.setAttribute("stroke-linecap", "round");
                    path.setAttribute("stroke-linejoin", "round");
                    path.setAttribute("vector-effect", "non-scaling-stroke");
                    path.setAttribute("filter", `url(#snk-${cfg.id})`);
                    svg.append(path);

                    // Render Icon elements as completely independent HTML divs with absolute % positioning
                    const iconEls: { el: HTMLDivElement; y: number }[] = [];
                    const size = w < 768 ? 16 : 30; // Mobile responsiveness

                    const getSvgForType = (type: string) => {
                        if (type === "icon-pine") return `<svg viewBox="-63 65 128 128" fill="${strokeColor}" style="width:100%;height:100%;"><polygon points="30.2,171.4 42.9,171.4 27.9,153 38.4,153 24.5,135.7 34.1,135.7 20.4,118.2 29.6,118.2 16.6,100.9 25.1,100.9 1,67.1 -23.1,100.9 -14.6,100.9 -27.6,118.2 -18.4,118.2 -32.1,135.7 -22.5,135.7 -36.4,153 -25.9,153 -40.9,171.4 -28.2,171.4 -11,171.5 -10.4,190.9 11.9,190.9 11.3,171.5 "/></svg>`;
                        if (type === "icon-oak") return `<svg viewBox="0 0 256 256" fill="${strokeColor}" style="width:100%;height:100%;"><path d="M228.5,69.3c0-24.2-19.6-43.8-43.8-43.8c-6.9,0-13.4,1.6-19.2,4.4c-4.2-16.7-20.2-29.2-39.2-29.2 c-18.6,0-34.2,11.8-38.8,27.8c-3.8-1.4-8-2.2-12.3-2.2c-19.5,0-35.4,15.8-35.4,35.4c0,8.2,2.8,15.8,7.5,21.8 c-8.2,8.6-13.2,20.3-13.2,33.1c0,26.6,21.5,48.1,48.1,48.1c2.3,0,4.5-0.2,6.7-0.5l21,24.1c-0.5,23.8-7,65-7,65h32.8l-6.6-36.2 l25.9-42.4c3.8,0.8,7.8,1.2,11.9,1.2c32.4,0,58.7-26.3,58.7-58.7c0-8.3-1.7-16.1-4.8-23.3C225.7,87,228.5,78.4,228.5,69.3z M110.1,176l-10.3-13.5c3.6-0.8,7.1-2.2,10.2-3.8c0.1,0,0.4,0,0.5,0C110.4,162.2,110.3,170.2,110.1,176z M128.7,200 c-0.2-9.3-0.5-32.5-0.7-38.7c0.2,0.1,0.4,0.2,0.5,0.3c4.6,4,9.9,7.4,15.7,9.8L128.7,200z"/></svg>`;
                        if (type === "icon-cabin") return `<svg viewBox="0 0 512 512" fill="${strokeColor}" style="width:100%;height:100%;"><path d="M510.911,347.243l-56.306-97.82h13.821c2.917,0,5.612-1.556,7.073-4.081c1.46-2.525,1.463-5.637,0.008-8.166 l-56.306-97.82h13.821c2.917,0,5.612-1.556,7.073-4.081c1.46-2.525,1.463-5.637,0.008-8.166L369.294,4.094 C367.836,1.561,365.136,0,362.213,0s-5.623,1.561-7.081,4.094l-70.808,123.015c-1.455,2.528-1.452,5.641,0.008,8.166 c1.461,2.526,4.156,4.081,7.073,4.081h13.821l-5.012,8.707c-2.251,3.911-0.906,8.906,3.004,11.157 c3.91,2.25,8.906,0.905,11.157-3.004l12.061-20.954c1.455-2.528,1.452-5.641-0.008-8.166c-1.46-2.525-4.156-4.081-7.073-4.081 h-13.821l56.678-98.467l56.678,98.467H405.07c-2.917,0-5.612,1.556-7.073,4.081c-1.46,2.525-1.463,5.637-0.008,8.166 l56.306,97.821h-13.821c-2.917,0-5.612,1.556-7.073,4.081c-1.46,2.525-1.463,5.637-0.008,8.166l56.306,97.819h-94.806 c-4.512,0-8.17,3.658-8.17,8.17s3.658,8.17,8.17,8.17H503.83c2.917,0,5.612-1.556,7.073-4.081 C512.363,352.883,512.366,349.771,510.911,347.243z"/><path d="M503.83,408.511H370.383V273.002l7.84,7.84c1.595,1.595,3.686,2.393,5.777,2.393s4.182-0.797,5.777-2.393 c3.191-3.191,3.191-8.364,0-11.554L201.862,81.373c-3.191-3.191-8.364-3.191-11.554,0l-51.595,51.595v-45.82 c0-4.512-3.658-8.17-8.17-8.17H92.415c-4.512,0-8.17,3.658-8.17,8.17v100.287L2.393,269.287c-3.191,3.191-3.191,8.364,0,11.554 c3.191,3.191,8.364,3.191,11.554,0l7.84-7.839v135.509H8.17c-4.512,0-8.17,3.658-8.17,8.17s3.658,8.17,8.17,8.17h495.66 c4.512,0,8.17-3.658,8.17-8.17S508.342,408.511,503.83,408.511z M100.585,95.319h21.787v53.989l-21.787,21.787V95.319z M98.185,196.604c0.013-0.013,97.9-97.9,97.9-97.9l146.404,146.403H49.683L98.185,196.604z M136.17,408.511H38.128v-16.34h98.043 V408.511z M136.17,375.83H38.128v-16.34h98.043V375.83z M136.17,310.468h-32.681c-4.512,0-8.17,3.658-8.17,8.17 s3.658,8.17,8.17,8.17h32.681v16.34H38.128v-16.34h32.681c4.512,0,8.17-3.658,8.17-8.17s-3.658-8.17-8.17-8.17H38.128v-16.34 h98.043V310.468z M136.17,277.787H38.128v-16.34h98.043V277.787z M239.66,351.308c0,0.022,0,32.681,0,32.681 c0,0.022,0,24.522,0,24.522h-87.149v-89.861c0-0.022,0-32.681,0-32.681c0-0.022,0-24.522,0-24.522h87.149V351.308z M354.043,375.83h-32.681c-4.512,0-8.17,3.658-8.17,8.17s3.658,8.17,8.17,8.17h32.681v16.34H256v-16.34h32.681 c4.512,0,8.17-3.658,8.17-8.17s-3.658-8.17-8.17-8.17H256v-16.34h98.043V375.83z M354.043,343.149H256v-16.34h98.043V343.149z M354.043,310.468H256v-16.34h98.043V310.468z M354.043,277.787H256v-16.34h98.043V277.787z"/><path d="M40.851,441.191c-4.512,0-8.17,3.658-8.17,8.17v10.894c0,4.512,3.658,8.17,8.17,8.17s8.17-3.658,8.17-8.17v-10.894 C49.021,444.85,45.363,441.191,40.851,441.191z"/><path d="M73.532,484.766c-4.512,0-8.17,3.658-8.17,8.17v10.894c0,4.512,3.658,8.17,8.17,8.17s8.17-3.658,8.17-8.17v-10.894 C81.702,488.424,78.044,484.766,73.532,484.766z"/><path d="M106.213,462.979c-4.512,0-8.17,3.658-8.17,8.17v10.894c0,4.512,3.658,8.17,8.17,8.17s8.17-3.658,8.17-8.17v-10.894 C114.383,466.637,110.725,462.979,106.213,462.979z"/><path d="M471.149,441.191c-4.512,0-8.17,3.658-8.17,8.17v10.894c0,4.512,3.658,8.17,8.17,8.17s8.17-3.658,8.17-8.17v-10.894 C479.319,444.85,475.661,441.191,471.149,441.191z"/><path d="M318.638,484.766c-4.512,0-8.17,3.658-8.17,8.17v10.894c0,4.512,3.658,8.17,8.17,8.17s8.17-3.658,8.17-8.17v-10.894 C326.809,488.424,323.15,484.766,318.638,484.766z"/><path d="M351.319,462.979c-4.512,0-8.17,3.658-8.17,8.17v10.894c0,4.512,3.658,8.17,8.17,8.17s8.17-3.658,8.17-8.17v-10.894 C359.489,466.637,355.831,462.979,351.319,462.979z"/><path d="M198.809,462.979c-4.512,0-8.17,3.658-8.17,8.17v10.894c0,4.512,3.658,8.17,8.17,8.17s8.17-3.658,8.17-8.17v-10.894 C206.979,466.637,203.321,462.979,198.809,462.979z"/></svg>`;
                        return '';
                    };

                    icons.forEach(ic => {
                        const iconDiv = document.createElement("div");
                        // Absolute positioning using PERCENTAGES avoids all resizing bugs
                        iconDiv.style.cssText = `
                            position: absolute;
                            left: ${((ic.x - size / 2) / w) * 100}%;
                            top: ${((ic.y - size / 2) / h) * 100}%;
                            width: ${size}px;
                            height: ${size}px;
                            opacity: 0;
                            pointer-events: none;
                            filter: drop-shadow(0px 0px 5px ${strokeColor});
                        `;
                        iconDiv.innerHTML = getSvgForType(ic.type);

                        container.append(iconDiv);
                        iconEls.push({ el: iconDiv, y: ic.y });
                    });

                    container.append(svg); // Make sure the line SVG stays underneath the icons

                    // Inject as first child of the background-bearing element
                    target.prepend(container);
                    injected.push(container);

                    // ── Animate with ScrollTrigger ──
                    const len = path.getTotalLength();
                    path.style.strokeDasharray = `${len}`;
                    path.style.strokeDashoffset = `${len}`;

                    const ctx = gsap.context(() => {
                        const tl = gsap.timeline({
                            scrollTrigger: {
                                trigger: target,
                                start: "top 75%",
                                end: "bottom 75%",
                                scrub: true,
                                invalidateOnRefresh: true,
                            }
                        });

                        // 1. Animate the line drawing across the section (from 0 to 1 of timeline)
                        tl.to(path, { strokeDashoffset: 0, ease: "none", duration: 1 }, 0);

                        // 2. Animate icons popping in exactly when the line passes their Y coordinate
                        iconEls.forEach(ic => {
                            const progress = ic.y / h; // relative position [0, 1]

                            tl.to(ic.el, {
                                opacity: 0.8,    // slightly transparent for elegance
                                ease: "power2.out", // smooth static fade in
                                duration: 0.1    // quick but smooth
                            }, progress);
                        });
                    });
                    contexts.push(ctx);

                    // Track state for next section
                    curX = exitX;
                    goLeft = cfg.amplitudes.length % 2 === 0 ? goLeft : !goLeft;
                });
            }

            const vw = window.innerWidth;

            // Segment A: starts from right side of strip1
            processSegment(SEGMENT_A, vw * 0.68, true);

            // Segment B: starts from center after stacking cards gap
            processSegment(SEGMENT_B, vw * 0.50, false);
        }, 2000);

        return () => {
            clearTimeout(timer);
            // Clean up all injected SVGs
            document.querySelectorAll("[data-snake-line]").forEach((el) => el.remove());
        };
    }, []);

    // Renders nothing visible — SVGs are injected imperatively into each section
    return <div ref={ref} style={{ display: "none" }} aria-hidden="true" />;
}
