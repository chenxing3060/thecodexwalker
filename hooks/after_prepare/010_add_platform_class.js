#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

module.exports = function(context) {
    // 添加平台特定的CSS类到HTML文件
    const platform = context.opts.platforms[0];
    const wwwPath = path.join(context.opts.projectRoot, 'www');
    
    if (platform === 'android') {
        const htmlFiles = ['index.html', 'game.html', 'about.html', 'ending_credits.html'];
        
        htmlFiles.forEach(file => {
            const filePath = path.join(wwwPath, file);
            if (fs.existsSync(filePath)) {
                let content = fs.readFileSync(filePath, 'utf8');
                if (!content.includes('platform-android')) {
                    content = content.replace('<html', '<html class="platform-android"');
                    fs.writeFileSync(filePath, content);
                }
            }
        });
    }
};
