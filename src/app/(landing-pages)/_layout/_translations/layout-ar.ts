import { dt, type LanguageMessages } from "@/features/core/i18n/lib";

export default {
    header: {
        navigation: {
            home: 'الرئيسية',
            skills: 'المهارات',
            projects: 'المشاريع',
            portfolio: 'طريقة الشغل',
            pricing: 'خطط التعاون',
            about: 'عنّي',
            contact: 'تواصل',
        },
        ctaButton: 'ابدأ مشروع',
        mobileMenuToggle: 'تبديل القائمة',
    },
    footer: {
        companyInfo: {
            description: 'محمد مجدي (ميجز) بيصمم ويب أبس مخصوصة بتشيل التعقيد من العمليات وتدي الفرق أرقام واضحة تتحرك عليها.',
            location: 'القاهرة وريموت • بنشتغل مع شركات حول العالم',
        },
        navigation: {
            workTogether: {
                title: 'ابدأ التعاون',
                contact: 'احجز مكالمة',
                pricing: 'خطط التعاون',
                skills: 'تفاصيل المهارات',
            },
            company: {
                title: 'اكتشف',
                about: 'عنّي',
                projects: 'المشاريع',
                process: 'طريقة التنفيذ',
                testimonials: 'آراء العملاء',
            },
            resources: {
                title: 'الموارد والسياسات',
                features: 'خريطة القدرات',
                verifyEmail: 'تأكيد الهوية',
                privacy: 'سياسة الخصوصية',
                terms: 'شروط الاستخدام',
                cookies: 'سياسة الكوكيز',
                refund: 'سياسة الاسترداد',
            },
        },
        newsletter: {
            title: 'خليك في الصورة',
            description: 'رسائل خفيفة عن المشاريع الجديدة والكواليس.',
            placeholder: 'name@example.com',
            subscribeButton: 'انضم',
        },
        copyright: dt('© {year:date} {appName}. جميع الحقوق محفوظة.', { date: { year: { year: "numeric" } } }),
    },
} as const satisfies LanguageMessages