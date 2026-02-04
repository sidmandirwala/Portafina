import type { Metadata } from "next";
import { Familjen_Grotesk, Inter } from "next/font/google";
import ThemeProvider from "@/components/ThemeProvider";
import "./globals.css";

const familjenGrotesk = Familjen_Grotesk({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
});

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: "Portfolio | Siddh Mandirwala",
  description:
    "Portfolio of Siddh Mandirwala — Software Engineer, MS Computer Science @ NYU. Building modern web experiences with Next.js, React, and Node.js.",
  keywords: [
    "Siddh Mandirwala",
    "Software Engineer",
    "Portfolio",
    "NYU",
    "Next.js",
    "React",
  ],
  openGraph: {
    title: "Siddh Mandirwala | Software Engineer",
    description:
      "Portfolio of Siddh Mandirwala — Software Engineer, MS Computer Science @ NYU.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={`${familjenGrotesk.variable} ${inter.variable} antialiased`}
      >
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
