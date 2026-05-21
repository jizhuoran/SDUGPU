# Tensara 本地部署指南

在自有 GPU 服务器上部署 Tensara，用 Docker 容器隔离替代 Modal 云服务。

## 硬件要求

- NVIDIA GPU（至少 8GB 显存，推荐 16GB+）
- Ubuntu 22.04 / 24.04
- 16GB+ 内存

本指南以 **RTX 4060 Ti (16GB)** 为例，其他 GPU 同理。

## 1. 安装 NVIDIA 驱动

```bash
# 检查驱动是否已安装
nvidia-smi

# 如未安装，用 Ubuntu 驱动管理器
sudo apt update
sudo apt install -y nvidia-driver-550
sudo reboot
```

## 2. 安装 CUDA Toolkit

```bash
# 下载 CUDA Toolkit 12.x（需包含 nvcc）
wget https://developer.download.nvidia.com/compute/cuda/12.8.0/local_installers/cuda_12.8.0_570.86.10_linux.run
sudo sh cuda_12.8.0_570.86.10_linux.run --toolkit --silent --override

# 添加到 PATH（写入 ~/.bashrc）
echo 'export PATH=/usr/local/cuda/bin:$PATH' >> ~/.bashrc
echo 'export LD_LIBRARY_PATH=/usr/local/cuda/lib64:$LD_LIBRARY_PATH' >> ~/.bashrc
source ~/.bashrc

# 验证
nvcc --version
```

## 3. 安装 Docker + GPU 支持

```bash
# 安装 Docker
curl -fsSL https://get.docker.com | sudo sh
sudo usermod -aG docker $USER

# 安装 nvidia-container-toolkit
sudo mkdir -p /usr/share/keyrings
curl -fsSL https://nvidia.github.io/libnvidia-container/gpgkey \
  | sudo gpg --dearmor -o /usr/share/keyrings/nvidia-container-toolkit-keyring.gpg

curl -s -L https://nvidia.github.io/libnvidia-container/stable/deb/nvidia-container-toolkit.list \
  | sed 's#deb https://#deb [signed-by=/usr/share/keyrings/nvidia-container-toolkit-keyring.gpg] https://#g' \
  | sudo tee /etc/apt/sources.list.d/nvidia-container-toolkit.list

sudo apt-get update
sudo apt-get install -y nvidia-container-toolkit
sudo nvidia-ctk runtime configure --runtime=docker
sudo systemctl restart docker

# 重新登录让 docker 用户组生效
newgrp docker

# 验证 Docker GPU 访问
docker run --rm --gpus all nvidia/cuda:12.8.0-base-ubuntu24.04 nvidia-smi
```

## 4. 安装 Node.js + pnpm

```bash
# 安装 Node.js 20+
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt-get install -y nodejs

# 安装 pnpm
npm install -g pnpm

# 验证
node --version
pnpm --version
```

## 5. 克隆项目 & 安装依赖

```bash
git clone https://github.com/tensara/tensara.git
cd tensara

# 安装 Node 依赖
pnpm install

# 安装 engine Python 依赖
pip install fastapi uvicorn simplejson
```

## 6. 配置环境变量

```bash
cp .env.example .env
```

编辑 `.env`，填入以下内容：

```ini
# 数据库（本地 PostgreSQL）
DATABASE_URL="postgresql://postgres:password@localhost:5432/tensara-app"

# GitHub OAuth（去 github.com/settings/developers 创建 OAuth App）
AUTH_SECRET="随便生成一个随机字符串"
AUTH_GITHUB_ID="你的 GitHub OAuth Client ID"
AUTH_GITHUB_SECRET="你的 GitHub OAuth Client Secret"

# 评测引擎 — 指向本地 FastAPI 服务
MODAL_ENDPOINT="http://localhost:8000"

# 以下可以留空
NEXT_PUBLIC_GA_ID=""
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=""
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=""

# 前端地址
NEXT_PUBLIC_BASE_URL="http://localhost:3000"
```

## 7. 启动数据库

```bash
# 需要先创建 .env 再执行（脚本会读取 DATABASE_URL）
chmod +x start-database.sh
./start-database.sh
```

## 8. 初始化数据库表结构

```bash
npx prisma db push
```

## 9. 构建 GPU 评测 Docker 镜像

```bash
cd engine
docker build -t tensara-engine .
cd ..
```

验证：

```bash
echo '{"type":"checker","language":"cuda","solution_code":"extern \"C\" void solution() {}","problem_name":"test","problem_def":"","gpu":"RTX_4060_Ti"}' \
  | docker run --rm --gpus all -i tensara-engine
```

## 10. 启动服务

需要开两个终端：

**终端 1 — 评测引擎 API：**

```bash
cd engine
python api_local.py
# 监听 http://localhost:8000
```

如果有多个 GPU 或不同型号，设置 `ENGINE_PORT` 环境变量：

```bash
ENGINE_PORT=8000 python api_local.py
```

**终端 2 — Next.js 前端：**

```bash
cd tensara
pnpm dev
# 监听 http://localhost:3000
```

## 11. 打开浏览器

访问 `http://localhost:3000`，用 GitHub 账号登录即可开始使用。

## 架构说明

```
浏览器 ──SSE──> Next.js (:3000) ──HTTP──> api_local.py (:8000)
                                              │
                                              ├── Docker 容器隔离
                                              │   ├── --gpus all
                                              │   ├── --network=none
                                              │   ├── --read-only
                                              │   └── --memory=14g
                                              │
                                              └── 容器内: NVCC/Mojo 编译 → GPU 执行 → 输出结果
```

## 安全措施

Docker 容器隔离：

| 措施 | 说明 |
|------|------|
| `--network=none` | 用户代码无法联网 |
| `--read-only` | 只读文件系统，/tmp 除外 |
| `--security-opt no-new-privileges` | 禁止权限提升 |
| `--memory=14g` | 限制最大内存 |
| `--pids-limit=200` | 限制进程数 |
| `runner` 用户（非 root） | 容器内以普通用户执行 |
| 代码黑名单扫描 | `utils.py` 检测 forbidden patterns（`system()`、`exec()`、`thrust::`、`std::sort` 等） |

## 故障排查

**Docker GPU 不可用：**
```bash
sudo nvidia-ctk runtime configure --runtime=docker
sudo systemctl restart docker
docker run --rm --gpus all nvidia/cuda:12.8.0-base-ubuntu24.04 nvidia-smi
```

**NVCC 找不到：**
```bash
export PATH=/usr/local/cuda/bin:$PATH
```

**数据库连接失败：**
```bash
docker ps | grep tensara-app-postgres
# 如果没有运行中容器，重新启动
./start-database.sh
```

**编译错误 "compute capability not supported"：**
检查 Dockerfile 中的 CUDA 版本是否 ≤ 你的驱动支持的版本。
RTX 4060 Ti compute capability 是 8.9，CUDA 12.0+ 都支持。
