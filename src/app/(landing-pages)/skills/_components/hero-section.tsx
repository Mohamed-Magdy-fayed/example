"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { H1, Lead } from "@/components/ui/typography";
import { useScrollAnimation } from "@/hooks/use-animation";
import { useTranslation } from "@/features/core/i18n/useTranslation";

export function SkillsHeroSection() {
    const { t } = useTranslation();
    const heroAnimation = useScrollAnimation();

    return (
        <section className="py-20 bg-gradient-to-br from-slate-50 to-white dark:from-stone-900 dark:to-stone-800">
            <div
                ref={heroAnimation.elementRef}
                className={`container mx-auto px-4 text-center transition-all duration-1000 ${heroAnimation.isVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-10"
                    }`}
            >
                <H1 className="mb-6 max-w-4xl mx-auto">
                    {t("skills.hero.title")}
                </H1>
                <Lead className="mb-10 max-w-3xl mx-auto text-muted-foreground">
                    {t("skills.hero.description")}
                </Lead>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button size="lg" asChild className="hover:scale-105 transition-transform duration-300">
                        <Link href="/contact">{t("skills.hero.primaryButton")}</Link>
                    </Button>
                    <Button
                        size="lg"
                        variant="outline"
                        asChild
                        className="hover:scale-105 transition-transform duration-300"
                    >
                        <Link href="/projects">{t("skills.hero.secondaryButton")}</Link>
                    </Button>
                </div>
            </div>
        </section>
    );
}
