import { dt, type LanguageMessages } from "@/features/core/i18n/lib";

export default {
    header: {
        navigation: {
            home: 'Home',
            skills: 'Skills',
            projects: 'Projects',
            portfolio: 'Process',
            pricing: 'Engagements',
            about: 'About',
            contact: 'Contact',
        },
        ctaButton: 'Start a project',
        mobileMenuToggle: 'Toggle menu',
    },
    footer: {
        companyInfo: {
            description: dt('Mohamed Magdy (Megz) designs and builds custom web applications that turn messy operations into momentum for growing teams.', {}),
            location: 'Cairo & Remote • Partnering with teams worldwide',
        },
        navigation: {
            workTogether: {
                title: 'Work together',
                contact: 'Book a call',
                pricing: 'Engagement models',
                skills: 'Skills deep dive',
            },
            company: {
                title: 'Explore',
                about: 'About Mohamed',
                projects: 'Projects',
                process: 'Delivery process',
                testimonials: 'Client stories',
            },
            resources: {
                title: 'Resources & legal',
                features: 'Full capability map',
                verifyEmail: 'Verify documents',
                privacy: 'Privacy policy',
                terms: 'Terms of service',
                cookies: 'Cookie policy',
                refund: 'Refund policy',
            },
        },
        newsletter: {
            title: 'Stay in the loop',
            description: 'Occasional build notes, launch breakdowns, and behind-the-scenes updates.',
            placeholder: 'name@company.com',
            subscribeButton: 'Join list',
        },
        copyright: dt('© {year:date} {appName}. All rights reserved.', { date: { year: { year: "numeric" } } }),
    },
} as const satisfies LanguageMessages