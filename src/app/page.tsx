import Navbar from "@/components/Navbar";
import ScrollProgress from "@/components/ScrollProgress";
import Hero from "@/components/Hero";
import Experience from "@/components/Experience";
import Skills from "@/components/Skills";
import Hobby from "@/components/Hobby";
import WhatNext from "@/components/WhatNext";
import Projects from "@/components/Projects";
import ResumeCallout from "@/components/ResumeCallout";
import Connect from "@/components/Connect";
import Footer from "@/components/Footer";
import ChatBot from "@/components/ChatBot";

export default function Home() {
  return (
    <div className="relative overflow-x-hidden">
      <div className="pointer-events-none fixed inset-y-0 left-0 right-0 z-[60] mx-auto hidden max-w-7xl px-6 xl:block">
        <div className="absolute inset-y-0 left-6 w-px bg-card-border" />
        <div className="absolute inset-y-0 right-6 w-px bg-card-border" />
      </div>

      <Navbar />
      <ScrollProgress />
        <Hero />
        <Experience />
        <Skills />
        <Hobby />
        <WhatNext />
        <Projects />
        <ResumeCallout />
        <Connect />
      <Footer />
      <ChatBot />
    </div>
  );
}
