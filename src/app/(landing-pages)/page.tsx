import { Suspense } from "react";
import { FeaturePreviewSection } from "@/app/(landing-pages)/_components/features-preview-section";
import { FinalCtaSection } from "@/app/(landing-pages)/_components/final-cta-section";
import { HeroSection } from "@/app/(landing-pages)/_components/hero-section";
import { ProcessSection } from "@/app/(landing-pages)/_components/process-section";
import { TestimonialsSection } from "@/app/(landing-pages)/_components/testimonials-section";
import { ValuePropositionSection } from "@/app/(landing-pages)/_components/value-proposition-section";
import BackgroundLights from "@/app/(landing-pages)/_shared/background-lights";

export default async function Home() {
  return (
    <Suspense>
      <BackgroundLights />
      <HeroSection />
      <ValuePropositionSection />
      <FeaturePreviewSection />
      <ProcessSection />
      <TestimonialsSection />
      <FinalCtaSection />
    </Suspense>
  );
}
