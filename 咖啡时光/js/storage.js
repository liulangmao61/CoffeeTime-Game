const GameStorage = {
    STORAGE_KEY: 'coffee_time_game',
    
    save(gameState) {
        try {
            const data = JSON.stringify(gameState);
            localStorage.setItem(this.STORAGE_KEY, data);
            return true;
        } catch (error) {
            console.error('保存游戏数据失败:', error);
            return false;
        }
    },
    
    load() {
        try {
            const data = localStorage.getItem(this.STORAGE_KEY);
            if (data) {
                return JSON.parse(data);
            }
        } catch (error) {
            console.error('加载游戏数据失败:', error);
        }
        return null;
    },
    
    clear() {
        localStorage.removeItem(this.STORAGE_KEY);
    },
    
    exists() {
        return localStorage.getItem(this.STORAGE_KEY) !== null;
    }
};

function initGameState() {
    return {
        user: {
            name: '咖啡师',
            level: 1,
            exp: 0
        },
        resources: {
            coins: 100
        },
        shop: {
            level: 1
        },
        equipment: {
            machine_basic: 1,
            grinder: 1,
            milk_frother: 1,
            oven: 1,
            ice_machine: 1,
            display: 1
        },
        unlockedRecipes: ['espresso', 'americano'],
        completedAchievements: [],
        decorations: {},
        stats: {
            totalMade: 0,
            totalEarned: 0,
            customersServed: 0,
            perfectOrders: 0,
            speedOrders: 0,
            missedOrders: 0,
            lastLoginDate: null,
            consecutiveDays: 0,
            totalPlayTime: 0
        },
        settings: {
            sound: true,
            bgm: true
        }
    };
}

function loadOrInitGameState() {
    const savedState = GameStorage.load();
    if (savedState) {
        const mergedState = initGameState();
        Object.assign(mergedState, savedState);
        return mergedState;
    }
    return initGameState();
}
