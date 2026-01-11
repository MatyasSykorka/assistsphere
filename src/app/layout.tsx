import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import Providers from "./providers";

import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { DEFAULT_THEME_PRESET, isThemePreset, type ThemePreset } from "@/theme";

// Custom components
import NavDrawer from "./components/navigationBar/NavDrawer";
import Footer from "./components/footer/Footer";
import { Container } from "@mui/material";

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

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    let initialPreset: ThemePreset | undefined;

    if (session?.user?.id) {
        try {
            const user = await prisma.user.findUnique({
                where: { id: session.user.id },
                select: { theme_preference: true },
            });

            if (isThemePreset(user?.theme_preference)) {
                initialPreset = user.theme_preference;
            } 
            else {
                initialPreset = DEFAULT_THEME_PRESET;
            }
        } 
        catch {
            // If DB isn't ready/migrated, fall back to default.
            initialPreset = DEFAULT_THEME_PRESET;
        }
    }

    return (
        <html lang="en">
            <body 
                className={`
                    ${geistSans.variable} 
                    ${geistMono.variable}
                `}
                style={{
                    display: "flex",
                    flexDirection: "column",
                    minHeight: "100vh",
                }}
            >
                <Providers 
                    initialPreset={initialPreset}
                >
                    <NavDrawer />
                    <main 
                        style={{ 
                            flex: 1 
                        }}
                    >
                        <Container maxWidth="lg">
                            {children}
                        </Container>
                    </main>
                    <Footer />
                </Providers>
            </body>
        </html>
    );
}
