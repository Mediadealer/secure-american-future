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
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.clickmagick_cmc = {
                uid: '17544',
                hid: '1516531696',
                cmc_project: 'secure-american-future',
                vid_info: 'on',
                utm_source: 'organic',
              };
            `,
          }}
        />
        <script src="//cdn.clkmc.com/cmc.js" async />
      </head>
      <body className={`${inter.variable} ${playfair.variable} font-sans antialiased bg-background text-foreground`}>
        {children}
        <Toaster position="bottom-right" theme="light" />
        {/* TODO: Add tracking pixel (e.g. Omega Pixel or other) */}
      </body>
    </html>
  );
}
