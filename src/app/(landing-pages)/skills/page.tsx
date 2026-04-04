"use client";

import { SkillsCategoriesSection } from "./_components/categories-section";
import { SkillsCtaSection } from "./_components/cta-section";
import { SkillsHeroSection } from "./_components/hero-section";
import { SkillsIntroSection } from "./_components/intro-section";
import { SkillsTimelineSection } from "./_components/timeline-section";
import { SkillsToolsetSection } from "./_components/toolset-section";

export default function SkillsPage() {
    return (
        <div className="min-h-screen">
            <SkillsHeroSection />
            <SkillsIntroSection />
            <SkillsCategoriesSection />
            <SkillsToolsetSection />
            <SkillsTimelineSection />
            <SkillsCtaSection />
        </div>
    );
}
