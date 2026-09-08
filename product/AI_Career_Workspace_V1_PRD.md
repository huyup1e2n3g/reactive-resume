# AI Career Workspace 产品规划与 V1 PRD

> 文档版本：v1.0  
> 产品阶段：概念验证 / MVP 规划  
> 核心定位：围绕“目标岗位上下文 + 个人上下文 + 具体岗位上下文”，帮助用户从岗位准备、项目补齐、简历生成、岗位匹配、定制投递一路走到面试准备与复盘。

---

需求原文：从我个人的需求出发，比如说我要找一份AI Agent的工作，我会先收集一些好的简历参考，学习简历项目是怎么写的，面试会怎么问，这就相当于这个岗位大的上下文，基于这个岗位上下文去写我的简历部分的项目部分，如果我本身没有相关项目，AI就会给我推荐项目以及需要补充的知识点，以及对应的面试问题，此外还有一个我的个人基本背景信息上下文用于简历的基础信息部分。这样我的一份基础简历就做好了。接下来就是找岗位，我复制一个url就可以提取岗位信息，检查岗位的匹配度，以及AI优化建议，最终生成对应该岗位版本的简历，如果后续投递成功，也可以继续生成面试要点、面试模拟及复盘追踪等功能。

## 1. 产品概述

### 1.1 产品一句话定义

AI Career Workspace 是一个以“目标岗位”为中心的 AI 求职工作台。

用户不是先从“写简历”开始，而是先告诉系统：

> 我想成为哪一种岗位的人？

系统围绕这个岗位建立完整上下文，帮助用户理解岗位要求、补齐能力和项目证据、生成岗位基础简历，并在遇到具体职位时进一步做岗位匹配、定制简历和后续面试准备。

---

## 2. 产品要解决的问题

传统简历工具通常只解决：

- 简历排版
- AI 改写
- ATS 检查
- Job Description 关键词匹配

但用户真正的问题通常更早发生：

1. 我想找某个岗位，但不知道这个岗位真正需要什么。
2. 我不知道优秀候选人的简历和项目通常怎么写。
3. 我不知道自己目前缺哪些知识、技能和项目。
4. 我可能没有足够相关的项目经历。
5. 我不知道应该先学什么、做什么项目。
6. 我不知道我的项目怎么转化为简历中的有效证据。
7. 面对具体 JD，我不知道自己匹配在哪里、缺在哪里。
8. 我不知道针对不同公司应该如何调整简历。
9. 投递成功后，我还需要围绕该岗位和自身经历准备面试。
10. 面试结束后，我缺少持续复盘和能力补齐机制。

因此，本产品不是“AI Resume Builder”，而是：

> 从“我想成为某个岗位的人”到“我拿到这个岗位”的完整 AI Workspace。

---

# 3. 核心产品理念

## 3.1 Resume 不是中心，Role 才是中心

传统工具的数据结构通常是：

```text
User
└── Resume
```

本产品的数据结构应为：

```text
User
└── Role Workspace
    ├── Role Context
    ├── Candidate Context
    ├── Skill Map
    ├── Projects
    ├── Base Resume
    ├── Job Applications
    ├── Interview Prep
    └── Learning / Reflection
```

例如一个用户可以同时存在：

```text
AI Agent Engineer
Full-stack Engineer
WordPress Developer
```

不同目标岗位拥有各自独立的：

- 岗位能力模型
- 项目组合
- 简历版本
- 求职记录
- 面试准备

---

# 4. 四层核心上下文模型

整个产品建立在四类 Context 上。

## 4.1 Candidate Context

描述“我是谁”。

包括：

### 基础信息

- 姓名
- 联系方式
- 所在地
- 个人简介
- 教育经历
- 工作经历
- 技能
- 项目
- 作品集
- GitHub
- LinkedIn
- 语言
- 求职偏好

### 能力信息

- 已掌握技能
- 技能熟练度
- 已完成项目
- 每个项目能证明哪些能力
- 有证据支持的能力
- 尚缺少证据的能力

Candidate Context 是用户长期共享的数据，不属于某一份简历。

---

## 4.2 Role Context

描述“我要成为谁”。

例如：

```text
AI Agent Engineer
```

Role Context 来源于用户主动收集的真实材料，包括：

- 优秀简历
- 招聘 JD
- 面试经验
- 面试题
- 岗位文章
- 技术路线
- 项目案例
- 用户手动添加的资料

AI 对这些资料进行总结后形成：

### Role Skill Map

例如：

```text
AI Agent Engineer

Core AI
├── LLM API
├── Structured Output
├── Prompt Engineering
├── Tool Calling
├── RAG
└── Embeddings

Agent Engineering
├── Agent Orchestration
├── MCP
├── Memory
├── Planning
├── Evaluation
├── Guardrails
└── Observability

Engineering
├── TypeScript / Python
├── API Design
├── Database
├── Async Workflows
├── Testing
└── System Design

Deployment
├── Docker
├── Cloud
├── CI/CD
└── Monitoring
```

Role Context 同时应沉淀：

- 常见项目类型
- 优秀项目 Bullet 的写法
- 常见技术关键词
- 常见面试问题
- 岗位能力优先级
- 招聘方常见关注点

---

## 4.3 Job Context

描述“这家公司这一个具体岗位需要什么”。

通过：

- 粘贴 Job URL
- 粘贴 Job Description
- 手动输入

得到结构化数据：

```text
Company
Role
Location
Salary
Seniority
Employment Type

Responsibilities
Required Skills
Preferred Skills
Tech Stack
Keywords
Experience Requirements
Education Requirements
```

之后与 Candidate Context + Role Context 组合分析。

---

## 4.4 Outcome Context

描述“实际求职结果告诉了我什么”。

来源包括：

- 投递结果
- 面试阶段
- 面试问题
- 面试反馈
- 用户自评
- Offer / Rejection
- 面试复盘

例如：

```text
Interview #3

Asked:
- MCP
- Agent Memory
- Agent Evaluation
- Why TypeScript

Weak:
- Agent Evaluation
- Distributed Systems

Strong:
- MCP
- Tool Calling
```

Outcome Context 应反向更新：

- Candidate Skill Gap
- Role 高频面试题
- Learning Priority
- 下次面试准备

---

# 5. 核心关系模型

产品中最重要的对象不是一段简历文字，而是：

## Skill → Evidence

例如：

```text
Agent Evaluation
│
├── Role Requirement
├── Learning Resource
├── Project Evidence
├── Resume Bullet
└── Interview Questions
```

一个技能必须尽量对应现实证据。

例如用户声明：

```text
MCP: 熟悉
```

系统应进一步追问或寻找：

```text
你在哪个项目里真正使用过 MCP？
你实现了什么？
为什么使用它？
你遇到了什么问题？
结果如何？
```

最终生成：

```text
Skill:
MCP

Evidence:
Built an MCP-compatible tool server...

Resume Bullet:
Implemented...

Interview Questions:
Why MCP?
How does MCP differ from custom tool APIs?
```

---

# 6. 产品核心闭环

```text
TARGET
选择目标岗位
↓
UNDERSTAND
建立岗位上下文
↓
ASSESS
分析个人能力与证据缺口
↓
PREPARE
学习技能 + 推荐项目
↓
BUILD
完成 Role Base Resume
↓
MATCH
导入具体 JD
↓
TAILOR
生成 Job-specific Resume
↓
APPLY
追踪投递
↓
INTERVIEW
针对性准备
↓
REFLECT
面试复盘
↓
IMPROVE
更新 Skill Gap / Role Context
↓
下一次申请
```

---

# 7. Role Workspace

用户第一次进入系统后，不应该先看到 Resume Builder。

第一步应为：

> What role are you preparing for?

例如：

```text
AI Agent Engineer
```

创建后进入 Role Workspace。

建议导航：

```text
Overview
Profile
Skills
Projects
Resume
Applications
Interview
Knowledge
```

---

# 8. Role Context 建立流程

## 8.1 输入来源

V1 可以支持：

- 上传简历参考 PDF
- 粘贴文本
- 粘贴 JD
- 手动添加笔记

未来支持：

- Job URL 自动读取
- 网页资料
- YouTube Transcript
- GitHub Repo
- 文章链接
- 面试经验链接

---

## 8.2 Resume Reference 分析

用户可以收集优秀参考简历。

AI 提取：

- 高频技能
- 高频项目类型
- 项目描述结构
- Bullet Point 写法
- 量化指标使用方式
- 技术关键词
- 简历 section 排列

最终产生：

### Resume Patterns

示例：

```text
AI Agent Engineer Resume Patterns

Common Skills
- TypeScript
- Python
- RAG
- LLM API
- Tool Calling
- MCP
- Evaluation

Strong Project Bullet Pattern
Problem
→ Architecture
→ Technical implementation
→ Result
```

注意：

参考简历只能用于学习结构、表达方式和岗位信号。

系统不能复制他人的虚构经历到用户简历。

---

# 9. Candidate Skill Gap

系统比较：

```text
Role Skill Map
VS
Candidate Context
```

输出：

```text
Covered
Partial
Missing
No Evidence
```

例如：

| Skill | Role Importance | Candidate Level | Evidence |
|---|---:|---:|---|
| TypeScript | High | Strong | 3 projects |
| Tool Calling | High | Medium | 1 project |
| MCP | High | Medium | 1 project |
| Agent Evaluation | High | Weak | None |
| Docker | Medium | Basic | None |
| AWS | Medium | Missing | None |

重点区分：

### Missing Skill

用户确实没有该能力。

### Missing Evidence

用户可能懂，但简历 / 项目中没有证据。

这两类问题解决方案完全不同。

---

# 10. AI Project Recommendation

如果用户缺少相关项目，AI 不能直接帮用户“编一段项目经历”。

正确流程：

```text
发现缺口
↓
推荐真实项目
↓
生成学习目标
↓
用户真实完成
↓
提取项目证据
↓
写入简历
```

例如：

## Recommended Project

**AI Job Research Agent**

目标：

```text
Job URL
→ Extract JD
→ Company Research
→ Skill Match
→ Resume Tailoring
→ Interview Preparation
```

覆盖能力：

```text
✓ TypeScript
✓ LLM Structured Output
✓ Tool Calling
✓ Browser Automation
✓ Agent Workflow
✓ Database
✓ Evaluation
```

学习前置知识：

1. Structured Output
2. Tool Calling
3. Agent State
4. MCP Basics
5. Browser Automation
6. Evaluation

对应面试问题：

- Why agent instead of deterministic workflow?
- How do you handle tool failure?
- How do you evaluate agent quality?
- How do you prevent hallucination?
- Why did you use MCP?

---

# 11. Role Base Resume

Base Resume 不是“用户唯一的一份简历”。

而是：

> 针对某一类目标岗位的基础简历。

例如：

```text
AI Agent Engineer Base Resume
Full-stack Engineer Base Resume
```

生成逻辑：

```text
Candidate Context
+
Role Context
↓
Role-specific Base Resume
```

主要决定：

- Summary
- Skills
- Project Selection
- Project Ordering
- Experience Emphasis
- Section Ordering
- Keywords

---

# 12. Job Import

用户自己通过 LinkedIn / Indeed / Wellfound / 公司官网发现岗位。

本产品 V1 不需要成为职位搜索引擎。

用户只需要：

```text
Paste Job URL
```

或者：

```text
Paste Job Description
```

系统自动提取 Job Context。

---

# 13. Job Match

产品不应只输出一个没有解释的“ATS Score”。

需要输出：

## Overall Match

```text
Match: 78%
```

同时解释：

### Strong Match

- TypeScript
- LLM API
- Next.js
- Workflow Automation

### Partial Match

- RAG
- Docker

### Missing

- LangGraph
- Agent Evaluation
- AWS

### Evidence Gap

- System Design
- Production Monitoring

---

# 14. AI Optimization Advice

匹配分析之后最重要的问题不是：

> 分数是多少？

而是：

> 下一步应该做什么？

例如：

```text
Recommended Actions

1. Apply now — overall fit is strong.
2. Move your MCP project above WordPress experience.
3. Rewrite Project A to emphasize agent orchestration.
4. Add measurable result to Project B.
5. Reduce irrelevant frontend styling bullets.
6. Highlight TypeScript + backend architecture.
```

---

# 15. Job-specific Resume

生成逻辑：

```text
Candidate Context
+
Role Context
+
Job Context
↓
Tailored Resume
```

允许 AI：

- 调整 Summary
- 调整 Skills 顺序
- 调整 Project 顺序
- 调整 Work Experience 强调重点
- 改写真实 Bullet
- 加强 JD 相关关键词
- 删除无关内容

禁止：

- 创建不存在的公司
- 创建不存在的工作经历
- 创建不存在的项目
- 创建虚假数字
- 创建虚假技术栈
- 虚构管理经验
- 虚构成果

---

# 16. Application Tracker

每个 Job Context 同时成为一个 Application。

状态建议：

```text
Saved
Preparing
Applied
Interview
Offer
Rejected
Archived
```

Application Detail：

```text
Company
Role
Job Description
Match Analysis
Tailored Resume
Notes
Status
Interview Prep
Outcome
```

---

# 17. Interview 阶段

完整版本中，当状态变为：

```text
Interview
```

系统生成 Interview Pack。

输入：

```text
Candidate Context
+
Role Context
+
Job Context
+
Company Context
```

输出：

### Likely Topics

- Agent Architecture
- Tool Calling
- Evaluation
- RAG
- TypeScript Backend

### Candidate Risk Areas

- Agent Evaluation
- Distributed Systems
- AWS

### Strongest Stories

- Project A
- Project B
- Work Experience C

### Likely Questions

问题应优先来源于：

```text
JD Requirement
+
Candidate Resume Evidence
```

而不是随机生成通用面试题。

---

# 18. Interview Mock

未来支持：

```text
Start Mock Interview
```

AI 根据：

- JD
- Resume
- Role Context
- Company Context
- Previous Interview Results

进行多轮模拟。

建议支持：

- Technical
- Project Deep Dive
- Behavioral
- System Design
- Hiring Manager

---

# 19. Interview Debrief

面试结束后用户可输入：

```text
今天问了：

1. MCP 是什么
2. Agent 如何做 Memory
3. Agent 如何 Evaluation
4. 为什么使用 TypeScript
```

系统整理：

### Questions Asked

### Answered Well

### Weak Areas

### Missing Knowledge

### Follow-up Learning Tasks

并反向更新：

```text
Candidate Context
Role Context
Skill Priority
Interview Question Bank
```

形成真正闭环。

---

# 20. Dashboard 核心理念

Dashboard 不应只是统计。

最重要组件应为：

## Next Best Actions

例如：

```text
Complete Agent Evaluation knowledge gap

Improve JobPilot project bullet

Tailor resume for Acme AI

Prepare Stripe interview
```

因为用户最核心的问题通常是：

> 我下一步应该做什么？

---

# 21. 建议信息架构

```text
Dashboard

Roles
└── AI Agent Engineer
    ├── Overview
    ├── Profile
    ├── Skills
    ├── Projects
    ├── Resume
    ├── Applications
    ├── Interview
    └── Knowledge

Settings
```

---

# 22. 产品核心对象

建议后续数据库围绕以下 Entity 设计：

## User

用户账号。

## CandidateProfile

用户长期共享个人资料。

## Role

目标岗位。

## RoleSource

Role Context 的原始资料。

例如：

- Resume
- JD
- Interview Note
- Article
- Manual Note

## Skill

标准化技能。

## RoleSkill

某岗位需要哪些技能以及重要程度。

## CandidateSkill

用户当前技能状态。

## Evidence

证明某技能的现实证据。

## Project

用户真实完成的项目。

## Resume

某个 Role 的 Base Resume。

## ResumeVersion

针对具体 Job 的简历版本。

## Job

具体职位。

## Application

职位投递状态。

## Interview

面试记录。

## InterviewQuestion

面试题。

## LearningTask

需要补齐的知识和行动任务。

---

# 23. AI 行为原则

## 23.1 Evidence First

所有简历内容必须尽量来源于真实 Evidence。

---

## 23.2 Never Invent Experience

AI 永远不能把推荐项目直接写成“用户已完成的项目”。

项目必须经过：

```text
Recommended
↓
In Progress
↓
Completed
↓
Evidence Added
```

之后才能进入 Resume。

---

## 23.3 Explain Every Score

任何：

```text
Match Score
Skill Score
Readiness Score
```

都必须能够展开解释依据。

---

## 23.4 Separate Fact and Suggestion

明确区分：

```text
Known Fact
Inference
Recommendation
```

---

## 23.5 User Owns Final Resume

AI 可以建议和生成 Draft，但用户必须能够：

- 查看 diff
- 编辑
- 接受
- 拒绝
- 回退

---

# 24. V1 产品定义

---

## 24.1 V1 核心目标

验证：

> 用户是否愿意围绕一个“目标岗位 Workspace”长期维护自己的技能、项目、基础简历，并对具体 Job 生成岗位匹配和定制简历。

V1 不验证：

- 自动投递
- 全自动职位发现
- 完整 Agent Browser
- 复杂面试模拟
- 社交社区
- 招聘方产品

---

# 25. V1 核心用户

第一阶段聚焦：

### 技术岗位求职者

优先：

- AI Engineer
- AI Agent Engineer
- Full-stack Engineer
- Frontend Engineer
- Backend Engineer

原因：

- 岗位技能较结构化
- 项目证据重要
- GitHub / Portfolio 常见
- AI Agent 可以产生明显价值

---

# 26. V1 核心流程

```text
Create Role
↓
Build Candidate Profile
↓
Add Role References
↓
Generate Role Skill Map
↓
Gap Analysis
↓
Add / Improve Projects
↓
Generate Base Resume
↓
Import Job
↓
Match Analysis
↓
Optimization Advice
↓
Generate Tailored Resume
↓
Track Application
```

---

# 27. V1 功能范围

## P0 — 必须实现

### 1. Authentication

- 注册
- 登录
- 登出

---

### 2. Candidate Profile

支持：

- Personal Info
- Education
- Work Experience
- Skills
- Projects
- Links
- Target Location
- Job Preferences

支持手动编辑。

V1 可支持上传现有 Resume 自动解析 Candidate Profile。

---

### 3. Role Workspace

用户可以：

```text
Create Role
```

字段：

- Role Name
- Description
- Target Seniority
- Notes

例如：

```text
AI Agent Engineer
```

---

### 4. Role Sources

V1 支持：

- 上传 PDF 简历参考
- 粘贴 Job Description
- 粘贴文本笔记

系统存储原始 Source。

---

### 5. Role Context Generation

AI 根据 Role Sources 生成：

- Role Summary
- Required Skills
- Preferred Skills
- Common Project Patterns
- Resume Patterns
- Interview Topics

---

### 6. Skill Map

展示：

```text
Covered
Partial
Missing
No Evidence
```

每个 Skill 显示：

- Importance
- Candidate Level
- Evidence Count
- Source

---

### 7. Project Library

用户维护真实项目：

- Name
- Description
- Problem
- Architecture
- Technologies
- Contributions
- Results
- Links

AI 可以帮助：

- 重构 Project Description
- 找出 Skill Evidence
- 生成 Resume Bullet Draft

---

### 8. Project Gap Recommendation

如果某高优先级 Skill 无 Evidence：

AI 推荐：

- Suggested Project
- Why
- Skills Covered
- Learning Prerequisites
- Suggested Deliverables
- Interview Questions

推荐项目默认状态：

```text
Suggested
```

不能进入 Resume。

---

### 9. Role Base Resume

基于：

```text
Candidate Context
+
Role Context
```

生成 Base Resume。

V1 支持：

- Summary
- Experience
- Projects
- Skills
- Education

支持编辑。

---

### 10. Job Import

V1 必须支持：

```text
Paste Job Description
```

URL 自动解析可以作为 P1。

---

### 11. Job Match

输出：

- Match Score
- Strong Match
- Partial Match
- Missing Skills
- Evidence Gap
- Match Explanation

---

### 12. Optimization Advice

输出：

```text
Recommended Actions
```

每个 Action 需要：

- Priority
- Reason
- Target Section
- Suggested Change

---

### 13. Tailored Resume

基于 Job Context 生成新 Resume Version。

要求：

- 不覆盖 Base Resume
- 保存版本
- 可查看和编辑
- 所有内容必须基于 Candidate Evidence

---

### 14. Application Tracker

最小状态：

```text
Saved
Preparing
Applied
Interview
Offer
Rejected
```

每个 Application 关联：

- Job
- Match Result
- Resume Version
- Status
- Notes

---

# 28. V1 P1 功能

完成 P0 后增加：

### Job URL Parsing

支持粘贴：

```text
https://company.com/jobs/xxx
```

自动提取 JD。

---

### Resume PDF Export

提供若干固定模板。

---

### Role Readiness

例如：

```text
Role Readiness: 72%
```

基于：

- High Priority Skills
- Evidence Coverage
- Resume Completion

必须可解释。

---

### Next Best Actions

Dashboard 自动生成：

- Skill Gap
- Resume Task
- Job Task
- Application Task

---

### Basic Interview Prep

当 Application = Interview 时生成：

- Likely Topics
- Resume Deep Dive Questions
- Risk Areas
- Suggested Preparation

---

# 29. V1 明确不做

以下功能不进入 V1：

- LinkedIn 自动抓取职位
- Job Aggregator
- 自动申请
- 自动提交申请表
- 浏览器登录态管理
- 自动海投
- 自动联系 Recruiter
- 完整 Voice Mock Interview
- 完整 Interview Scoring
- Company Research Browser Agent
- Scheduled Job Search
- Team
- Recruiter Product
- Mobile App
- Community
- Job Marketplace
- 复杂订阅系统

---

# 30. V1 页面规划

## `/`

Landing Page

---

## `/dashboard`

内容：

### Current Role

```text
AI Agent Engineer
Readiness 72%
```

### Next Best Actions

### Recent Applications

### Skill Gaps

---

## `/roles`

Role 列表。

---

## `/roles/:roleId`

Role Overview。

显示：

- Role Summary
- Readiness
- Skill Coverage
- Project Coverage
- Base Resume Status
- Applications

---

## `/roles/:roleId/knowledge`

Role Sources。

支持：

- Upload Resume
- Paste JD
- Add Note

---

## `/roles/:roleId/skills`

Role Skill Map。

---

## `/roles/:roleId/projects`

相关项目。

---

## `/roles/:roleId/resume`

Base Resume。

---

## `/roles/:roleId/applications`

Application List / Kanban。

---

## `/roles/:roleId/applications/:applicationId`

Job Workspace：

```text
Overview
Match
Resume
Notes
Interview
```

---

## `/profile`

Candidate Context。

---

# 31. V1 Job Workspace 页面结构

```text
Acme AI
AI Agent Engineer

Match 82%
Status: Preparing

Tabs

Overview
Match
Resume
Notes
```

## Overview

- JD
- Company
- Role
- Location
- Requirements

## Match

- Strong Match
- Partial Match
- Missing
- Evidence Gap
- Recommended Actions

## Resume

- Base Resume
- Tailored Resume
- Diff
- Edit
- Export

## Notes

用户自由记录。

---

# 32. V1 推荐 Dashboard

```text
Good evening

AI Agent Engineer

Role Readiness
72%

Skills
12 / 18 covered

Projects
3 relevant

Base Resume
Ready

Applications
8

--------------------------------

Next Best Actions

[High] Add evidence for Agent Evaluation
[High] Tailor resume for Acme AI
[Medium] Improve Project A bullet
[Medium] Finish Docker learning task

--------------------------------

Recent Applications

Acme AI        Preparing
Stripe         Applied
Startup X      Interview
```

---

# 33. V1 AI Actions

建议不要一开始做通用聊天窗口。

优先做明确 Action：

```text
Analyze Role Sources
Generate Skill Map
Analyze Skill Gap
Recommend Project
Extract Project Evidence
Generate Resume Bullet
Generate Base Resume
Analyze Job
Analyze Match
Generate Optimization Advice
Tailor Resume
Generate Basic Interview Prep
```

明确 Action 比“Ask AI Anything”更容易控制质量。

---

# 34. V1 Resume 数据原则

Resume Section 内容建议结构化存储。

例如：

```json
{
  "summary": "",
  "experience": [],
  "projects": [],
  "skills": [],
  "education": []
}
```

不要将整份简历只存为 Markdown 或 HTML。

这样方便：

- AI 修改单独字段
- Diff
- Resume Version
- PDF Export
- Template 切换
- ATS Analysis

---

# 35. Resume Versioning

建议：

```text
Role Base Resume
v1
v2

Job Application
└── Tailored Resume v1
    Tailored Resume v2
```

每次 AI 修改：

```text
Generate Draft
↓
Preview Diff
↓
Accept / Reject
```

---

# 36. Match Score 建议

V1 不建议假装拥有“官方 ATS 算法”。

应该明确这是：

> AI-assisted role match assessment

Match Score 可以由几个维度组成：

```text
Required Skills       35%
Experience            20%
Project Evidence      20%
Preferred Skills      10%
Education             5%
Keyword Alignment     10%
```

最终分数必须显示 Breakdown。

---

# 37. Role Readiness 建议

例如：

```text
Role Readiness =

Skill Coverage
+
Evidence Coverage
+
Project Coverage
+
Resume Completion
```

它衡量：

> 用户为这一类岗位准备到了什么程度。

而不是预测用户拿 Offer 的概率。

---

# 38. V1 数据关系示意

```text
User
│
├── CandidateProfile
│
├── CandidateSkills
│
├── Projects
│
└── Roles
    │
    ├── RoleSources
    ├── RoleSkills
    ├── BaseResume
    │
    └── Applications
        │
        ├── Job
        ├── MatchAnalysis
        ├── ResumeVersion
        └── Interview
```

---

# 39. V1 成功标准

## 产品成功

用户能够在一个 Role Workspace 中完成：

```text
建立岗位上下文
→ 看懂自己的差距
→ 完善真实项目
→ 生成基础简历
→ 导入具体 JD
→ 得到匹配分析
→ 生成定制简历
→ 记录投递
```

---

## UX 成功

新用户应能够在较短路径内完成：

```text
创建 Role
↓
录入 Profile
↓
添加至少一个 Role Source
↓
看到第一版 Skill Gap
```

---

## AI 成功

AI 输出需要：

- 有依据
- 可解释
- 不虚构
- 可编辑
- 可回退

---

# 40. V1 核心指标

早期不需要复杂增长指标。

重点关注：

### Activation

完成以下动作的用户比例：

```text
Create Role
+
Complete Candidate Profile
+
Generate Skill Map
```

---

### Core Value

用户是否继续完成：

```text
Create Base Resume
Import Job
Generate Match Analysis
Generate Tailored Resume
```

---

### Retention Signal

用户是否：

- 添加第二个 Job
- 更新 Project
- 更新 Skill
- 继续维护 Application

---

# 41. 后续 Roadmap

## V1

```text
Role Context
Candidate Context
Skill Gap
Projects
Base Resume
Job Match
Tailored Resume
Application Tracker
```

---

## V1.5

```text
Job URL Import
Resume PDF Export
Resume Diff
Next Best Actions
Basic Interview Prep
```

---

## V2

```text
Company Research Agent
Advanced Interview Prep
Mock Interview
Interview Debrief
Learning Plan
Knowledge Graph
```

---

## V3

```text
Browser Extension
Job Capture
Assisted Apply
Job Alerts
Scheduled Research
Application Analytics
```

---

# 42. 与现有开源项目的关系

## Reactive Resume

https://github.com/amruthpillai/reactive-resume

适合作为以下部分的参考或工程基础：

- Resume Data Model
- Resume Builder
- PDF / DOCX Export
- Template System
- Auth
- Database
- Application Tracker
- ATS Check
- TanStack / TypeScript Monorepo Architecture

但产品信息架构不应继续以：

```text
Resume
Applications
```

为中心。

本产品需要改成：

```text
Role
↓
Context
Skills
Projects
Resume
Applications
Interview
```

---

## JobPilot

https://github.com/adrianhajdin/job_pilot

适合作为以下能力的参考：

- Job Matching
- Skill Gap
- Company Research Agent
- Browser Automation
- Agent Workflow
- Job Intelligence

但 V1 不应该引入：

- 自动投递
- LinkedIn 登录态
- 浏览器自动提交
- 大型职位聚合

---

# 43. 产品差异化总结

本产品不是：

### Resume Builder

因为用户不只是写简历。

---

不是：

### Job Tracker

因为用户不只是管理投递。

---

不是：

### ATS Checker

因为用户真正缺失的是能力和证据。

---

不是：

### Auto Apply Bot

因为海投不是核心价值。

---

真正的产品定位是：

> **AI Role Preparation & Job Application Workspace**

核心逻辑：

```text
Understand the role.
Build the evidence.
Tailor the application.
Prepare for the interview.
Learn from the outcome.
```

---

# 44. V1 推荐一句话定位

英文：

> Build the skills, evidence, and resume you need for the role you want.

或者：

> From target role to tailored application, in one AI workspace.

中文：

> 从目标岗位出发，补齐能力、项目和简历，再完成每一次针对性投递。

---

# 45. 当前建议的开发优先级

如果接下来进入开发，建议顺序：

```text
01. 数据模型
02. Candidate Profile
03. Role Workspace
04. Role Sources
05. Role Context AI
06. Skill Map
07. Project Evidence
08. Base Resume
09. Job Import
10. Match Analysis
11. Tailored Resume
12. Application Tracker
13. Dashboard / Next Best Actions
```

不要首先开发：

```text
PDF 模板
复杂动画
Browser Agent
Auto Apply
复杂 Analytics
Subscription
```

先验证核心上下文闭环是否成立。

---

# 46. 最终 V1 产品闭环

```text
I want to become
AI Agent Engineer
        │
        ▼
Understand Role
        │
        ▼
Compare Myself
        │
        ▼
Fill Skill / Evidence Gaps
        │
        ▼
Build Role Resume
        │
        ▼
Paste Job
        │
        ▼
Analyze Match
        │
        ▼
Improve Application
        │
        ▼
Generate Tailored Resume
        │
        ▼
Track Application
```

V1 只要把这条链路做顺，就已经形成一个独立且有明显价值的产品。

后续所有 Interview、Agent、Learning、Automation 功能，都应该围绕这条核心链路继续扩展，而不是改变产品中心。
