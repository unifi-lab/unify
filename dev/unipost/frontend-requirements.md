# Unipost Frontend 项目需求文档

## 📋 项目概述

**项目名称**: Unipost Frontend  
**项目类型**: Next.js 14 纯前端应用  
**技术栈**: Next.js + TypeScript + Tailwind CSS + shadcn/ui  
**数据方案**: Mock 数据 + 本地状态管理  

### 🎯 项目目标

创建一个现代化的博客翻译管理系统前端界面，用于管理多语言博客项目和文章翻译流程。

## 🏗️ 技术架构

### 核心技术栈
- **框架**: Next.js 14 (App Router)
- **语言**: TypeScript (严格模式)
- **样式**: Tailwind CSS + shadcn/ui
- **状态管理**: React Context API + useState
- **数据持久化**: localStorage
- **图标**: Lucide React

### 项目结构
```
src/
├── app/                          # Next.js App Router
│   ├── layout.tsx               # 根布局
│   ├── page.tsx                 # 首页 (重定向到 /projects)
│   ├── globals.css              # 全局样式
│   └── projects/                # 项目相关页面
│       ├── page.tsx             # 项目列表页
│       ├── new/
│       │   └── page.tsx         # 创建项目页
│       └── [id]/
│           ├── page.tsx         # 项目详情页
│           ├── edit/
│           │   └── page.tsx     # 编辑项目页
│           └── posts/
│               └── [postId]/
│                   └── page.tsx # 文章详情页
├── components/                   # 组件目录
│   ├── ui/                      # shadcn/ui 基础组件
│   ├── layout/                  # 布局组件
│   │   ├── header.tsx
│   │   ├── sidebar.tsx
│   │   └── navigation.tsx
│   ├── projects/                # 项目相关组件
│   │   ├── project-card.tsx
│   │   ├── project-form.tsx
│   │   ├── project-stats.tsx
│   │   └── project-list.tsx
│   ├── posts/                   # 文章相关组件
│   │   ├── post-table.tsx
│   │   ├── post-status-badge.tsx
│   │   ├── translation-panel.tsx
│   │   └── post-detail.tsx
│   └── common/                  # 通用组件
│       ├── language-selector.tsx
│       ├── search-bar.tsx
│       ├── pagination.tsx
│       ├── loading-spinner.tsx
│       └── confirm-dialog.tsx
├── lib/                         # 工具库
│   ├── mock-data.ts            # Mock 数据
│   ├── types.ts                # TypeScript 类型定义
│   ├── utils.ts                # 工具函数
│   ├── constants.ts            # 常量定义
│   └── storage.ts              # 本地存储工具
├── hooks/                       # 自定义 Hooks
│   ├── use-projects.ts         # 项目管理 Hook
│   ├── use-posts.ts            # 文章管理 Hook
│   ├── use-local-storage.ts    # 本地存储 Hook
│   └── use-translation.ts      # 翻译模拟 Hook
└── contexts/                    # React Context
    ├── projects-context.tsx    # 项目状态管理
    └── posts-context.tsx       # 文章状态管理
```

## 📊 数据模型

### Project 实体
```typescript
interface Project {
  id: string;
  name: string;                    // 项目名称
  ghost_api_key: string;          // Ghost API 密钥
  ghost_domain: string;           // Ghost 博客域名
  languages: string[];            // 支持的语言列表
  created_at: string;             // 创建时间
  updated_at: string;             // 更新时间
}
```

### Post 实体
```typescript
interface Post {
  id: string;
  project_id: string;             // 所属项目ID
  title: string;                  // 文章标题
  slug: string;                   // 文章别名
  content: string;                // 文章内容
  status: PostStatus;             // 翻译状态
  translations: Record<string, Translation>; // 翻译内容
  created_at: string;             // 创建时间
  updated_at: string;             // 更新时间
}

type PostStatus = 'pending' | 'translating' | 'translated' | 'error';

interface Translation {
  title: string;                  // 翻译后的标题
  content: string;                // 翻译后的内容
}
```

### 支持的语言
```typescript
const SUPPORTED_LANGUAGES = {
  'en': 'English',
  'zh-CN': '中文简体',
  'zh-TW': '中文繁體',
  'ja': '日本語',
  'ko': '한국어',
  'fr': 'Français',
  'de': 'Deutsch',
  'es': 'Español',
  'ru': 'Русский',
  'ar': 'العربية'
} as const;
```

## 🎨 UI/UX 设计规范

### 设计原则
- **简洁明了**: 界面清爽，信息层次分明
- **响应式设计**: 适配桌面端、平板端、移动端
- **一致性**: 统一的设计语言和交互模式
- **可访问性**: 支持键盘导航和屏幕阅读器

### 色彩方案
```css
:root {
  /* 主色调 */
  --primary: 220 90% 56%;          /* 蓝色 #3B82F6 */
  --primary-foreground: 0 0% 98%;  /* 白色文字 */
  
  /* 状态色 */
  --success: 142 76% 36%;          /* 绿色 #10B981 */
  --warning: 38 92% 50%;           /* 橙色 #F59E0B */
  --destructive: 0 84% 60%;        /* 红色 #EF4444 */
  
  /* 中性色 */
  --background: 0 0% 100%;         /* 背景白色 */
  --foreground: 222 84% 5%;        /* 文字深色 */
  --muted: 210 40% 96%;            /* 浅灰背景 */
  --border: 214 32% 91%;           /* 边框灰色 */
}
```

### 组件设计规范

#### 状态标签
- **pending**: 橙色背景，"待翻译"
- **translating**: 蓝色背景，"翻译中" (带脉冲动画)
- **translated**: 绿色背景，"已翻译"
- **error**: 红色背景，"翻译失败"

#### 按钮规范
- **主要按钮**: 蓝色背景，用于主要操作
- **次要按钮**: 白色背景 + 蓝色边框，用于次要操作
- **危险按钮**: 红色背景，用于删除等危险操作

#### 卡片设计
- 圆角: 8px
- 阴影: 轻微阴影效果
- 悬停: 轻微上浮 + 阴影加深
- 边框: 1px 浅灰色

## 🔧 功能模块详细设计

### 1. 项目管理模块

#### 项目列表页 (`/projects`)
**布局**: 网格布局 (桌面端 3 列，平板端 2 列，移动端 1 列)

**功能特性**:
- 项目卡片展示
- 搜索功能 (按项目名称)
- 排序功能 (按创建时间、名称)
- 创建新项目按钮
- 空状态提示

**项目卡片内容**:
- 项目名称 (标题)
- Ghost 域名 (副标题)
- 语言标签 (彩色标签)
- 统计信息 (总文章数/已翻译数)
- 创建时间
- 操作菜单 (查看、编辑、删除)

#### 创建/编辑项目页 (`/projects/new`, `/projects/[id]/edit`)
**表单字段**:
- 项目名称 (必填，最大 50 字符)
- Ghost API Key (必填，格式验证)
- Ghost 域名 (必填，URL 格式验证)
- 支持语言 (多选，至少选择 1 个)

**验证规则**:
- 项目名称不能为空且不能重复
- Ghost 域名必须是有效的 URL
- API Key 格式验证

### 2. 文章管理模块

#### 项目详情页 (`/projects/[id]`)
**页面布局**:
- 顶部: 项目信息卡片
- 中部: 统计面板 (总数、待翻译、已翻译、进度条)
- 底部: 文章列表表格

**统计面板**:
- 总文章数
- 待翻译数量
- 已翻译数量
- 翻译进度条
- 批量操作按钮

**文章表格**:
- 列: 标题、状态、语言、创建时间、操作
- 功能: 排序、筛选、搜索、分页
- 批量选择和操作

#### 文章详情页 (`/projects/[id]/posts/[postId]`)
**内容展示**:
- 原文内容 (标题 + 正文)
- 翻译状态指示
- 各语言翻译结果 (标签页形式)
- 翻译操作按钮

## 🎭 交互功能设计

### 模拟翻译流程
1. 用户点击"开始翻译"按钮
2. 状态变更为 "translating"，显示进度条
3. 模拟 3-5 秒翻译时间
4. 生成模拟翻译内容
5. 状态变更为 "translated"
6. 显示翻译结果

### 搜索功能
- 实时搜索 (防抖 300ms)
- 支持项目名称和文章标题搜索
- 高亮搜索关键词
- 搜索历史记录

### 批量操作
- 多选文章 (复选框)
- 批量翻译
- 批量删除
- 操作确认对话框

## 📱 响应式设计

### 断点设置
- **移动端**: < 768px
- **平板端**: 768px - 1024px
- **桌面端**: > 1024px

### 适配策略
- **移动端**: 单列布局，简化操作，抽屉式导航
- **平板端**: 双列布局，保留主要功能
- **桌面端**: 多列布局，完整功能展示

## 🚀 开发指南

### 环境要求
- Node.js 18+
- npm/yarn/pnpm

### 安装步骤
```bash
# 创建项目
npx create-next-app@latest unipost-frontend --typescript --tailwind --app

# 安装 shadcn/ui
npx shadcn-ui@latest init

# 安装必要组件
npx shadcn-ui@latest add button card input label select table badge
```

### 开发规范
- 使用 TypeScript 严格模式
- 组件采用函数式组件 + Hooks
- 遵循 ESLint 和 Prettier 规范
- 组件和函数添加适当的注释

### 测试策略
- 组件单元测试
- 用户交互测试
- 响应式布局测试
- 无障碍访问测试

## 📈 性能优化

### 优化策略
- 图片懒加载
- 组件代码分割
- 虚拟滚动 (长列表)
- 防抖和节流
- 缓存策略

### 监控指标
- 首屏加载时间
- 交互响应时间
- 内存使用情况
- 包体积大小

---

**文档版本**: v1.0  
**最后更新**: 2024-07-10  
**维护者**: Unipost Team
