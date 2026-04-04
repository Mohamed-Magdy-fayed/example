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
import Link from "next/link";
import ContactForm from "@/app/(landing-pages)/contact/_components/contact-form";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { H1, H2, H3, Lead, P } from "@/components/ui/typography";
import { useScrollAnimation } from "@/hooks/use-animation";
import { useTranslation } from "@/features/core/i18n/useTranslation";

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
            title: t('contact.methods.email.title'),
            description: t('contact.methods.email.description'),
            value: 'info@gateling.com',
            action: t('contact.methods.email.action'),
            link: 'mailto:info@gateling.com',
            color: 'bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
        },
        {
            icon: Phone,
            title: t('contact.methods.phone.title'),
            description: t('contact.methods.phone.description'),
            value: '201123862218',
            action: t('contact.methods.phone.action'),
            link: 'tel:+20112386221',
            color: 'bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400'
        },
        {
            icon: MessageSquare,
            title: t('contact.methods.chat.title'),
            description: t('contact.methods.chat.description'),
            value: t('contact.methods.chat.value'),
            action: t('contact.methods.chat.action'),
            link: 'https://wa.me/20112386221',
            color: 'bg-purple-100 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400',
            external: true,
        },
        {
            icon: Calendar,
            title: t('contact.methods.meeting.title'),
            description: t('contact.methods.meeting.description'),
            value: t('contact.methods.meeting.value'),
            action: t('contact.methods.meeting.action'),
            link: '/contact',
            color: 'bg-orange-100 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400'
        }
    ];

    const quickActions = [
        {
            icon: Users,
            title: t('contact.quickActions.demo.title'),
            description: t('contact.quickActions.demo.description'),
            badge: t('contact.quickActions.demo.badge'),
            link: '/projects',
            color: 'border-orange-200 hover:border-orange-300'
        },
        {
            icon: Zap,
            title: t('contact.quickActions.trial.title'),
            description: t('contact.quickActions.trial.description'),
            badge: t('contact.quickActions.trial.badge'),
            link: '/contact',
            color: 'border-green-200 hover:border-green-300'
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
            <section className="py-20 bg-gradient-to-br from-orange-50 to-white dark:from-stone-900 dark:to-stone-800">
                <div
                    ref={heroAnimation.elementRef}
                    className={`container mx-auto px-4 text-center transition-all duration-1000 ${heroAnimation.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                        }`}
                >
                    <Badge variant="secondary" className="mb-4 bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400">
                        {t('contact.hero.badge')}
                    </Badge>
                    <H1 className="mb-6 max-w-4xl mx-auto">
                        {t('contact.hero.title')}
                    </H1>
                    <Lead className="mb-8 max-w-2xl mx-auto text-muted-foreground">
                        {t('contact.hero.description')}
                    </Lead>
                    <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            {t('contact.hero.responseTime')}
                        </div>
                        <div className="flex items-center gap-2">
                            <Globe className="w-4 h-4" />
                            {t('contact.hero.availability')}
                        </div>
                    </div>
                </div>
            </section>

            {/* Contact Methods */}
            <section className="py-20">
                <div className="container mx-auto px-4">
                    <div
                        ref={methodsAnimation.elementRef}
                        className={`text-center mb-16 transition-all duration-1000 ${methodsAnimation.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                            }`}
                    >
                        <H2 className="mb-4">{t('contact.methods.title')}</H2>
                        <P className="text-muted-foreground max-w-2xl mx-auto">
                            {t('contact.methods.description')}
                        </P>
                    </div>

                    <div className={`grid md:grid-cols-2 lg:grid-cols-4 gap-6 transition-all duration-1000 delay-300 ${methodsAnimation.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                        }`}>
                        {contactMethods.map((method, index) => {
                            const isExternal = Boolean(method.external);

                            return (
                                <Card key={index} className="text-center hover:shadow-lg hover:-translate-y-2 transition-all duration-300 group">
                                    <CardHeader>
                                        <div className={`w-16 h-16 rounded-full ${method.color} flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                                            <method.icon className="w-8 h-8" />
                                        </div>
                                        <CardTitle className="text-lg">{method.title}</CardTitle>
                                        <CardDescription>{method.description}</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <P className="font-semibold mb-4">{method.value}</P>
                                        <Button asChild variant="outline" className="w-full group-hover:bg-orange-50 dark:group-hover:bg-orange-900/10 transition-colors duration-300">
                                            <Link
                                                href={method.link}
                                                prefetch={false}
                                                target={isExternal ? '_blank' : undefined}
                                                rel={isExternal ? 'noopener noreferrer' : undefined}
                                            >
                                                {method.action}
                                                <ArrowRight className="w-4 h-4 ms-2 rtl:-scale-x-100 group-hover:ltr:translate-x-1 group-hover:rtl:-translate-x-1 transition-transform duration-300" />
                                            </Link>
                                        </Button>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Contact Form */}
            <section className="py-20 bg-gray-50 dark:bg-gray-900/50">
                <div className="container mx-auto px-4">
                    <div className="grid lg:grid-cols-2 gap-12 items-start">
                        {/* Form */}
                        <div
                            ref={formAnimation.elementRef}
                            className={`transition-all duration-1000 ${formAnimation.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                                }`}
                        >
                            <Card className="shadow-lg">
                                <CardHeader>
                                    <CardTitle className="text-2xl">{t('contact.form.title')}</CardTitle>
                                    <CardDescription>{t('contact.form.description')}</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <ContactForm />
                                </CardContent>
                            </Card>
                        </div>

                        {/* Contact Info & Quick Actions */}
                        <div className={`space-y-8 transition-all duration-1000 delay-300 ${formAnimation.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                            }`}>
                            {/* Contact Information */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>{t('contact.info.title')}</CardTitle>
                                    <CardDescription>{t('contact.info.description')}</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <MapPin className="w-5 h-5 text-orange-500" />
                                        <div>
                                            <P className="font-medium">{t('contact.info.location.title')}</P>
                                            <P className="text-sm text-muted-foreground">{t('contact.info.location.value')}</P>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Clock className="w-5 h-5 text-orange-500" />
                                        <div>
                                            <P className="font-medium">{t('contact.info.hours.title')}</P>
                                            <P className="text-sm text-muted-foreground">{t('contact.info.hours.value')}</P>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Globe className="w-5 h-5 text-orange-500" />
                                        <div>
                                            <P className="font-medium">{t('contact.info.languages.title')}</P>
                                            <P className="text-sm text-muted-foreground">{t('contact.info.languages.value')}</P>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Quick Actions */}
                            <div
                                ref={actionsAnimation.elementRef}
                                className={`transition-all duration-1000 ${actionsAnimation.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                                    }`}
                            >
                                <H3 className="mb-4">{t('contact.quickActions.title')}</H3>
                                <div className="space-y-4">
                                    {quickActions.map((action, index) => (
                                        <Card key={index} className={`hover:shadow-md transition-all duration-300 ${action.color} group`}>
                                            <CardContent className="p-4">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-lg bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                                            <action.icon className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                                                        </div>
                                                        <div>
                                                            <P className="font-medium">{action.title}</P>
                                                            <P className="text-sm text-muted-foreground">{action.description}</P>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Badge variant="secondary">{action.badge}</Badge>
                                                        <Button asChild size="sm" variant="ghost">
                                                            <Link href={action.link}>
                                                                <ArrowRight className="w-4 h-4" />
                                                            </Link>
                                                        </Button>
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
                        ref={faqAnimation.elementRef}
                        className={`text-center mb-16 transition-all duration-1000 ${faqAnimation.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                            }`}
                    >
                        <H2 className="mb-4">{t('contact.faq.title')}</H2>
                        <P className="text-muted-foreground max-w-2xl mx-auto">
                            {t('contact.faq.description')}
                        </P>
                    </div>

                    <div className={`max-w-3xl mx-auto space-y-6 transition-all duration-1000 delay-300 ${faqAnimation.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                        }`}>
                        {([1, 2, 3, 4] as const).map((faqIndex) => (
                            <Card key={faqIndex} className="hover:shadow-md transition-shadow duration-300">
                                <CardHeader>
                                    <CardTitle className="text-lg flex items-center gap-2">
                                        <CheckCircle className="w-5 h-5 text-green-500" />
                                        {t(`contact.faq.questions.q${faqIndex}.question`)}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <P className="text-muted-foreground">{t(`contact.faq.questions.q${faqIndex}.answer`)}</P>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
