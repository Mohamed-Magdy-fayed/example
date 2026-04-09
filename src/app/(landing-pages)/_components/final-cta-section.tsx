"use client";

import { ArrowRight, Clock, Mail, MessageCircle, Phone } from "lucide-react";
import { AnchorButton, LinkButton } from "@/components/general/link-button";
import { H2, H3, P } from "@/components/ui/typography";
import { useTranslation } from "@/features/core/i18n/useTranslation";

export function FinalCtaSection() {
  const { t } = useTranslation();

  const contactMethods = [
    {
      icon: Phone,
      title: t("finalCta.contactMethods.callUs.title"),
      description: t("finalCta.contactMethods.callUs.description"),
      action: t("finalCta.contactMethods.callUs.action"),
      href: "tel:+20112386221",
      value: "20112386221",
    },
    {
      icon: Mail,
      title: t("finalCta.contactMethods.emailUs.title"),
      description: t("finalCta.contactMethods.emailUs.description"),
      action: t("finalCta.contactMethods.emailUs.action"),
      href: "mailto:info@gateling.com",
      value: "info@gateling.com",
    },
    {
      icon: MessageCircle,
      title: t("finalCta.contactMethods.liveChat.title"),
      description: t("finalCta.contactMethods.liveChat.description"),
      action: t("finalCta.contactMethods.liveChat.action"),
      href: "https://wa.me/20112386221",
      value: t("finalCta.contactMethods.liveChat.value"),
      external: true,
    },
  ];

  const urgencyFactors = [
    t("finalCta.urgencyFactors.freeConsultation"),
    t("finalCta.urgencyFactors.priorityBooking"),
    t("finalCta.urgencyFactors.specialPricing"),
    t("finalCta.urgencyFactors.moneyBackGuarantee"),
  ];

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-primary/10 py-20">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-0 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute right-0 bottom-0 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          {/* Main CTA */}
          <div className="mb-12">
            <H2 className="mb-4 text-primary">{t("finalCta.mainCta.title")}</H2>
            <P className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground">
              {t("finalCta.mainCta.description")}
            </P>

            {/* Primary CTA buttons */}
            <div className="mb-8 flex flex-col justify-center gap-4 sm:flex-row">
              <LinkButton
                className="px-8 py-6 text-lg"
                href="/contact"
                size="lg"
              >
                {t("finalCta.mainCta.getQuoteButton")}
                <ArrowRight className="ml-2 h-5 w-5" />
              </LinkButton>
              <LinkButton
                className="px-8 py-6 text-lg"
                href="/projects"
                size="lg"
                variant="outline"
              >
                {t("finalCta.mainCta.browseTemplatesButton")}
              </LinkButton>
            </div>

            {/* Urgency factors */}
            <div className="flex flex-wrap justify-center gap-4 text-muted-foreground text-sm">
              {urgencyFactors.map((factor, index) => (
                <div className="flex items-center gap-2" key={index}>
                  <Clock className="h-4 w-4 text-primary" />
                  <span>{factor}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Contact methods */}
          <div className="rounded-2xl border border-border/50 bg-background/80 p-8 shadow-lg backdrop-blur">
            <H3 className="mb-6 border-none pb-0 text-primary">
              {t("finalCta.contactMethods.header")}
            </H3>

            <div className="grid gap-6 md:grid-cols-3">
              {contactMethods.map((method, index) => (
                <div className="group text-center" key={index}>
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 transition-colors group-hover:bg-primary/20">
                    <method.icon className="h-8 w-8 text-primary" />
                  </div>
                  <H3 className="mb-2 border-none pb-0 text-lg">
                    {method.title}
                  </H3>
                  <P className="mt-0 mb-3 text-muted-foreground text-sm">
                    {method.description}
                  </P>
                  <P className="mt-0 mb-3 font-medium text-foreground text-sm">
                    {method.value}
                  </P>
                  <AnchorButton
                    href={method.href}
                    rel={method.external ? "noopener noreferrer" : undefined}
                    size="sm"
                    target={method.external ? "_blank" : undefined}
                    variant="outline"
                  >
                    {method.action}
                  </AnchorButton>
                </div>
              ))}
            </div>
          </div>

          {/* Final reassurance */}
          <div className="mt-12 text-center">
            <P className="mb-4 text-muted-foreground">
              {t("finalCta.finalReassurance.secureInfo")}
            </P>
            <P className="text-muted-foreground text-sm">
              {t("finalCta.finalReassurance.stats")}
            </P>
          </div>
        </div>
      </div>
    </section>
  );
}
