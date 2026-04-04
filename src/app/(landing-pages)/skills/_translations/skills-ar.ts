import type { LanguageMessages } from "@/features/core/i18n/lib";

export default {
    skills: {
        hero: {
            title: "المهارات التي أقدمها في كل مشروع",
            description:
                "من تخطيط الخدمات إلى نشر الكود في الإنتاج، هذه هي الأدوات المتعددة التخصصات التي أعتمد عليها لبناء منتجات موثوقة متكاملة.",
            primaryButton: "احجز مكالمة",
            secondaryButton: "استعرض المشاريع",
        },
        intro: {
            title: "استراتيجية وتصميم وهندسة في شريك واحد",
            description:
                "كل تعاون يمزج تفكير المنتج بالتنفيذ العميق. استعرض مجالات المهارات الأساسية والأدوات التي أعتمد عليها عندما أقود عمليات البناء للمؤسسين والوكالات والشركات الصغيرة والمتوسطة.",
        },
        categories: {
            sectionTitle: "المكان الذي أندمج فيه مع فريقك",
            sectionDescription:
                "كل تخصص يظل عمليًا من مرحلة الاكتشاف حتى الإطلاق حتى تبقى الاستراتيجية والتنفيذ متوافقين.",
            productStrategy: {
                title: "استراتيجية المنتج والاكتشاف",
                description:
                    "ربط أهداف العمل بنتائج المستخدم عبر ورش منظمة وخطط قابلة للقياس.",
                items: {
                    item1: "رسم رحلات المستخدم ومخططات الخدمات ومواءمة OKR",
                    item2: "أطر تحديد الأولويات لإطلاق MVP والمراحل المتتابعة",
                    item3: "تيسير النقاشات مع أصحاب المصلحة وتوثيق السرد",
                },
            },
            experienceDesign: {
                title: "تصميم التجربة وواجهات الاستخدام",
                description:
                    "تحويل الأفكار الغامضة إلى واجهات مقصودة ومتسقة عبر مختلف الأجهزة.",
                items: {
                    item1: "أنظمة UI عالية الدقة في Figma مع مكتبات مترابطة",
                    item2: "مراجعات سهولة الاستخدام، تدقيقات الوصول، ومواصفات التفاعل",
                    item3: "كتابة الميكروكابي، تدفقات الإعداد، والتوعية داخل المنتج",
                },
            },
            frontendEngineering: {
                title: "هندسة الواجهات الأمامية",
                description:
                    "بناء تطبيقات متجاوبة وآمنة الكتابة مع معماريات مكونات حديثة.",
                items: {
                    item1: "React وNext.js وTanStack والمكونات الخادمية",
                    item2: "تطبيق أنظمة التصميم باستخدام Tailwind CSS وRadix UI",
                    item3: "اختبارات تلقائية باستخدام Vitest وPlaywright وStorybook",
                },
            },
            backendAndInfra: {
                title: "الخلفيات والبنية التحتية",
                description:
                    "إنشاء واجهات برمجة وتكاملات وأتمتة تتوافق مع الأنظمة القائمة لديك.",
                items: {
                    item1: "خدمات Node.js/TypeScript وtRPC وGraphQL وREST",
                    item2: "قواعد بيانات SQL والمستندية وDrizzle ORM وPrisma وSupabase",
                    item3: "النشر المستمر على Vercel وFly.io وحمولات الحاويات",
                },
            },
            opsEnablement: {
                title: "تمكين العمليات",
                description:
                    "كل إطلاق يترافق مع التمكين والقياس ومسارات المسؤولية الواضحة.",
                items: {
                    item1: "تركيب التحليلات ولوحات المتابعة وروتينات التقارير",
                    item2: "أتمتة الاختبار والمراقبة وكتيبات الحوادث",
                    item3: "قواعد المعرفة، وثائق التسليم، والتدريب غير المتزامن",
                },
            },
        },
        toolset: {
            title: "منظومات وأدوات مختارة",
            description:
                "هذه هي المنصات التي ألجأ إليها غالبًا، مع القدرة على التكيّف مع أدواتك الحالية عند الحاجة.",
            groups: {
                interface: {
                    title: "التعاون وتصميم الواجهات",
                    description: "Figma وFigJam وNotion وLinear وJira وLoom وMiro",
                },
                frontend: {
                    title: "حزمة الواجهات الأمامية",
                    description: "TypeScript وReact وNext.js وTailwind CSS وRadix UI وFramer Motion",
                },
                backend: {
                    title: "الخلفيات والأتمتة",
                    description: "Node.js وtRPC وGraphQL وSupabase وPostgreSQL وRedis وBullMQ",
                },
                devops: {
                    title: "العمليات والجودة",
                    description: "Vercel وFly.io وDocker وTurborepo وGitHub Actions وSentry وPlaywright",
                },
            },
        },
        timeline: {
            title: "كيف تظهر هذه المهارات داخل المشروع",
            description:
                "معظم التعاون يمر بأربع مراحل مركزة. أبقى مشاركًا في كل مرحلة حتى لا ينفصل التخطيط عن التنفيذ.",
            steps: {
                discovery: {
                    title: "الاكتشاف وتحديد الإطار",
                    description: "مراجعة بيئة العمل الحالية وتحديد مؤشرات النجاح ورسم مساحة الفرصة.",
                },
                design: {
                    title: "التصميم والنمذجة",
                    description: "إنشاء معمارية النظام والنماذج القابلة للنقر والمستندات الجاهزة للتنفيذ.",
                },
                build: {
                    title: "البناء والتكامل",
                    description: "تطوير الواجهات وواجهات البرمجة والأتمتة مع حلقات تغذية راجعة سريعة.",
                },
                scale: {
                    title: "الإطلاق والتوسع",
                    description: "تركيب التحليلات، تنفيذ جلسات التمكين، والتخطيط للدفعة التالية.",
                },
            },
        },
        cta: {
            title: "هل تحتاج هذه المهارات ضمن خارطة طريقك؟",
            description:
                "دعنا نفكك الإصدار القادم، نحدد المنظومة التي سنعتمد عليها، ونضع خطة تسليم يثق بها فريقك.",
            primaryButton: "احجز مكالمة",
            secondaryButton: "استعرض المشاريع",
        },
    },
} as const satisfies LanguageMessages;
