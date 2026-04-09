"use client";

import { ArrowRight, CheckCircle, Star } from "lucide-react";
import { useMemo } from "react";
import { LinkButton } from "@/components/general/link-button";
import { H1, Lead, P } from "@/components/ui/typography";
import { useTranslation } from "@/features/core/i18n/useTranslation";

export function HeroSection() {
    const { t, locale } = useTranslation();

    const trustIndicators = useMemo(
        () => [
            t("hero.trustIndicators.activeAcademies"),
            t("hero.trustIndicators.clientSatisfaction"),
            t("hero.trustIndicators.support"),
        ],
        [locale],
    );

    const benefits = useMemo(
        () => [
            t("hero.benefits.benefit1"),
            t("hero.benefits.benefit2"),
            t("hero.benefits.benefit3"),
            t("hero.benefits.benefit4"),
        ],
        [locale],
    );

    return (
        <section className="relative overflow-hidden bg-gradient-to-br from-background to-orange-50 px-4 py-12 sm:px-8 sm:py-20 dark:to-neutral-950">
            {/* Background decoration */}

            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid items-center gap-12 lg:grid-cols-2">
                    {/* Left column - Content */}
                    <div className="space-y-8">
                        {/* Trust indicators */}
                        <div className="flex flex-wrap gap-4 text-muted-foreground text-sm">
                            {trustIndicators.map((indicator, index) => (
                                <div className="flex items-center gap-2" key={index}>
                                    <Star className="h-4 w-4 fill-primary text-primary" />
                                    <span>{indicator}</span>
                                </div>
                            ))}
                        </div>

                        {/* Main headline */}
                        <div className="space-y-4">
                            <H1 className="text-primary">
                                <span className="whitespace-nowrap">
                                    {t("hero.mainHeadline.part1")}
                                </span>
                                <span className="block">{t("hero.mainHeadline.part2")}</span>
                            </H1>
                            <Lead className="max-w-xl text-foreground/80">
                                {t("hero.leadText")}
                            </Lead>
                        </div>

                        {/* Benefits list */}
                        <div className="space-y-2">
                            {benefits.map((benefit, index) => (
                                <div className="flex items-start gap-2" key={index}>
                                    <CheckCircle className="h-5 w-5 flex-shrink-0 text-primary" />
                                    <P className="text-foreground/80">{benefit}</P>
                                </div>
                            ))}
                        </div>

                        {/* CTA buttons */}
                        <div className="flex flex-col gap-4 pt-4 sm:flex-row">
                            <LinkButton className="px-8 text-lg" href="/contact" size="lg">
                                {t("hero.cta.contact")}
                                <ArrowRight className="ml-2 h-5 w-5 rtl:-scale-x-100" />
                            </LinkButton>
                            <LinkButton
                                className="px-8 text-lg"
                                href="/projects"
                                size="lg"
                                variant="outline"
                            >
                                {t("hero.cta.projects")}
                            </LinkButton>
                        </div>

                        {/* Social proof */}
                        <div className="border-border/50 border-t pt-8">
                            <P className="mb-4 text-muted-foreground text-sm">
                                {t("hero.socialProof")}
                            </P>
                            <div className="flex items-center gap-6 opacity-60">
                                {/* Placeholder for client logos */}
                                <div className="h-8 w-20 rounded bg-muted" />
                                <div className="h-8 w-20 rounded bg-muted" />
                                <div className="h-8 w-20 rounded bg-muted" />
                                <div className="h-8 w-20 rounded bg-muted" />
                            </div>
                        </div>
                    </div>

                    {/* Right column - Visual */}
                    <div className="relative">
                        {/* Hero image placeholder */}
                        <div className="relative rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 p-8 shadow-2xl">
                            <div className="aspect-[4/3] rounded-lg border border-border/50 bg-background p-6 shadow-lg">
                                {/* Mock website preview */}
                                <div className="space-y-4">
                                    <div className="flex items-center gap-2">
                                        <div className="h-3 w-3 rounded-full bg-red-400" />
                                        <div className="h-3 w-3 rounded-full bg-yellow-400" />
                                        <div className="h-3 w-3 rounded-full bg-green-400" />
                                    </div>
                                    <div className="space-y-3">
                                        <div className="h-4 w-3/4 rounded bg-primary/20" />
                                        <div className="h-3 w-full rounded bg-muted" />
                                        <div className="h-3 w-5/6 rounded bg-muted" />
                                        <div className="mt-4 h-8 w-1/3 rounded bg-primary" />
                                    </div>
                                    <div className="mt-6 grid grid-cols-3 gap-2">
                                        <div className="h-16 rounded bg-muted" />
                                        <div className="h-16 rounded bg-muted" />
                                        <div className="h-16 rounded bg-muted" />
                                    </div>
                                </div>
                            </div>

                            {/* Floating elements */}
                            <div className="absolute -top-4 -right-4 rounded-full bg-primary p-3 text-primary-foreground shadow-lg">
                                <CheckCircle className="h-6 w-6" />
                            </div>
                            <div className="absolute -bottom-4 -left-4 rounded-lg border border-border bg-background p-3 shadow-lg">
                                <div className="flex items-center gap-2">
                                    <div className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
                                    <span className="font-medium text-xs">
                                        {t("hero.liveIndicator")}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
