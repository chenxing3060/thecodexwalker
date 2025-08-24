# Cordova Android 构建指南

## 概述

本文档详细说明了如何解决 Cordova Android 项目中的版本兼容性问题，特别是 XmlParser 错误和 Gradle 版本冲突。

## 问题背景

### 常见错误

1. **XmlParser 错误**
   ```
   Script '/home/runner/work/thecodexwalker/thecodexwalker/thecodexwalker/platforms/android/cordova.gradle': 2: unable to resolve class groovy.util.XmlParser
   ```

2. **Gradle 版本不兼容**
   - Gradle 9.0.0 与 Cordova Android 12.0.1 不兼容
   - JDK 版本与 Gradle 版本不匹配

3. **Android SDK 配置问题**
   - SDK 路径配置错误
   - 构建工具版本不匹配

## 解决方案

### 1. Docker 容器化方案（推荐）

我们采用 Docker 容器化方案来确保构建环境的一致性和可重复性。

#### 技术栈版本

- **Java**: OpenJDK 11
- **Node.js**: 18.19.0 LTS
- **Gradle**: 7.6
- **Cordova CLI**: 12.0.0
- **Cordova Android**: 12.0.1
- **Android SDK**: API 34, 33, 32
- **Build Tools**: 34.0.0

#### Docker 配置

参见 `Dockerfile.cordova`，包含：
- 基于 Ubuntu 22.04
- 预配置所有必要的开发工具
- 环境变量设置
- 权限配置

#### GitHub Actions 工作流

参见 `.github/workflows/build-apk.yml`，特点：
- 使用 Docker 容器进行构建
- 完全隔离的构建环境
- 自动化版本管理
- 支持 release 和 debug 构建

### 2. 版本兼容性矩阵

| 组件 | 版本 | 兼容性 | 备注 |
|------|------|--------|------|
| Java | 11 | ✅ | 推荐使用 OpenJDK 11 |
| Node.js | 18.19.0 | ✅ | LTS 版本，稳定性好 |
| Gradle | 7.6 | ✅ | Cordova Android 12.0.1 默认版本 |
| Cordova CLI | 12.0.0 | ✅ | 与 Cordova Android 12.0.1 兼容 |
| Cordova Android | 12.0.1 | ✅ | 最新稳定版本 |
| Android SDK | 34 | ✅ | 目标 SDK 版本 |
| Build Tools | 34.0.0 | ✅ | 与 SDK 34 匹配 |

### 3. 不兼容的版本组合

❌ **避免使用的组合**：
- Gradle 9.0.0 + Cordova Android 12.0.1
- JDK 17 + Gradle 7.6
- Node.js 20+ + Cordova 11.x

## 构建配置

### build-extras.gradle

```gradle
android {
    compileSdkVersion 34
    buildToolsVersion "34.0.0"
    
    defaultConfig {
        minSdkVersion 22
        targetSdkVersion 34
        versionCode 140
        versionName "1.4.0"
    }
    
    compileOptions {
        sourceCompatibility JavaVersion.VERSION_11
        targetCompatibility JavaVersion.VERSION_11
    }
    
    packagingOptions {
        pickFirst '**/libc++_shared.so'
        pickFirst '**/libjsc.so'
        exclude 'META-INF/DEPENDENCIES'
        exclude 'META-INF/LICENSE'
        exclude 'META-INF/LICENSE.txt'
        exclude 'META-INF/NOTICE'
        exclude 'META-INF/NOTICE.txt'
    }
    
    lintOptions {
        abortOnError false
        checkReleaseBuilds false
    }
}
```

### gradle.properties

```properties
org.gradle.jvmargs=-Xmx3072m -Dfile.encoding=UTF-8 -XX:+UseG1GC
android.useAndroidX=true
android.enableJetifier=true
org.gradle.daemon=false
org.gradle.configureondemand=false
org.gradle.parallel=false
org.gradle.caching=false
android.builder.sdkDownload=true
```

## 故障排除

### 1. XmlParser 错误

**症状**: `unable to resolve class groovy.util.XmlParser`

**原因**: Gradle 版本与 Cordova Android 不兼容

**解决方案**: 
- 使用 Docker 容器化构建
- 确保使用 Gradle 7.6 + Cordova Android 12.0.1

### 2. Gradle 版本冲突

**症状**: Gradle 版本自动升级到 9.0.0

**原因**: GitHub Actions 环境默认使用最新 Gradle

**解决方案**:
- 使用 Docker 固定 Gradle 版本
- 避免在工作流中手动设置 Gradle 版本

### 3. Android SDK 路径问题

**症状**: SDK 路径找不到或权限错误

**解决方案**:
- 在 Docker 中预配置 SDK 路径
- 设置正确的环境变量
- 确保用户权限正确

### 4. 内存不足错误

**症状**: `OutOfMemoryError` 或构建超时

**解决方案**:
- 增加 Gradle JVM 内存: `-Xmx3072m`
- 禁用并行构建: `org.gradle.parallel=false`
- 禁用 Gradle daemon: `org.gradle.daemon=false`

## 本地开发环境设置

### 1. 使用 Docker（推荐）

```bash
# 构建 Docker 镜像
docker build -f Dockerfile.cordova -t cordova-build:latest .

# 运行容器进行构建
docker run --rm -v "$PWD:/workspace" cordova-build:latest bash -c "
  cd /workspace/thecodexwalker
  cordova build android --release
"
```

### 2. 本地环境配置

如果不使用 Docker，需要确保以下版本：

```bash
# 安装 Java 11
sudo apt-get install openjdk-11-jdk
export JAVA_HOME=/usr/lib/jvm/java-11-openjdk-amd64

# 安装 Node.js 18.19.0
nvm install 18.19.0
nvm use 18.19.0

# 安装 Cordova
npm install -g cordova@12.0.0

# 设置 Android SDK
export ANDROID_HOME=/path/to/android-sdk
export PATH=$PATH:$ANDROID_HOME/platform-tools:$ANDROID_HOME/cmdline-tools/latest/bin
```

## 最佳实践

### 1. 版本固定
- 始终指定确切的版本号
- 避免使用 `@latest` 标签
- 定期更新但要测试兼容性

### 2. 构建优化
- 使用 Docker 确保环境一致性
- 禁用不必要的 Gradle 功能
- 合理配置内存使用

### 3. 错误处理
- 添加详细的日志输出
- 实施重试机制
- 保存构建产物

### 4. 安全考虑
- 不在代码中硬编码密钥
- 使用 GitHub Secrets 管理敏感信息
- 定期更新依赖项

## 更新日志

### v1.4.0 (2024-01-XX)
- 实施 Docker 容器化构建
- 解决 XmlParser 兼容性问题
- 优化构建性能和稳定性
- 添加完整的版本兼容性矩阵

### v1.3.x
- 尝试各种 Gradle 版本修复
- 手动添加 XmlParser 导入
- 部分解决构建问题

## 参考资源

- [Cordova Android Platform Guide](https://cordova.apache.org/docs/en/latest/guide/platforms/android/)
- [Gradle Compatibility Matrix](https://docs.gradle.org/current/userguide/compatibility.html)
- [Android SDK Tools](https://developer.android.com/studio/command-line)
- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)

## 支持

如果遇到问题，请：
1. 检查版本兼容性矩阵
2. 查看构建日志
3. 参考故障排除部分
4. 提交 Issue 并附上详细日志