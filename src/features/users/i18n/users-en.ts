import { dt, type LanguageMessages } from "@/features/core/i18n/lib";

export default {
    employeeTranslations: {
        sidebarMenuLabel: "Employees",
        columns: {
            id: {
                label: "ID",
            },
            name: {
                label: "Name",
                searchPlaceholder: "Search by name",
                placeholder: "Enter employee name",
            },
            email: {
                label: "Email",
                searchPlaceholder: "Search by email",
                placeholder: "Enter employee email",
            },
            phone: {
                label: "Phone",
                searchPlaceholder: "Search by phone",
                placeholder: "Enter employee phone",
            },
            role: {
                label: "Role",
                searchPlaceholder: "Filter by role",
                placeholder: "Select employee role",
                filterValues: dt("{role:enum}", {
                    enum: {
                        role: {
                            admin: "Admin",
                            employee: "Employee",
                            customer: "Customer",
                        }
                    }
                })
            },
            branch: {
                label: "Branch",
                searchPlaceholder: "Search by branch",
                placeholder: "Enter user branch",
            },
            lastSignInAt: {
                label: "Last Sign In",
                searchPlaceholder: "Filter by last sign in date",
            },
            salary: {
                label: "Salary",
                searchPlaceholder: "Filter by salary",
                placeholder: "Enter user salary",
            },
            createdAt: {
                label: "Created At",
                searchPlaceholder: "Filter by creation date",
            },
        },
        actions: {
            error: dt("Failed to {action:enum} employee. Please try again.", {
                enum: { action: { create: "create", update: "update", delete: "delete" } }
            }),
            success: dt("{length:plural} {action:enum} successfully.", {
                enum: { action: { create: "created", update: "updated", delete: "deleted" } },
                plural: { length: { one: "employee", other: "employees" } }
            }),
        },
        form: {
            validation: {
                nameRequired: "Name is required",
                emailRequired: "Email is required",
                branchRequired: "Branch is required",
            },
            submitButton: {
                create: "Create User",
                update: "Update User",
                loadingCreate: "Creating...",
                loadingUpdate: "Updating...",
            },
        },
    },
} as const satisfies LanguageMessages;
