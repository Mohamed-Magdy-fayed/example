import { dt, type LanguageMessages } from "@/lib/i18n/lib";

export default {
    tasksTranslations: {
        statusValues: dt("{status:enum}", {
            enum: {
                status: {
                    "backlog": "المهام المؤجلة",
                    "todo": "للقيام",
                    "in-progress": "قيد التنفيذ",
                    "review": "مراجعة",
                    "blocked": "محظور",
                    "done": "تم الانتهاء",
                }
            }
        }),
        priorityValues: dt("{priority:enum}", {
            enum: {
                priority: {
                    low: "منخفضة",
                    medium: "متوسطة",
                    high: "عالية",
                    critical: "حرجة",
                },
            },
        }),
        table: {
            summary: dt(
                "تقدير المهام المعروضة {hours:number} ساعة إجمالاً · متوسط الإنجاز {completion:number}%",
                {
                    number: {
                        hours: { maximumFractionDigits: 0 },
                        completion: { maximumFractionDigits: 0 },
                    },
                },
            ),
            description:
                "يتم جلب جميع البيانات من الخادم مع الترقيم والتصفية والفرز.",
        },
        columns: {
            id: "المهمة",
            title: "العنوان",
            status: "الحالة",
            priority: "الأولوية",
            assignee: "المسؤول",
            dueDate: "الاستحقاق",
            estimatedHours: "التقدير",
            completedPercentage: "التقدم",
        },
        filters: {
            title: {
                label: "البحث في العنوان",
                placeholder: "ابحث في المهام...",
            },
            status: {
                label: "الحالة",
            },
            priority: {
                label: "الأولوية",
            },
            assignee: {
                label: "المسؤول",
            },
            dueDate: {
                label: "تاريخ الاستحقاق",
            },
            estimatedHours: {
                label: "الساعات المقدّرة",
            },
        },
        form: {
            labels: {
                id: "المعرف",
                title: "العنوان",
                status: "الحالة",
                priority: "الأولوية",
                assignee: "المسؤول",
                dueDate: "تاريخ الاستحقاق",
                estimatedHours: "الساعات المقدّرة",
                completedPercentage: "نسبة الإنجاز %",
                createdBy: "تم الإنشاء بواسطة",
            },
            placeholders: {
                id: "T-1001",
                title: "تصميم مسار الإعداد",
                status: "اختر الحالة",
                priority: "اختر الأولوية",
                assignee: "alex",
                createdBy: "you@example.com",
            },
            buttons: {
                creating: "جارٍ الإنشاء...",
            },
            toast: {
                created: "تم إنشاء المهمة",
                createFailed: "فشل إنشاء المهمة",
            },
            validation: {
                idRequired: "المعرف مطلوب",
                titleRequired: "العنوان مطلوب",
                assigneeRequired: "المسؤول مطلوب",
                dueDateRequired: "تاريخ الاستحقاق مطلوب",
                dueDateInvalid: "تاريخ غير صالح",
                estimatedHoursMin: "يجب أن تكون 0 أو أكثر",
                createdByRequired: "حقل (تم الإنشاء بواسطة) مطلوب",
            },
        },
    },
} as const satisfies LanguageMessages;
