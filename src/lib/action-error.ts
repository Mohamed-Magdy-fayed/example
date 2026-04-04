import { DrizzleError } from "drizzle-orm"

export function mapDrizzleError(error: unknown): {
    message: string
    code?: string
} {
    if (error instanceof DrizzleError) {
        return {
            message: "Database operation failed.",
            code: "DB_ERROR",
        }
    }

    // Postgres unique constraint
    if (
        typeof error === "object" &&
        error !== null &&
        "code" in error
    ) {
        const err = error as any

        // PG unique violation
        if (err.code === "23505") {
            return {
                message: "This record already exists.",
                code: "UNIQUE_CONSTRAINT",
            }
        }

        // Foreign key violation
        if (err.code === "23503") {
            return {
                message: "Related record not found.",
                code: "FOREIGN_KEY_CONSTRAINT",
            }
        }
    }

    return {
        message: "Something went wrong.",
        code: "UNKNOWN_ERROR",
    }
}