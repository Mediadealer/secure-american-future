import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "700", "900"],
});

export const metadata: Metadata = {
  title: "Secure American Future — Special Report",
  description: "An exclusive financial report on a new retirement income stream available to qualifying Americans.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* TODO: Add ClickMagick tracking scripts */}
        {/*
        <Script
          id="clickmagick-config"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.clickmagick_cmc = {
                uid: 'YOUR_UID_HERE',
                hid: 'YOUR_HID_HERE',
                cmc_project: 'secure american future',
                vid_info: 'on',
                utm_source: 'organic',
              };
            `,
          }}
        />
        <Script
          src="//cdn.clkmc.com/cmc.js"
          strategy="beforeInteractive"
        />
        */}
      </head>
      <body className={`${inter.variable} ${playfair.variable} font-sans antialiased bg-background text-foreground`}>
        {children}
        <Toaster position="bottom-right" theme="light" />
        {/* TODO: Add tracking pixel (e.g. Omega Pixel or other) */}
      </body>
    </html>
  );
}
