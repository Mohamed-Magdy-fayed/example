"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { H2, P } from "@/components/ui/typography";
import { useScrollAnimation } from "@/hooks/use-animation";
import { useTranslation } from "@/features/core/i18n/useTranslation";

export function AboutCtaSection() {
    const { t } = useTranslation();
    const ctaAnimation = useScrollAnimation();

    return (
        <section className="py-20">
            <div className="container mx-auto px-4 text-center">
                <div
                    ref={ctaAnimation.elementRef}
                    className={`max-w-3xl mx-auto transition-all duration-1000 ${ctaAnimation.isVisible
                        ? "opacity-100 translate-y-0"
                        : "opacity-0 translate-y-10"
                        }`}
                >
                    <H2 className="mb-6">{t("about.cta.title")}</H2>
                    <P className="text-muted-foreground mb-8">{t("about.cta.description")}</P>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button size="lg" asChild className="hover:scale-105 transition-transform duration-300">
                            <Link href="/contact">{t("about.cta.primaryButton")}</Link>
                        </Button>
                        <Button
                            size="lg"
                            variant="outline"
                            asChild
                            className="hover:scale-105 transition-transform duration-300"
                        >
                            <Link href="/projects">{t("about.cta.secondaryButton")}</Link>
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    );
}
