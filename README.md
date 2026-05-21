# SDUGPU

<div align="center">
  <img width="120" alt="Shandong University emblem" src="./public/sdu-logo.svg" />
</div>

SDUGPU 是一个面向山东大学内部使用的 GPU 编程练习平台。用户可以在网页里阅读题目、编写 CUDA/Triton 等 GPU kernel、运行样例，并把代码提交到平台提供的 GPU 上进行正确性检查和性能评测。

本项目从 [Tensara](https://github.com/tensara/tensara) 适配而来，保留了题目、提交、评测和结果展示等核心能力，并针对 SDUGPU 做了本地化、认证和评测引擎改造。

## 当前能力

- 题目练习：支持 GPU 编程题目、样例运行、正式提交和性能结果查看。
- 双语界面：网站显示语言支持中文和英文切换；提交语言选择保持独立。
- SDU 邮箱登录：允许 `@sdu.edu.cn` 和 `@mail.sdu.edu.cn` 邮箱登录。
- 平台 GPU 评测：用户不需要选择 GPU，提交会使用服务器当前可用的 GPU，并在结果中展示 GPU 信息。
- 串行评测：本地评测引擎对 GPU 执行加锁，多个提交会排队，避免并发提交互相抢占显存和算力。
- 参考答案：题目页面可以展示参考实现，便于教学和调试。

## 目录结构

```text
src/          Next.js 前端和服务端 API
engine/       GPU 评测引擎，本地 FastAPI + Docker runner
prisma/       数据库 schema、迁移和种子数据
scripts/      题库导入、审计和维护脚本
public/       静态资源，包括 SDU 标志
```

## 本地开发

常用路径：

```bash
# 前端代码
cd ~/tensara/src

# 评测引擎
cd ~/tensara/engine

# 数据库
cd ~/tensara/prisma

# 配置文件
vim ~/tensara/.env
```

安装依赖：

```bash
cd ~/tensara
pnpm install
```

初始化数据库：

```bash
cd ~/tensara
./start-database.sh
pnpm db:push
pnpm tsx prisma/seed.ts
```

构建评测镜像：

```bash
cd ~/tensara/engine
docker build -t tensara-engine .
```

启动服务需要两个终端：

```bash
# 终端 1：评测引擎
cd ~/tensara/engine
sg docker -c "python3 api_local.py"
```

```bash
# 终端 2：前端
cd ~/tensara
pnpm dev
```

默认访问地址：

```text
http://localhost:3000
```

## 环境变量

最小可用配置示例：

```ini
DATABASE_URL="postgresql://postgres:password@localhost:5432/tensara-app"
AUTH_SECRET="please-change-me"
NEXT_PUBLIC_BASE_URL="http://localhost:3000"
MODAL_ENDPOINT="http://localhost:8000"

AUTH_GITHUB_ID=""
AUTH_GITHUB_SECRET=""
NEXT_PUBLIC_GA_ID=""
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=""
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=""
```

GitHub OAuth 是可选的。SDUGPU 当前主要使用 SDU 邮箱登录：邮箱后缀必须是 `sdu.edu.cn` 或 `mail.sdu.edu.cn`，密码为邮箱 `@` 前面的用户名。

## 评测引擎

前端通过 `MODAL_ENDPOINT` 调用本地评测 API。`engine/api_local.py` 会把用户提交放入 Docker 容器中执行，并启用以下隔离措施：

- `--gpus all`：允许容器访问服务器 GPU。
- `--network=none`：用户代码无法联网。
- `--read-only`：容器文件系统只读，临时目录除外。
- `--memory=14g`：限制容器内存。
- `--pids-limit=200`：限制进程数量。
- `no-new-privileges`：禁止权限提升。

单次容器执行超时时间为 5 分钟。多个提交会在评测引擎内串行执行。

## 常用维护命令

```bash
# 类型检查和 lint
pnpm check

# 导入 Tensara 题库到本地格式
pnpm import:tensara-problems

# 审计本地题库和参考实现
pnpm audit:local-problems

# 查看数据库
pnpm db:studio
```

## 来源说明

SDUGPU 基于 Tensara 进行适配开发。原项目由 Tensara 团队开源，SDUGPU 在此基础上调整了品牌、界面语言、认证方式、GPU 选择逻辑、本地 Docker 评测引擎和题库内容。
