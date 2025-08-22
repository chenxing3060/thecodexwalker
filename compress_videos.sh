#!/bin/bash

# 视频压缩脚本
# 用于压缩 game/videos 目录下的所有 mp4 文件

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 配置参数
SOURCE_DIR="game/videos"
COMPRESSED_DIR="game/videos_compressed"
QUALITY="23"  # CRF值，18-28之间，数值越小质量越高
PRESET="medium"  # 编码速度预设：ultrafast, superfast, veryfast, faster, fast, medium, slow, slower, veryslow

echo -e "${BLUE}=== 视频压缩工具 ===${NC}"
echo -e "${YELLOW}源目录: $SOURCE_DIR${NC}"
echo -e "${YELLOW}输出目录: $COMPRESSED_DIR${NC}"
echo -e "${YELLOW}质量设置: CRF $QUALITY (数值越小质量越高)${NC}"
echo -e "${YELLOW}编码预设: $PRESET${NC}"
echo ""

# 检查源目录是否存在
if [ ! -d "$SOURCE_DIR" ]; then
    echo -e "${RED}错误: 源目录 $SOURCE_DIR 不存在${NC}"
    exit 1
fi

# 创建压缩输出目录
mkdir -p "$COMPRESSED_DIR/bg"
mkdir -p "$COMPRESSED_DIR/cg"
mkdir -p "$COMPRESSED_DIR/ui"

# 统计变量
total_files=0
processed_files=0
total_original_size=0
total_compressed_size=0

# 计算总文件数
total_files=$(find "$SOURCE_DIR" -name "*.mp4" | wc -l)
echo -e "${BLUE}找到 $total_files 个视频文件${NC}"
echo ""

# 函数：获取文件大小（字节）
get_file_size() {
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        stat -f%z "$1" 2>/dev/null || echo 0
    else
        # Linux
        stat -c%s "$1" 2>/dev/null || echo 0
    fi
}

# 函数：格式化文件大小
format_size() {
    local size=$1
    if [ $size -ge 1073741824 ]; then
        echo "$(echo "scale=2; $size/1073741824" | bc)GB"
    elif [ $size -ge 1048576 ]; then
        echo "$(echo "scale=2; $size/1048576" | bc)MB"
    elif [ $size -ge 1024 ]; then
        echo "$(echo "scale=2; $size/1024" | bc)KB"
    else
        echo "${size}B"
    fi
}

# 函数：压缩单个视频文件
compress_video() {
    local input_file="$1"
    local output_file="$2"
    local relative_path="$3"
    
    echo -e "${YELLOW}正在处理: $relative_path${NC}"
    
    # 获取原始文件大小
    local original_size=$(get_file_size "$input_file")
    local original_size_formatted=$(format_size $original_size)
    
    echo "  原始大小: $original_size_formatted"
    
    # 检查输出文件是否已存在
    if [ -f "$output_file" ]; then
        echo -e "  ${YELLOW}跳过: 压缩文件已存在${NC}"
        local compressed_size=$(get_file_size "$output_file")
        total_original_size=$((total_original_size + original_size))
        total_compressed_size=$((total_compressed_size + compressed_size))
        processed_files=$((processed_files + 1))
        return
    fi
    
    # 使用 ffmpeg 压缩视频
    if ffmpeg -i "$input_file" \
        -c:v libx264 \
        -crf $QUALITY \
        -preset $PRESET \
        -c:a aac \
        -b:a 128k \
        -movflags +faststart \
        "$output_file" \
        -y -loglevel error; then
        
        # 获取压缩后文件大小
        local compressed_size=$(get_file_size "$output_file")
        local compressed_size_formatted=$(format_size $compressed_size)
        
        # 计算压缩率
        local compression_ratio=0
        if [ $original_size -gt 0 ]; then
            compression_ratio=$(echo "scale=1; (1 - $compressed_size/$original_size) * 100" | bc)
        fi
        
        echo "  压缩后大小: $compressed_size_formatted"
        echo -e "  ${GREEN}压缩率: ${compression_ratio}%${NC}"
        
        # 更新统计
        total_original_size=$((total_original_size + original_size))
        total_compressed_size=$((total_compressed_size + compressed_size))
        processed_files=$((processed_files + 1))
        
    else
        echo -e "  ${RED}错误: 压缩失败${NC}"
    fi
    
    echo ""
}

# 处理所有视频文件
echo -e "${BLUE}开始压缩视频文件...${NC}"
echo ""

# 处理 bg 目录
if [ -d "$SOURCE_DIR/bg" ]; then
    echo -e "${BLUE}=== 处理背景视频 (bg) ===${NC}"
    for file in "$SOURCE_DIR/bg"/*.mp4; do
        if [ -f "$file" ]; then
            filename=$(basename "$file")
            output_file="$COMPRESSED_DIR/bg/$filename"
            compress_video "$file" "$output_file" "bg/$filename"
        fi
    done
fi

# 处理 cg 目录
if [ -d "$SOURCE_DIR/cg" ]; then
    echo -e "${BLUE}=== 处理CG视频 (cg) ===${NC}"
    for file in "$SOURCE_DIR/cg"/*.mp4; do
        if [ -f "$file" ]; then
            filename=$(basename "$file")
            output_file="$COMPRESSED_DIR/cg/$filename"
            compress_video "$file" "$output_file" "cg/$filename"
        fi
    done
fi

# 处理 ui 目录
if [ -d "$SOURCE_DIR/ui" ]; then
    echo -e "${BLUE}=== 处理UI视频 (ui) ===${NC}"
    for file in "$SOURCE_DIR/ui"/*.mp4; do
        if [ -f "$file" ]; then
            filename=$(basename "$file")
            output_file="$COMPRESSED_DIR/ui/$filename"
            compress_video "$file" "$output_file" "ui/$filename"
        fi
    done
fi

# 显示最终统计
echo -e "${GREEN}=== 压缩完成 ===${NC}"
echo "处理文件数: $processed_files / $total_files"
echo "原始总大小: $(format_size $total_original_size)"
echo "压缩后总大小: $(format_size $total_compressed_size)"

if [ $total_original_size -gt 0 ]; then
    total_compression_ratio=$(echo "scale=1; (1 - $total_compressed_size/$total_original_size) * 100" | bc)
    saved_size=$((total_original_size - total_compressed_size))
    echo -e "${GREEN}总压缩率: ${total_compression_ratio}%${NC}"
    echo -e "${GREEN}节省空间: $(format_size $saved_size)${NC}"
fi

echo ""
echo -e "${BLUE}压缩后的文件保存在: $COMPRESSED_DIR${NC}"
echo -e "${YELLOW}原始文件保持不变，如需替换请手动操作${NC}"