import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});


export const metadata: Metadata = {
  title: "Free WiFi Portal",
  description: "Connect to guest WiFi",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={dmSans.variable}>
      <body className={`${dmSans.className} bg-portal-dark text-stone-100`}>
        {children}
      </body>
    </html>
  );
}
