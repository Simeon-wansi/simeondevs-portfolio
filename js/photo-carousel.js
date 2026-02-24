/**
 * PHOTO CAROUSEL - ABOUT PAGE
 *
 * To add a new photo: drop profile-N.jpg into /images and increment PHOTO_COUNT below.
 *
 * Features:
 *  - Touch/swipe support
 *  - Pause on hover
 *  - Photo counter badge
 *  - Pause when tab is hidden
 */

// ─── UPDATE THIS when adding or removing profile photos ───────────────────────
const PHOTO_COUNT = 9;
// ──────────────────────────────────────────────────────────────────────────────

class PhotoCarousel {
    constructor(options = {}) {
        this.photoBase  = options.photoBase  || 'images/profile';
        this.photoExt   = options.photoExt   || '.jpg';
        this.rotationMs = options.rotationMs || 4000;

        this.photos       = [];
        this.currentIndex = 0;
        this.interval     = null;
        this.isPaused     = false;
        this.touchStartX  = 0;

        this.init();
    }

    init() {
        for (let i = 1; i <= PHOTO_COUNT; i++) {
            this.photos.push(`${this.photoBase}-${i}${this.photoExt}`);
        }

        if (this.photos.length === 0) return;

        this.buildDOM();
        this.startRotation();
        this.setupEvents();
    }

    buildDOM() {
        const wrapper = document.querySelector('.profile-photo-wrapper');
        if (!wrapper) return;

        // Remove the static <img class="profile-photo"> fallback
        const staticImg = wrapper.querySelector('.profile-photo');
        if (staticImg) staticImg.remove();

        /* ── Carousel container ── */
        const carousel = document.createElement('div');
        carousel.className = 'photo-carousel';

        this.photos.forEach((src, i) => {
            const img = document.createElement('img');
            img.src   = src;
            img.alt   = `Simeon Wansi, photo ${i + 1} of ${this.photos.length}`;
            img.className = 'carousel-photo' + (i === 0 ? ' active' : '');
            img.draggable = false;
            img.onerror = () => {
                img.src = 'https://ui-avatars.com/api/?name=Simeon+Wansi&size=500&background=9d4edd&color=fff&bold=true';
            };
            carousel.appendChild(img);
        });

        /* ── Progress dots ── */
        const dotsWrap = document.createElement('div');
        dotsWrap.className = 'carousel-dots';

        this.photos.forEach((_, i) => {
            const btn = document.createElement('button');
            btn.className = 'carousel-dot' + (i === 0 ? ' active' : '');
            btn.setAttribute('aria-label', `Go to photo ${i + 1}`);
            btn.onclick = () => { this.goTo(i); this.resetTimer(); };
            dotsWrap.appendChild(btn);
        });

        /* ── Navigation arrows ── */
        const prevBtn = document.createElement('button');
        prevBtn.className = 'carousel-arrow carousel-arrow-left';
        prevBtn.setAttribute('aria-label', 'Previous photo');
        prevBtn.onclick = () => this.step(-1);

        const nextBtn = document.createElement('button');
        nextBtn.className = 'carousel-arrow carousel-arrow-right';
        nextBtn.setAttribute('aria-label', 'Next photo');
        nextBtn.onclick = () => this.step(1);

        /* ── Counter badge (e.g. "3 / 9") ── */
        const counter = document.createElement('div');
        counter.className = 'carousel-counter';
        this.counter = counter;
        this.updateCounter();

        /* ── Insert everything before the profile badges ── */
        const badges = wrapper.querySelector('.profile-badges');
        wrapper.insertBefore(carousel,  badges);
        wrapper.insertBefore(dotsWrap,  badges);
        wrapper.insertBefore(prevBtn,   badges);
        wrapper.insertBefore(nextBtn,   badges);
        wrapper.insertBefore(counter,   badges);

        this.carousel = carousel;
        this.dots     = dotsWrap.querySelectorAll('.carousel-dot');
    }

    /* ── Navigation ── */

    step(dir) {
        this.goTo((this.currentIndex + dir + this.photos.length) % this.photos.length);
        this.resetTimer();
    }

    goTo(index) {
        const imgs = this.carousel.querySelectorAll('.carousel-photo');

        imgs[this.currentIndex].classList.remove('active');
        this.dots[this.currentIndex].classList.remove('active');

        this.currentIndex = index;

        imgs[this.currentIndex].classList.add('active');
        this.dots[this.currentIndex].classList.add('active');

        this.updateCounter();
    }

    updateCounter() {
        if (this.counter) {
            this.counter.textContent = `${this.currentIndex + 1} / ${this.photos.length}`;
        }
    }

    /* ── Auto-rotation ── */

    startRotation() {
        this.interval = setInterval(() => {
            if (!this.isPaused) {
                this.goTo((this.currentIndex + 1) % this.photos.length);
            }
        }, this.rotationMs);
    }

    resetTimer() {
        clearInterval(this.interval);
        this.startRotation();
    }

    /* ── Events ── */

    setupEvents() {
        const wrapper = document.querySelector('.profile-photo-wrapper');
        if (!wrapper) return;

        wrapper.addEventListener('mouseenter', () => { this.isPaused = true; });
        wrapper.addEventListener('mouseleave', () => { this.isPaused = false; });

        wrapper.addEventListener('touchstart', e => {
            this.touchStartX = e.changedTouches[0].clientX;
        }, { passive: true });

        wrapper.addEventListener('touchend', e => {
            const dx = e.changedTouches[0].clientX - this.touchStartX;
            if (Math.abs(dx) > 40) {
                this.step(dx < 0 ? 1 : -1);
            }
        }, { passive: true });

        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                clearInterval(this.interval);
            } else {
                this.startRotation();
            }
        });
    }
}

// Boot when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => new PhotoCarousel());
} else {
    new PhotoCarousel();
}
