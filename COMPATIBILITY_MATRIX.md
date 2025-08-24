# Cordova Android 构建兼容性矩阵

## 问题分析

当前构建失败的根本原因是版本不匹配：
- 我们使用 Cordova Android 12.0.1
- 强制设置 Gradle 8.4（错误）
- 使用 JDK 17（部分错误）

## 正确的兼容性矩阵

### Cordova Android 12.0.1 官方要求

根据 [Cordova Android 12.0.0 发布说明](https://cordova.apache.org/announcements/2023/05/22/cordova-android-12.0.0.html)：

- **Gradle**: 7.6 （官方指定）
- **Android Gradle Plugin (AGP)**: 7.4.2
- **Kotlin**: 1.7.21
- **最小 SDK**: 24 (Android 7.0)
- **目标 SDK**: 33 (Android 13)
- **Build Tools**: 33.0.2

### JDK 版本要求

根据 [Gradle 兼容性矩阵](https://docs.gradle.org/current/userguide/compatibility.html)：
- **Gradle 7.6**: 支持 JDK 8-17
- **AGP 7.4.2**: 需要 JDK 11（根据错误信息显示）

### 推荐配置

```yaml
# 最佳兼容性配置
JDK: 11
Gradle: 7.6
Android Gradle Plugin: 7.4.2
Cordova Android: 12.0.1
Node.js: 18.x
Android SDK: 33
Build Tools: 33.0.2
```

## 当前问题

1. **Gradle 版本错误**: 使用 8.4 而不是 7.6
2. **JDK 版本不匹配**: JDK 17 与 AGP 7.4.2 不兼容
3. **XmlParser 错误**: 由于 Gradle 版本不匹配导致的类加载问题

## 解决方案

### 方案 A: 使用官方推荐版本（推荐）
- JDK: 11
- Gradle: 7.6
- 移除强制 Gradle 8.4 设置
- 移除 XmlParser 修复脚本（不再需要）

### 方案 B: 升级到 Cordova Android 13
- JDK: 17
- Gradle: 8.7
- Android Gradle Plugin: 8.3.0
- 目标 SDK: 34

## GitHub Actions 环境兼容性

- Ubuntu 22.04 默认支持 JDK 11
- 可以通过 `actions/setup-java@v4` 设置特定 JDK 版本
- Gradle 版本通过 Gradle Wrapper 控制

## 下一步行动

1. 修改 GitHub Actions 工作流使用 JDK 11
2. 设置正确的 Gradle 版本 (7.6)
3. 移除不必要的修复脚本
4. 测试构建流程