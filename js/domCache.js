const DOMCache = {
    elements: {},

    init() {
        this.elements = {
            usernameInput: document.getElementById('username-input'),
            loginBtn: document.getElementById('login-btn'),
            guestBtn: document.getElementById('guest-btn'),
            customerQueue: document.getElementById('customer-queue'),
            cupArea: document.getElementById('cup-area'),
            toast: document.getElementById('toast'),
            achievementPopup: document.getElementById('achievement-popup'),
            activeOrder: document.getElementById('active-order'),
            noOrderMessage: document.getElementById('no-order-message'),
            orderCustomerType: document.getElementById('order-customer-type'),
            orderCoffeeName: document.getElementById('order-coffee-name'),
            orderIngredientsHint: document.getElementById('order-ingredients-hint'),
            orderTimer: document.getElementById('order-timer'),
            completeBtn: document.getElementById('complete-btn'),
            clearBtn: document.getElementById('clear-btn'),
            cancelOrderBtn: document.getElementById('cancel-order-btn'),
            recipeList: document.getElementById('recipe-list'),
            ingredientsBar: document.getElementById('ingredients-bar'),
            cupContents: document.getElementById('cup-contents'),
            userName: document.getElementById('user-name'),
            userLevel: document.getElementById('user-level'),
            coinCount: document.getElementById('coin-count'),
            expCount: document.getElementById('exp-count'),
            shopLevelDisplay: document.getElementById('shop-level-display'),
            upgradeShopCost: document.getElementById('upgrade-shop-cost'),
            upgradeShopBtn: document.getElementById('upgrade-shop-btn'),
            saveLayoutBtn: document.getElementById('save-layout-btn'),
            settingsModal: document.getElementById('settings-modal'),
            soundToggle: document.getElementById('sound-toggle'),
            bgmToggle: document.getElementById('bgm-toggle'),
            resetGameBtn: document.getElementById('reset-game-btn'),
            closeSettingsBtn: document.getElementById('close-settings-btn'),
            settingsBtn: document.getElementById('settings-btn'),
            helpBtn: document.getElementById('help-btn')
        };
        return this.elements;
    },

    get(selector) {
        if (!this.elements[selector]) {
            this.elements[selector] = document.querySelector(selector);
        }
        return this.elements[selector];
    },

    getById(id) {
        if (!this.elements[id]) {
            this.elements[id] = document.getElementById(id);
        }
        return this.elements[id];
    },

    getAll(selector) {
        return document.querySelectorAll(selector);
    },

    refresh() {
        this.elements = {};
        return this.init();
    }
};