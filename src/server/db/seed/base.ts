import { hashPassword } from "@/features/core/auth/core";
import { db } from "@/server/db";
import { BranchesTable, BranchMembershipsTable, UserCredentialsTable, UsersTable } from "@/server/db/schema";
import { SEED_ACTOR_EMAIL } from "@/server/db/seed/tasks";

export async function seedBase() {
    const { adminUser, adminCredential, basicBranches, branchAssignments } = await db.transaction(async (tx) => {
        const adminUser = await tx.insert(UsersTable).values({
            createdBy: SEED_ACTOR_EMAIL,
            email: "root@mail.com",
            emailVerifiedAt: new Date(),
            phone: "20123456789",
            phoneVerifiedAt: new Date(),
            imageUrl: "https://github.com/shadcn.png",
            name: "Root Admin",
            role: "admin",
        }).returning().then(data => data[0]);
        if (!adminUser) throw new Error("Failed to create admin user");

        const passwordHash = await hashPassword("Make.1234", adminUser.id);

        const adminCredential = await tx.insert(UserCredentialsTable).values({
            userId: adminUser.id,
            passwordHash,
            passwordSalt: adminUser.id,
        }).returning().then(data => data[0]);

        const basicBranches = await tx.insert(BranchesTable).values(branchesData).returning();

        const branchAssignments = await tx.insert(BranchMembershipsTable)
            .values(basicBranches.map(branch => ({
                userId: adminUser.id,
                branchId: branch.id,
            })))

        return {
            adminUser,
            adminCredential,
            basicBranches,
            branchAssignments,
        }
    })
}

const branchesData: typeof BranchesTable.$inferInsert[] = [
    { nameAr: "القاهرة", nameEn: "Cairo" },
    { nameAr: "الإسكندرية", nameEn: "Alexandria" },
    { nameAr: "الجيزة", nameEn: "Giza" },
    { nameAr: "طنطا", nameEn: "Tanta" },
    { nameAr: "المنصورة", nameEn: "Mansoura" },
    { nameAr: "أسيوط", nameEn: "Assiut" },
]
