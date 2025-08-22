#!/bin/bash

# 视频文件回滚脚本
# 恢复到替换前的状态

set -e

BACKUP_DIR="game/videos_backup_20250822_184600"
ORIGINAL_DIR="game/videos"

echo "🔄 开始回滚操作..."

if [[ ! -d "$BACKUP_DIR" ]]; then
    echo "❌ 备份目录不存在: $BACKUP_DIR"
    exit 1
fi

# 删除当前文件
echo "🗑️  删除当前文件..."
rm -rf "$ORIGINAL_DIR"

# 恢复备份文件
echo "📁 恢复备份文件..."
mkdir -p "$ORIGINAL_DIR"
cp -r "$BACKUP_DIR"/* "$ORIGINAL_DIR"/

echo "✅ 回滚完成！"
echo "📊 当前文件大小: $(du -sh "$ORIGINAL_DIR" | cut -f1)"
