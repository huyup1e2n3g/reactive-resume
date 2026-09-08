import { ORPCError } from "@orpc/server";
import { and, desc, eq } from "drizzle-orm";
import { db } from "@reactive-resume/db/client";
import * as schema from "@reactive-resume/db/schema";

const supportedTargetRoles = {
	"ai-agent-engineer": "AI Agent Engineer",
} as const;

type CreateRoleWorkspaceInput = {
	userId: string;
	targetRole: { type: "supported"; key: keyof typeof supportedTargetRoles } | { type: "experimental"; name: string };
	roleTarget: { seniority: string; location: string; specialization: string };
};

const workspaceSelection = {
	id: schema.roleWorkspace.id,
	status: schema.roleWorkspace.status,
	createdAt: schema.roleWorkspace.createdAt,
	updatedAt: schema.roleWorkspace.updatedAt,
	targetRole: {
		id: schema.targetRole.id,
		type: schema.targetRole.type,
		supportedKey: schema.targetRole.supportedKey,
		name: schema.targetRole.name,
	},
	roleTarget: {
		seniority: schema.roleWorkspace.seniority,
		location: schema.roleWorkspace.location,
		specialization: schema.roleWorkspace.specialization,
	},
};

type WorkspaceSelection = {
	id: string;
	status: schema.RoleWorkspaceStatus;
	createdAt: Date;
	updatedAt: Date;
	targetRole: {
		id: string;
		type: schema.TargetRoleType;
		supportedKey: string | null;
		name: string;
	};
	roleTarget: {
		seniority: string | null;
		location: string | null;
		specialization: string | null;
	};
};

function toRoleWorkspace(row: WorkspaceSelection) {
	const roleTarget = {
		seniority: row.roleTarget.seniority ?? "",
		location: row.roleTarget.location ?? "",
		specialization: row.roleTarget.specialization ?? "",
	};

	if (row.targetRole.type === "supported") {
		if (row.targetRole.supportedKey !== "ai-agent-engineer") {
			throw new ORPCError("INTERNAL_SERVER_ERROR", { message: "Unsupported persisted Target Role" });
		}

		return {
			id: row.id,
			status: row.status,
			targetRole: {
				id: row.targetRole.id,
				type: "supported" as const,
				key: "ai-agent-engineer" as const,
				name: "AI Agent Engineer" as const,
			},
			roleTarget,
			createdAt: row.createdAt,
			updatedAt: row.updatedAt,
		};
	}

	return {
		id: row.id,
		status: row.status,
		targetRole: {
			id: row.targetRole.id,
			type: "experimental" as const,
			name: row.targetRole.name,
		},
		roleTarget,
		createdAt: row.createdAt,
		updatedAt: row.updatedAt,
	};
}

export const careerWorkspaceService = {
	list: async (input: { userId: string }) => {
		const rows = await db
			.select(workspaceSelection)
			.from(schema.roleWorkspace)
			.innerJoin(schema.targetRole, eq(schema.roleWorkspace.targetRoleId, schema.targetRole.id))
			.where(eq(schema.roleWorkspace.userId, input.userId))
			.orderBy(desc(schema.roleWorkspace.updatedAt), desc(schema.roleWorkspace.id));

		return rows.map(toRoleWorkspace);
	},
	get: async (input: { id: string; userId: string }) => {
		const [row] = await db
			.select(workspaceSelection)
			.from(schema.roleWorkspace)
			.innerJoin(
				schema.targetRole,
				and(eq(schema.roleWorkspace.targetRoleId, schema.targetRole.id), eq(schema.targetRole.userId, input.userId)),
			)
			.where(and(eq(schema.roleWorkspace.id, input.id), eq(schema.roleWorkspace.userId, input.userId)))
			.limit(1);

		if (!row) throw new ORPCError("NOT_FOUND", { message: "Role Workspace not found" });
		return toRoleWorkspace(row);
	},
	create: (input: CreateRoleWorkspaceInput) =>
		db.transaction(async (tx) => {
			const targetRoleValues =
				input.targetRole.type === "supported"
					? {
							type: input.targetRole.type,
							supportedKey: input.targetRole.key,
							name: supportedTargetRoles[input.targetRole.key],
						}
					: {
							type: input.targetRole.type,
							supportedKey: null,
							name: input.targetRole.name,
						};
			const [targetRole] = await tx
				.insert(schema.targetRole)
				.values({ userId: input.userId, ...targetRoleValues })
				.returning();
			if (!targetRole) throw new Error("Target Role insert returned no row");

			const [workspace] = await tx
				.insert(schema.roleWorkspace)
				.values({
					userId: input.userId,
					targetRoleId: targetRole.id,
					seniority: input.roleTarget.seniority,
					location: input.roleTarget.location,
					specialization: input.roleTarget.specialization,
				})
				.returning();
			if (!workspace) throw new Error("Role Workspace insert returned no row");

			return toRoleWorkspace({
				id: workspace.id,
				status: workspace.status,
				targetRole: {
					id: targetRole.id,
					type: targetRole.type,
					supportedKey: targetRole.supportedKey,
					name: targetRole.name,
				},
				roleTarget: {
					seniority: workspace.seniority,
					location: workspace.location,
					specialization: workspace.specialization,
				},
				createdAt: workspace.createdAt,
				updatedAt: workspace.updatedAt,
			});
		}),
};
