"use client";

import {
  ArrowRight,
  ExternalLink,
  PlayCircleIcon,
  Sparkles,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { LinkButton } from "@/components/general/link-button";
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
      description: t("featuresPreview.featuredFeatures.tooling.description"),
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
    <section className="bg-background py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <H2 className="mb-4 text-primary">
            {t("featuresPreview.header.title")}
          </H2>
          <P className="text-lg text-muted-foreground">
            {t("featuresPreview.header.description")}
          </P>
        </div>

        {/* Categories grid */}
        <div className="mb-12 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
          {categories.map(([key, category]) => (
            <Link
              className="group rounded-lg bg-muted/50 p-4 text-center transition-all duration-200 hover:scale-105 hover:bg-muted"
              href="/skills"
              key={key}
            >
              <div className="mb-2">
                <Image
                  alt={`${category.label} icon`}
                  className="mx-auto h-12 w-12 object-contain"
                  height={64}
                  src={category.image}
                  width={64}
                />
              </div>
              <P className="mt-0 font-medium text-sm transition-colors group-hover:text-primary">
                {category.label}
              </P>
            </Link>
          ))}
        </div>

        {/* Featured templates */}
        <div className="mb-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {featuredFeatures.map((template) => (
            <div
              className="group flex flex-col overflow-hidden rounded-xl border border-border/50 bg-background shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
              key={template.id}
            >
              {/* Feature image */}
              <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                {/* Placeholder for template screenshot */}
                <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/5 via-background to-background p-8">
                  <Image
                    alt={`${template.name} illustration`}
                    className="max-h-full w-full object-contain"
                    height={240}
                    src={
                      SKILL_SECTIONS[
                        template.category as keyof typeof SKILL_SECTIONS
                      ]?.image
                    }
                    width={320}
                  />
                </div>

                {/* Premium badge */}
                {template.isPremium && (
                  <div className="absolute top-3 right-3 rounded-full bg-primary px-2 py-1 font-medium text-primary-foreground text-xs">
                    {t("featuresPreview.premiumBadge")}
                  </div>
                )}

                {/* Hover overlay */}
                <div className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <div className="grid place-content-center">
                    <LinkButton
                      href={template.demoUrl}
                      size="sm"
                      variant="secondary"
                    >
                      <ExternalLink className="mr-1 h-4 w-4" />
                      {t("featuresPreview.demoButton")}
                    </LinkButton>
                  </div>
                </div>
              </div>

              {/* Feature info */}
              <div className="p-4">
                <div className="mb-2 flex items-center justify-between">
                  <H3 className="border-none pb-0 text-base">
                    {template.name}
                  </H3>
                  <span className="rounded bg-muted px-2 py-1 text-muted-foreground text-xs">
                    {
                      SKILL_SECTIONS[
                        template.category as keyof typeof SKILL_SECTIONS
                      ]?.label
                    }
                  </span>
                </div>
                <P className="mt-0 text-muted-foreground text-sm">
                  {template.description}
                </P>
                <div className="mt-3 flex items-center justify-between">
                  <span className="font-medium text-primary text-sm">
                    {template.isPremium
                      ? t("featuresPreview.premiumText")
                      : t("featuresPreview.freeText")}
                  </span>
                  <LinkButton href={template.demoUrl} size="sm" variant="ghost">
                    {t("featuresPreview.viewDetailsButton")}
                    <ArrowRight className="ml-1 h-3 w-3" />
                  </LinkButton>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="rounded-2xl border border-primary/20 bg-gradient-to-r from-primary/5 to-primary/10 p-8 text-center">
          <H3 className="mb-4 border-none pb-0 text-2xl">
            {t("featuresPreview.cta.title")}
          </H3>
          <P className="mx-auto mb-6 max-w-2xl text-muted-foreground">
            {t("featuresPreview.cta.description")}
          </P>

          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <LinkButton className="px-8 text-lg" href="/skills" size="lg">
              <Sparkles className="mr-2 h-5 w-5" />
              {t("featuresPreview.cta.startTrialButton")}
            </LinkButton>

            <LinkButton
              className="px-8 text-lg"
              href="/contact"
              size="lg"
              variant="outline"
            >
              <PlayCircleIcon className="mr-2 h-5 w-5" />
              {t("featuresPreview.cta.watchDemoButton")}
            </LinkButton>
          </div>

          <P className="mt-4 text-muted-foreground text-sm">
            {t("featuresPreview.cta.trialNote")}
          </P>
        </div>
      </div>
    </section>
  );
}
