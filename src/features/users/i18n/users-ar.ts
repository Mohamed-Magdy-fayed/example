import { dt, type LanguageMessages } from "@/features/core/i18n/lib";

export default {
    employeeTranslations: {
        sidebarMenuLabel: "الموظفين",
        columns: {
            id: {
                label: "كود",
            },
            name: {
                label: "الاسم",
                searchPlaceholder: "البحث بالاسم",
                placeholder: "أدخل اسم الموظف",
            },
            email: {
                label: "البريد الإلكتروني",
                searchPlaceholder: "البحث بالبريد الإلكتروني",
                placeholder: "أدخل بريد الموظف",
            },
            phone: {
                label: "الهاتف",
                searchPlaceholder: "البحث بالهاتف",
                placeholder: "أدخل هاتف الموظف",
            },
            role: {
                label: "الدور",
                searchPlaceholder: "التصفية حسب الدور",
                placeholder: "اختر دور الموظف",
                filterValues: dt("{role:enum}", {
                    enum: {
                        role: {
                            admin: "مدير",
                            employee: "موظف",
                            customer: "عميل",
                        }
                    }
                })
            },
            branch: {
                label: "الفرع",
                searchPlaceholder: "البحث بالفرع",
                placeholder: "أدخل فرع الموظف",
            },
            lastSignInAt: {
                label: "آخر تسجيل دخول",
                searchPlaceholder: "التصفية حسب تاريخ آخر تسجيل دخول",
            },
            salary: {
                label: "الراتب",
                searchPlaceholder: "التصفية حسب الراتب",
                placeholder: "أدخل راتب الموظف",
            },
            createdAt: {
                label: "تاريخ الإنشاء",
                searchPlaceholder: "التصفية حسب تاريخ الإنشاء",
            },
        },
        actions: {
            error: dt("حدث خطأ أثناء {action:enum} الموظف. يرجى المحاولة مرة أخرى.", {
                enum: { action: { create: "إنشاء", update: "تحديث", delete: "حذف" } }
            }),
            success: dt("{action:enum} {length:plural} بنجاح.", {
                enum: { action: { create: "تم إنشاء", update: "تم تحديث", delete: "تم حذف" } },
                plural: { length: { one: "موظف", other: "الموظفين" } }
            }),
        },
        form: {
            validation: {
                nameRequired: "الاسم مطلوب",
                emailRequired: "البريد الإلكتروني مطلوب",
                branchRequired: "الفرع مطلوب",
            },
            submitButton: {
                create: "إنشاء موظف",
                update: "تحديث موظف",
                loadingCreate: "جارٍ الإنشاء...",
                loadingUpdate: "جارٍ التحديث...",
            },
        },
    },
} as const satisfies LanguageMessages;
