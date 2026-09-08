# 01: Create and revisit a Target Role Workspace

**What to build:** Let an authenticated candidate create a user-owned Role Workspace for either the supported AI Agent Engineer Target Role or an explicitly Experimental Target Role, set Role Target constraints, and revisit the persisted workspace through the web experience. Establish the authenticated Career Workspace oRPC interface used by callers and contract tests.

**Blocked by:** None (can start immediately).

**Status:** resolved

- [x] An authenticated candidate can create an AI Agent Engineer Role Workspace with seniority, location, and specialization.
- [x] A free-form Target Role is visibly marked Experimental before and after creation.
- [x] A new Role Workspace begins in `draft` state and preserves Target Role separately from Role Target constraints.
- [x] The candidate can list and reopen the same persisted workspace after reload.
- [x] Every query and command rejects unauthenticated access and cross-user workspace access without revealing another user's data.
- [x] The interface returns domain-shaped results and conflict/error states rather than database-shaped records.
- [x] Authenticated oRPC integration tests use real isolated persistence and cover supported, experimental, reload, ownership, and invalid-input behavior.
- [x] User-facing controls and status text are localized, keyboard operable, and expose Experimental state without relying only on color.
