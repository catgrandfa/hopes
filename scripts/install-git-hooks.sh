#!/bin/bash

# Git Hooks 安装脚本
# 用于在项目中安装 Git hooks

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_success() {
    echo "${GREEN}✅ $1${NC}"
}

print_error() {
    echo "${RED}❌ $1${NC}"
}

print_warning() {
    echo "${YELLOW}⚠️  $1${NC}"
}

print_info() {
    echo "${BLUE}ℹ️  $1${NC}"
}

# 检查是否在 Git 仓库中
if [ ! -d ".git" ]; then
    print_error "这不是一个 Git 仓库。请在项目根目录运行此脚本。"
    exit 1
fi

# 检查 hooks 目录是否存在
HOOKS_DIR="scripts/git-hooks"
if [ ! -d "$HOOKS_DIR" ]; then
    print_error "Git hooks 目录不存在：$HOOKS_DIR"
    exit 1
fi

print_info "开始安装 Git hooks..."

# 创建 .git/hooks 目录（如果不存在）
mkdir -p .git/hooks

# 安装 hooks
hooks=("pre-commit" "commit-msg")

for hook in "${hooks[@]}"; do
    if [ -f "$HOOKS_DIR/$hook" ]; then
        # 检查是否已存在
        if [ -f ".git/hooks/$hook" ]; then
            print_warning "$hook 已存在，将备份为 $hook.backup"
            cp ".git/hooks/$hook" ".git/hooks/$hook.backup"
        fi

        # 复制 hook 文件
        cp "$HOOKS_DIR/$hook" ".git/hooks/$hook"
        chmod +x ".git/hooks/$hook"
        print_success "安装 $hook"
    else
        print_error "Hook 文件不存在：$HOOKS_DIR/$hook"
    fi
done

# 复制 README 文件
if [ -f "$HOOKS_DIR/README.md" ]; then
    cp "$HOOKS_DIR/README.md" ".git/hooks/"
    print_success "安装 README.md"
fi

print_success "Git hooks 安装完成！"
echo ""
print_info "现在每次提交时，都会自动运行以下检查："
echo "  • ESLint 代码规范检查"
echo "  • TypeScript 类型检查"
echo "  • 项目构建检查"
echo "  • 提交信息格式验证"
echo ""
print_info "如需跳过检查，可以使用：git commit --no-verify"
echo ""
print_info "更多信息请查看：.git/hooks/README.md"