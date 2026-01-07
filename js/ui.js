let UI = {
    showToast(message, duration = 2000) {
        const toast = document.getElementById('toast');
        toast.textContent = message;
        toast.classList.remove('hidden');

        setTimeout(() => {
            toast.classList.add('hidden');
        }, duration);
    },

    showAchievementPopup(achievement) {
        const popup = document.getElementById('achievement-popup');
        const nameEl = document.getElementById('popup-achievement-name');
        nameEl.textContent = achievement.name;
        popup.classList.remove('hidden');

        setTimeout(() => {
            popup.classList.add('hidden');
        }, 3000);
    },

    showConfirmDialog(message, onConfirm, onCancel) {
        if (confirm(message)) {
            onConfirm && onConfirm();
        } else {
            onCancel && onCancel();
        }
    },

    showLoading(element) {
        element.classList.add('loading');
    },

    hideLoading(element) {
        element.classList.remove('loading');
    },

    formatNumber(num) {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M';
        } else if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K';
        }
        return num.toString();
    },

    formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return mins + ':' + (secs < 10 ? '0' : '') + secs;
    },

    createParticle(x, y, emoji) {
        const particle = document.createElement('div');
        particle.textContent = emoji;
        particle.style.cssText = `
            position: fixed;
            left: ${x}px;
            top: ${y}px;
            font-size: 24px;
            pointer-events: none;
            z-index: 1000;
            animation: particleFloat 1s ease-out forwards;
        `;
        document.body.appendChild(particle);

        setTimeout(() => {
            particle.remove();
        }, 1000);
    },

    addAnimationStyles() {
        if (document.getElementById('animation-styles')) return;

        const style = document.createElement('style');
        style.id = 'animation-styles';
        style.textContent = `
            @keyframes particleFloat {
                0% { opacity: 1; transform: translateY(0) scale(1); }
                100% { opacity: 0; transform: translateY(-50px) scale(1.5); }
            }
            .loading { position: relative; overflow: hidden; }
            .loading::after {
                content: '';
                position: absolute;
                top: 0;
                left: -100%;
                width: 100%;
                height: 100%;
                background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
                animation: shimmer 1.5s infinite;
            }
            @keyframes shimmer {
                100% { left: 100%; }
            }
        `;
        document.head.appendChild(style);
    },

    init() {
        this.addAnimationStyles();
    }
};

document.addEventListener('DOMContentLoaded', function() {
    UI.init();
});