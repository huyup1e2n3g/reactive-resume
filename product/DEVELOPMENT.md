# AI Career Workspace 日常开发指南

本文记录基于 Reactive Resume 开发 AI Career Workspace 时常用的本地运行、验证、Git 和 Matt Skills 指令。

## 1. 推荐运行方式

日常开发采用混合模式：

- Docker 运行 PostgreSQL、Redis 和 SeaweedFS。
- macOS 宿主机运行 Web、Hono Server 和 React Email。
- 使用 Node.js 24、pnpm 和 dotenvx。

检查工具版本：

```zsh
node --version
pnpm --version
dotenvx --version
docker --version
docker compose version
```

Node.js 应为 `v24.x`。

## 2. 启动开发环境

### 2.1 启动基础设施

```zsh
docker compose -f compose.dev.yml up -d \
  postgres redis seaweedfs seaweedfs_create_bucket
```

检查容器状态：

```zsh
docker compose -f compose.dev.yml ps
```

`postgres`、`redis` 和 `seaweedfs` 应显示为 `healthy`。`seaweedfs_create_bucket` 成功执行后会退出，这是正常行为。

### 2.2 启动应用

在另一个终端运行：

```zsh
dotenvx run -f .env.local -- pnpm dev
```

本地地址：

- Web：http://localhost:3000
- API 健康检查：http://localhost:3001/api/health
- React Email：http://localhost:3002
- SeaweedFS S3：http://localhost:8333

检查 Web 和 API：

```zsh
curl -I http://127.0.0.1:3000
curl http://127.0.0.1:3001/api/health
```

## 3. 停止和重启

停止宿主机应用：在运行 `pnpm dev` 的终端按 `Ctrl+C`。

停止基础设施：

```zsh
docker compose -f compose.dev.yml down
```

重启基础设施：

```zsh
docker compose -f compose.dev.yml restart postgres redis seaweedfs
```

查看基础设施日志：

```zsh
docker compose -f compose.dev.yml logs -f postgres
docker compose -f compose.dev.yml logs -f redis
docker compose -f compose.dev.yml logs -f seaweedfs
```

不要日常执行 `docker compose down -v`。该命令会删除 PostgreSQL、Redis 和 SeaweedFS 数据卷。

## 4. 全 Docker 模式

仅在验证容器构建或部署一致性时使用。先停止宿主机上的 `pnpm dev`，避免端口冲突。

启动完整容器环境：

```zsh
docker compose -f compose.dev.yml --profile app up -d --build
```

查看应用日志：

```zsh
docker compose -f compose.dev.yml logs -f reactive_resume
```

停止完整环境：

```zsh
docker compose -f compose.dev.yml --profile app down
```

切回日常混合模式前，再按“启动开发环境”章节启动基础设施和宿主机应用。

## 5. 依赖管理

安装或同步依赖：

```zsh
pnpm install
```

为指定 workspace 添加依赖：

```zsh
pnpm --filter <workspace-name> add <package-name>
```

添加开发依赖：

```zsh
pnpm --filter <workspace-name> add -D <package-name>
```

不要使用 `npm install` 或 `yarn` 修改本项目依赖。

## 6. 数据库

服务器启动时会自动运行迁移。手动操作时必须加载 `.env.local`。

生成迁移：

```zsh
dotenvx run -f .env.local -- pnpm db:generate
```

执行迁移：

```zsh
dotenvx run -f .env.local -- pnpm db:migrate
```

打开 Drizzle Studio：

```zsh
dotenvx run -f .env.local -- pnpm db:studio
```

数据库连接：

```text
postgresql://postgres:postgres@localhost:5432/postgres
```

迁移文件存放于 `migrations/`。不要手写或修改已经应用的历史迁移。

## 7. Git Remote 约定

当前 remote：

```text
origin   https://github.com/huyup1e2n3g/reactive-resume.git
upstream https://github.com/amruthpillai/reactive-resume.git
```

含义：

- `origin`：个人 Fork，允许推送。
- `upstream`：Reactive Resume 官方仓库，只用于拉取。
- `upstream` 的 push URL 已禁用，防止误推送。

检查 remote：

```zsh
git remote -v
```

当前 AI Career Workspace 开发分支：

```text
feat/ai-career-workspace
```

切换到该分支：

```zsh
git switch feat/ai-career-workspace
```

## 8. 同步官方仓库

同步前先确认工作区干净：

```zsh
git status --short --branch
```

同步官方 `main`：

```zsh
git switch main
git fetch upstream
git merge --ff-only upstream/main
git push origin main
```

将最新 `main` 更新到功能分支：

```zsh
git switch feat/ai-career-workspace
git rebase main
```

如果工作区存在未提交修改，先提交到当前功能分支；不要在有未保存修改时切换分支或执行 rebase。

## 9. 新功能分支

从最新 `main` 创建功能分支：

```zsh
git switch main
git fetch upstream
git merge --ff-only upstream/main
git push origin main
git switch -c feat/<feature-name>
git push -u origin feat/<feature-name>
```

常用分支前缀：

```text
feat/     新功能
fix/      Bug 修复
refactor/ 不改变行为的重构
docs/     文档修改
chore/    工具或维护工作
```

一个 Ticket 对应一个分支。不要在 `main` 上直接开发。

## 10. 检查和提交

查看修改：

```zsh
git status --short
git diff
```

只暂存本次修改涉及的路径：

```zsh
git add <path-1> <path-2>
git diff --staged
```

提交：

```zsh
git commit -m "feat: describe the user-visible change"
```

推送：

```zsh
git push
```

创建 Pull Request：

```zsh
gh pr create --base main --fill
```

避免使用 `git add .`，防止把 `.env.local`、临时文件或无关修改加入提交。

## 11. 测试和静态检查

优先运行覆盖当前修改的最小检查。

运行单个测试文件：

```zsh
pnpm exec vitest run <path-to-test-file>
```

运行指定 workspace 的测试：

```zsh
pnpm exec turbo run test --filter=<workspace-name>
```

运行指定 workspace 的类型检查：

```zsh
pnpm exec turbo run typecheck --filter=<workspace-name>
```

检查 workspace 边界：

```zsh
pnpm exec turbo boundaries
```

检查指定代码文件：

```zsh
pnpm exec biome check <path-1> <path-2>
```

修复指定代码文件的格式问题：

```zsh
pnpm exec biome check --write <path-1> <path-2>
```

检查本文档和 PRD：

```zsh
pnpm exec markdownlint-cli2 --no-globs \
  product/DEVELOPMENT.md \
  product/AI_Career_Workspace_V1_PRD.md
```

功能分支完成后运行完整验证：

```zsh
pnpm typecheck
pnpm test
pnpm exec turbo boundaries
pnpm build
```

`pnpm check` 会自动修改大量文件，只在明确需要全仓库格式化时使用。

## 12. Matt Skills 工作流

以下命令在 Agent 对话中运行，不是在 zsh 终端运行。

### 12.1 澄清 PRD

```text
/grill-with-docs product/AI_Career_Workspace_V1_PRD.md
```

用于澄清领域术语、状态关系、数据所有权和不可逆设计决策。

### 12.2 验证产品交互

```text
/prototype
```

用于验证 Role-first 信息架构或复杂状态模型。原型是一次性决策工具，不直接进入生产代码。

### 12.3 生成单功能 Spec

```text
/to-spec <明确的单功能范围>
```

不要把完整 V1 PRD 一次转成一个 Spec。每份 Spec 只覆盖一个可独立交付的用户能力。

### 12.4 拆分垂直 Ticket

```text
/to-tickets <spec-or-issue>
```

每个 Ticket 应同时覆盖必要的数据、业务行为、界面和测试，并明确阻塞关系。

### 12.5 实现 Ticket

```text
/implement <ticket>
```

实现时使用预先确认的测试 seam，并优先执行：

```text
/tdd
```

### 12.6 审查功能分支

```text
/code-review main
```

分别检查代码标准和 Spec 符合度。

### 12.7 会话交接

```text
/handoff
```

在工作尚未结束但需要切换 Agent 会话时，记录当前状态、决策、验证结果和下一步。

## 13. 推荐日常循环

```text
1. git status --short --branch
2. 启动 Docker 基础设施
3. dotenvx run -f .env.local -- pnpm dev
4. 选择一个无阻塞 Ticket
5. 创建对应功能分支
6. 确认测试 seam
7. /tdd：一个失败测试 → 最小实现 → 通过
8. 运行局部测试、类型检查和边界检查
9. 在浏览器中验证真实用户流程
10. /code-review main
11. 修复审查问题
12. 运行完整验证
13. 提交、推送并创建 PR
```

## 14. 常见故障

### Docker 命令不存在

```zsh
export PATH="$HOME/.docker/bin:$PATH"
hash -r
open -a Docker
```

### Docker Hub 拉取超时

先单独重试失败镜像：

```zsh
docker pull docker/dockerfile:1.7
```

确认 Docker Desktop 的代理设置与 macOS 当前代理一致，然后重新运行 Compose。

### 端口被占用

检查是否同时运行了容器应用和宿主机应用：

```zsh
docker compose -f compose.dev.yml --profile app ps
```

停止容器应用：

```zsh
docker compose -f compose.dev.yml --profile app stop reactive_resume
```

### 环境变量未加载

必须通过 dotenvx 启动：

```zsh
dotenvx run -f .env.local -- pnpm dev
```

不要直接运行 `pnpm dev`。

### 查看服务器启动错误

宿主机模式下查看运行 `pnpm dev` 的终端。全 Docker 模式下运行：

```zsh
docker compose -f compose.dev.yml logs --tail 200 reactive_resume
```
