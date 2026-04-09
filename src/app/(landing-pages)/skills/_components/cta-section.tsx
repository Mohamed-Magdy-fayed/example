"use client";

import { LinkButton } from "@/components/general/link-button";
import { H2, P } from "@/components/ui/typography";
import { useTranslation } from "@/features/core/i18n/useTranslation";
import { useScrollAnimation } from "@/hooks/use-animation";

export function SkillsCtaSection() {
    const { t } = useTranslation();
    const ctaAnimation = useScrollAnimation();

    return (
        <section className="py-20">
            <div className="container mx-auto px-4 text-center">
                <div
                    className={`mx-auto max-w-3xl transition-all duration-1000 ${ctaAnimation.isVisible
                            ? "translate-y-0 opacity-100"
                            : "translate-y-10 opacity-0"
                        }`}
                    ref={ctaAnimation.elementRef}
                >
                    <H2 className="mb-6">{t("skills.cta.title")}</H2>
                    <P className="mb-8 text-muted-foreground">
                        {t("skills.cta.description")}
                    </P>
                    <div className="flex flex-col justify-center gap-4 sm:flex-row">
                        <LinkButton
                            className="transition-transform duration-300 hover:scale-105"
                            href="/contact"
                            size="lg"
                        >
                            {t("skills.cta.primaryButton")}
                        </LinkButton>
                        <LinkButton
                            className="transition-transform duration-300 hover:scale-105"
                            href="/projects"
                            size="lg"
                            variant="outline"
                        >
                            {t("skills.cta.secondaryButton")}
                        </LinkButton>
                    </div>
                </div>
            </div>
        </section>
    );
}
