class SceneDataManager {
    constructor() {
        this.scenes = [];
        this.sceneMap = new Map();
        this.codexEntries = [];
        this.codexMap = new Map();
        this.scenesLoaded = false;
        this.loadAttempts = 0;
        this.maxLoadAttempts = 3;
    }

    // 使用Cordova文件API加载数据
    async loadWithCordovaFileAPI() {
        const fileNames = ['act1.json', 'act2.json', 'act3.json', 'act4.json', 'codex.json'];
        const allData = [];

        for (const fileName of fileNames) {
            try {
                const fileURL = `${window.cordova.file.applicationDirectory}www/data/${fileName}`;
                console.log(`尝试从Cordova文件系统加载: ${fileURL}`);
                
                const fileEntry = await new Promise((resolve, reject) => {
                    window.resolveLocalFileSystemURL(fileURL, resolve, reject);
                });
                
                const file = await new Promise((resolve, reject) => {
                    fileEntry.file(resolve, reject);
                });
                
                const text = await new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onload = () => resolve(reader.result);
                    reader.onerror = reject;
                    reader.readAsText(file);
                });
                
                const data = JSON.parse(text);
                allData.push(data);
                console.log(`Cordova文件API加载成功: ${fileName}`);
            } catch (error) {
                console.error(`Cordova文件API加载失败: ${fileName}`, error);
                throw error;
            }
        }

        // 处理加载的数据
        const codexData = allData.pop(); // 最后一个是法典文件
        const chapterScenes = allData;
        
        this.scenes = [].concat(...chapterScenes);
        this.codexEntries = codexData.codex_entries;
    }

    // 使用标准fetch API加载数据
    async loadWithFetchAPI(isCordova) {
        const chapterFiles = [
            './data/act1.json',
            './data/act2.json', 
            './data/act3.json',
            './data/act4.json'
        ];
        const codexFile = './data/codex.json';

        console.log('开始使用fetch API加载游戏数据文件...');
        
        // 尝试不同的路径前缀
        const pathPrefixes = isCordova ? 
            ['./data/', 'data/', '/android_asset/www/data/', 'file:///android_asset/www/data/'] :
            ['./data/', 'data/'];
            
        let loadSuccess = false;
        let lastError = null;
        
        for (const prefix of pathPrefixes) {
            try {
                console.log(`尝试路径前缀: ${prefix}`);
                
                const cacheBuster = isCordova ? '' : `?v=${new Date().getTime()}`;
                const responses = await Promise.all([
                    ...chapterFiles.map(file => {
                        const fullPath = file.replace('./data/', prefix);
                        console.log(`正在加载: ${fullPath}`);
                        return fetch(`${fullPath}${cacheBuster}`);
                    }),
                    (() => {
                        const fullPath = codexFile.replace('./data/', prefix);
                        console.log(`正在加载: ${fullPath}`);
                        return fetch(`${fullPath}${cacheBuster}`);
                    })()
                ]);

                // 检查所有请求是否成功
                for (let i = 0; i < responses.length; i++) {
                    const response = responses[i];
                    const fileName = i < chapterFiles.length ? chapterFiles[i] : codexFile;
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status} for ${fileName}`);
                    }
                }

                // 解析所有JSON文件
                const allData = await Promise.all(responses.map(async (res, index) => {
                    const data = await res.json();
                    const fileName = index < chapterFiles.length ? chapterFiles[index] : codexFile;
                    console.log(`JSON解析成功: ${fileName}`);
                    return data;
                }));
                
                const codexData = allData.pop();
                const chapterScenes = allData;

                this.scenes = [].concat(...chapterScenes);
                this.codexEntries = codexData.codex_entries;
                
                loadSuccess = true;
                console.log(`使用路径前缀 ${prefix} 加载成功!`);
                break;
                
            } catch (error) {
                console.warn(`路径前缀 ${prefix} 加载失败:`, error);
                lastError = error;
            }
        }
        
        if (!loadSuccess) {
            throw lastError || new Error('所有路径前缀都加载失败');
        }
    }

    // 使用内嵌数据作为主要数据源
    async loadEmbeddedData() {
        console.log('使用内嵌游戏数据...');
        
        try {
            // 检查EmbeddedGameData是否可用
            if (typeof window.EmbeddedGameData === 'undefined') {
                throw new Error('EmbeddedGameData未加载');
            }
            
            // 验证数据完整性
            if (!window.EmbeddedGameData.validateData()) {
                throw new Error('内嵌数据验证失败');
            }
            
            // 获取完整的游戏数据
            const gameData = window.EmbeddedGameData.getAllGameData();
            this.scenes = gameData.scenes;
            this.codexEntries = gameData.codexEntries;
            
            console.log('内嵌数据加载完成:', {
                scenesCount: this.scenes.length,
                codexEntriesCount: this.codexEntries.length
            });
            
        } catch (error) {
            console.error('内嵌数据加载失败，使用最小数据集:', error);
            
            // 如果内嵌数据也失败，使用最小的备用数据
            this.scenes = [
                {
                    "id": "start",
                    "type": "choice",
                    "background": "game/videos/bg/bg_school_day.mp4",
                    "speaker": "系统",
                    "text": "欢迎来到万象行者的世界。数据加载遇到问题，当前使用简化版本。",
                    "choices": [
                        {
                            "text": "开始体验",
                            "next": "demo_scene"
                        }
                    ]
                },
                {
                    "id": "demo_scene",
                    "type": "dialogue",
                    "background": "game/videos/bg/bg_school_day.mp4",
                    "speaker": "陈星",
                    "text": "这是一个演示场景。完整版本包含更多精彩内容。",
                    "next": "start"
                }
            ];
            
            this.codexEntries = [
                {
                    "id": "demo_entry",
                    "title": "演示词条",
                    "content": "这是一个演示法典词条。",
                    "category": "系统"
                }
            ];
        }
    }

    // 从多个外部JSON文件加载所有章节的场景数据和法典数据
    async loadScenes() {
        if (this.scenesLoaded) {
            return;
        }

        this.loadAttempts++;
        console.log(`数据加载尝试 ${this.loadAttempts}/${this.maxLoadAttempts}`);

        try {
            // 检测运行环境
            const isCordova = window.cordova !== undefined;
            const isAndroid = window.device && window.device.platform === 'Android';
            
            console.log('运行环境详情:', {
                isCordova,
                isAndroid,
                platform: window.device ? window.device.platform : 'unknown',
                version: window.device ? window.device.version : 'unknown',
                userAgent: navigator.userAgent
            });

            // 优先使用内嵌数据，确保APK环境中的可靠性
            let loadSuccess = false;
            let lastError = null;

            // 方法1: 优先使用内嵌数据 (最可靠的方案)
            try {
                console.log('优先尝试使用内嵌数据...');
                await this.loadEmbeddedData();
                loadSuccess = true;
                console.log('内嵌数据加载成功!');
            } catch (error) {
                console.warn('内嵌数据加载失败:', error);
                lastError = error;
            }

            // 方法2: 使用Cordova文件API (如果内嵌数据失败)
            if (!loadSuccess && isCordova && window.resolveLocalFileSystemURL) {
                try {
                    console.log('尝试使用Cordova文件API加载数据...');
                    await this.loadWithCordovaFileAPI();
                    loadSuccess = true;
                    console.log('Cordova文件API加载成功!');
                } catch (error) {
                    console.warn('Cordova文件API加载失败:', error);
                    lastError = error;
                }
            }

            // 方法3: 使用标准fetch API (最后的备选方案)
            if (!loadSuccess) {
                try {
                    console.log('尝试使用标准fetch API加载数据...');
                    await this.loadWithFetchAPI(isCordova);
                    loadSuccess = true;
                    console.log('标准fetch API加载成功!');
                } catch (error) {
                    console.warn('标准fetch API加载失败:', error);
                    lastError = error;
                }
            }

            if (!loadSuccess) {
                throw lastError || new Error('所有数据加载方法都失败了');
            }

            this.buildSceneMap();
            this.buildCodexMap();
            this.scenesLoaded = true;
            console.log(`数据加载完成! 场景数量: ${this.scenes.length}, 法典词条: ${this.codexEntries.length}`);
            
        } catch (error) {
            console.error(`关键数据加载失败 (尝试 ${this.loadAttempts}/${this.maxLoadAttempts}):`, error);
            console.error("错误详情:", {
                message: error.message,
                stack: error.stack,
                isCordova: window.cordova !== undefined,
                userAgent: navigator.userAgent,
                currentURL: window.location.href,
                baseURI: document.baseURI
            });
            
            // 如果还有重试机会，等待后重试
            if (this.loadAttempts < this.maxLoadAttempts) {
                console.log(`等待2秒后重试...`);
                await new Promise(resolve => setTimeout(resolve, 2000));
                return this.loadScenes();
            }
            
            // 抛出错误以便上层处理
            throw error;
        }
    }

    // 构建一个Map以便通过ID快速查找场景
    buildSceneMap() {
        this.scenes.forEach(scene => {
            this.sceneMap.set(scene.id, scene);
        });
    }

    // 构建一个Map以便通过ID快速查找法典词条
    buildCodexMap() {
        this.codexEntries.forEach(entry => {
            this.codexMap.set(entry.id, entry);
        });
    }

    // 通过ID获取场景数据
    getSceneById(id) {
        if (!this.scenesLoaded) {
            console.error("错误：尝试在场景数据加载完成前获取场景。");
            return null;
        }
        const scene = this.sceneMap.get(id);
        if (!scene) {
            console.error(`场景未找到: ${id}`);
            return null;
        }
        return scene;
    }

    // 通过ID获取法典词条数据
    getCodexEntryById(id) {
        if (!this.scenesLoaded) {
            console.error("错误：尝试在数据加载完成前获取法典词条。");
            return null;
        }
        return this.codexMap.get(id);
    }

    // 获取所有场景（如果需要）
    getAllScenes() {
        if (!this.scenesLoaded) {
            console.error("错误：尝试在场景数据加载完成前获取所有场景。");
            return [];
        }
        return this.scenes;
    }
}

// SceneDataManager类已定义，无需export
