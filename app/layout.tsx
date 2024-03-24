import type { Metadata } from "next";
import { IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/navbar";

const ibmPlexMonoFont = IBM_Plex_Mono({
  weight: ["600", "700"],
  subsets: ["latin"],
  variable: "--font-ibm",
});

const fonts = [ibmPlexMonoFont];

export const metadata: Metadata = {
  title: "r.gallery",
  description: "an app for saving references for various projects",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`max-w-[1024px] m-[auto] ${fonts.map((f) => f.className).join(" ")}`}>
        <Navbar />
        {children}
        <div id="modal"></div>
      </body>
    </html>
  );
}
