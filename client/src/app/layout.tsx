import type { Metadata } from "next";
import "./globals.css";
import { cn } from "@/lib/utils";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Providers from "@/components/Providers";
import FramerBg from "@/components/FramerBg";

export const metadata: Metadata = {
  title: "JKSoC — Summer Of Code",
  description: "JKSoC platform for contributors across India",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={cn(
        "h-full antialiased",
        "font-sans",
        "dark"
      )}
    >
      <body className="min-h-full">
        <FramerBg />
        <Providers>
          <Navbar />
          <main className="flex justify-center font-sans w-full min-h-[80vh] px-6 py-12 min-w-0">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
