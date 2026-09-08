import { t } from "@lingui/core/macro";
import { Trans } from "@lingui/react/macro";
import { BriefcaseIcon, PlusIcon } from "@phosphor-icons/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Badge } from "@reactive-resume/ui/components/badge";
import { Button } from "@reactive-resume/ui/components/button";
import { Input } from "@reactive-resume/ui/components/input";
import { Label } from "@reactive-resume/ui/components/label";
import { Separator } from "@reactive-resume/ui/components/separator";
import { toast } from "@reactive-resume/ui/components/toast";
import { orpc } from "@/libs/orpc/client";
import { DashboardHeader } from "../-components/header";
import { WorkspaceStatusBadge } from "./-workspace-status-badge";

export const Route = createFileRoute("/dashboard/role-workspaces/")({
	component: RouteComponent,
});

function RouteComponent() {
	const queryClient = useQueryClient();
	const navigate = useNavigate({ from: Route.fullPath });
	const { data: workspaces, isPending, isError, refetch } = useQuery(orpc.careerWorkspace.list.queryOptions());
	const [targetRoleType, setTargetRoleType] = useState<"supported" | "experimental">("supported");
	const [experimentalName, setExperimentalName] = useState("");
	const [seniority, setSeniority] = useState("");
	const [location, setLocation] = useState("");
	const [specialization, setSpecialization] = useState("");

	const createWorkspace = useMutation(
		orpc.careerWorkspace.create.mutationOptions({
			onSuccess: async (workspace) => {
				await queryClient.invalidateQueries({ queryKey: orpc.careerWorkspace.list.queryKey() });
				toast.add({ type: "success", description: t`Role Workspace created.` });
				await navigate({
					to: "/dashboard/role-workspaces/$workspaceId",
					params: { workspaceId: workspace.id },
				});
			},
			onError: () => {
				toast.add({ type: "error", description: t`Couldn't create the Role Workspace. Check the form and try again.` });
			},
		}),
	);

	const submit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const roleTarget = { seniority, location, specialization };
		if (targetRoleType === "supported") {
			createWorkspace.mutate({ targetRole: { type: "supported", key: "ai-agent-engineer" }, roleTarget });
			return;
		}
		createWorkspace.mutate({ targetRole: { type: "experimental", name: experimentalName }, roleTarget });
	};

	return (
		<div className="space-y-6">
			<DashboardHeader icon={BriefcaseIcon} title={t`Role Workspaces`} />
			<Separator />

			<section aria-labelledby="create-role-workspace-heading" className="rounded-xl border bg-card p-5 shadow-sm">
				<div className="mb-5 space-y-1">
					<h2 id="create-role-workspace-heading" className="font-semibold text-lg">
						<Trans>Create a Role Workspace</Trans>
					</h2>
					<p className="text-muted-foreground text-sm">
						<Trans>Choose an occupational direction, then describe the role you are targeting now.</Trans>
					</p>
				</div>

				<form className="grid gap-4 md:grid-cols-2" onSubmit={submit}>
					<div className="space-y-1.5 md:col-span-2">
						<Label htmlFor="target-role-type">
							<Trans>Target Role</Trans>
						</Label>
						<select
							id="target-role-type"
							className="h-9 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
							value={targetRoleType}
							onChange={(event) =>
								setTargetRoleType(event.target.value === "experimental" ? "experimental" : "supported")
							}
						>
							<option value="supported">
								<Trans>AI Agent Engineer — Supported</Trans>
							</option>
							<option value="experimental">
								<Trans>Other role — Experimental</Trans>
							</option>
						</select>
					</div>

					{targetRoleType === "experimental" && (
						<div className="space-y-1.5 md:col-span-2">
							<div className="flex items-center gap-2">
								<Label htmlFor="experimental-role-name">
									<Trans>Role name</Trans>
								</Label>
								<Badge variant="outline">
									<Trans>Experimental</Trans>
								</Badge>
							</div>
							<Input
								id="experimental-role-name"
								required
								maxLength={160}
								value={experimentalName}
								onChange={(event) => setExperimentalName(event.target.value)}
							/>
							<p className="text-muted-foreground text-xs">
								<Trans>Experimental roles do not have the evaluated quality guarantee of supported roles.</Trans>
							</p>
						</div>
					)}

					<div className="space-y-1.5">
						<Label htmlFor="role-seniority">
							<Trans>Target seniority</Trans>
						</Label>
						<Input
							id="role-seniority"
							required
							maxLength={120}
							value={seniority}
							onChange={(event) => setSeniority(event.target.value)}
						/>
					</div>
					<div className="space-y-1.5">
						<Label htmlFor="role-location">
							<Trans>Target location</Trans>
						</Label>
						<Input
							id="role-location"
							required
							maxLength={200}
							value={location}
							onChange={(event) => setLocation(event.target.value)}
						/>
					</div>
					<div className="space-y-1.5 md:col-span-2">
						<Label htmlFor="role-specialization">
							<Trans>Specialization</Trans>
						</Label>
						<Input
							id="role-specialization"
							required
							maxLength={200}
							value={specialization}
							onChange={(event) => setSpecialization(event.target.value)}
						/>
					</div>
					<div className="md:col-span-2">
						<Button type="submit" disabled={createWorkspace.isPending}>
							<PlusIcon />
							{createWorkspace.isPending ? <Trans>Creating…</Trans> : <Trans>Create workspace</Trans>}
						</Button>
					</div>
				</form>
			</section>

			<section aria-labelledby="your-role-workspaces-heading" className="space-y-3">
				<h2 id="your-role-workspaces-heading" className="font-semibold text-lg">
					<Trans>Your Role Workspaces</Trans>
				</h2>
				{isPending && (
					<p role="status" className="text-muted-foreground text-sm">
						<Trans>Loading Role Workspaces…</Trans>
					</p>
				)}
				{isError && (
					<div role="alert" className="flex items-center gap-3 rounded-lg border border-destructive/40 p-4">
						<p className="text-sm">
							<Trans>Couldn't load Role Workspaces.</Trans>
						</p>
						<Button size="sm" variant="outline" onClick={() => void refetch()}>
							<Trans>Try again</Trans>
						</Button>
					</div>
				)}
				{!isPending && !isError && workspaces?.length === 0 && (
					<p className="rounded-lg border border-dashed p-6 text-muted-foreground text-sm">
						<Trans>No Role Workspaces yet. Create your first direction above.</Trans>
					</p>
				)}
				<div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
					{workspaces?.map((workspace) => (
						<Link
							key={workspace.id}
							to="/dashboard/role-workspaces/$workspaceId"
							params={{ workspaceId: workspace.id }}
							className="rounded-xl border bg-card p-4 outline-none transition hover:border-primary/50 hover:shadow-sm focus-visible:ring-3 focus-visible:ring-ring/50"
						>
							<div className="flex items-start justify-between gap-3">
								<h3 className="font-medium">{workspace.targetRole.name}</h3>
								{workspace.targetRole.type === "experimental" && (
									<Badge variant="outline">
										<Trans>Experimental</Trans>
									</Badge>
								)}
							</div>
							<p className="mt-2 text-muted-foreground text-sm">
								{workspace.roleTarget.seniority} · {workspace.roleTarget.location}
							</p>
							<p className="mt-1 text-muted-foreground text-sm">{workspace.roleTarget.specialization}</p>
							<WorkspaceStatusBadge className="mt-3" status={workspace.status} />
						</Link>
					))}
				</div>
			</section>
		</div>
	);
}
