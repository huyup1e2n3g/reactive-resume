import { t } from "@lingui/core/macro";
import { Trans } from "@lingui/react/macro";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Badge } from "@reactive-resume/ui/components/badge";
import { Button } from "@reactive-resume/ui/components/button";
import { Input } from "@reactive-resume/ui/components/input";
import { Label } from "@reactive-resume/ui/components/label";
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetFooter,
	SheetHeader,
	SheetTitle,
} from "@reactive-resume/ui/components/sheet";
import { toast } from "@reactive-resume/ui/components/toast";
import { Combobox } from "@/components/ui/combobox";
import { orpc } from "@/libs/orpc/client";

type TargetRoleType = "supported" | "experimental";

type Props = {
	open: boolean;
	onOpenChange: (open: boolean) => void;
};

const emptyForm = () => ({
	targetRoleType: "supported" as TargetRoleType,
	experimentalName: "",
	seniority: "",
	location: "",
	specialization: "",
});

type FormState = ReturnType<typeof emptyForm>;

export function RoleWorkspaceFormSheet({ open, onOpenChange }: Props) {
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const [form, setForm] = useState<FormState>(emptyForm);

	const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
		setForm((previous) => ({ ...previous, [key]: value }));

	const createWorkspace = useMutation(
		orpc.careerWorkspace.create.mutationOptions({
			onSuccess: async (workspace) => {
				await queryClient.invalidateQueries({ queryKey: orpc.careerWorkspace.list.queryKey() });
				setForm(emptyForm());
				onOpenChange(false);
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

	const submit = () => {
		const roleTarget = {
			seniority: form.seniority.trim(),
			location: form.location.trim(),
			specialization: form.specialization.trim(),
		};

		if (form.targetRoleType === "supported") {
			createWorkspace.mutate({ targetRole: { type: "supported", key: "ai-agent-engineer" }, roleTarget });
			return;
		}

		createWorkspace.mutate({
			targetRole: { type: "experimental", name: form.experimentalName.trim() },
			roleTarget,
		});
	};

	const valid =
		form.seniority.trim() &&
		form.location.trim() &&
		form.specialization.trim() &&
		(form.targetRoleType === "supported" || form.experimentalName.trim());

	return (
		<Sheet open={open} onOpenChange={onOpenChange}>
			<SheetContent side="right" className="w-full gap-0 data-[side=right]:sm:max-w-lg">
				<SheetHeader>
					<SheetTitle>
						<Trans>Create Role Workspace</Trans>
					</SheetTitle>
					<SheetDescription>
						<Trans>Choose an occupational direction, then describe the role you are targeting now.</Trans>
					</SheetDescription>
				</SheetHeader>

				<div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto px-4 pb-4 [&>*]:shrink-0">
					<Field label={t`Target Role`} required>
						<Combobox
							id="target-role-type"
							className="w-full"
							value={form.targetRoleType}
							options={[
								{
									value: "supported",
									label: <Trans>AI Agent Engineer — Supported</Trans>,
									textValue: t`AI Agent Engineer — Supported`,
								},
								{
									value: "experimental",
									label: <Trans>Other role — Experimental</Trans>,
									textValue: t`Other role — Experimental`,
								},
							]}
							onValueChange={(value) => value && set("targetRoleType", value)}
						/>
					</Field>

					{form.targetRoleType === "experimental" && (
						<Field
							required
							label={
								<span className="flex items-center gap-2">
									<Trans>Role name</Trans>
									<Badge variant="outline">
										<Trans>Experimental</Trans>
									</Badge>
								</span>
							}
						>
							<Input
								value={form.experimentalName}
								maxLength={160}
								onChange={(event) => set("experimentalName", event.target.value)}
							/>
							<p className="text-muted-foreground text-xs">
								<Trans>Experimental roles do not have the evaluated quality guarantee of supported roles.</Trans>
							</p>
						</Field>
					)}

					<Field label={t`Target seniority`} required>
						<Input value={form.seniority} maxLength={120} onChange={(event) => set("seniority", event.target.value)} />
					</Field>
					<Field label={t`Target location`} required>
						<Input value={form.location} maxLength={200} onChange={(event) => set("location", event.target.value)} />
					</Field>
					<Field label={t`Specialization`} required>
						<Input
							value={form.specialization}
							maxLength={200}
							onChange={(event) => set("specialization", event.target.value)}
						/>
					</Field>
				</div>

				<SheetFooter className="flex-row justify-end gap-2">
					<Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
						<Trans>Cancel</Trans>
					</Button>
					<Button type="button" disabled={!valid || createWorkspace.isPending} onClick={submit}>
						{createWorkspace.isPending ? <Trans>Creating…</Trans> : <Trans>Create workspace</Trans>}
					</Button>
				</SheetFooter>
			</SheetContent>
		</Sheet>
	);
}

function Field({
	label,
	required,
	children,
}: {
	label: React.ReactNode;
	required?: boolean;
	children: React.ReactNode;
}) {
	return (
		<div className="grid gap-1.5">
			<Label className="text-muted-foreground text-xs">
				{label}
				{required && <span className="text-destructive"> *</span>}
			</Label>
			{children}
		</div>
	);
}
