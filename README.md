<p align="center">
  <img src="https://img.shields.io/badge/状态-已上线-brightgreen" alt="status">
  <img src="https://img.shields.io/badge/成本-¥0-blue" alt="cost">
  <img src="https://img.shields.io/badge/许可-MIT-yellow" alt="license">
</p>

<h1 align="center">☕ 碰一下 — 校园面基平台</h1>

<p align="center">
  <strong>离你最近的本科大学生，此刻就见到面。</strong>
</p>

<p align="center">
  <a href="https://pengyixia.vercel.app">🌐 在线体验</a>
  ·
  <a href="#-为什么做这个">💡 为什么做这个</a>
  ·
  <a href="#-技术架构">🔧 技术架构</a>
  ·
  <a href="#-本地运行">🚀 本地运行</a>
</p>

---

## 🎯 这是什么

一个**只属于本科生的线下见面工具**。

不刷脸、不氪金、不制造焦虑。用地理位置优先匹配，让两个距离最近的人，在同一个校园里——从屏幕两端走到彼此面前。

**核心差异**：所有社交产品都在延长用户的在线时间，我们反其道而行——目标是让用户尽快「下线见面」。

---

## ✨ 功能

| 功能 | 说明 |
|------|------|
| 🔐 学号+姓名认证 | 仅限本科及以上学历，同一学号限一次 |
| 📍 位置优先匹配 | 同校区 → 大学城 → 同城，逐级扩大 |
| 👫 异性自动匹配 | 核心需求 |
| 💬 实时聊天 | Socket.IO 驱动，限时 15 分钟沟通 |
| ☯ 八字缘分参考 | 基于五行阴阳学说的命理分析，不是判决，是参考 |
| ☕ 一键见面邀请 | 推荐校内公共见面地点，安全奔现 |
| 🌙 Soul 风格 UI | 深空梦幻主题，玻璃拟态卡片 |

---

## 🤔 为什么做这个

当代大学生面临一个矛盾：

```
想认识人 → 没有自然渠道 → 社交软件 → 看脸/氪金/焦虑 → 更孤独
```

现有的解决方案要么太商业化（探探/Soul），要么效率太低（表白墙）。而校园天然具备线下见面的最佳条件——共享空间、共同身份、相近年龄。

**所以我们做了一个反过来想的产品**：

- 不看脸，先聊天，聊完再决定是否见
- 不充会员，所有功能免费
- 匹配逻辑是「离你最近」，而不是「算法觉得你们合适」
- 八字五行作为引子——给两个陌生人一个共同的语境

---

## 🏗️ 技术架构

```
┌─────────────────────────────────┐
│         前端 (React 18)          │
│   Vite · Tailwind · Socket.IO   │
│   部署: Vercel (免费)            │
└──────────────┬──────────────────┘
               │ WebSocket
┌──────────────┴──────────────────┐
│       后端 (Node.js)             │
│   Express · Socket.IO · TS      │
│   部署: Railway (免费)           │
└──────────────┬──────────────────┘
               │
┌──────────────┴──────────────────┐
│  核心模块                        │
│  · 位置优先匹配引擎               │
│  · 八字命理计算引擎 (四柱/五行/合婚) │
│  · 实时聊天 + 见面邀请系统         │
│  · 学号认证 + 举报风控            │
└─────────────────────────────────┘
```

### 八字引擎

基于天干地支、五行阴阳、六十甲子纳音的完整八字排盘和关系分析。这不是迷信——五行阴阳学说是中华民族朴素唯物主义和经验主义的结晶。

支持：
- 年月日时四柱推算
- 日主五行性格分析
- 天干五合 / 地支六合 / 六冲 / 三刑检测
- 五行互补度计算
- 个人命盘 + 伴侣/朋友适配参考

---

## 🚀 本地运行

```bash
# 后端
cd server
npm install
npm run dev        # → http://localhost:3001

# 前端
cd client
npm install
npm run dev        # → http://localhost:5173
```

---

## 📁 项目结构

```
pengyixia/
├── server/
│   └── src/
│       ├── index.ts              # Express + Socket.IO 主入口
│       ├── types.ts              # 类型定义
│       ├── services/
│       │   ├── auth.ts           # 学号+姓名认证
│       │   ├── matching.ts       # 位置优先匹配引擎
│       │   ├── chat.ts           # 聊天室 + 见面邀请
│       │   └── bazi.ts           # 八字命理引擎
│       └── data/
│           └── universities.ts   # 80+ 高校数据库
├── client/
│   └── src/
│       ├── pages/
│       │   ├── AuthPage.tsx      # 学号认证
│       │   ├── MatchPage.tsx     # 匹配主页
│       │   ├── ChatPage.tsx      # 聊天 + 缘分参考
│       │   ├── ProfilePage.tsx   # 个人设置
│       │   └── BaZiFortunePage.tsx # 八字命理
│       └── hooks/
│           └── useSocket.ts      # Socket.IO Hook
└── render.yaml                   # Render.com 部署配置
```

---

## 🌍 部署

全栈 ¥0 上线：

| 服务 | 平台 | 地址 |
|------|------|------|
| 前端 | Vercel | https://pengyixia.vercel.app |
| 后端 | Railway | https://pengyixia-api-production.up.railway.app |
| 代码 | GitHub | https://github.com/PJL529Y/pengyixia |

---

## 📜 许可

MIT License — 开源、免费、自由使用。

---

<p align="center">
  <sub>
    五行做引子，见面才是正文。<br>
    缘分参考，不是判决书。
  </sub>
</p>
