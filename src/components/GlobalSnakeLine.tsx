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

/* ─── Path generator with varied amplitudes ─── */
function generatePath(
    entryX: number,
    width: number,
    height: number,
    amps: number[],
    startLeft: boolean
): { d: string; exitX: number } {
    const n = amps.length;
    const segH = height / n;
    const lo = width * 0.08;
    const hi = width * 0.92;
    const clamp = (v: number) => Math.max(lo, Math.min(hi, v));

    let x = entryX;
    let y = 0;
    let d = `M ${r(x)},${r(y)}`;
    let goLeft = startLeft;

    for (let i = 0; i < n; i++) {
        const sweep = width * amps[i];
        const midY = y + segH * 0.5;
        const nextY = y + segH;

        // Peak position (leftmost or rightmost point of this curve)
        const peakX = clamp(goLeft ? x - sweep : x + sweep);

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

    return { d, exitX: x };
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

                    // Generate the serpentine path
                    const { d, exitX } = generatePath(
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
                    svg.style.cssText = "width:100%;height:100%;display:block;";

                    // Glow filter
                    const defs = document.createElementNS(NS, "defs");
                    const filter = document.createElementNS(NS, "filter");
                    filter.id = `snk-${cfg.id}`;
                    filter.setAttribute("x", "-15%");
                    filter.setAttribute("y", "-5%");
                    filter.setAttribute("width", "130%");
                    filter.setAttribute("height", "110%");
                    const blur = document.createElementNS(NS, "feGaussianBlur");
                    blur.setAttribute("in", "SourceGraphic");
                    blur.setAttribute("stdDeviation", "2.5");
                    blur.setAttribute("result", "b");
                    const merge = document.createElementNS(NS, "feMerge");
                    const mn1 = document.createElementNS(NS, "feMergeNode");
                    mn1.setAttribute("in", "b");
                    const mn2 = document.createElementNS(NS, "feMergeNode");
                    mn2.setAttribute("in", "SourceGraphic");
                    merge.append(mn1, mn2);
                    filter.append(blur, merge);
                    defs.append(filter);
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
                    container.append(svg);

                    // Inject as first child of the background-bearing element
                    target.prepend(container);
                    injected.push(container);

                    // ── Animate with ScrollTrigger ──
                    const len = path.getTotalLength();
                    path.style.strokeDasharray = `${len}`;
                    path.style.strokeDashoffset = `${len}`;

                    const ctx = gsap.context(() => {
                        gsap.to(path, {
                            strokeDashoffset: 0,
                            ease: "none",
                            scrollTrigger: {
                                trigger: target,
                                // "75% scroll plane": the tip of the drawing stays
                                // at approximately the 75% mark of the viewport
                                start: "top 75%",
                                end: "bottom 75%",
                                scrub: true,
                                invalidateOnRefresh: true,
                            },
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
