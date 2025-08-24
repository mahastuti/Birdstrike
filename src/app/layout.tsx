// src/app/layout.tsx
import "./globals.css";
import { Poppins } from "next/font/google";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import AuthWrapper from "../components/auth";
import type { ReactNode } from "react";

export const metadata = {
  title: "Birdstrike Juanda Dashboard",
  description: "Internship Project",
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
          <main>{children}</main>
          <Footer />
        </AuthWrapper>
      </body>
    </html>
  );
}
