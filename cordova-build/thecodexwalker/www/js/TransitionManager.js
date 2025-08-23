class TransitionManager {
    constructor() {
        this.overlay = document.getElementById('transition-overlay');
        if (!this.overlay) {
            console.error('未找到过渡遮罩层 (transition-overlay)。');
        }
    }

    show(type = 'fade', duration = 500) {
        return new Promise(resolve => {
            if (!this.overlay) {
                resolve();
                return;
            }
            this.overlay.className = 'transition-overlay'; // Reset classes
            this.overlay.classList.add(`${type}-transition`, 'active');
            
            setTimeout(() => {
                resolve();
            }, duration);
        });
    }

    hide(type = 'fade', duration = 500) {
        return new Promise(resolve => {
            if (!this.overlay) {
                resolve();
                return;
            }
            this.overlay.classList.remove('active');
            
            setTimeout(() => {
                this.overlay.className = 'transition-overlay'; // Clean up after transition
                resolve();
            }, duration);
        });
    }
}

// TransitionManager类已定义，无需export
