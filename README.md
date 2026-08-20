# dsh-tetris — DSH 俄罗斯方块

> 经典俄罗斯方块，做成**标准 DSH 插件 bundle**：一条命令安装，在 DSH 侧栏点「🎮 俄罗斯方块」即可全屏游玩，支持跨玩家共享排行榜。

![platform](https://img.shields.io/badge/platform-DSH%20Web-blue)
![kind](https://img.shields.io/badge/kind-Bundle%20Plugin-purple)
![install](https://img.shields.io/badge/install-dsh%20plugin%20add-green)
![license](https://img.shields.io/badge/license-MIT-green)

## 玩法预览

经典 10×20 俄罗斯方块，带现代玩法要素：

- 🎲 **7-bag 随机**：七个方块一轮洗牌，杜绝「脸黑」连抽
- 🔄 **SRS 踢墙**（Super Rotation System）：贴墙/贴地也能旋转
- 👻 **幽灵方块**：显示落点预览（`G` 开关）
- 💾 **保留（Hold）**：`C` 键暂存当前方块
- ⏱️ **锁定延迟**：落地后 500ms 内仍可移动/旋转
- 🎵 **音效 + BGM**：Web Audio 合成《Korobeiniki》主题曲（`M`/`B` 开关，**默认关闭**）
- 🏆 **最高分持久化**：localStorage 保存历史最高分
- 🌍 **跨玩家排行榜**：所有安装者的分数进同一张榜（输入昵称上榜，离线自动暂存、联网后补交）
- 😎 **副标题**：AI干活~我摸鱼！

## 安装方法（给 DSH 玩家）

### 方式一（推荐）：安装 bundle

```sh
dsh plugin --profile web add dsh-tetris
```

- 从 **npm** 安装（预构建产物，无需构建授权）；或从 GitHub 安装源码：
  ```sh
  dsh plugin --profile web add github:jasoncanada77-star/dsh-tetris
  ```
  git 安装会跑 `prepare` 构建脚本，pnpm ≥10 首次需要你在 profile 的 `pnpm-workspace.yaml` 里允许：
  ```yaml
  allowBuilds:
    dsh-tetris: true
  ```
- 重启 `dsh web` 后，侧栏底部出现 **「🎮 俄罗斯方块」** 按钮，点击即全屏游玩
- 卸载：`dsh plugin --profile web remove dsh-tetris`

> 提示：`tool.view.cordis` 是动态插件专属座位，bundle 版改用 `shell.overlay`（全屏浮层）+ `sidebar.footer.action`（入口按钮）。

### 方式二：动态插件（cordis_define）

不装 bundle，直接在当前会话里定义运行：

- `code.client`：把 [`dynamic/plugin/client.js`](dynamic/plugin/client.js) 的**全部内容**粘贴进去
- `code.host`：留空（纯 Client 端）
- `cordis_run` 后在 Run 卡片内直接游玩（渲染在 `tool.view.cordis`）

## 排行榜说明

- 游戏结束（分数 > 0）后自动把本局分数提交到共享排行榜，右侧「排行榜」面板实时展示 **Top 8**
- 在「排行榜」面板输入**昵称**（最长 12 字，本地记住，默认「玩家」）即可上榜
- **离线降级**：网络不可用时分数存入本地待提交队列，下次联网自动补交；排行榜显示「离线」但游戏不受影响
- **后端**：默认指向免费的 [kvdb.io](https://kvdb.io) JSON 键值存储（浏览器 CORS 可用），单榜保留最近 15 条高分
- **更换后端**：改 `src/client/index.js` 顶部 `LEADERBOARD.readUrl` / `writeUrl` 常量即可指向任意 JSON 文档存储，无需改游戏逻辑
- ⚠️ 娱乐性功能：分数由客户端上报、无鉴权，防不了作弊；免费 KV 服务无 SLA

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

标准 bundle 结构（官方 `docs/user/develop/basic/publish.md` 的"打包与安装"路线）：

- **bundle manifest**：`package.json` 声明 `dsh.bundle.patch` → `cordis.patch.yml`（insert 一行 `dsh-tetris`）
- **浏览器半部**：`exports["./client"]` → `lib/client.js`，`dsh.client.platform: "web"`；模块加载器把它编入 `/plugins/dsh-tetris/client.js`
- **Client 插件**：`src/client/index.js` —— `inject: ['slots']`，注册 `sidebar.footer.action`（打开按钮）+ `shell.overlay`（全屏游戏）
- **构建**：`tsdown.config.ts` 复刻官方 `clientBundle` 契约（cjs/browser + `window.__ModuleLoader__.load({id, factory})` 闭包工厂 + `react` 走模块表 external）
- **Node 半部**：`src/index.js` 空 `apply()`（仅占位 host 行）
- **游戏引擎**：与动态版同源；静态插件是普通浏览器模块，定时器直接用原生 `setInterval`/`setTimeout`/`requestAnimationFrame`，全部在 `useEffect` cleanup 中回收
- **排行榜**：`window.fetch` 直连 JSON-REST 端点，游戏逻辑与传输解耦；卸载后经 `disposed` 标记丢弃异步结果

## 目录结构

```
dsh-tetris/
├── package.json            # dsh.bundle + dsh.client manifest
├── cordis.patch.yml        # 插件行 patch
├── tsdown.config.ts        # 构建配置（node 半部 + client bundle）
├── src/
│   ├── index.js            # Node 半部（空 apply）
│   └── client/index.js     # 浏览器半部（游戏 + 排行榜）
├── lib/                    # 构建产物（提交进仓库，git 安装无需构建也能跑）
├── dynamic/plugin/client.js  # 动态插件版（cordis_define 分发）
├── original/index.html     # 原始网页版（仅供对照）
└── README.md / LICENSE
```

## 上架状态

- 插件市场（[dshmarket](https://github.com/dsh-market/dsh-market)）的目录来自 [awesome-dsh-plugin](https://github.com/awesome-dsh-plugin/awesome-dsh-plugin) 注册表：**提 PR 加一条 `data/plugins/<owner>__<repo>.yml` 即自动收录**
- 仓库需满 1 天且 ≥10 commits（CI 自动检查），达到门槛后提交 PR

## License

[MIT](LICENSE)
