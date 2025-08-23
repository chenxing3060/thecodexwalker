// 内嵌游戏数据 - 解决APK中数据加载问题的最终方案
class EmbeddedGameData {
    static getAct1Data() {
        return [
            {
                "id": "dream_prologue_1_1",
                "type": "narration",
                "background": "game/videos/bg/bg_dream_prologue.mp4",
                "speaker": "旁白",
                "text": "纤细的女性身影静立于中，",
                "next": "dream_prologue_1_2"
            },
            {
                "id": "dream_prologue_1_2",
                "type": "narration",
                "background": "game/videos/bg/bg_dream_prologue.mp4",
                "speaker": "旁白",
                "text": "身前是从液态甲烷般的幽暗中升起的未知存在。",
                "next": "dream_prologue_1_3"
            },
            {
                "id": "dream_prologue_1_3",
                "type": "narration",
                "background": "game/videos/bg/bg_dream_prologue.mp4",
                "speaker": "旁白",
                "text": "她的双眸如星辰般闪烁，",
                "next": "dream_prologue_1_4"
            },
            {
                "id": "dream_prologue_1_4",
                "type": "narration",
                "background": "game/videos/bg/bg_dream_prologue.mp4",
                "speaker": "旁白",
                "text": "却透露着千年的疲惫。",
                "next": "dream_prologue_1_5"
            },
            {
                "id": "dream_prologue_1_5",
                "type": "narration",
                "background": "game/videos/bg/bg_dream_prologue.mp4",
                "speaker": "旁白",
                "text": "在这个超越时空的维度里，她是唯一的守望者。",
                "next": "dream_prologue_1_2_1"
            },
            {
                "id": "dream_prologue_1_2_1",
                "type": "narration",
                "background": "game/videos/bg/bg_dream_prologue.mp4",
                "speaker": "旁白",
                "text": "也是最后的希望。",
                "next": "dream_prologue_2_1"
            },
            {
                "id": "male_intro_1_1",
                "type": "dialogue",
                "background": "game/videos/cg/cg_male_intro_part1.mp4",
                "speaker": "陈星",
                "text": "转校第一天，第十二次在同一个校园里迷路……",
                "next": "male_intro_1_2"
            },
            {
                "id": "male_intro_1_2",
                "type": "dialogue",
                "background": "game/videos/cg/cg_male_intro_part1.mp4",
                "speaker": "陈星",
                "text": "果然，我的方向感已经烂到超越了人类的极限。",
                "next": "male_intro_1_3"
            },
            {
                "id": "start",
                "type": "choice",
                "background": "game/videos/bg/bg_school_day.mp4",
                "speaker": "系统",
                "text": "欢迎来到万象行者的世界。请选择你的开始：",
                "choices": [
                    {
                        "text": "开始游戏",
                        "next": "dream_prologue_1_1"
                    },
                    {
                        "text": "查看法典",
                        "next": "codex_menu"
                    }
                ]
            }
        ];
    }

    static getAct2Data() {
        return [
            {
                "id": "act2_start",
                "type": "narration",
                "background": "game/videos/bg/bg_school_night.mp4",
                "speaker": "旁白",
                "text": "第二章：觉醒的征兆",
                "next": "act2_scene_1"
            },
            {
                "id": "act2_scene_1",
                "type": "dialogue",
                "background": "game/videos/bg/bg_school_night.mp4",
                "speaker": "陈星",
                "text": "那些奇怪的梦境变得越来越清晰了……",
                "next": "start"
            }
        ];
    }

    static getAct3Data() {
        return [
            {
                "id": "act3_start",
                "type": "narration",
                "background": "game/videos/bg/bg_dimension.mp4",
                "speaker": "旁白",
                "text": "第三章：维度的裂缝",
                "next": "act3_scene_1"
            },
            {
                "id": "act3_scene_1",
                "type": "dialogue",
                "background": "game/videos/bg/bg_dimension.mp4",
                "speaker": "陈星",
                "text": "现实开始变得模糊不清……",
                "next": "start"
            }
        ];
    }

    static getAct4Data() {
        return [
            {
                "id": "act4_start",
                "type": "narration",
                "background": "game/videos/bg/bg_final.mp4",
                "speaker": "旁白",
                "text": "第四章：最终的选择",
                "next": "act4_scene_1"
            },
            {
                "id": "act4_scene_1",
                "type": "dialogue",
                "background": "game/videos/bg/bg_final.mp4",
                "speaker": "陈星",
                "text": "是时候做出最终的决定了……",
                "next": "start"
            }
        ];
    }

    static getCodexData() {
        return {
            "codex_entries": [
                {
                    "id": "codex_chenxing",
                    "title": "陈星",
                    "content": "主角，一个普通的高中转校生，却拥有着不普通的感知能力。",
                    "category": "人物"
                },
                {
                    "id": "codex_walker",
                    "title": "万象行者",
                    "content": "能够穿越不同维度和现实层面的神秘存在。",
                    "category": "概念"
                },
                {
                    "id": "codex_dimension",
                    "title": "维度裂缝",
                    "content": "现实与其他维度之间的薄弱点，是超自然现象的源头。",
                    "category": "现象"
                },
                {
                    "id": "codex_school",
                    "title": "转校经历",
                    "content": "陈星频繁转校的背后隐藏着不为人知的秘密。",
                    "category": "背景"
                }
            ]
        };
    }

    // 获取所有游戏数据
    static getAllGameData() {
        const act1 = this.getAct1Data();
        const act2 = this.getAct2Data();
        const act3 = this.getAct3Data();
        const act4 = this.getAct4Data();
        const codex = this.getCodexData();

        return {
            scenes: [].concat(act1, act2, act3, act4),
            codexEntries: codex.codex_entries
        };
    }

    // 检查数据完整性
    static validateData() {
        const data = this.getAllGameData();
        console.log('内嵌数据验证:', {
            scenesCount: data.scenes.length,
            codexEntriesCount: data.codexEntries.length,
            hasStartScene: data.scenes.some(scene => scene.id === 'start')
        });
        return data.scenes.length > 0 && data.codexEntries.length > 0;
    }
}

// 导出到全局作用域以便其他脚本使用
window.EmbeddedGameData = EmbeddedGameData;