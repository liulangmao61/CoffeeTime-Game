let GameState = loadOrInitGameState();

function safeAddEventListener(elementOrSelector, eventType, handler) {
    let element;
    if (typeof elementOrSelector === 'string') {
        element = document.getElementById(elementOrSelector);
    } else {
        element = elementOrSelector;
    }
    
    if (element) {
        element.addEventListener(eventType, handler);
        return true;
    }
    return false;
}

function safeQuerySelectorAll(selector) {
    return document.querySelectorAll(selector) || [];
}

let Game = {
    currentScreen: 'login',
    selectedRecipe: null,
    currentOrder: null,
    cupContents: [],
    customerTimer: null,
    orderTimer: null,
    gameLoop: null,
    lastTime: 0,
    customerSpawnTimer: null,
    orderTimerInterval: null,
    
    init() {
        this.bindEvents();
        this.loadSettings();
        this.startCustomerSpawner();
        this.startGameLoop();
    },
    
    bindEvents() {
        safeAddEventListener('login-btn', 'click', () => this.handleLogin());
        safeAddEventListener('guest-btn', 'click', () => this.handleGuestLogin());
        safeAddEventListener('username-input', 'keypress', (e) => {
            if (e.key === 'Enter') this.handleLogin();
        });
        
        safeQuerySelectorAll('.nav-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const screen = e.currentTarget.dataset.screen;
                this.switchScreen(screen);
            });
        });
        
        safeQuerySelectorAll('.back-btn').forEach(btn => {
            btn.addEventListener('click', () => this.switchScreen('main'));
        });
        
        safeAddEventListener('settings-btn', 'click', () => this.showSettings());
        safeAddEventListener('help-btn', 'click', () => this.openHelp());
        safeAddEventListener('close-settings-btn', 'click', () => this.hideSettings());
        safeAddEventListener('sound-toggle', 'change', (e) => this.toggleSound(e.target.checked));
        safeAddEventListener('bgm-toggle', 'change', (e) => this.toggleBGM(e.target.checked));
        safeAddEventListener('reset-game-btn', 'click', () => this.resetGame());
        
        safeAddEventListener('complete-btn', 'click', () => this.completeOrder());
        safeAddEventListener('clear-btn', 'click', () => this.clearCup());
        safeAddEventListener('cancel-order-btn', 'click', () => this.cancelOrder());
        
        safeQuerySelectorAll('.upgrade-tabs .tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.switchUpgradeTab(e.target.dataset.tab));
        });
        
        safeQuerySelectorAll('.decorate-tabs .tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.switchDecorateTab(e.target.dataset.tab));
        });
        
        safeAddEventListener('upgrade-shop-btn', 'click', () => this.upgradeShop());
        safeAddEventListener('save-layout-btn', 'click', () => this.saveLayout());
    },
    
    handleLogin() {
        const username = document.getElementById('username-input').value.trim();
        if (username.length < 2) {
            this.showToast('请输入至少2个字符的用户名');
            return;
        }
        GameState.user.name = username;
        this.saveGame();
        this.showMainScreen();
    },
    
    handleGuestLogin() {
        GameState.user.name = '游客';
        this.saveGame();
        this.showMainScreen();
    },
    
    showMainScreen() {
        this.switchScreen('main');
        this.updateUI();
        this.renderRecipeList();
        this.renderEquipmentList();
        this.renderEmployeeList();
        this.renderAchievementList();
        this.renderDecorationStore();
        this.renderPlacedDecorations();
    },
    
    switchScreen(screenName) {
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.add('hidden');
        });
        
        document.getElementById(screenName + '-screen').classList.remove('hidden');
        this.currentScreen = screenName;
        
        if (screenName === 'main') {
            this.updateUI();
        }
    },
    
    showSettings() {
        document.getElementById('settings-modal').classList.remove('hidden');
    },
    
    hideSettings() {
        document.getElementById('settings-modal').classList.add('hidden');
    },
    
    openHelp() {
        const helpPanel = document.getElementById('help-panel');
        if (helpPanel) {
            helpPanel.classList.remove('hidden');
            this.bindHelpNavigation();
        }
    },
    
    closeHelp() {
        const helpPanel = document.getElementById('help-panel');
        if (helpPanel) {
            helpPanel.classList.add('hidden');
        }
    },
    
    bindHelpNavigation() {
        const navItems = document.querySelectorAll('.help-nav-item');
        navItems.forEach(item => {
            item.addEventListener('click', (e) => {
                const section = e.currentTarget.dataset.section;
                this.switchHelpSection(section);
            });
        });
        
        const closeBtn = document.getElementById('close-help-btn');
        if (closeBtn) {
            closeBtn.removeEventListener('click', this.handleCloseHelp);
            closeBtn.addEventListener('click', () => this.closeHelp());
        }
        
        const overlay = document.querySelector('.help-overlay');
        if (overlay) {
            overlay.removeEventListener('click', this.handleCloseHelp);
            overlay.addEventListener('click', () => this.closeHelp());
        }
        
        document.removeEventListener('keydown', this.handleHelpKeydown);
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                const helpPanel = document.getElementById('help-panel');
                if (helpPanel && !helpPanel.classList.contains('hidden')) {
                    this.closeHelp();
                }
            }
        });
    },
    
    switchHelpSection(sectionId) {
        const navItems = document.querySelectorAll('.help-nav-item');
        const sections = document.querySelectorAll('.help-section');
        
        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.dataset.section === sectionId) {
                item.classList.add('active');
            }
        });
        
        sections.forEach(section => {
            section.classList.remove('active');
            if (section.id === 'help-' + sectionId) {
                section.classList.add('active');
            }
        });
    },
    
    toggleSound(enabled) {
        GameState.settings.sound = enabled;
        this.saveGame();
    },
    
    toggleBGM(enabled) {
        GameState.settings.bgm = enabled;
        this.saveGame();
    },
    
    loadSettings() {
        document.getElementById('sound-toggle').checked = GameState.settings.sound;
        document.getElementById('bgm-toggle').checked = GameState.settings.bgm;
    },
    
    resetGame() {
        if (confirm('确定要重置游戏吗？所有进度将会丢失！')) {
            GameStorage.clear();
            GameState = initGameState();
            this.hideSettings();
            this.switchScreen('login');
            this.showToast('游戏已重置');
        }
    },
    
    updateUI() {
        document.getElementById('user-name').textContent = GameState.user.name;
        document.getElementById('user-level').textContent = 'Lv.' + GameState.user.level;
        document.getElementById('coin-count').textContent = GameState.resources.coins;
        document.getElementById('exp-count').textContent = GameState.user.exp;
        document.getElementById('shop-level-display').textContent = 'Lv.' + GameState.shop.level;
        document.getElementById('upgrade-shop-cost').textContent = this.getShopUpgradeCost();
        
        this.updateAchievementStats();
    },
    
    getShopUpgradeCost() {
        const baseCost = 200;
        const multiplier = Math.pow(1.5, GameState.shop.level - 1);
        return Math.floor(baseCost * multiplier);
    },
    
    upgradeShop() {
        const cost = this.getShopUpgradeCost();
        if (GameState.resources.coins >= cost) {
            GameState.resources.coins -= cost;
            GameState.shop.level++;
            
            const levelData = GameData.shopUpgrades[GameState.shop.level - 1];
            if (levelData && levelData.unlockRecipes > GameState.unlockedRecipes.length) {
                const newRecipes = GameData.recipes.filter(r => 
                    r.unlockLevel <= GameState.shop.level && 
                    !GameState.unlockedRecipes.includes(r.id)
                );
                newRecipes.forEach(r => {
                    GameState.unlockedRecipes.push(r.id);
                    this.showToast('解锁新配方: ' + r.name);
                });
            }
            
            this.saveGame();
            this.updateUI();
            this.renderRecipeList();
            this.showToast('店铺升级至 Lv.' + GameState.shop.level);
        } else {
            this.showToast('金币不足');
        }
    },
    
    startCustomerSpawner() {
        const spawnCustomer = () => {
            if (this.currentScreen === 'main') {
                const customerCount = document.querySelectorAll('.customer').length;
                const maxCapacity = GameData.shopUpgrades[GameState.shop.level - 1].capacity;
                
                if (customerCount < maxCapacity) {
                    this.spawnCustomer();
                }
            }
        };
        
        this.customerSpawnTimer = setInterval(spawnCustomer, GameConfig.baseCustomerInterval);
    },
    
    spawnCustomer() {
        const customerType = GameData.customerTypes[Math.floor(Math.random() * GameData.customerTypes.length)];
        const recipe = this.getRandomUnlockedRecipe();
        
        if (!recipe) return;
        
        const customer = {
            id: Date.now(),
            type: customerType,
            order: recipe,
            patience: customerType.patience,
            maxPatience: customerType.patience
        };
        
        this.renderCustomer(customer);
        this.checkActiveOrder();
    },
    
    getRandomUnlockedRecipe() {
        const availableRecipes = GameData.recipes.filter(r => 
            GameState.unlockedRecipes.includes(r.id)
        );
        if (availableRecipes.length === 0) return null;
        return availableRecipes[Math.floor(Math.random() * availableRecipes.length)];
    },
    
    renderCustomer(customer) {
        const queue = document.getElementById('customer-queue');
        const customerEl = document.createElement('div');
        customerEl.className = 'customer';
        customerEl.id = 'customer-' + customer.id;
        
        const patiencePercent = (customer.patience / customer.maxPatience) * 100;
        let patienceClass = '';
        if (patiencePercent < 30) {
            patienceClass = 'danger';
        } else if (patiencePercent < 60) {
            patienceClass = 'warning';
        }
        
        customerEl.innerHTML = 
            '<span class="customer-avatar"><svg class="pixel-avatar"><use href="#pixel-customer-' + customer.type.id + '"></use></svg></span>' +
            '<div class="customer-patience">' +
            '<div class="patience-bar' + (patienceClass ? ' ' + patienceClass : '') + '" style="width: ' + patiencePercent + '%"></div>' +
            '</div>';
        
        customerEl.addEventListener('click', () => this.selectCustomer(customer));
        queue.appendChild(customerEl);
        
        this.startPatienceTimer(customer);
    },
    
    startPatienceTimer(customer) {
        const updatePatience = () => {
            const customerEl = document.getElementById('customer-' + customer.id);
            if (!customerEl) {
                clearInterval(customer.patienceInterval);
                return;
            }
            
            customer.patience -= 0.1;
            const patiencePercent = (customer.patience / customer.maxPatience) * 100;
            const bar = customerEl.querySelector('.patience-bar');
            bar.style.width = patiencePercent + '%';
            
            bar.classList.remove('warning', 'danger');
            if (patiencePercent < 30) {
                bar.classList.add('danger');
            } else if (patiencePercent < 60) {
                bar.classList.add('warning');
            }
            
            if (customer.patience <= 0) {
                this.customerLeave(customer, false);
            }
        };
        
        customer.patienceInterval = setInterval(updatePatience, 100);
    },
    
    selectCustomer(customer) {
        if (this.currentOrder) {
            this.showToast('请先完成当前订单');
            return;
        }
        
        this.currentOrder = customer;
        this.renderActiveOrder();
        this.removeCustomerFromQueue(customer.id);
    },
    
    renderActiveOrder() {
        const orderArea = document.getElementById('active-order');
        const noOrderMsg = document.getElementById('no-order-message');
        
        if (!this.currentOrder) {
            orderArea.classList.add('hidden');
            noOrderMsg.classList.remove('hidden');
            return;
        }
        
        orderArea.classList.remove('hidden');
        noOrderMsg.classList.add('hidden');
        document.getElementById('order-customer-type').innerHTML = '<svg class="pixel-avatar"><use href="#pixel-customer-' + this.currentOrder.type.id + '"></use></svg>';
        document.getElementById('order-coffee-name').textContent = this.currentOrder.order.name;
        
        const ingredientHint = document.getElementById('order-ingredients-hint');
        ingredientHint.innerHTML = '';
        this.currentOrder.order.ingredients.forEach(ingName => {
            const ingData = GameData.ingredients.find(i => i.name === ingName);
            if (ingData) {
                const span = document.createElement('span');
                span.textContent = ingData.icon;
                span.title = ingName;
                ingredientHint.appendChild(span);
            }
        });
        
        this.startOrderTimer();
    },
    
    cancelOrder() {
        if (this.currentOrder) {
            clearInterval(this.orderTimerInterval);
            this.customerLeave(this.currentOrder, false);
            this.currentOrder = null;
            this.renderActiveOrder();
            this.showToast('订单已取消');
        }
    },
    
    startOrderTimer() {
        let timeLeft = this.currentOrder.order.ingredients.length * 3;
        
        const updateTimer = () => {
            const timerEl = document.getElementById('order-timer');
            timerEl.textContent = timeLeft + 's';
            
            timerEl.classList.remove('warning', 'danger');
            if (timeLeft <= 5) {
                timerEl.classList.add('danger');
            } else if (timeLeft <= 10) {
                timerEl.classList.add('warning');
            }
            
            if (timeLeft <= 0) {
                clearInterval(this.orderTimerInterval);
                this.orderTimeout();
            }
            timeLeft--;
        };
        
        if (this.orderTimerInterval) {
            clearInterval(this.orderTimerInterval);
        }
        this.orderTimerInterval = setInterval(updateTimer, 1000);
        updateTimer();
    },
    
    orderTimeout() {
        this.showToast('订单超时！');
        this.orderFailed();
    },
    
    orderFailed() {
        if (this.currentOrder) {
            this.customerLeave(this.currentOrder, false);
            this.currentOrder = null;
            this.renderActiveOrder();
        }
    },
    
    customerLeave(customer, success) {
        const customerEl = document.getElementById('customer-' + customer.id);
        if (customerEl) {
            customerEl.style.transform = 'translateX(100px)';
            customerEl.style.opacity = '0';
            setTimeout(() => customerEl.remove(), 300);
        }
        
        if (customer.patienceInterval) {
            clearInterval(customer.patienceInterval);
        }
        
        if (this.currentOrder && this.currentOrder.id === customer.id) {
            this.currentOrder = null;
            this.renderActiveOrder();
        }
        
        if (!success) {
            GameState.stats.missedOrders++;
            this.saveGame();
        }
    },
    
    removeCustomerFromQueue(customerId) {
        const customerEl = document.getElementById('customer-' + customerId);
        if (customerEl) {
            customerEl.remove();
        }
    },
    
    checkActiveOrder() {
        if (!this.currentOrder && document.querySelectorAll('.customer').length > 0) {
            const firstCustomer = document.querySelector('.customer');
            if (firstCustomer) {
                firstCustomer.click();
            }
        }
    },
    
    renderRecipeList() {
        const list = document.getElementById('recipe-list');
        list.innerHTML = '';
        
        const availableRecipes = GameData.recipes.filter(r => 
            GameState.unlockedRecipes.includes(r.id)
        );
        
        availableRecipes.forEach(recipe => {
            const item = document.createElement('div');
            item.className = 'recipe-item';
            item.dataset.recipe = recipe.id;
            item.innerHTML = 
                '<span class="recipe-icon">' + recipe.icon + '</span>' +
                '<span class="recipe-name">' + recipe.name + '</span>';
            
            item.addEventListener('click', () => this.selectRecipe(recipe));
            list.appendChild(item);
        });
    },
    
    selectRecipe(recipe) {
        document.querySelectorAll('.recipe-item').forEach(item => {
            item.classList.remove('selected');
        });
        
        document.querySelector('[data-recipe="' + recipe.id + '"]').classList.add('selected');
        this.selectedRecipe = recipe;
        this.renderIngredients();
    },
    
    renderIngredients() {
        const bar = document.getElementById('ingredients-bar');
        bar.innerHTML = '';
        
        const ingredients = GameData.ingredients.slice(0, 6);
        
        ingredients.forEach(ing => {
            const item = document.createElement('div');
            item.className = 'ingredient';
            item.dataset.ingredient = ing.id;
            item.innerHTML = 
                '<span class="ingredient-icon">' + ing.icon + '</span>' +
                '<span class="ingredient-name">' + ing.name + '</span>';
            
            item.addEventListener('click', () => this.addIngredient(ing));
            bar.appendChild(item);
        });
    },
    
    addIngredient(ingredient) {
        if (!this.selectedRecipe) {
            this.showToast('请先选择配方');
            return;
        }
        
        this.cupContents.push(ingredient);
        this.renderCupContents();
        this.checkRecipeMatch();
    },
    
    renderCupContents() {
        const contents = document.getElementById('cup-contents');
        contents.innerHTML = '';
        
        this.cupContents.forEach(item => {
            const span = document.createElement('span');
            span.className = 'cup-content';
            span.textContent = item.icon;
            contents.appendChild(span);
        });
    },
    
    checkRecipeMatch() {
        if (!this.selectedRecipe) return;
        
        const completeBtn = document.getElementById('complete-btn');
        const cupIds = this.cupContents.map(c => c.id);
        const recipeIds = this.selectedRecipe.ingredients;
        
        const ingredientNameToId = {
            '咖啡豆': 'coffee',
            '水': 'water',
            '牛奶': 'milk',
            '巧克力': 'chocolate',
            '糖浆': 'syrup',
            '焦糖': 'caramel',
            '抹茶粉': 'matcha',
            '奶油': 'cream',
            '冰块': 'ice',
            '肉桂': 'cinnamon'
        };
        
        const recipeIdsConverted = recipeIds.map(name => ingredientNameToId[name] || name);
        
        const sortedCup = [...cupIds].sort();
        const sortedRecipe = [...recipeIdsConverted].sort();
        
        const isMatch = JSON.stringify(sortedCup) === JSON.stringify(sortedRecipe);
        
        completeBtn.disabled = !isMatch;
    },
    
    completeOrder() {
        if (!this.currentOrder || !this.selectedRecipe) {
            this.showToast('没有待完成的订单');
            return;
        }
        
        const cupIds = this.cupContents.map(c => c.id);
        const recipeIds = this.currentOrder.order.ingredients;
        
        const ingredientNameToId = {
            '咖啡豆': 'coffee',
            '水': 'water',
            '牛奶': 'milk',
            '巧克力': 'chocolate',
            '糖浆': 'syrup',
            '焦糖': 'caramel',
            '抹茶粉': 'matcha',
            '奶油': 'cream',
            '冰块': 'ice',
            '肉桂': 'cinnamon'
        };
        
        const recipeIdsConverted = recipeIds.map(name => ingredientNameToId[name] || name);
        
        const sortedCup = [...cupIds].sort();
        const sortedRecipe = [...recipeIdsConverted].sort();
        
        const isMatch = JSON.stringify(sortedCup) === JSON.stringify(sortedRecipe);
        
        if (!isMatch) {
            this.showToast('配方不正确');
            return;
        }
        
        clearInterval(this.orderTimerInterval);
        
        const recipe = this.currentOrder.order;
        const basePrice = recipe.price;
        const tipMultiplier = this.currentOrder.type.tipMultiplier;
        
        let finalPrice = Math.floor(basePrice * tipMultiplier);
        let earnedExp = Math.floor(basePrice / 5);
        
        if (this.currentOrder.patience / this.currentOrder.maxPatience > 0.8) {
            finalPrice = Math.floor(finalPrice * GameConfig.perfectBonus);
            earnedExp *= 2;
            GameState.stats.perfectOrders++;
            this.showToast('完美服务！');
        }
        
        const timerText = document.getElementById('order-timer').textContent;
        const secondsLeft = parseInt(timerText);
        if (this.orderTimerInterval && secondsLeft > 10) {
            GameState.stats.speedOrders++;
        }
        
        if (Math.random() < GameConfig.tipChance) {
            const tip = Math.floor(finalPrice * GameConfig.baseTipPercent);
            finalPrice += tip;
        }
        
        GameState.resources.coins += finalPrice;
        GameState.user.exp += earnedExp;
        GameState.stats.totalMade++;
        GameState.stats.totalEarned += finalPrice;
        GameState.stats.customersServed++;
        
        this.checkLevelUp();
        this.checkAchievements();
        
        this.saveGame();
        this.updateUI();
        this.clearCup();
        
        this.customerLeave(this.currentOrder, true);
        this.currentOrder = null;
        this.renderActiveOrder();
        
        this.showToast('+' + finalPrice + ' 金币, +' + earnedExp + ' 经验');
    },
    
    clearCup() {
        this.cupContents = [];
        this.renderCupContents();
        document.getElementById('complete-btn').disabled = true;
    },
    
    checkLevelUp() {
        const thresholds = GameData.levelThresholds;
        let newLevel = GameState.user.level;
        
        for (let i = thresholds.length - 1; i >= 0; i--) {
            if (GameState.user.exp >= thresholds[i].exp) {
                newLevel = i + 1;
                break;
            }
        }
        
        if (newLevel > GameState.user.level) {
            GameState.user.level = newLevel;
            GameState.shop.level = Math.min(newLevel, 10);
            
            const newRecipes = GameData.recipes.filter(r => 
                r.unlockLevel <= GameState.shop.level && 
                !GameState.unlockedRecipes.includes(r.id)
            );
            
            if (newRecipes.length > 0) {
                newRecipes.forEach(r => {
                    GameState.unlockedRecipes.push(r.id);
                });
                this.renderRecipeList();
            }
            
            this.showToast('升级至 Lv.' + newLevel + '! 解锁了新配方');
        }
    },
    
    checkAchievements() {
        GameData.achievements.forEach(achievement => {
            if (!GameState.completedAchievements.includes(achievement.id)) {
                if (achievement.condition()) {
                    GameState.completedAchievements.push(achievement.id);
                    
                    if (achievement.reward && achievement.reward.coins) {
                        GameState.resources.coins += achievement.reward.coins;
                        this.showToast('成就解锁: ' + achievement.name + ' +' + achievement.reward.coins + ' 金币');
                    }
                    
                    this.showAchievementPopup(achievement);
                    this.renderAchievementList();
                }
            }
        });
    },
    
    showAchievementPopup(achievement) {
        const popup = document.getElementById('achievement-popup');
        document.getElementById('popup-achievement-name').textContent = achievement.name;
        popup.classList.remove('hidden');
        
        setTimeout(() => {
            popup.classList.add('hidden');
        }, 3000);
    },
    
    renderEquipmentList() {
        const list = document.getElementById('equipment-list');
        list.innerHTML = '';
        
        GameData.equipment.forEach(eq => {
            const level = GameState.equipment[eq.id] || 1;
            const bonus = (level - 1) * eq.upgradeBonus;
            const cost = Math.floor(eq.upgradeCost.base * Math.pow(eq.upgradeCost.multiplier, level - 1));
            
            const item = document.createElement('div');
            item.className = 'equipment-item';
            item.innerHTML = 
                '<span class="item-icon">' + eq.icon + '</span>' +
                '<div class="item-info">' +
                '<div class="item-name">' + eq.name + '</div>' +
                '<div class="item-level">Lv.' + level + '</div>' +
                '<div class="item-bonus">效率 +' + bonus + '%</div>' +
                '</div>' +
                '<button class="btn btn-primary upgrade-item-btn"' + (GameState.resources.coins < cost ? ' disabled' : '') + '>' +
                '升级 (' + cost + ' 🪙)' +
                '</button>';
            
            item.querySelector('.upgrade-item-btn').addEventListener('click', () => this.upgradeEquipment(eq.id));
            list.appendChild(item);
        });
    },
    
    upgradeEquipment(equipmentId) {
        const equipment = GameData.equipment.find(e => e.id === equipmentId);
        const level = GameState.equipment[equipmentId] || 1;
        const cost = Math.floor(equipment.upgradeCost.base * Math.pow(equipment.upgradeCost.multiplier, level - 1));
        
        if (GameState.resources.coins >= cost) {
            GameState.resources.coins -= cost;
            GameState.equipment[equipmentId] = level + 1;
            
            this.saveGame();
            this.updateUI();
            this.renderEquipmentList();
            this.showToast(equipment.name + ' 升级至 Lv.' + (level + 1));
        } else {
            this.showToast('金币不足');
        }
    },
    
    renderEmployeeList() {
        const list = document.getElementById('employee-list');
        list.innerHTML = '';
        
        const employees = [
            { id: 'barista1', name: '实习咖啡师', icon: '👨‍🍳', bonus: 10, cost: 500 },
            { id: 'barista2', name: '专业咖啡师', icon: '👩‍🍳', bonus: 25, cost: 1500 },
            { id: 'manager', name: '咖啡店经理', icon: '👔', bonus: 50, cost: 5000 }
        ];
        
        employees.forEach(emp => {
            const owned = GameState.equipment[emp.id] || 0;
            const item = document.createElement('div');
            item.className = 'employee-item';
            item.innerHTML = 
                '<span class="item-icon">' + emp.icon + '</span>' +
                '<div class="item-info">' +
                '<div class="item-name">' + emp.name + '</div>' +
                '<div class="item-level">拥有: ' + owned + ' 名</div>' +
                '<div class="item-bonus">效率 +' + emp.bonus + '%</div>' +
                '</div>' +
                '<button class="btn btn-primary upgrade-item-btn"' + (GameState.resources.coins < emp.cost ? ' disabled' : '') + '>' +
                '雇佣 (' + emp.cost + ' 🪙)' +
                '</button>';
            
            item.querySelector('.upgrade-item-btn').addEventListener('click', () => this.hireEmployee(emp));
            list.appendChild(item);
        });
    },
    
    hireEmployee(employee) {
        if (GameState.resources.coins >= employee.cost) {
            GameState.resources.coins -= employee.cost;
            GameState.equipment[employee.id] = (GameState.equipment[employee.id] || 0) + 1;
            
            this.saveGame();
            this.updateUI();
            this.renderEmployeeList();
            this.showToast('雇佣了 ' + employee.name);
        } else {
            this.showToast('金币不足');
        }
    },
    
    switchUpgradeTab(tabName) {
        document.querySelectorAll('.upgrade-tabs .tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector('.upgrade-tabs .tab-btn[data-tab="' + tabName + '"]').classList.add('active');
        
        document.querySelectorAll('.upgrade-panel').forEach(panel => {
            panel.classList.remove('active');
        });
        document.getElementById(tabName + '-upgrade').classList.add('active');
    },
    
    switchDecorateTab(tabName) {
        document.querySelectorAll('.decorate-tabs .tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector('.decorate-tabs .tab-btn[data-tab="' + tabName + '"]').classList.add('active');
        
        this.renderDecorationStore(tabName);
    },
    
    renderDecorationStore(category) {
        category = category || 'furniture';
        const store = document.getElementById('decoration-store');
        store.innerHTML = '';
        
        const items = GameData.decorations.filter(d => d.category === category);
        
        items.forEach(deco => {
            const owned = GameState.decorations[deco.id] || 0;
            const item = document.createElement('div');
            item.className = 'decoration-item' + (owned > 0 ? ' owned' : '');
            item.dataset.decoId = deco.id;
            item.innerHTML = 
                '<span class="decoration-icon">' + deco.icon + '</span>' +
                '<span class="decoration-name">' + deco.name + '</span>' +
                (owned > 0 ? '<span class="decoration-price">已拥有</span>' : '<span class="decoration-price">' + deco.price + ' 🪙</span>');
            
            item.addEventListener('click', () => this.buyDecoration(deco));
            store.appendChild(item);
        });
    },
    
    buyDecoration(decoration) {
        if (GameState.decorations[decoration.id]) {
            this.showToast('已拥有此装饰');
            return;
        }
        
        if (GameState.resources.coins >= decoration.price) {
            GameState.resources.coins -= decoration.price;
            GameState.decorations[decoration.id] = 1;
            
            this.saveGame();
            this.updateUI();
            this.renderDecorationStore(decoration.category);
            this.showToast('购买了 ' + decoration.name);
        } else {
            this.showToast('金币不足');
        }
    },
    
    renderPlacedDecorations() {
        const preview = document.getElementById('preview-area');
        preview.innerHTML = '';
        
        Object.keys(GameState.decorations).forEach(decoId => {
            if (GameState.decorations[decoId] > 0) {
                const deco = GameData.decorations.find(d => d.id === decoId);
                if (deco) {
                    const span = document.createElement('span');
                    span.className = 'placed-item';
                    span.textContent = deco.icon;
                    preview.appendChild(span);
                }
            }
        });
    },
    
    saveLayout() {
        this.saveGame();
        this.showToast('布局已保存');
    },
    
    renderAchievementList() {
        const list = document.getElementById('achievement-list');
        list.innerHTML = '';
        
        GameData.achievements.forEach(achievement => {
            const completed = GameState.completedAchievements.includes(achievement.id);
            const item = document.createElement('div');
            item.className = 'achievement-item ' + (completed ? 'completed' : 'locked');
            item.innerHTML = 
                '<span class="achievement-icon">' + (completed ? achievement.icon : '🔒') + '</span>' +
                '<div class="achievement-info">' +
                '<div class="achievement-name">' + achievement.name + '</div>' +
                '<div class="achievement-desc">' + achievement.description + '</div>' +
                '</div>' +
                (achievement.reward ? '<span class="achievement-reward">+' + achievement.reward.coins + ' 🪙</span>' : '');
            
            list.appendChild(item);
        });
    },
    
    updateAchievementStats() {
        document.getElementById('completed-achievements').textContent = GameState.completedAchievements.length;
        document.getElementById('total-achievements').textContent = GameData.achievements.length;
    },
    
    startGameLoop() {
        const gameLoop = (timestamp) => {
            if (!this.lastTime) this.lastTime = timestamp;
            const deltaTime = timestamp - this.lastTime;
            this.lastTime = timestamp;
            
            GameState.stats.totalPlayTime += deltaTime;
            
            requestAnimationFrame(gameLoop);
        };
        
        requestAnimationFrame(gameLoop);
        
        setInterval(() => {
            this.saveGame();
        }, GameConfig.saveInterval);
    },
    
    saveGame() {
        GameStorage.save(GameState);
    },
    
    showToast(message) {
        const toast = document.getElementById('toast');
        toast.textContent = message;
        toast.classList.remove('hidden');
        
        setTimeout(() => {
            toast.classList.add('hidden');
        }, 3000);
    }
};

document.addEventListener('DOMContentLoaded', function() {
    Game.init();
    
    document.getElementById('username-input').value = '';
    document.getElementById('username-input').focus();
});
