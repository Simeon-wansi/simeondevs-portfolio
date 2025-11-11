/**
 * PHOTO CAROUSEL FOR ABOUT PAGE
 * Auto-rotates through 8 profile photos
 */

class PhotoCarousel {
    constructor() {
        this.photos = [
            'images/profile-1.jpg',
            'images/profile-2.jpg',
            'images/profile-3.jpg',
            'images/profile-4.jpg',
            'images/profile-5.jpg',
            'images/profile-6.jpg',
            'images/profile-7.jpg',
            'images/profile-8.jpg'
        ];

        this.currentIndex = 0;
        this.interval = null;
        this.isPaused = false;

        this.init();
    }

    init() {
        this.createCarouselHTML();
        this.preloadImages();
        this.startRotation();
        this.setupEventListeners();
    }

    createCarouselHTML() {
        const wrapper = document.querySelector('.profile-photo-wrapper');
        if (!wrapper) return;

        // Replace existing photo with carousel
        const existingPhoto = wrapper.querySelector('.profile-photo');
        if (existingPhoto) {
            existingPhoto.remove();
        }

        // Create carousel container
        const carousel = document.createElement('div');
        carousel.className = 'photo-carousel';

        // Create photo elements
        this.photos.forEach((photo, index) => {
            const img = document.createElement('img');
            img.src = photo;
            img.alt = `Simeon Wansi - Photo ${index + 1}`;
            img.className = 'carousel-photo';
            if (index === 0) {
                img.classList.add('active');
            }
            img.onerror = () => {
                img.src = `https://ui-avatars.com/api/?name=Simeon+Wansi&size=500&background=8B5CF6&color=fff&bold=true`;
            };
            carousel.appendChild(img);
        });

        // Create progress dots
        const dotsContainer = document.createElement('div');
        dotsContainer.className = 'carousel-dots';

        this.photos.forEach((_, index) => {
            const dot = document.createElement('button');
            dot.className = 'carousel-dot';
            if (index === 0) {
                dot.classList.add('active');
            }
            dot.setAttribute('aria-label', `Go to photo ${index + 1}`);
            dot.onclick = () => this.goToPhoto(index);
            dotsContainer.appendChild(dot);
        });

        // Create navigation arrows
        const leftArrow = document.createElement('button');
        leftArrow.className = 'carousel-arrow carousel-arrow-left';
        leftArrow.setAttribute('aria-label', 'Previous photo');
        leftArrow.onclick = () => this.prevPhoto();

        const rightArrow = document.createElement('button');
        rightArrow.className = 'carousel-arrow carousel-arrow-right';
        rightArrow.setAttribute('aria-label', 'Next photo');
        rightArrow.onclick = () => this.nextPhoto();

        // Insert carousel before badges
        const badges = wrapper.querySelector('.profile-badges');
        wrapper.insertBefore(carousel, badges);
        wrapper.insertBefore(dotsContainer, badges);
        wrapper.insertBefore(leftArrow, badges);
        wrapper.insertBefore(rightArrow, badges);

        this.carousel = carousel;
        this.dots = dotsContainer.querySelectorAll('.carousel-dot');
    }

    preloadImages() {
        this.photos.forEach(photo => {
            const img = new Image();
            img.src = photo;
        });
    }

    startRotation() {
        this.interval = setInterval(() => {
            if (!this.isPaused) {
                this.autoNextPhoto();
            }
        }, 2000); // 2 seconds - more dynamic
    }

    stopRotation() {
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }
    }

    autoNextPhoto() {
        this.currentIndex = (this.currentIndex + 1) % this.photos.length;
        this.showPhoto(this.currentIndex);
    }

    nextPhoto() {
        this.currentIndex = (this.currentIndex + 1) % this.photos.length;
        this.showPhoto(this.currentIndex);

        // Reset rotation timer when manually navigated
        this.stopRotation();
        this.startRotation();
    }

    prevPhoto() {
        this.currentIndex = (this.currentIndex - 1 + this.photos.length) % this.photos.length;
        this.showPhoto(this.currentIndex);

        // Reset rotation timer when manually navigated
        this.stopRotation();
        this.startRotation();
    }

    goToPhoto(index) {
        this.currentIndex = index;
        this.showPhoto(index);

        // Reset rotation timer
        this.stopRotation();
        this.startRotation();
    }

    showPhoto(index) {
        const photos = this.carousel.querySelectorAll('.carousel-photo');

        // Remove active class from all
        photos.forEach(photo => photo.classList.remove('active'));
        this.dots.forEach(dot => dot.classList.remove('active'));

        // Add active class to current
        photos[index].classList.add('active');
        this.dots[index].classList.add('active');
    }

    setupEventListeners() {
        const wrapper = document.querySelector('.profile-photo-wrapper');
        if (!wrapper) return;

        // Pause on hover
        wrapper.addEventListener('mouseenter', () => {
            this.isPaused = true;
        });

        wrapper.addEventListener('mouseleave', () => {
            this.isPaused = false;
        });

        // Pause when tab is not visible
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.stopRotation();
            } else {
                this.startRotation();
            }
        });
    }
}

// Initialize carousel when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new PhotoCarousel();
    });
} else {
    new PhotoCarousel();
}
