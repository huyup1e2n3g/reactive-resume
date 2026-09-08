import { t } from "@lingui/core/macro";
import { Trans } from "@lingui/react/macro";
import { CompassIcon, PlusIcon } from "@phosphor-icons/react";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Badge } from "@reactive-resume/ui/components/badge";
import { Button } from "@reactive-resume/ui/components/button";
import { Separator } from "@reactive-resume/ui/components/separator";
import { RoleWorkspaceFormSheet } from "@/features/career-workspace/components/role-workspace-form-sheet";
import { WorkspaceStatusBadge } from "@/features/career-workspace/components/workspace-status-badge";
import { orpc } from "@/libs/orpc/client";
import { DashboardHeader } from "../-components/header";

export const Route = createFileRoute("/dashboard/role-workspaces/")({
	component: RouteComponent,
});

function RouteComponent() {
	const [createOpen, setCreateOpen] = useState(false);
	const { data: workspaces, isPending, isError, refetch } = useQuery(orpc.careerWorkspace.list.queryOptions());
	const isEmpty = (workspaces?.length ?? 0) === 0;

	return (
		<div className="flex h-[calc(100dvh-2rem)] flex-col gap-4">
			<DashboardHeader
				icon={CompassIcon}
				title={t`Role Workspaces`}
				actions={
					!isEmpty ? (
						<Button size="sm" onClick={() => setCreateOpen(true)}>
							<PlusIcon />
							<Trans>Create workspace</Trans>
						</Button>
					) : undefined
				}
			/>

			<Separator />

			{isPending ? (
				<div className="flex flex-1 items-center justify-center">
					<p role="status" className="text-muted-foreground text-sm">
						<Trans>Loading Role Workspaces…</Trans>
					</p>
				</div>
			) : isError ? (
				<div
					role="alert"
					className="flex items-center justify-center gap-3 rounded-lg border border-destructive/40 p-4"
				>
					<p className="text-sm">
						<Trans>Couldn't load Role Workspaces.</Trans>
					</p>
					<Button size="sm" variant="outline" onClick={() => void refetch()}>
						<Trans>Try again</Trans>
					</Button>
				</div>
			) : isEmpty ? (
				<EmptyState onCreate={() => setCreateOpen(true)} />
			) : (
				<div className="grid gap-3 overflow-y-auto md:grid-cols-2 xl:grid-cols-3">
					{workspaces?.map((workspace) => (
						<Link
							key={workspace.id}
							to="/dashboard/role-workspaces/$workspaceId"
							params={{ workspaceId: workspace.id }}
							className="h-fit rounded-xl border bg-card p-4 outline-none transition hover:border-primary/50 hover:shadow-sm focus-visible:ring-3 focus-visible:ring-ring/50"
						>
							<div className="flex items-start justify-between gap-3">
								<h2 className="font-medium">{workspace.targetRole.name}</h2>
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
			)}

			<RoleWorkspaceFormSheet open={createOpen} onOpenChange={setCreateOpen} />
		</div>
	);
}

function EmptyState({ onCreate }: { onCreate: () => void }) {
	return (
		<div className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
			<div className="flex size-14 items-center justify-center rounded-2xl bg-muted">
				<CompassIcon className="size-7 text-muted-foreground" />
			</div>
			<div className="max-w-md space-y-1.5">
				<h2 className="font-semibold text-lg">
					<Trans>Create your first Role Workspace</Trans>
				</h2>
				<p className="text-muted-foreground text-sm">
					<Trans>Choose an occupational direction and define the role you are targeting now.</Trans>
				</p>
			</div>
			<Button onClick={onCreate}>
				<PlusIcon />
				<Trans>Create workspace</Trans>
			</Button>
		</div>
	);
}
