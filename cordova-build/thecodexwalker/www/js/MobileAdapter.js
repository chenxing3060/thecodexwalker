/**
 * 移动端适配器 - 万象行者APK版本
 * 处理移动设备特有的功能和兼容性问题
 */
class MobileAdapter {
    constructor() {
        this.isMobile = false;
        this.isAndroid = false;
        this.isiOS = false;
        this.isCordova = false;
        this.deviceInfo = null;
        this.fileSystem = null;
        
        this.init();
    }
    
    /**
     * 初始化移动端适配器
     */
    init() {
        this.detectEnvironment();
        this.setupEventListeners();
        this.initializePlugins();
        this.setupScreenOrientation();
        this.optimizePerformance();
    }
    
    /**
     * 检测运行环境
     */
    detectEnvironment() {
        // 检测是否为Cordova环境
        this.isCordova = typeof window.cordova !== 'undefined';
        
        // 检测设备类型
        const userAgent = navigator.userAgent.toLowerCase();
        this.isMobile = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
        this.isAndroid = /android/i.test(userAgent);
        this.isiOS = /iphone|ipad|ipod/i.test(userAgent);
        
        console.log('环境检测:', {
            isCordova: this.isCordova,
            isMobile: this.isMobile,
            isAndroid: this.isAndroid,
            isiOS: this.isiOS
        });
    }
    
    /**
     * 设置事件监听器
     */
    setupEventListeners() {
        if (this.isCordova) {
            document.addEventListener('deviceready', () => {
                console.log('Cordova设备就绪');
                this.onDeviceReady();
            }, false);
            
            document.addEventListener('pause', () => {
                console.log('应用暂停');
                this.onAppPause();
            }, false);
            
            document.addEventListener('resume', () => {
                console.log('应用恢复');
                this.onAppResume();
            }, false);
            
            document.addEventListener('backbutton', (e) => {
                e.preventDefault();
                this.onBackButton();
            }, false);
        }
        
        // 屏幕方向变化
        window.addEventListener('orientationchange', () => {
            this.handleOrientationChange();
        });
        
        // 窗口大小变化
        window.addEventListener('resize', () => {
            this.handleResize();
        });
    }
    
    /**
     * 初始化Cordova插件
     */
    initializePlugins() {
        if (!this.isCordova) return;
        
        // 获取设备信息
        if (window.device) {
            this.deviceInfo = {
                platform: window.device.platform,
                version: window.device.version,
                model: window.device.model,
                manufacturer: window.device.manufacturer
            };
            console.log('设备信息:', this.deviceInfo);
        }
        
        // 初始化文件系统
        if (window.resolveLocalFileSystemURL) {
            this.initFileSystem();
        }
        
        // 设置状态栏
        if (window.StatusBar) {
            window.StatusBar.hide();
        }
        
        // 保持屏幕常亮
        if (window.plugins && window.plugins.insomnia) {
            window.plugins.insomnia.keepAwake();
        }
    }
    
    /**
     * 初始化文件系统
     */
    initFileSystem() {
        if (this.isAndroid) {
            // Android内部存储
            window.resolveLocalFileSystemURL(cordova.file.dataDirectory, 
                (fileSystem) => {
                    this.fileSystem = fileSystem;
                    console.log('文件系统初始化成功:', fileSystem.nativeURL);
                },
                (error) => {
                    console.error('文件系统初始化失败:', error);
                }
            );
        }
    }
    
    /**
     * 设置屏幕方向
     */
    setupScreenOrientation() {
        if (this.isCordova && window.screen && window.screen.orientation) {
            try {
                // 锁定为横屏
                window.screen.orientation.lock('landscape');
                console.log('屏幕方向已锁定为横屏');
            } catch (error) {
                console.warn('无法锁定屏幕方向:', error);
            }
        }
    }
    
    /**
     * 性能优化
     */
    optimizePerformance() {
        // 禁用选择文本
        document.body.style.webkitUserSelect = 'none';
        document.body.style.userSelect = 'none';
        
        // 禁用长按菜单
        document.body.style.webkitTouchCallout = 'none';
        
        // 优化触摸响应
        document.body.style.webkitTapHighlightColor = 'transparent';
        
        // 启用硬件加速
        document.body.style.webkitTransform = 'translateZ(0)';
        
        // 预加载关键资源
        this.preloadCriticalResources();
    }
    
    /**
     * 预加载关键资源
     */
    preloadCriticalResources() {
        // 预加载音频
        const audioFiles = [
            'game/audio/bgm.mp3',
            'game/audio/click.mp3'
        ];
        
        audioFiles.forEach(src => {
            const audio = new Audio();
            audio.preload = 'auto';
            audio.src = src;
        });
    }
    
    /**
     * 设备就绪回调
     */
    onDeviceReady() {
        console.log('移动端适配器初始化完成');
        
        // 触发自定义事件
        const event = new CustomEvent('mobileAdapterReady', {
            detail: {
                adapter: this,
                deviceInfo: this.deviceInfo
            }
        });
        document.dispatchEvent(event);
    }
    
    /**
     * 应用暂停回调
     */
    onAppPause() {
        // 暂停音频播放
        const audioElements = document.querySelectorAll('audio, video');
        audioElements.forEach(element => {
            if (!element.paused) {
                element.pause();
                element.dataset.wasPlaying = 'true';
            }
        });
    }
    
    /**
     * 应用恢复回调
     */
    onAppResume() {
        // 恢复音频播放
        const audioElements = document.querySelectorAll('audio, video');
        audioElements.forEach(element => {
            if (element.dataset.wasPlaying === 'true') {
                element.play().catch(e => console.warn('无法恢复播放:', e));
                delete element.dataset.wasPlaying;
            }
        });
    }
    
    /**
     * 返回按钮回调
     */
    onBackButton() {
        // 检查是否在游戏主界面
        if (window.gameState && window.gameState.canGoBack) {
            window.gameState.goBack();
        } else {
            // 显示退出确认对话框
            this.showExitConfirmation();
        }
    }
    
    /**
     * 显示退出确认对话框
     */
    showExitConfirmation() {
        if (confirm('确定要退出游戏吗？')) {
            if (navigator.app) {
                navigator.app.exitApp();
            } else if (navigator.device) {
                navigator.device.exitApp();
            }
        }
    }
    
    /**
     * 处理屏幕方向变化
     */
    handleOrientationChange() {
        setTimeout(() => {
            this.adjustLayout();
        }, 100);
    }
    
    /**
     * 处理窗口大小变化
     */
    handleResize() {
        this.adjustLayout();
    }
    
    /**
     * 调整布局
     */
    adjustLayout() {
        const viewport = {
            width: window.innerWidth,
            height: window.innerHeight
        };
        
        console.log('调整布局:', viewport);
        
        // 触发布局调整事件
        const event = new CustomEvent('layoutAdjust', {
            detail: viewport
        });
        document.dispatchEvent(event);
    }
    
    /**
     * 获取文件路径（移动端适配）
     */
    getFilePath(relativePath) {
        if (this.isCordova) {
            // Cordova环境下的文件路径处理
            if (relativePath.startsWith('./')) {
                return relativePath.substring(2);
            }
            return relativePath;
        }
        return relativePath;
    }
    
    /**
     * 创建优化的视频元素
     */
    createOptimizedVideo(src, options = {}) {
        const video = document.createElement('video');
        
        // 基本属性
        video.src = this.getFilePath(src);
        video.preload = options.preload || 'metadata';
        video.muted = options.muted !== false; // 默认静音
        video.loop = options.loop || false;
        video.controls = options.controls || false;
        
        // 移动端优化
        video.setAttribute('playsinline', 'true');
        video.setAttribute('webkit-playsinline', 'true');
        video.setAttribute('x5-playsinline', 'true');
        video.setAttribute('x5-video-player-type', 'h5');
        video.setAttribute('x5-video-player-fullscreen', 'false');
        
        // 错误处理
        video.addEventListener('error', (e) => {
            console.error('视频加载错误:', src, e);
        });
        
        return video;
    }
    
    /**
     * 创建优化的音频元素
     */
    createOptimizedAudio(src, options = {}) {
        const audio = document.createElement('audio');
        
        audio.src = this.getFilePath(src);
        audio.preload = options.preload || 'auto';
        audio.loop = options.loop || false;
        audio.volume = options.volume || 1.0;
        
        // 错误处理
        audio.addEventListener('error', (e) => {
            console.error('音频加载错误:', src, e);
        });
        
        return audio;
    }
    
    /**
     * 显示加载提示
     */
    showLoading(message = '加载中...') {
        const loading = document.getElementById('loading') || this.createLoadingElement();
        loading.querySelector('.loading-text').textContent = message;
        loading.style.display = 'flex';
    }
    
    /**
     * 隐藏加载提示
     */
    hideLoading() {
        const loading = document.getElementById('loading');
        if (loading) {
            loading.style.display = 'none';
        }
    }
    
    /**
     * 创建加载元素
     */
    createLoadingElement() {
        const loading = document.createElement('div');
        loading.id = 'loading';
        loading.innerHTML = `
            <div class="loading-spinner"></div>
            <div class="loading-text">加载中...</div>
        `;
        loading.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            z-index: 9999;
            color: white;
            font-size: 18px;
        `;
        
        const style = document.createElement('style');
        style.textContent = `
            .loading-spinner {
                width: 40px;
                height: 40px;
                border: 4px solid #333;
                border-top: 4px solid #fff;
                border-radius: 50%;
                animation: spin 1s linear infinite;
                margin-bottom: 20px;
            }
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        `;
        document.head.appendChild(style);
        document.body.appendChild(loading);
        
        return loading;
    }
    
    /**
     * 获取设备信息
     */
    getDeviceInfo() {
        return {
            isMobile: this.isMobile,
            isAndroid: this.isAndroid,
            isiOS: this.isiOS,
            isCordova: this.isCordova,
            deviceInfo: this.deviceInfo,
            viewport: {
                width: window.innerWidth,
                height: window.innerHeight
            }
        };
    }
}

// 创建全局实例
window.mobileAdapter = new MobileAdapter();

// 导出类（如果使用模块系统）
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MobileAdapter;
}