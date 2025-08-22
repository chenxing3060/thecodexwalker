class ScenePlayer {
    constructor({ uiManager, stateManager, sceneDataManager, routeManager, assetLoader }) {
        this.uiManager = uiManager;
        this.stateManager = stateManager;
        this.sceneDataManager = sceneDataManager;
        this.routeManager = routeManager;
        this.assetLoader = assetLoader;

        this.currentScene = null;
    }

    async playScene(sceneId) {
        const scene = this.sceneDataManager.getSceneById(sceneId);
        if (!scene) {
            console.error(`无法播放场景，因为找不到ID为 "${sceneId}" 的场景。`);
            return;
        }

        const isBackgroundChanging = !this.currentScene || this.currentScene.background !== scene.background;
        const needsTransition = scene.type !== 'video' && isBackgroundChanging;

        if (needsTransition) {
            await this.uiManager.transitionManager.show('fade');
        }

        this.currentScene = scene;
        console.log('播放场景:', sceneId);

        if (scene.unlocksCodex) {
            if (this.stateManager.unlockCodexEntry(scene.unlocksCodex)) {
                const codexEntry = this.sceneDataManager.getCodexEntryById(scene.unlocksCodex);
                if (codexEntry) {
                    this.uiManager.showCodexUnlockToast(codexEntry.title);
                }
            }
        }

        this.preloadNextSceneAssets(scene);

        switch (scene.type) {
            case 'narration':
            case 'dialogue':
                {
                    this.uiManager.showScreen('game');
                    this.uiManager.setVideoBackground(scene.background); // Simplified
                    this.uiManager.updateDialogue(scene.speaker, scene.text, () => {
                        this.onDialogueComplete(scene);
                    });
                    break;
                }
            case 'choice':
                this.uiManager.showScreen('game');
                this.uiManager.setVideoBackground(scene.background);
                this.uiManager.updateDialogue(scene.speaker, scene.text);
                this.uiManager.displayChoices(scene.choices, (choice, index) => this.makeChoice(choice, index));
                break;
            case 'video':
                // In autoplay mode, the video automatically proceeds to the next scene.
                // In manual mode, the video pauses at the end, waiting for the user to click "Skip/Continue".
                const onVideoEndCallback = this.stateManager.isAutoPlay && scene.next
                    ? () => this.playScene(scene.next)
                    : null;

                this.uiManager.playFullscreenVideo(scene.video, onVideoEndCallback);
                return;
            case 'ending':
                this.uiManager.showScreen('game');
                this.uiManager.setVideoBackground(scene.background);
                this.uiManager.updateDialogue(scene.speaker, scene.text);
                break;
            case 'redirect':
                if (scene.url) {
                    window.location.href = scene.url;
                } else {
                    console.error('重定向场景缺少URL:', scene);
                }
                return;
            default:
                console.error('未知场景类型:', scene.type);
        }

        if (needsTransition) {
            this.uiManager.transitionManager.hide('fade');
        }
    }

    makeChoice(choice, index) {
        this.stateManager.gameData.choices.push({
            sceneId: this.currentScene.id,
            choiceIndex: index,
            choiceText: choice.text
        });

        if (choice.route) {
            this.startRoute(choice.route);
        } else if (choice.next) {
            this.playScene(choice.next);
        }
    }

    startRoute(routeId) {
        this.stateManager.setState(`ROUTE_${routeId.slice(-1)}`);
        this.routeManager.startRoute(routeId, this.stateManager.gameData);
        this.playScene(`${routeId}_start`);
    }

    onDialogueComplete(scene) {
        // Simplified logic
        if (this.stateManager.isAutoPlay && scene.next) {
            this.nextDialogue(false);
        } else if (scene.next) {
            this.uiManager.showIndicator();
        }
    }

    preloadNextSceneAssets(currentScene) {
        if (currentScene.next) {
            const nextScene = this.sceneDataManager.getSceneById(currentScene.next);
            this.assetLoader.preloadAssetsForScene(nextScene);
        }

        if (currentScene.choices) {
            currentScene.choices.forEach(choice => {
                if (choice.next) {
                    const choiceScene = this.sceneDataManager.getSceneById(choice.next);
                    this.assetLoader.preloadAssetsForScene(choiceScene);
                }
            });
        }
    }

    nextDialogue(isManual = true) {
        if (isManual && this.stateManager.isAutoPlay) {
            return;
        }
        if (!this.currentScene || !this.currentScene.next) {
            return;
        }

        // Simplified logic, no more waiting flag
        const delay = (this.stateManager.isAutoPlay && !isManual) ? 1500 : 0;
        setTimeout(() => {
            if (this.currentScene && this.currentScene.next) {
                this.playScene(this.currentScene.next);
            }
        }, delay);
    }

    skipVideo() {
        if (this.currentScene && this.currentScene.next) {
            this.uiManager.stopAllBackgroundVideos();
            this.playScene(this.currentScene.next);
        }
    }
}