/**
 * TITLE ROTATOR - 2025 Modern Hero Section
 * Smoothly rotates through job titles with 3D flip animation
 */

class TitleRotator {
    constructor(selector, options = {}) {
        this.container = document.querySelector(selector);

        if (!this.container) {
            console.warn(`TitleRotator: Container "${selector}" not found`);
            return;
        }

        this.items = this.container.querySelectorAll('.title-item');

        if (this.items.length === 0) {
            console.warn('TitleRotator: No .title-item elements found');
            return;
        }

        this.currentIndex = 0;
        this.interval = options.interval || 3000;
        this.isRunning = false;
        this.intervalId = null;

        this.init();
    }

    init() {
        // Set first item as active
        if (this.items.length > 0) {
            this.items[0].classList.add('active');
        }

        // Start rotation if more than one item
        if (this.items.length > 1) {
            this.start();
        }

        // Pause on hover
        this.container.addEventListener('mouseenter', () => this.pause());
        this.container.addEventListener('mouseleave', () => this.start());

        // Pause when tab is not visible
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.pause();
            } else {
                this.start();
            }
        });
    }

    start() {
        if (this.isRunning) return;

        this.isRunning = true;
        this.intervalId = setInterval(() => this.rotate(), this.interval);
    }

    pause() {
        if (!this.isRunning) return;

        this.isRunning = false;
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
    }

    rotate() {
        // Get current and next items
        const currentItem = this.items[this.currentIndex];
        const nextIndex = (this.currentIndex + 1) % this.items.length;
        const nextItem = this.items[nextIndex];

        // Add exit animation to current
        currentItem.classList.remove('active');
        currentItem.classList.add('exit');

        // After exit animation completes, show next item
        setTimeout(() => {
            // Remove all classes
            this.items.forEach(item => {
                item.classList.remove('active', 'exit');
            });

            // Activate next item
            nextItem.classList.add('active');

            // Update index
            this.currentIndex = nextIndex;
        }, 500); // Match CSS transition duration
    }

    destroy() {
        this.pause();
        this.container.removeEventListener('mouseenter', () => this.pause());
        this.container.removeEventListener('mouseleave', () => this.start());
    }
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTitleRotator);
} else {
    initTitleRotator();
}

function initTitleRotator() {
    // Initialize rotator with 3.5 second interval
    window.titleRotator = new TitleRotator('.rotating-text', {
        interval: 3500
    });

    console.log('✅ Title Rotator initialized');
}

// Export for potential future use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TitleRotator;
}
