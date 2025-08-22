// 路线管理器
class RouteManager {
    constructor() {
        this.routes = {
            route1: {
                id: 'route1',
                name: '学园祭准备',
                description: '帮助女主准备学园祭表演',
                scenes: [],
                requirements: [],
                rewards: { relationship: 10, items: ['学园祭纪念品'] },
                completed: false
            },
            route2: {
                id: 'route2', 
                name: '社团活动',
                description: '加入女主的社团，一起参加活动',
                scenes: [],
                requirements: [],
                rewards: { relationship: 15, items: ['社团徽章'] },
                completed: false
            },
            route3: {
                id: 'route3',
                name: '课业辅导',
                description: '帮助女主提高学习成绩',
                scenes: [],
                requirements: [],
                rewards: { relationship: 8, items: ['学习笔记'] },
                completed: false
            },
            route4: {
                id: 'route4',
                name: '秘密探索',
                description: '和女主一起探索学校的秘密',
                scenes: [],
                requirements: [],
                rewards: { relationship: 20, items: ['神秘钥匙'] },
                completed: false
            }
        };
        
        this.currentRoute = null;
        this.routeProgress = {};
    }

    // 获取可用路线
    getAvailableRoutes(gameData) {
        return Object.values(this.routes).filter(route => {
            // 检查路线解锁条件
            return this.checkRequirements(route.requirements, gameData);
        });
    }

    // 检查路线要求
    checkRequirements(requirements, gameData) {
        return requirements.every(req => {
            switch(req.type) {
                case 'relationship':
                    return gameData.heroineRelationship >= req.value;
                case 'flag':
                    return gameData.flags[req.flag] === req.value;
                case 'completed_route':
                    return gameData.completedRoutes.includes(req.route);
                default:
                    return true;
            }
        });
    }

    // 开始路线
    startRoute(routeId, gameData) {
        if (this.routes[routeId]) {
            this.currentRoute = routeId;
            this.routeProgress[routeId] = {
                startTime: new Date().toISOString(),
                currentScene: 0,
                choices: [],
                completed: false
            };
            return true;
        }
        return false;
    }

    // 完成路线
    completeRoute(routeId, gameData) {
        if (this.routes[routeId] && this.routeProgress[routeId]) {
            this.routes[routeId].completed = true;
            this.routeProgress[routeId].completed = true;
            this.routeProgress[routeId].endTime = new Date().toISOString();
            
            // 应用奖励
            const rewards = this.routes[routeId].rewards;
            gameData.heroineRelationship += rewards.relationship || 0;
            gameData.completedRoutes.push(routeId);
            
            return rewards;
        }
        return null;
    }

    // 获取路线进度
    getRouteProgress(routeId) {
        return this.routeProgress[routeId] || null;
    }

    // 检查是否所有路线完成
    allRoutesCompleted() {
        return Object.values(this.routes).every(route => route.completed);
    }

    // 获取最佳结局条件
    getBestEndingCondition(gameData) {
        const completedCount = gameData.completedRoutes.length;
        const relationship = gameData.heroineRelationship;
        
        if (completedCount === 4 && relationship >= 50) {
            return 'perfect_ending';
        } else if (completedCount >= 3 && relationship >= 35) {
            return 'good_ending';
        } else if (completedCount >= 2 && relationship >= 20) {
            return 'normal_ending';
        } else {
            return 'bad_ending';
        }
    }
}

// RouteManager类已定义，无需export
