import { Trans } from "@lingui/react/macro";
import { Badge } from "@reactive-resume/ui/components/badge";

type WorkspaceStatusBadgeProps = {
	className?: string;
	status: "draft" | "active" | "archived";
};

export function WorkspaceStatusBadge({ className, status }: WorkspaceStatusBadgeProps) {
	return (
		<Badge className={className} variant="secondary">
			{status === "draft" && <Trans>Draft</Trans>}
			{status === "active" && <Trans>Active</Trans>}
			{status === "archived" && <Trans>Archived</Trans>}
		</Badge>
	);
}
