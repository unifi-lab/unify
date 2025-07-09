# URPC Studio

URPC Studio 是一个类似于 Prisma Studio 的可视化数据库浏览器，专为 URPC 框架设计。

## 功能特性

- 🔍 查看所有注册的 entities 和 adapters
- 📊 浏览和展示数据表格
- 🎨 现代化的 UI 界面
- ⚡ 实时数据加载
- 🛠️ 开发者友好的工具

## 如何使用

### 方法 1: 使用 CLI 命令（推荐）

安装 `@unilab/urpc-client` 后，你可以直接运行：

```bash
npx urpc-studio
```

或者全局安装后使用：

```bash
npm install -g @unilab/urpc-client
urpc-studio
```

### 方法 2: 使用 npm scripts

在安装了 `@unilab/urpc-client` 的项目中：

```bash
# 在 @unilab/urpc-client 目录下
npm run studio
```

## 前置条件

1. 确保你的 urpc 服务器正在运行在 `http://localhost:3000`
2. 确保已经注册了至少一个 adapter

## 访问地址

Studio 将在 `http://localhost:3001` 启动

## 支持的功能

- ✅ 查看所有 entities
- ✅ 查看所有 adapters  
- ✅ 查看 entity-adapter 组合
- ✅ 加载和显示数据
- ✅ 错误处理和重试
- 🔄 更多功能正在开发中...

## 技术栈

- Next.js 15 (App Router)
- React 19
- TypeScript
- Tailwind CSS

## 故障排除

如果遇到问题，请检查：

1. urpc 服务器是否正在运行
2. 服务器端口是否为 3000
3. 是否已经正确注册了 adapters
4. 网络连接是否正常

## 开发

如果你想为 Studio 贡献代码：

```bash
# 进入 studio 目录
cd packages/client/studio

# 安装依赖
npm install

# 启动开发服务器
npm run dev
``` 