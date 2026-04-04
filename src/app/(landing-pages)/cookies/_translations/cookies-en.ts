import { dt, type LanguageMessages } from "@/features/core/i18n/lib";

export default {
    cookiePolicy: {
        hero: {
            title: "Cookie Policy",
            description: "Learn how HBS uses cookies and similar technologies to enhance your experience and improve our services.",
            lastUpdated: dt("Last updated: {date:date}", {
                date: { date: { year: 'numeric', month: 'long', day: 'numeric' } }
            })
        },
        whatAreCookies: {
            title: "What Are Cookies?",
            paragraph1: "Cookies are small text files that are stored on your device when you visit our website. They help us provide you with a better experience by remembering your preferences and understanding how you use our Teaching Management System.",
            paragraph2: "We also use similar technologies such as web beacons, pixels, and local storage to collect information about your interactions with our platform."
        },
        howWeUseCookies: {
            title: "How We Use Cookies",
            paragraph1: "We use cookies for several purposes:",
            item1: "Authentication: To keep you logged in and secure your session",
            item2: "Preferences: To remember your language, theme, and dashboard settings",
            item3: "Analytics: To understand how our platform is used and improve functionality",
            item4: "Performance: To optimize loading times and user experience",
            item5: "Security: To protect against fraud and unauthorized access",
            item6: "Communication: To provide relevant notifications and updates"
        },
        typesOfCookies: {
            title: "Types of Cookies We Use",
            essential: {
                type: "Essential Cookies",
                status: "Required",
                purpose: "Required for basic website functionality",
                example1: "Authentication",
                example2: "Security",
                example3: "Form submissions",
                retention: "Session or until logout"
            },
            functional: {
                type: "Functional Cookies",
                status: "Optional",
                purpose: "Remember your preferences and settings",
                example1: "Language preference",
                example2: "Theme selection",
                example3: "Dashboard layout",
                retention: "Up to 1 year"
            },
            analytics: {
                type: "Analytics Cookies",
                status: "Optional",
                purpose: "Help us understand how you use our platform",
                example1: "Page views",
                example2: "User interactions",
                example3: "Performance metrics",
                retention: "Up to 2 years"
            },
            marketing: {
                type: "Marketing Cookies",
                status: "Optional",
                purpose: "Deliver relevant content and advertisements",
                example1: "Ad targeting",
                example2: "Campaign tracking",
                example3: "Social media integration",
                retention: "Up to 1 year"
            }
        },
        thirdPartyCookies: {
            title: "Third-Party Cookies",
            paragraph1: "We may allow trusted third-party services to set cookies on our platform to provide enhanced functionality:",
            analyticsServices: {
                title: "Analytics Services",
                item1: "Google Analytics - Usage statistics",
                item2: "Hotjar - User behavior analysis",
                item3: "Mixpanel - Event tracking"
            },
            supportServices: {
                title: "Support Services",
                item1: "Intercom - Customer support chat",
                item2: "Zendesk - Help desk functionality",
                item3: "Calendly - Appointment scheduling"
            },
            paragraph2: "These third parties have their own privacy policies and cookie practices. We recommend reviewing their policies for more information."
        },
        managingCookies: {
            title: "Managing Your Cookie Preferences",
            platformSettings: {
                title: "Platform Settings",
                paragraph1: "You can manage your cookie preferences through our platform settings. Visit your account preferences to:",
                item1: "Enable or disable optional cookies",
                item2: "View detailed information about each cookie type",
                item3: "Update your preferences at any time"
            },
            browserSettings: {
                title: "Browser Settings",
                paragraph1: "Most browsers allow you to control cookies through their settings:",
                item1: "Block all cookies (may affect functionality)",
                item2: "Block third-party cookies only",
                item3: "Delete existing cookies",
                item4: "Set cookies to expire when you close your browser"
            },
            importantNote: {
                title: "Important Note",
                paragraph1: "Disabling essential cookies may prevent you from using certain features of our platform, including logging in and accessing your courses."
            }
        },
        cookieConsent: {
            title: "Cookie Consent",
            paragraph1: "When you first visit our platform, we'll ask for your consent to use optional cookies. You can:",
            item1: "Accept all cookies for the full experience",
            item2: "Customize your preferences by cookie type",
            item3: "Reject optional cookies (essential cookies will still be used)",
            item4: "Change your mind at any time through your account settings"
        },
        changesToPolicy: {
            title: "Changes to This Cookie Policy",
            paragraph1: "We may update this Cookie Policy from time to time. We will notify you of any changes by posting the new Cookie Policy on this page and updating the \"Last updated\" date.",
            paragraph2: "We encourage you to review this Cookie Policy periodically for any changes. Your continued use of our services after any modifications constitutes acceptance of the updated policy."
        },
        contact: {
            title: "Contact Us",
            description: "If you have any questions about this Cookie Policy or our cookie practices, please contact us:",
            email: "Email",
            emailAddress: "cookies@gateling.com",
            phone: "Phone",
            phoneNumber: "+1 (555) 987-6543",
            address: "Address",
            addressDetails: "456 Cookie Lane, Web City",
            button: "Contact Support",
            backToHome: "Back to Home"
        }
    }
} as const satisfies LanguageMessages;
