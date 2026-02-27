import { dt, type LanguageMessages } from "@/lib/i18n/lib";

export default {
    tasksTranslations: {
        statusValues: dt("{status:enum}", {
            enum: {
                status: {
                    "backlog": "Backlog",
                    "todo": "To Do",
                    "in-progress": "In Progress",
                    "review": "Review",
                    "blocked": "Blocked",
                    "done": "Done",
                }
            }
        }),
        priorityValues: dt("{priority:enum}", {
            enum: {
                priority: {
                    low: "Low",
                    medium: "Medium",
                    high: "High",
                    critical: "Critical",
                },
            },
        }),
        table: {
            summary: dt(
                "Visible tasks estimate {hours:number} total hours · average completion {completion:number}%",
                {
                    number: {
                        hours: { maximumFractionDigits: 0 },
                        completion: { maximumFractionDigits: 0 },
                    },
                },
            ),
            description:
                "All data is fetched on the server with pagination, filters, and sorting.",
        },
        columns: {
            id: "Task",
            title: "Title",
            status: "Status",
            priority: "Priority",
            assignee: "Assignee",
            dueDate: "Due",
            estimatedHours: "Estimate",
            completedPercentage: "Progress",
        },
        filters: {
            title: {
                label: "Search title",
                placeholder: "Search tasks...",
            },
            status: {
                label: "Status",
            },
            priority: {
                label: "Priority",
            },
            assignee: {
                label: "Assignee",
            },
            dueDate: {
                label: "Due date",
            },
            estimatedHours: {
                label: "Estimated hours",
            },
        },
        form: {
            labels: {
                id: "ID",
                title: "Title",
                status: "Status",
                priority: "Priority",
                assignee: "Assignee",
                dueDate: "Due date",
                estimatedHours: "Estimated hours",
                completedPercentage: "Completed %",
                createdBy: "Created by",
            },
            placeholders: {
                id: "T-1001",
                title: "Design onboarding flow",
                status: "Select status",
                priority: "Select priority",
                assignee: "alex",
                createdBy: "you@example.com",
            },
            buttons: {
                creating: "Creating...",
            },
            toast: {
                created: "Task created",
                createFailed: "Failed to create task",
            },
            validation: {
                idRequired: "ID is required",
                titleRequired: "Title is required",
                assigneeRequired: "Assignee is required",
                dueDateRequired: "Due date is required",
                dueDateInvalid: "Invalid date",
                estimatedHoursMin: "Must be 0 or higher",
                createdByRequired: "Created by is required",
            },
        },
    },
} as const satisfies LanguageMessages;
