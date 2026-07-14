# ☕ 碰一下 — 校园面基平台

> **离你最近的本科大学生，此刻就见到面。**

只属于本科生的匿名社交空间。位置优先匹配，让线上聊天变成线下见面。

---

## 🚀 快速启动

### 环境要求
- Node.js >= 18
- npm >= 9

### 1. 启动后端

```bash
cd server
npm install
npm run dev
```

后端运行在 `http://localhost:3001`

### 2. 启动前端

```bash
cd client
npm install
npm run dev
```

前端运行在 `http://localhost:5173`

### 3. 打开浏览器

访问 `http://localhost:5173`，开始使用。

---

## 📁 项目结构

```
自由/
├── server/                    # 后端服务
│   ├── src/
│   │   ├── index.ts           # Express + Socket.IO 主入口
│   │   ├── types.ts           # 类型定义
│   │   ├── services/
│   │   │   ├── auth.ts        # 用户认证、edu邮箱验证
│   │   │   ├── matching.ts    # 位置优先匹配引擎
│   │   │   └── chat.ts        # 聊天室、见面邀请
│   │   └── data/
│   │       └── universities.ts # 高校数据库（含校区坐标）
│   └── package.json
├── client/                    # 前端界面
│   ├── src/
│   │   ├── App.tsx            # 主应用 + 页面路由
│   │   ├── hooks/
│   │   │   └── useSocket.ts   # Socket.IO 通信 Hook
│   │   ├── pages/
│   │   │   ├── AuthPage.tsx   # 学校选择 + edu邮箱认证
│   │   │   ├── MatchPage.tsx  # 匹配主页
│   │   │   ├── ChatPage.tsx   # 聊天 + 见面邀请
│   │   │   └── ProfilePage.tsx # 个人设置
│   │   └── types.ts          # 前端类型
│   └── package.json
└── README.md
```

---

## 🎯 核心功能

| 功能 | 说明 |
|------|------|
| **学历认证** | `.edu.cn` 邮箱验证，仅限本科及以上学历 |
| **位置优先匹配** | 同校区 > 大学城 > 同城，逐级扩大匹配范围 |
| **异性匹配** | 核心需求 |
| **破冰话题** | 匹配成功后自动推送话题卡片 |
| **限时聊天** | 首次匹配 15 分钟限时，双向选择是否继续 |
| **见面邀请** | 一键推荐校内公共见面地点，安全奔现 |
| **安全机制** | 模糊距离、举报封禁、见面安全提醒 |

---

## 🔧 技术栈

| 层级 | 技术 |
|------|------|
| 前端 | React 18 + Vite + TypeScript + Tailwind CSS |
| 后端 | Node.js + Express + Socket.IO + TypeScript |
| 实时通信 | WebSocket (Socket.IO) |
| 数据 | 内存存储（MVP），可迁移至 PostgreSQL |

---

## 🔜 后续优化方向

- [ ] 学生证 OCR 认证兜底
- [ ] 高校校区 POI 数据库完善
- [ ] 数据库迁移（PostgreSQL/Supabase）
- [ ] 敏感词过滤 + 内容审核 API
- [ ] 用户评价体系完善
- [ ] 校园频道 + 话题广场
- [ ] 移动端适配优化
