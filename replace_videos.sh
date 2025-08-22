#!/bin/bash

# 视频文件替换脚本
# 将压缩后的视频文件替换原始文件，并提供备份和回滚功能

set -e  # 遇到错误立即退出

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 目录定义
ORIGINAL_DIR="game/videos"
COMPRESSED_DIR="game/videos_compressed"
BACKUP_DIR="game/videos_backup_$(date +%Y%m%d_%H%M%S)"
LOG_FILE="video_replace_$(date +%Y%m%d_%H%M%S).log"

# 日志函数
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

log_success() {
    echo -e "${GREEN}[$(date '+%Y-%m-%d %H:%M:%S')] ✅ $1${NC}" | tee -a "$LOG_FILE"
}

log_error() {
    echo -e "${RED}[$(date '+%Y-%m-%d %H:%M:%S')] ❌ $1${NC}" | tee -a "$LOG_FILE"
}

log_warning() {
    echo -e "${YELLOW}[$(date '+%Y-%m-%d %H:%M:%S')] ⚠️  $1${NC}" | tee -a "$LOG_FILE"
}

log_info() {
    echo -e "${BLUE}[$(date '+%Y-%m-%d %H:%M:%S')] ℹ️  $1${NC}" | tee -a "$LOG_FILE"
}

# 检查文件完整性
check_file_integrity() {
    local file="$1"
    if [[ ! -f "$file" ]]; then
        log_error "文件不存在: $file"
        return 1
    fi
    
    # 检查文件大小
    local size=$(stat -f%z "$file" 2>/dev/null || stat -c%s "$file" 2>/dev/null)
    if [[ $size -eq 0 ]]; then
        log_error "文件为空: $file"
        return 1
    fi
    
    # 检查是否为有效的MP4文件
    if ! file "$file" | grep -q "MP4\|mp4\|video"; then
        log_warning "文件可能不是有效的视频文件: $file"
    fi
    
    return 0
}

# 创建备份
create_backup() {
    log_info "开始创建备份..."
    
    if [[ ! -d "$ORIGINAL_DIR" ]]; then
        log_error "原始视频目录不存在: $ORIGINAL_DIR"
        exit 1
    fi
    
    # 创建备份目录
    mkdir -p "$BACKUP_DIR"
    log_success "创建备份目录: $BACKUP_DIR"
    
    # 复制原始文件到备份目录
    if cp -r "$ORIGINAL_DIR"/* "$BACKUP_DIR"/; then
        log_success "备份完成: $BACKUP_DIR"
    else
        log_error "备份失败"
        exit 1
    fi
    
    # 记录备份信息
    echo "$BACKUP_DIR" > ".last_backup_path"
    log_info "备份路径已保存到 .last_backup_path"
}

# 替换文件
replace_files() {
    log_info "开始替换文件..."
    
    if [[ ! -d "$COMPRESSED_DIR" ]]; then
        log_error "压缩视频目录不存在: $COMPRESSED_DIR"
        exit 1
    fi
    
    local total_files=0
    local success_files=0
    local failed_files=0
    
    # 统计总文件数
    total_files=$(find "$COMPRESSED_DIR" -name "*.mp4" | wc -l)
    log_info "找到 $total_files 个压缩视频文件"
    
    # 遍历压缩目录中的所有MP4文件
    while IFS= read -r -d '' compressed_file; do
        # 获取相对路径
        relative_path="${compressed_file#$COMPRESSED_DIR/}"
        original_file="$ORIGINAL_DIR/$relative_path"
        
        log_info "处理文件: $relative_path"
        
        # 检查压缩文件完整性
        if ! check_file_integrity "$compressed_file"; then
            log_error "跳过损坏的压缩文件: $compressed_file"
            ((failed_files++))
            continue
        fi
        
        # 创建目标目录（如果不存在）
        target_dir=$(dirname "$original_file")
        mkdir -p "$target_dir"
        
        # 复制压缩文件到原始位置
        if cp "$compressed_file" "$original_file"; then
            # 验证复制后的文件
            if check_file_integrity "$original_file"; then
                log_success "替换成功: $relative_path"
                ((success_files++))
            else
                log_error "替换后文件验证失败: $relative_path"
                ((failed_files++))
            fi
        else
            log_error "替换失败: $relative_path"
            ((failed_files++))
        fi
    done < <(find "$COMPRESSED_DIR" -name "*.mp4" -print0)
    
    # 输出统计信息
    log_info "替换完成统计:"
    log_info "  总文件数: $total_files"
    log_success "  成功: $success_files"
    if [[ $failed_files -gt 0 ]]; then
        log_error "  失败: $failed_files"
    else
        log_info "  失败: $failed_files"
    fi
}

# 显示文件大小对比
show_size_comparison() {
    log_info "文件大小对比:"
    
    if [[ -d "$BACKUP_DIR" ]]; then
        local backup_size=$(du -sh "$BACKUP_DIR" | cut -f1)
        log_info "  备份文件总大小: $backup_size"
    fi
    
    if [[ -d "$ORIGINAL_DIR" ]]; then
        local current_size=$(du -sh "$ORIGINAL_DIR" | cut -f1)
        log_info "  当前文件总大小: $current_size"
    fi
}

# 创建回滚脚本
create_rollback_script() {
    local rollback_script="rollback_videos.sh"
    
    cat > "$rollback_script" << EOF
#!/bin/bash

# 视频文件回滚脚本
# 恢复到替换前的状态

set -e

BACKUP_DIR="$BACKUP_DIR"
ORIGINAL_DIR="$ORIGINAL_DIR"

echo "🔄 开始回滚操作..."

if [[ ! -d "\$BACKUP_DIR" ]]; then
    echo "❌ 备份目录不存在: \$BACKUP_DIR"
    exit 1
fi

# 删除当前文件
echo "🗑️  删除当前文件..."
rm -rf "\$ORIGINAL_DIR"

# 恢复备份文件
echo "📁 恢复备份文件..."
mkdir -p "\$ORIGINAL_DIR"
cp -r "\$BACKUP_DIR"/* "\$ORIGINAL_DIR"/

echo "✅ 回滚完成！"
echo "📊 当前文件大小: \$(du -sh "\$ORIGINAL_DIR" | cut -f1)"
EOF

    chmod +x "$rollback_script"
    log_success "创建回滚脚本: $rollback_script"
}

# 主函数
main() {
    echo -e "${BLUE}"
    echo "🎬 视频文件替换工具"
    echo "==================="
    echo -e "${NC}"
    
    log_info "开始视频文件替换操作"
    log_info "原始目录: $ORIGINAL_DIR"
    log_info "压缩目录: $COMPRESSED_DIR"
    log_info "日志文件: $LOG_FILE"
    
    # 检查必要目录
    if [[ ! -d "$ORIGINAL_DIR" ]]; then
        log_error "原始视频目录不存在: $ORIGINAL_DIR"
        exit 1
    fi
    
    if [[ ! -d "$COMPRESSED_DIR" ]]; then
        log_error "压缩视频目录不存在: $COMPRESSED_DIR"
        exit 1
    fi
    
    # 确认操作
    echo -e "${YELLOW}⚠️  警告: 此操作将替换原始视频文件${NC}"
    echo "原始文件将被备份到: $BACKUP_DIR"
    read -p "确认继续? (y/N): " -n 1 -r
    echo
    
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        log_info "操作已取消"
        exit 0
    fi
    
    # 执行操作
    create_backup
    replace_files
    show_size_comparison
    create_rollback_script
    
    echo -e "${GREEN}"
    echo "🎉 替换操作完成！"
    echo "=================="
    echo -e "${NC}"
    
    log_success "所有操作完成"
    log_info "备份目录: $BACKUP_DIR"
    log_info "日志文件: $LOG_FILE"
    log_info "回滚脚本: rollback_videos.sh"
    
    echo
    echo "📋 后续操作:"
    echo "  - 测试游戏中的视频播放"
    echo "  - 如需回滚，运行: ./rollback_videos.sh"
    echo "  - 查看详细日志: cat $LOG_FILE"
}

# 运行主函数
main "$@"