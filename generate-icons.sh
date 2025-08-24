#!/bin/bash

echo "🎨 开始生成Android APK图标..."

# 检查原图是否存在
if [ ! -f "jimeng-2025-08-20-2954-安卓游戏logo，科技与奇幻元素，文字_万物行者__副本.png" ]; then
    echo "❌ 原图文件不存在！"
    exit 1
fi

# 创建图标目录
mkdir -p res/icon/android
mkdir -p res/screen/android

# 安装ImageMagick（如果不存在）
if ! command -v convert &> /dev/null; then
    echo "📦 安装ImageMagick..."
    sudo apt-get update
    sudo apt-get install -y imagemagick
fi

# 生成各种尺寸的图标
echo "🔄 生成图标文件..."

# 图标尺寸列表
declare -a icon_sizes=("36" "48" "72" "96" "144" "192")
declare -a density_names=("ldpi" "mdpi" "hdpi" "xhdpi" "xxhdpi" "xxxhdpi")

for i in "${!icon_sizes[@]}"; do
    size="${icon_sizes[$i]}"
    density="${density_names[$i]}"
    
    echo "生成 ${density} 图标 (${size}x${size})..."
    convert "jimeng-2025-08-20-2954-安卓游戏logo，科技与奇幻元素，文字_万物行者__副本.png" \
        -resize "${size}x${size}" \
        -background transparent \
        -gravity center \
        -extent "${size}x${size}" \
        "res/icon/android/drawable-${density}-icon.png"
done

# 生成启动画面
echo "🔄 生成启动画面..."

# 启动画面尺寸列表
declare -a screen_sizes=("320x426" "320x470" "480x640" "480x800" "720x960" "720x1280")
declare -a screen_densities=("port-ldpi" "port-mdpi" "port-hdpi" "port-xhdpi" "port-xxhdpi" "port-xxxhdpi")

for i in "${!screen_sizes[@]}"; do
    size="${screen_sizes[$i]}"
    density="${screen_densities[$i]}"
    
    echo "生成 ${density} 启动画面 (${size})..."
    convert "jimeng-2025-08-20-2954-安卓游戏logo，科技与奇幻元素，文字_万物行者__副本.png" \
        -resize "${size}" \
        -background "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" \
        -gravity center \
        -extent "${size}" \
        "res/screen/android/screen-${density}.png"
done

echo "✅ 图标生成完成！"
echo "📁 图标文件位置: res/icon/android/"
echo "📁 启动画面位置: res/screen/android/"
echo "📏 生成的文件:"
ls -la res/icon/android/
ls -la res/screen/android/
