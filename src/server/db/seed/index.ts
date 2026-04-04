import { eq, inArray } from "drizzle-orm";
import { db } from "@/server/db";
import { TasksTable, UserCredentialsTable, UsersTable } from "@/server/db/schema";
import { SEED_ACTOR_EMAIL, seedTasks } from "@/server/db/seed/tasks";
import { seedBase } from "@/server/db/seed/base";

async function clearSeededData() {
    try {
        await db.delete(TasksTable).where(eq(TasksTable.createdBy, SEED_ACTOR_EMAIL));
        const seededUsers = await db.select().from(UsersTable).where(eq(UsersTable.createdBy, SEED_ACTOR_EMAIL));
        await db.delete(UsersTable).where(eq(UsersTable.createdBy, SEED_ACTOR_EMAIL));
        await db.delete(UserCredentialsTable).where(inArray(UserCredentialsTable.userId, seededUsers.map(u => u.id)));
    } catch (_) {
        // ignore
    }
}

export async function seedAll() {
    await clearSeededData();
    await seedBase();
    await seedTasks();
}
