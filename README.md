# 万象行者 - The Codex Walker

## AI生成声明
本项目所有内容(包括代码、文档、游戏剧情、世界观设定、视觉素材等)均由AI生成，展示了人工智能在创意内容生成和游戏开发领域的强大能力。从游戏剧情到界面设计，从角色对话到技术实现，全部由AI创作完成。

## 项目概述

"万象行者"是一款完全由AI生成的沉浸式HTML5视觉小说游戏，讲述主角陈星与神秘少女魏娇娇探索现实与幻想交织的冒险故事。

### 核心特色
- 多分支剧情系统
- 高清视频CG场景
- 角色成长与能力解锁
- 4个主要结局
- 丰富的世界观设定

## 快速开始

### 运行要求
1. 确保已安装Node.js环境
2. 需要启动本地服务器运行游戏

### 启动步骤
```bash
# 使用内置Node.js服务器 (推荐)
node server.js

# 或使用其他静态服务器
npx http-server -p 8000
python3 -m http.server 8000
```
访问: http://localhost:8080 (内置服务器) 或 http://localhost:8000 (其他服务器)

### 环境检查
```bash
# 检查Node.js是否安装
node -v
# 若未安装，请从 https://nodejs.org/ 下载安装
```

## 项目架构

```
/
├── index.html          # 入口页面
├── game.html           # 游戏主界面
├── css/                # 样式文件
│   ├── style.css       # 基础样式
│   └── game-ui.css     # 游戏UI样式
├── js/                 # 游戏逻辑
│   ├── GameController.js    # 游戏流程控制
│   ├── ScenePlayer.js       # 场景管理
│   ├── UIManager.js         # 用户界面
│   └── ...                  # 其他模块
├── data/               # 游戏数据
│   ├── act1-4.json     # 剧情数据
│   └── codex.json      # 世界观设定
└── game/videos/        # 视频资源
    ├── bg/             # 背景视频
    ├── cg/             # 剧情CG
    └── ui/             # UI动画
```

## 核心模块

| 模块 | 功能 |
|------|------|
| GameController | 游戏流程控制 |
| ScenePlayer | 场景播放与交互 |
| UIManager | 界面显示与操作 |
| GameStateManager | 存档/读档系统 |
| MusicManager | 背景音乐控制 |

## 开发指南

1. 修改剧情: 编辑 `data/act*.json` 文件
2. 调整UI: 修改 `css/game-ui.css`
3. 添加视频: 放入 `game/videos/` 对应目录
4. 测试: 运行本地服务器检查效果

## 关于作者

**AI创作者**  
本项目由AI系统独立创作完成，展示了人工智能在创意内容生成领域的突破性进展。从游戏设计到代码实现，从剧情编写到视觉呈现，全部内容均由AI生成。

**项目维护**  
如需联系项目维护人员，请通过以下方式：
- 微信/电话：13141305408