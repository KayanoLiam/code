# uv - 现代 Python 包管理器

## 什么是 uv？

`uv` 是一个用 Rust 编写的极快的 Python 包管理器和项目管理工具，由 Astral 团队开发（也就是开发 Ruff 的团队）。它的设计目标是替代传统的 `pip`、`pip-tools`、`pipx`、`poetry`、`pyenv`、`virtualenv` 等工具，提供一个统一、快速的解决方案。

## 为什么选择 uv？

### 🚀 极致的速度
- **比 pip 快 10-100 倍**：得益于 Rust 的性能和并行下载
- **智能缓存**：避免重复下载相同的包
- **并行安装**：同时处理多个包的安装

### 🎯 简单易用
- **零配置**：开箱即用，无需复杂设置
- **统一工具**：一个工具解决所有 Python 环境管理需求
- **兼容性好**：与现有的 Python 生态系统完全兼容

### 🔧 功能全面
- 包管理（替代 pip）
- 虚拟环境管理（替代 virtualenv/venv）
- Python 版本管理（替代 pyenv）
- 项目依赖锁定（替代 pip-tools）
- 全局工具安装（替代 pipx）

## 安装 uv

### macOS 和 Linux
```bash
# 使用官方安装脚本（推荐）
curl -LsSf https://astral.sh/uv/install.sh | sh

# 或者使用 Homebrew（macOS）
brew install uv

# 或者使用 pip
pip install uv
```

### Windows
```powershell
# 使用 PowerShell
powershell -c "irm https://astral.sh/uv/install.ps1 | iex"

# 或者使用 pip
pip install uv
```

### 验证安装
```bash
uv --version
```

## 基本使用

### 1. 创建新项目
```bash
# 创建一个新的 Python 项目
uv init my-project
cd my-project

# 查看项目结构
ls -la
# 会看到：
# pyproject.toml  # 项目配置文件
# README.md       # 项目说明
# src/            # 源代码目录
# .python-version # Python 版本文件
```

### 2. Python 版本管理
```bash
# 安装特定版本的 Python
uv python install 3.12

# 列出可用的 Python 版本
uv python list

# 设置项目使用的 Python 版本
uv python pin 3.12
```

### 3. 虚拟环境管理
```bash
# uv 会自动创建和管理虚拟环境，但你也可以手动操作

# 创建虚拟环境
uv venv

# 激活虚拟环境（可选，uv 命令会自动使用）
source .venv/bin/activate  # Linux/macOS
# 或
.venv\Scripts\activate     # Windows
```

### 4. 包管理
```bash
# 添加依赖
uv add requests
uv add "django>=4.0"
uv add pytest --dev  # 开发依赖

# 安装所有依赖
uv sync

# 移除依赖
uv remove requests

# 更新依赖
uv lock --upgrade
uv sync
```

### 5. 运行代码
```bash
# 运行 Python 脚本
uv run python main.py

# 运行模块
uv run -m pytest

# 运行项目中的脚本
uv run my-script
```

## 项目配置文件 (pyproject.toml)

uv 使用标准的 `pyproject.toml` 文件来管理项目配置：

```toml
[project]
name = "my-project"
version = "0.1.0"
description = "我的 Python 项目"
authors = [
    {name = "Your Name", email = "your.email@example.com"}
]
dependencies = [
    "requests>=2.25.0",
    "click>=8.0.0",
]

[project.optional-dependencies]
dev = [
    "pytest>=6.0.0",
    "black>=22.0.0",
    "ruff>=0.1.0",
]

[build-system]
requires = ["hatchling"]
build-backend = "hatchling.build"

[tool.uv]
dev-dependencies = [
    "pytest>=6.0.0",
    "black>=22.0.0",
]
```

## 常用命令速查

| 命令 | 说明 |
|------|------|
| `uv init` | 创建新项目 |
| `uv add <package>` | 添加依赖 |
| `uv remove <package>` | 移除依赖 |
| `uv sync` | 同步依赖（安装/更新） |
| `uv lock` | 生成锁定文件 |
| `uv run <command>` | 在项目环境中运行命令 |
| `uv python install <version>` | 安装 Python 版本 |
| `uv python list` | 列出 Python 版本 |
| `uv venv` | 创建虚拟环境 |
| `uv pip install <package>` | 使用 uv 的 pip 兼容模式 |

## 从其他工具迁移

### 从 pip + virtualenv
```bash
# 旧方式
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# 新方式
uv venv
uv pip install -r requirements.txt
# 或者更好的方式：
uv init
uv add $(cat requirements.txt)
```

### 从 Poetry
```bash
# uv 可以直接读取 pyproject.toml
uv sync  # 相当于 poetry install
```

### 从 Pipenv
```bash
# 从 Pipfile 迁移
uv init
# 手动将 Pipfile 中的依赖添加到 pyproject.toml
```

## 最佳实践

1. **始终使用 `uv run`**：确保在正确的环境中运行代码
2. **提交锁定文件**：将 `uv.lock` 文件提交到版本控制
3. **分离开发依赖**：使用 `--dev` 标志或 `[tool.uv.dev-dependencies]`
4. **固定 Python 版本**：使用 `uv python pin` 确保团队使用相同版本
5. **定期更新**：使用 `uv lock --upgrade` 更新依赖

## 总结

uv 是现代 Python 开发的理想选择，它：
- ⚡ **快速**：比传统工具快 10-100 倍
- 🎯 **简单**：一个工具解决所有需求
- 🔒 **可靠**：确定性的依赖解析和锁定
- 🔄 **兼容**：与现有生态系统无缝集成

如果你正在开始新的 Python 项目，强烈推荐使用 uv 作为你的包管理和环境管理工具！
