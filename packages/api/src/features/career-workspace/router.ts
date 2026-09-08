import { protectedProcedure } from "../../context";
import { roleWorkspaceDto } from "./role-workspace.dto";
import { careerWorkspaceService } from "./service";

export const careerWorkspaceRouter = {
	list: protectedProcedure
		.route({
			method: "GET",
			path: "/career-workspaces",
			tags: ["Career Workspace"],
			operationId: "listRoleWorkspaces",
			summary: "List Role Workspaces",
			description: "Lists Role Workspaces owned by the authenticated candidate.",
			successDescription: "The candidate's Role Workspaces.",
		})
		.input(roleWorkspaceDto.list.input)
		.output(roleWorkspaceDto.list.output)
		.handler(({ context }) => careerWorkspaceService.list({ userId: context.user.id })),
	get: protectedProcedure
		.route({
			method: "GET",
			path: "/career-workspaces/{id}",
			tags: ["Career Workspace"],
			operationId: "getRoleWorkspace",
			summary: "Get a Role Workspace",
			description: "Returns one Role Workspace owned by the authenticated candidate.",
			successDescription: "The requested Role Workspace.",
		})
		.input(roleWorkspaceDto.get.input)
		.output(roleWorkspaceDto.get.output)
		.handler(({ input, context }) => careerWorkspaceService.get({ ...input, userId: context.user.id })),
	create: protectedProcedure
		.route({
			method: "POST",
			path: "/career-workspaces",
			tags: ["Career Workspace"],
			operationId: "createRoleWorkspace",
			summary: "Create a Role Workspace",
			description: "Creates a draft Role Workspace for the authenticated candidate.",
			successDescription: "The created Role Workspace.",
		})
		.input(roleWorkspaceDto.create.input)
		.output(roleWorkspaceDto.create.output)
		.handler(({ input, context }) => careerWorkspaceService.create({ ...input, userId: context.user.id })),
};
