import { dt, type LanguageMessages } from "@/features/core/i18n/lib";

export default {
    privacyPolicy: {
        hero: {
            title: "Privacy Policy",
            description: "Your privacy is important to us. This policy explains how HBS collects, uses, and protects your personal information.",
            lastUpdated: dt("Last updated: {date:date}", {
                date: { date: { year: 'numeric', month: 'long', day: 'numeric' } }
            })
        },
        introduction: {
            title: "Introduction",
            paragraph1: "HBS (\"we,\" \"our,\" or \"us\") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our Teaching Management System platform and related services.",
            paragraph2: "By using our services, you agree to the collection and use of information in accordance with this policy. We will not use or share your information with anyone except as described in this Privacy Policy."
        },
        informationCollected: {
            title: "Information We Collect",
            personalInfo: {
                title: "Personal Information",
                description: "We may collect the following personal information:",
                item1: "Name, email address, and contact information",
                item2: "Educational institution details",
                item3: "Course enrollment and academic records",
                item4: "Payment and billing information",
                item5: "Profile pictures and biographical information"
            },
            usageInfo: {
                title: "Usage Information",
                description: "We automatically collect certain information when you use our platform:",
                item1: "Log data including IP address, browser type, and operating system",
                item2: "Device information and unique device identifiers",
                item3: "Usage patterns and interaction with our platform features",
                item4: "Cookies and similar tracking technologies"
            }
        },
        howWeUseInfo: {
            title: "How We Use Your Information",
            description: "We use the collected information for the following purposes:",
            item1: "Provide and maintain our Teaching Management System services",
            item2: "Process course enrollments and manage academic records",
            item3: "Facilitate communication between students, instructors, and administrators",
            item4: "Process payments and manage billing",
            item5: "Send important notifications about courses, schedules, and platform updates",
            item6: "Improve our platform functionality and user experience",
            item7: "Ensure platform security and prevent fraud",
            item8: "Comply with legal obligations and institutional requirements"
        },
        infoSharing: {
            title: "Information Sharing and Disclosure",
            description: "We may share your information in the following circumstances:",
            educationalInstitutions: "Educational Institutions: With your affiliated academy or institution for academic purposes",
            serviceProviders: "Service Providers: With trusted third-party service providers who assist in platform operations",
            legalRequirements: "Legal Requirements: When required by law or to protect our rights and safety",
            businessTransfers: "Business Transfers: In connection with mergers, acquisitions, or asset sales",
            consent: "Consent: With your explicit consent for specific purposes",
            note: "We do not sell, trade, or rent your personal information to third parties for marketing purposes."
        },
        dataSecurity: {
            title: "Data Security",
            paragraph1: "We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.",
            paragraph2: "Our security measures include encryption, secure servers, regular security audits, and access controls. However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security."
        },
        yourRights: {
            title: "Your Rights and Choices",
            description: "You have the following rights regarding your personal information:",
            item1: "Access: Request access to your personal information",
            item2: "Correction: Request correction of inaccurate information",
            item3: "Deletion: Request deletion of your personal information (subject to legal requirements)",
            item4: "Portability: Request a copy of your data in a portable format",
            item5: "Opt-out: Unsubscribe from marketing communications",
            note: "To exercise these rights, please contact us using the information provided below."
        },
        cookies: {
            title: "Cookies and Tracking Technologies",
            paragraph1: "We use cookies and similar tracking technologies to enhance your experience on our platform. Cookies help us remember your preferences, analyze usage patterns, and provide personalized content.",
            paragraph2: "You can control cookie settings through your browser preferences. However, disabling cookies may affect the functionality of our platform."
        },
        childrensPrivacy: {
            title: "Children's Privacy",
            paragraph1: "Our services are designed for educational institutions and may be used by students of various ages. We comply with applicable laws regarding the collection and use of information from children under 13.",
            paragraph2: "If you are a parent or guardian and believe your child has provided personal information without consent, please contact us immediately."
        },
        changesToPolicy: {
            title: "Changes to This Privacy Policy",
            paragraph1: "We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the \"Last updated\" date.",
            paragraph2: "We encourage you to review this Privacy Policy periodically for any changes. Your continued use of our services after any modifications constitutes acceptance of the updated policy."
        },
        contact: {
            title: "Contact Us",
            description: "If you have any questions about this Privacy Policy or our data practices, please contact us:",
            email: "Email",
            emailAddress: "privacy@gateling.com",
            phone: "Phone",
            phoneNumber: "+1 (555) 123-4567",
            address: "Address",
            addressDetails: "123 Education St, Learning City",
            button: "Contact Support",
            backToHome: "Back to Home"
        }
    }
} as const satisfies LanguageMessages;
