# 万象行者 - The Codex Walker

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)

## 项目简介

"万象行者"是一款基于HTML5技术开发的互动视觉小说游戏，讲述了一个关于现实与故事交织的奇幻冒险。玩家将扮演陈星，一个能够看到"世界另一面"的高中生，与神秘少女魏娇娇一起探索隐藏在日常之下的奇异世界。

## 技术栈

- **前端技术**：HTML5, CSS3, JavaScript (ES6+)
- **架构模式**：模块化设计，MVC架构
- **媒体支持**：HTML5 Video API
- **数据格式**：JSON
- **兼容性**：现代浏览器 (Chrome 80+, Firefox 75+, Safari 13+, Edge 80+)

## 在线体验

🎮 **[立即开始游戏](https://chenxing3060.github.io/hudongdemo2/game.html)**

## 快速启动

### 方法一：直接运行
双击项目根目录中的 `index.html` 文件，在浏览器中直接运行游戏。

### 方法二：本地服务器（推荐）
使用本地服务器可以避免跨域问题，确保视频资源正常加载：

```bash
# 克隆项目
git clone https://github.com/chenxing3060/hudongdemo2.git
cd hudongdemo2

# 使用Python启动服务器
python3 -m http.server 8000

# 或使用Node.js
npx http-server -p 8000

# 然后在浏览器中访问
# http://localhost:8000
```

## 项目结构

```
/
├── index.html          # 入口页面（自动重定向到game.html）
├── game.html           # 游戏主界面
├── style.css           # 主样式表
├── 启动说明.md          # 项目启动指南
├── 使用说明.txt         # 游戏操作说明
├── data/               # 游戏数据文件
│   ├── act1.json       # 第一幕剧情数据
│   ├── act2.json       # 第二幕剧情数据
│   ├── act3.json       # 第三幕剧情数据
│   ├── act4.json       # 第四幕剧情数据
│   └── codex.json      # 游戏百科数据
├── game/videos/        # 游戏视频资源
│   ├── bg/             # 背景视频
│   ├── cg/             # CG场景视频
│   └── ui/             # UI相关视频
├── css/                # 样式文件目录
└── js/                 # 游戏脚本文件
    ├── GameController.js    # 游戏主控制器
    ├── ScenePlayer.js       # 场景播放器
    ├── UIManager.js         # UI管理器
    └── ...                  # 其他功能模块
```

## 游戏特色

- **沉浸式视觉体验**：高质量视频CG场景
- **多结局分支**：玩家的选择将影响故事走向
- **丰富的世界观**：融合现代奇幻与科幻元素
- **角色成长系统**：随着剧情推进解锁新能力

## 游戏操作

- **继续剧情**：单击屏幕或对话框
- **进行选择**：在出现选项时，单击您想选择的按钮
- **控制音乐**：点击界面右上角的音乐图标可以开启或关闭声音
- **自动播放**：游戏默认为自动播放，点击对话框可以切换为手动模式

## 系统要求

- **浏览器**：Chrome 80+, Firefox 75+, Safari 13+, Edge 80+
- **存储空间**：约500MB（主要为视频文件）
- **网络**：首次加载需要稳定网络连接

## 开发信息

### 项目架构

本项目采用模块化设计，主要包含以下核心模块：

- **GameController.js**：游戏主控制器，负责整体游戏流程控制
- **ScenePlayer.js**：场景播放器，处理剧情场景的播放和交互
- **UIManager.js**：UI管理器，负责用户界面的显示和交互
- **GameStateManager.js**：游戏状态管理器，处理存档和读档
- **MusicManager.js**：音乐管理器，控制背景音乐播放
- **TransitionManager.js**：过渡效果管理器，处理场景切换动画
- **AssetLoader.js**：资源加载器，预加载游戏资源
- **RouteManager.js**：路由管理器，处理页面跳转
- **SceneDataManager.js**：场景数据管理器，处理剧情数据

### 数据结构

游戏数据以JSON格式存储在 `data/` 目录下：
- `act1.json` - `act4.json`：各幕剧情数据
- `codex.json`：游戏百科数据

### 开发说明

本项目为纯HTML5 Web游戏，无需额外的构建工具或编译步骤。所有资源文件都已优化，可直接在浏览器中运行。

## 注意事项

- 本项目为纯视觉小说体验，没有复杂的战斗操作
- 项目包含较多视频文件，首次加载可能需要一些时间
- 建议使用现代浏览器以获得最佳体验
- 视频文件较大，建议在稳定网络环境下运行

## 贡献指南

欢迎提交 Issue 和 Pull Request 来改进这个项目！

1. Fork 本仓库
2. 创建您的特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交您的更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开一个 Pull Request

## 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

## 联系方式

如有问题或建议，请通过 GitHub Issues 联系我们。

---

⭐ 如果这个项目对您有帮助，请给它一个星标！