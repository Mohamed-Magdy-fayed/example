'use client';

import { H1, H2, H3, P, Lead } from '@/components/ui/typography';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RefreshCw, CreditCard, Clock, AlertTriangle, CheckCircle, XCircle, Calendar, Mail } from 'lucide-react';
import Link from 'next/link';
import { useScrollAnimation } from '@/hooks/use-animation';
import { useTranslation } from '@/features/core/i18n/useTranslation';

export default function RefundPolicyPage() {
    const { t } = useTranslation();
    const heroAnimation = useScrollAnimation();
    const contentAnimation = useScrollAnimation();
    const contactAnimation = useScrollAnimation();
    const lastUpdated = new Date("January 1, 2025");

    const refundScenarios = [
        {
            scenario: t('refundPage.eligibility.scenarios.serviceNotAsDescribed.title'),
            eligible: true,
            timeframe: "30 days",
            description: t('refundPage.eligibility.scenarios.serviceNotAsDescribed.description'),
            icon: CheckCircle,
            color: "text-green-600"
        },
        {
            scenario: t('refundPage.eligibility.scenarios.technicalIssues.title'),
            eligible: true,
            timeframe: "60 days",
            description: t('refundPage.eligibility.scenarios.technicalIssues.description'),
            icon: CheckCircle,
            color: "text-green-600"
        },
        {
            scenario: t('refundPage.eligibility.scenarios.billingErrors.title'),
            eligible: true,
            timeframe: "90 days",
            description: t('refundPage.eligibility.scenarios.billingErrors.description'),
            icon: CheckCircle,
            color: "text-green-600"
        },
        {
            scenario: t('refundPage.eligibility.scenarios.changeOfMind.title'),
            eligible: false,
            timeframe: "N/A",
            description: t('refundPage.eligibility.scenarios.changeOfMind.description'),
            icon: XCircle,
            color: "text-red-600"
        },
        {
            scenario: t('refundPage.eligibility.scenarios.partialUsage.title'),
            eligible: false,
            timeframe: "N/A",
            description: t('refundPage.eligibility.scenarios.partialUsage.description'),
            icon: XCircle,
            color: "text-red-600"
        }
    ];

    const refundProcess = [
        {
            step: 1,
            title: t('refundPage.process.steps.contact.title'),
            description: t('refundPage.process.steps.contact.description'),
            timeframe: t('refundPage.process.steps.contact.timeframe')
        },
        {
            step: 2,
            title: t('refundPage.process.steps.review.title'),
            description: t('refundPage.process.steps.review.description'),
            timeframe: t('refundPage.process.steps.review.timeframe')
        },
        {
            step: 3,
            title: t('refundPage.process.steps.decision.title'),
            description: t('refundPage.process.steps.decision.description'),
            timeframe: t('refundPage.process.steps.decision.timeframe')
        },
        {
            step: 4,
            title: t('refundPage.process.steps.processing.title'),
            description: t('refundPage.process.steps.processing.description'),
            timeframe: t('refundPage.process.steps.processing.timeframe')
        }
    ];

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="py-20 bg-gradient-to-br from-emerald-50 to-white dark:from-stone-900 dark:to-stone-800">
                <div
                    ref={heroAnimation.elementRef}
                    className={`container mx-auto px-4 text-center transition-all duration-1000 ${heroAnimation.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                        }`}
                >
                    <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900/20 flex items-center justify-center mx-auto mb-6">
                        <RefreshCw className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <H1 className="mb-6 max-w-4xl mx-auto">
                        {t("refundPage.hero.title")}
                    </H1>
                    <Lead className="mb-8 max-w-2xl mx-auto text-muted-foreground">
                        {t("refundPage.hero.lead")}
                    </Lead>
                    <P className="text-sm text-muted-foreground">
                        {t("refundPage.hero.lastUpdated", { date: lastUpdated })}
                    </P>
                </div>
            </section>

            {/* Content Section */}
            <section className="py-20">
                <div
                    ref={contentAnimation.elementRef}
                    className="container mx-auto px-4 max-w-4xl"
                >
                    <div
                        className={`space-y-12 transition-all duration-1000 ${contentAnimation.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                            }`}
                    >
                        {/* Overview */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <CreditCard className="w-5 h-5 text-blue-600" />
                                    {t('refundPage.overview.title')}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <P>
                                    {t('refundPage.overview.intro1')}
                                </P>
                                <P>
                                    {t('refundPage.overview.intro2')}
                                </P>
                                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                                    <P className="text-sm text-blue-800 dark:text-blue-200">
                                        <strong>{t('refundPage.overview.importantLabel')}</strong> {t('refundPage.overview.importantText')}
                                    </P>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Eligibility */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <CheckCircle className="w-5 h-5 text-green-600" />
                                    {t('refundPage.eligibility.title')}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <P>
                                    {t('refundPage.eligibility.intro')}
                                </P>

                                <div className="space-y-4">
                                    {refundScenarios.map((scenario, index) => (
                                        <div key={index} className="border rounded-lg p-4 hover:shadow-md transition-shadow duration-300">
                                            <div className="flex items-start justify-between mb-3">
                                                <div className="flex items-center gap-3">
                                                    <scenario.icon className={`w-5 h-5 ${scenario.color}`} />
                                                    <H3 className="text-lg">{scenario.scenario}</H3>
                                                </div>
                                                <div className="flex gap-2">
                                                    <Badge variant={scenario.eligible ? "default" : "secondary"}>
                                                        {scenario.eligible ? t('refundPage.eligibility.eligible') : t('refundPage.eligibility.notEligible')}
                                                    </Badge>
                                                    {scenario.eligible && (
                                                        <Badge variant="outline">
                                                            {scenario.timeframe}
                                                        </Badge>
                                                    )}
                                                </div>
                                            </div>
                                            <P className="text-sm text-muted-foreground">
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
                                    <Clock className="w-5 h-5 text-orange-600" />
                                    {t('refundPage.timeframes.title')}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <P>
                                    {t('refundPage.timeframes.intro')}
                                </P>

                                <div className="grid md:grid-cols-3 gap-6">
                                    <div className="text-center p-4 border rounded-lg">
                                        <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center mx-auto mb-3">
                                            <span className="text-green-600 font-bold">30</span>
                                        </div>
                                        <H3 className="mb-2">{t('refundPage.timeframes.days30.title')}</H3>
                                        <P className="text-sm text-muted-foreground">
                                            {t('refundPage.timeframes.days30.description')}
                                        </P>
                                    </div>

                                    <div className="text-center p-4 border rounded-lg">
                                        <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center mx-auto mb-3">
                                            <span className="text-blue-600 font-bold">60</span>
                                        </div>
                                        <H3 className="mb-2">{t('refundPage.timeframes.days60.title')}</H3>
                                        <P className="text-sm text-muted-foreground">
                                            {t('refundPage.timeframes.days60.description')}
                                        </P>
                                    </div>

                                    <div className="text-center p-4 border rounded-lg">
                                        <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center mx-auto mb-3">
                                            <span className="text-purple-600 font-bold">90</span>
                                        </div>
                                        <H3 className="mb-2">{t('refundPage.timeframes.days90.title')}</H3>
                                        <P className="text-sm text-muted-foreground">
                                            {t('refundPage.timeframes.days90.description')}
                                        </P>
                                    </div>
                                </div>

                                <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
                                    <div className="flex items-start gap-2">
                                        <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                                        <div>
                                            <P className="font-medium text-amber-800 dark:text-amber-200 mb-1">
                                                {t('refundPage.timeframes.noticeTitle')}
                                            </P>
                                            <P className="text-sm text-amber-700 dark:text-amber-300">
                                                {t('refundPage.timeframes.noticeText')}
                                            </P>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Refund Process */}
                        <Card>
                            <CardHeader>
                                <CardTitle>{t('refundPage.process.title')}</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <P>
                                    {t('refundPage.process.intro')}
                                </P>

                                <div className="space-y-6">
                                    {refundProcess.map((step, index) => (
                                        <div key={index} className="flex gap-4">
                                            <div className="flex-shrink-0">
                                                <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                                                    {step.step === 1 && <Mail className="w-5 h-5 text-blue-600" />}
                                                    {step.step === 2 && <CreditCard className="w-5 h-5 text-blue-600" />}
                                                    {step.step === 3 && <Calendar className="w-5 h-5 text-blue-600" />}
                                                    {step.step === 4 && <Clock className="w-5 h-5 text-blue-600" />}
                                                </div>
                                            </div>
                                            <div className="flex-1">
                                                <H3 className="mb-2">{step.title}</H3>
                                                <P className="text-sm text-muted-foreground">{step.description}</P>
                                                <P className="text-xs text-muted-foreground">{step.timeframe}</P>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Required Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle>{t('refundPage.requiredInfo.title')}</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <P>
                                    {t('refundPage.requiredInfo.intro')}
                                </P>

                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <H3 className="mb-3">{t('refundPage.requiredInfo.accountInfoTitle')}</H3>
                                        <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                                            <li>{t('refundPage.requiredInfo.accountEmail')}</li>
                                            <li>{t('refundPage.requiredInfo.institutionName')}</li>
                                            <li>{t('refundPage.requiredInfo.planDetails')}</li>
                                            <li>{t('refundPage.requiredInfo.paymentMethod')}</li>
                                        </ul>
                                    </div>
                                    <div>
                                        <H3 className="mb-3">{t('refundPage.requiredInfo.requestDetailsTitle')}</H3>
                                        <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                                            <li>{t('refundPage.requiredInfo.refundReason')}</li>
                                            <li>{t('refundPage.requiredInfo.purchaseDate')}</li>
                                            <li>{t('refundPage.requiredInfo.issueDescription')}</li>
                                            <li>{t('refundPage.requiredInfo.resolutionSteps')}</li>
                                        </ul>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Partial Refunds */}
                        <Card>
                            <CardHeader>
                                <CardTitle>{t('refundPage.partialRefunds.title')}</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <P>
                                    {t('refundPage.partialRefunds.intro')}
                                </P>
                                <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground ml-4">
                                    <li><strong>{t('refundPage.partialRefunds.usagePeriod')}</strong> {t('refundPage.partialRefunds.usagePeriodDesc')}</li>
                                    <li><strong>{t('refundPage.partialRefunds.serviceLevel')}</strong> {t('refundPage.partialRefunds.serviceLevelDesc')}</li>
                                    <li><strong>{t('refundPage.partialRefunds.resolutionTimeline')}</strong> {t('refundPage.partialRefunds.resolutionTimelineDesc')}</li>
                                    <li><strong>{t('refundPage.partialRefunds.downgradeRequests')}</strong> {t('refundPage.partialRefunds.downgradeRequestsDesc')}</li>
                                </ul>
                                <P className="text-sm text-muted-foreground mt-4">
                                    {t('refundPage.partialRefunds.note')}
                                </P>
                            </CardContent>
                        </Card>

                        {/* Non-Refundable Items */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <XCircle className="w-5 h-5 text-red-600" />
                                    {t('refundPage.nonRefundable.title')}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <P>
                                    {t('refundPage.nonRefundable.intro')}
                                </P>
                                <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground ml-4">
                                    <li>{t('refundPage.nonRefundable.setupFees')}</li>
                                    <li>{t('refundPage.nonRefundable.customDev')}</li>
                                    <li>{t('refundPage.nonRefundable.training')}</li>
                                    <li>{t('refundPage.nonRefundable.migration')}</li>
                                    <li>{t('refundPage.nonRefundable.thirdParty')}</li>
                                    <li>{t('refundPage.nonRefundable.cancelled')}</li>
                                </ul>
                                <P className="text-sm text-muted-foreground mt-4">
                                    {t('refundPage.nonRefundable.note')}
                                </P>
                            </CardContent>
                        </Card>

                        {/* Processing Time */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Calendar className="w-5 h-5 text-purple-600" />
                                    {t('refundPage.processingTime.title')}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <P>
                                    {t('refundPage.processingTime.intro')}
                                </P>

                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="border rounded-lg p-4">
                                        <H3 className="mb-2">{t('refundPage.processingTime.cardsTitle')}</H3>
                                        <P className="text-sm text-muted-foreground mb-2">{t('refundPage.processingTime.cardsTime')}</P>
                                        <P className="text-xs text-muted-foreground">{t('refundPage.processingTime.cardsNote')}</P>
                                    </div>
                                    <div className="border rounded-lg p-4">
                                        <H3 className="mb-2">{t('refundPage.processingTime.bankTitle')}</H3>
                                        <P className="text-sm text-muted-foreground mb-2">{t('refundPage.processingTime.bankTime')}</P>
                                        <P className="text-xs text-muted-foreground">{t('refundPage.processingTime.bankNote')}</P>
                                    </div>
                                    <div className="border rounded-lg p-4">
                                        <H3 className="mb-2">{t('refundPage.processingTime.paypalTitle')}</H3>
                                        <P className="text-sm text-muted-foreground mb-2">{t('refundPage.processingTime.paypalTime')}</P>
                                        <P className="text-xs text-muted-foreground">{t('refundPage.processingTime.paypalNote')}</P>
                                    </div>
                                    <div className="border rounded-lg p-4">
                                        <H3 className="mb-2">{t('refundPage.processingTime.walletTitle')}</H3>
                                        <P className="text-sm text-muted-foreground mb-2">{t('refundPage.processingTime.walletTime')}</P>
                                        <P className="text-xs text-muted-foreground">{t('refundPage.processingTime.walletNote')}</P>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Dispute Resolution */}
                        <Card>
                            <CardHeader>
                                <CardTitle>{t('refundPage.dispute.title')}</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <P>
                                    {t('refundPage.dispute.intro')}
                                </P>
                                <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground ml-4">
                                    <li>{t('refundPage.dispute.review')}</li>
                                    <li>{t('refundPage.dispute.documentation')}</li>
                                    <li>{t('refundPage.dispute.escalate')}</li>
                                    <li>{t('refundPage.dispute.legal')}</li>
                                </ul>
                                <P className="text-sm text-muted-foreground mt-4">
                                    {t('refundPage.dispute.note')}
                                </P>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Contact Section */}
            <section className="py-20 bg-gray-50 dark:bg-gray-900/50">
                <div className="container mx-auto px-4">
                    <div
                        ref={contactAnimation.elementRef}
                        className={`max-w-3xl mx-auto text-center transition-all duration-1000 ${contactAnimation.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                            }`}
                    >
                        <H2 className="mb-6">{t('refundPage.contact.title')}</H2>
                        <P className="text-muted-foreground mb-8">
                            {t('refundPage.contact.intro')}
                        </P>

                        <div className="grid md:grid-cols-2 gap-6 mb-8">
                            <div className="flex flex-col items-center p-4 border rounded-lg">
                                <Mail className="w-8 h-8 text-blue-600 mb-2" />
                                <P className="font-medium">{t('refundPage.contact.email')}</P>
                                <P className="text-sm text-muted-foreground">{t('refundPage.contact.emailAddress')}</P>
                                <P className="text-xs text-muted-foreground mt-1">{t('refundPage.contact.emailNote')}</P>
                            </div>
                            <div className="flex flex-col items-center p-4 border rounded-lg">
                                <Clock className="w-8 h-8 text-green-600 mb-2" />
                                <P className="font-medium">{t('refundPage.contact.chat')}</P>
                                <P className="text-sm text-muted-foreground">{t('refundPage.contact.chatNote')}</P>
                                <P className="text-xs text-muted-foreground mt-1">{t('refundPage.contact.chatInstant')}</P>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button size="lg" asChild>
                                <Link href="/contact">{t('refundPage.contact.requestButton')}</Link>
                            </Button>
                            <Button size="lg" variant="outline" asChild>
                                <Link href="/terms">{t('refundPage.contact.termsButton')}</Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
