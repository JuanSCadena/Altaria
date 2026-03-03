import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: "#FFF7E6",
                background: {
                    light: "#FFF7E6",
                    dark: "#0B2519",
                }
            },
            fontFamily: {
                sans: ["var(--font-zalando)", "sans-serif"],
            },
            animation: {
                'slow-zoom': 'slow-zoom 20s ease-in-out infinite alternate',
            },
            keyframes: {
                'slow-zoom': {
                    '0%': { transform: 'scale(1)' },
                    '100%': { transform: 'scale(1.1)' },
                }
            }
        },
    },
    plugins: [],
};
export default config;
