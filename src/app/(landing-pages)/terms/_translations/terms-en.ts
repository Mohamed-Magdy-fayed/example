import { dt, type LanguageMessages } from "@/features/core/i18n/lib";

export default {
    termsPage: {
        hero: {
            title: "Terms of Service",
            lead: "Please read these terms of service carefully before using our platform.",
            lastUpdated: dt("Last updated: {date:date}", { date: { date: { dateStyle: "long" } } })
        },
        acceptance: {
            title: "Acceptance of Terms",
            p1: "By accessing or using HBS, you agree to be bound by these Terms of Service.",
            p2: "If you do not agree to these terms, please do not use our platform."
        },
        description: {
            title: "Description of Service",
            p1: "HBS provides a comprehensive teaching management system for educational institutions, including:",
            features: {
                courseManagement: "Course and student management",
                attendance: "Attendance tracking",
                grading: "Grading and assessments",
                communication: "Communication tools",
                resources: "Resource sharing"
            }
        },
        accounts: {
            title: "User Accounts",
            p1: "Users must provide accurate information and maintain the security of their accounts.",
            items: {
                noShare: "Do not share your password with others",
                notify: "Notify us immediately of unauthorized use",
                responsibility: "You are responsible for all activities under your account"
            },
            p2: "We reserve the right to suspend or terminate accounts for violations."
        },
        acceptableUse: {
            title: "Acceptable Use",
            p1: "You agree not to use the platform for any unlawful or prohibited activities, including:",
            items: {
                laws: "Violating any laws or regulations",
                ip: "Infringing intellectual property rights",
                malware: "Transmitting harmful code or malware",
                abuse: "Harassing or abusing others"
            },
        },
        intellectualProperty: {
            title: "Intellectual Property",
            p1: "All content and software on HBS are the property of the company or its licensors.",
            p2: "You may not reproduce, distribute, or create derivative works without permission."
        },
        payment: {
            title: "Payment Terms",
            p1: "All fees are due as described in your subscription plan.",
            subscriptionTitle: "Subscription and Billing",
            subscriptionItems: {
                advance: "Fees are billed in advance",
                renewals: "Renewals are automatic unless cancelled",
                taxes: "You are responsible for applicable taxes"
            },
            lateTitle: "Late Payments",
            lateP: "Late payments may result in suspension or termination of service."
        },
        privacy: {
            title: "Privacy and Data",
            p1: "We are committed to protecting your privacy and data.",
            p2: "Please review our Privacy Policy for more information."
        },
        disclaimers: {
            title: "Disclaimers",
            p1: "The platform is provided \"as is\" without warranties of any kind.",
            p2: "We do not guarantee uninterrupted or error-free service.",
            limitationTitle: "Limitation of Liability",
            limitationP: "Our liability is limited to the maximum extent permitted by law."
        },
        termination: {
            title: "Termination",
            p1: "We may terminate or suspend your access for violations of these terms.",
            p2: "You may terminate your account at any time by contacting support.",
            p3: "Upon termination, your right to use the platform ceases immediately."
        },
        governingLaw: {
            title: "Governing Law",
            p1: "These terms are governed by the laws of the jurisdiction in which HBS operates.",
            p2: "Any disputes will be resolved in the courts of that jurisdiction."
        },
        changes: {
            title: "Changes to Terms",
            p1: "We may update these terms from time to time.",
            p2: "Continued use of the platform constitutes acceptance of the new terms."
        },
        contact: {
            title: "Contact Information",
            p1: "If you have any questions about these terms, please contact us:",
            emailLabel: "Email:",
            phoneLabel: "Phone:",
            addressLabel: "Address:"
        },
        questions: {
            title: "Questions?",
            lead: "Our team is here to help. Contact us for any questions about these terms.",
            contactButton: "Contact Us",
            homeButton: "Back to Home"
        }
    }
} as const satisfies LanguageMessages;
