import type * as ORPCServer from "@orpc/server";
import type { RouterClient } from "@orpc/server";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import type { careerWorkspaceRouter } from "./router";
import { randomUUID } from "node:crypto";
import { readFile } from "node:fs/promises";
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { createRouterClient } from "@orpc/server";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

const fixture = vi.hoisted(() => ({
	db: undefined as NodePgDatabase<Record<string, never>> | undefined,
	pool: undefined as Pool | undefined,
}));

vi.mock("@reactive-resume/db/client", () => ({
	get db() {
		return fixture.db;
	},
}));

vi.mock("../../context", async () => {
	const { ORPCError, os } = await vi.importActual<typeof ORPCServer>("@orpc/server");
	const protectedProcedure = os
		.$context<{ locale: "en-US"; reqHeaders: Headers; trustedClient?: string }>()
		.use(({ context, next }) => {
			if (!context.trustedClient) throw new ORPCError("UNAUTHORIZED");
			return next({ context: { ...context, user: { id: context.trustedClient } } });
		});
	return { protectedProcedure };
});

function getPool(): Pool {
	if (!fixture.pool) throw new Error("Test database is not initialized");
	return fixture.pool;
}

const databaseUrl = process.env.ROLE_WORKSPACE_TEST_DATABASE_URL;

describe.skipIf(!databaseUrl)("Role Workspace authenticated oRPC interface", () => {
	const schemaName = `role_workspace_test_${randomUUID().replaceAll("-", "")}`;
	let admin: Pool;
	let client: RouterClient<typeof careerWorkspaceRouter>;
	let router: typeof careerWorkspaceRouter;

	beforeAll(async () => {
		admin = new Pool({ connectionString: databaseUrl });
		await admin.query(`CREATE SCHEMA ${schemaName}`);
		fixture.pool = new Pool({ connectionString: databaseUrl, options: `-c search_path=${schemaName}` });
		fixture.db = drizzle({ client: fixture.pool });
		await fixture.pool.query('CREATE TABLE "user" (id text PRIMARY KEY)');
		const migration = await readFile(
			new URL("../../../../../migrations/20260908092225_nifty_multiple_man/migration.sql", import.meta.url),
			"utf8",
		);
		await fixture.pool.query(migration);
		// Service captures mocked database binding during module evaluation, after fixture setup.
		const module = await import("./router");
		router = module.careerWorkspaceRouter;
		client = createRouterClient(router, {
			context: { locale: "en-US", reqHeaders: new Headers(), trustedClient: "alice" },
		});
	});

	afterAll(async () => {
		await fixture.pool?.end();
		await admin?.query(`DROP SCHEMA IF EXISTS ${schemaName} CASCADE`);
		await admin?.end();
	});

	beforeEach(async () => {
		await getPool().query('TRUNCATE "user", target_role, role_workspace CASCADE');
		await getPool().query('INSERT INTO "user" (id) VALUES ($1), ($2)', ["alice", "bob"]);
	});

	it("creates a supported AI Agent Engineer workspace with Role Target constraints", async () => {
		const workspace = await client.create({
			targetRole: { type: "supported", key: "ai-agent-engineer" },
			roleTarget: {
				seniority: "mid-level",
				location: "Remote — Europe",
				specialization: "Tool-using agents",
			},
		});

		expect(workspace).toEqual({
			id: expect.any(String),
			status: "draft",
			targetRole: {
				id: expect.any(String),
				type: "supported",
				key: "ai-agent-engineer",
				name: "AI Agent Engineer",
			},
			roleTarget: {
				seniority: "mid-level",
				location: "Remote — Europe",
				specialization: "Tool-using agents",
			},
			createdAt: expect.any(Date),
			updatedAt: expect.any(Date),
		});
	});

	it("marks a free-form Target Role as Experimental", async () => {
		const workspace = await client.create({
			targetRole: { type: "experimental", name: "AI Reliability Engineer" },
			roleTarget: {
				seniority: "senior",
				location: "Berlin",
				specialization: "Agent evaluation",
			},
		});

		expect(workspace.targetRole).toEqual({
			id: expect.any(String),
			type: "experimental",
			name: "AI Reliability Engineer",
		});
	});

	it("lists and reopens persisted workspaces through domain-shaped results", async () => {
		const created = await client.create({
			targetRole: { type: "supported", key: "ai-agent-engineer" },
			roleTarget: {
				seniority: "staff",
				location: "Singapore",
				specialization: "Agent platforms",
			},
		});

		expect(await client.list()).toEqual([created]);
		expect(await client.get({ id: created.id })).toEqual(created);
		expect(created).not.toHaveProperty("userId");
		expect(created.targetRole).not.toHaveProperty("userId");
	});

	it("returns the same not-found result across accounts and rejects unauthenticated calls", async () => {
		const created = await client.create({
			targetRole: { type: "experimental", name: "AI Systems Engineer" },
			roleTarget: {
				seniority: "principal",
				location: "Toronto",
				specialization: "Production agents",
			},
		});
		const bob = createRouterClient(router, {
			context: { locale: "en-US", reqHeaders: new Headers(), trustedClient: "bob" },
		});
		const unauthenticated = createRouterClient(router, {
			context: { locale: "en-US", reqHeaders: new Headers() },
		});

		expect(await bob.list()).toEqual([]);
		await expect(bob.get({ id: created.id })).rejects.toMatchObject({ code: "NOT_FOUND" });
		await expect(unauthenticated.list()).rejects.toMatchObject({ code: "UNAUTHORIZED" });
		await expect(
			unauthenticated.create({
				targetRole: { type: "supported", key: "ai-agent-engineer" },
				roleTarget: { seniority: "staff", location: "Remote", specialization: "Agents" },
			}),
		).rejects.toMatchObject({ code: "UNAUTHORIZED" });
	});

	it("returns stable domain errors for invalid input and missing workspaces", async () => {
		await expect(
			client.create({
				targetRole: { type: "experimental", name: " " },
				roleTarget: { seniority: "staff", location: "Remote", specialization: "Agents" },
			}),
		).rejects.toMatchObject({ code: "BAD_REQUEST" });
		await expect(client.get({ id: "missing-workspace" })).rejects.toMatchObject({
			code: "NOT_FOUND",
			message: "Role Workspace not found",
		});
		expect(await client.list()).toEqual([]);
	});
});
