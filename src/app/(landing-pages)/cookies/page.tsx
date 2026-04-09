"use client";

import {
    AlertCircle,
    BarChart3,
    Calendar,
    Cookie,
    Eye,
    Mail,
    MapPin,
    Phone,
    Settings,
    Shield,
} from "lucide-react";
import { LinkButton } from "@/components/general/link-button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { H1, H2, H3, Lead, P } from "@/components/ui/typography";
import { useTranslation } from "@/features/core/i18n/useTranslation";
import { useScrollAnimation } from "@/hooks/use-animation";

export default function CookiePolicyPage() {
    const { t } = useTranslation();

    const heroAnimation = useScrollAnimation();
    const contentAnimation = useScrollAnimation();
    const contactAnimation = useScrollAnimation();

    const lastUpdatedDate = new Date("2025-01-01");

    const cookieTypes = [
        {
            type: t("cookiePolicy.typesOfCookies.essential.type"),
            status: t("cookiePolicy.typesOfCookies.essential.status"),
            purpose: t("cookiePolicy.typesOfCookies.essential.purpose"),
            examples: [
                t("cookiePolicy.typesOfCookies.essential.example1"),
                t("cookiePolicy.typesOfCookies.essential.example2"),
                t("cookiePolicy.typesOfCookies.essential.example3"),
            ],
            retention: t("cookiePolicy.typesOfCookies.essential.retention"),
            canDisable: false,
            color: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400",
        },
        {
            type: t("cookiePolicy.typesOfCookies.functional.type"),
            status: t("cookiePolicy.typesOfCookies.functional.status"),
            purpose: t("cookiePolicy.typesOfCookies.functional.purpose"),
            examples: [
                t("cookiePolicy.typesOfCookies.functional.example1"),
                t("cookiePolicy.typesOfCookies.functional.example2"),
                t("cookiePolicy.typesOfCookies.functional.example3"),
            ],
            retention: t("cookiePolicy.typesOfCookies.functional.retention"),
            canDisable: true,
            color: "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400",
        },
        {
            type: t("cookiePolicy.typesOfCookies.analytics.type"),
            status: t("cookiePolicy.typesOfCookies.analytics.status"),
            purpose: t("cookiePolicy.typesOfCookies.analytics.purpose"),
            examples: [
                t("cookiePolicy.typesOfCookies.analytics.example1"),
                t("cookiePolicy.typesOfCookies.analytics.example2"),
                t("cookiePolicy.typesOfCookies.analytics.example3"),
            ],
            retention: t("cookiePolicy.typesOfCookies.analytics.retention"),
            canDisable: true,
            color:
                "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400",
        },
        {
            type: t("cookiePolicy.typesOfCookies.marketing.type"),
            status: t("cookiePolicy.typesOfCookies.marketing.status"),
            purpose: t("cookiePolicy.typesOfCookies.marketing.purpose"),
            examples: [
                t("cookiePolicy.typesOfCookies.marketing.example1"),
                t("cookiePolicy.typesOfCookies.marketing.example2"),
                t("cookiePolicy.typesOfCookies.marketing.example3"),
            ],
            retention: t("cookiePolicy.typesOfCookies.marketing.retention"),
            canDisable: true,
            color:
                "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400",
        },
    ];

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="bg-gradient-to-br from-amber-50 to-white py-20 dark:from-stone-900 dark:to-stone-800">
                <div
                    className={`container mx-auto px-4 text-center transition-all duration-1000 ${heroAnimation.isVisible
                            ? "translate-y-0 opacity-100"
                            : "translate-y-10 opacity-0"
                        }`}
                    ref={heroAnimation.elementRef}
                >
                    <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/20">
                        <Cookie className="h-8 w-8 text-amber-600 dark:text-amber-400" />
                    </div>
                    <H1 className="mx-auto mb-6 max-w-4xl">
                        {t("cookiePolicy.hero.title")}
                    </H1>
                    <Lead className="mx-auto mb-8 max-w-2xl text-muted-foreground">
                        {t("cookiePolicy.hero.description")}
                    </Lead>
                    <P className="text-muted-foreground text-sm">
                        {t("cookiePolicy.hero.lastUpdated", { date: lastUpdatedDate })}
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
                        {/* What Are Cookies */}
                        <Card className="transition-shadow duration-300 hover:shadow-lg">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Eye className="h-5 w-5 text-blue-600" />
                                    {t("cookiePolicy.whatAreCookies.title")}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <P>{t("cookiePolicy.whatAreCookies.paragraph1")}</P>
                                <P>{t("cookiePolicy.whatAreCookies.paragraph2")}</P>
                            </CardContent>
                        </Card>

                        {/* How We Use Cookies */}
                        <Card className="transition-shadow duration-300 hover:shadow-lg">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Settings className="h-5 w-5 text-green-600" />
                                    {t("cookiePolicy.howWeUseCookies.title")}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <P>{t("cookiePolicy.howWeUseCookies.paragraph1")}</P>
                                <ul className="ml-4 list-inside list-disc space-y-2 text-muted-foreground text-sm">
                                    <li>{t("cookiePolicy.howWeUseCookies.item1")}</li>
                                    <li>{t("cookiePolicy.howWeUseCookies.item2")}</li>
                                    <li>{t("cookiePolicy.howWeUseCookies.item3")}</li>
                                    <li>{t("cookiePolicy.howWeUseCookies.item4")}</li>
                                    <li>{t("cookiePolicy.howWeUseCookies.item5")}</li>
                                    <li>{t("cookiePolicy.howWeUseCookies.item6")}</li>
                                </ul>
                            </CardContent>
                        </Card>

                        {/* Types of Cookies */}
                        <Card className="transition-shadow duration-300 hover:shadow-lg">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <BarChart3 className="h-5 w-5 text-purple-600" />
                                    {t("cookiePolicy.typesOfCookies.title")}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {cookieTypes.map((cookie, index) => (
                                    <div
                                        className="rounded-lg border p-6 transition-all duration-300 hover:border-primary/20 hover:shadow-md"
                                        key={index}
                                    >
                                        <div className="mb-4 flex items-start justify-between">
                                            <div>
                                                <H3 className="mb-2 text-lg">{cookie.type}</H3>
                                                <Badge className={cookie.color}>{cookie.status}</Badge>
                                            </div>
                                            {!cookie.canDisable && (
                                                <AlertCircle className="mt-1 h-5 w-5 text-red-500" />
                                            )}
                                        </div>

                                        <P className="mb-4 text-muted-foreground text-sm">
                                            {cookie.purpose}
                                        </P>

                                        <div className="grid gap-4 text-sm md:grid-cols-2">
                                            <div>
                                                <P className="mb-2 font-medium">Examples:</P>
                                                <ul className="list-inside list-disc space-y-1 text-muted-foreground">
                                                    {cookie.examples.map((example, idx) => (
                                                        <li key={idx}>{example}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                            <div>
                                                <P className="mb-2 font-medium">Retention Period:</P>
                                                <P className="text-muted-foreground">
                                                    {cookie.retention}
                                                </P>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>

                        {/* Third-Party Cookies */}
                        <Card className="transition-shadow duration-300 hover:shadow-lg">
                            <CardHeader>
                                <CardTitle>
                                    {t("cookiePolicy.thirdPartyCookies.title")}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <P>{t("cookiePolicy.thirdPartyCookies.paragraph1")}</P>
                                <div className="grid gap-6 md:grid-cols-2">
                                    <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-900/50">
                                        <H3 className="mb-3 flex items-center gap-2">
                                            <BarChart3 className="h-4 w-4 text-blue-600" />
                                            {t(
                                                "cookiePolicy.thirdPartyCookies.analyticsServices.title",
                                            )}
                                        </H3>
                                        <ul className="list-inside list-disc space-y-1 text-muted-foreground text-sm">
                                            <li>
                                                {t(
                                                    "cookiePolicy.thirdPartyCookies.analyticsServices.item1",
                                                )}
                                            </li>
                                            <li>
                                                {t(
                                                    "cookiePolicy.thirdPartyCookies.analyticsServices.item2",
                                                )}
                                            </li>
                                            <li>
                                                {t(
                                                    "cookiePolicy.thirdPartyCookies.analyticsServices.item3",
                                                )}
                                            </li>
                                        </ul>
                                    </div>
                                    <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-900/50">
                                        <H3 className="mb-3 flex items-center gap-2">
                                            <Settings className="h-4 w-4 text-green-600" />
                                            {t(
                                                "cookiePolicy.thirdPartyCookies.supportServices.title",
                                            )}
                                        </H3>
                                        <ul className="list-inside list-disc space-y-1 text-muted-foreground text-sm">
                                            <li>
                                                {t(
                                                    "cookiePolicy.thirdPartyCookies.supportServices.item1",
                                                )}
                                            </li>
                                            <li>
                                                {t(
                                                    "cookiePolicy.thirdPartyCookies.supportServices.item2",
                                                )}
                                            </li>
                                            <li>
                                                {t(
                                                    "cookiePolicy.thirdPartyCookies.supportServices.item3",
                                                )}
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                                <P className="text-muted-foreground text-sm">
                                    {t("cookiePolicy.thirdPartyCookies.paragraph2")}
                                </P>
                            </CardContent>
                        </Card>

                        {/* Managing Cookies */}
                        <Card className="transition-shadow duration-300 hover:shadow-lg">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Settings className="h-5 w-5 text-orange-600" />
                                    {t("cookiePolicy.managingCookies.title")}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
                                    <H3 className="mb-3">
                                        {t("cookiePolicy.managingCookies.platformSettings.title")}
                                    </H3>
                                    <P className="mb-3 text-muted-foreground text-sm">
                                        {t(
                                            "cookiePolicy.managingCookies.platformSettings.paragraph1",
                                        )}
                                    </P>
                                    <ul className="ml-4 list-inside list-disc space-y-1 text-muted-foreground text-sm">
                                        <li>
                                            {t("cookiePolicy.managingCookies.platformSettings.item1")}
                                        </li>
                                        <li>
                                            {t("cookiePolicy.managingCookies.platformSettings.item2")}
                                        </li>
                                        <li>
                                            {t("cookiePolicy.managingCookies.platformSettings.item3")}
                                        </li>
                                    </ul>
                                </div>

                                <div className="rounded-lg bg-green-50 p-4 dark:bg-green-900/20">
                                    <H3 className="mb-3">
                                        {t("cookiePolicy.managingCookies.browserSettings.title")}
                                    </H3>
                                    <P className="mb-3 text-muted-foreground text-sm">
                                        {t(
                                            "cookiePolicy.managingCookies.browserSettings.paragraph1",
                                        )}
                                    </P>
                                    <ul className="ml-4 list-inside list-disc space-y-1 text-muted-foreground text-sm">
                                        <li>
                                            {t("cookiePolicy.managingCookies.browserSettings.item1")}
                                        </li>
                                        <li>
                                            {t("cookiePolicy.managingCookies.browserSettings.item2")}
                                        </li>
                                        <li>
                                            {t("cookiePolicy.managingCookies.browserSettings.item3")}
                                        </li>
                                        <li>
                                            {t("cookiePolicy.managingCookies.browserSettings.item4")}
                                        </li>
                                    </ul>
                                </div>

                                <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-900/20">
                                    <div className="flex items-start gap-2">
                                        <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-amber-600" />
                                        <div>
                                            <P className="mb-1 font-medium text-amber-800 dark:text-amber-200">
                                                {t("cookiePolicy.managingCookies.importantNote.title")}
                                            </P>
                                            <P className="text-amber-700 text-sm dark:text-amber-300">
                                                {t(
                                                    "cookiePolicy.managingCookies.importantNote.paragraph1",
                                                )}
                                            </P>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Cookie Consent */}
                        <Card className="transition-shadow duration-300 hover:shadow-lg">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Shield className="h-5 w-5 text-green-600" />
                                    {t("cookiePolicy.cookieConsent.title")}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <P>{t("cookiePolicy.cookieConsent.paragraph1")}</P>
                                <ul className="ml-4 list-inside list-disc space-y-2 text-muted-foreground text-sm">
                                    <li>{t("cookiePolicy.cookieConsent.item1")}</li>
                                    <li>{t("cookiePolicy.cookieConsent.item2")}</li>
                                    <li>{t("cookiePolicy.cookieConsent.item3")}</li>
                                    <li>{t("cookiePolicy.cookieConsent.item4")}</li>
                                </ul>
                            </CardContent>
                        </Card>

                        {/* Changes to Policy */}
                        <Card className="transition-shadow duration-300 hover:shadow-lg">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Calendar className="h-5 w-5 text-blue-600" />
                                    {t("cookiePolicy.changesToPolicy.title")}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <P>{t("cookiePolicy.changesToPolicy.paragraph1")}</P>
                                <P>{t("cookiePolicy.changesToPolicy.paragraph2")}</P>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Contact Section */}
            <section className="bg-gradient-to-br from-amber-50 to-white py-20 dark:from-gray-900 dark:to-gray-800">
                <div className="container mx-auto px-4">
                    <div
                        className={`mx-auto max-w-3xl text-center transition-all duration-1000 ${contactAnimation.isVisible
                                ? "translate-y-0 opacity-100"
                                : "translate-y-10 opacity-0"
                            }`}
                        ref={contactAnimation.elementRef}
                    >
                        <H2 className="mb-6">{t("cookiePolicy.contact.title")}</H2>
                        <P className="mb-8 text-muted-foreground">
                            {t("cookiePolicy.contact.description")}
                        </P>

                        <div className="mb-8 grid gap-6 md:grid-cols-3">
                            <div className="flex flex-col items-center rounded-lg bg-white p-4 shadow-sm transition-shadow duration-300 hover:shadow-md dark:bg-gray-800">
                                <Mail className="mb-2 h-8 w-8 text-blue-600" />
                                <P className="font-medium">{t("cookiePolicy.contact.email")}</P>
                                <P className="text-muted-foreground text-sm">
                                    {t("cookiePolicy.contact.emailAddress")}
                                </P>
                            </div>
                            <div className="flex flex-col items-center rounded-lg bg-white p-4 shadow-sm transition-shadow duration-300 hover:shadow-md dark:bg-gray-800">
                                <Phone className="mb-2 h-8 w-8 text-green-600" />
                                <P className="font-medium">{t("cookiePolicy.contact.phone")}</P>
                                <P className="text-muted-foreground text-sm">
                                    {t("cookiePolicy.contact.phoneNumber")}
                                </P>
                            </div>
                            <div className="flex flex-col items-center rounded-lg bg-white p-4 shadow-sm transition-shadow duration-300 hover:shadow-md dark:bg-gray-800">
                                <MapPin className="mb-2 h-8 w-8 text-red-600" />
                                <P className="font-medium">
                                    {t("cookiePolicy.contact.address")}
                                </P>
                                <P className="text-muted-foreground text-sm">
                                    {t("cookiePolicy.contact.addressDetails")}
                                </P>
                            </div>
                        </div>

                        <div className="flex flex-col justify-center gap-4 sm:flex-row">
                            <LinkButton
                                className="transition-transform duration-200 hover:scale-105"
                                href="/contact"
                                size="lg"
                            >
                                {t("cookiePolicy.contact.button")}
                            </LinkButton>
                            <LinkButton
                                className="transition-transform duration-200 hover:scale-105"
                                href="/"
                                size="lg"
                                variant="outline"
                            >
                                {t("cookiePolicy.contact.backToHome")}
                            </LinkButton>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
