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
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { H1, H2, H3, Lead, P } from "@/components/ui/typography";
import { useScrollAnimation } from "@/hooks/use-animation";
import { useTranslation } from "@/features/core/i18n/useTranslation";

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
            <section className="py-20 bg-gradient-to-br from-amber-50 to-white dark:from-stone-900 dark:to-stone-800">
                <div
                    ref={heroAnimation.elementRef}
                    className={`container mx-auto px-4 text-center transition-all duration-1000 ${heroAnimation.isVisible
                        ? "opacity-100 translate-y-0"
                        : "opacity-0 translate-y-10"
                        }`}
                >
                    <div className="w-16 h-16 rounded-full bg-amber-100 dark:bg-amber-900/20 flex items-center justify-center mx-auto mb-6">
                        <Cookie className="w-8 h-8 text-amber-600 dark:text-amber-400" />
                    </div>
                    <H1 className="mb-6 max-w-4xl mx-auto">
                        {t("cookiePolicy.hero.title")}
                    </H1>
                    <Lead className="mb-8 max-w-2xl mx-auto text-muted-foreground">
                        {t("cookiePolicy.hero.description")}
                    </Lead>
                    <P className="text-sm text-muted-foreground">
                        {t("cookiePolicy.hero.lastUpdated", { date: lastUpdatedDate })}
                    </P>
                </div>
            </section>

            {/* Content Section */}
            <section className="py-20">
                <div className="container mx-auto px-4 max-w-4xl">
                    <div
                        ref={contentAnimation.elementRef}
                        className={`space-y-12 transition-all duration-1000 ${contentAnimation.isVisible
                            ? "opacity-100 translate-y-0"
                            : "opacity-0 translate-y-10"
                            }`}
                    >
                        {/* What Are Cookies */}
                        <Card className="hover:shadow-lg transition-shadow duration-300">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Eye className="w-5 h-5 text-blue-600" />
                                    {t("cookiePolicy.whatAreCookies.title")}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <P>{t("cookiePolicy.whatAreCookies.paragraph1")}</P>
                                <P>{t("cookiePolicy.whatAreCookies.paragraph2")}</P>
                            </CardContent>
                        </Card>

                        {/* How We Use Cookies */}
                        <Card className="hover:shadow-lg transition-shadow duration-300">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Settings className="w-5 h-5 text-green-600" />
                                    {t("cookiePolicy.howWeUseCookies.title")}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <P>{t("cookiePolicy.howWeUseCookies.paragraph1")}</P>
                                <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground ml-4">
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
                        <Card className="hover:shadow-lg transition-shadow duration-300">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <BarChart3 className="w-5 h-5 text-purple-600" />
                                    {t("cookiePolicy.typesOfCookies.title")}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {cookieTypes.map((cookie, index) => (
                                    <div
                                        key={index}
                                        className="border rounded-lg p-6 hover:shadow-md transition-all duration-300 hover:border-primary/20"
                                    >
                                        <div className="flex items-start justify-between mb-4">
                                            <div>
                                                <H3 className="text-lg mb-2">{cookie.type}</H3>
                                                <Badge className={cookie.color}>{cookie.status}</Badge>
                                            </div>
                                            {!cookie.canDisable && (
                                                <AlertCircle className="w-5 h-5 text-red-500 mt-1" />
                                            )}
                                        </div>

                                        <P className="text-sm text-muted-foreground mb-4">
                                            {cookie.purpose}
                                        </P>

                                        <div className="grid md:grid-cols-2 gap-4 text-sm">
                                            <div>
                                                <P className="font-medium mb-2">Examples:</P>
                                                <ul className="list-disc list-inside text-muted-foreground space-y-1">
                                                    {cookie.examples.map((example, idx) => (
                                                        <li key={idx}>{example}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                            <div>
                                                <P className="font-medium mb-2">Retention Period:</P>
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
                        <Card className="hover:shadow-lg transition-shadow duration-300">
                            <CardHeader>
                                <CardTitle>
                                    {t("cookiePolicy.thirdPartyCookies.title")}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <P>{t("cookiePolicy.thirdPartyCookies.paragraph1")}</P>
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4">
                                        <H3 className="mb-3 flex items-center gap-2">
                                            <BarChart3 className="w-4 h-4 text-blue-600" />
                                            {t(
                                                "cookiePolicy.thirdPartyCookies.analyticsServices.title",
                                            )}
                                        </H3>
                                        <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
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
                                    <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4">
                                        <H3 className="mb-3 flex items-center gap-2">
                                            <Settings className="w-4 h-4 text-green-600" />
                                            {t(
                                                "cookiePolicy.thirdPartyCookies.supportServices.title",
                                            )}
                                        </H3>
                                        <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
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
                                <P className="text-sm text-muted-foreground">
                                    {t("cookiePolicy.thirdPartyCookies.paragraph2")}
                                </P>
                            </CardContent>
                        </Card>

                        {/* Managing Cookies */}
                        <Card className="hover:shadow-lg transition-shadow duration-300">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Settings className="w-5 h-5 text-orange-600" />
                                    {t("cookiePolicy.managingCookies.title")}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                                    <H3 className="mb-3">
                                        {t("cookiePolicy.managingCookies.platformSettings.title")}
                                    </H3>
                                    <P className="text-sm text-muted-foreground mb-3">
                                        {t(
                                            "cookiePolicy.managingCookies.platformSettings.paragraph1",
                                        )}
                                    </P>
                                    <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground ml-4">
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

                                <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                                    <H3 className="mb-3">
                                        {t("cookiePolicy.managingCookies.browserSettings.title")}
                                    </H3>
                                    <P className="text-sm text-muted-foreground mb-3">
                                        {t(
                                            "cookiePolicy.managingCookies.browserSettings.paragraph1",
                                        )}
                                    </P>
                                    <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground ml-4">
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

                                <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
                                    <div className="flex items-start gap-2">
                                        <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                                        <div>
                                            <P className="font-medium text-amber-800 dark:text-amber-200 mb-1">
                                                {t("cookiePolicy.managingCookies.importantNote.title")}
                                            </P>
                                            <P className="text-sm text-amber-700 dark:text-amber-300">
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
                        <Card className="hover:shadow-lg transition-shadow duration-300">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Shield className="w-5 h-5 text-green-600" />
                                    {t("cookiePolicy.cookieConsent.title")}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <P>{t("cookiePolicy.cookieConsent.paragraph1")}</P>
                                <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground ml-4">
                                    <li>{t("cookiePolicy.cookieConsent.item1")}</li>
                                    <li>{t("cookiePolicy.cookieConsent.item2")}</li>
                                    <li>{t("cookiePolicy.cookieConsent.item3")}</li>
                                    <li>{t("cookiePolicy.cookieConsent.item4")}</li>
                                </ul>
                            </CardContent>
                        </Card>

                        {/* Changes to Policy */}
                        <Card className="hover:shadow-lg transition-shadow duration-300">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Calendar className="w-5 h-5 text-blue-600" />
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
            <section className="py-20 bg-gradient-to-br from-amber-50 to-white dark:from-gray-900 dark:to-gray-800">
                <div className="container mx-auto px-4">
                    <div
                        ref={contactAnimation.elementRef}
                        className={`max-w-3xl mx-auto text-center transition-all duration-1000 ${contactAnimation.isVisible
                            ? "opacity-100 translate-y-0"
                            : "opacity-0 translate-y-10"
                            }`}
                    >
                        <H2 className="mb-6">{t("cookiePolicy.contact.title")}</H2>
                        <P className="text-muted-foreground mb-8">
                            {t("cookiePolicy.contact.description")}
                        </P>

                        <div className="grid md:grid-cols-3 gap-6 mb-8">
                            <div className="flex flex-col items-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
                                <Mail className="w-8 h-8 text-blue-600 mb-2" />
                                <P className="font-medium">{t("cookiePolicy.contact.email")}</P>
                                <P className="text-sm text-muted-foreground">
                                    {t("cookiePolicy.contact.emailAddress")}
                                </P>
                            </div>
                            <div className="flex flex-col items-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
                                <Phone className="w-8 h-8 text-green-600 mb-2" />
                                <P className="font-medium">{t("cookiePolicy.contact.phone")}</P>
                                <P className="text-sm text-muted-foreground">
                                    {t("cookiePolicy.contact.phoneNumber")}
                                </P>
                            </div>
                            <div className="flex flex-col items-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
                                <MapPin className="w-8 h-8 text-red-600 mb-2" />
                                <P className="font-medium">
                                    {t("cookiePolicy.contact.address")}
                                </P>
                                <P className="text-sm text-muted-foreground">
                                    {t("cookiePolicy.contact.addressDetails")}
                                </P>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button
                                size="lg"
                                asChild
                                className="hover:scale-105 transition-transform duration-200"
                            >
                                <Link href="/contact">{t("cookiePolicy.contact.button")}</Link>
                            </Button>
                            <Button
                                size="lg"
                                variant="outline"
                                asChild
                                className="hover:scale-105 transition-transform duration-200"
                            >
                                <Link href="/">{t("cookiePolicy.contact.backToHome")}</Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
