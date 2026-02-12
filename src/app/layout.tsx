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

const SITE_URL = "https://siddhmandirwala.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Siddh Mandirwala | Software Engineer",
  description:
    "Portfolio of Siddh Mandirwala — Software Engineer and MS Computer Science student at NYU. Building full-stack web apps, AI systems, and data platforms with Next.js, React, Python, and Node.js.",
  verification: {
    google: "kima8juAa0rWUSGGVnhSKkDNXIufoAsmqbdoMfrT0eY",
  },
  keywords: [
    "Siddh Mandirwala",
    "Software Engineer",
    "Portfolio",
    "NYU",
    "Next.js",
    "React",
    "Full Stack Developer",
    "AI",
    "Machine Learning",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Siddh Mandirwala | Software Engineer",
    description:
      "Portfolio of Siddh Mandirwala — Software Engineer and MS Computer Science student at NYU. Building full-stack web apps, AI systems, and data platforms.",
    url: SITE_URL,
    siteName: "Siddh Mandirwala",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/Siddh Photo.jpg",
        width: 800,
        height: 800,
        alt: "Siddh Mandirwala — Software Engineer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Siddh Mandirwala | Software Engineer",
    description:
      "Portfolio of Siddh Mandirwala — Software Engineer and MS CS @ NYU.",
    images: ["/Siddh Photo.jpg"],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Siddh Mandirwala",
  url: SITE_URL,
  image: `${SITE_URL}/Siddh Photo.jpg`,
  jobTitle: "Software Engineer",
  alumniOf: {
    "@type": "CollegeOrUniversity",
    name: "New York University",
  },
  sameAs: [
    "https://www.linkedin.com/in/siddh-mandirwala",
    "https://github.com/sidmandirwala",
  ],
  email: "mailto:sidmandirwala9@gmail.com",
  knowsAbout: [
    "Full-Stack Development",
    "Next.js",
    "React",
    "Node.js",
    "Python",
    "Machine Learning",
    "AI Systems",
    "Data Science",
    "Big Data",
    "Algorithms"
  ],
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
