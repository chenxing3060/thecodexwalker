# GitHub 部署指南

## 📋 准备工作

项目已经完成了本地Git初始化和提交，现在需要将项目上传到GitHub。

## 🚀 上传到GitHub步骤

### 1. 创建GitHub仓库
1. 登录 [GitHub](https://github.com)
2. 点击右上角的 "+" 按钮，选择 "New repository"
3. 填写仓库信息：
   - **Repository name**: `hudongdemo2`
   - **Description**: `万象行者 - 基于HTML5的互动视觉小说游戏`
   - **Visibility**: 选择 Public（公开）或 Private（私有）
   - **不要**勾选 "Add a README file"（我们已经有了）
   - **不要**勾选 "Add .gitignore"（我们已经创建了）
4. 点击 "Create repository"

### 2. 连接本地仓库到GitHub
在项目根目录执行以下命令：

```bash
# 添加远程仓库
git remote add origin https://github.com/chenxing3060/hudongdemo2.git

# 推送到GitHub
git branch -M main
git push -u origin main
```

### 3. 启用GitHub Pages（可选）
如果想要在线访问游戏：

1. 在GitHub仓库页面，点击 "Settings" 标签
2. 在左侧菜单中找到 "Pages"
3. 在 "Source" 部分选择 "Deploy from a branch"
4. 选择 "main" 分支和 "/ (root)" 文件夹
5. 点击 "Save"
6. 等待几分钟后，您的游戏将在以下地址可用：
   - `https://chenxing3060.github.io/hudongdemo2/game.html`

## 📝 更新README中的链接

✅ **已完成** - README.md中的链接已更新为您的GitHub用户名：

1. ✅ 克隆地址已更新：
   ```bash
   git clone https://github.com/chenxing3060/hudongdemo2.git
   ```
2. ✅ 在线体验地址已更新：
   - 游戏地址：`https://chenxing3060.github.io/hudongdemo2/game.html`
   - 项目首页：`https://chenxing3060.github.io/hudongdemo2/`

## 🔄 后续更新

当您对项目进行修改后，使用以下命令更新GitHub仓库：

```bash
# 添加修改的文件
git add .

# 提交修改
git commit -m "描述您的修改内容"

# 推送到GitHub
git push origin main
```

## 📁 项目结构说明

当前项目包含以下主要内容：
- ✅ 完整的游戏源代码
- ✅ 模块化JavaScript架构
- ✅ 游戏数据文件（JSON格式）
- ✅ 样式文件和资源目录
- ✅ 详细的README文档
- ✅ .gitignore文件（排除不必要的文件）

## ⚠️ 注意事项

1. **大文件处理**: 如果您的游戏包含大型视频文件，考虑使用Git LFS或将资源文件托管在其他地方
2. **隐私设置**: 确保没有包含敏感信息（API密钥、个人信息等）
3. **许可证**: 考虑添加适当的开源许可证文件

## 🎉 完成

按照以上步骤，您的"万象行者"游戏项目将成功上传到GitHub，并可以与他人分享！