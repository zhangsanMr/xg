# 贡献指南

欢迎为 CICC 项目做出贡献！在开始之前，请阅读以下指南。

## 📋 目录
- [开发环境设置](#开发环境设置)
- [开发流程](#开发流程)
- [代码规范](#代码规范)
- [提交规范](#提交规范)
- [常见问题](#常见问题)

---

## 开发环境设置

### 1. 环境要求
- **Node.js**: >= 18.0.0
- **npm**: >= 8.0.0
- **Git**: 最新版本
- **编辑器**: 推荐使用 VS Code

### 2. 克隆项目
```bash
git clone <repository-url>
cd cicc
```

### 3. 安装依赖
```bash
npm install
```

### 4. VS Code 配置
项目已包含 `.vscode/settings.json` 和 `.vscode/extensions.json`。

**推荐安装的扩展：**
- Vue - Official (Volar)
- ESLint
- Prettier - Code formatter
- EditorConfig for VS Code

首次打开项目时，VS Code 会提示安装推荐的扩展。

### 5. 启动开发服务器
```bash
npm run dev
```

访问 http://localhost:5173/

---

## 开发流程

### 1. 创建新分支
```bash
# 新功能
git checkout -b feature/your-feature-name

# Bug 修复
git checkout -b fix/bug-description

# 重构
git checkout -b refactor/refactor-description
```

### 2. 开发和测试
```bash
# 启动开发服务器
npm run dev

# 类型检查
npm run type-check

# 运行 Lint 检查
npm run lint

# 自动修复 Lint 问题
npm run lint:fix

# 格式化代码
npm run format

# 检查代码格式
npm run format:check

# 构建项目
npm run build
```

### 3. 提交代码前检查清单

在提交代码前，请确保：

- [ ] 代码已通过类型检查 (`npm run type-check`)
- [ ] 代码已通过 ESLint 检查 (`npm run lint`)
- [ ] 代码已格式化 (`npm run format`)
- [ ] 项目可以正常构建 (`npm run build`)
- [ ] 功能测试通过
- [ ] 没有遗留 `console.log` 或调试代码
- [ ] 提交信息符合规范

### 4. 提交代码
```bash
# 查看修改
git status
git diff

# 添加文件
git add .

# 提交（遵循 Conventional Commits 规范）
git commit -m "feat(i18n): 添加德语支持"

# 推送到远程仓库
git push origin feature/your-feature-name
```

### 5. 创建 Pull Request
1. 在 GitHub/GitLab 上创建 Pull Request
2. 填写 PR 描述（说明改动内容和原因）
3. 等待代码审查
4. 根据反馈修改代码

---

## 代码规范

### 遵循项目规范文档
详细规范请查看 [RULES.md](./RULES.md)

### 关键点
- 使用 TypeScript 并正确定义类型
- 组件使用 Composition API 和 `<script setup>`
- 样式使用 `scoped` 属性
- Props 必须定义类型和默认值
- 遵循命名规范（文件名、变量名、函数名等）

### 代码示例

#### Vue 组件
```vue
<script setup lang="ts">
import { ref, computed } from 'vue'

interface Props {
  title: string
  count?: number
}

const props = withDefaults(defineProps<Props>(), {
  count: 0
})

const emit = defineEmits<{
  'update:count': [value: number]
  'submit': []
}>()

const localCount = ref(props.count)

const doubleCount = computed(() => localCount.value * 2)

const handleClick = () => {
  localCount.value++
  emit('update:count', localCount.value)
}
</script>

<template>
  <div class="component">
    <h2>{{ title }}</h2>
    <p>Count: {{ localCount }}</p>
    <p>Double: {{ doubleCount }}</p>
    <button @click="handleClick">Increment</button>
  </div>
</template>

<style scoped>
.component {
  padding: 20px;
}
</style>
```

---

## 提交规范

### Conventional Commits 格式

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Type 类型

| Type | 说明 | 示例 |
|------|------|------|
| `feat` | 新功能 | `feat(i18n): 添加德语支持` |
| `fix` | Bug 修复 | `fix(router): 修复路由跳转问题` |
| `docs` | 文档更新 | `docs(readme): 更新安装说明` |
| `style` | 代码格式调整 | `style: 格式化代码` |
| `refactor` | 代码重构 | `refactor(api): 重构 API 调用逻辑` |
| `perf` | 性能优化 | `perf(images): 优化图片加载` |
| `test` | 测试相关 | `test(utils): 添加工具函数测试` |
| `chore` | 构建/工具配置 | `chore: 更新依赖版本` |

### Scope（可选）
表示修改的范围：
- `i18n` - 国际化相关
- `router` - 路由相关
- `api` - API 相关
- `ui` - UI 组件
- `auth` - 认证相关

### 示例

```bash
# 新功能
git commit -m "feat(i18n): 添加德语和法语支持"

# Bug 修复
git commit -m "fix(language-switcher): 修复移动端布局问题"

# 文档更新
git commit -m "docs(contributing): 添加贡献指南"

# 重构
git commit -m "refactor(components): 提取公共按钮组件"

# 性能优化
git commit -m "perf(home): 优化首页加载性能"

# 完整示例（包含 body 和 footer）
git commit -m "feat(api): 添加用户认证 API

- 实现登录接口
- 实现注册接口
- 添加 token 刷新机制

Closes #123"
```

---

## 添加新语言

### 步骤

1. **创建语言文件**
```bash
# 在 src/i18n/locales/ 目录创建新文件
touch src/i18n/locales/de.ts
```

2. **复制并翻译内容**
```typescript
// src/i18n/locales/de.ts
export default {
  security: {
    checking: 'Sicherheitsüberprüfung läuft...',
    // ... 其他翻译
  },
  service: {
    // ...
  },
  company: {
    // ...
  }
}
```

3. **注册语言**
```typescript
// src/i18n/index.ts
import de from './locales/de'

const i18n = createI18n({
  // ...
  messages: {
    'zh-TW': zhTW,
    'zh-CN': zhCN,
    'en': en,
    'ja': ja,
    'ko': ko,
    'vi': vi,
    'de': de  // 新增
  }
})
```

4. **添加切换按钮**
```vue
<!-- src/views/Introduce.vue -->
<button @click="changeLanguage('de')" :class="{ active: currentLocale === 'de' }">
  Deutsch
</button>
```

5. **测试**
```bash
npm run dev
# 测试语言切换是否正常
```

6. **提交**
```bash
git add .
git commit -m "feat(i18n): 添加德语支持"
```

---

## 常见问题

### Q: ESLint 报错怎么办？
```bash
# 自动修复大部分问题
npm run lint:fix

# 手动修复剩余问题
npm run lint
```

### Q: Prettier 格式化不生效？
确保：
1. 安装了 Prettier 扩展
2. VS Code 设置中启用了 `editor.formatOnSave`
3. 手动格式化：`npm run format`

### Q: TypeScript 类型错误？
```bash
# 运行类型检查
npm run type-check

# 查看详细错误信息
npm run build
```

### Q: 如何调试？
1. 使用浏览器开发者工具
2. 在代码中使用断点
3. 使用 Vue Devtools 扩展

### Q: 依赖安装失败？
```bash
# 清理缓存
rm -rf node_modules package-lock.json
npm cache clean --force

# 重新安装
npm install
```

---

## 获取帮助

- 查看 [RULES.md](./RULES.md) - 详细开发规范
- 查看 [LANGUAGES.md](./LANGUAGES.md) - 多语言配置指南
- 查看 [PROJECT_INFO.md](./PROJECT_INFO.md) - 项目详细说明
- 查看 [CHANGELOG.md](./CHANGELOG.md) - 更新日志

---

## 感谢你的贡献！ 🎉

每一个贡献都让项目变得更好！
