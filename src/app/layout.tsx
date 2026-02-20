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

const SITE_URL = "https://siddhmandirwala.dev";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Siddh Mandirwala | Software Engineer | NYU MS Computer Science",
  description:
    "Siddh Mandirwala - Software Engineer and MS Computer Science student at New York University (NYU). Full-stack developer specializing in Next.js, React, Python, AI/ML systems, and data platforms. Previously at AI4Purpose, KeyToZ, and Bharat Tech Labs.",
  verification: {
    google: "CpewiN0wZmLyVq1-sUfDBZ-eClBBSKJQufySXMj3Zos",
    // Add your Bing verification code here after setting up Bing Webmaster Tools
    other: {
      "msvalidate.01": "33CE266B4B78E72FF3933E11EA7497CC",
    },
  },
  keywords: [
    // Name variations
    "Siddh Mandirwala",
    "Siddh",
    "Mandirwala",
    // Education & Location
    "Siddh Mandirwala NYU",
    "Siddh NYU",
    "NYU Software Engineer",
    "NYU Computer Science",
    "New York University student",
    "MS Computer Science NYU",
    // Job Titles
    "Software Engineer",
    "Full Stack Developer",
    "Software Development Engineer",
    "Frontend Developer",
    "Backend Developer",
    // Skills & Technologies
    "Next.js Developer",
    "React Developer",
    "Python Developer",
    "TypeScript Developer",
    "Node.js Developer",
    "AI Engineer",
    "Machine Learning Engineer",
    "Data Engineer",
    // Experience
    "AI4Purpose",
    "KeyToZ",
    "Bharat Tech Labs",
    // General
    "Software Engineer Portfolio",
    "Web Developer Portfolio",
    "Tech Portfolio",
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
