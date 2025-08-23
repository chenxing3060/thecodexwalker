// 音乐管理器 - 控制视频音频
class MusicManager {
    constructor() {
        this.isMuted = true; // 默认静音以遵循浏览器自动播放策略
        this.volume = 0.7; // 默认音量
        this.musicButtons = [];
        this.videos = [];
        
        this.initializeVideoAudio();
        this.bindMusicControls();
    }
    
    initializeVideoAudio() {
        // 获取所有视频元素
        this.videos = [
            document.getElementById('start-video'),
            document.getElementById('game-video')
        ].filter(video => video !== null);
        
        // 设置初始音量
        this.videos.forEach(video => {
            video.volume = this.volume;
            video.muted = this.isMuted;
        });
        
        console.log('视频音频系统初始化完成，找到', this.videos.length, '个视频元素');
    }
    
    bindMusicControls() {
        // 获取所有音乐控制按钮
        this.musicButtons = [
            document.getElementById('music-toggle-menu'),
            document.getElementById('music-toggle-game')
        ].filter(btn => btn !== null);
        
        console.log('音乐控制按钮绑定:', this.musicButtons.map(btn => btn ? btn.id : 'null'));
        
        // 为每个按钮绑定事件
        this.musicButtons.forEach((button, index) => {
            if (button) {
                console.log(`绑定音乐按钮 ${button.id} 事件`);
                button.addEventListener('click', (e) => {
                    console.log(`音乐按钮 ${button.id} 被点击`);
                    e.stopPropagation();
                    this.toggleMusic();
                });
            } else {
                console.error(`音乐按钮 ${index} 未找到`);
            }
        });
    }
    
    toggleMusic() {
        this.isMuted = !this.isMuted;
        
        // 更新所有视频的静音状态
        this.videos.forEach(video => {
            video.muted = this.isMuted;
        });
        
        // 更新按钮显示
        this.updateMusicButtons(this.isMuted ? '🔇' : '🎵');
        
        console.log('视频音频', this.isMuted ? '已静音' : '已开启');
    }
    
    muteVideos() {
        this.isMuted = true;
        this.videos.forEach(video => {
            video.muted = true;
        });
        this.updateMusicButtons('🔇');
        console.log('视频音频已静音');
    }
    
    unmuteVideos() {
        this.isMuted = false;
        this.videos.forEach(video => {
            video.muted = false;
        });
        this.updateMusicButtons('🎵');
        console.log('视频音频已开启');
    }
    
    updateMusicButtons(icon) {
        this.musicButtons.forEach(button => {
            if (button) {
                const iconElement = button.querySelector('.music-icon');
                if (iconElement) {
                    iconElement.textContent = icon;
                    button.title = this.isMuted ? '开启音乐' : '关闭音乐';
                }
            }
        });
        console.log('音乐按钮状态已更新:', this.isMuted ? '静音' : '开启');
    }
    
    setVolume(volume) {
        this.volume = Math.max(0, Math.min(1, volume));
        this.videos.forEach(video => {
            video.volume = this.volume;
        });
        console.log('视频音量设置为:', this.volume);
    }
    
    getVolume() {
        return this.volume;
    }
    
    getIsMuted() {
        return this.isMuted;
    }
    
    // 添加新视频到管理列表
    addVideo(video) {
        if (video && !this.videos.includes(video)) {
            this.videos.push(video);
            video.volume = this.volume;
            video.muted = this.isMuted; // 使用当前的静音状态（默认为false，即不静音）
            console.log('新视频已添加到音频管理');
        }
    }
    
    // 从管理列表移除视频
    removeVideo(video) {
        const index = this.videos.indexOf(video);
        if (index > -1) {
            this.videos.splice(index, 1);
            console.log('视频已从音频管理中移除');
        }
    }
    
    // 在页面切换时可能需要的方法
    fadeOut(duration = 1000) {
        if (this.videos.length === 0) return;
        
        const startVolume = this.volume;
        const fadeStep = startVolume / (duration / 50);
        
        const fadeInterval = setInterval(() => {
            if (this.volume > fadeStep) {
                this.setVolume(this.volume - fadeStep);
            } else {
                this.setVolume(0);
                this.muteVideos();
                clearInterval(fadeInterval);
                this.volume = startVolume; // 恢复原音量设置
            }
        }, 50);
    }
    
    fadeIn(duration = 1000) {
        if (this.videos.length === 0) return;
        
        const targetVolume = this.volume;
        this.setVolume(0);
        this.unmuteVideos();
        
        const fadeStep = targetVolume / (duration / 50);
        
        const fadeInterval = setInterval(() => {
            if (this.volume < targetVolume - fadeStep) {
                this.setVolume(this.volume + fadeStep);
            } else {
                this.setVolume(targetVolume);
                clearInterval(fadeInterval);
            }
        }, 50);
    }
}

// MusicManager类已定义，无需export
