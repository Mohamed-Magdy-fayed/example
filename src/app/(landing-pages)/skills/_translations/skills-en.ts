import type { LanguageMessages } from "@/features/core/i18n/lib";

export default {
    skills: {
        hero: {
            title: "Skills I bring to every build",
            description:
                "From mapping service blueprints to deploying production code, here is the cross-disciplinary toolkit I use to ship reliable products end to end.",
            primaryButton: "Book a call",
            secondaryButton: "Browse projects",
        },
        intro: {
            title: "Strategy, design, and engineering in one partner",
            description:
                "Each engagement blends product thinking with deep implementation. Explore the core skill areas and the tools I rely on when leading builds for founders, agencies, and SME teams.",
        },
        categories: {
            sectionTitle: "Where I plug into your team",
            sectionDescription:
                "Each discipline stays hands-on from discovery through launch so strategy and execution stay linked.",
            productStrategy: {
                title: "Product strategy & discovery",
                description:
                    "Connect business goals to user outcomes with structured workshops and measurable roadmaps.",
                items: {
                    item1: "Journey mapping, service blueprints, and OKR alignment",
                    item2: "Prioritization frameworks for MVPs and iterative phases",
                    item3: "Stakeholder facilitation and narrative documentation",
                },
            },
            experienceDesign: {
                title: "Experience & interface design",
                description:
                    "Translate ambiguous ideas into interfaces that feel intentional across breakpoints.",
                items: {
                    item1: "High-fidelity UI systems in Figma with tokenized libraries",
                    item2: "Usability reviews, accessibility audits, and interaction specs",
                    item3: "Microcopy, onboarding flows, and in-product education",
                },
            },
            frontendEngineering: {
                title: "Frontend engineering",
                description:
                    "Build responsive, type-safe applications with modern component architectures.",
                items: {
                    item1: "React, Next.js, TanStack, and server components",
                    item2: "Design-system implementation with Tailwind CSS and Radix UI",
                    item3: "Automated testing with Vitest, Playwright, and Storybook",
                },
            },
            backendAndInfra: {
                title: "Backend & infrastructure",
                description:
                    "Ship APIs, automations, and data pipelines that integrate with existing stacks.",
                items: {
                    item1: "Node.js/TypeScript services, tRPC, GraphQL, and REST",
                    item2: "SQL & document databases, Drizzle ORM, Prisma, and Supabase",
                    item3: "CI/CD on Vercel, Fly.io, and containerized workloads",
                },
            },
            opsEnablement: {
                title: "Operations enablement",
                description:
                    "Ensure every release comes with enablement, measurement, and ownership paths.",
                items: {
                    item1: "Analytics instrumentation, dashboards, and reporting routines",
                    item2: "QA automation, monitoring, and incident playbooks",
                    item3: "Knowledge bases, handover docs, and async training",
                },
            },
        },
        toolset: {
            title: "Selected tools & ecosystems",
            description:
                "These are the platforms I reach for most often. I adapt to your existing toolchain when it makes sense.",
            groups: {
                interface: {
                    title: "Interface & collaboration",
                    description: "Figma, FigJam, Notion, Linear, Jira, Loom, Miro",
                },
                frontend: {
                    title: "Frontend stack",
                    description: "TypeScript, React, Next.js, Tailwind CSS, Radix UI, Framer Motion",
                },
                backend: {
                    title: "Backend & automation",
                    description: "Node.js, tRPC, GraphQL, Supabase, PostgreSQL, Redis, BullMQ",
                },
                devops: {
                    title: "DevOps & quality",
                    description: "Vercel, Fly.io, Docker, Turborepo, GitHub Actions, Sentry, Playwright",
                },
            },
        },
        timeline: {
            title: "How these skills show up in a project",
            description:
                "Most collaborations move through four focused phases. I stay hands-on across each stage so strategy and execution never drift apart.",
            steps: {
                discovery: {
                    title: "Discovery & framing",
                    description: "Audit current workflows, define success metrics, and map the opportunity space.",
                },
                design: {
                    title: "Design & prototyping",
                    description: "Create system architecture, clickable prototypes, and implementation-ready specs.",
                },
                build: {
                    title: "Build & integrate",
                    description: "Develop frontends, APIs, and automations with tight feedback loops.",
                },
                scale: {
                    title: "Launch & scale",
                    description: "Instrument analytics, run enablement sessions, and plan the next iteration.",
                },
            },
        },
        cta: {
            title: "Need these skills plugged into your roadmap?",
            description:
                "Let’s unpack your next release, define the stack we’ll lean on, and set a delivery plan your team trusts.",
            primaryButton: "Book a call",
            secondaryButton: "Browse projects",
        },
    },
} as const satisfies LanguageMessages;
