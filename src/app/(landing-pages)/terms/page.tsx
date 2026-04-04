'use client';

import { H1, H2, H3, P, Lead } from '@/components/ui/typography';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Scale, AlertTriangle, Shield, Users, CreditCard, Gavel, Calendar } from 'lucide-react';
import Link from 'next/link';
import { useScrollAnimation } from '@/hooks/use-animation';
import { useTranslation } from '@/features/core/i18n/useTranslation';

export default function TermsOfServicePage() {
    const { t } = useTranslation();
    const heroAnimation = useScrollAnimation();
    const contentAnimation = useScrollAnimation();
    const contactAnimation = useScrollAnimation();

    const lastUpdated = new Date("January 1, 2025");

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="py-20 bg-gradient-to-br from-green-50 to-white dark:from-stone-900 dark:to-stone-800">
                <div
                    ref={heroAnimation.elementRef}
                    className={`container mx-auto px-4 text-center transition-all duration-1000 ${heroAnimation.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                        }`}
                >
                    <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center mx-auto mb-6">
                        <FileText className="w-8 h-8 text-green-600 dark:text-green-400" />
                    </div>
                    <H1 className="mb-6 max-w-4xl mx-auto">
                        {t('termsPage.hero.title')}
                    </H1>
                    <Lead className="mb-8 max-w-2xl mx-auto text-muted-foreground">
                        {t('termsPage.hero.lead')}
                    </Lead>
                    <P className="text-sm text-muted-foreground">
                        {t('termsPage.hero.lastUpdated', { date: lastUpdated })}
                    </P>
                </div>
            </section>

            {/* Content Section */}
            <section className="py-20">
                <div className="container mx-auto px-4 max-w-4xl">
                    <div
                        ref={contentAnimation.elementRef}
                        className={`space-y-12 transition-all duration-1000 ${contentAnimation.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                            }`}
                    >
                        {/* Acceptance of Terms */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Scale className="w-5 h-5 text-blue-600" />
                                    {t('termsPage.acceptance.title')}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <P>
                                    {t('termsPage.acceptance.p1')}
                                </P>
                                <P>
                                    {t('termsPage.acceptance.p2')}
                                </P>
                            </CardContent>
                        </Card>

                        {/* Description of Service */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Users className="w-5 h-5 text-orange-600" />
                                    {t('termsPage.description.title')}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <P>
                                    {t('termsPage.description.p1')}
                                </P>
                                <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground ml-4">
                                    <li>{t('termsPage.description.features.courseManagement')}</li>
                                    <li>{t('termsPage.description.features.attendance')}</li>
                                    <li>{t('termsPage.description.features.grading')}</li>
                                    <li>{t('termsPage.description.features.communication')}</li>
                                    <li>{t('termsPage.description.features.resources')}</li>
                                </ul>
                            </CardContent>
                        </Card>

                        {/* User Accounts */}
                        <Card>
                            <CardHeader>
                                <CardTitle>{t('termsPage.accounts.title')}</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <P>
                                    {t('termsPage.accounts.p1')}
                                </P>
                                <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground ml-4">
                                    <li>{t('termsPage.accounts.items.noShare')}</li>
                                    <li>{t('termsPage.accounts.items.notify')}</li>
                                    <li>{t('termsPage.accounts.items.responsibility')}</li>
                                </ul>
                                <P className="mt-4">
                                    {t('termsPage.accounts.p2')}
                                </P>
                            </CardContent>
                        </Card>

                        {/* Acceptable Use */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Shield className="w-5 h-5 text-green-600" />
                                    {t('termsPage.acceptableUse.title')}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <P>{t('termsPage.acceptableUse.p1')}</P>
                                <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground ml-4">
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
                                <CardTitle>{t('termsPage.intellectualProperty.title')}</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <P>
                                    {t('termsPage.intellectualProperty.p1')}
                                </P>
                                <P>
                                    {t('termsPage.intellectualProperty.p2')}
                                </P>
                            </CardContent>
                        </Card>

                        {/* Payment Terms */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <CreditCard className="w-5 h-5 text-purple-600" />
                                    {t('termsPage.payment.title')}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <P>
                                    {t('termsPage.payment.p1')}
                                </P>
                                <div>
                                    <H3 className="mb-3">{t('termsPage.payment.subscriptionTitle')}</H3>
                                    <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground ml-4">
                                        <li>{t("termsPage.payment.subscriptionItems.advance")}</li>
                                        <li>{t("termsPage.payment.subscriptionItems.renewals")}</li>
                                        <li>{t("termsPage.payment.subscriptionItems.taxes")}</li>
                                    </ul>
                                </div>
                                <div>
                                    <H3 className="mb-3">{t('termsPage.payment.lateTitle')}</H3>
                                    <P className="text-sm text-muted-foreground">
                                        {t('termsPage.payment.lateP')}
                                    </P>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Privacy and Data */}
                        <Card>
                            <CardHeader>
                                <CardTitle>{t('termsPage.privacy.title')}</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <P>
                                    {t('termsPage.privacy.p1')}
                                </P>
                                <P>
                                    {t('termsPage.privacy.p2')}
                                </P>
                            </CardContent>
                        </Card>

                        {/* Disclaimers */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <AlertTriangle className="w-5 h-5 text-yellow-600" />
                                    {t('termsPage.disclaimers.title')}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <P>
                                    {t('termsPage.disclaimers.p1')}
                                </P>
                                <P>
                                    {t('termsPage.disclaimers.p2')}
                                </P>
                                <div>
                                    <H3 className="mb-3">{t('termsPage.disclaimers.limitationTitle')}</H3>
                                    <P className="text-sm text-muted-foreground">
                                        {t('termsPage.disclaimers.limitationP')}
                                    </P>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Termination */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Gavel className="w-5 h-5 text-red-600" />
                                    {t('termsPage.termination.title')}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <P>
                                    {t('termsPage.termination.p1')}
                                </P>
                                <P>
                                    {t('termsPage.termination.p2')}
                                </P>
                                <P>
                                    {t('termsPage.termination.p3')}
                                </P>
                            </CardContent>
                        </Card>

                        {/* Governing Law */}
                        <Card>
                            <CardHeader>
                                <CardTitle>{t('termsPage.governingLaw.title')}</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <P>
                                    {t('termsPage.governingLaw.p1')}
                                </P>
                                <P>
                                    {t('termsPage.governingLaw.p2')}
                                </P>
                            </CardContent>
                        </Card>

                        {/* Changes to Terms */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Calendar className="w-5 h-5 text-blue-600" />
                                    {t('termsPage.changes.title')}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <P>
                                    {t('termsPage.changes.p1')}
                                </P>
                                <P>
                                    {t('termsPage.changes.p2')}
                                </P>
                            </CardContent>
                        </Card>

                        {/* Contact Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle>{t('termsPage.contact.title')}</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <P>
                                    {t('termsPage.contact.p1')}
                                </P>
                                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                                    <P className="text-sm">
                                        <strong>{t('termsPage.contact.emailLabel')}</strong> legal@gateling.com<br />
                                        <strong>{t('termsPage.contact.phoneLabel')}</strong> +1 (555) 123-4567<br />
                                        <strong>{t('termsPage.contact.addressLabel')}</strong> 123 Education Street, Learning City, LC 12345
                                    </P>
                                </div>
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
                        <H2 className="mb-6">{t('termsPage.questions.title')}</H2>
                        <P className="text-muted-foreground mb-8">
                            {t('termsPage.questions.lead')}
                        </P>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button size="lg" asChild>
                                <Link href="/contact">{t('termsPage.questions.contactButton')}</Link>
                            </Button>
                            <Button size="lg" variant="outline" asChild>
                                <Link href="/">{t('termsPage.questions.homeButton')}</Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
