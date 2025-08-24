#!/bin/bash

echo "🚀 开始本地构建 The Codex Walker APK..."

# 检查Node.js版本
echo "📋 检查Node.js版本..."
node --version
npm --version

# 安装依赖
echo "📦 安装项目依赖..."
npm install

# 安装Cordova CLI
echo "🔧 安装Cordova CLI..."
npm install -g cordova

# 清理之前的构建
echo "🧹 清理之前的构建..."
cordova clean

# 添加Android平台
echo "📱 添加Android平台..."
cordova platform add android@12.0.0

# 添加必要的插件
echo "🔌 添加Cordova插件..."
cordova plugin add cordova-plugin-whitelist
cordova plugin add cordova-plugin-file
cordova plugin add cordova-plugin-media
cordova plugin add cordova-plugin-splashscreen
cordova plugin add cordova-plugin-statusbar
cordova plugin add cordova-plugin-inappbrowser

# 构建APK
echo "🔨 构建Android APK..."
cordova build android --verbose

# 检查构建结果
if [ -f "platforms/android/app/build/outputs/apk/debug/app-debug.apk" ]; then
    echo "✅ 构建成功！"
    echo "📱 APK文件位置: platforms/android/app/build/outputs/apk/debug/app-debug.apk"
    echo "📏 文件大小: $(du -h platforms/android/app/build/outputs/apk/debug/app-debug.apk | cut -f1)"
else
    echo "❌ 构建失败，请检查错误信息"
    exit 1
fi

echo "🎉 本地构建完成！"
