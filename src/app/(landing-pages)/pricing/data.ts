// Plan configurations with features mapping
export const PLAN_CONFIGS = {
    free: {
        limits: { students: 50, courses: 5, storage: 1 },
        pricing: { monthly: 0, yearly: 0 },
        features: [
            { key: 'contentLibrary', isEnabled: true },
            { key: 'learningFlow', isEnabled: true },
            { key: 'onlineSessions', isEnabled: true },
            { key: 'hr', isEnabled: false },
            { key: 'courseStore', isEnabled: false },
            { key: 'crm', isEnabled: false },
            { key: 'smartForms', isEnabled: false },
            { key: 'community', isEnabled: false },
            { key: 'support', isEnabled: false }
        ]
    },
    basic: {
        limits: { students: 200, courses: 25, storage: 10 },
        pricing: { monthly: 599.99, yearly: 5999.99 },
        features: [
            { key: 'contentLibrary', isEnabled: true },
            { key: 'learningFlow', isEnabled: true },
            { key: 'onlineSessions', isEnabled: true },
            { key: 'hr', isEnabled: true },
            { key: 'courseStore', isEnabled: true },
            { key: 'crm', isEnabled: false },
            { key: 'smartForms', isEnabled: false },
            { key: 'community', isEnabled: false },
            { key: 'support', isEnabled: false }
        ]
    },
    professional: {
        limits: { students: 1000, courses: 100, storage: 50 },
        pricing: { monthly: 1599, yearly: 15999.99 },
        features: [
            { key: 'contentLibrary', isEnabled: true },
            { key: 'learningFlow', isEnabled: true },
            { key: 'onlineSessions', isEnabled: true },
            { key: 'hr', isEnabled: true },
            { key: 'courseStore', isEnabled: true },
            { key: 'crm', isEnabled: true },
            { key: 'smartForms', isEnabled: true },
            { key: 'community', isEnabled: false },
            { key: 'support', isEnabled: false }
        ]
    },
    enterprise: {
        limits: { students: 999999, courses: 999999, storage: 500 },
        pricing: { monthly: 3999, yearly: 39999.99 },
        features: [
            { key: 'contentLibrary', isEnabled: true },
            { key: 'learningFlow', isEnabled: true },
            { key: 'onlineSessions', isEnabled: true },
            { key: 'hr', isEnabled: true },
            { key: 'courseStore', isEnabled: true },
            { key: 'crm', isEnabled: true },
            { key: 'smartForms', isEnabled: true },
            { key: 'community', isEnabled: true },
            { key: 'support', isEnabled: true }
        ]
    }
} as const;

export type SubscriptionPlan = 'free' | 'basic' | 'professional' | 'enterprise';
export type BillingCycle = 'monthly' | 'yearly';

export const PLANS = Object.entries(PLAN_CONFIGS).map(([planKey, config]) => ({
    id: planKey,
    plan: planKey as SubscriptionPlan,
    displayName: planKey.charAt(0).toUpperCase() + planKey.slice(1) + ' Plan',
    monthlyPrice: config.pricing.monthly.toString(),
    yearlyPrice: config.pricing.yearly.toString(),
    currency: 'EGP',
    maxStudents: config.limits.students,
    maxCourses: config.limits.courses,
    maxStorageGB: config.limits.storage,
    features: config.features,
    isPopular: planKey === 'professional',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
})); 
