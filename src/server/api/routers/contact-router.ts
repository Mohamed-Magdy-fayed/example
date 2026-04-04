import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import {
	contactFormSchema,
	MessagesTable,
} from "@/server/db/schemas/customer/messages-table";

export const contactRouter = createTRPCRouter({
	sendMessage: publicProcedure
		.input(contactFormSchema)
		.mutation(async ({ ctx, input }) => {
			try {
				const [message] = await ctx.db
					.insert(MessagesTable)
					.values(input)
					.returning();
				if (!message) return false;

				return true;
			} catch (error) {
				return false;
			}
		}),
});
