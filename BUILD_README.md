# 构建说明 - The Codex Walker

## 自动构建 (推荐)

本项目已配置GitHub Actions自动构建，每次推送到main分支时都会自动构建Android APK。

### 查看构建状态

1. 访问 [GitHub Actions页面](https://github.com/chenxing3060/thecodexwalker/actions)
2. 查看最新的构建工作流运行状态
3. 构建完成后，在Artifacts部分下载APK文件

### 手动触发构建

1. 在GitHub仓库页面，点击"Actions"标签
2. 选择"Build Android APK"工作流
3. 点击"Run workflow"按钮
4. 选择分支并点击"Run workflow"

## 本地构建

### 环境要求

- Node.js 18+
- Java 17+
- Android SDK
- Apache Cordova CLI

### 安装步骤

1. 安装Cordova CLI：
```bash
npm install -g cordova
```

2. 安装项目依赖：
```bash
npm install
```

3. 添加Android平台：
```bash
npm run platform:add:android
```

4. 添加Cordova插件：
```bash
npm run plugin:add cordova-plugin-whitelist
npm run plugin:add cordova-plugin-file
npm run plugin:add cordova-plugin-media
npm run plugin:add cordova-plugin-splashscreen
npm run plugin:add cordova-plugin-statusbar
npm run plugin:add cordova-plugin-inappbrowser
```

5. 构建APK：
```bash
# 调试版本
npm run build:android

# 发布版本
npm run build:android:release
```

### 构建输出

- 调试APK：`platforms/android/app/build/outputs/apk/debug/app-debug.apk`
- 发布APK：`platforms/android/app/build/outputs/apk/release/app-release.apk`

## 故障排除

### 常见问题

1. **Java版本不兼容**
   - 确保使用Java 17
   - 设置JAVA_HOME环境变量

2. **Android SDK问题**
   - 确保Android SDK已正确安装
   - 设置ANDROID_HOME环境变量

3. **Cordova插件冲突**
   - 清理项目：`npm run clean`
   - 重新准备：`npm run prepare`

### 获取帮助

如果遇到构建问题，请：
1. 检查GitHub Actions日志
2. 提交Issue描述问题
3. 查看Cordova官方文档

## 发布说明

构建完成后，APK文件将作为GitHub Actions的Artifacts提供下载。你可以：

1. 直接下载APK文件
2. 将APK上传到应用商店
3. 分发给测试用户

注意：发布版本需要正确的签名密钥，生产环境请使用正式的签名证书。
