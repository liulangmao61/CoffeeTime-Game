const GameStorage = {
    STORAGE_KEY: 'coffee_time_game',

    save(gameState) {
        try {
            const jsonString = JSON.stringify(gameState);
            const checksum = this.calculateChecksum(jsonString);
            const storageData = JSON.stringify({
                data: gameState,
                _checksum: checksum
            });
            localStorage.setItem(this.STORAGE_KEY, storageData);
            return true;
        } catch (error) {
            console.error('保存游戏数据失败:', error);
            return false;
        }
    },

    load() {
        try {
            const storageData = localStorage.getItem(this.STORAGE_KEY);
            if (storageData) {
                const parsed = JSON.parse(storageData);
                if (this.verifyChecksum(parsed)) {
                    return parsed.data;
                } else {
                    console.warn('检测到游戏数据被篡改，已重置为默认状态');
                    return null;
                }
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
    },

    calculateChecksum(data) {
        let hash = 0;
        if (data.length === 0) return hash;
        for (let i = 0; i < data.length; i++) {
            const char = data.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return hash.toString(16);
    },

    verifyChecksum(parsedData) {
        if (!parsedData || !parsedData._checksum || !parsedData.data) {
            return false;
        }
        const jsonString = JSON.stringify(parsedData.data);
        const calculatedChecksum = this.calculateChecksum(jsonString);
        return calculatedChecksum === parsedData._checksum;
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