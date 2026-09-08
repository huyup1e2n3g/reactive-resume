import z from "zod";

const roleTargetSchema = z.object({
	seniority: z.string().trim().min(1).max(120),
	location: z.string().trim().min(1).max(200),
	specialization: z.string().trim().min(1).max(200),
});

const supportedTargetRoleInputSchema = z.object({
	type: z.literal("supported"),
	key: z.literal("ai-agent-engineer"),
});

const experimentalTargetRoleInputSchema = z.object({
	type: z.literal("experimental"),
	name: z.string().trim().min(1).max(160),
});

const targetRoleOutputSchema = z.discriminatedUnion("type", [
	z.object({
		id: z.string(),
		type: z.literal("supported"),
		key: z.literal("ai-agent-engineer"),
		name: z.literal("AI Agent Engineer"),
	}),
	z.object({
		id: z.string(),
		type: z.literal("experimental"),
		name: z.string(),
	}),
]);

const roleWorkspaceOutputSchema = z.object({
	id: z.string(),
	status: z.enum(["draft", "active", "archived"]),
	targetRole: targetRoleOutputSchema,
	roleTarget: roleTargetSchema,
	createdAt: z.date(),
	updatedAt: z.date(),
});

export const roleWorkspaceDto = {
	get: {
		input: z.object({ id: z.string().min(1) }),
		output: roleWorkspaceOutputSchema,
	},
	list: {
		input: z.void(),
		output: z.array(roleWorkspaceOutputSchema),
	},
	create: {
		input: z.object({
			targetRole: z.discriminatedUnion("type", [supportedTargetRoleInputSchema, experimentalTargetRoleInputSchema]),
			roleTarget: roleTargetSchema,
		}),
		output: roleWorkspaceOutputSchema,
	},
};
