const TimerManager = {
    _timers: new Map(),

    register(callback, interval, tag = 'default') {
        const id = setInterval(callback, interval);
        this._timers.set(id, { tag, callback, interval });
        return id;
    },

    unregister(id) {
        if (this._timers.has(id)) {
            clearInterval(id);
            this._timers.delete(id);
            return true;
        }
        return false;
    },

    clearAll() {
        for (const [id] of this._timers) {
            clearInterval(id);
        }
        this._timers.clear();
    },

    cleanupByTag(tag) {
        for (const [id, timer] of this._timers) {
            if (timer.tag === tag) {
                clearInterval(id);
                this._timers.delete(id);
            }
        }
    },

    getTimerCount() {
        return this._timers.size;
    },

    setTimeout(callback, delay, tag = 'default') {
        const id = setTimeout(() => {
            callback();
            this._timers.delete(id);
        }, delay);
        this._timers.set(id, { tag, callback, interval: delay, isTimeout: true });
        return id;
    },

    clearTimeout(id) {
        if (this._timers.has(id)) {
            clearTimeout(id);
            this._timers.delete(id);
            return true;
        }
        return false;
    }
};