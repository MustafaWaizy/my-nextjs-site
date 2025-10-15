"use client";

import Hero from "../components/Hero";
import Features from "../components/Features";
import CTASection from "../components/CTASection";
import Testimonials from "../components/Testimonials";
import AboutSection from "../components/AboutSection";
import ContactSection from "../components/ContactSection";

import SectionStack from "../components/SectionStack";

export default function HomePage() {
  return (
    <main className="font-poppins overflow-x-hidden">
      <SectionStack dividerVariant="random" autoCycle={true} cycleInterval={8000}>
        <Hero />
        <Features />
        <CTASection />
        <Testimonials />
        <AboutSection />
        <ContactSection />
      </SectionStack>
    </main>
  );
}
