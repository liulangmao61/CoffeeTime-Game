const GameData = {
    recipes: [
        {
            id: 'espresso',
            name: '浓缩咖啡',
            icon: '☕',
            price: 15,
            ingredients: ['咖啡豆', '水'],
            unlockLevel: 1,
            description: '经典浓缩咖啡，纯粹的味道'
        },
        {
            id: 'americano',
            name: '美式咖啡',
            icon: '🥤',
            price: 20,
            ingredients: ['咖啡豆', '水', '水'],
            unlockLevel: 1,
            description: '简单清爽的美式咖啡'
        },
        {
            id: 'latte',
            name: '拿铁',
            icon: '🥛',
            price: 25,
            ingredients: ['咖啡豆', '牛奶'],
            unlockLevel: 2,
            description: '丝滑香浓的拿铁咖啡'
        },
        {
            id: 'cappuccino',
            name: '卡布奇诺',
            icon: '☕',
            price: 28,
            ingredients: ['咖啡豆', '牛奶', '牛奶'],
            unlockLevel: 3,
            description: '绵密奶泡的完美搭配'
        },
        {
            id: 'mocha',
            name: '摩卡',
            icon: '🍫',
            price: 32,
            ingredients: ['咖啡豆', '牛奶', '巧克力'],
            unlockLevel: 4,
            description: '巧克力与咖啡的浪漫邂逅'
        },
        {
            id: 'flatwhite',
            name: '澳白',
            icon: '🥤',
            price: 30,
            ingredients: ['咖啡豆', '牛奶', '糖浆'],
            unlockLevel: 5,
            description: '来自澳洲的经典咖啡'
        },
        {
            id: 'caramel',
            name: '焦糖玛奇朵',
            icon: '🍯',
            price: 35,
            ingredients: ['咖啡豆', '牛奶', '焦糖'],
            unlockLevel: 6,
            description: '甜蜜焦糖的点缀'
        },
        {
            id: 'matcha',
            name: '抹茶拿铁',
            icon: '🍵',
            price: 30,
            ingredients: ['抹茶粉', '牛奶', '糖浆'],
            unlockLevel: 7,
            description: '日式抹茶的清新风味'
        }
    ],

    ingredients: [
        { id: 'coffee', name: '咖啡豆', icon: '🫘' },
        { id: 'water', name: '水', icon: '💧' },
        { id: 'milk', name: '牛奶', icon: '🥛' },
        { id: 'chocolate', name: '巧克力', icon: '🍫' },
        { id: 'syrup', name: '糖浆', icon: '🍯' },
        { id: 'caramel', name: '焦糖', icon: '🍬' },
        { id: 'matcha', name: '抹茶粉', icon: '🍵' },
        { id: 'cream', name: '奶油', icon: '🧁' },
        { id: 'ice', name: '冰块', icon: '🧊' },
        { id: 'cinnamon', name: '肉桂', icon: '🌿' }
    ],

    customerTypes: [
        { id: 'office', name: '上班族', icon: '👔', patience: 30, tipMultiplier: 1.0 },
        { id: 'student', name: '学生', icon: '🎒', patience: 25, tipMultiplier: 0.9 },
        { id: 'lady', name: '白领', icon: '👩', patience: 35, tipMultiplier: 1.2 },
        { id: 'elder', name: '老人', icon: '👴', patience: 45, tipMultiplier: 1.1 },
        { id: 'tourist', name: '游客', icon: '🧳', patience: 30, tipMultiplier: 1.3 },
        { id: 'artist', name: '艺术家', icon: '🎨', patience: 40, tipMultiplier: 1.5 },
        { id: 'gamer', name: '玩家', icon: '🎮', patience: 20, tipMultiplier: 1.4 },
        { id: 'foodie', name: '美食家', icon: '👨‍🍳', patience: 35, tipMultiplier: 1.6 }
    ],

    achievements: [
        {
            id: 'first_coffee',
            name: '第一杯咖啡',
            description: '制作完成第一杯咖啡',
            icon: '☕',
            reward: { coins: 50 },
            condition: () => GameState.stats.totalMade >= 1
        },
        {
            id: 'coffee_master',
            name: '咖啡大师',
            description: '制作100杯咖啡',
            icon: '🏆',
            reward: { coins: 200 },
            condition: () => GameState.stats.totalMade >= 100
        },
        {
            id: 'coffee_god',
            name: '咖啡之神',
            description: '制作1000杯咖啡',
            icon: '👑',
            reward: { coins: 1000 },
            condition: () => GameState.stats.totalMade >= 1000
        },
        {
            id: 'rich_cafe',
            name: '富足咖啡馆',
            description: '拥有5000金币',
            icon: '💰',
            reward: { coins: 500 },
            condition: () => GameState.resources.coins >= 5000
        },
        {
            id: 'millionaire',
            name: '百万富翁',
            description: '累计获得100000金币',
            icon: '💎',
            reward: { coins: 2000 },
            condition: () => GameState.stats.totalEarned >= 100000
        },
        {
            id: 'happy_customers',
            name: '顾客满意',
            description: '服务500位顾客',
            icon: '😊',
            reward: { coins: 150 },
            condition: () => GameState.stats.customersServed >= 500
        },
        {
            id: 'perfect_service',
            name: '完美服务',
            description: '一单不失',
            icon: '⭐',
            reward: { coins: 300 },
            condition: () => GameState.stats.perfectOrders >= 10
        },
        {
            id: 'speed_demon',
            name: '闪电侠',
            description: '在10秒内完成制作',
            icon: '⚡',
            reward: { coins: 100 },
            condition: () => GameState.stats.speedOrders >= 1
        },
        {
            id: 'shop_owner',
            name: '店主',
            description: '店铺达到5级',
            icon: '🏪',
            reward: { coins: 500 },
            condition: () => GameState.shop.level >= 5
        },
        {
            id: 'empire',
            name: '咖啡帝国',
            description: '店铺达到10级',
            icon: '🏰',
            reward: { coins: 2000 },
            condition: () => GameState.shop.level >= 10
        },
        {
            id: 'decorator',
            name: '装饰大师',
            description: '拥有10件装饰品',
            icon: '🎨',
            reward: { coins: 300 },
            condition: () => Object.keys(GameState.decorations).length >= 10
        },
        {
            id: 'early_bird',
            name: '早起的鸟',
            description: '连续登录7天',
            icon: '🐦',
            reward: { coins: 350 },
            condition: () => GameState.stats.consecutiveDays >= 7
        }
    ],

    equipment: [
        {
            id: 'machine_basic',
            name: '基础咖啡机',
            icon: '☕',
            baseLevel: 1,
            baseBonus: 0,
            upgradeBonus: 5,
            upgradeCost: { base: 100, multiplier: 1.5 },
            description: '制作咖啡的基础设备'
        },
        {
            id: 'grinder',
            name: '磨豆机',
            icon: '⚙️',
            baseLevel: 1,
            baseBonus: 0,
            upgradeBonus: 3,
            upgradeCost: { base: 80, multiplier: 1.4 },
            description: '研磨新鲜咖啡豆'
        },
        {
            id: 'milk_frother',
            name: '奶泡机',
            icon: '🥛',
            baseLevel: 1,
            baseBonus: 0,
            upgradeBonus: 4,
            upgradeCost: { base: 120, multiplier: 1.6 },
            description: '制作绵密奶泡'
        },
        {
            id: 'oven',
            name: '烤箱',
            icon: '🔥',
            baseLevel: 1,
            baseBonus: 0,
            upgradeBonus: 3,
            upgradeCost: { base: 150, multiplier: 1.5 },
            description: '烘焙咖啡豆'
        },
        {
            id: 'ice_machine',
            name: '制冰机',
            icon: '🧊',
            baseLevel: 1,
            baseBonus: 0,
            upgradeBonus: 2,
            upgradeCost: { base: 100, multiplier: 1.4 },
            description: '制作冰块'
        },
        {
            id: 'display',
            name: '展示柜',
            icon: '🗄️',
            baseLevel: 1,
            baseBonus: 0,
            upgradeBonus: 5,
            upgradeCost: { base: 200, multiplier: 1.7 },
            description: '展示甜点吸引顾客'
        }
    ],

    decorations: [
        { id: 'plant1', name: '绿植', icon: '🪴', price: 50, category: 'plant', bonus: 1 },
        { id: 'plant2', name: '花盆', icon: '🌸', price: 80, category: 'plant', bonus: 2 },
        { id: 'plant3', name: '大树', icon: '🌳', price: 150, category: 'plant', bonus: 3 },
        { id: 'furniture1', name: '椅子', icon: '🪑', price: 100, category: 'furniture', bonus: 2 },
        { id: 'furniture2', name: '桌子', icon: '🪵', price: 120, category: 'furniture', bonus: 2 },
        { id: 'furniture3', name: '沙发', icon: '🛋️', price: 200, category: 'furniture', bonus: 3 },
        { id: 'deco1', name: '画作', icon: '🖼️', price: 150, category: 'deco', bonus: 2 },
        { id: 'deco2', name: '时钟', icon: '🕰️', price: 100, category: 'deco', bonus: 2 },
        { id: 'deco3', name: '灯饰', icon: '💡', price: 180, category: 'deco', bonus: 3 },
        { id: 'deco4', name: '音乐盒', icon: '🎵', price: 250, category: 'deco', bonus: 4 },
        { id: 'deco5', name: '书籍', icon: '📚', price: 80, category: 'deco', bonus: 1 },
        { id: 'deco6', name: '相框', icon: '🖼️', price: 120, category: 'deco', bonus: 2 }
    ],

    shopUpgrades: [
        { level: 1, capacity: 3, unlockRecipes: 2 },
        { level: 2, capacity: 4, unlockRecipes: 3 },
        { level: 3, capacity: 5, unlockRecipes: 4 },
        { level: 4, capacity: 6, unlockRecipes: 5 },
        { level: 5, capacity: 7, unlockRecipes: 6 },
        { level: 6, capacity: 8, unlockRecipes: 7 },
        { level: 7, capacity: 9, unlockRecipes: 8 },
        { level: 8, capacity: 10, unlockRecipes: 8 },
        { level: 9, capacity: 11, unlockRecipes: 8 },
        { level: 10, capacity: 12, unlockRecipes: 8 }
    ],

    levelThresholds: [
        { level: 1, exp: 0 },
        { level: 2, exp: 100 },
        { level: 3, exp: 300 },
        { level: 4, exp: 600 },
        { level: 5, exp: 1000 },
        { level: 6, exp: 1500 },
        { level: 7, exp: 2200 },
        { level: 8, exp: 3100 },
        { level: 9, exp: 4200 },
        { level: 10, exp: 5500 }
    ]
};

const GameConfig = {
    BASE_CUSTOMER_INTERVAL: 5000,
    MIN_CUSTOMER_INTERVAL: 2000,
    TIP_CHANCE: 0.3,
    BASE_TIP_PERCENT: 0.1,
    PERFECT_BONUS: 1.5,
    SPEED_BONUS: 1.2,
    SAVE_INTERVAL: 30000,
    MAX_CUSTOMERS: 6
};