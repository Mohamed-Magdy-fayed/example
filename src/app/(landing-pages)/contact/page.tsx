"use client";

import type { LucideIcon } from "lucide-react";
import {
    ArrowRight,
    Calendar,
    CheckCircle,
    Clock,
    Globe,
    Mail,
    MapPin,
    MessageSquare,
    Phone,
    Users,
    Zap,
} from "lucide-react";
import ContactForm from "@/app/(landing-pages)/contact/_components/contact-form";
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

export default function ContactPage() {
    const { t } = useTranslation();

    type ContactMethod = {
        icon: LucideIcon;
        title: string;
        description: string;
        value: string;
        action: string;
        link: string;
        color: string;
        external?: boolean;
    };

    const contactMethods: ContactMethod[] = [
        {
            icon: Mail,
            title: t("contact.methods.email.title"),
            description: t("contact.methods.email.description"),
            value: "info@gateling.com",
            action: t("contact.methods.email.action"),
            link: "mailto:info@gateling.com",
            color: "bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400",
        },
        {
            icon: Phone,
            title: t("contact.methods.phone.title"),
            description: t("contact.methods.phone.description"),
            value: "201123862218",
            action: t("contact.methods.phone.action"),
            link: "tel:+20112386221",
            color:
                "bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400",
        },
        {
            icon: MessageSquare,
            title: t("contact.methods.chat.title"),
            description: t("contact.methods.chat.description"),
            value: t("contact.methods.chat.value"),
            action: t("contact.methods.chat.action"),
            link: "https://wa.me/20112386221",
            color:
                "bg-purple-100 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400",
            external: true,
        },
        {
            icon: Calendar,
            title: t("contact.methods.meeting.title"),
            description: t("contact.methods.meeting.description"),
            value: t("contact.methods.meeting.value"),
            action: t("contact.methods.meeting.action"),
            link: "/contact",
            color:
                "bg-orange-100 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400",
        },
    ];

    const quickActions = [
        {
            icon: Users,
            title: t("contact.quickActions.demo.title"),
            description: t("contact.quickActions.demo.description"),
            badge: t("contact.quickActions.demo.badge"),
            link: "/projects",
            color: "border-orange-200 hover:border-orange-300",
        },
        {
            icon: Zap,
            title: t("contact.quickActions.trial.title"),
            description: t("contact.quickActions.trial.description"),
            badge: t("contact.quickActions.trial.badge"),
            link: "/contact",
            color: "border-green-200 hover:border-green-300",
        },
    ];

    const heroAnimation = useScrollAnimation();
    const methodsAnimation = useScrollAnimation();
    const formAnimation = useScrollAnimation();
    const actionsAnimation = useScrollAnimation();
    const faqAnimation = useScrollAnimation();

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
                    <Badge
                        className="mb-4 bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400"
                        variant="secondary"
                    >
                        {t("contact.hero.badge")}
                    </Badge>
                    <H1 className="mx-auto mb-6 max-w-4xl">{t("contact.hero.title")}</H1>
                    <Lead className="mx-auto mb-8 max-w-2xl text-muted-foreground">
                        {t("contact.hero.description")}
                    </Lead>
                    <div className="flex items-center justify-center gap-4 text-muted-foreground text-sm">
                        <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            {t("contact.hero.responseTime")}
                        </div>
                        <div className="flex items-center gap-2">
                            <Globe className="h-4 w-4" />
                            {t("contact.hero.availability")}
                        </div>
                    </div>
                </div>
            </section>

            {/* Contact Methods */}
            <section className="py-20">
                <div className="container mx-auto px-4">
                    <div
                        className={`mb-16 text-center transition-all duration-1000 ${methodsAnimation.isVisible
                                ? "translate-y-0 opacity-100"
                                : "translate-y-10 opacity-0"
                            }`}
                        ref={methodsAnimation.elementRef}
                    >
                        <H2 className="mb-4">{t("contact.methods.title")}</H2>
                        <P className="mx-auto max-w-2xl text-muted-foreground">
                            {t("contact.methods.description")}
                        </P>
                    </div>

                    <div
                        className={`grid gap-6 transition-all delay-300 duration-1000 md:grid-cols-2 lg:grid-cols-4 ${methodsAnimation.isVisible
                                ? "translate-y-0 opacity-100"
                                : "translate-y-10 opacity-0"
                            }`}
                    >
                        {contactMethods.map((method, index) => {
                            const isExternal = Boolean(method.external);

                            return (
                                <Card
                                    className="group text-center transition-all duration-300 hover:-translate-y-2 hover:shadow-lg"
                                    key={index}
                                >
                                    <CardHeader>
                                        <div
                                            className={`h-16 w-16 rounded-full ${method.color} mx-auto mb-4 flex items-center justify-center transition-transform duration-300 group-hover:scale-110`}
                                        >
                                            <method.icon className="h-8 w-8" />
                                        </div>
                                        <CardTitle className="text-lg">{method.title}</CardTitle>
                                        <CardDescription>{method.description}</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <P className="mb-4 font-semibold">{method.value}</P>
                                        <LinkButton
                                            className="w-full transition-colors duration-300 group-hover:bg-orange-50 dark:group-hover:bg-orange-900/10"
                                            href={method.link}
                                            prefetch={false}
                                            rel={isExternal ? "noopener noreferrer" : undefined}
                                            target={isExternal ? "_blank" : undefined}
                                            variant="outline"
                                        >
                                            {method.action}
                                            <ArrowRight className="ms-2 h-4 w-4 transition-transform duration-300 group-hover:ltr:translate-x-1 rtl:-scale-x-100 group-hover:rtl:-translate-x-1" />
                                        </LinkButton>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Contact Form */}
            <section className="bg-gray-50 py-20 dark:bg-gray-900/50">
                <div className="container mx-auto px-4">
                    <div className="grid items-start gap-12 lg:grid-cols-2">
                        {/* Form */}
                        <div
                            className={`transition-all duration-1000 ${formAnimation.isVisible
                                    ? "translate-y-0 opacity-100"
                                    : "translate-y-10 opacity-0"
                                }`}
                            ref={formAnimation.elementRef}
                        >
                            <Card className="shadow-lg">
                                <CardHeader>
                                    <CardTitle className="text-2xl">
                                        {t("contact.form.title")}
                                    </CardTitle>
                                    <CardDescription>
                                        {t("contact.form.description")}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <ContactForm />
                                </CardContent>
                            </Card>
                        </div>

                        {/* Contact Info & Quick Actions */}
                        <div
                            className={`space-y-8 transition-all delay-300 duration-1000 ${formAnimation.isVisible
                                    ? "translate-y-0 opacity-100"
                                    : "translate-y-10 opacity-0"
                                }`}
                        >
                            {/* Contact Information */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>{t("contact.info.title")}</CardTitle>
                                    <CardDescription>
                                        {t("contact.info.description")}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <MapPin className="h-5 w-5 text-orange-500" />
                                        <div>
                                            <P className="font-medium">
                                                {t("contact.info.location.title")}
                                            </P>
                                            <P className="text-muted-foreground text-sm">
                                                {t("contact.info.location.value")}
                                            </P>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Clock className="h-5 w-5 text-orange-500" />
                                        <div>
                                            <P className="font-medium">
                                                {t("contact.info.hours.title")}
                                            </P>
                                            <P className="text-muted-foreground text-sm">
                                                {t("contact.info.hours.value")}
                                            </P>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Globe className="h-5 w-5 text-orange-500" />
                                        <div>
                                            <P className="font-medium">
                                                {t("contact.info.languages.title")}
                                            </P>
                                            <P className="text-muted-foreground text-sm">
                                                {t("contact.info.languages.value")}
                                            </P>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Quick Actions */}
                            <div
                                className={`transition-all duration-1000 ${actionsAnimation.isVisible
                                        ? "translate-y-0 opacity-100"
                                        : "translate-y-10 opacity-0"
                                    }`}
                                ref={actionsAnimation.elementRef}
                            >
                                <H3 className="mb-4">{t("contact.quickActions.title")}</H3>
                                <div className="space-y-4">
                                    {quickActions.map((action, index) => (
                                        <Card
                                            className={`transition-all duration-300 hover:shadow-md ${action.color} group`}
                                            key={index}
                                        >
                                            <CardContent className="p-4">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-3">
                                                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-100 transition-transform duration-300 group-hover:scale-110 dark:bg-orange-900/20">
                                                            <action.icon className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                                                        </div>
                                                        <div>
                                                            <P className="font-medium">{action.title}</P>
                                                            <P className="text-muted-foreground text-sm">
                                                                {action.description}
                                                            </P>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Badge variant="secondary">{action.badge}</Badge>
                                                        <LinkButton
                                                            href={action.link}
                                                            size="sm"
                                                            variant="ghost"
                                                        >
                                                            <ArrowRight className="h-4 w-4" />
                                                        </LinkButton>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-20">
                <div className="container mx-auto px-4">
                    <div
                        className={`mb-16 text-center transition-all duration-1000 ${faqAnimation.isVisible
                                ? "translate-y-0 opacity-100"
                                : "translate-y-10 opacity-0"
                            }`}
                        ref={faqAnimation.elementRef}
                    >
                        <H2 className="mb-4">{t("contact.faq.title")}</H2>
                        <P className="mx-auto max-w-2xl text-muted-foreground">
                            {t("contact.faq.description")}
                        </P>
                    </div>

                    <div
                        className={`mx-auto max-w-3xl space-y-6 transition-all delay-300 duration-1000 ${faqAnimation.isVisible
                                ? "translate-y-0 opacity-100"
                                : "translate-y-10 opacity-0"
                            }`}
                    >
                        {([1, 2, 3, 4] as const).map((faqIndex) => (
                            <Card
                                className="transition-shadow duration-300 hover:shadow-md"
                                key={faqIndex}
                            >
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-lg">
                                        <CheckCircle className="h-5 w-5 text-green-500" />
                                        {t(`contact.faq.questions.q${faqIndex}.question`)}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <P className="text-muted-foreground">
                                        {t(`contact.faq.questions.q${faqIndex}.answer`)}
                                    </P>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
