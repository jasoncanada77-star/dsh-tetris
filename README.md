# dsh-tetris — DSH 俄罗斯方块

> 把网页版俄罗斯方块（Canvas + Web Audio）改造成 **DSH 动态 Cordis 插件**：在 DSH 对话流中直接游玩，无需离开聊天界面。

![platform](https://img.shields.io/badge/platform-DSH%20Client-blue)
![kind](https://img.shields.io/badge/kind-Dynamic%20Cordis%20Plugin-purple)
![license](https://img.shields.io/badge/license-MIT-green)

## 玩法预览

经典 10×20 俄罗斯方块，带现代玩法要素：

- 🎲 **7-bag 随机**：七个方块一轮洗牌，杜绝「脸黑」连抽
- 🔄 **SRS 踢墙**（Super Rotation System）：贴墙/贴地也能旋转
- 👻 **幽灵方块**：显示落点预览（`G` 开关）
- 💾 **保留（Hold）**：`C` 键暂存当前方块
- ⏱️ **锁定延迟**：落地后 500ms 内仍可移动/旋转
- 🎵 **音效 + BGM**：Web Audio 合成《Korobeiniki》主题曲（`M`/`B` 开关，**默认关闭**，可随时开启）
- 🏆 **最高分持久化**：localStorage 保存历史最高分
- 🌍 **跨玩家排行榜**：所有安装者的分数进同一张榜（输入昵称上榜，离线自动暂存、联网后补交）
- 😎 **副标题**：AI干活~我摸鱼！

## 排行榜说明

- 游戏结束（分数 > 0）后自动把本局分数提交到共享排行榜，右侧「排行榜」面板实时展示 **Top 8**
- 在「排行榜」面板输入**昵称**（最长 12 字，本地记住，默认「玩家」）即可上榜
- **离线降级**：网络不可用时分数存入本地待提交队列，下次联网自动补交；排行榜显示「离线」但游戏不受影响
- **后端**：默认指向免费的 [kvdb.io](https://kvdb.io) JSON 键值存储（浏览器 CORS 可用），单榜保留最近 15 条高分
- **更换后端**：改 `plugin/client.js` 顶部 `LEADERBOARD.readUrl` / `writeUrl` 常量即可指向任意 JSON 文档存储（jsonblob、自建 Cloudflare Worker 等），无需改游戏逻辑
- ⚠️ 这是娱乐性功能：分数由客户端上报、无鉴权，防不了作弊；免费 KV 服务无 SLA，仅供游玩

## 安装方法（给 DSH 玩家）

本插件是 DSH 的**动态 Cordis 插件**，安装 = 定义 + 运行，两步完成：

### 第一步：定义（cordis_define）

在 DSH 会话中调用 `cordis_define`：

- `plugin.kind`: `new`，`idPrefix`: `tetris`（或任意 3–6 位小写字母）
- `name`: `dsh-tetris`
- `code.client`: 把 [`plugin/client.js`](plugin/client.js) 的**全部内容**原样粘贴进去（这就是 `code.client` 的函数体）
- `code.host`: 留空（本插件纯 Client 端，无需 Host 半部）

### 第二步：运行（cordis_run）

用 `cordis_define` 返回的 `pluginId` / `packageId` 调用 `cordis_run`（`mode: run`）。

- 首次运行需要你在界面的 Run 卡片上点 **「允许」** 授权（单勾即授权当前版本）
- 激活后，游戏 UI 会渲染在最新 `cordis_run` 卡片内，点 **「开始游戏」** 即可游玩

> 提示：游戏键盘输入会忽略输入框/文本框内的按键，不会和 DSH 聊天输入冲突。
> 默认音效与 BGM 均关闭，可用 `M` / `B` 键或右侧开关随时开启。

## 操作说明

| 按键 | 功能 |
| --- | --- |
| `←` `→` | 左右移动 |
| `↑` | 旋转（顺时针） |
| `Z` | 反向旋转 |
| `↓` | 软降（每格 +1 分） |
| `空格` | 硬降 |
| `C` / `Shift` | 保留/交换方块 |
| `P` / `Esc` | 暂停 / 继续 |
| `G` | 幽灵方块 开/关 |
| `M` | 音效 开/关 |
| `B` | BGM 开/关 |

## 技术说明

- **平台**：Client 半部（纯浏览器侧，无 Host 依赖）
- **渲染位置**：`tool.view.cordis` Slot（`key: 'self'`），渲染在最新 `cordis_run` 卡片内
- **依赖的服务**：`timer`（`ctx.timeout` / `ctx.interval`）——DSH 遮蔽了 `setTimeout`/`setInterval`，定时器一律走 Cordis 定时器服务，卸载自动清理
- **可用的浏览器全局**：`window`、`document`、`requestAnimationFrame`、`localStorage`、`AudioContext`、`window.fetch`（未被 DSH 闭包遮蔽）
- **排行榜**：`window.fetch` 直连 JSON-REST 端点（KV 文档存储），游戏逻辑与传输解耦；异步请求在卸载后通过 `disposed` 标记丢弃结果
- **生命周期**：所有副作用（键盘监听、动画帧、BGM 定时器、AudioContext、排行榜请求）都在 `useEffect` cleanup 中完整回收，`cordis_stop` / 更新 / 卸载不会残留
- **改动对照**：原版单文件 `index.html`（见 [`original/`](original/)）→ 移植为 React 组件 + `styles.insert` CSS，游戏引擎逻辑逐行保留

## 目录结构

```
dsh-tetris/
├── README.md            # 本文件
├── LICENSE              # MIT
├── plugin/
│   └── client.js        # code.client 完整函数体（粘贴到 cordis_define）
└── original/
    └── index.html       # 原始网页版俄罗斯方块（仅供对照）
```

## License

[MIT](LICENSE)
