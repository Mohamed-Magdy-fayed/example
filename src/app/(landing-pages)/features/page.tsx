"use client";

import {
    BookOpen,
    CheckCircle,
    Crown,
    FileText,
    HeadphonesIcon,
    ShoppingCart,
    UserCheck,
    Users,
    Users2,
    Video,
} from "lucide-react";
import { LinkButton } from "@/components/general/link-button";
import { Badge } from "@/components/ui/badge";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { H1, H2, H3, Lead, P } from "@/components/ui/typography";
import { useTranslation } from "@/features/core/i18n/useTranslation";
import { useScrollAnimation } from "@/hooks/use-animation";

export default function FeaturesPage() {
    const { t } = useTranslation();

    const features = [
        {
            icon: BookOpen,
            title: t("features.services.contentLibrary.title"),
            description: t("features.services.contentLibrary.description"),
            isFree: true,
            features: [
                t("features.services.contentLibrary.features.digitalResources"),
                t("features.services.contentLibrary.features.mediaManagement"),
                t("features.services.contentLibrary.features.contentOrganization"),
                t("features.services.contentLibrary.features.searchFiltering"),
            ],
        },
        {
            icon: CheckCircle,
            title: t("features.services.learningFlow.title"),
            description: t("features.services.learningFlow.description"),
            isFree: true,
            features: [
                t("features.services.learningFlow.features.courseStructure"),
                t("features.services.learningFlow.features.progressTracking"),
                t("features.services.learningFlow.features.assessments"),
                t("features.services.learningFlow.features.certificates"),
            ],
        },
        {
            icon: Video,
            title: t("features.services.onlineSessions.title"),
            description: t("features.services.onlineSessions.description"),
            isFree: true,
            features: [
                t("features.services.onlineSessions.features.hdVideoStreaming"),
                t("features.services.onlineSessions.features.interactiveWhiteboard"),
                t("features.services.onlineSessions.features.recordingCapabilities"),
                t("features.services.onlineSessions.features.screenSharing"),
            ],
        },
        {
            icon: UserCheck,
            title: t("features.services.hr.title"),
            description: t("features.services.hr.description"),
            isFree: false,
            features: [
                t("features.services.hr.features.staffManagement"),
                t("features.services.hr.features.payrollIntegration"),
                t("features.services.hr.features.performanceTracking"),
                t("features.services.hr.features.attendanceMonitoring"),
            ],
        },
        {
            icon: ShoppingCart,
            title: t("features.services.courseStore.title"),
            description: t("features.services.courseStore.description"),
            isFree: false,
            features: [
                t("features.services.courseStore.features.onlineMarketplace"),
                t("features.services.courseStore.features.paymentProcessing"),
                t("features.services.courseStore.features.coursePackaging"),
                t("features.services.courseStore.features.salesAnalytics"),
            ],
        },
        {
            icon: Users,
            title: t("features.services.crm.title"),
            description: t("features.services.crm.description"),
            isFree: false,
            features: [
                t("features.services.crm.features.leadManagement"),
                t("features.services.crm.features.studentProfiles"),
                t("features.services.crm.features.communicationHistory"),
                t("features.services.crm.features.enrollmentTracking"),
            ],
        },
        {
            icon: FileText,
            title: t("features.services.smartForms.title"),
            description: t("features.services.smartForms.description"),
            isFree: false,
            features: [
                t("features.services.smartForms.features.customForms"),
                t("features.services.smartForms.features.dataCollection"),
                t("features.services.smartForms.features.automatedWorkflows"),
                t("features.services.smartForms.features.integrationCapabilities"),
            ],
        },
        {
            icon: Users2,
            title: t("features.services.community.title"),
            description: t("features.services.community.description"),
            isFree: false,
            features: [
                t("features.services.community.features.discussionForums"),
                t("features.services.community.features.studentGroups"),
                t("features.services.community.features.socialLearning"),
                t("features.services.community.features.peerInteraction"),
            ],
        },
        {
            icon: HeadphonesIcon,
            title: t("features.services.support.title"),
            description: t("features.services.support.description"),
            isFree: false,
            features: [
                t("features.services.support.features.ticketingSystem"),
                t("features.services.support.features.liveChat"),
                t("features.services.support.features.knowledgeBase"),
                t("features.services.support.features.prioritySupport"),
            ],
        },
    ];

    const process = [
        {
            step: "01",
            title: t("features.process.setup.title"),
            description: t("features.process.setup.description"),
        },
        {
            step: "02",
            title: t("features.process.configuration.title"),
            description: t("features.process.configuration.description"),
        },
        {
            step: "03",
            title: t("features.process.training.title"),
            description: t("features.process.training.description"),
        },
        {
            step: "04",
            title: t("features.process.support.title"),
            description: t("features.process.support.description"),
        },
    ];

    const heroAnimation = useScrollAnimation();
    const featuresAnimation = useScrollAnimation();
    const processAnimation = useScrollAnimation();
    const ctaAnimation = useScrollAnimation();

    // Separate free and paid features
    const freeFeatures = features.filter((feature) => feature.isFree);
    const paidFeatures = features.filter((feature) => !feature.isFree);

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="bg-gradient-to-br from-orange-50 to-white py-20 dark:from-stone-900 dark:to-stone-800">
                <div
                    className={`container mx-auto px-4 text-center transition-all duration-1000 ${heroAnimation.isVisible
                            ? "translate-y-0 opacity-100"
                            : "translate-y-10 opacity-0"
                        }`}
                    ref={heroAnimation.elementRef}
                >
                    <H1 className="mx-auto mb-6 max-w-4xl">{t("features.hero.title")}</H1>
                    <Lead className="mx-auto mb-8 max-w-2xl text-muted-foreground">
                        {t("features.hero.description")}
                    </Lead>
                    <div className="flex flex-col justify-center gap-4 sm:flex-row">
                        <LinkButton
                            className="transition-transform duration-300 hover:scale-105"
                            href="/contact"
                            size="lg"
                        >
                            {t("features.hero.primaryButton")}
                        </LinkButton>
                        <LinkButton
                            className="transition-transform duration-300 hover:scale-105"
                            href="/projects"
                            size="lg"
                            variant="outline"
                        >
                            {t("features.hero.secondaryButton")}
                        </LinkButton>
                    </div>
                </div>
            </section>

            {/* Free Features Section */}
            <section className="py-20">
                <div className="container mx-auto px-4">
                    <div
                        className={`mb-16 text-center transition-all duration-1000 ${featuresAnimation.isVisible
                                ? "translate-y-0 opacity-100"
                                : "translate-y-10 opacity-0"
                            }`}
                        ref={featuresAnimation.elementRef}
                    >
                        <H2 className="mb-4">{t("features.freeFeatures.title")}</H2>
                        <P className="mx-auto max-w-2xl text-muted-foreground">
                            {t("features.freeFeatures.description")}
                        </P>
                    </div>

                    <div
                        className={`grid gap-8 transition-all delay-300 duration-1000 md:grid-cols-2 lg:grid-cols-3 ${featuresAnimation.isVisible
                                ? "translate-y-0 opacity-100"
                                : "translate-y-10 opacity-0"
                            }`}
                    >
                        {freeFeatures.map((feature, index) => (
                            <Card
                                className="group h-full border-green-200 transition-all duration-300 hover:-translate-y-2 hover:shadow-lg dark:border-green-800"
                                key={`index-${index.toString()}`}
                            >
                                <CardHeader>
                                    <div className="mb-4 flex items-center justify-between">
                                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100 transition-colors duration-300 group-hover:bg-green-200 dark:bg-green-900/20 dark:group-hover:bg-green-900/30">
                                            <feature.icon className="h-6 w-6 text-green-600 transition-transform duration-300 group-hover:scale-110 dark:text-green-400" />
                                        </div>
                                        <Badge
                                            className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                                            variant="secondary"
                                        >
                                            {t("features.badges.free")}
                                        </Badge>
                                    </div>
                                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                                    <CardDescription>{feature.description}</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <ul className="space-y-2">
                                        {feature.features.map((featureItem, featureIndex) => (
                                            <li
                                                className="flex items-center text-muted-foreground text-sm transition-colors duration-300 group-hover:text-foreground"
                                                key={`feature-${featureIndex.toString()}`}
                                            >
                                                <div className="mr-3 h-1.5 w-1.5 rounded-full bg-green-500 transition-transform duration-300 group-hover:scale-125" />
                                                {featureItem}
                                            </li>
                                        ))}
                                    </ul>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Premium Features Section */}
            <section className="bg-gradient-to-bl from-stone-50 to-stone-100 py-20 dark:from-stone-900 dark:to-stone-950">
                <div className="container mx-auto px-4">
                    <div className="mb-16 text-center">
                        <H2 className="mb-4">{t("features.premiumFeatures.title")}</H2>
                        <P className="mx-auto max-w-2xl text-muted-foreground">
                            {t("features.premiumFeatures.description")}
                        </P>
                    </div>

                    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                        {paidFeatures.map((feature, index) => (
                            <Card
                                className="group h-full border-orange-200 transition-all duration-300 hover:-translate-y-2 hover:shadow-lg dark:border-orange-800"
                                key={`index-${index.toString()}`}
                            >
                                <CardHeader>
                                    <div className="mb-4 flex items-center justify-between">
                                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-orange-100 transition-colors duration-300 group-hover:bg-orange-200 dark:bg-orange-900/20 dark:group-hover:bg-orange-900/30">
                                            <feature.icon className="h-6 w-6 text-orange-600 transition-transform duration-300 group-hover:scale-110 dark:text-orange-400" />
                                        </div>
                                        <Badge
                                            className="bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400"
                                            variant="secondary"
                                        >
                                            <Crown className="mr-1 h-3 w-3" />
                                            {t("features.badges.premium")}
                                        </Badge>
                                    </div>
                                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                                    <CardDescription>{feature.description}</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <ul className="space-y-2">
                                        {feature.features.map((featureItem, featureIndex) => (
                                            <li
                                                className="flex items-center text-muted-foreground text-sm transition-colors duration-300 group-hover:text-foreground"
                                                key={`feature-${featureIndex.toString()}`}
                                            >
                                                <div className="mr-3 h-1.5 w-1.5 rounded-full bg-orange-500 transition-transform duration-300 group-hover:scale-125" />
                                                {featureItem}
                                            </li>
                                        ))}
                                    </ul>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Process Section */}
            <section className="py-20">
                <div className="container mx-auto px-4">
                    <div
                        className={`mb-16 text-center transition-all duration-1000 ${processAnimation.isVisible
                                ? "translate-y-0 opacity-100"
                                : "translate-y-10 opacity-0"
                            }`}
                        ref={processAnimation.elementRef}
                    >
                        <H2 className="mb-4">{t("features.process.title")}</H2>
                        <P className="mx-auto max-w-2xl text-muted-foreground">
                            {t("features.process.description")}
                        </P>
                    </div>

                    <div
                        className={`grid gap-8 transition-all delay-300 duration-1000 md:grid-cols-2 lg:grid-cols-4 ${processAnimation.isVisible
                                ? "translate-y-0 opacity-100"
                                : "translate-y-10 opacity-0"
                            }`}
                    >
                        {process.map((step, index) => (
                            <div
                                className="group text-center"
                                key={`index-${index.toString()}`}
                            >
                                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-orange-100 transition-colors duration-300 group-hover:bg-orange-200 dark:bg-orange-900/20 dark:group-hover:bg-orange-900/30">
                                    <span className="font-bold text-2xl text-orange-600 transition-transform duration-300 group-hover:scale-110 dark:text-orange-400">
                                        {step.step}
                                    </span>
                                </div>
                                <H3 className="mb-4">{step.title}</H3>
                                <P className="text-muted-foreground text-sm">
                                    {step.description}
                                </P>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="bg-gradient-to-br from-orange-50 to-white py-20 dark:from-stone-900 dark:to-stone-800">
                <div className="container mx-auto px-4 text-center">
                    <div
                        className={`mx-auto max-w-3xl transition-all duration-1000 ${ctaAnimation.isVisible
                                ? "translate-y-0 opacity-100"
                                : "translate-y-10 opacity-0"
                            }`}
                        ref={ctaAnimation.elementRef}
                    >
                        <H2 className="mb-6">{t("features.cta.title")}</H2>
                        <P className="mb-8 text-muted-foreground">
                            {t("features.cta.description")}
                        </P>
                        <div className="flex flex-col justify-center gap-4 sm:flex-row">
                            <LinkButton
                                className="transition-transform duration-300 hover:scale-105"
                                href="/contact"
                                size="lg"
                            >
                                {t("features.cta.primaryButton")}
                            </LinkButton>
                            <LinkButton
                                className="transition-transform duration-300 hover:scale-105"
                                href="/demo"
                                size="lg"
                                variant="outline"
                            >
                                {t("features.cta.secondaryButton")}
                            </LinkButton>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
