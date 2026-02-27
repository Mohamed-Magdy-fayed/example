import { eq } from "drizzle-orm";
import { db } from "@/server/db";
import { TasksTable } from "@/server/db/schema";
import { SEED_ACTOR_EMAIL, seedTasks } from "@/server/db/seed/tasks";

async function clearSeededData() {
    try {
        await db.delete(TasksTable).where(eq(TasksTable.createdBy, SEED_ACTOR_EMAIL));
    } catch (_) {
        // ignore
    }
}

export async function seedAll() {
    await clearSeededData();

    await seedTasks();
}
