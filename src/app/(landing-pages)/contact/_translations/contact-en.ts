import type { LanguageMessages } from "@/features/core/i18n/lib";

export default {
    contact: {
        hero: {
            badge: "Let’s collaborate",
            title: "Tell me about the system your team needs",
            description:
                "Whether you’re shaping a new platform or evolving something that already exists, I’ll help you map the path to measurable outcomes.",
            responseTime: "Average response time: under 24 hours",
            availability: "Available Sunday – Thursday, 10 AM – 6 PM (GMT+2)",
        },
        methods: {
            title: "Choose how you’d like to start the conversation",
            description:
                "Pick the channel that fits your workflow and I’ll meet you there.",
            email: {
                title: "Email the brief",
                description:
                    "Send context, decks, or recordings and I’ll reply with a tailored next step.",
                action: "Send email",
            },
            phone: {
                title: "Book a quick call",
                description:
                    "Hop on a 15-minute alignment call to outline goals and constraints.",
                action: "Call now",
            },
            chat: {
                title: "WhatsApp updates",
                description: "Drop me a note or voice message when async works best.",
                value: "Replies within a few hours",
                action: "Open WhatsApp",
            },
            meeting: {
                title: "Schedule a strategy session",
                description: "Reserve a 30-minute session to co-design the roadmap.",
                value: "Choose a slot that suits you",
                action: "Book a slot",
            },
        },
        form: {
            title: "Send over the details",
            description:
                "Fill out the form and I’ll reply with the next step within one business day.",
            fields: {
                name: {
                    label: "Full name",
                    placeholder: "Enter your full name",
                    error: {
                        required: "Name is required",
                    },
                },
                email: {
                    label: "Work email",
                    placeholder: "Enter your email address",
                    error: {
                        invalid: "Please enter a valid email address",
                    },
                },
                company: {
                    label: "Company or team (optional)",
                    placeholder: "Who am I collaborating with?",
                },
                phone: {
                    label: "Phone or WhatsApp (optional)",
                    placeholder: "Include country code if possible",
                },
                reason: {
                    label: "How can I help?",
                    placeholder: "Select a focus area",
                    options: {
                        demo: "Explore collaboration",
                        pricing: "Discuss engagement models",
                        support: "Support for an active build",
                        partnership: "Partnership or advisory",
                        other: "Something else",
                    },
                },
                subject: {
                    label: "Subject",
                    placeholder: "Give the conversation a headline",
                    error: {
                        required: "Subject is required",
                    },
                },
                message: {
                    label: "Project context",
                    placeholder: "Share goals, challenges, or helpful links…",
                    error: {
                        required: "A little context helps me prepare",
                    },
                },
            },
            success:
                "Thanks for reaching out—expect a reply within one business day.",
            error:
                "Something went wrong while sending your message. Please try again in a moment.",
            submit: "Send message",
        },
        info: {
            title: "Direct contact details",
            description: "Prefer a quick reference? Here’s how to reach me.",
            location: {
                title: "Working with teams in",
                value: "Remote-first • Serving clients across MENA & Europe",
            },
            hours: {
                title: "Availability",
                value: "Sun – Thu: 10 AM – 6 PM (GMT+2)",
            },
            languages: {
                title: "Languages",
                value: "English, Arabic",
            },
        },
        quickActions: {
            title: "Quick links",
            demo: {
                title: "Explore recent projects",
                description:
                    "See how other founders and operators scaled their systems.",
                badge: "Case studies",
            },
            trial: {
                title: "Send your project brief",
                description:
                    "Share context and receive a tailored plan within 24 hours.",
                badge: "24h response",
            },
        },
        faq: {
            title: "Frequently asked questions",
            description:
                "A few clarifications that usually help before we hop on a call.",
            questions: {
                q1: {
                    question: "How soon will I hear back?",
                    answer:
                        "I reply to every message within 24 hours (often much faster). If it’s more urgent, send a WhatsApp note and I’ll respond as soon as I step out of the current session.",
                },
                q2: {
                    question: "Can we start with a workshop instead of a call?",
                    answer:
                        "Yes. Use the “Schedule a strategy session” option to book a 30-minute slot—we’ll use it to unpack the problem and outline the first delivery sprint.",
                },
                q3: {
                    question: "Do you partner with in-house engineering teams?",
                    answer:
                        "Absolutely. Most of my work plugs into existing teams—either as a system designer, an engineering lead, or a fractional product partner.",
                },
                q4: {
                    question: "What should I include in my brief?",
                    answer:
                        "Share the core objectives, the friction you’re feeling today, any metrics that matter, and links to existing tools or documentation. Bullet points are perfect.",
                },
            },
        },
    },
} as const satisfies LanguageMessages;
