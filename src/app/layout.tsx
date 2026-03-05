import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const zalandoFont = localFont({
    src: [
        {
            path: "../../public/zalando_sans/fonts/webfonts/ZalandoSans[wdth,wght,slnt].woff2",
            style: "normal",
        }
    ],
    variable: "--font-zalando",
});

export const metadata: Metadata = {
    title: "Altaria | Editorial Fluidity",
    description: "Avant-garde Living",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={`${zalandoFont.variable} font-sans bg-background-dark text-primary selection:bg-background-dark selection:text-primary overflow-x-hidden min-h-screen antialiased`}>
                {children}
            </body>
        </html>
    );
}
