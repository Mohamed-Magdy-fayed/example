"use client";

import { LinkButton } from "@/components/general/link-button";
import { H1, Lead } from "@/components/ui/typography";
import { useTranslation } from "@/features/core/i18n/useTranslation";
import { useScrollAnimation } from "@/hooks/use-animation";

export function SkillsHeroSection() {
    const { t } = useTranslation();
    const heroAnimation = useScrollAnimation();

    return (
        <section className="bg-gradient-to-br from-slate-50 to-white py-20 dark:from-stone-900 dark:to-stone-800">
            <div
                className={`container mx-auto px-4 text-center transition-all duration-1000 ${heroAnimation.isVisible
                        ? "translate-y-0 opacity-100"
                        : "translate-y-10 opacity-0"
                    }`}
                ref={heroAnimation.elementRef}
            >
                <H1 className="mx-auto mb-6 max-w-4xl">{t("skills.hero.title")}</H1>
                <Lead className="mx-auto mb-10 max-w-3xl text-muted-foreground">
                    {t("skills.hero.description")}
                </Lead>
                <div className="flex flex-col justify-center gap-4 sm:flex-row">
                    <LinkButton
                        className="transition-transform duration-300 hover:scale-105"
                        href="/contact"
                        size="lg"
                    >
                        {t("skills.hero.primaryButton")}
                    </LinkButton>
                    <LinkButton
                        className="transition-transform duration-300 hover:scale-105"
                        href="/projects"
                        size="lg"
                        variant="outline"
                    >
                        {t("skills.hero.secondaryButton")}
                    </LinkButton>
                </div>
            </div>
        </section>
    );
}
