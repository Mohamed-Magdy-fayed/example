"use client";

import { H2, P } from "@/components/ui/typography";
import { useScrollAnimation } from "@/hooks/use-animation";
import { useTranslation } from "@/features/core/i18n/useTranslation";

export function SkillsIntroSection() {
    const { t } = useTranslation();
    const introAnimation = useScrollAnimation();

    return (
        <section className="py-20">
            <div className="container mx-auto px-4">
                <div
                    ref={introAnimation.elementRef}
                    className={`max-w-4xl mx-auto text-center transition-all duration-1000 ${introAnimation.isVisible
                        ? "opacity-100 translate-y-0"
                        : "opacity-0 translate-y-10"
                        }`}
                >
                    <H2 className="mb-6">{t("skills.intro.title")}</H2>
                    <P className="text-muted-foreground text-lg leading-relaxed">
                        {t("skills.intro.description")}
                    </P>
                </div>
            </div>
        </section>
    );
}
