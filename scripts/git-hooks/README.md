# Git Hooks

这个目录包含了项目的 Git hooks，用于确保代码质量和提交规范。

## 已安装的 Hooks

### 1. pre-commit
在执行 `git commit` 之前运行，执行以下检查：

- **ESLint 检查**：确保代码符合项目的代码规范
- **TypeScript 类型检查**：确保没有类型错误
- **构建检查**：确保项目可以成功构建

如果任何检查失败，提交将被阻止。

### 2. commit-msg
验证提交信息的格式：

- **格式验证**：推荐使用 Conventional Commits 格式
- **长度检查**：第一行最多 72 个字符，最少 10 个字符
- **非空检查**：确保提交信息不为空

## Conventional Commits 格式

推荐使用以下格式：

```
type(scope): description

[optional body]

[optional footer(s)]
```

### 类型说明

- `feat`: 新功能
- `fix`: 修复 bug
- `docs`: 文档更新
- `style`: 代码格式调整（不影响功能）
- `refactor`: 代码重构
- `test`: 添加或修改测试
- `chore`: 构建过程或辅助工具的变动
- `perf`: 性能优化
- `ci`: CI 配置文件和脚本的变动
- `build`: 构建系统或外部依赖的变动
- `revert`: 回滚之前的提交
- `wip`: 工作进行中

### 示例

```bash
feat(auth): add user authentication
fix(blog): resolve image loading issue
docs(readme): update installation instructions
style(components): improve code formatting
refactor(api): simplify user service
```

## 使用方法

### 正常提交

```bash
git add .
git commit -m "feat: add new feature"
```

### 跳过 Hook（不推荐）

如果确实需要跳过 hook 检查：

```bash
git commit --no-verify -m "your message"
```

### 修复 Hook 错误

如果 hook 检查失败：

1. **ESLint 错误**：
   ```bash
   pnpm lint
   # 根据错误信息修复代码
   ```

2. **TypeScript 错误**：
   ```bash
   pnpm typecheck
   # 根据错误信息修复类型问题
   ```

3. **构建错误**：
   ```bash
   pnpm build
   # 根据构建错误修复问题
   ```

## 自定义 Hook

如需修改 hook 行为，请编辑对应的文件：

- `pre-commit`: 修改预提交检查
- `commit-msg`: 修改提交信息验证

修改后无需额外配置，立即生效。

## 注意事项

1. **权限**：确保 hook 文件有执行权限
2. **团队协作**：这些 hooks 只在本地生效，团队成员需要单独安装
3. **备份**：建议将 hook 文件备份到版本控制中
4. **性能**：pre-commit hook 会增加提交时间，但能提高代码质量

## 团队安装

团队成员可以通过以下命令安装 hooks：

```bash
# 复制 hook 文件到 .git/hooks 目录
cp scripts/git-hooks/* .git/hooks/
chmod +x .git/hooks/*
```

或者使用 symbolic link：

```bash
# 创建链接（推荐，便于统一管理）
ln -s ../../scripts/git-hooks/pre-commit .git/hooks/pre-commit
ln -s ../../scripts/git-hooks/commit-msg .git/hooks/commit-msg
```