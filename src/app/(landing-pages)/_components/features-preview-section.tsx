"use client";

import { ArrowRight, ExternalLink, PlayCircleIcon, Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { H2, H3, P } from "@/components/ui/typography";
import { useTranslation } from "@/features/core/i18n/useTranslation";

export function FeaturePreviewSection() {
  const { t } = useTranslation();

  const skillKeys = [
    "productStrategy",
    "experienceDesign",
    "frontendEngineering",
    "backendAndInfra",
    "opsEnablement",
    "tooling",
  ] as const;

  const SKILL_SECTIONS = {
    productStrategy: {
      label: t("featuresPreview.featuredFeatures.productStrategy.name"),
      description: t(
        "featuresPreview.featuredFeatures.productStrategy.description",
      ),
      image: "/skills/product-strategy.svg",
    },
    experienceDesign: {
      label: t("featuresPreview.featuredFeatures.experienceDesign.name"),
      description: t(
        "featuresPreview.featuredFeatures.experienceDesign.description",
      ),
      image: "/skills/experience-design.svg",
    },
    frontendEngineering: {
      label: t("featuresPreview.featuredFeatures.frontendEngineering.name"),
      description: t(
        "featuresPreview.featuredFeatures.frontendEngineering.description",
      ),
      image: "/skills/frontend-engineering.svg",
    },
    backendAndInfra: {
      label: t("featuresPreview.featuredFeatures.backendAndInfra.name"),
      description: t(
        "featuresPreview.featuredFeatures.backendAndInfra.description",
      ),
      image: "/skills/backend-infrastructure.svg",
    },
    opsEnablement: {
      label: t("featuresPreview.featuredFeatures.opsEnablement.name"),
      description: t(
        "featuresPreview.featuredFeatures.opsEnablement.description",
      ),
      image: "/skills/ops-enablement.svg",
    },
    tooling: {
      label: t("featuresPreview.featuredFeatures.tooling.name"),
      description: t(
        "featuresPreview.featuredFeatures.tooling.description",
      ),
      image: "/skills/tooling-automation.svg",
    },
  } as const;

  const featuredFeatures = skillKeys.map((key, index) => ({
    id: key,
    name: SKILL_SECTIONS[key].label,
    description: SKILL_SECTIONS[key].description,
    category: key,
    isPremium: index === 0 || index === 1,
    demoUrl: `/skills#${key}`,
  }));

  const categories = Object.entries(SKILL_SECTIONS);

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <H2 className="text-primary mb-4">
            {t("featuresPreview.header.title")}
          </H2>
          <P className="text-lg text-muted-foreground">
            {t("featuresPreview.header.description")}
          </P>
        </div>

        {/* Categories grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-12">
          {categories.map(([key, category]) => (
            <Link
              key={key}
              href="/skills"
              className="group bg-muted/50 hover:bg-muted rounded-lg p-4 text-center transition-all duration-200 hover:scale-105"
            >
              <div className="mb-2">
                <Image
                  src={category.image}
                  alt={`${category.label} icon`}
                  width={64}
                  height={64}
                  className="w-12 h-12 object-contain mx-auto"
                />
              </div>
              <P className="text-sm font-medium mt-0 group-hover:text-primary transition-colors">
                {category.label}
              </P>
            </Link>
          ))}
        </div>

        {/* Featured templates */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {featuredFeatures.map((template) => (
            <div
              key={template.id}
              className="group flex flex-col bg-background rounded-xl overflow-hidden shadow-sm border border-border/50 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              {/* Feature image */}
              <div className="relative aspect-[4/3] bg-muted overflow-hidden">
                {/* Placeholder for template screenshot */}
                <div className="w-full h-full bg-gradient-to-br from-primary/5 via-background to-background flex items-center justify-center p-8">
                  <Image
                    src={SKILL_SECTIONS[template.category as keyof typeof SKILL_SECTIONS]?.image}
                    alt={`${template.name} illustration`}
                    width={320}
                    height={240}
                    className="w-full max-h-full object-contain"
                  />
                </div>

                {/* Premium badge */}
                {template.isPremium && (
                  <div className="absolute top-3 right-3 bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full font-medium">
                    {t("featuresPreview.premiumBadge")}
                  </div>
                )}

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <div className="grid place-content-center">
                    <Button size="sm" variant="secondary" asChild>
                      <Link href={template.demoUrl}>
                        <ExternalLink className="h-4 w-4 mr-1" />
                        {t("featuresPreview.demoButton")}
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>

              {/* Feature info */}
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <H3 className="text-base border-none pb-0">
                    {template.name}
                  </H3>
                  <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                    {
                      SKILL_SECTIONS[template.category as keyof typeof SKILL_SECTIONS]
                        ?.label
                    }
                  </span>
                </div>
                <P className="text-sm text-muted-foreground mt-0">
                  {template.description}
                </P>
                <div className="flex items-center justify-between mt-3">
                  <span className="text-sm font-medium text-primary">
                    {template.isPremium
                      ? t("featuresPreview.premiumText")
                      : t("featuresPreview.freeText")}
                  </span>
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={template.demoUrl}>
                      {t("featuresPreview.viewDetailsButton")}
                      <ArrowRight className="h-3 w-3 ml-1" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center bg-gradient-to-r from-primary/5 to-primary/10 rounded-2xl p-8 border border-primary/20">
          <H3 className="text-2xl mb-4 border-none pb-0">
            {t("featuresPreview.cta.title")}
          </H3>
          <P className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            {t("featuresPreview.cta.description")}
          </P>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button asChild size="lg" className="text-lg px-8">
              <Link href="/skills">
                <Sparkles className="mr-2 h-5 w-5" />
                {t("featuresPreview.cta.startTrialButton")}
              </Link>
            </Button>

            <Button
              asChild
              variant="outline"
              size="lg"
              className="text-lg px-8"
            >
              <Link href="/contact">
                <PlayCircleIcon className="mr-2 h-5 w-5" />
                {t("featuresPreview.cta.watchDemoButton")}
              </Link>
            </Button>
          </div>

          <P className="text-sm text-muted-foreground mt-4">
            {t("featuresPreview.cta.trialNote")}
          </P>
        </div>
      </div>
    </section>
  );
}
