const InputValidator = {
    USERNAME_MIN_LENGTH: 2,
    USERNAME_MAX_LENGTH: 12,

    validateUsername(username) {
        if (!username || typeof username !== 'string') {
            return false;
        }

        if (username.length < this.USERNAME_MIN_LENGTH || username.length > this.USERNAME_MAX_LENGTH) {
            return false;
        }

        const validPattern = /^[\u4e00-\u9fa5a-zA-Z0-9_]+$/;
        if (!validPattern.test(username)) {
            return false;
        }

        const dangerousChars = /[<>\"'&]/;
        if (dangerousChars.test(username)) {
            return false;
        }

        const sqlInjectionPattern = /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|UNION|EXEC|SCRIPT)\b)|(--|\/\*|\*\/|;)/i;
        if (sqlInjectionPattern.test(username)) {
            return false;
        }

        return true;
    },

    sanitizeInput(input) {
        if (!input || typeof input !== 'string') {
            return '';
        }

        return input
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#x27;')
            .replace(/\//g, '&#x2F;');
    },

    validateNumericInput(input, min = 0, max = Number.MAX_SAFE_INTEGER) {
        if (input === null || input === undefined || input === '') {
            return false;
        }

        const num = Number(input);
        if (isNaN(num)) {
            return false;
        }

        if (num < min || num > max) {
            return false;
        }

        return true;
    },

    sanitizeHTML(html) {
        const div = document.createElement('div');
        div.textContent = html;
        return div.innerHTML;
    }
};