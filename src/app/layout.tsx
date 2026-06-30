import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import SiteHeader from "@/components/shared/site-header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Apartment Homesteading Calculators",
  description:
    "Interactive calculators for apartment homesteaders. Turn your micro-harvest into custom preserving recipes, or plan bulk buys that actually fit in your kitchen.",
  keywords: [
    "apartment homesteading",
    "preserving calculator",
    "bulk buy planner",
    "small batch canning",
    "balcony garden",
    "mason jar recipes",
    "food storage",
  ],
  icons: {
    icon: "/logo.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <SiteHeader />
        {children}
        <footer className="mt-auto border-t border-[#d6d3c8] bg-white/60 backdrop-blur-sm">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 py-4 text-center text-xs text-[#6b6559]">
            <p>
              Built for apartment homesteaders. Recipes use scientifically-tested ratios.
              Always follow food safety guidelines. When in doubt, throw it out.
            </p>
          </div>
        </footer>
        <Toaster />
      </body>
    </html>
  );
}
