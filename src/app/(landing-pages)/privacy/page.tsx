'use client';

import { H1, H2, H3, P, Lead } from '@/components/ui/typography';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shield, Mail, Phone, MapPin, Calendar, Lock, Eye, Database, Users } from 'lucide-react';
import Link from 'next/link';
import { useScrollAnimation } from '@/hooks/use-animation';
import { useTranslation } from '@/features/core/i18n/useTranslation';

export default function PrivacyPolicyPage() {
    const { t } = useTranslation();

    const heroAnimation = useScrollAnimation();
    const contentAnimation = useScrollAnimation();
    const contactAnimation = useScrollAnimation();

    const lastUpdatedDate = new Date('2025-01-01');

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="py-20 bg-gradient-to-br from-blue-50 to-white dark:from-stone-900 dark:to-stone-800">
                <div
                    ref={heroAnimation.elementRef}
                    className={`container mx-auto px-4 text-center transition-all duration-1000 ${heroAnimation.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                        }`}
                >
                    <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center mx-auto mb-6">
                        <Shield className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                    </div>
                    <H1 className="mb-6 max-w-4xl mx-auto">
                        {t('privacyPolicy.hero.title')}
                    </H1>
                    <Lead className="mb-8 max-w-2xl mx-auto text-muted-foreground">
                        {t('privacyPolicy.hero.description')}
                    </Lead>
                    <P className="text-sm text-muted-foreground">
                        {t('privacyPolicy.hero.lastUpdated', { date: lastUpdatedDate })}
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
                        {/* Introduction */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Eye className="w-5 h-5 text-blue-600" />
                                    {t('privacyPolicy.introduction.title')}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <P>
                                    {t('privacyPolicy.introduction.paragraph1')}
                                </P>
                                <P>
                                    {t('privacyPolicy.introduction.paragraph2')}
                                </P>
                            </CardContent>
                        </Card>

                        {/* Information We Collect */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Database className="w-5 h-5 text-green-600" />
                                    {t('privacyPolicy.informationCollected.title')}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div>
                                    <H3 className="mb-3">{t('privacyPolicy.informationCollected.personalInfo.title')}</H3>
                                    <P className="mb-3">{t('privacyPolicy.informationCollected.personalInfo.description')}</P>
                                    <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground ml-4">
                                        <li>{t('privacyPolicy.informationCollected.personalInfo.item1')}</li>
                                        <li>{t('privacyPolicy.informationCollected.personalInfo.item2')}</li>
                                        <li>{t('privacyPolicy.informationCollected.personalInfo.item3')}</li>
                                        <li>{t('privacyPolicy.informationCollected.personalInfo.item4')}</li>
                                        <li>{t('privacyPolicy.informationCollected.personalInfo.item5')}</li>
                                    </ul>
                                </div>

                                <div>
                                    <H3 className="mb-3">{t('privacyPolicy.informationCollected.usageInfo.title')}</H3>
                                    <P className="mb-3">{t('privacyPolicy.informationCollected.usageInfo.description')}</P>
                                    <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground ml-4">
                                        <li>{t('privacyPolicy.informationCollected.usageInfo.item1')}</li>
                                        <li>{t('privacyPolicy.informationCollected.usageInfo.item2')}</li>
                                        <li>{t('privacyPolicy.informationCollected.usageInfo.item3')}</li>
                                        <li>{t('privacyPolicy.informationCollected.usageInfo.item4')}</li>
                                    </ul>
                                </div>
                            </CardContent>
                        </Card>

                        {/* How We Use Your Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Users className="w-5 h-5 text-orange-600" />
                                    {t('privacyPolicy.howWeUseInfo.title')}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <P>{t('privacyPolicy.howWeUseInfo.description')}</P>
                                <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground ml-4">
                                    <li>{t('privacyPolicy.howWeUseInfo.item1')}</li>
                                    <li>{t('privacyPolicy.howWeUseInfo.item2')}</li>
                                    <li>{t('privacyPolicy.howWeUseInfo.item3')}</li>
                                    <li>{t('privacyPolicy.howWeUseInfo.item4')}</li>
                                    <li>{t('privacyPolicy.howWeUseInfo.item5')}</li>
                                    <li>{t('privacyPolicy.howWeUseInfo.item6')}</li>
                                    <li>{t('privacyPolicy.howWeUseInfo.item7')}</li>
                                    <li>{t('privacyPolicy.howWeUseInfo.item8')}</li>
                                </ul>
                            </CardContent>
                        </Card>

                        {/* Information Sharing */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Lock className="w-5 h-5 text-red-600" />
                                    {t('privacyPolicy.infoSharing.title')}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <P>{t('privacyPolicy.infoSharing.description')}</P>
                                <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground ml-4">
                                    <li>{t('privacyPolicy.infoSharing.educationalInstitutions')}</li>
                                    <li>{t('privacyPolicy.infoSharing.serviceProviders')}</li>
                                    <li>{t('privacyPolicy.infoSharing.legalRequirements')}</li>
                                    <li>{t('privacyPolicy.infoSharing.businessTransfers')}</li>
                                    <li>{t('privacyPolicy.infoSharing.consent')}</li>
                                </ul>
                                <P className="mt-4">
                                    {t('privacyPolicy.infoSharing.note')}
                                </P>
                            </CardContent>
                        </Card>

                        {/* Data Security */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Shield className="w-5 h-5 text-purple-600" />
                                    {t('privacyPolicy.dataSecurity.title')}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <P>
                                    {t('privacyPolicy.dataSecurity.paragraph1')}
                                </P>
                                <P>
                                    {t('privacyPolicy.dataSecurity.paragraph2')}
                                </P>
                            </CardContent>
                        </Card>

                        {/* Your Rights */}
                        <Card>
                            <CardHeader>
                                <CardTitle>{t('privacyPolicy.yourRights.title')}</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <P>{t('privacyPolicy.yourRights.description')}</P>
                                <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground ml-4">
                                    <li>{t('privacyPolicy.yourRights.item1')}</li>
                                    <li>{t('privacyPolicy.yourRights.item2')}</li>
                                    <li>{t('privacyPolicy.yourRights.item3')}</li>
                                    <li>{t('privacyPolicy.yourRights.item4')}</li>
                                    <li>{t('privacyPolicy.yourRights.item5')}</li>
                                </ul>
                                <P className="mt-4">
                                    {t('privacyPolicy.yourRights.note')}
                                </P>
                            </CardContent>
                        </Card>

                        {/* Cookies */}
                        <Card>
                            <CardHeader>
                                <CardTitle>{t('privacyPolicy.cookies.title')}</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <P>
                                    {t('privacyPolicy.cookies.paragraph1')}
                                </P>
                                <P>
                                    {t('privacyPolicy.cookies.paragraph2')}
                                </P>
                            </CardContent>
                        </Card>

                        {/* Children's Privacy */}
                        <Card>
                            <CardHeader>
                                <CardTitle>{t('privacyPolicy.childrensPrivacy.title')}</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <P>
                                    {t('privacyPolicy.childrensPrivacy.paragraph1')}
                                </P>
                                <P>
                                    {t('privacyPolicy.childrensPrivacy.paragraph2')}
                                </P>
                            </CardContent>
                        </Card>

                        {/* Changes to Policy */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Calendar className="w-5 h-5 text-blue-600" />
                                    {t('privacyPolicy.changesToPolicy.title')}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <P>
                                    {t('privacyPolicy.changesToPolicy.paragraph1')}
                                </P>
                                <P>
                                    {t('privacyPolicy.changesToPolicy.paragraph2')}
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
                        <H2 className="mb-6">{t('privacyPolicy.contact.title')}</H2>
                        <P className="text-muted-foreground mb-8">
                            {t('privacyPolicy.contact.description')}
                        </P>

                        <div className="grid md:grid-cols-3 gap-6 mb-8">
                            <div className="flex flex-col items-center">
                                <Mail className="w-8 h-8 text-blue-600 mb-2" />
                                <P className="font-medium">{t('privacyPolicy.contact.email')}</P>
                                <P className="text-sm text-muted-foreground">{t('privacyPolicy.contact.emailAddress')}</P>
                            </div>
                            <div className="flex flex-col items-center">
                                <Phone className="w-8 h-8 text-green-600 mb-2" />
                                <P className="font-medium">{t('privacyPolicy.contact.phone')}</P>
                                <P className="text-sm text-muted-foreground">{t('privacyPolicy.contact.phoneNumber')}</P>
                            </div>
                            <div className="flex flex-col items-center">
                                <MapPin className="w-8 h-8 text-red-600 mb-2" />
                                <P className="font-medium">{t('privacyPolicy.contact.address')}</P>
                                <P className="text-sm text-muted-foreground">{t('privacyPolicy.contact.addressDetails')}</P>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button size="lg" asChild>
                                <Link href="/contact">{t('privacyPolicy.contact.button')}</Link>
                            </Button>
                            <Button size="lg" variant="outline" asChild>
                                <Link href="/">{t('privacyPolicy.contact.backToHome')}</Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
