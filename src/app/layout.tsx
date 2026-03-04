import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SecurePayouts Dashboard",
  description: "Your secure earnings dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
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
                cmc_project: 'secure payouts dashboard',
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
      <body className={`${inter.variable} font-sans antialiased bg-background text-foreground`}>
        {children}
        <Toaster position="bottom-right" theme="dark" />
        {/* TODO: Add tracking pixel (e.g. Omega Pixel or other) */}
      </body>
    </html>
  );
}
