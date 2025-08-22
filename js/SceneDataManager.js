class SceneDataManager {
    constructor() {
        this.scenes = [];
        this.sceneMap = new Map();
        this.codexEntries = [];
        this.codexMap = new Map();
        this.scenesLoaded = false;
    }

    // 从多个外部JSON文件加载所有章节的场景数据和法典数据
    async loadScenes() {
        if (this.scenesLoaded) {
            return;
        }
        try {
            const chapterFiles = [
                'data/act1.json',
                'data/act2.json',
                'data/act3.json',
                'data/act4.json'
            ];
            const codexFile = 'data/codex.json';

            // 并行获取所有文件
            const cacheBuster = `?v=${new Date().getTime()}`;
            const responses = await Promise.all([
                ...chapterFiles.map(file => fetch(`${file}${cacheBuster}`)),
                fetch(`${codexFile}${cacheBuster}`)
            ]);

            // 检查所有请求是否成功
            for (const response of responses) {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status} for ${response.url}`);
                }
            }

            // 解析所有JSON文件
            const allData = await Promise.all(responses.map(res => res.json()));
            
            const codexData = allData.pop(); // 最后一个是法典文件
            const chapterScenes = allData;

            this.scenes = [].concat(...chapterScenes);
            this.codexEntries = codexData.codex_entries;

            this.buildSceneMap();
            this.buildCodexMap();
            this.scenesLoaded = true;
            console.log('所有章节和法典数据已成功加载并合并！');
        } catch (error) {
            console.error("无法加载场景或法典数据:", error);
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
