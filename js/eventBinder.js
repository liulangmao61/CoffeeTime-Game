const EventBinder = {
    _bindings: [],

    bind(elementOrSelector, eventType, handler, useCapture = false) {
        const element = typeof elementOrSelector === 'string' ? document.querySelector(elementOrSelector) : elementOrSelector;
        if (element) {
            element.addEventListener(eventType, handler, useCapture);
            this._bindings.push({ element, eventType, handler, useCapture });
            return true;
        }
        return false;
    },

    unbindAll() {
        for (const binding of this._bindings) {
            binding.element.removeEventListener(binding.eventType, binding.handler, binding.useCapture);
        }
        this._bindings = [];
    },

    unbind(elementOrSelector, eventType, handler) {
        const element = typeof elementOrSelector === 'string' ? document.querySelector(elementOrSelector) : elementOrSelector;
        if (element) {
            element.removeEventListener(eventType, handler);
            const index = this._bindings.findIndex(b => b.element === element && b.eventType === eventType && b.handler === handler);
            if (index !== -1) {
                this._bindings.splice(index, 1);
                return true;
            }
        }
        return false;
    },

    getBindingCount() {
        return this._bindings.length;
    },

    clear() {
        this.unbindAll();
    }
};