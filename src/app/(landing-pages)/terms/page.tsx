"use client";

import {
    AlertTriangle,
    Calendar,
    CreditCard,
    FileText,
    Gavel,
    Scale,
    Shield,
    Users,
} from "lucide-react";
import { LinkButton } from "@/components/general/link-button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { H1, H2, H3, Lead, P } from "@/components/ui/typography";
import { useTranslation } from "@/features/core/i18n/useTranslation";
import { useScrollAnimation } from "@/hooks/use-animation";

export default function TermsOfServicePage() {
    const { t } = useTranslation();
    const heroAnimation = useScrollAnimation();
    const contentAnimation = useScrollAnimation();
    const contactAnimation = useScrollAnimation();

    const lastUpdated = new Date("January 1, 2025");

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="bg-gradient-to-br from-green-50 to-white py-20 dark:from-stone-900 dark:to-stone-800">
                <div
                    className={`container mx-auto px-4 text-center transition-all duration-1000 ${heroAnimation.isVisible
                            ? "translate-y-0 opacity-100"
                            : "translate-y-10 opacity-0"
                        }`}
                    ref={heroAnimation.elementRef}
                >
                    <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20">
                        <FileText className="h-8 w-8 text-green-600 dark:text-green-400" />
                    </div>
                    <H1 className="mx-auto mb-6 max-w-4xl">
                        {t("termsPage.hero.title")}
                    </H1>
                    <Lead className="mx-auto mb-8 max-w-2xl text-muted-foreground">
                        {t("termsPage.hero.lead")}
                    </Lead>
                    <P className="text-muted-foreground text-sm">
                        {t("termsPage.hero.lastUpdated", { date: lastUpdated })}
                    </P>
                </div>
            </section>

            {/* Content Section */}
            <section className="py-20">
                <div className="container mx-auto max-w-4xl px-4">
                    <div
                        className={`space-y-12 transition-all duration-1000 ${contentAnimation.isVisible
                                ? "translate-y-0 opacity-100"
                                : "translate-y-10 opacity-0"
                            }`}
                        ref={contentAnimation.elementRef}
                    >
                        {/* Acceptance of Terms */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Scale className="h-5 w-5 text-blue-600" />
                                    {t("termsPage.acceptance.title")}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <P>{t("termsPage.acceptance.p1")}</P>
                                <P>{t("termsPage.acceptance.p2")}</P>
                            </CardContent>
                        </Card>

                        {/* Description of Service */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Users className="h-5 w-5 text-orange-600" />
                                    {t("termsPage.description.title")}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <P>{t("termsPage.description.p1")}</P>
                                <ul className="ml-4 list-inside list-disc space-y-2 text-muted-foreground text-sm">
                                    <li>
                                        {t("termsPage.description.features.courseManagement")}
                                    </li>
                                    <li>{t("termsPage.description.features.attendance")}</li>
                                    <li>{t("termsPage.description.features.grading")}</li>
                                    <li>{t("termsPage.description.features.communication")}</li>
                                    <li>{t("termsPage.description.features.resources")}</li>
                                </ul>
                            </CardContent>
                        </Card>

                        {/* User Accounts */}
                        <Card>
                            <CardHeader>
                                <CardTitle>{t("termsPage.accounts.title")}</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <P>{t("termsPage.accounts.p1")}</P>
                                <ul className="ml-4 list-inside list-disc space-y-2 text-muted-foreground text-sm">
                                    <li>{t("termsPage.accounts.items.noShare")}</li>
                                    <li>{t("termsPage.accounts.items.notify")}</li>
                                    <li>{t("termsPage.accounts.items.responsibility")}</li>
                                </ul>
                                <P className="mt-4">{t("termsPage.accounts.p2")}</P>
                            </CardContent>
                        </Card>

                        {/* Acceptable Use */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Shield className="h-5 w-5 text-green-600" />
                                    {t("termsPage.acceptableUse.title")}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <P>{t("termsPage.acceptableUse.p1")}</P>
                                <ul className="ml-4 list-inside list-disc space-y-2 text-muted-foreground text-sm">
                                    <li>{t(`termsPage.acceptableUse.items.abuse`)}</li>
                                    <li>{t(`termsPage.acceptableUse.items.ip`)}</li>
                                    <li>{t(`termsPage.acceptableUse.items.laws`)}</li>
                                    <li>{t(`termsPage.acceptableUse.items.malware`)}</li>
                                </ul>
                            </CardContent>
                        </Card>

                        {/* Intellectual Property */}
                        <Card>
                            <CardHeader>
                                <CardTitle>
                                    {t("termsPage.intellectualProperty.title")}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <P>{t("termsPage.intellectualProperty.p1")}</P>
                                <P>{t("termsPage.intellectualProperty.p2")}</P>
                            </CardContent>
                        </Card>

                        {/* Payment Terms */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <CreditCard className="h-5 w-5 text-purple-600" />
                                    {t("termsPage.payment.title")}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <P>{t("termsPage.payment.p1")}</P>
                                <div>
                                    <H3 className="mb-3">
                                        {t("termsPage.payment.subscriptionTitle")}
                                    </H3>
                                    <ul className="ml-4 list-inside list-disc space-y-2 text-muted-foreground text-sm">
                                        <li>{t("termsPage.payment.subscriptionItems.advance")}</li>
                                        <li>{t("termsPage.payment.subscriptionItems.renewals")}</li>
                                        <li>{t("termsPage.payment.subscriptionItems.taxes")}</li>
                                    </ul>
                                </div>
                                <div>
                                    <H3 className="mb-3">{t("termsPage.payment.lateTitle")}</H3>
                                    <P className="text-muted-foreground text-sm">
                                        {t("termsPage.payment.lateP")}
                                    </P>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Privacy and Data */}
                        <Card>
                            <CardHeader>
                                <CardTitle>{t("termsPage.privacy.title")}</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <P>{t("termsPage.privacy.p1")}</P>
                                <P>{t("termsPage.privacy.p2")}</P>
                            </CardContent>
                        </Card>

                        {/* Disclaimers */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <AlertTriangle className="h-5 w-5 text-yellow-600" />
                                    {t("termsPage.disclaimers.title")}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <P>{t("termsPage.disclaimers.p1")}</P>
                                <P>{t("termsPage.disclaimers.p2")}</P>
                                <div>
                                    <H3 className="mb-3">
                                        {t("termsPage.disclaimers.limitationTitle")}
                                    </H3>
                                    <P className="text-muted-foreground text-sm">
                                        {t("termsPage.disclaimers.limitationP")}
                                    </P>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Termination */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Gavel className="h-5 w-5 text-red-600" />
                                    {t("termsPage.termination.title")}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <P>{t("termsPage.termination.p1")}</P>
                                <P>{t("termsPage.termination.p2")}</P>
                                <P>{t("termsPage.termination.p3")}</P>
                            </CardContent>
                        </Card>

                        {/* Governing Law */}
                        <Card>
                            <CardHeader>
                                <CardTitle>{t("termsPage.governingLaw.title")}</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <P>{t("termsPage.governingLaw.p1")}</P>
                                <P>{t("termsPage.governingLaw.p2")}</P>
                            </CardContent>
                        </Card>

                        {/* Changes to Terms */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Calendar className="h-5 w-5 text-blue-600" />
                                    {t("termsPage.changes.title")}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <P>{t("termsPage.changes.p1")}</P>
                                <P>{t("termsPage.changes.p2")}</P>
                            </CardContent>
                        </Card>

                        {/* Contact Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle>{t("termsPage.contact.title")}</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <P>{t("termsPage.contact.p1")}</P>
                                <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
                                    <P className="text-sm">
                                        <strong>{t("termsPage.contact.emailLabel")}</strong>{" "}
                                        legal@gateling.com
                                        <br />
                                        <strong>{t("termsPage.contact.phoneLabel")}</strong> +1
                                        (555) 123-4567
                                        <br />
                                        <strong>{t("termsPage.contact.addressLabel")}</strong> 123
                                        Education Street, Learning City, LC 12345
                                    </P>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Contact Section */}
            <section className="bg-gray-50 py-20 dark:bg-gray-900/50">
                <div className="container mx-auto px-4">
                    <div
                        className={`mx-auto max-w-3xl text-center transition-all duration-1000 ${contactAnimation.isVisible
                                ? "translate-y-0 opacity-100"
                                : "translate-y-10 opacity-0"
                            }`}
                        ref={contactAnimation.elementRef}
                    >
                        <H2 className="mb-6">{t("termsPage.questions.title")}</H2>
                        <P className="mb-8 text-muted-foreground">
                            {t("termsPage.questions.lead")}
                        </P>
                        <div className="flex flex-col justify-center gap-4 sm:flex-row">
                            <LinkButton href="/contact" size="lg">
                                {t("termsPage.questions.contactButton")}
                            </LinkButton>
                            <LinkButton href="/" size="lg" variant="outline">
                                {t("termsPage.questions.homeButton")}
                            </LinkButton>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
