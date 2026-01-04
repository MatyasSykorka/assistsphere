import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

// Custom components
import NavDrawer from "./components/navigationBar/NavDrawer";
import Footer from "./components/footer/Footer";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "AssistSphere",
    description: "Created by Matyáš Sýkora",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body 
                className={`
                    ${geistSans.variable} 
                    ${geistMono.variable}
                `}
            >
                <NavDrawer />
                    {children}
                <Footer />
            </body>
        </html>
    );
}
