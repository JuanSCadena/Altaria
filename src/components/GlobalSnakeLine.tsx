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
    amplitudes: number[];
}

const SEGMENT_A: SectionConfig[] = [
    { id: "strip1-collage", bg: "dark", amplitudes: [0.15, 0.25] },
    { id: "location-section", bg: "dark", amplitudes: [0.35, 0.10, 0.22, 0.15] },
    { id: "amenities-section", bg: "light", amplitudes: [0.18, 0.30, 0.12] },
    { id: "strip2-collage", bg: "dark", amplitudes: [0.20, 0.15] },
];

const SEGMENT_B: SectionConfig[] = [
    { id: "map-section-wrapper", bg: "dark", amplitudes: [0.22, 0.14, 0.28] },
    { id: "art-grid-wrapper", bg: "dark", amplitudes: [0.16, 0.24] },
];

/* ─── Helpers ─── */
function findBgElement(wrapper: HTMLElement): HTMLElement {
    if (wrapper.tagName === "SECTION") return wrapper;
    const section = wrapper.querySelector("section");
    return section || wrapper;
}

interface IconPoint { type: string; x: number; y: number; }

function r(n: number): string { return n.toFixed(1); }

/* ─── Simplified SVG icon strings (much lighter than the originals) ─── */
function getIconSvg(type: string, color: string): string {
    if (type === "icon-pine") {
        return `<svg viewBox="0 0 24 24" fill="${color}" style="width:100%;height:100%"><path d="M12 2L5 10h3l-4 6h4l-3 4h14l-3-4h4l-4-6h3z"/><rect x="10" y="22" width="4" height="2" rx="1"/></svg>`;
    }
    if (type === "icon-oak") {
        return `<svg viewBox="0 0 24 24" fill="${color}" style="width:100%;height:100%"><ellipse cx="12" cy="8" rx="7" ry="6"/><rect x="11" y="14" width="2" height="8" rx="1"/><ellipse cx="8" cy="22" rx="5" ry="1.5" opacity="0.3"/></svg>`;
    }
    if (type === "icon-cabin") {
        return `<svg viewBox="0 0 24 24" fill="${color}" style="width:100%;height:100%"><path d="M3 21V10l9-7 9 7v11H3z"/><rect x="9" y="14" width="6" height="7" fill="rgba(0,0,0,0.3)"/><path d="M1 10l11-8 11 8" fill="none" stroke="${color}" stroke-width="1.5"/></svg>`;
    }
    return '';
}

/* ─── Path generator ─── */
function generatePath(
    entryX: number,
    width: number,
    height: number,
    amps: number[],
    startLeft: boolean,
    isMobile: boolean
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

    const icons: IconPoint[] = [];
    const iconTypes = ["icon-pine", "icon-oak", "icon-cabin"];

    // Mobile: 6-10 per segment, Desktop: 18-28
    const minIcons = isMobile ? 6 : 18;
    const maxExtra = isMobile ? 5 : 11;

    for (let i = 0; i < n; i++) {
        const sweep = width * amps[i];
        const midY = y + segH * 0.5;
        const nextY = y + segH;
        const peakX = clamp(goLeft ? x - sweep : x + sweep);

        // Only generate icons if screen is wide enough (> 480px)
        if (width > 480) {
            const numIcons = minIcons + Math.floor(Math.random() * maxExtra);
            for (let j = 0; j < numIcons; j++) {
                const type = iconTypes[Math.floor(Math.random() * iconTypes.length)];
                const iconY = y + Math.random() * segH;
                let iconX = width * (0.05 + Math.random() * 0.9);

                const distFromCenter = Math.abs(iconX - width / 2);
                if (distFromCenter < width * 0.18) {
                    iconX += (iconX >= width / 2 ? 1 : -1) * (width * 0.18);
                }
                icons.push({ type, x: clamp(iconX), y: iconY });
            }
        }

        d += ` C ${r(x)},${r(y + segH * 0.3)} ${r(peakX)},${r(midY - segH * 0.06)} ${r(peakX)},${r(midY)}`;
        const returnAmt = sweep * 0.32;
        const endX = clamp(goLeft ? peakX + returnAmt : peakX - returnAmt);
        d += ` C ${r(peakX)},${r(midY + segH * 0.14)} ${r(endX)},${r(nextY - segH * 0.08)} ${r(endX)},${r(nextY)}`;
        x = endX;
        y = nextY;
        goLeft = !goLeft;
    }

    return { d, exitX: x, icons };
}

/* ─── Component ─── */
export default function GlobalSnakeLine() {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const isMobile = window.innerWidth < 768;

        // Use requestIdleCallback if available, else setTimeout
        const scheduleInit = (cb: () => void) => {
            if ('requestIdleCallback' in window) {
                (window as any).requestIdleCallback(cb, { timeout: 3000 });
            } else {
                setTimeout(cb, 1500);
            }
        };

        let cancelled = false;

        scheduleInit(() => {
            if (cancelled) return;

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
                    if (!wrapper) return;

                    const target = findBgElement(wrapper);
                    const w = target.offsetWidth;
                    const h = target.offsetHeight;
                    if (h < 50) return;

                    const cs = window.getComputedStyle(target);
                    if (cs.position === "static") target.style.position = "relative";
                    if (cs.zIndex === "auto") target.style.zIndex = "0";

                    const { d, exitX, icons } = generatePath(
                        curX, w, h, cfg.amplitudes, goLeft, isMobile
                    );

                    // ── Container ──
                    const container = document.createElement("div");
                    container.setAttribute("data-snake-line", "true");
                    container.style.cssText =
                        "position:absolute;inset:0;pointer-events:none;overflow:hidden;z-index:-1;";

                    // ── SVG (line only) ──
                    const NS = "http://www.w3.org/2000/svg";
                    const svg = document.createElementNS(NS, "svg");
                    svg.setAttribute("viewBox", `0 0 ${w} ${h}`);
                    svg.setAttribute("fill", "none");
                    svg.setAttribute("preserveAspectRatio", "none");
                    svg.style.cssText = "width:100%;height:100%;display:block;position:absolute;inset:0;";

                    // Glow filter — DESKTOP ONLY (expensive on mobile GPU)
                    if (!isMobile) {
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
                    }

                    const path = document.createElementNS(NS, "path");
                    path.setAttribute("d", d);
                    const strokeColor =
                        cfg.bg === "dark"
                            ? "rgba(255,247,230,0.22)"
                            : "rgba(90,130,60,0.15)";
                    path.setAttribute("stroke", strokeColor);
                    path.setAttribute("stroke-width", isMobile ? "1.5" : "2");
                    path.setAttribute("stroke-linecap", "round");
                    path.setAttribute("stroke-linejoin", "round");
                    path.setAttribute("vector-effect", "non-scaling-stroke");
                    if (!isMobile) {
                        path.setAttribute("filter", `url(#snk-${cfg.id})`);
                    }
                    svg.append(path);
                    container.append(svg);

                    // ── Icons (independent div elements) ──
                    const iconEls: { el: HTMLDivElement; y: number }[] = [];
                    const size = isMobile ? 14 : 30;

                    icons.forEach(ic => {
                        const iconDiv = document.createElement("div");
                        iconDiv.style.cssText = `
                            position:absolute;
                            left:${((ic.x - size / 2) / w) * 100}%;
                            top:${((ic.y - size / 2) / h) * 100}%;
                            width:${size}px;
                            height:${size}px;
                            opacity:0;
                            pointer-events:none;
                        `;
                        iconDiv.innerHTML = getIconSvg(ic.type, strokeColor);
                        container.append(iconDiv);
                        iconEls.push({ el: iconDiv, y: ic.y });
                    });

                    target.prepend(container);

                    // ── Animate ──
                    const len = path.getTotalLength();
                    path.style.strokeDasharray = `${len}`;
                    path.style.strokeDashoffset = `${len}`;

                    const ctx = gsap.context(() => {
                        const tl = gsap.timeline({
                            scrollTrigger: {
                                trigger: target,
                                start: "top 75%",
                                end: "bottom 75%",
                                scrub: isMobile ? 0.5 : true,
                                invalidateOnRefresh: true,
                            }
                        });

                        tl.to(path, { strokeDashoffset: 0, ease: "none", duration: 1 }, 0);

                        iconEls.forEach(ic => {
                            const progress = ic.y / h;
                            tl.to(ic.el, {
                                opacity: 0.7,
                                ease: "none",
                                duration: 0.08
                            }, progress);
                        });
                    });
                    contexts.push(ctx);

                    curX = exitX;
                    goLeft = cfg.amplitudes.length % 2 === 0 ? goLeft : !goLeft;
                });
            }

            const vw = window.innerWidth;
            processSegment(SEGMENT_A, vw * 0.68, true);
            processSegment(SEGMENT_B, vw * 0.50, false);
        });

        return () => {
            cancelled = true;
            document.querySelectorAll("[data-snake-line]").forEach((el) => el.remove());
        };
    }, []);

    return <div ref={ref} style={{ display: "none" }} aria-hidden="true" />;
}
