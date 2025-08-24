#!/bin/bash

# Cordova 构建测试脚本
# 用于验证本地构建环境和配置

set -e

echo "=== Cordova 构建环境测试 ==="

# 检查必要的工具
echo "检查构建工具..."

if command -v node &> /dev/null; then
    echo "✅ Node.js: $(node --version)"
else
    echo "❌ Node.js 未安装"
    exit 1
fi

if command -v npm &> /dev/null; then
    echo "✅ npm: $(npm --version)"
else
    echo "❌ npm 未安装"
    exit 1
fi

if command -v java &> /dev/null; then
    echo "✅ Java: $(java -version 2>&1 | head -1)"
else
    echo "❌ Java 未安装"
    exit 1
fi

if command -v cordova &> /dev/null; then
    echo "✅ Cordova: $(cordova --version)"
else
    echo "⚠️  Cordova 未安装，正在安装..."
    npm install -g cordova@12.0.0
fi

if command -v gradle &> /dev/null; then
    echo "✅ Gradle: $(gradle --version | grep Gradle)"
else
    echo "⚠️  Gradle 未安装"
fi

# 检查 Android SDK
if [ -n "$ANDROID_HOME" ] && [ -d "$ANDROID_HOME" ]; then
    echo "✅ Android SDK: $ANDROID_HOME"
else
    echo "⚠️  Android SDK 路径未设置或不存在"
fi

echo ""
echo "=== 构建配置验证 ==="

# 检查项目结构
if [ -f "index.html" ] && [ -f "game.html" ]; then
    echo "✅ 项目文件存在"
else
    echo "❌ 项目文件缺失"
    exit 1
fi

# 检查 Dockerfile
if [ -f "Dockerfile.cordova" ]; then
    echo "✅ Docker 配置文件存在"
else
    echo "❌ Dockerfile.cordova 不存在"
fi

# 检查 GitHub Actions 工作流
if [ -f ".github/workflows/build-apk.yml" ]; then
    echo "✅ GitHub Actions 工作流存在"
else
    echo "❌ GitHub Actions 工作流不存在"
fi

echo ""
echo "=== 版本兼容性检查 ==="

# 检查 Node.js 版本
NODE_VERSION=$(node --version | sed 's/v//')
NODE_MAJOR=$(echo $NODE_VERSION | cut -d. -f1)

if [ "$NODE_MAJOR" -eq 18 ]; then
    echo "✅ Node.js 版本兼容 (v$NODE_VERSION)"
elif [ "$NODE_MAJOR" -ge 16 ] && [ "$NODE_MAJOR" -le 20 ]; then
    echo "⚠️  Node.js 版本可用但建议使用 18.x (当前: v$NODE_VERSION)"
else
    echo "❌ Node.js 版本不兼容 (当前: v$NODE_VERSION, 建议: 18.x)"
fi

# 检查 Java 版本
if java -version 2>&1 | grep -q "11\."; then
    echo "✅ Java 版本兼容 (Java 11)"
else
    echo "⚠️  Java 版本可能不兼容，建议使用 Java 11"
fi

echo ""
echo "=== 测试完成 ==="
echo "如果所有检查都通过，您可以尝试运行构建。"
echo "如果有警告或错误，请参考 docs/CORDOVA_BUILD_GUIDE.md"