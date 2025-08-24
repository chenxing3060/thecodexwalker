class GameController {
    constructor() {
        this.initializeGame();
    }

    async initializeGame() {
        // 直接实例化所有管理器类（传统方式）
        this.stateManager = new GameStateManager();
        this.routeManager = new RouteManager();
        this.sceneDataManager = new SceneDataManager();
        this.musicManager = new MusicManager();
        this.uiManager = new UIManager({ musicManager: this.musicManager });
        this.assetLoader = new AssetLoader();
        
        // 初始化场景播放器
        this.scenePlayer = new ScenePlayer({
            uiManager: this.uiManager,
            stateManager: this.stateManager,
            sceneDataManager: this.sceneDataManager,
            routeManager: this.routeManager,
            assetLoader: this.assetLoader
        });
        
        // 设置全局调试变量
        window.gameController = this;
        
        // 绑定UI事件
        this.uiManager.bindEvents({
            onStartGame: () => this.startGame(),
            onShowAbout: () => this.showAbout(),
            onBackToMenu: () => this.uiManager.showStartMenu(),
            onNextDialogue: () => this.scenePlayer.nextDialogue(true), // 明确是手动调用
            onSkipVideo: () => this.scenePlayer.skipVideo(),
            onToggleAutoplay: () => this.toggleAutoplay()
        });

        // 加载场景数据
        await this.sceneDataManager.loadScenes();

        // 开始加载动画
        this.startInitialLoading();
    }

    // 切换自动播放状态
    toggleAutoplay() {
        const isAutoPlay = this.stateManager.toggleAutoPlay();
        this.uiManager.updateAutoplayIndicator(isAutoPlay);
        
        // 如果刚开启自动播放，并且当前有场景，则立即触发下一句
        if (isAutoPlay && this.scenePlayer.currentScene && this.scenePlayer.currentScene.next) {
            console.log('自动播放已开启，立即播放下一场景');
            // 直接调用 onDialogueComplete 来触发自动播放逻辑
            this.scenePlayer.onDialogueComplete(this.scenePlayer.currentScene);
        }
    }

    // Method to start a new game
    startGame() {
        console.log('开始新游戏');
        this.stateManager.resetGame();
        this.stateManager.setState('ACT1');
        this.scenePlayer.playScene('dream_prologue_1_1');
    }
    
    // Placeholder for the "About" page
    showAbout() {
        console.log('显示关于页面');
        // 跳转到关于页面
        window.location.href = 'about.html';
    }

    // Logic for the initial loading animation
    startInitialLoading() {
        let progress = 0;
        const loadingStages = [
            { text: '正在初始化法典连接...', status: '现实稳定度检测中...', minProgress: 0 },
            { text: '正在同步认知参数...', status: '建立量子纠缠链路...', minProgress: 15 },
            { text: '正在加载故事原型库...', status: '扫描叙事碎片...', minProgress: 30 },
            { text: '正在构建认知圈境...', status: '符文阵列初始化中...', minProgress: 50 },
            { text: '正在校准现实锚点...', status: '蚀影体威胁评估中...', minProgress: 70 },
            { text: '正在激活万象行者协议...', status: '认知敏感度测试完成', minProgress: 85 },
            { text: '法典连接已建立', status: '系统就绪，欢迎行者', minProgress: 100 }
        ];
        let currentStage = 0;

        const updateProgress = () => {
            if (progress < 100) {
                progress += Math.random() * 8 + 2;
                if (progress > 100) progress = 100;

                if (currentStage < loadingStages.length - 1 && progress >= loadingStages[currentStage + 1].minProgress) {
                    currentStage++;
                }
                
                this.uiManager.updateLoadingAnimation(progress, loadingStages[currentStage].text, loadingStages[currentStage].status);
                setTimeout(updateProgress, 200);
            } else {
                setTimeout(() => this.finishInitialLoading(), 1500);
            }
        };
        
        setTimeout(updateProgress, 800);
    }
    
    // Logic to run after the loading animation finishes
    finishInitialLoading() {
        if (!this.sceneDataManager.scenesLoaded) {
            console.error("错误：加载动画完成，但场景数据尚未准备好！");
            this.uiManager.showLoadingError('关键数据加载失败。请检查浏览器开发者控制台获取详细错误信息，或尝试刷新页面。');
            return;
        }

        // 1. 隐藏加载进度条和状态文本
        this.uiManager.hideLoadingDetails();

        // 2. 显示“点击进入”提示
        this.uiManager.showEnterPrompt('连接已建立，点击进入法典世界');

        // 3. 将整个加载界面设为可点击区域
        const loadingScreen = this.uiManager.screens.initialLoading;
        if (loadingScreen) {
            loadingScreen.style.cursor = 'pointer'; // 将鼠标指针变为手型

            loadingScreen.addEventListener('click', () => {
                console.log("用户点击进入，开始播放音频并显示主菜单。");

                // a. 解锁音频
                this.musicManager.unmuteVideos();

                // b. 平滑过渡到主菜单
                loadingScreen.style.transition = 'opacity 0.8s ease-in-out';
                loadingScreen.style.opacity = '0';
                
                // c. 在淡出动画结束后，显示主菜单并隐藏加载界面
                setTimeout(() => {
                    // 确保加载界面被完全隐藏
                    loadingScreen.style.display = 'none';
                    loadingScreen.style.visibility = 'hidden';
                    loadingScreen.style.zIndex = '-1';
                    this.uiManager.showStartMenu();
                }, 800); // 时间应与CSS过渡时间匹配

            }, { once: true }); // 确保事件只触发一次
        }
    }
}

// 不要在这里直接实例化，等待DOM加载完成
// GameController将在DOMContentLoaded事件中实例化