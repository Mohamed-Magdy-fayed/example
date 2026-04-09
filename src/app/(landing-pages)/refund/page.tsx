"use client";

import {
    AlertTriangle,
    Calendar,
    CheckCircle,
    Clock,
    CreditCard,
    Mail,
    RefreshCw,
    XCircle,
} from "lucide-react";
import { LinkButton } from "@/components/general/link-button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { H1, H2, H3, Lead, P } from "@/components/ui/typography";
import { useTranslation } from "@/features/core/i18n/useTranslation";
import { useScrollAnimation } from "@/hooks/use-animation";

export default function RefundPolicyPage() {
    const { t } = useTranslation();
    const heroAnimation = useScrollAnimation();
    const contentAnimation = useScrollAnimation();
    const contactAnimation = useScrollAnimation();
    const lastUpdated = new Date("January 1, 2025");

    const refundScenarios = [
        {
            scenario: t(
                "refundPage.eligibility.scenarios.serviceNotAsDescribed.title",
            ),
            eligible: true,
            timeframe: "30 days",
            description: t(
                "refundPage.eligibility.scenarios.serviceNotAsDescribed.description",
            ),
            icon: CheckCircle,
            color: "text-green-600",
        },
        {
            scenario: t("refundPage.eligibility.scenarios.technicalIssues.title"),
            eligible: true,
            timeframe: "60 days",
            description: t(
                "refundPage.eligibility.scenarios.technicalIssues.description",
            ),
            icon: CheckCircle,
            color: "text-green-600",
        },
        {
            scenario: t("refundPage.eligibility.scenarios.billingErrors.title"),
            eligible: true,
            timeframe: "90 days",
            description: t(
                "refundPage.eligibility.scenarios.billingErrors.description",
            ),
            icon: CheckCircle,
            color: "text-green-600",
        },
        {
            scenario: t("refundPage.eligibility.scenarios.changeOfMind.title"),
            eligible: false,
            timeframe: "N/A",
            description: t(
                "refundPage.eligibility.scenarios.changeOfMind.description",
            ),
            icon: XCircle,
            color: "text-red-600",
        },
        {
            scenario: t("refundPage.eligibility.scenarios.partialUsage.title"),
            eligible: false,
            timeframe: "N/A",
            description: t(
                "refundPage.eligibility.scenarios.partialUsage.description",
            ),
            icon: XCircle,
            color: "text-red-600",
        },
    ];

    const refundProcess = [
        {
            step: 1,
            title: t("refundPage.process.steps.contact.title"),
            description: t("refundPage.process.steps.contact.description"),
            timeframe: t("refundPage.process.steps.contact.timeframe"),
        },
        {
            step: 2,
            title: t("refundPage.process.steps.review.title"),
            description: t("refundPage.process.steps.review.description"),
            timeframe: t("refundPage.process.steps.review.timeframe"),
        },
        {
            step: 3,
            title: t("refundPage.process.steps.decision.title"),
            description: t("refundPage.process.steps.decision.description"),
            timeframe: t("refundPage.process.steps.decision.timeframe"),
        },
        {
            step: 4,
            title: t("refundPage.process.steps.processing.title"),
            description: t("refundPage.process.steps.processing.description"),
            timeframe: t("refundPage.process.steps.processing.timeframe"),
        },
    ];

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="bg-gradient-to-br from-emerald-50 to-white py-20 dark:from-stone-900 dark:to-stone-800">
                <div
                    className={`container mx-auto px-4 text-center transition-all duration-1000 ${heroAnimation.isVisible
                            ? "translate-y-0 opacity-100"
                            : "translate-y-10 opacity-0"
                        }`}
                    ref={heroAnimation.elementRef}
                >
                    <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/20">
                        <RefreshCw className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <H1 className="mx-auto mb-6 max-w-4xl">
                        {t("refundPage.hero.title")}
                    </H1>
                    <Lead className="mx-auto mb-8 max-w-2xl text-muted-foreground">
                        {t("refundPage.hero.lead")}
                    </Lead>
                    <P className="text-muted-foreground text-sm">
                        {t("refundPage.hero.lastUpdated", { date: lastUpdated })}
                    </P>
                </div>
            </section>

            {/* Content Section */}
            <section className="py-20">
                <div
                    className="container mx-auto max-w-4xl px-4"
                    ref={contentAnimation.elementRef}
                >
                    <div
                        className={`space-y-12 transition-all duration-1000 ${contentAnimation.isVisible
                                ? "translate-y-0 opacity-100"
                                : "translate-y-10 opacity-0"
                            }`}
                    >
                        {/* Overview */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <CreditCard className="h-5 w-5 text-blue-600" />
                                    {t("refundPage.overview.title")}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <P>{t("refundPage.overview.intro1")}</P>
                                <P>{t("refundPage.overview.intro2")}</P>
                                <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-900/20">
                                    <P className="text-blue-800 text-sm dark:text-blue-200">
                                        <strong>{t("refundPage.overview.importantLabel")}</strong>{" "}
                                        {t("refundPage.overview.importantText")}
                                    </P>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Eligibility */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <CheckCircle className="h-5 w-5 text-green-600" />
                                    {t("refundPage.eligibility.title")}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <P>{t("refundPage.eligibility.intro")}</P>

                                <div className="space-y-4">
                                    {refundScenarios.map((scenario, index) => (
                                        <div
                                            className="rounded-lg border p-4 transition-shadow duration-300 hover:shadow-md"
                                            key={index}
                                        >
                                            <div className="mb-3 flex items-start justify-between">
                                                <div className="flex items-center gap-3">
                                                    <scenario.icon
                                                        className={`h-5 w-5 ${scenario.color}`}
                                                    />
                                                    <H3 className="text-lg">{scenario.scenario}</H3>
                                                </div>
                                                <div className="flex gap-2">
                                                    <Badge
                                                        variant={
                                                            scenario.eligible ? "default" : "secondary"
                                                        }
                                                    >
                                                        {scenario.eligible
                                                            ? t("refundPage.eligibility.eligible")
                                                            : t("refundPage.eligibility.notEligible")}
                                                    </Badge>
                                                    {scenario.eligible && (
                                                        <Badge variant="outline">
                                                            {scenario.timeframe}
                                                        </Badge>
                                                    )}
                                                </div>
                                            </div>
                                            <P className="text-muted-foreground text-sm">
                                                {scenario.description}
                                            </P>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Timeframes */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Clock className="h-5 w-5 text-orange-600" />
                                    {t("refundPage.timeframes.title")}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <P>{t("refundPage.timeframes.intro")}</P>

                                <div className="grid gap-6 md:grid-cols-3">
                                    <div className="rounded-lg border p-4 text-center">
                                        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20">
                                            <span className="font-bold text-green-600">30</span>
                                        </div>
                                        <H3 className="mb-2">
                                            {t("refundPage.timeframes.days30.title")}
                                        </H3>
                                        <P className="text-muted-foreground text-sm">
                                            {t("refundPage.timeframes.days30.description")}
                                        </P>
                                    </div>

                                    <div className="rounded-lg border p-4 text-center">
                                        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/20">
                                            <span className="font-bold text-blue-600">60</span>
                                        </div>
                                        <H3 className="mb-2">
                                            {t("refundPage.timeframes.days60.title")}
                                        </H3>
                                        <P className="text-muted-foreground text-sm">
                                            {t("refundPage.timeframes.days60.description")}
                                        </P>
                                    </div>

                                    <div className="rounded-lg border p-4 text-center">
                                        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/20">
                                            <span className="font-bold text-purple-600">90</span>
                                        </div>
                                        <H3 className="mb-2">
                                            {t("refundPage.timeframes.days90.title")}
                                        </H3>
                                        <P className="text-muted-foreground text-sm">
                                            {t("refundPage.timeframes.days90.description")}
                                        </P>
                                    </div>
                                </div>

                                <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-900/20">
                                    <div className="flex items-start gap-2">
                                        <AlertTriangle className="mt-0.5 h-5 w-5 flex-shrink-0 text-amber-600" />
                                        <div>
                                            <P className="mb-1 font-medium text-amber-800 dark:text-amber-200">
                                                {t("refundPage.timeframes.noticeTitle")}
                                            </P>
                                            <P className="text-amber-700 text-sm dark:text-amber-300">
                                                {t("refundPage.timeframes.noticeText")}
                                            </P>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Refund Process */}
                        <Card>
                            <CardHeader>
                                <CardTitle>{t("refundPage.process.title")}</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <P>{t("refundPage.process.intro")}</P>

                                <div className="space-y-6">
                                    {refundProcess.map((step, index) => (
                                        <div className="flex gap-4" key={index}>
                                            <div className="flex-shrink-0">
                                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/20">
                                                    {step.step === 1 && (
                                                        <Mail className="h-5 w-5 text-blue-600" />
                                                    )}
                                                    {step.step === 2 && (
                                                        <CreditCard className="h-5 w-5 text-blue-600" />
                                                    )}
                                                    {step.step === 3 && (
                                                        <Calendar className="h-5 w-5 text-blue-600" />
                                                    )}
                                                    {step.step === 4 && (
                                                        <Clock className="h-5 w-5 text-blue-600" />
                                                    )}
                                                </div>
                                            </div>
                                            <div className="flex-1">
                                                <H3 className="mb-2">{step.title}</H3>
                                                <P className="text-muted-foreground text-sm">
                                                    {step.description}
                                                </P>
                                                <P className="text-muted-foreground text-xs">
                                                    {step.timeframe}
                                                </P>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Required Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle>{t("refundPage.requiredInfo.title")}</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <P>{t("refundPage.requiredInfo.intro")}</P>

                                <div className="grid gap-6 md:grid-cols-2">
                                    <div>
                                        <H3 className="mb-3">
                                            {t("refundPage.requiredInfo.accountInfoTitle")}
                                        </H3>
                                        <ul className="list-inside list-disc space-y-1 text-muted-foreground text-sm">
                                            <li>{t("refundPage.requiredInfo.accountEmail")}</li>
                                            <li>{t("refundPage.requiredInfo.institutionName")}</li>
                                            <li>{t("refundPage.requiredInfo.planDetails")}</li>
                                            <li>{t("refundPage.requiredInfo.paymentMethod")}</li>
                                        </ul>
                                    </div>
                                    <div>
                                        <H3 className="mb-3">
                                            {t("refundPage.requiredInfo.requestDetailsTitle")}
                                        </H3>
                                        <ul className="list-inside list-disc space-y-1 text-muted-foreground text-sm">
                                            <li>{t("refundPage.requiredInfo.refundReason")}</li>
                                            <li>{t("refundPage.requiredInfo.purchaseDate")}</li>
                                            <li>{t("refundPage.requiredInfo.issueDescription")}</li>
                                            <li>{t("refundPage.requiredInfo.resolutionSteps")}</li>
                                        </ul>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Partial Refunds */}
                        <Card>
                            <CardHeader>
                                <CardTitle>{t("refundPage.partialRefunds.title")}</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <P>{t("refundPage.partialRefunds.intro")}</P>
                                <ul className="ml-4 list-inside list-disc space-y-2 text-muted-foreground text-sm">
                                    <li>
                                        <strong>
                                            {t("refundPage.partialRefunds.usagePeriod")}
                                        </strong>{" "}
                                        {t("refundPage.partialRefunds.usagePeriodDesc")}
                                    </li>
                                    <li>
                                        <strong>
                                            {t("refundPage.partialRefunds.serviceLevel")}
                                        </strong>{" "}
                                        {t("refundPage.partialRefunds.serviceLevelDesc")}
                                    </li>
                                    <li>
                                        <strong>
                                            {t("refundPage.partialRefunds.resolutionTimeline")}
                                        </strong>{" "}
                                        {t("refundPage.partialRefunds.resolutionTimelineDesc")}
                                    </li>
                                    <li>
                                        <strong>
                                            {t("refundPage.partialRefunds.downgradeRequests")}
                                        </strong>{" "}
                                        {t("refundPage.partialRefunds.downgradeRequestsDesc")}
                                    </li>
                                </ul>
                                <P className="mt-4 text-muted-foreground text-sm">
                                    {t("refundPage.partialRefunds.note")}
                                </P>
                            </CardContent>
                        </Card>

                        {/* Non-Refundable Items */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <XCircle className="h-5 w-5 text-red-600" />
                                    {t("refundPage.nonRefundable.title")}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <P>{t("refundPage.nonRefundable.intro")}</P>
                                <ul className="ml-4 list-inside list-disc space-y-2 text-muted-foreground text-sm">
                                    <li>{t("refundPage.nonRefundable.setupFees")}</li>
                                    <li>{t("refundPage.nonRefundable.customDev")}</li>
                                    <li>{t("refundPage.nonRefundable.training")}</li>
                                    <li>{t("refundPage.nonRefundable.migration")}</li>
                                    <li>{t("refundPage.nonRefundable.thirdParty")}</li>
                                    <li>{t("refundPage.nonRefundable.cancelled")}</li>
                                </ul>
                                <P className="mt-4 text-muted-foreground text-sm">
                                    {t("refundPage.nonRefundable.note")}
                                </P>
                            </CardContent>
                        </Card>

                        {/* Processing Time */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Calendar className="h-5 w-5 text-purple-600" />
                                    {t("refundPage.processingTime.title")}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <P>{t("refundPage.processingTime.intro")}</P>

                                <div className="grid gap-6 md:grid-cols-2">
                                    <div className="rounded-lg border p-4">
                                        <H3 className="mb-2">
                                            {t("refundPage.processingTime.cardsTitle")}
                                        </H3>
                                        <P className="mb-2 text-muted-foreground text-sm">
                                            {t("refundPage.processingTime.cardsTime")}
                                        </P>
                                        <P className="text-muted-foreground text-xs">
                                            {t("refundPage.processingTime.cardsNote")}
                                        </P>
                                    </div>
                                    <div className="rounded-lg border p-4">
                                        <H3 className="mb-2">
                                            {t("refundPage.processingTime.bankTitle")}
                                        </H3>
                                        <P className="mb-2 text-muted-foreground text-sm">
                                            {t("refundPage.processingTime.bankTime")}
                                        </P>
                                        <P className="text-muted-foreground text-xs">
                                            {t("refundPage.processingTime.bankNote")}
                                        </P>
                                    </div>
                                    <div className="rounded-lg border p-4">
                                        <H3 className="mb-2">
                                            {t("refundPage.processingTime.paypalTitle")}
                                        </H3>
                                        <P className="mb-2 text-muted-foreground text-sm">
                                            {t("refundPage.processingTime.paypalTime")}
                                        </P>
                                        <P className="text-muted-foreground text-xs">
                                            {t("refundPage.processingTime.paypalNote")}
                                        </P>
                                    </div>
                                    <div className="rounded-lg border p-4">
                                        <H3 className="mb-2">
                                            {t("refundPage.processingTime.walletTitle")}
                                        </H3>
                                        <P className="mb-2 text-muted-foreground text-sm">
                                            {t("refundPage.processingTime.walletTime")}
                                        </P>
                                        <P className="text-muted-foreground text-xs">
                                            {t("refundPage.processingTime.walletNote")}
                                        </P>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Dispute Resolution */}
                        <Card>
                            <CardHeader>
                                <CardTitle>{t("refundPage.dispute.title")}</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <P>{t("refundPage.dispute.intro")}</P>
                                <ul className="ml-4 list-inside list-disc space-y-2 text-muted-foreground text-sm">
                                    <li>{t("refundPage.dispute.review")}</li>
                                    <li>{t("refundPage.dispute.documentation")}</li>
                                    <li>{t("refundPage.dispute.escalate")}</li>
                                    <li>{t("refundPage.dispute.legal")}</li>
                                </ul>
                                <P className="mt-4 text-muted-foreground text-sm">
                                    {t("refundPage.dispute.note")}
                                </P>
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
                        <H2 className="mb-6">{t("refundPage.contact.title")}</H2>
                        <P className="mb-8 text-muted-foreground">
                            {t("refundPage.contact.intro")}
                        </P>

                        <div className="mb-8 grid gap-6 md:grid-cols-2">
                            <div className="flex flex-col items-center rounded-lg border p-4">
                                <Mail className="mb-2 h-8 w-8 text-blue-600" />
                                <P className="font-medium">{t("refundPage.contact.email")}</P>
                                <P className="text-muted-foreground text-sm">
                                    {t("refundPage.contact.emailAddress")}
                                </P>
                                <P className="mt-1 text-muted-foreground text-xs">
                                    {t("refundPage.contact.emailNote")}
                                </P>
                            </div>
                            <div className="flex flex-col items-center rounded-lg border p-4">
                                <Clock className="mb-2 h-8 w-8 text-green-600" />
                                <P className="font-medium">{t("refundPage.contact.chat")}</P>
                                <P className="text-muted-foreground text-sm">
                                    {t("refundPage.contact.chatNote")}
                                </P>
                                <P className="mt-1 text-muted-foreground text-xs">
                                    {t("refundPage.contact.chatInstant")}
                                </P>
                            </div>
                        </div>

                        <div className="flex flex-col justify-center gap-4 sm:flex-row">
                            <LinkButton href="/contact" size="lg">
                                {t("refundPage.contact.requestButton")}
                            </LinkButton>
                            <LinkButton href="/terms" size="lg" variant="outline">
                                {t("refundPage.contact.termsButton")}
                            </LinkButton>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
