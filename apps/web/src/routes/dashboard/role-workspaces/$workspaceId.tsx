import { t } from "@lingui/core/macro";
import { Trans } from "@lingui/react/macro";
import { ArrowLeftIcon, BriefcaseIcon } from "@phosphor-icons/react";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Badge } from "@reactive-resume/ui/components/badge";
import { Button } from "@reactive-resume/ui/components/button";
import { Separator } from "@reactive-resume/ui/components/separator";
import { orpc } from "@/libs/orpc/client";
import { DashboardHeader } from "../-components/header";
import { WorkspaceStatusBadge } from "./-workspace-status-badge";

export const Route = createFileRoute("/dashboard/role-workspaces/$workspaceId")({
	component: RouteComponent,
});

function RouteComponent() {
	const { workspaceId } = Route.useParams();
	const {
		data: workspace,
		isPending,
		isError,
		refetch,
	} = useQuery(orpc.careerWorkspace.get.queryOptions({ input: { id: workspaceId } }));

	if (isPending)
		return (
			<p role="status" className="text-muted-foreground text-sm">
				<Trans>Loading Role Workspace…</Trans>
			</p>
		);
	if (isError || !workspace) {
		return (
			<div role="alert" className="space-y-3 rounded-lg border border-destructive/40 p-5">
				<p>
					<Trans>This Role Workspace could not be loaded.</Trans>
				</p>
				<div className="flex gap-2">
					<Button size="sm" variant="outline" onClick={() => void refetch()}>
						<Trans>Try again</Trans>
					</Button>
					<Button size="sm" variant="ghost" nativeButton={false} render={<Link to="/dashboard/role-workspaces" />}>
						<Trans>Back to Role Workspaces</Trans>
					</Button>
				</div>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			<DashboardHeader
				icon={BriefcaseIcon}
				title={workspace.targetRole.name}
				actions={
					<Button size="sm" variant="outline" nativeButton={false} render={<Link to="/dashboard/role-workspaces" />}>
						<ArrowLeftIcon />
						<Trans>All Role Workspaces</Trans>
					</Button>
				}
			/>
			<Separator />

			<section aria-labelledby="target-role-heading" className="rounded-xl border bg-card p-5 shadow-sm">
				<div className="flex flex-wrap items-center gap-2">
					<h2 id="target-role-heading" className="font-semibold text-lg">
						<Trans>Target Role</Trans>
					</h2>
					<WorkspaceStatusBadge status={workspace.status} />
					{workspace.targetRole.type === "experimental" && (
						<Badge variant="outline">
							<Trans>Experimental</Trans>
						</Badge>
					)}
				</div>
				<p className="mt-3 font-semibold text-2xl">{workspace.targetRole.name}</p>
				{workspace.targetRole.type === "experimental" && (
					<p className="mt-2 text-muted-foreground text-sm">
						<Trans>Experimental roles do not have the evaluated quality guarantee of supported roles.</Trans>
					</p>
				)}
			</section>

			<section aria-labelledby="role-target-heading" className="rounded-xl border bg-card p-5 shadow-sm">
				<h2 id="role-target-heading" className="font-semibold text-lg">
					<Trans>Role Target</Trans>
				</h2>
				<p className="mt-1 text-muted-foreground text-sm">
					<Trans>Current constraints for this occupational direction.</Trans>
				</p>
				<dl className="mt-5 grid gap-4 sm:grid-cols-3">
					<div>
						<dt className="text-muted-foreground text-sm">
							<Trans>Seniority</Trans>
						</dt>
						<dd className="mt-1 font-medium">{workspace.roleTarget.seniority}</dd>
					</div>
					<div>
						<dt className="text-muted-foreground text-sm">
							<Trans>Location</Trans>
						</dt>
						<dd className="mt-1 font-medium">{workspace.roleTarget.location}</dd>
					</div>
					<div>
						<dt className="text-muted-foreground text-sm">
							<Trans>Specialization</Trans>
						</dt>
						<dd className="mt-1 font-medium">{workspace.roleTarget.specialization}</dd>
					</div>
				</dl>
			</section>

			<p className="text-muted-foreground text-sm">{t`Workspace setup is saved. Sources and assessment arrive in the next steps.`}</p>
		</div>
	);
}
