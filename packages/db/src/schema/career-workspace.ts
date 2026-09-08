import * as pg from "drizzle-orm/pg-core";
import { generateId } from "@reactive-resume/utils/string";
import { user } from "./auth";

export type TargetRoleType = "supported" | "experimental";
export type RoleWorkspaceStatus = "draft" | "active" | "archived";

export const targetRole = pg.pgTable(
	"target_role",
	{
		id: pg
			.text("id")
			.notNull()
			.primaryKey()
			.$defaultFn(() => generateId()),
		userId: pg
			.text("user_id")
			.notNull()
			.references(() => user.id, { onDelete: "cascade" }),
		type: pg.text("type").$type<TargetRoleType>().notNull(),
		supportedKey: pg.text("supported_key"),
		name: pg.text("name").notNull(),
		createdAt: pg.timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
		updatedAt: pg
			.timestamp("updated_at", { withTimezone: true })
			.notNull()
			.defaultNow()
			.$onUpdate(() => /* @__PURE__ */ new Date()),
	},
	(t) => [pg.index().on(t.userId), pg.index().on(t.userId, t.type)],
);

export const roleWorkspace = pg.pgTable(
	"role_workspace",
	{
		id: pg
			.text("id")
			.notNull()
			.primaryKey()
			.$defaultFn(() => generateId()),
		userId: pg
			.text("user_id")
			.notNull()
			.references(() => user.id, { onDelete: "cascade" }),
		targetRoleId: pg
			.text("target_role_id")
			.notNull()
			.references(() => targetRole.id, { onDelete: "restrict" }),
		status: pg.text("status").$type<RoleWorkspaceStatus>().notNull().default("draft"),
		seniority: pg.text("seniority"),
		location: pg.text("location"),
		specialization: pg.text("specialization"),
		createdAt: pg.timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
		updatedAt: pg
			.timestamp("updated_at", { withTimezone: true })
			.notNull()
			.defaultNow()
			.$onUpdate(() => /* @__PURE__ */ new Date()),
	},
	(t) => [pg.index().on(t.userId), pg.index().on(t.userId, t.updatedAt.desc()), pg.index().on(t.targetRoleId)],
);
