/* home-interactions.js
 * Handles:
 *  - Animated stat counters (IntersectionObserver)
 *  - Scroll-reveal for .reveal-home elements
 */
(function () {

    /* ─── Stat counter ─────────────────────────────────────── */
    function animateCounter(el) {
        var target = parseInt(el.dataset.target, 10);
        var suffix = el.dataset.suffix || '';
        var duration = 1200;
        var startTime = null;

        function easeOutCubic(t) { return 1 - Math.pow(1 - t, 3); }

        function step(timestamp) {
            if (!startTime) startTime = timestamp;
            var elapsed = timestamp - startTime;
            var progress = Math.min(elapsed / duration, 1);
            var value = Math.round(easeOutCubic(progress) * target);
            el.textContent = value + suffix;
            if (progress < 1) requestAnimationFrame(step);
        }

        requestAnimationFrame(step);
    }

    var statObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.querySelectorAll('.stat-num[data-target]').forEach(function (el) {
                    if (!el.dataset.animated) {
                        el.dataset.animated = 'true';
                        animateCounter(el);
                    }
                });
                statObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.4 });

    /* ─── Scroll-reveal ─────────────────────────────────────── */
    var revealObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    /* ─── Init ──────────────────────────────────────────────── */
    function init() {
        var statsStrip = document.querySelector('.stats-strip');
        if (statsStrip) statObserver.observe(statsStrip);

        document.querySelectorAll('.reveal-home').forEach(function (el) {
            revealObserver.observe(el);
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
