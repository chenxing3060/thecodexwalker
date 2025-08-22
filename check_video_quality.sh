#!/bin/bash

# 视频质量检查脚本
# 用于检查压缩后视频的基本信息和质量

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

ORIGINAL_DIR="game/videos"
COMPRESSED_DIR="game/videos_compressed"

echo -e "${BLUE}=== 视频质量检查工具 ===${NC}"
echo ""

# 检查目录是否存在
if [ ! -d "$ORIGINAL_DIR" ]; then
    echo -e "${RED}错误: 原始视频目录 $ORIGINAL_DIR 不存在${NC}"
    exit 1
fi

if [ ! -d "$COMPRESSED_DIR" ]; then
    echo -e "${RED}错误: 压缩视频目录 $COMPRESSED_DIR 不存在${NC}"
    echo "请先运行 ./compress_videos.sh 进行视频压缩"
    exit 1
fi

# 函数：获取视频信息
get_video_info() {
    local file="$1"
    if [ -f "$file" ]; then
        ffprobe -v quiet -print_format json -show_format -show_streams "$file" 2>/dev/null
    fi
}

# 函数：提取视频分辨率
get_resolution() {
    local file="$1"
    ffprobe -v quiet -select_streams v:0 -show_entries stream=width,height -of csv=s=x:p=0 "$file" 2>/dev/null
}

# 函数：提取视频比特率
get_bitrate() {
    local file="$1"
    ffprobe -v quiet -select_streams v:0 -show_entries format=bit_rate -of csv=p=0 "$file" 2>/dev/null
}

# 函数：提取视频时长
get_duration() {
    local file="$1"
    ffprobe -v quiet -show_entries format=duration -of csv=p=0 "$file" 2>/dev/null
}

# 函数：格式化比特率
format_bitrate() {
    local bitrate=$1
    if [ -n "$bitrate" ] && [ "$bitrate" != "N/A" ]; then
        if [ $bitrate -ge 1000000 ]; then
            echo "$(echo "scale=1; $bitrate/1000000" | bc)Mbps"
        elif [ $bitrate -ge 1000 ]; then
            echo "$(echo "scale=1; $bitrate/1000" | bc)Kbps"
        else
            echo "${bitrate}bps"
        fi
    else
        echo "N/A"
    fi
}

# 函数：格式化时长
format_duration() {
    local duration=$1
    if [ -n "$duration" ] && [ "$duration" != "N/A" ]; then
        local minutes=$(echo "$duration/60" | bc)
        local seconds=$(echo "$duration%60" | bc)
        printf "%02d:%02d\n" $minutes $seconds
    else
        echo "N/A"
    fi
}

# 函数：比较单个视频文件
compare_video() {
    local original_file="$1"
    local compressed_file="$2"
    local relative_path="$3"
    
    echo -e "${YELLOW}检查: $relative_path${NC}"
    
    if [ ! -f "$original_file" ]; then
        echo -e "  ${RED}原始文件不存在${NC}"
        return
    fi
    
    if [ ! -f "$compressed_file" ]; then
        echo -e "  ${RED}压缩文件不存在${NC}"
        return
    fi
    
    # 获取文件大小
    local original_size=$(stat -f%z "$original_file" 2>/dev/null || echo 0)
    local compressed_size=$(stat -f%z "$compressed_file" 2>/dev/null || echo 0)
    
    # 获取视频信息
    local original_resolution=$(get_resolution "$original_file")
    local compressed_resolution=$(get_resolution "$compressed_file")
    
    local original_bitrate=$(get_bitrate "$original_file")
    local compressed_bitrate=$(get_bitrate "$compressed_file")
    
    local original_duration=$(get_duration "$original_file")
    local compressed_duration=$(get_duration "$compressed_file")
    
    # 显示比较结果
    echo "  分辨率: $original_resolution → $compressed_resolution"
    echo "  比特率: $(format_bitrate $original_bitrate) → $(format_bitrate $compressed_bitrate)"
    echo "  时长: $(format_duration $original_duration) → $(format_duration $compressed_duration)"
    
    # 计算压缩率
    if [ $original_size -gt 0 ]; then
        local compression_ratio=$(echo "scale=1; (1 - $compressed_size/$original_size) * 100" | bc)
        echo -e "  ${GREEN}压缩率: ${compression_ratio}%${NC}"
    fi
    
    # 检查是否有质量问题
    if [ "$original_resolution" != "$compressed_resolution" ]; then
        echo -e "  ${YELLOW}注意: 分辨率发生变化${NC}"
    fi
    
    echo ""
}

echo -e "${BLUE}开始检查视频质量...${NC}"
echo ""

# 检查 bg 目录
if [ -d "$ORIGINAL_DIR/bg" ] && [ -d "$COMPRESSED_DIR/bg" ]; then
    echo -e "${BLUE}=== 检查背景视频 (bg) ===${NC}"
    for file in "$ORIGINAL_DIR/bg"/*.mp4; do
        if [ -f "$file" ]; then
            filename=$(basename "$file")
            compressed_file="$COMPRESSED_DIR/bg/$filename"
            compare_video "$file" "$compressed_file" "bg/$filename"
        fi
    done
fi

# 检查 cg 目录
if [ -d "$ORIGINAL_DIR/cg" ] && [ -d "$COMPRESSED_DIR/cg" ]; then
    echo -e "${BLUE}=== 检查CG视频 (cg) ===${NC}"
    for file in "$ORIGINAL_DIR/cg"/*.mp4; do
        if [ -f "$file" ]; then
            filename=$(basename "$file")
            compressed_file="$COMPRESSED_DIR/cg/$filename"
            compare_video "$file" "$compressed_file" "cg/$filename"
        fi
    done
fi

# 检查 ui 目录
if [ -d "$ORIGINAL_DIR/ui" ] && [ -d "$COMPRESSED_DIR/ui" ]; then
    echo -e "${BLUE}=== 检查UI视频 (ui) ===${NC}"
    for file in "$ORIGINAL_DIR/ui"/*.mp4; do
        if [ -f "$file" ]; then
            filename=$(basename "$file")
            compressed_file="$COMPRESSED_DIR/ui/$filename"
            compare_video "$file" "$compressed_file" "ui/$filename"
        fi
    done
fi

echo -e "${GREEN}=== 质量检查完成 ===${NC}"
echo -e "${YELLOW}建议：${NC}"
echo "1. 随机选择几个视频文件进行播放测试"
echo "2. 检查关键场景的视觉质量"
echo "3. 如果质量满意，可以考虑替换原始文件"
echo ""
echo -e "${BLUE}替换原始文件的命令（请谨慎操作）：${NC}"
echo "mv game/videos game/videos_backup"
echo "mv game/videos_compressed game/videos"