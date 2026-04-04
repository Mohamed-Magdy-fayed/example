"use client"

import { PLANS, type BillingCycle, type SubscriptionPlan } from '@/app/(landing-pages)/pricing/data';
// import PlansClient from '@/features/plans/plans-client';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { H1, H2, Lead, P } from '@/components/ui/typography';
import { useScrollAnimation } from '@/hooks/use-animation';
import { useTranslation } from '@/features/core/i18n/useTranslation';
import { cn } from '@/lib/utils';
import { BarChart3, Check, CheckCircle, Crown, Loader2, Shield, Users, XCircleIcon, Zap } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Suspense, useState } from 'react';


export default function PricingPage() {
    const { t } = useTranslation();
    const router = useRouter();

    // State management
    const [billingCycle, setBillingCycle] = useState<BillingCycle>('monthly');
    const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);
    const [showBillingModal, setShowBillingModal] = useState(false);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [paymentIframeUrl, setPaymentIframeUrl] = useState<string | null>(null);

    // Calculate savings for yearly billing
    const calculateSavings = (monthlyPrice: number, yearlyPrice: number) => {
        const monthlyCost = monthlyPrice * 12;
        const savings = monthlyCost - yearlyPrice;
        const percentage = Math.round((savings / monthlyCost) * 100);
        return { savings, percentage };
    };

    // Get plan status for current user
    const getPlanStatus = (planId: SubscriptionPlan) => {
        // if (!currentSubscription) return 'available';
        // if (currentSubscription.plan === planId) return 'current';
        return 'available';
    };

    const heroAnimation = useScrollAnimation();
    const plansAnimation = useScrollAnimation();
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
                        {t('pricing.hero.badge')}
                    </Badge>
                    <H1 className="mb-6 max-w-4xl mx-auto">
                        {t('pricing.hero.title')}
                    </H1>
                    <Lead className="mb-8 max-w-2xl mx-auto text-muted-foreground">
                        {t('pricing.hero.description')}
                    </Lead>

                    {/* Billing Toggle */}
                    <div className="flex items-center justify-center gap-4 mb-8">
                        <Label htmlFor="billing-toggle" className={billingCycle === 'monthly' ? 'font-semibold' : ''}>
                            {t('pricing.billing.monthly')}
                        </Label>
                        <Switch
                            id="billing-toggle"
                            checked={billingCycle === 'yearly'}
                            onCheckedChange={(checked) => setBillingCycle(checked ? 'yearly' : 'monthly')}
                        />
                        <Label htmlFor="billing-toggle" className={billingCycle === 'yearly' ? 'font-semibold' : ''}>
                            {t('pricing.billing.yearly')}
                        </Label>
                    </div>
                    <Badge variant="secondary" className={cn("bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400", billingCycle === 'yearly' ? 'visible' : 'invisible')}>
                        {t('pricing.billing.savePercent', { percent: 17 })}
                    </Badge>
                </div>
            </section>

            {/* Pricing Plans */}
            <section className="py-20">
                <div className="container mx-auto px-4">
                    <div
                        ref={plansAnimation.elementRef}
                        className={`grid md:grid-cols-2 lg:grid-cols-4 gap-8 transition-all duration-1000 ${plansAnimation.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                            }`}
                    >
                        {PLANS?.map((plan, index) => {
                            const price = billingCycle === 'yearly' ? parseFloat(plan.yearlyPrice) : parseFloat(plan.monthlyPrice);
                            const monthlyPrice = parseFloat(plan.monthlyPrice);
                            const yearlyPrice = parseFloat(plan.yearlyPrice);
                            const savings = billingCycle === 'yearly' && monthlyPrice > 0 ?
                                calculateSavings(monthlyPrice, yearlyPrice) : null;
                            const planStatus = getPlanStatus(plan.plan);

                            return (
                                <Card
                                    key={plan.id}
                                    className={`relative hover:shadow-xl hover:-translate-y-2 transition-all duration-300 ${plan.isPopular ? 'border-orange-200 shadow-lg scale-105' : ''
                                        } ${planStatus === 'current' ? 'border-green-200 bg-green-50/50 dark:bg-green-900/10' : ''}`}
                                    style={{ animationDelay: `${index * 100}ms` }}
                                >
                                    {plan.isPopular && (
                                        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                                            <Badge className="bg-orange-500 text-white">
                                                <Crown className="w-3 h-3 mr-1" />
                                                {t('pricing.mostPopular')}
                                            </Badge>
                                        </div>
                                    )}

                                    {planStatus === 'current' && (
                                        <div className="absolute -top-3 right-4">
                                            <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                                                <CheckCircle className="w-3 h-3 mr-1" />
                                                {t('pricing.status.current')}
                                            </Badge>
                                        </div>
                                    )}

                                    <CardHeader className="text-center pb-4">
                                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-orange-100 to-orange-200 dark:from-orange-900/20 dark:to-orange-800/20 flex items-center justify-center mx-auto mb-4">
                                            {plan.plan === 'free' && <Zap className="w-8 h-8 text-orange-600" />}
                                            {plan.plan === 'basic' && <Users className="w-8 h-8 text-orange-600" />}
                                            {plan.plan === 'professional' && <BarChart3 className="w-8 h-8 text-orange-600" />}
                                            {plan.plan === 'enterprise' && <Shield className="w-8 h-8 text-orange-600" />}
                                        </div>
                                        <CardTitle className="text-2xl">{t(`pricing.plans.${plan.plan}.name`)}</CardTitle>
                                        <CardDescription className="text-sm">{t(`pricing.plans.${plan.plan}.description`)}</CardDescription>

                                        <div className="mt-4">
                                            <div className="flex items-baseline justify-center gap-1">
                                                <span className="text-3xl font-bold">
                                                    {price === 0 ? t('pricing.free') : `${price} ${t('pricing.currency')}`}
                                                </span>
                                                {price > 0 && (
                                                    <span className="text-muted-foreground">
                                                        /{billingCycle === 'yearly' ? t('pricing.year') : t('pricing.month')}
                                                    </span>
                                                )}
                                            </div>

                                            {savings && (
                                                <div className="text-sm text-green-600 dark:text-green-400 mt-1">
                                                    {t('pricing.billing.save', { amount: savings.savings, currency: t('pricing.currency') })}
                                                </div>
                                            )}
                                        </div>
                                    </CardHeader>

                                    <CardContent className="space-y-4">
                                        {/* Features List */}
                                        <div className="space-y-2">
                                            {plan.features.map((feature, featureIndex) => (
                                                <div key={featureIndex} className="flex items-center gap-2 text-sm">
                                                    {feature.isEnabled ? <Check className="w-4 h-4 text-green-500 flex-shrink-0" /> : <XCircleIcon className="w-4 h-4 text-red-500 flex-shrink-0" />}
                                                    <span>{t(`pricing.features.${feature.key}`)}</span>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Limits Display */}
                                        <div className="border-t pt-4 space-y-2 text-xs text-muted-foreground">
                                            <div className="flex justify-between">
                                                <span>{t('pricing.limits.students')}</span>
                                                <span>{plan.maxStudents === 999999 ? t('pricing.unlimited') : plan.maxStudents.toLocaleString()}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span>{t('pricing.limits.courses')}</span>
                                                <span>{plan.maxCourses === 999999 ? t('pricing.unlimited') : plan.maxCourses.toLocaleString()}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span>{t('pricing.limits.storage')}</span>
                                                <span>{plan.maxStorageGB === 500 ? t('pricing.unlimited') : `${plan.maxStorageGB} GB`}</span>
                                            </div>
                                        </div>

                                        {/* Action Button */}
                                        <Button
                                            className={`w-full mt-6 ${plan.isPopular ? 'bg-orange-500 hover:bg-orange-600' : ''
                                                }`}
                                            variant={plan.isPopular ? 'default' : 'outline'}
                                            onClick={() => planStatus === 'current' ? null : /*handlePlanSelect(plan.plan)*/ null}
                                            disabled={isProcessing || planStatus === 'current'}
                                        >
                                            {isProcessing && selectedPlan === plan.plan ? (
                                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            ) : null}
                                            {planStatus === 'current'
                                                ? t('pricing.buttons.current')
                                                : plan.plan === 'free'
                                                    ? t('pricing.buttons.getStarted')
                                                    : /* currentSubscription */ false
                                                        ? t('pricing.buttons.changePlan')
                                                        : t('pricing.buttons.subscribe')
                                            }
                                        </Button>

                                        {plan.plan === 'enterprise' && (
                                            <p className="text-xs text-center text-muted-foreground mt-2">
                                                {t('pricing.enterprise.contact')}
                                            </p>
                                        )}
                                    </CardContent>
                                </Card>
                            );
                        })}
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
                        <H2 className="mb-4">{t('pricing.faq.title')}</H2>
                        <P className="text-muted-foreground max-w-2xl mx-auto">
                            {t('pricing.faq.description')}
                        </P>
                    </div>

                    <div className={`max-w-3xl mx-auto space-y-6 transition-all duration-1000 delay-300 ${faqAnimation.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                        }`}>
                        {[1, 2, 3, 4, 5].map((faqIndex) => (
                            <Card key={faqIndex} className="hover:shadow-md transition-shadow duration-300">
                                <CardHeader>
                                    <CardTitle className="text-lg flex items-center gap-2">
                                        <CheckCircle className="w-5 h-5 text-green-500" />
                                        {t(`pricing.faq.questions.q${faqIndex}.question` as any)}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <P className="text-muted-foreground">{t(`pricing.faq.questions.q${faqIndex}.answer` as any)}</P>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            <Suspense>
                {/* <PlansClient /> */}
            </Suspense>
        </div>
    )
}
