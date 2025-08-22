// 游戏状态管理器
class GameStateManager {
    constructor() {
        this.currentState = 'START_MENU'; // START_MENU, MALE_PERFORMANCE, MEET_HEROINE, BRANCH_SELECTION, ROUTE_1, ROUTE_2, ROUTE_3, ROUTE_4, ENDING
        this.isMusicEnabled = true; // 音乐开关状态
        this.isAutoPlay = false; // 自动播放状态
        this.gameData = {
            playerName: '',
            heroineRelationship: 0,
            completedRoutes: [],
            currentRoute: null,
            routeProgress: {},
            choices: [],
            flags: {},
            unlockedCodex: new Set() // 使用Set来存储已解锁的词条ID
        };
        this.saveSlots = 5; // 支持5个存档位
    }

    // 状态转换
    setState(newState, data = {}) {
        console.log(`状态转换: ${this.currentState} -> ${newState}`);
        this.currentState = newState;
        
        // 触发状态变化事件
        this.onStateChange(newState, data);
    }

    // 状态变化回调
    onStateChange(state, data) {
        switch(state) {
            case 'MALE_PERFORMANCE':
                this.startMalePerformance(data);
                break;
            case 'MEET_HEROINE':
                this.startHeroineEncounter(data);
                break;
            case 'BRANCH_SELECTION':
                this.showBranchSelection(data);
                break;
            case 'ROUTE_1':
            case 'ROUTE_2':
            case 'ROUTE_3':
            case 'ROUTE_4':
                this.startRoute(state, data);
                break;
            case 'ENDING':
                this.showEnding(data);
                break;
        }
    }

    // 男主演出阶段
    startMalePerformance(data) {
        // 播放男主介绍视频/对话
        console.log('开始男主演出阶段');
    }

    // 与女主相遇阶段
    startHeroineEncounter(data) {
        // 播放相遇剧情
        console.log('开始与女主相遇阶段');
    }

    // 显示支线选择
    showBranchSelection(data) {
        // 显示四条支线任务选择界面
        console.log('显示支线选择界面');
    }

    // 开始特定路线
    startRoute(routeState, data) {
        const routeNumber = routeState.split('_')[1];
        this.gameData.currentRoute = routeNumber;
        console.log(`开始路线 ${routeNumber}`);
    }

    // 显示结局
    showEnding(data) {
        console.log('显示结局');
    }

    // 重置游戏状态
    resetGame() {
        console.log('重置游戏状态');
        this.currentState = 'GAME_START';
        this.gameData = {
            playerName: '',
            heroineRelationship: 0,
            completedRoutes: [],
            currentRoute: null,
            routeProgress: {},
            choices: [],
            flags: {},
            unlockedCodex: new Set()
        };
    }

    // 保存游戏
    saveGame(slot = 1) {
        // 在保存前，将Set转换为数组，因为JSON不支持Set
        const savableGameData = {
            ...this.gameData,
            unlockedCodex: Array.from(this.gameData.unlockedCodex)
        };
        const saveData = {
            state: this.currentState,
            gameData: savableGameData,
            timestamp: new Date().toISOString()
        };
        localStorage.setItem(`game_save_${slot}`, JSON.stringify(saveData));
        return true;
    }

    // 读取游戏
    loadGame(slot = 1) {
        const saveData = localStorage.getItem(`game_save_${slot}`);
        if (saveData) {
            const data = JSON.parse(saveData);
            this.currentState = data.state;
            this.gameData = data.gameData;
            // 将存档中的数组转回Set，并兼容旧存档
            this.gameData.unlockedCodex = new Set(this.gameData.unlockedCodex || []);
            return true;
        }
        return false;
    }

    // 获取存档信息
    getSaveInfo(slot) {
        const saveData = localStorage.getItem(`game_save_${slot}`);
        if (saveData) {
            const data = JSON.parse(saveData);
            return {
                exists: true,
                timestamp: data.timestamp,
                state: data.state,
                route: data.gameData.currentRoute
            };
        }
        return { exists: false };
    }

    // 设置自动播放状态
    setAutoPlay(isOn) {
        if (typeof isOn === 'boolean' && this.isAutoPlay !== isOn) {
            this.isAutoPlay = isOn;
            console.log(`自动播放已${this.isAutoPlay ? '开启' : '关闭'}`);
        }
        return this.isAutoPlay;
    }

    // 切换自动播放状态
    toggleAutoPlay() {
        this.isAutoPlay = !this.isAutoPlay;
        console.log(`自动播放已切换为: ${this.isAutoPlay ? '开启' : '关闭'}`);
        return this.isAutoPlay;
    }

    // 解锁一个法典词条
    unlockCodexEntry(codexId) {
        if (!this.gameData.unlockedCodex.has(codexId)) {
            this.gameData.unlockedCodex.add(codexId);
            console.log(`新法典词条已解锁: ${codexId}`);
            // 在这里可以触发一个UI提示
            return true; // 返回true表示是新解锁的
        }
        return false; // 返回false表示已经解锁过了
    }

    // 检查法典词条是否已解锁
    isCodexEntryUnlocked(codexId) {
        return this.gameData.unlockedCodex.has(codexId);
    }
}

// GameStateManager类已定义，无需export
