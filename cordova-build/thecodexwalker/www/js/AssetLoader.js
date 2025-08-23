class AssetLoader {
    constructor() {
        this.videoCache = new Set();
    }

    // 预加载单个视频
    preloadVideo(src) {
        if (!src || this.videoCache.has(src)) {
            return; // 如果没有提供src或者视频已在缓存中，则不执行任何操作
        }

        console.log(`开始预加载视频: ${src}`);
        this.videoCache.add(src);

        // 在后台创建一个video元素来触发下载，但不显示它
        const video = document.createElement('video');
        video.src = src;
        video.preload = 'auto'; // 提示浏览器可以加载整个视频
        video.load(); // 启动加载过程

        video.addEventListener('loadeddata', () => {
            console.log(`视频预加载完成: ${src}`);
            // 理论上，此时视频数据已部分加载，可以更快地播放
            // 我们不需要将这个video元素添加到DOM中
        });

        video.addEventListener('error', (e) => {
            console.error(`预加载视频失败: ${src}`, e);
            this.videoCache.delete(src); // 如果加载失败，从缓存中移除
        });
    }

    // 根据场景数据预加载资源
    preloadAssetsForScene(scene) {
        if (!scene) return;

        // 预加载当前场景的背景视频
        if (scene.background && scene.background.endsWith('.mp4')) {
            this.preloadVideo(scene.background);
        }

        // 预加载全屏视频
        if (scene.type === 'video' && scene.video) {
            this.preloadVideo(scene.video);
        }
    }
}

// AssetLoader类已定义，无需export
