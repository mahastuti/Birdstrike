// src/app/layout.tsx
import "./globals.css";
import { Poppins } from "next/font/google";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import AuthWrapper from "../components/auth";
import type { ReactNode } from "react";
import type { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  title: "Birdstrike Juanda Dashboard",
  description: "Internship Project",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 0.7,
};

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={poppins.className} suppressHydrationWarning>
        <AuthWrapper>
          <Navbar />
          <main suppressHydrationWarning>{children}</main>
          <Footer />
        </AuthWrapper>
      </body>
    </html>
  );
}
