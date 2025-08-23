# GitHub Actions 自动构建说明

## 概述

本项目使用 GitHub Actions 自动构建 Android APK 文件，避免了本地环境配置的复杂性。

## 触发方式

### 1. 自动触发
- 推送到 `main` 或 `master` 分支
- 创建以 `v` 开头的标签（如 `v1.4.0`）
- 创建 Pull Request

### 2. 手动触发
1. 进入 GitHub 仓库的 Actions 页面
2. 选择 "Build Android APK" 工作流
3. 点击 "Run workflow"
4. 可选择版本号和构建类型（release/debug）

## 构建产物

- **Artifacts**: 每次构建都会生成 APK 文件作为 Artifacts
- **Releases**: 标签推送或手动触发时会自动创建 Release 并上传 APK

## 构建环境

- **操作系统**: Ubuntu Latest
- **Node.js**: 18
- **Java**: 17 (Temurin)
- **Android SDK**: API Level 34, Build Tools 35.0.0
- **Cordova**: 最新版本

## 构建流程

1. 检出代码
2. 设置 Node.js、Java 和 Android SDK 环境
3. 安装 Cordova CLI 和依赖
4. 添加 Android 平台和插件
5. 复制 Web 资源到 Cordova www 目录
6. 更新版本号
7. 构建 APK
8. 上传构建产物
9. 创建 Release（如果适用）

## 注意事项

- 构建过程完全在云端进行，无需本地 Android 开发环境
- APK 文件会自动包含项目的所有 Web 资源（HTML、CSS、JS、数据文件等）
- 支持 Release 和 Debug 两种构建类型
- 自动处理版本号更新

## 下载 APK

1. **从 Artifacts 下载**：在 Actions 页面的构建记录中下载
2. **从 Releases 下载**：在仓库的 Releases 页面下载正式版本

## 在线体验

如果不想下载 APK，也可以直接访问在线版本：
[https://chenxing3060.github.io/thecodexwalker/game.html](https://chenxing3060.github.io/thecodexwalker/game.html)